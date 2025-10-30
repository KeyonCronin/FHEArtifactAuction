import { useState, useEffect } from 'react';
import { FhevmProvider, useFhevmClient, useEncrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import './App.css';

function AuctionApp() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const [account, setAccount] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<string>('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    }
  };

  const placeBid = async () => {
    if (!client || !account) return;
    
    try {
      const encrypted = await encrypt(
        '0x...', // contract address
        account,
        (input) => input.add64(BigInt(bidAmount))
      );
      
      alert('Bid encrypted successfully! In production, this would submit to contract.');
      console.log('Encrypted bid:', encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <div className="app">
      <h1>🏛️ Confidential Artifact Auction</h1>
      <p>Encrypted bidding with FHEVM</p>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div className="auction-container">
          <p className="account">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          
          <div className="bid-form">
            <h2>Place Encrypted Bid</h2>
            <input
              type="number"
              placeholder="Bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button onClick={placeBid} disabled={isEncrypting || !bidAmount}>
              {isEncrypting ? 'Encrypting...' : 'Place Bid'}
            </button>
          </div>

          <div className="info-box">
            <h3>How it works:</h3>
            <ul>
              <li>Your bid is encrypted using FHE before submission</li>
              <li>No one can see your bid amount (not even the contract)</li>
              <li>Winner is determined after auction ends via decryption</li>
              <li>Full privacy for all participants</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  if (!provider) {
    return <div>Please install MetaMask</div>;
  }

  return (
    <FhevmProvider provider={provider}>
      <AuctionApp />
    </FhevmProvider>
  );
}
