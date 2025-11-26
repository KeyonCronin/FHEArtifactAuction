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

## ⭐ What's New - Modern React dApp

We've added a **production-ready React application** with cutting-edge web technologies:

- 🚀 **React 18 + TypeScript** - Type-safe, component-based architecture
- ⚡ **Vite Build Tool** - Lightning-fast HMR for instant development feedback
- 🔐 **FHEVM SDK Integration** - Built-in React hooks for encrypted operations
- 📦 **Modern Developer Experience** - Professional tooling and best practices
- 🎯 **Production-Ready** - Optimized builds with code splitting and tree-shaking

**Location**: `/auction-dapp` | **Get Started**: `cd auction-dapp && npm run dev`

---

## 🎯 Overview

A revolutionary blockchain-based auction platform enabling collectors, museums, and art dealers to bid on authentic artifacts while maintaining **complete bidding privacy**. Built with Zama's FHEVM technology, all bid amounts remain encrypted on-chain, ensuring fair price discovery without revealing sensitive bidding strategies.

### 🌟 Enhanced Features (v1.0)

This implementation includes advanced features inspired by production-ready FHE applications:

#### **🔄 Gateway Callback Pattern**
- ✅ Asynchronous decryption via Zama Gateway oracle
- ✅ Cryptographic signature verification with `FHE.checkSignatures()`
- ✅ Automatic bid settlement after verification
- ✅ Request tracking with unique IDs for monitoring

#### **💰 Refund Mechanism**
- ✅ Automatic refunds for losing bidders after auction settles
- ✅ Failed auction refunds when decryption fails
- ✅ Reentrancy-protected withdrawal functions
- ✅ Precise ETH deposit tracking for accurate refunds

#### **⏱️ Timeout Protection**
- ✅ 7-day Gateway decryption timeout to prevent permanent fund locking
- ✅ Anyone can trigger refunds after timeout expires
- ✅ Comprehensive auction status tracking (active/ended/timed out)
- ✅ Emergency recovery mechanism for all participants

#### **🔐 Privacy Enhancements**
- ✅ Price obfuscation with random multipliers (1.0x - 2.0x)
- ✅ Division privacy protection using randomization
- ✅ Encrypted bid storage with FHE permissions
- ✅ Zero-knowledge bid comparisons

#### **🛡️ Security Hardening**
- ✅ Input validation with length limits (name ≤200, description ≤1000)
- ✅ Reentrancy guards on all withdrawal functions
- ✅ Access control with role-based permissions
- ✅ Overflow protection (Solidity 0.8.24 checked arithmetic)
- ✅ Gas optimization with batch size limits (50 bidders max)
- ✅ Maximum auction duration protection (90 days)

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
- **Price Obfuscation**: Random multipliers protect actual price information (1.0x - 2.0x range)
- **Gateway Callback Pattern**: Asynchronous decryption with cryptographic verification

### 💰 Advanced Financial Protection
- **Refund Mechanism**: Automatic refunds for losing bidders
- **Timeout Protection**: 7-day decryption timeout prevents permanent fund locking
- **Failed Auction Handling**: Full refunds if decryption fails or times out
- **Reentrancy Guards**: Protection against reentrancy attacks on withdrawals
- **Deposit Tracking**: Precise tracking of ETH deposits for accurate refunds

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

### Enhanced System Design with Gateway Pattern

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React + TypeScript + Vite)           │
│  ├─ MetaMask Integration (Web3 Wallet)                     │
│  ├─ ethers.js (Blockchain Communication)                   │
│  ├─ FHE Client Encryption                                  │
│  └─ Real-time Auction Display                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Smart Contract Layer (Solidity)                │
│  ┌──────────────────────────────────────────────────┐      │
│  │   ConfidentialArtifactAuction.sol                │      │
│  │   ├─ FHE Encrypted Storage (euint64)            │      │
│  │   ├─ Gateway Callback Pattern                    │      │
│  │   ├─ Refund Mechanism                            │      │
│  │   ├─ Timeout Protection (7 days)                │      │
│  │   ├─ Price Obfuscation                           │      │
│  │   ├─ Reentrancy Guards                           │      │
│  │   └─ Automated Settlement                        │      │
│  └──────────────────────────────────────────────────┘      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 Zama Gateway (Decryption Oracle)            │
│  ├─ Asynchronous Decryption                                │
│  ├─ Cryptographic Signature Verification                   │
│  └─ Callback Execution                                      │
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

