const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting deployment process...\n');

  // Get network information
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deployment Configuration:');
  console.log('========================');
  console.log('Network:', network);
  console.log('Deployer address:', deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'ETH');
  console.log('');

  // Deploy the contract
  console.log('Deploying ConfidentialArtifactAuction contract...');
  const ConfidentialArtifactAuction = await hre.ethers.getContractFactory('ConfidentialArtifactAuction');
  const auction = await ConfidentialArtifactAuction.deploy();

  await auction.waitForDeployment();

  const contractAddress = await auction.getAddress();
  console.log('ConfidentialArtifactAuction deployed to:', contractAddress);
  console.log('');

  // Get deployment transaction details
  const deployTx = auction.deploymentTransaction();
  console.log('Deployment Transaction Details:');
  console.log('==============================');
  console.log('Transaction hash:', deployTx.hash);
  console.log('Block number:', deployTx.blockNumber);
  console.log('Gas used:', deployTx.gasLimit.toString());
  console.log('');

  // Verify contract owner
  const owner = await auction.owner();
  console.log('Contract Owner:', owner);
  console.log('');

  // Save deployment information
  const deploymentInfo = {
    network: network,
    contractName: 'ConfidentialArtifactAuction',
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTransaction: deployTx.hash,
    blockNumber: deployTx.blockNumber,
    timestamp: new Date().toISOString(),
    owner: owner,
  };

  const deploymentPath = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  const fileName = `${network}-deployment.json`;
  fs.writeFileSync(
    path.join(deploymentPath, fileName),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`Deployment information saved to: deployments/${fileName}`);
  console.log('');

  // Network-specific information
  if (network === 'sepolia') {
    console.log('Sepolia Network Information:');
    console.log('===========================');
    console.log('Etherscan URL:', `https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Verify the contract: npm run verify');
    console.log('2. Interact with the contract: npm run interact');
    console.log('');
    console.log('IMPORTANT: Wait a few minutes before verifying to ensure the contract is indexed by Etherscan');
  } else if (network === 'localhost' || network === 'hardhat') {
    console.log('Local Network Deployment Complete');
    console.log('=================================');
    console.log('You can now interact with the contract using the interact or simulate scripts');
  }

  console.log('Deployment process completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
