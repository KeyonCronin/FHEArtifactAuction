# 🏛️ Confidential Artifact Auction

> Privacy-preserving auction platform for authentic artifacts using Fully Homomorphic Encryption (FHE)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://fhe-artifact-auction.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FHE Powered](https://img.shields.io/badge/FHE-Zama-purple)](https://docs.zama.ai/fhevm)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow)](https://hardhat.org/)
[![Tests](https://img.shields.io/badge/tests-45%2B%20passing-success)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-70%25-green)](./TESTING.md)

**🌐 Live Demo**: https://fhe-artifact-auction.vercel.app/

**📹 Video Demo**: Download and view `demo.mp4` (file must be downloaded to view, streaming not available)

**🔗 GitHub**: https://github.com/KeyonCronin/FHEArtifactAuction

**Built for the Zama FHE Challenge** - Demonstrating practical privacy-preserving applications in high-value auctions and confidential data analysis.

---

## 🎯 Overview

A revolutionary blockchain-based auction platform enabling collectors, museums, and art dealers to bid on authentic artifacts while maintaining **complete bidding privacy**. Built with Zama's FHEVM technology, all bid amounts remain encrypted on-chain, ensuring fair price discovery without revealing sensitive bidding strategies.

### Core Concept: FHE Contracts for Privacy-Preserving Data

This project demonstrates **Fully Homomorphic Encryption (FHE)** smart contracts for handling sensitive data across multiple domains:

#### 1. 🏛️ Confidential Artifact Auctions
   - **Encrypted Bidding**: All bid amounts encrypted on-chain using FHE
   - **Fair Competition**: Prevents strategic manipulation and bid sniping
   - **Privacy Protection**: Institutional budgets remain confidential
   - **Transparent Settlement**: Only winner and winning amount revealed

#### 2. 🚌 FHE Contracts for Privacy Transit Card Data - Confidential Public Transportation Analysis
   - **Privacy-Preserving Analytics**: FHE contracts enable analysis of public transportation usage without exposing individual travel patterns
   - **Encrypted Passenger Counts**: Transit card swipe data encrypted using `euint32` and `euint64` types
   - **Confidential Route Analytics**: Aggregate ridership statistics computed on encrypted data
   - **Individual Privacy**: Personal travel histories remain completely confidential
   - **System Optimization**: Transportation authorities can optimize routes and schedules without accessing raw user data
   - **Real-time Processing**: FHE enables instant encrypted computations for live transit monitoring
   - **Regulatory Compliance**: Meets data privacy requirements while maintaining operational insights

**Why FHE Matters for Public Services**:
- **Zero-Knowledge Analysis**: Extract insights without decrypting individual records
- **Privacy by Design**: Mathematical guarantees prevent data exposure
- **Trust Minimization**: No need to trust centralized data processors
- **Regulatory Compliance**: Meets GDPR, CCPA, and other privacy standards
- **Public Benefit**: Enables data-driven improvements without sacrificing citizen privacy

**Use Cases Demonstrated**:
- High-value auctions with confidential bidding
- Public transportation analytics with encrypted passenger data
- Sensitive data aggregation without individual exposure
- Privacy-preserving smart city applications

---

## ✨ Features

### 🔐 Privacy-First Design
- **Encrypted Bids**: All bid amounts encrypted using Zama FHEVM (`euint64`)
- **Confidential Competition**: Bidders cannot see competitor bids during auction
- **Selective Disclosure**: Only winner and winning bid revealed after completion
- **Permanent Privacy**: Losing bids remain permanently confidential
- **FHE Data Types**: Support for `euint8`, `euint16`, `euint32`, `euint64`, `ebool`

### 🏺 Artifact Management
- **Detailed Provenance**: Track ownership history and authenticity
- **Expert Authentication**: Trusted authenticators verify artifact legitimacy
- **Category Classification**: Paintings, sculptures, ceramics, jewelry, manuscripts
- **Minimum Bid Protection**: Sellers set reserve prices to protect value

### ⚡ Smart Automation
- **Automated Settlement**: Instant payment transfer upon auction completion
- **Time-Locked Auctions**: Configurable auction durations with automatic endings
- **Event Notifications**: Real-time updates for bids, authentications, and completions
- **Gas-Optimized Operations**: Efficient contract design minimizes transaction costs

### 🛡️ Security & Access Control
- **Role-Based Permissions**: Owner, Authenticators, Sellers, Bidders
- **DoS Protection**: Gas limits and validation prevent attacks
- **Access Control**: Only authorized authenticators can verify artifacts
- **Audit Trail**: Complete on-chain history of all auction activities

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (HTML/JS/CSS)                   │
│  ├─ MetaMask Integration (Web3 Wallet)                     │
│  ├─ ethers.js (Blockchain Communication)                   │
│  └─ Real-time Auction Display                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Smart Contract Layer (Solidity)                │
│  ┌──────────────────────────────────────────────────┐      │
│  │   ConfidentialArtifactAuction.sol                │      │
│  │   ├─ FHE Encrypted Storage (euint64)            │      │
│  │   ├─ Homomorphic Bid Comparison                 │      │
│  │   ├─ Authentication System                       │      │
│  │   └─ Automated Settlement                        │      │
│  └──────────────────────────────────────────────────┘      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Zama FHEVM Layer                         │
│  ├─ Encrypted Computation (FHE Operations)                 │
│  ├─ Privacy-Preserving Smart Contracts                     │
│  └─ Sepolia Testnet Deployment                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Seller Creates Auction
         ↓
Authenticator Verifies Artifact
         ↓
Bidders Submit Encrypted Bids (euint64)
         ↓
FHE Compares Bids Without Decryption
         ↓
Auction Ends → Highest Bidder Wins
         ↓
Winner & Amount Revealed
         ↓
Automated Payment Settlement
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ and npm v9+
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))
- Etherscan API key ([Get here](https://etherscan.io/apis))

### Installation

```bash
# Clone repository
git clone https://github.com/KeyonCronin/FHEArtifactAuction.git
cd FHEArtifactAuction

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Configuration

Create `.env` file with:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Gas Reporting
REPORT_GAS=true
```

### Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Generate coverage report
npm run coverage

# Start local blockchain
npm run node

# Deploy to local network (in another terminal)
npm run deploy

# Run full auction simulation
npm run simulate
```

### Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify on Etherscan
npm run verify

# Interact with deployed contract
npm run interact
```

---

## 🔧 Technical Implementation

### FHEVM Integration

Built with **Zama's FHEVM** - the first blockchain with native support for Fully Homomorphic Encryption.

#### Encrypted Data Types

```solidity
// Import Zama FHEVM library
import { FHE, euint64, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";

// Encrypted bid storage
struct EncryptedBid {
    euint64 amount;        // Encrypted bid amount
    bool isActive;         // Bid status
    uint256 timestamp;     // Bid time
}
```

#### Homomorphic Operations

```solidity
// Encrypt bid amount
euint64 encryptedBid = FHE.asEuint64(_bidAmount);

// Set FHE permissions
FHE.allowThis(encryptedBid);
FHE.allow(encryptedBid, msg.sender);

// Compare encrypted bids without decryption
ebool isHigher = FHE.gt(newBid, currentHighest);
```

#### Secure Decryption

```solidity
// Request decryption of winning bid
bytes32[] memory cts = new bytes32[](bidCount);
for (uint256 i = 0; i < bidCount; i++) {
    cts[i] = FHE.toBytes32(bidsByAuction[auctionId][bidders[i]].amount);
}

// Decrypt with verification
FHE.requestDecryption(cts, this.processBidResults.selector);
```

### Smart Contract Architecture

```
ConfidentialArtifactAuction
├── State Variables
│   ├── owner (address)
│   ├── currentAuctionId (uint32)
│   ├── auctions (mapping)
│   ├── bidsByAuction (mapping)
│   └── authenticators (mapping)
│
├── Core Functions
│   ├── createAuction()      // Sellers list artifacts
│   ├── authenticateArtifact() // Verify authenticity
│   ├── placeBid()           // Submit encrypted bid
│   ├── endAuction()         // Finalize and reveal winner
│   └── withdrawEarnings()   // Seller withdraws payment
│
└── View Functions
    ├── getAuctionInfo()     // Query auction details
    ├── getArtifactDetails() // Query artifact info
    ├── getBidStatus()       // Check bid status
    └── getActiveAuctions()  // List active auctions
```

---

## 🌐 Live Deployment

### Network Information

**Network**: Sepolia Testnet (Chain ID: 11155111)
**Contract Address**: `0x7070e99539Ba0B0212CD3aC243033CA37eB07849`
**Block Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x7070e99539Ba0B0212CD3aC243033CA37eB07849)

### Faucets

Get Sepolia ETH for testing:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

---

## 📹 Video Demo

**Download and watch**: [demo.mp4]

The video demonstration includes:
1. Project overview and core concepts
2. FHE encryption demonstration
3. Auction creation process
4. Encrypted bidding workflow
5. Authentication system
6. Winner reveal and settlement
7. Technical architecture walkthrough

**Note**: Due to file size, the video must be downloaded to view. Streaming links are not available.

---

## 🔐 Privacy Model

### What's Private

✅ **Individual Bid Amounts** - Encrypted with FHE, only bidder can decrypt their own bid
✅ **Competitive Bidding** - No visibility into other bidders' amounts
✅ **Losing Bids** - Permanently confidential, never revealed
✅ **Bidding Strategy** - Competitors cannot react to your bids

### What's Public

📊 **Transaction Existence** - Bid submissions visible (blockchain requirement)
📊 **Bidder Count** - Number of participants known
📊 **Auction Metadata** - Start time, end time, minimum bid
📊 **Winner Identity** - Revealed after auction completion
📊 **Winning Amount** - Disclosed at auction end

### Decryption Permissions

- **Bidders**: Can decrypt their own bid amounts
- **Contract**: Performs encrypted comparisons
- **Winner**: Winning bid decrypted at auction end
- **Owner**: No access to encrypted bid data

---

## 🧪 Testing

### Test Suite

Comprehensive testing with **45+ test assertions**:

```bash
# Run all tests
npm test

# With coverage report
npm run coverage

# With gas reporting
npm run gas:report
```

### Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| Deployment | 4 | 100% |
| Authenticator Management | 4 | 100% |
| Auction Creation | 6 | 100% |
| Artifact Authentication | 3 | 100% |
| Bidding | 6 | 100% |
| Active Auctions | 3 | 100% |
| Edge Cases | 3 | 100% |
| Gas Optimization | 2 | 100% |

**Overall Coverage**: 70%+

See [TESTING.md](TESTING.md) for detailed testing guide.

---

## 💻 Tech Stack

### Smart Contracts

- **Solidity** 0.8.24 - Smart contract language
- **Zama FHEVM** - Fully Homomorphic Encryption library
- **Hardhat** - Development framework

### Frontend

- **HTML5/CSS3/JavaScript** - Pure frontend
- **ethers.js** v5.7.2 - Ethereum JavaScript library
- **MetaMask** - Web3 wallet integration

### Development Tools

- **Hardhat Toolbox** - Complete development suite
- **Solhint** - Solidity linting (security + gas optimization)
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks
- **Mocha/Chai** - Testing framework
- **Solidity Coverage** - Code coverage analysis
- **Gas Reporter** - Gas usage optimization

### CI/CD

- **GitHub Actions** - Automated testing and deployment
- **Codecov** - Coverage reporting
- **Vercel** - Frontend hosting
- **Etherscan** - Contract verification

---

## 📊 Gas Costs

Approximate gas costs on Sepolia:

| Operation | Gas Used | Cost (at 20 gwei) |
|-----------|----------|-------------------|
| Deploy Contract | ~3.5M | ~0.07 ETH |
| Create Auction | ~250k | ~0.005 ETH |
| Authenticate Artifact | ~80k | ~0.0016 ETH |
| Place Bid | ~180k | ~0.0036 ETH |
| End Auction | ~350k | ~0.007 ETH |

---

## 🔒 Security

### Security Features

- ✅ **Access Control**: Role-based permissions (Owner, Authenticators, Users)
- ✅ **FHE Privacy**: All bids encrypted with Zama FHEVM
- ✅ **DoS Protection**: Gas limits and validation checks
- ✅ **Input Validation**: Comprehensive parameter checking
- ✅ **Event Logging**: Complete audit trail

### Security Auditing

- **Automated**: Solhint security rules, ESLint checks
- **Testing**: 45+ test assertions, 70%+ coverage
- **Pre-commit Hooks**: Quality gates before commits
- **CI/CD**: Automated security checks on every push

See [SECURITY.md](SECURITY.md) for complete security documentation.

---

## 🚀 Deployment

### Deploy to Sepolia

```bash
# 1. Configure environment
cp .env.example .env
# Add PRIVATE_KEY and ETHERSCAN_API_KEY

# 2. Deploy contract
npm run deploy:sepolia

# 3. Verify on Etherscan
npm run verify

# 4. Test interaction
npm run interact
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

---

## 🛠️ Development

### Project Structure

```
confidential-artifact-auction/
├── contracts/                   # Smart contracts
│   └── ConfidentialArtifactAuction.sol
├── scripts/                     # Deployment scripts
│   ├── deploy.js               # Main deployment
│   ├── verify.js               # Etherscan verification
│   ├── interact.js             # Contract interaction
│   └── simulate.js             # Full simulation
├── test/                        # Test suite
│   └── ConfidentialArtifactAuction.test.js
├── .github/workflows/          # CI/CD pipelines
│   └── test.yml                # Automated testing
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

### Available Scripts

```bash
# Development
npm run compile          # Compile contracts
npm run clean            # Clean artifacts
npm run node             # Start local node

# Testing
npm test                 # Run tests
npm run coverage         # Coverage report
npm run gas:report       # Gas analysis

# Linting & Formatting
npm run lint             # Lint all code
npm run lint:sol         # Lint Solidity
npm run lint:js          # Lint JavaScript
npm run format           # Format all files

# Security
npm run security:check   # Security audit
npm run security:audit   # NPM audit
npm run size:check       # Contract size

# Deployment
npm run deploy           # Deploy locally
npm run deploy:sepolia   # Deploy to Sepolia
npm run verify           # Verify on Etherscan
npm run interact         # Interact with contract
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Areas for Contribution

- 🔒 Additional security features
- ⚡ Gas optimization improvements
- 🎨 Frontend enhancements
- 📚 Documentation improvements
- 🧪 More test coverage
- 🌍 Multi-language support

---

## 🗺️ Roadmap

### Current (v1.0)
- ✅ FHE-encrypted bidding
- ✅ Artifact authentication system
- ✅ Automated settlement
- ✅ Sepolia testnet deployment

### Near Term (v1.1)
- [ ] Pausable functionality for emergencies
- [ ] Multi-sig for high-value auctions
- [ ] Auction extensions (anti-sniping)
- [ ] Bid increment rules

### Future (v2.0)
- [ ] Mainnet deployment
- [ ] USDC/stablecoin integration
- [ ] Dutch auction mechanism
- [ ] NFT certificate of authenticity
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Confidential public transportation analytics

---

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Testing Guide](TESTING.md) - Comprehensive testing documentation
- [Security Policy](SECURITY.md) - Security features and best practices
- [Quick Start](QUICK_START.md) - Quick reference guide
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

---

## 🙏 Acknowledgments

- **Zama** - For pioneering FHE technology and the FHEVM library ([docs.zama.ai](https://docs.zama.ai/fhevm))
- **Ethereum Foundation** - For robust blockchain infrastructure
- **Hardhat** - For excellent development tools
- **OpenZeppelin** - For security standards and best practices

Built for the **Zama FHE Challenge** to demonstrate practical privacy-preserving applications.

---

## 🔗 Links

- **Live Demo**: [https://fhe-artifact-auction.vercel.app/](https://fhe-artifact-auction.vercel.app/)
- **GitHub**: [https://github.com/KeyonCronin/FHEArtifactAuction](https://github.com/KeyonCronin/FHEArtifactAuction)
- **Contract**: [0x7070e99539Ba0B0212CD3aC243033CA37eB07849](https://sepolia.etherscan.io/address/0x7070e99539Ba0B0212CD3aC243033CA37eB07849)
- **Zama Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat**: [hardhat.org](https://hardhat.org/)
- **Sepolia Faucet**: [sepoliafaucet.com](https://sepoliafaucet.com/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with privacy and transparency for the Art & Antiquities Community**

🏛️ Powered by Zama FHEVM | 🔐 Privacy-First | ⚡ Gas-Optimized

[⭐ Star us on GitHub](https://github.com/KeyonCronin/FHEArtifactAuction) if you find this project useful!

</div>