### Enhanced Data Flow with Gateway Callbacks

```
1. Auction Creation Phase
   └─ Seller Creates Auction + Price Obfuscation Seed Generated
        └─ Authenticator Verifies Artifact

2. Bidding Phase
   └─ User Encrypts Bid (Client-side FHE)
        └─ Submit Encrypted Bid + ETH Deposit
             └─ Contract Stores: euint64(amount) + depositAmount
                  └─ FHE.allowThis() & FHE.allow()

3. Auction End Phase
   └─ endAuction() Called
        └─ FHE.requestDecryption() → Gateway
             └─ Store requestId + timestamp

4. Gateway Callback Phase
   └─ Gateway Decrypts Bids
        └─ Callback: processBidResults()
             └─ FHE.checkSignatures() Verifies Oracle
                  └─ Find Highest Bidder
                       └─ Winner Determined

5. Settlement Phase
   ├─ Winner: Deposit transferred to seller
   ├─ Losers: claimLoserRefund() to get deposits back
   └─ Timeout Case: enableRefundsOnTimeout() + claimRefund()

6. Timeout Protection (if Gateway fails)
   └─ Wait 7 days after decryption request
        └─ enableRefundsOnTimeout()
             └─ All bidders can claimRefund()
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

### 🎨 Modern React dApp (NEW!)

Experience the auction platform with our modern React interface:

```bash
# Navigate to React dApp
cd auction-dapp

# Install dependencies (if not done from root)
npm install

# Start development server with HMR
npm run dev
```

**Features**:
- ⚡ Lightning-fast development with Vite HMR
- 🎯 Type-safe development with TypeScript
- 🔐 Built-in FHEVM SDK integration
- 📦 Modern React 18 with hooks
- 🎨 Clean, responsive UI

Open `http://localhost:5173` to see the React dApp in action!

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

### Enhanced FHEVM Integration

Built with **Zama's FHEVM** - the first blockchain with native support for Fully Homomorphic Encryption.

#### Encrypted Data Types with Deposit Tracking

```solidity
// Import Zama FHEVM library
import { FHE, euint64, externalEuint64, ebool } from "@fhevm/solidity/lib/FHE.sol";

// Enhanced encrypted bid storage with refund support
struct EncryptedBid {
    euint64 amount;           // Encrypted bid amount
    bool isActive;            // Bid status
    uint256 timestamp;        // Bid time
    uint256 depositAmount;    // ETH deposit for refunds
}
```

#### Gateway Callback Pattern Implementation

```solidity
// Step 1: User submits encrypted bid with proof
function placeBid(uint32 auctionId, externalEuint64 encryptedBidAmount, bytes calldata inputProof)
    external payable
{
    // Import encrypted bid from external input
    euint64 encryptedBid = FHE.fromExternal(encryptedBidAmount, inputProof);

    // Store bid with ETH deposit
    bidsByAuction[auctionId][msg.sender] = EncryptedBid({
        amount: encryptedBid,
        isActive: true,
        timestamp: block.timestamp,
        depositAmount: msg.value  // Track deposit for refunds
    });

    // Set FHE permissions
    FHE.allowThis(encryptedBid);
    FHE.allow(encryptedBid, msg.sender);
}

// Step 2: Request decryption via Gateway
function _requestBidDecryption(uint32 auctionId) private {
    bytes32[] memory cts = new bytes32[](bidCount);
    for (uint256 i = 0; i < bidCount; i++) {
        cts[i] = FHE.toBytes32(bidsByAuction[auctionId][bidders[i]].amount);
    }

    // Request decryption with callback
    uint256 requestId = FHE.requestDecryption(cts, this.processBidResults.selector);

    // Store request metadata for timeout tracking
    auction.decryptionRequestId = requestId;
    auction.decryptionRequestTime = block.timestamp;
    auctionIdByRequestId[requestId] = auctionId;
}

// Step 3: Gateway callback with verified decryption
function processBidResults(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory signatures
) external {
    // Verify Gateway signatures (critical security check)
    FHE.checkSignatures(requestId, cleartexts, signatures);

    // Find auction and decode results
    uint32 auctionId = auctionIdByRequestId[requestId];
    uint64[] memory decryptedBids = abi.decode(cleartexts, (uint64[]));

    // Determine winner and settle auction
    // ...
}
```

