# Confidential Artifact Auction

> Privacy-Preserving Ancient Artifact & Fine Art Bidding Platform powered by Fully Homomorphic Encryption (FHE)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://confidential-artifact-auction.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FHE Powered](https://img.shields.io/badge/FHE-Enabled-purple)](https://github.com/zama-ai/fhevm)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow)](https://hardhat.org/)

## Overview

Confidential Artifact Auction is a revolutionary blockchain-based auction platform that enables collectors, museums, and art dealers to bid on authentic historical artifacts and fine art pieces while maintaining complete **bidding privacy**. Using Fully Homomorphic Encryption (FHE), all bid amounts remain encrypted on-chain, ensuring fair auctions without revealing sensitive information.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Development Workflow

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Start local node
npm run node

# Deploy locally (in another terminal)
npm run deploy

# Run simulation
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

## Core Concept: FHE-Powered Confidential Auctions

### What is FHE (Fully Homomorphic Encryption)?

Traditional blockchain auctions suffer from a critical flaw: **all bids are publicly visible**. This transparency allows competitors to:
- Monitor each other's bidding strategies
- Engage in bid sniping
- Manipulate auction outcomes
- Exploit price discovery mechanisms

**Our Solution:** FHE allows computations directly on encrypted data without decryption. Bidders submit encrypted bids that remain confidential throughout the auction, only revealing the winner after the auction ends.

### Auction Lifecycle

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

## Features

### For Sellers
- List rare artifacts with detailed provenance
- Set minimum bids to protect asset value
- Authentication system for expert verification
- Automated settlement upon auction completion
- Comprehensive artifact documentation

### For Bidders
- Submit encrypted bids without revealing amounts
- Real-time auction status monitoring
- Bid history tracking across multiple auctions
- Secure wallet integration via MetaMask
- Instant notifications for auction events

### For Authenticators
- Verification role for trusted experts
- Quality assurance to prevent fraud
- Reputation system through verification history

## Technology Stack

### Blockchain & Smart Contracts
- **Solidity 0.8.24** - Smart contract language
- **Hardhat** - Development framework
- **FHE Library** - Zama's fhevm for encrypted computations
- **Network** - Ethereum-compatible chains (Sepolia testnet)
- **Wallet** - MetaMask integration

### Frontend
- **Pure JavaScript** - No build dependencies
- **ethers.js v5.7.2** - Web3 library
- **Modern CSS** - Glassmorphism effects
- **Responsive Design** - Desktop and mobile support

### Development Tools
- **Hardhat Toolbox** - Comprehensive development suite
- **Hardhat Verify** - Automated Etherscan verification
- **dotenv** - Environment variable management

## Project Structure

```
confidential-artifact-auction/
├── contracts/                    # Smart contracts
│   └── ConfidentialArtifactAuction.sol
├── scripts/                      # Deployment and interaction scripts
│   ├── deploy.js                # Main deployment script
│   ├── verify.js                # Etherscan verification
│   ├── interact.js              # Contract interaction
│   └── simulate.js              # Auction simulation
├── test/                         # Test files
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment template
├── DEPLOYMENT.md                # Deployment guide
└── README.md                    # This file
```

## Smart Contract Interface

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
    uint64 _bidAmount  // FHE-encrypted bid
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

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run deploy` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify` | Verify contract on Etherscan |
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run complete auction simulation |
| `npm run node` | Start local Hardhat node |
| `npm run clean` | Clean artifacts and cache |
| `npm run dev` | Start local HTTP server for frontend |

## Network Information

### Sepolia Testnet

| Parameter | Value |
|-----------|-------|
| Network Name | Sepolia |
| Chain ID | 11155111 |
| RPC URL | https://rpc.sepolia.org |
| Block Explorer | https://sepolia.etherscan.io |
| Faucet | https://sepoliafaucet.com/ |

### Contract Address

**Sepolia:** `0x7070e99539Ba0B0212CD3aC243033CA37eB07849`

**Etherscan:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x7070e99539Ba0B0212CD3aC243033CA37eB07849)

## Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment

1. **Configure environment:**
```bash
cp .env.example .env
# Add your PRIVATE_KEY and ETHERSCAN_API_KEY
```

2. **Deploy to Sepolia:**
```bash
npm run deploy:sepolia
```

3. **Verify contract:**
```bash
npm run verify
```

4. **Interact with contract:**
```bash
npm run interact
```

## Security Features

### Privacy Guarantees
- Bid amounts encrypted using FHE (euint64)
- No bid amounts stored in plaintext
- Winner identity revealed only after auction ends
- Losers' bids remain permanently confidential
- Blockchain immutability prevents tampering

### Security Measures
- Reentrancy protection on withdrawals
- Access control for authenticators
- Time-locked auction endings
- Minimum bid enforcement
- Authentication requirement before bidding

## Use Cases

1. **Museum Acquisitions** - Acquire rare artifacts without revealing budgets
2. **Private Collector Auctions** - Bid on exclusive pieces with complete privacy
3. **Estate Sales** - Liquidate valuable collections with dignity
4. **Archaeological Discoveries** - Bid on newly discovered artifacts confidentially
5. **Repatriation Programs** - Negotiate artifact returns through private bids

## Contributing

We welcome contributions from the community!

### Areas for Contribution
- FHE algorithm optimization
- Gas efficiency improvements
- UI/UX enhancements
- Additional artifact categories
- Multi-language support
- Mobile app development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Zama** - For pioneering FHE technology and the fhevm library
- **Ethereum Foundation** - For robust blockchain infrastructure
- **Hardhat** - For excellent development tools
- **OpenZeppelin** - For secure smart contract libraries

## Support & Resources

- **Live Demo:** [https://confidential-artifact-auction.vercel.app/](https://confidential-artifact-auction.vercel.app/)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Hardhat Docs:** [https://hardhat.org/docs](https://hardhat.org/docs)
- **FHE Docs:** [https://docs.zama.ai/](https://docs.zama.ai/)

## Disclaimer

This platform is provided for demonstration and educational purposes. Users should conduct their own due diligence when participating in auctions. Always verify artifact authenticity through independent experts before making significant purchases.

---

Built with privacy and transparency in mind for the Art & Antiquities Community
