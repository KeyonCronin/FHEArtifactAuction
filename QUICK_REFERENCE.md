# 🚀 Quick Reference Guide

Fast lookup for the most common operations and concepts.

---

## Core Concepts at a Glance

### Gateway Callback Pattern
```
User Action → Contract Store → Gateway Request → Callback Execution → Settlement
```

### Three Types of Refunds
| Type | When | Who Calls | Condition |
|------|------|-----------|-----------|
| **Loser** | After success | Loser | Lost auction, winner set |
| **Timeout** | After 7 days | Any bidder | Gateway failed, no winner |
| **Failed** | Auction fails | Any bidder | `refundsEnabled = true` |

### FHE Security Layers
1. **Encryption** - Client-side FHE (`placeBid`)
2. **Storage** - `euint64` encrypted on-chain
3. **Comparison** - FHE operations don't reveal values
4. **Decryption** - Gateway with signature verification
5. **Settlement** - Only winner revealed

---

## Essential Functions

### For Sellers
```solidity
// 1. Create auction
createAuction(name, description, category, minBid, duration, year, provenance)
  returns: auctionId

// 2. Withdraw earnings
withdrawEarnings()
```

### For Bidders
```solidity
// 1. Check auction
getAuctionInfo(auctionId)
getAuctionStatus(auctionId)

// 2. Place bid
placeBid(auctionId, encryptedBid, proof) payable

// 3. Claim refund
claimLoserRefund(auctionId)        // After success
claimRefund(auctionId)              // After timeout
canClaimRefund(auctionId, user)     // Check eligibility
```

### For Authenticators
```solidity
// Verify artifact
authenticateArtifact(auctionId)
```

### For Monitoring
```solidity
// Check status
getAuctionStatus(auctionId)           // Complete status
getAuctionResults(auctionId)          // Final results
getBidDetails(auctionId, bidder)      // Bid info
getObfuscatedPrice(auctionId)         // Privacy-protected price
```

---

## Quick Integration Example

```javascript
// 1. Setup
const provider = ethers.getDefaultProvider('sepolia');
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(address, abi, signer);
const fheClient = await createFhevmClient({ provider });

// 2. Create Auction
const tx1 = await contract.createAuction(
  "Artifact Name",
  "Description",
  "category",
  ethers.parseEther("1.0"),
  86400 * 7,
  2024,
  "provenance"
);

// 3. Authenticate
const authenticatorContract = contract.connect(authenticator);
await authenticatorContract.authenticateArtifact(auctionId);

// 4. Place Bid
const { ciphertext, proof } = await fheClient.encrypt64(
  BigInt(ethers.parseEther("1.5"))
);
const tx2 = await contract.placeBid(auctionId, ciphertext, proof, {
  value: ethers.parseEther("1.5")
});

// 5. End Auction
await contract.endAuction(auctionId);

// 6. Wait for Gateway (automatic)

// 7. Claim Refund
await contract.claimLoserRefund(auctionId);
```

---

## Event Monitoring

```javascript
// Listen for auction creation
contract.on("AuctionCreated", (auctionId, name) => {
  console.log(`New auction: ${name}`);
});

// Listen for bids
contract.on("ConfidentialBidPlaced", (auctionId, bidder) => {
  console.log(`Bid placed on auction ${auctionId}`);
});

// Listen for settlement
contract.on("AuctionEnded", (auctionId, winner, bid) => {
  console.log(`Auction ${auctionId} won by ${winner}`);
});

// Listen for refunds
contract.on("RefundIssued", (auctionId, bidder, amount) => {
  console.log(`Refund issued to ${bidder}: ${ethers.formatEther(amount)} ETH`);
});
```

---

## Common Errors & Solutions

### "Artifact not authenticated"
**Cause:** Trying to bid before artifact is verified
**Solution:** Wait for authenticator to call `authenticateAuction()`

### "Auction not active"
**Cause:** Auction duration expired
**Solution:** Create new auction or wait for new one

### "Reentrancy detected"
**Cause:** Recursive call to withdrawal function
**Solution:** No action needed (protection is working)

### "Bid below minimum"
**Cause:** Bid amount < minimumBid
**Solution:** Increase bid amount

### "Insufficient balance"
**Cause:** Not enough ETH for bid + gas
**Solution:** Add more ETH to wallet

