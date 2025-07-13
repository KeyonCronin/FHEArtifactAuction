# Quick Start Guide

## Prerequisites

- Node.js v16+
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Edit .env file with your credentials:
#    - PRIVATE_KEY (from MetaMask)
#    - ETHERSCAN_API_KEY (from etherscan.io)
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Local Development

```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy locally
npm run deploy

# Terminal 3: Run simulation
npm run simulate
```

## Deployment to Sepolia

### 1. Deploy Contract

```bash
npm run deploy:sepolia
```

**Output will include:**
- Contract address
- Transaction hash
- Etherscan link

### 2. Verify Contract (wait 2-3 minutes after deployment)

```bash
npm run verify
```

### 3. Interact with Contract

```bash
npm run interact
```

## Quick Commands Reference

| Command | What it does |
|---------|--------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run tests |
| `npm run deploy` | Deploy to localhost |
| `npm run deploy:sepolia` | Deploy to Sepolia |
| `npm run verify` | Verify on Etherscan |
| `npm run interact` | Interact with contract |
| `npm run simulate` | Run auction simulation |
| `npm run node` | Start local blockchain |
| `npm run clean` | Clean build files |

## Environment Variables

Required in `.env` file:

```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=0x_your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Get Test ETH

1. Go to https://sepoliafaucet.com/
2. Enter your wallet address
3. Request test ETH

## Get Etherscan API Key

1. Go to https://etherscan.io/
2. Sign up/login
3. Navigate to API Keys
4. Create new API key

## Common Issues

### "Insufficient funds"
- Get test ETH from Sepolia faucet

### "Verification failed"
- Wait 2-3 minutes after deployment
- Check ETHERSCAN_API_KEY in .env

### "Network not detected"
- Check SEPOLIA_RPC_URL in .env
- Verify internet connection

## Project Structure

```
confidential-artifact-auction/
├── contracts/               # Smart contracts
├── scripts/                # Deployment scripts
│   ├── deploy.js          # Deploy contract
│   ├── verify.js          # Verify on Etherscan
│   ├── interact.js        # Interact with contract
│   └── simulate.js        # Run simulation
├── test/                   # Test files
├── hardhat.config.js      # Hardhat settings
├── package.json           # Dependencies
└── .env                   # Your credentials (create this)
```

## Full Documentation

- **Deployment Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Project README:** See [README.md](README.md)
- **Project Summary:** See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## Support

For detailed instructions, see DEPLOYMENT.md

---

**Happy Building!**
