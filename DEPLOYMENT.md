# Deployment Guide

Complete guide for deploying and managing the Confidential Artifact Auction smart contract.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Compilation](#compilation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Network Information](#network-information)

## Prerequisites

Before deploying the contract, ensure you have:

- Node.js v16 or higher installed
- A Web3 wallet (MetaMask recommended)
- Test ETH on Sepolia testnet (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- An Etherscan API key (get from [Etherscan](https://etherscan.io/apis))

## Installation

1. Navigate to the project directory:

```bash
cd confidential-artifact-auction
```

2. Install dependencies:

```bash
npm install
```

This will install:
- Hardhat development environment
- Hardhat toolbox (includes testing, deployment, and verification tools)
- FHE Solidity library
- dotenv for environment variables

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` file with your credentials:

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Your wallet's private key (NEVER share this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Security Warning:** Never commit your `.env` file to version control. It's included in `.gitignore` by default.

### Getting Your Private Key

From MetaMask:
1. Open MetaMask
2. Click the three dots menu
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (keep it secure!)

### Getting an Etherscan API Key

1. Go to [Etherscan](https://etherscan.io/)
2. Create an account or log in
3. Navigate to "API Keys"
4. Click "Add" to create a new API key
5. Copy the API key to your `.env` file

## Compilation

Compile the smart contracts:

```bash
npm run compile
```

This will:
- Compile all contracts in the `contracts/` directory
- Generate TypeScript types
- Create artifacts in the `artifacts/` directory
- Generate cache files for faster subsequent compilations

**Output:**
```
Compiled 1 Solidity file successfully
```

## Testing

Run the test suite:

```bash
npm test
```

For testing with gas reporting:

```bash
REPORT_GAS=true npm test
```

## Deployment

### Deploy to Local Network

1. Start a local Hardhat node:

```bash
npm run node
```

This starts a local blockchain at `http://127.0.0.1:8545`

2. In a new terminal, deploy to localhost:

```bash
npm run deploy
```

### Deploy to Sepolia Testnet

Deploy the contract to Sepolia:

```bash
npm run deploy:sepolia
```

**Expected Output:**

```
Starting deployment process...

Deployment Configuration:
========================
Network: sepolia
Deployer address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
Account balance: 1.5 ETH

Deploying ConfidentialArtifactAuction contract...
ConfidentialArtifactAuction deployed to: 0x1234567890123456789012345678901234567890

Deployment Transaction Details:
==============================
Transaction hash: 0xabcdef...
Block number: 4567890
Gas used: 2500000

Contract Owner: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e

Deployment information saved to: deployments/sepolia-deployment.json

Sepolia Network Information:
===========================
Etherscan URL: https://sepolia.etherscan.io/address/0x1234567890123456789012345678901234567890

Next steps:
1. Verify the contract: npm run verify
2. Interact with the contract: npm run interact

IMPORTANT: Wait a few minutes before verifying to ensure the contract is indexed by Etherscan

Deployment process completed successfully!
```

### Deployment Artifacts

After deployment, a JSON file is created at `deployments/sepolia-deployment.json`:

```json
{
  "network": "sepolia",
  "contractName": "ConfidentialArtifactAuction",
  "contractAddress": "0x1234567890123456789012345678901234567890",
  "deployer": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "deploymentTransaction": "0xabcdef...",
  "blockNumber": 4567890,
  "timestamp": "2024-10-28T12:00:00.000Z",
  "owner": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
```

## Verification

Verify the deployed contract on Etherscan:

```bash
npm run verify
```

**Important:** Wait 2-3 minutes after deployment before running verification to ensure the contract is indexed by Etherscan.

**Expected Output:**

```
Starting contract verification process...

Verification Configuration:
==========================
Network: sepolia
Contract: ConfidentialArtifactAuction
Address: 0x1234567890123456789012345678901234567890

Submitting contract for verification...
This may take a few minutes...

Contract verified successfully!

View on Etherscan:
https://sepolia.etherscan.io/address/0x1234567890123456789012345678901234567890#code

Deployment information updated with verification status.
```

## Interaction

Interact with the deployed contract:

```bash
npm run interact
```

This script will:
- Connect to the deployed contract
- Display contract information (owner, current auction ID)
- Show active auctions and their details
- Provide examples for creating auctions and placing bids

**Example Output:**

```
Contract Interaction Script

Configuration:
=============
Network: sepolia
Signer: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
Balance: 1.5 ETH

Contract Address: 0x1234567890123456789012345678901234567890

=== Contract Information ===

Contract Owner: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
Current Auction ID: 5
Is Current Signer an Authenticator? true

=== Active Auctions ===

Number of Active Auctions: 2
Active Auction IDs: 3, 5

Details for Auction #3:
----------------------------
Name: Ancient Greek Vase
Description: Authentic 5th century BC amphora
Category: ceramic
Seller: 0xABC123...
Start Time: 10/28/2024, 10:00:00 AM
End Time: 11/4/2024, 10:00:00 AM
Minimum Bid: 1.0 ETH
Is Active: true
Authenticated: true
Total Bids: 3
```

## Simulation

Run a complete auction lifecycle simulation on localhost:

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Run simulation
npm run simulate
```

The simulation script will:
1. Deploy the contract
2. Add an authenticator
3. Create an auction
4. Authenticate the artifact
5. Place multiple encrypted bids
6. Display auction status and expected outcome

## Network Information

### Sepolia Testnet

| Parameter | Value |
|-----------|-------|
| Network Name | Sepolia |
| Chain ID | 11155111 |
| RPC URL | https://rpc.sepolia.org |
| Block Explorer | https://sepolia.etherscan.io |
| Faucets | [SepoliaFaucet.com](https://sepoliafaucet.com/) |

### Contract Address

After deployment, your contract will be available at:

**Sepolia:** `<YOUR_CONTRACT_ADDRESS>`

**Etherscan Link:** `https://sepolia.etherscan.io/address/<YOUR_CONTRACT_ADDRESS>`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run deploy` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify` | Verify contract on Etherscan |
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run auction simulation |
| `npm run node` | Start local Hardhat node |
| `npm run clean` | Clean artifacts and cache |

## Troubleshooting

### Common Issues

**1. Insufficient Funds**

Error: `sender doesn't have enough funds`

Solution: Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

**2. Verification Failed**

Error: `Etherscan API key is required`

Solution: Add your Etherscan API key to `.env` file

**3. Network Connection Issues**

Error: `could not detect network`

Solution: Check your RPC URL in `.env` file and ensure you have internet connectivity

**4. Already Verified**

Error: `Contract source code already verified`

Solution: This is not an error. Your contract is already verified on Etherscan.

**5. Private Key Error**

Error: `invalid private key`

Solution: Ensure your private key in `.env` starts with `0x` and is 64 characters long (excluding `0x`)

## Security Best Practices

1. **Never commit your `.env` file** - It contains sensitive information
2. **Use a dedicated deployment wallet** - Don't use your main wallet with large amounts
3. **Test on testnet first** - Always deploy to Sepolia before mainnet
4. **Verify contracts** - Always verify your contracts on Etherscan for transparency
5. **Audit before mainnet** - Get professional security audits before deploying to mainnet

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Zama FHE Documentation](https://docs.zama.ai/)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)
- [Etherscan API Documentation](https://docs.etherscan.io/)

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/KeyonCronin/ConfidentialArtifactAuction/issues)
- Review Hardhat documentation
- Consult Ethereum development communities

---

**Last Updated:** October 2024