### "Already claimed refund"
**Cause:** User already claimed in this auction
**Solution:** Can't claim twice per auction

### "Refunds not enabled"
**Cause:** Trying to claim before timeout OR success
**Solution:** Wait for Gateway settlement or timeout

---

## Timeout Timeline

```
Day 0:  Auction ends → endAuction() called
        → FHE.requestDecryption() sent to Gateway
        → DecryptionRequested event emitted

Day 1-6: Normal processing window
        → Gateway processes decryption
        → processBidResults() callback expected

Day 7:  Timeout reached
        → enableRefundsOnTimeout() becomes callable
        → Anyone can trigger it
        → All bidders can claim refunds
```

---

## Gas Cost Reference

| Operation | Approx Gas |
|-----------|-----------|
| createAuction | 250k |
| authenticateArtifact | 80k |
| placeBid | 180k |
| endAuction | 350k |
| claimLoserRefund | 100k |
| claimRefund (timeout) | 100k |
| withdrawEarnings | 80k |

---

## Constants to Know

```solidity
DECRYPTION_TIMEOUT = 7 days      // Gateway timeout
MAX_AUCTION_DURATION = 90 days   // Maximum auction length
MAX_BIDDERS_PER_BATCH = 50       // Batch processing limit
```

---

## Privacy Features Summary

### 🔐 Bid Privacy
- **During Auction:** Nobody knows other bids
- **After Success:** Winner and amount revealed, losers stay private
- **After Timeout:** All bids refunded, no disclosure

### 💰 Price Privacy
- **Obfuscation:** Minimum bid has 1.0x - 2.0x random multiplier
- **Protection:** Prevents price pattern analysis
- **Function:** `getObfuscatedPrice()` returns obfuscated value

### 🤐 FHE Guarantees
- Bids encrypted client-side (never plaintext on-chain)
- Comparisons done on encrypted values
- No information leakage during computation

---

## Audit Checklist

- [ ] Read ARCHITECTURE.md
- [ ] Review contract code
- [ ] Understand Gateway callback flow
- [ ] Verify timeout mechanism
- [ ] Check refund paths
- [ ] Review security measures
- [ ] Test on Sepolia
- [ ] Run integration tests

---

## Deployment Checklist

- [ ] Contracts compiled and tested
- [ ] Environment variables configured
- [ ] Sepolia testnet ETH available
- [ ] Gas prices checked
- [ ] Addresses for authenticators configured
- [ ] Events monitoring setup
- [ ] Refund mechanism tested
- [ ] Timeout handling verified

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `ConfidentialArtifactAuction.sol` | Main smart contract |
| `README.md` | Project overview & features |
| `ARCHITECTURE.md` | Technical deep dive |
| `USAGE_EXAMPLES.md` | Code examples |
| `IMPLEMENTATION_SUMMARY.md` | What was built |
| `QUICK_REFERENCE.md` | This file |
| `SECURITY.md` | Security features |

---

## Support Resources

### Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete technical overview
- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - Practical code examples
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature details

### External Resources
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Etherscan](https://sepolia.etherscan.io)

---

## Troubleshooting Flow

```
Problem occurs
  ↓
Check error message
  ↓
┌─────────────────────────────────────┐
│ Does error match "Common Errors"?   │
└────┬────────────────────────┬───────┘
     YES                       NO
     ↓                         ↓
Apply solution          Check ARCHITECTURE.md
     ↓                         ↓
Problem solved?         Problem solved?
     ↓                         ↓
    YES                       NO
     ↓                         ↓
   Done        Check USAGE_EXAMPLES.md
                     ↓
              Problem solved?
                     ↓
                    YES
                     ↓
                   Done
```

---

## Success Indicators

✅ **Contract deployed** - Address in Etherscan
✅ **Auction created** - AuctionCreated event emitted
✅ **Bids placed** - ConfidentialBidPlaced events received
✅ **Auction ended** - DecryptionRequested event shows request ID
✅ **Results received** - AuctionEnded event with winner
✅ **Refunds working** - RefundIssued events confirm transfers
✅ **Timeout tested** - Successfully claimed timeout refunds after 7 days

---

**Version:** 1.0.0
**Last Updated:** 2025-11-24
**License:** MIT
