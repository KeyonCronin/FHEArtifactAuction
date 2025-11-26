# 📖 Usage Examples

Complete code examples for interacting with the Confidential Artifact Auction platform.

---

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Creating Auctions](#creating-auctions)
3. [Placing Encrypted Bids](#placing-encrypted-bids)
4. [Handling Auction Results](#handling-auction-results)
5. [Refund Scenarios](#refund-scenarios)
6. [Advanced Features](#advanced-features)

---

## Basic Setup

### Environment Configuration

```bash
# .env file
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x7070e99539Ba0B0212CD3aC243033CA37eB07849
```

### Contract Initialization

```javascript
import { ethers } from "ethers";
import { createFhevmClient } from "fhevm";

// Connect to blockchain
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load contract
const contractABI = [...]; // Import from artifacts
const auction = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// Initialize FHE client
const fheClient = await createFhevmClient({
  provider,
  network: "sepolia"
});
```

---

## Creating Auctions

### Example 1: Standard Auction

```javascript
async function createStandardAuction() {
  try {
    const tx = await auction.createAuction(
      "Roman Gold Coin",                    // Artifact name
      "Aureus from Emperor Nero's reign",   // Description
      "coin",                               // Category
      ethers.parseEther("2.0"),             // 2 ETH minimum bid
      86400 * 7,                            // 7 days duration
      64,                                   // Year 64 AD
      "Found in London excavation 2020"    // Provenance
    );

    const receipt = await tx.wait();
    const auctionId = receipt.events.find(e => e.event === "AuctionCreated").args.auctionId;

    console.log(`✅ Auction created with ID: ${auctionId}`);
    return auctionId;
  } catch (error) {
    console.error("❌ Failed to create auction:", error.message);
  }
}
```

### Example 2: High-Value Auction with Extended Duration

```javascript
async function createHighValueAuction() {
  const tx = await auction.createAuction(
    "Leonardo da Vinci Sketch",
    "Authenticated preliminary study for La Gioconda",
    "drawing",
    ethers.parseEther("100.0"),      // 100 ETH minimum
    86400 * 30,                       // 30 days duration
    1503,
    "Christie's provenance documentation included"
  );

  await tx.wait();
  console.log("✅ High-value auction created");
}
```

### Example 3: Short-Duration Auction

```javascript
async function createQuickAuction() {
  const tx = await auction.createAuction(
    "Vintage Postcard",
    "1920s French postcard",
    "ephemera",
    ethers.parseEther("0.1"),        // 0.1 ETH minimum
    3600,                             // 1 hour duration
    1920,
    "Private collection"
  );

  await tx.wait();
  console.log("✅ Quick auction created");
}
```

---

## Placing Encrypted Bids

### Example 1: Basic Encrypted Bid

```javascript
async function placeEncryptedBid(auctionId, bidAmountEth) {
  try {
    // Convert ETH to wei
    const bidAmountWei = ethers.parseEther(bidAmountEth.toString());

    // Encrypt the bid amount using FHE
    const { ciphertext, proof } = await fheClient.encrypt64(
      BigInt(bidAmountWei.toString())
    );

    // Submit bid with ETH deposit
    const tx = await auction.placeBid(
      auctionId,
      ciphertext,
      proof,
      { value: bidAmountWei }
    );

    await tx.wait();
    console.log(`✅ Bid placed: ${bidAmountEth} ETH on auction ${auctionId}`);
  } catch (error) {
    console.error("❌ Bid failed:", error.message);
  }
}
```

### Example 2: Multiple Bidders

```javascript
async function simulateMultipleBidders(auctionId) {
  const bidders = [
    { wallet: wallet1, amount: "2.5" },
    { wallet: wallet2, amount: "3.0" },
    { wallet: wallet3, amount: "2.8" },
    { wallet: wallet4, amount: "4.0" }  // This will be the winner
  ];

  for (const bidder of bidders) {
    const auctionContract = auction.connect(bidder.wallet);
    const bidWei = ethers.parseEther(bidder.amount);

    const { ciphertext, proof } = await fheClient.encrypt64(BigInt(bidWei));

    const tx = await auctionContract.placeBid(
      auctionId,
      ciphertext,
      proof,
      { value: bidWei }
    );

    await tx.wait();
    console.log(`✅ ${bidder.wallet.address.slice(0, 8)} bid ${bidder.amount} ETH`);
  }

  console.log("✅ All bids placed successfully");
}
```

### Example 3: Bid with Error Handling

```javascript
async function placeBidWithRetry(auctionId, bidAmount, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const bidWei = ethers.parseEther(bidAmount);
      const { ciphertext, proof } = await fheClient.encrypt64(BigInt(bidWei));

      const tx = await auction.placeBid(auctionId, ciphertext, proof, {
        value: bidWei,
        gasLimit: 500000
      });

      await tx.wait();
      console.log("✅ Bid successful");
      return true;
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  console.error("❌ All bid attempts failed");
  return false;
}
```

---

## Handling Auction Results

### Example 1: End Auction and Wait for Results

```javascript
async function endAuctionAndWaitForResults(auctionId) {
  // End the auction
  const tx = await auction.endAuction(auctionId);
  const receipt = await tx.wait();

  console.log("✅ Auction ended, waiting for Gateway decryption...");

  // Get decryption request ID
  const event = receipt.events.find(e => e.event === "DecryptionRequested");
  const requestId = event.args.requestId;

  console.log(`📡 Decryption request ID: ${requestId}`);

  // Poll for results
  await pollForAuctionResults(auctionId, 300000); // 5 minutes timeout
}

async function pollForAuctionResults(auctionId, timeout = 300000) {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 seconds

  while (Date.now() - startTime < timeout) {
    try {
      const results = await auction.getAuctionResults(auctionId);

      if (results.ended && results.winner !== ethers.ZeroAddress) {
        console.log("🏆 Auction settled!");
        console.log(`   Winner: ${results.winner}`);
        console.log(`   Winning bid: ${ethers.formatEther(results.winningBid)} ETH`);
        return results;
      }
    } catch (error) {
      // Results not yet available
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
    console.log("⏳ Still waiting for Gateway...");
  }

  console.log("⚠️ Timeout waiting for results");
  return null;
}
```

### Example 2: Monitor Auction Status

```javascript
async function monitorAuctionStatus(auctionId) {
  const status = await auction.getAuctionStatus(auctionId);

  console.log("📊 Auction Status:");
  console.log(`   Active: ${status.isActive}`);
  console.log(`   Ended: ${status.isEnded}`);
  console.log(`   Decryption Requested: ${status.decryptionRequested}`);
  console.log(`   Timed Out: ${status.decryptionTimedOut}`);
  console.log(`   Refunds Enabled: ${status.refundsEnabled}`);

  if (status.decryptionRequested && !status.decryptionTimedOut) {
    const hours = Math.floor(status.timeUntilTimeout / 3600);
    console.log(`   ⏰ Time until timeout: ${hours} hours`);
  }

  return status;
}
```

### Example 3: Get Obfuscated Price

```javascript
async function getPrivacyProtectedPrice(auctionId) {
  const obfuscatedPrice = await auction.getObfuscatedPrice(auctionId);
  const actualInfo = await auction.getAuctionInfo(auctionId);

  console.log("💰 Price Information:");
  console.log(`   Actual minimum bid: ${ethers.formatEther(actualInfo.minimumBid)} ETH`);
  console.log(`   Obfuscated estimate: ${ethers.formatEther(obfuscatedPrice)} ETH`);
  console.log(`   Note: Obfuscated price has 1.0x-2.0x random multiplier for privacy`);
}
```

---

## Refund Scenarios

### Example 1: Loser Claims Refund (Normal Flow)

```javascript
async function claimLoserRefund(auctionId, loserWallet) {
  try {
    // Check if user can claim refund
    const canClaim = await auction.canClaimRefund(auctionId, loserWallet.address);

    if (!canClaim.canClaim) {
      console.log(`❌ Cannot claim refund: ${canClaim.reason}`);
      return;
    }

    console.log(`✅ Eligible for refund: ${canClaim.reason}`);

    // Get bid details before claiming
    const bidDetails = await auction.getBidDetails(auctionId, loserWallet.address);
    const refundAmount = bidDetails.depositAmount;

    console.log(`💰 Refund amount: ${ethers.formatEther(refundAmount)} ETH`);

    // Claim refund
    const auctionContract = auction.connect(loserWallet);
    const tx = await auctionContract.claimLoserRefund(auctionId);
    await tx.wait();

    console.log("✅ Refund claimed successfully");
  } catch (error) {
    console.error("❌ Refund claim failed:", error.message);
  }
}
```

### Example 2: Timeout Scenario with Full Refunds

```javascript
async function handleTimeoutScenario(auctionId) {
  console.log("⏰ Checking for timeout condition...");

  const status = await auction.getAuctionStatus(auctionId);

  if (!status.decryptionTimedOut) {
    console.log(`⏳ Timeout not reached yet. Wait ${status.timeUntilTimeout / 3600} hours.`);
    return;
  }

  console.log("🚨 Decryption timeout detected!");

  // Enable refunds (anyone can call this)
  const tx = await auction.enableRefundsOnTimeout(auctionId);
  await tx.wait();

  console.log("✅ Refunds enabled for all bidders");

  // All bidders can now claim refunds
  const auctionInfo = await auction.getAuctionInfo(auctionId);
  console.log(`   Total bidders: ${auctionInfo.totalBids}`);
  console.log("   All bidders can now call claimRefund()");
}
```

### Example 3: Batch Refund Claims

```javascript
async function batchClaimRefunds(auctionId, bidderWallets) {
  console.log(`🔄 Processing ${bidderWallets.length} refund claims...`);

  const results = {
    successful: 0,
    failed: 0,
    alreadyClaimed: 0
  };

  for (const wallet of bidderWallets) {
    try {
      const canClaim = await auction.canClaimRefund(auctionId, wallet.address);

      if (!canClaim.canClaim) {
        console.log(`⏭️  ${wallet.address.slice(0, 8)}: ${canClaim.reason}`);
        results.alreadyClaimed++;
        continue;
      }

      const auctionContract = auction.connect(wallet);
      const tx = await auctionContract.claimRefund(auctionId);
      await tx.wait();

      results.successful++;
      console.log(`✅ ${wallet.address.slice(0, 8)}: Refund claimed`);
    } catch (error) {
      results.failed++;
      console.error(`❌ ${wallet.address.slice(0, 8)}: ${error.message}`);
    }
  }

  console.log("\n📊 Refund Claim Summary:");
  console.log(`   ✅ Successful: ${results.successful}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   ⏭️  Already Claimed: ${results.alreadyClaimed}`);

  return results;
}
```

---

## Advanced Features

### Example 1: Auction Authentication Workflow

```javascript
async function authenticateArtifact(auctionId, authenticatorWallet) {
  // Check if already authenticated
  const info = await auction.getAuctionInfo(auctionId);

  if (info.authenticated) {
    console.log("✅ Already authenticated");
    return;
  }

  // Authenticate
  const auctionContract = auction.connect(authenticatorWallet);
  const tx = await auctionContract.authenticateArtifact(auctionId);
  await tx.wait();

  console.log("✅ Artifact authenticated");
}
```

### Example 2: Seller Withdraws Earnings

```javascript
async function sellerWithdrawEarnings(sellerWallet) {
  try {
    // Check earnings balance
    const earnings = await auction.sellerEarnings(sellerWallet.address);

    if (earnings === 0n) {
      console.log("❌ No earnings to withdraw");
      return;
    }

    console.log(`💰 Available earnings: ${ethers.formatEther(earnings)} ETH`);

    // Withdraw
    const auctionContract = auction.connect(sellerWallet);
    const tx = await auctionContract.withdrawEarnings();
    await tx.wait();

    console.log("✅ Earnings withdrawn successfully");
  } catch (error) {
    console.error("❌ Withdrawal failed:", error.message);
  }
}
```

### Example 3: Get All Active Auctions

```javascript
async function listActiveAuctions() {
  const activeIds = await auction.getActiveAuctions();

  console.log(`📋 Found ${activeIds.length} active auctions:\n`);

  for (const auctionId of activeIds) {
    const info = await auction.getAuctionInfo(auctionId);
    const status = await auction.getAuctionStatus(auctionId);

    const timeLeft = info.endTime - Math.floor(Date.now() / 1000);
    const hoursLeft = Math.floor(timeLeft / 3600);

    console.log(`🏺 Auction #${auctionId}: ${info.name}`);
    console.log(`   Category: ${info.category}`);
    console.log(`   Min Bid: ${ethers.formatEther(info.minimumBid)} ETH`);
    console.log(`   Time Left: ${hoursLeft} hours`);
    console.log(`   Total Bids: ${info.totalBids}`);
    console.log(`   Authenticated: ${info.authenticated ? "✅" : "❌"}`);
    console.log("");
  }
}
```

### Example 4: Complete E2E Test

```javascript
async function completeAuctionE2ETest() {
  console.log("🚀 Starting complete auction E2E test...\n");

  // 1. Create auction
  console.log("1️⃣ Creating auction...");
  const auctionId = await createStandardAuction();

  // 2. Authenticate
  console.log("\n2️⃣ Authenticating artifact...");
  await authenticateArtifact(auctionId, authenticatorWallet);

  // 3. Place multiple bids
  console.log("\n3️⃣ Placing encrypted bids...");
  await simulateMultipleBidders(auctionId);

  // 4. Wait for auction to end (skip time in test environment)
  console.log("\n4️⃣ Fast-forward to auction end...");
  await provider.send("evm_increaseTime", [86400 * 7]);
  await provider.send("evm_mine");

  // 5. End auction
  console.log("\n5️⃣ Ending auction...");
  await endAuctionAndWaitForResults(auctionId);

  // 6. Claim refunds
  console.log("\n6️⃣ Processing refunds for losers...");
  await batchClaimRefunds(auctionId, [wallet1, wallet2, wallet3]);

  // 7. Seller withdraws
  console.log("\n7️⃣ Seller withdrawing earnings...");
  await sellerWithdrawEarnings(sellerWallet);

  console.log("\n✅ E2E test completed successfully!");
}
```

---

## Event Listening

### Example: Real-time Event Monitoring

```javascript
async function setupEventListeners() {
  // Listen for auction creation
  auction.on("AuctionCreated", (auctionId, artifactName, seller, startTime, endTime, minimumBid) => {
    console.log(`🆕 New Auction #${auctionId}: ${artifactName}`);
    console.log(`   Seller: ${seller}`);
    console.log(`   Min Bid: ${ethers.formatEther(minimumBid)} ETH`);
  });

  // Listen for bids
  auction.on("ConfidentialBidPlaced", (auctionId, bidder, depositAmount) => {
    console.log(`💰 Bid placed on Auction #${auctionId}`);
    console.log(`   Bidder: ${bidder.slice(0, 8)}...`);
    console.log(`   Deposit: ${ethers.formatEther(depositAmount)} ETH`);
  });

  // Listen for auction end
  auction.on("AuctionEnded", (auctionId, winner, winningBid, artifactName) => {
    console.log(`🏆 Auction #${auctionId} Settled!`);
    console.log(`   Winner: ${winner}`);
    console.log(`   Winning Bid: ${ethers.formatEther(winningBid)} ETH`);
  });

  // Listen for refunds
  auction.on("RefundIssued", (auctionId, bidder, amount) => {
    console.log(`💸 Refund issued for Auction #${auctionId}`);
    console.log(`   Bidder: ${bidder.slice(0, 8)}...`);
    console.log(`   Amount: ${ethers.formatEther(amount)} ETH`);
  });

  // Listen for timeout refunds
  auction.on("RefundsEnabled", (auctionId, reason) => {
    console.log(`🚨 Refunds enabled for Auction #${auctionId}`);
    console.log(`   Reason: ${reason}`);
  });

  console.log("👂 Event listeners set up");
}
```

---

## Testing Helpers

### Time Travel (Hardhat Network)

```javascript
async function timeTravel(seconds) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
  console.log(`⏭️  Fast-forwarded ${seconds / 3600} hours`);
}

// Usage
await timeTravel(86400 * 7); // Skip 7 days
```

### Get Account Balance

```javascript
async function checkBalance(address) {
  const balance = await ethers.provider.getBalance(address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);
  return balance;
}
```

---

## Error Handling Best Practices

```javascript
async function robustBidPlacement(auctionId, bidAmount) {
  try {
    // Pre-flight checks
    const info = await auction.getAuctionInfo(auctionId);

    if (!info.authenticated) {
      throw new Error("Artifact not yet authenticated");
    }

    if (!info.isActive) {
      throw new Error("Auction not active");
    }

    const bidWei = ethers.parseEther(bidAmount);

    if (bidWei < info.minimumBid) {
      throw new Error(`Bid below minimum of ${ethers.formatEther(info.minimumBid)} ETH`);
    }

    // Check balance
    const balance = await ethers.provider.getBalance(wallet.address);
    if (balance < bidWei) {
      throw new Error("Insufficient balance");
    }

    // Encrypt and submit
    const { ciphertext, proof } = await fheClient.encrypt64(BigInt(bidWei));

    const tx = await auction.placeBid(auctionId, ciphertext, proof, {
      value: bidWei,
      gasLimit: 500000
    });

    await tx.wait();
    console.log("✅ Bid placed successfully");

  } catch (error) {
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.error("❌ Not enough ETH for gas + bid");
    } else if (error.message.includes("Auction not active")) {
      console.error("❌ Auction has ended");
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}
```

---

## Conclusion

These examples cover the complete lifecycle of the Confidential Artifact Auction platform, including:

- ✅ Auction creation and management
- ✅ FHE-encrypted bidding
- ✅ Gateway callback handling
- ✅ Refund mechanisms (normal and timeout)
- ✅ Event monitoring
- ✅ Error handling

For more information, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [README.md](./README.md) - Project overview
- [SECURITY.md](./SECURITY.md) - Security documentation

---

**Last Updated:** 2025-11-24
**Version:** 1.0.0