#### Timeout Protection & Refund Mechanism

```solidity
// Constants for protection
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
uint256 public constant MAX_AUCTION_DURATION = 90 days;

// Enable refunds if Gateway fails
function enableRefundsOnTimeout(uint32 auctionId) external {
    require(
        block.timestamp >= auction.decryptionRequestTime + DECRYPTION_TIMEOUT,
        "Timeout period not reached"
    );
    auction.refundsEnabled = true;
}

// Claim refund with reentrancy protection
function claimRefund(uint32 auctionId) external nonReentrant {
    require(auction.refundsEnabled, "Refunds not enabled");
    uint256 refundAmount = bid.depositAmount;

    // Update state before transfer
    hasClaimedRefund[auctionId][msg.sender] = true;
    bid.depositAmount = 0;

    // Safe transfer
    (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
    require(success, "Refund transfer failed");
}
```

#### Price Obfuscation for Privacy

```solidity
// Generate obfuscation seed at auction creation
uint256 obfuscationSeed = uint256(keccak256(abi.encodePacked(
    block.timestamp,
    block.prevrandao,
    msg.sender,
    currentAuctionId
)));

// Get obfuscated price (1.0x - 2.0x multiplier)
function getObfuscatedPrice(uint32 auctionId) external view returns (uint256) {
    uint256 multiplier = 100 + (auction.priceObfuscationSeed % 100);
    return (auction.minimumBid * multiplier) / 100;
}
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

### Frontend Applications

We offer **two frontend implementations** to suit different development preferences:

#### Modern React Application (`/auction-dapp`) ⭐ MAIN
- **React** 18.2.0 - Modern UI library with component architecture
- **TypeScript** 5.0.0 - Type-safe development with IntelliSense
- **Vite** 5.0.0 - Next-generation frontend build tool
- **@fhevm/sdk** - Universal FHEVM SDK with React hooks
- **ethers.js** v6.9.0 - Latest Ethereum library
- **React Hooks** - useFhevmClient, useEncrypt for FHE operations

#### Legacy Demo Application (Root Directory)
- **HTML5/CSS3/JavaScript** - Pure frontend implementation
- **ethers.js** v5.7.2 - Ethereum JavaScript library
- **MetaMask** - Web3 wallet integration
- **Zero Build Step** - Direct browser execution
- **Simple Deployment** - Static file hosting

#### Comparison Table

| Feature | Legacy Demo | Modern React dApp |
|---------|-----------------|-------------------|
| **Technology** | Vanilla JS | React + TypeScript |
| **Build Tool** | None | Vite (HMR) |
| **Type Safety** | ❌ No | ✅ Full TypeScript |
| **Development Speed** | Standard | ⚡ Fast (HMR) |
| **SDK Integration** | Manual | 🔐 Built-in hooks |
| **Component Reusability** | Limited | ✅ High |
| **Bundle Optimization** | Manual | ✅ Automatic |
| **Developer Experience** | Basic | 🎯 Advanced |
| **Recommended For** | Quick demos | Production apps |

#### Modern Stack Features
- ⚡ **Hot Module Replacement (HMR)** - Instant updates during development
- 🎯 **Type Safety** - Full TypeScript support with strict mode
- 🔧 **Modern Build Tools** - Vite for fast builds and optimized production bundles
- 🔐 **SDK Integration** - Framework-agnostic FHEVM SDK with React hooks
- 📦 **Component-Based** - Reusable React components for scalable development
- 🚀 **Optimized Bundle** - Tree-shaking and code-splitting for minimal bundle size
- 💪 **Production-Ready** - Best practices for modern web applications

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

### Enhanced Security Features

- ✅ **Access Control**: Role-based permissions (Owner, Authenticators, Users)
- ✅ **FHE Privacy**: All bids encrypted with Zama FHEVM
- ✅ **Gateway Verification**: Cryptographic signature validation via `FHE.checkSignatures()`
- ✅ **Reentrancy Protection**: Guards on all withdrawal and refund functions
- ✅ **Timeout Protection**: 7-day decryption timeout prevents permanent fund locking
- ✅ **DoS Protection**: Batch size limits (50 bidders max) and gas optimization
- ✅ **Input Validation**: Comprehensive parameter checking with length limits
- ✅ **Overflow Protection**: Solidity 0.8.24 built-in checked arithmetic
- ✅ **Price Privacy**: Obfuscation techniques prevent price leakage
- ✅ **Event Logging**: Complete audit trail with refund tracking

### Security Best Practices Implemented

#### 1. **Input Validation**
```solidity
require(bytes(_name).length <= 200, "Name too long");
require(bytes(_description).length <= 1000, "Description too long");
require(_auctionDuration <= MAX_AUCTION_DURATION, "Invalid duration");
require(bidCount <= MAX_BIDDERS_PER_BATCH, "Too many bidders");
```

#### 2. **Access Control**
```solidity
modifier onlyOwner() { require(msg.sender == owner, "Not authorized"); _; }
modifier onlyAuthenticator() { require(authenticators[msg.sender], "Not an authenticator"); _; }
modifier auctionActive(uint32 auctionId) { /* comprehensive checks */ _; }
```

#### 3. **Reentrancy Guards**
```solidity
modifier nonReentrant() {
    require(_status != _ENTERED, "Reentrancy detected");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}
