# 🏗️ Architecture Documentation

## Overview

This document provides a comprehensive architectural overview of the Confidential Artifact Auction platform, focusing on the enhanced Gateway callback pattern, refund mechanisms, timeout protection, and privacy features.

---

## System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  React Frontend (TypeScript + Vite)                    │     │
│  │  ├─ FHE Client Encryption (fhevm-sdk)                 │     │
│  │  ├─ MetaMask Wallet Integration                        │     │
│  │  ├─ ethers.js (Blockchain Communication)              │     │
│  │  └─ Real-time Auction Monitoring                       │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────────────────┘
                   │ Encrypted Transactions
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN LAYER (Sepolia)                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ConfidentialArtifactAuction.sol                       │     │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │     │
│  │  ┃ State Management                                 ┃  │     │
│  │  ┃  • euint64 encrypted bids                       ┃  │     │
│  │  ┃  • Deposit tracking (depositAmount)             ┃  │     │
│  │  ┃  • Request ID mapping (auctionIdByRequestId)    ┃  │     │
│  │  ┃  • Refund tracking (hasClaimedRefund)           ┃  │     │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │     │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │     │
│  │  ┃ Core Functions                                   ┃  │     │
│  │  ┃  • placeBid() - Store encrypted bids + ETH      ┃  │     │
│  │  ┃  • endAuction() - Request Gateway decryption    ┃  │     │
│  │  ┃  • processBidResults() - Callback handler       ┃  │     │
│  │  ┃  • claimRefund() - Refund mechanism              ┃  │     │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │     │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │     │
│  │  ┃ Security Features                                ┃  │     │
│  │  ┃  • Reentrancy guards (nonReentrant)             ┃  │     │
│  │  ┃  • Input validation (length limits)             ┃  │     │
│  │  ┃  • Access control (onlyOwner, onlyAuth)         ┃  │     │
│  │  ┃  • Timeout protection (7 days)                  ┃  │     │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────────────────┘
                   │ Decryption Request
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│              GATEWAY LAYER (Zama Oracle)                         │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Gateway Decryption Service                            │     │
│  │  ├─ Asynchronous Decryption Processing                │     │
│  │  ├─ Cryptographic Signature Generation                │     │
│  │  ├─ Callback Execution                                 │     │
│  │  └─ Request Queue Management                           │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────────────────┘
                   │ Verified Results
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                   FHEVM LAYER (Zama)                             │
│  • Homomorphic Encryption Operations                            │
│  • FHE.asEuint64() - Encryption                                 │
│  • FHE.fromExternal() - Import encrypted values                 │
│  • FHE.requestDecryption() - Decryption requests                │
│  • FHE.checkSignatures() - Signature verification               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Gateway Callback Pattern

### Overview

The Gateway callback pattern is an innovative architecture that enables **asynchronous decryption** of FHE-encrypted data while maintaining security and preventing permanent fund locking.

### Key Components

#### 1. **Decryption Request**

```solidity
function _requestBidDecryption(uint32 auctionId) private {
    // Prepare encrypted bid handles for decryption
    bytes32[] memory cts = new bytes32[](bidCount);
    for (uint256 i = 0; i < bidCount; i++) {
        cts[i] = FHE.toBytes32(bidsByAuction[auctionId][bidders[i]].amount);
    }

    // Request decryption from Gateway
    uint256 requestId = FHE.requestDecryption(cts, this.processBidResults.selector);

    // Store metadata for timeout tracking
    auction.decryptionRequestId = requestId;
    auction.decryptionRequestTime = block.timestamp;
    auctionIdByRequestId[requestId] = auctionId;

    emit DecryptionRequested(auctionId, requestId, block.timestamp);
}
```

**Key Features:**
- Converts encrypted `euint64` values to `bytes32` handles
- Registers callback function selector (`processBidResults`)
- Stores request metadata for timeout protection
- Maps request ID to auction ID for callback processing

#### 2. **Gateway Processing**

The Zama Gateway oracle performs these steps:
1. Receives decryption request from blockchain
2. Decrypts FHE ciphertexts using private keys
3. Generates cryptographic signatures for verification
4. Executes callback transaction with results

