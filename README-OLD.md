# Confidential Artifact Auction 🏛️

> Privacy-Preserving Ancient Artifact & Fine Art Bidding Platform powered by Fully Homomorphic Encryption (FHE)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://confidential-artifact-auction.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FHE Powered](https://img.shields.io/badge/FHE-Enabled-purple)](https://github.com/zama-ai/fhevm)

## 🎯 Overview

Confidential Artifact Auction is a revolutionary blockchain-based auction platform that enables collectors, museums, and art dealers to bid on authentic historical artifacts and fine art pieces while maintaining complete **bidding privacy**. Using Fully Homomorphic Encryption (FHE), all bid amounts remain encrypted on-chain, ensuring fair auctions without revealing sensitive information.

**Live Application:** [https://confidential-artifact-auction.vercel.app/](https://confidential-artifact-auction.vercel.app/)

**GitHub Repository:** [https://github.com/KeyonCronin/ConfidentialArtifactAuction](https://github.com/KeyonCronin/ConfidentialArtifactAuction)

**Smart Contract Address:** `0x7070e99539Ba0B0212CD3aC243033CA37eB07849`

---

## 🔐 Core Concept: FHE-Powered Confidential Auctions

### What is FHE (Fully Homomorphic Encryption)?

Traditional blockchain auctions suffer from a critical flaw: **all bids are publicly visible**. This transparency allows competitors to:
- Monitor each other's bidding strategies
- Engage in bid sniping
- Manipulate auction outcomes
- Exploit price discovery mechanisms

**Our Solution:** FHE allows computations directly on encrypted data without decryption. Bidders submit encrypted bids that remain confidential throughout the auction, only revealing the winner after the auction ends.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Auction Lifecycle                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. CREATION        → Seller lists artifact with details     │
│                       (provenance, category, min bid)        │
│                                                               │
│  2. AUTHENTICATION  → Verified authenticators approve        │
│                       artifact authenticity                  │
│                                                               │
│  3. BIDDING         → Bidders submit ENCRYPTED bids          │
│                       (amounts hidden on-chain)              │
│                                                               │
│  4. COMPUTATION     → FHE contract compares encrypted bids   │
│                       without decryption                     │
│                                                               │
│  5. FINALIZATION    → Winner revealed, highest bid decrypted │
│                       Payment transferred automatically      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Privacy Features

- **🔒 Bid Confidentiality**: All bid amounts are encrypted using FHE
- **👁️ Hidden Competition**: Bidders cannot see competitor bids
- **⚖️ Fair Discovery**: True market value emerges without manipulation
- **🏆 Winner Privacy**: Only final winner and winning bid are revealed
- **📜 Provenance Tracking**: Transparent ownership history with privacy

---

## 🎨 Features

### For Sellers
- **List Rare Artifacts**: Create auctions for paintings, sculptures, ceramics, jewelry, manuscripts, and more
- **Set Minimum Bids**: Establish reserve prices to protect asset value
- **Authentication System**: Require expert verification before bidding begins
- **Automated Settlement**: Instant payment upon auction completion
- **Provenance Documentation**: Record detailed artifact history and ownership chain

### For Bidders
- **Private Bidding**: Submit encrypted bids without revealing amounts
- **Real-time Updates**: Monitor auction status and time remaining
- **Bid History**: Track your participation across multiple auctions
- **Secure Wallet Integration**: Connect via MetaMask with Web3 support
- **Instant Notifications**: Receive alerts for auction endings and wins

### For Authenticators
- **Verification Role**: Trusted experts can authenticate artifact legitimacy
- **Quality Assurance**: Prevent fraudulent listings and protect buyers
- **Reputation System**: Build credibility through verification history

---

## 🎬 Demo Video

Watch our platform demonstration showcasing the complete auction workflow:

[![Demo Video](/ConfidentialArtifactAuction.mp4)

**Video Highlights:**
- Wallet connection and setup
- Creating an artifact auction
- Authenticator approval process
- Submitting confidential bids
- Auction finalization and winner reveal

---

## 📸 On-Chain Transaction Screenshots


---

## 🛠️ Technology Stack

### Blockchain & Encryption
- **FHE Library**: Zama's fhevm for encrypted computations
- **Smart Contracts**: Solidity 0.8.x
- **Network**: Ethereum-compatible chains (Sepolia testnet supported)
- **Wallet**: MetaMask integration

### Frontend
- **Framework**: Pure JavaScript (no build dependencies)
- **Web3 Library**: ethers.js v5.7.2
- **Styling**: Modern CSS with glassmorphism effects
- **UI/UX**: Responsive design for desktop and mobile

### Architecture
```
┌──────────────────────────────────────────────────────┐
│                   User Interface                      │
│              (HTML/CSS/JavaScript)                    │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│                Web3 Provider                          │
│              (MetaMask / ethers.js)                   │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│            Smart Contract Layer                       │
│    ┌──────────────────────────────────────┐          │
│    │   ConfidentialArtifactAuction.sol    │          │
│    │   - FHE bid encryption               │          │
│    │   - Auction lifecycle management     │          │
│    │   - Authentication system            │          │
│    │   - Payment settlement               │          │
│    └──────────────────────────────────────┘          │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│              Blockchain Network                       │
│         (Ethereum / Sepolia Testnet)                  │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Smart Contract Interface

### Core Functions

#### Create Auction
```solidity
function createAuction(
    string memory _name,
    string memory _description,
    string memory _category,
    uint256 _minimumBid,
    uint256 _auctionDuration,
    uint256 _yearCreated,
    string memory _provenance
) returns (uint32 auctionId)
```

#### Submit Confidential Bid
```solidity
function placeBid(
    uint32 auctionId,
    euint64 _encryptedBidAmount  // FHE-encrypted bid
)
```

#### Authenticate Artifact
```solidity
function authenticateArtifact(uint32 auctionId)
```

#### Finalize Auction
```solidity
function endAuction(uint32 auctionId)
```

#### Retrieve Results
```solidity
function getAuctionResults(uint32 auctionId)
    returns (
        bool ended,
        address winner,
        uint256 winningBid,
        uint256 totalBids
    )
```

---

## 🎭 Use Cases

### 1. Museum Acquisitions
Museums can acquire rare artifacts through competitive bidding without revealing their acquisition budgets to competitors or the public.

### 2. Private Collector Auctions
High-net-worth individuals can bid on exclusive pieces without exposing their financial strategies or collection interests.

### 3. Estate Sales
Executors can liquidate valuable collections while maintaining dignity and privacy for beneficiaries.

### 4. Archaeological Discoveries
Institutions can bid on newly discovered artifacts with confidentiality, preventing market manipulation.

### 5. Repatriation Programs
Governments can negotiate artifact returns through private bids, avoiding political complications from public price revelations.

---

## 🔒 Security & Privacy

### Privacy Guarantees
- ✅ Bid amounts encrypted using FHE (euint64)
- ✅ No bid amounts stored in plaintext
- ✅ Winner identity revealed only after auction ends
- ✅ Losers' bids remain permanently confidential
- ✅ Blockchain immutability prevents tampering

### Security Measures
- ✅ Reentrancy protection on withdrawals
- ✅ Access control for authenticators
- ✅ Time-locked auction endings
- ✅ Minimum bid enforcement
- ✅ Authentication requirement before bidding

### Audit Status
> Smart contracts are currently undergoing security audits. Please use testnet for experimentation.

---

## 🌐 Supported Networks

| Network | Chain ID | Status | Contract Address |
|---------|----------|--------|------------------|
| Ethereum Sepolia | 11155111 | ✅ Active | `0x7070e99539Ba0B0212CD3aC243033CA37eB07849` |
| Zama Devnet | TBD | 🔜 Coming Soon | TBD |
| Polygon Mumbai | 80001 | 🔜 Planned | TBD |

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Areas for Contribution
- FHE algorithm optimization
- Gas efficiency improvements
- UI/UX enhancements
- Additional artifact categories
- Multi-language support
- Mobile app development

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and the fhevm library
- **Ethereum Foundation**: For the robust blockchain infrastructure
- **OpenZeppelin**: For secure smart contract libraries
- **Art Authentication Community**: For domain expertise and feedback

---

## 📞 Contact & Support

- **Website**: [https://confidential-artifact-auction.vercel.app/](https://confidential-artifact-auction.vercel.app/)
- **GitHub**: [https://github.com/KeyonCronin/ConfidentialArtifactAuction](https://github.com/KeyonCronin/ConfidentialArtifactAuction)
- **Issues**: [Report bugs or request features](https://github.com/KeyonCronin/ConfidentialArtifactAuction/issues)
- **Discussions**: [Join community discussions](https://github.com/KeyonCronin/ConfidentialArtifactAuction/discussions)

---

## ⚠️ Disclaimer

This platform is provided for demonstration and educational purposes. Users should conduct their own due diligence when participating in auctions. Always verify artifact authenticity through independent experts before making significant purchases.

---

<div align="center">

**Built with ❤️ for the Art & Antiquities Community**

⭐ Star us on GitHub if you find this project useful!

[Website](https://confidential-artifact-auction.vercel.app/) • [GitHub](https://github.com/KeyonCronin/ConfidentialArtifactAuction) • [Documentation](docs/) • [Report Bug](https://github.com/KeyonCronin/ConfidentialArtifactAuction/issues)

</div>