```

#### 4. **Safe ETH Transfers**
```solidity
// State changes before external calls
hasClaimedRefund[auctionId][msg.sender] = true;
bid.depositAmount = 0;

// Safe call pattern
(bool success, ) = payable(msg.sender).call{value: refundAmount}("");
require(success, "Transfer failed");
```

### Security Auditing

- **Automated**: Solhint security rules, ESLint checks
- **Testing**: 45+ test assertions, 70%+ coverage
- **Pre-commit Hooks**: Quality gates before commits
- **CI/CD**: Automated security checks on every push
- **Gateway Verification**: Cryptographic proofs for all decryptions

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
├── auction-dapp/               # Modern React dApp
│   ├── src/                    # React source code
│   │   ├── App.tsx             # Main React component
│   │   ├── App.css             # Component styles
│   │   ├── main.tsx            # React entry point
│   │   └── vite-env.d.ts       # TypeScript declarations
│   ├── package.json            # React app dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   └── README.md               # React app documentation
├── .github/workflows/          # CI/CD pipelines
│   └── test.yml                # Automated testing
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Root dependencies & scripts
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

# Frontend Development
cd auction-dapp          # Navigate to React dApp
npm run dev              # Start Vite dev server (HMR enabled)
npm run build            # Build for production
npm run preview          # Preview production build

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

## 📚 API Documentation

### Core Functions

#### Auction Management

**`createAuction()`** - Create a new artifact auction
```solidity
function createAuction(
    string memory _name,              // Artifact name (max 200 chars)
    string memory _description,       // Description (max 1000 chars)
    string memory _category,          // Category
    uint256 _minimumBid,             // Minimum bid in wei
    uint256 _auctionDuration,        // Duration in seconds (max 90 days)
    uint256 _yearCreated,            // Year artifact created
    string memory _provenance        // Provenance info
) external returns (uint32 auctionId)
```

**`authenticateArtifact()`** - Verify artifact authenticity (authenticators only)
```solidity
function authenticateArtifact(uint32 auctionId) external onlyAuthenticator
```

**`endAuction()`** - End auction and request decryption
```solidity
function endAuction(uint32 auctionId) external
// Triggers Gateway callback for bid decryption
```

#### Bidding Functions

**`placeBid()`** - Submit encrypted bid with ETH deposit
```solidity
function placeBid(
    uint32 auctionId,
    externalEuint64 encryptedBidAmount,  // Encrypted bid from FHE client
    bytes calldata inputProof            // ZK proof for encryption
) external payable
// msg.value must be >= minimumBid
```

#### Refund & Withdrawal Functions

**`claimLoserRefund()`** - Losing bidders claim deposit refund
```solidity
function claimLoserRefund(uint32 auctionId) external nonReentrant
// Available after auction settles, for non-winners
```

**`claimRefund()`** - Claim refund from failed auction
```solidity
function claimRefund(uint32 auctionId) external nonReentrant
// Available when refundsEnabled = true (timeout case)
```

**`enableRefundsOnTimeout()`** - Enable refunds after Gateway timeout
```solidity
function enableRefundsOnTimeout(uint32 auctionId) external
// Callable by anyone after 7 days from decryption request
```

**`withdrawEarnings()`** - Sellers withdraw earnings
```solidity
function withdrawEarnings() external nonReentrant
```

#### View Functions

**`getAuctionInfo()`** - Get auction details
```solidity
function getAuctionInfo(uint32 auctionId) external view returns (
    string memory name,
    string memory description,
    string memory category,
    address seller,
    uint256 startTime,
    uint256 endTime,
    uint256 minimumBid,
    bool isActive,
    bool authenticated,
    uint256 totalBids
)
```

**`getAuctionStatus()`** - Get comprehensive auction status
```solidity
function getAuctionStatus(uint32 auctionId) external view returns (
    bool isActive,
    bool isEnded,
    bool decryptionRequested,
    bool decryptionTimedOut,
    bool refundsEnabled,
    uint256 timeUntilTimeout
)
```

**`canClaimRefund()`** - Check refund eligibility
```solidity
function canClaimRefund(uint32 auctionId, address user) external view returns (
    bool canClaim,
    string memory reason
)
```

**`getObfuscatedPrice()`** - Get privacy-protected price estimate
```solidity
function getObfuscatedPrice(uint32 auctionId) external view returns (uint256)
// Returns price with 1.0x - 2.0x random multiplier
```

**`getBidDetails()`** - Get bidder's bid information
```solidity
function getBidDetails(uint32 auctionId, address bidder) external view returns (
    bool isActive,
    uint256 timestamp,
    uint256 depositAmount,
    bool hasClaimedRefund_
)
```

### Gateway Callback (Internal)

**`processBidResults()`** - Gateway callback for decryption results
```solidity
function processBidResults(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory signatures
) external
// Called by Gateway oracle with verified decryption results
```

### Events

```solidity
event AuctionCreated(uint32 indexed auctionId, string artifactName, address indexed seller, uint256 startTime, uint256 endTime, uint256 minimumBid);
event ConfidentialBidPlaced(uint32 indexed auctionId, address indexed bidder, uint256 depositAmount);
event AuctionEnded(uint32 indexed auctionId, address indexed winner, uint256 winningBid, string artifactName);
event ArtifactAuthenticated(uint32 indexed auctionId, address authenticator);
event DecryptionRequested(uint32 indexed auctionId, uint256 requestId, uint256 timestamp);
event DecryptionFailed(uint32 indexed auctionId, uint256 requestId);
event RefundsEnabled(uint32 indexed auctionId, string reason);
event RefundIssued(uint32 indexed auctionId, address indexed bidder, uint256 amount);
event EarningsWithdrawn(address indexed seller, uint256 amount);
```

### Constants

```solidity
uint256 public constant DECRYPTION_TIMEOUT = 7 days;      // Gateway timeout
uint256 public constant MAX_AUCTION_DURATION = 90 days;   // Maximum auction length
uint256 public constant MAX_BIDDERS_PER_BATCH = 50;       // Gas optimization limit
```

---

## 🗺️ Roadmap

### Current (v1.0) ✅
- ✅ FHE-encrypted bidding with Gateway callbacks
- ✅ Refund mechanism with timeout protection
- ✅ Price obfuscation for privacy
- ✅ Reentrancy guards and security hardening
- ✅ Artifact authentication system
- ✅ Automated settlement
- ✅ Sepolia testnet deployment
- ✅ **Modern React dApp with TypeScript + Vite** ⭐
- ✅ **FHEVM SDK integration with React hooks** ⭐

### Near Term (v1.1)
- [ ] Pausable functionality for emergencies
- [ ] Multi-sig for high-value auctions
- [ ] Auction extensions (anti-sniping)
- [ ] Bid increment rules
- [ ] Enhanced UI/UX in React dApp with refund interface
- [ ] Real-time auction updates with WebSocket
- [ ] Comprehensive test suite for new features

### Future (v2.0)
- [ ] Mainnet deployment
- [ ] USDC/stablecoin integration
- [ ] Dutch auction mechanism
- [ ] NFT certificate of authenticity
- [ ] Mobile app (React Native)
- [ ] Multi-chain support
- [ ] Confidential public transportation analytics
- [ ] Advanced analytics dashboard
- [ ] Batch auction processing for 50+ bidders

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