#### 3. **Callback Handler**

```solidity
function processBidResults(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory signatures
) external {
    // CRITICAL: Verify Gateway signatures
    FHE.checkSignatures(requestId, cleartexts, signatures);

    // Retrieve auction from request mapping
    uint32 auctionId = auctionIdByRequestId[requestId];
    require(auctionId > 0, "Invalid request ID");

    // Decode decrypted values
    uint64[] memory decryptedBids = abi.decode(cleartexts, (uint64[]));

    // Determine winner and settle auction
    uint256 highestBid = 0;
    address winner = address(0);

    for (uint256 i = 0; i < decryptedBids.length; i++) {
        if (decryptedBids[i] > highestBid) {
            highestBid = decryptedBids[i];
            winner = auction.bidders[i];
        }
    }

    // Record results and transfer funds
    auction.highestBidder = winner;
    auction.revealedHighestBid = highestBid;
    sellerEarnings[auction.artifact.seller] += winnerDeposit;
}
```

**Security Guarantees:**
- `FHE.checkSignatures()` prevents unauthorized callback execution
- Only Gateway oracle can provide valid signatures
- Request ID mapping prevents cross-auction attacks
- State changes are atomic and final

---

## Refund Mechanism

### Design Philosophy

**Goal:** Ensure no user loses funds due to auction failures or losing bids.

### Types of Refunds

#### 1. **Loser Refunds** (Normal Settlement)

After a successful auction settles:
- Winner's deposit goes to seller
- All losing bidders can claim their deposits back

```solidity
function claimLoserRefund(uint32 auctionId) external nonReentrant {
    require(auction.isEnded, "Auction not ended");
    require(auction.highestBidder != address(0), "No winner");
    require(msg.sender != auction.highestBidder, "Winner cannot claim");

    uint256 refundAmount = bid.depositAmount;
    hasClaimedRefund[auctionId][msg.sender] = true;
    bid.depositAmount = 0;

    (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
    require(success, "Refund failed");
}
```

#### 2. **Timeout Refunds** (Failed Settlement)

If Gateway decryption times out (>7 days):
- Anyone can trigger `enableRefundsOnTimeout()`
- ALL bidders (including would-be winner) can claim refunds
- Seller receives no payment
- Platform fee retained (auction creation cost)

```solidity
function enableRefundsOnTimeout(uint32 auctionId) external {
    require(
        block.timestamp >= auction.decryptionRequestTime + DECRYPTION_TIMEOUT,
        "Timeout not reached"
    );
    require(auction.highestBidder == address(0), "Already settled");

    auction.refundsEnabled = true;
    auction.decryptionFailed = true;
}

function claimRefund(uint32 auctionId) external nonReentrant {
    require(auction.refundsEnabled, "Refunds not enabled");
    // ... refund logic ...
}
```

### Refund Flow Diagram

```
Auction Ends
     ↓
Gateway Request Sent
     ↓
   ┌─────────────────────┐
   │                     │
   ▼                     ▼
SUCCESS              TIMEOUT (7 days)
   │                     │
   ▼                     ▼
Winner Found        enableRefundsOnTimeout()
   │                     │
   ├─ Winner: Paid      └─ All Bidders:
   │                        claimRefund()
   └─ Losers:
      claimLoserRefund()
```

---

## Timeout Protection

### Problem Statement

**Challenge:** Gateway oracle failures could permanently lock user funds.

**Solution:** Automatic timeout mechanism with community-triggered refunds.

### Implementation

#### Constants

```solidity
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
uint256 public constant MAX_AUCTION_DURATION = 90 days;
```

#### Timeout Tracking

Every decryption request records:
```solidity
struct AuctionDetails {
    uint256 decryptionRequestId;    // Request identifier
    uint256 decryptionRequestTime;  // Timestamp for timeout calculation
    bool decryptionFailed;          // Failure flag
    bool refundsEnabled;            // Refund availability flag
}
```

#### Status Monitoring

Users can check timeout status in real-time:

```solidity
function getAuctionStatus(uint32 auctionId) external view returns (
    bool isActive,
    bool isEnded,
    bool decryptionRequested,
    bool decryptionTimedOut,
    bool refundsEnabled,
    uint256 timeUntilTimeout
) {
    if (decryptionRequested && auction.highestBidder == address(0)) {
        uint256 timeElapsed = block.timestamp - auction.decryptionRequestTime;
        decryptionTimedOut = timeElapsed >= DECRYPTION_TIMEOUT;
        timeUntilTimeout = decryptionTimedOut ? 0 : DECRYPTION_TIMEOUT - timeElapsed;
    }
}
```

### Timeout Timeline

```
Day 0: Auction ends → Gateway request sent
Day 1-6: Normal processing window
Day 7+: Timeout threshold reached
        └─ enableRefundsOnTimeout() becomes callable
           └─ All bidders can claim full refunds
```

---

## Privacy Enhancements

### 1. Price Obfuscation

**Problem:** Exposing exact minimum bid prices can leak market information.

**Solution:** Generate random multiplier per auction.

```solidity
// Generation (at auction creation)
uint256 obfuscationSeed = uint256(keccak256(abi.encodePacked(
    block.timestamp,
    block.prevrandao,
    msg.sender,
    currentAuctionId
)));

// Retrieval (obfuscated)
function getObfuscatedPrice(uint32 auctionId) external view returns (uint256) {
    uint256 multiplier = 100 + (auction.priceObfuscationSeed % 100); // 1.0x - 2.0x
    return (auction.minimumBid * multiplier) / 100;
}
```

**Benefits:**
- Prevents price pattern analysis
- Maintains privacy of seller's reserve price
- Deterministic per auction (not per query)
- No impact on actual bidding

### 2. Division Privacy Protection

**Problem:** FHE division can leak information through quotients.

**Solution:** Use multiplication-based comparisons instead.

```solidity
// Instead of: bid1 / price > bid2 / price
// Use: bid1 * commonFactor > bid2 * commonFactor

// Implemented via FHE.gt() on encrypted values
ebool isHigher = FHE.gt(encryptedBid1, encryptedBid2);
```

---

## Security Architecture

### Defense in Depth

#### Layer 1: Input Validation

```solidity
require(bytes(_name).length <= 200, "Name too long");
require(bytes(_description).length <= 1000, "Description too long");
require(_auctionDuration <= MAX_AUCTION_DURATION, "Duration exceeds max");
require(bidCount <= MAX_BIDDERS_PER_BATCH, "Too many bidders");
```

#### Layer 2: Access Control

```solidity
modifier onlyOwner() { /* ... */ }
modifier onlyAuthenticator() { /* ... */ }
modifier auctionActive(uint32 auctionId) { /* ... */ }
```

#### Layer 3: Reentrancy Protection

```solidity
modifier nonReentrant() {
    require(_status != _ENTERED, "Reentrancy detected");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}

// Applied to all withdrawal functions
function claimRefund() external nonReentrant { /* ... */ }
function withdrawEarnings() external nonReentrant { /* ... */ }
```

#### Layer 4: Safe Transfer Pattern

```solidity
// ✅ Correct: State changes BEFORE external calls
hasClaimedRefund[auctionId][msg.sender] = true;
bid.depositAmount = 0;

(bool success, ) = payable(msg.sender).call{value: refundAmount}("");
require(success, "Transfer failed");
```

#### Layer 5: Cryptographic Verification

```solidity
// Gateway callback verification
FHE.checkSignatures(requestId, cleartexts, signatures);
```

---

## Gas Optimization

### Strategies Implemented

#### 1. Batch Size Limits

```solidity
uint256 public constant MAX_BIDDERS_PER_BATCH = 50;

require(bidCount <= MAX_BIDDERS_PER_BATCH, "Too many bidders");
```

**Benefit:** Prevents out-of-gas errors during decryption requests.

#### 2. Storage Optimization

```solidity
// Pack related data into single storage slot
struct EncryptedBid {
    euint64 amount;        // Encrypted value
    bool isActive;         // 1 byte
    uint256 timestamp;     // 32 bytes
    uint256 depositAmount; // 32 bytes
}
```

#### 3. Array Resizing

