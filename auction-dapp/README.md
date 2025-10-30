# Confidential Artifact Auction dApp

Real-world example demonstrating FHEVM SDK integration for encrypted bidding.

## Features

- Encrypted bid submission using FHE
- Privacy-preserving auction mechanism
- Integration with FHEVM SDK
- React + Vite setup
- TypeScript support

## Getting Started

### Install Dependencies

From monorepo root:

```bash
npm install
```

### Run Development Server

```bash
npm run dev:auction
```

Then open the application in your browser.

## How It Works

1. **Connect Wallet**: Connect MetaMask to interact
2. **Place Bid**: Enter bid amount - it will be encrypted before submission
3. **Privacy**: Bids remain encrypted on-chain
4. **Winner**: Determined after auction ends via decryption

## SDK Integration

This example shows real-world FHEVM SDK usage:

```tsx
import { FhevmProvider, useFhevmClient, useEncrypt } from '@fhevm/sdk/react';

function AuctionApp() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();

  const placeBid = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, (input) => {
      input.add64(BigInt(bidAmount));
    });
    
    // Submit to contract
    await contract.placeBid(encrypted.handles[0], encrypted.inputProof);
  };
}
```

## Contract Integration

This connects to the ConfidentialArtifactAuction contract from the main project.

Contract features:
- Encrypted bid storage
- Artifact authentication
- Automatic winner determination
- Seller earnings management

## License

MIT