```solidity
// Dynamic array sizing to avoid empty slots
uint32[] memory activeIds = new uint32[](currentAuctionId);
// ... populate ...
uint32[] memory result = new uint32[](count); // Resize to actual count
```

#### 4. Efficient Mappings

```solidity
mapping(uint256 => uint32) internal auctionIdByRequestId; // O(1) lookup
mapping(uint32 => mapping(address => bool)) public hasClaimedRefund; // Nested for gas efficiency
```

---

## HCU (Homomorphic Computation Units)

### FHE Operation Costs

| Operation | HCU Cost | Use Case |
|-----------|----------|----------|
| `FHE.asEuint64()` | Low | Initial encryption |
| `FHE.fromExternal()` | Medium | Import external encrypted values |
| `FHE.allowThis()` | Low | Set contract permissions |
| `FHE.allow()` | Low | Set user permissions |
| `FHE.toBytes32()` | Low | Prepare for decryption |
| `FHE.requestDecryption()` | High | Gateway request |
| `FHE.checkSignatures()` | Medium | Verify callback |

### Optimization Example

```solidity
// ❌ Inefficient: Multiple encryption operations
for (uint i = 0; i < bids.length; i++) {
    euint64 bid = FHE.asEuint64(bids[i]);
    FHE.allowThis(bid);
    FHE.allow(bid, msg.sender);
}

// ✅ Efficient: Single operation per bid
euint64 encryptedBid = FHE.fromExternal(encryptedBidAmount, inputProof);
FHE.allowThis(encryptedBid);
FHE.allow(encryptedBid, msg.sender);
```

---

## Usage Examples

### Example 1: Complete Auction Flow

```javascript
// 1. Create auction
const tx1 = await auction.createAuction(
  "Ancient Vase",
  "Roman artifact from 100 BC",
  "ceramic",
  ethers.parseEther("1.0"), // 1 ETH minimum
  86400 * 7, // 7 days
  -100,
  "Excavated in Pompeii"
);

// 2. Authenticate
await auction.connect(authenticator).authenticateArtifact(auctionId);

// 3. Place encrypted bid
const bidAmount = 1500000000n; // 1.5 ETH
const { encryptedBid, proof } = await fheClient.encrypt(bidAmount);
await auction.connect(bidder).placeBid(auctionId, encryptedBid, proof, {
  value: ethers.parseEther("1.5")
});

// 4. End auction (after duration)
await auction.endAuction(auctionId);

// 5. Wait for Gateway callback (automatic)

// 6. Loser claims refund
await auction.connect(loser).claimLoserRefund(auctionId);
```

### Example 2: Timeout Handling

```javascript
// Check auction status
const status = await auction.getAuctionStatus(auctionId);

if (status.decryptionTimedOut) {
  // Enable refunds (anyone can call)
  await auction.enableRefundsOnTimeout(auctionId);

  // All bidders claim refunds
  await auction.connect(bidder1).claimRefund(auctionId);
  await auction.connect(bidder2).claimRefund(auctionId);
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Audit all timeout constants
- [ ] Verify Gateway endpoint configuration
- [ ] Test refund mechanisms on testnet
- [ ] Verify batch size limits
- [ ] Review access control permissions

### Post-Deployment

- [ ] Monitor Gateway response times
- [ ] Track timeout occurrences
- [ ] Analyze gas usage patterns
- [ ] Verify refund claim rates
- [ ] Monitor HCU consumption

---

## Future Enhancements

### v1.1 Planned Features

1. **Batch Auction Processing**
   - Support >50 bidders via multiple Gateway requests
   - Paginated result processing

2. **Multi-Signature Controls**
   - Require multiple authenticators for high-value items
   - Tiered authentication based on value

3. **Enhanced Privacy**
   - Bid increment obfuscation
   - Time-based privacy decay

4. **Gas Optimizations**
   - Storage layout improvements
   - Calldata compression

---

## References

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Gateway Callback Pattern](https://docs.zama.ai/fhevm/fundamentals/decryption)
- [Solidity Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**Last Updated:** 2025-11-24
**Version:** 1.0.0
**License:** MIT
