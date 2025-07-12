const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting contract verification process...\n');

  const network = hre.network.name;

  // Load deployment information
  const deploymentPath = path.join(__dirname, '..', 'deployments', `${network}-deployment.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`Error: Deployment file not found at ${deploymentPath}`);
    console.error('Please deploy the contract first using: npm run deploy:sepolia');
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  console.log('Verification Configuration:');
  console.log('==========================');
  console.log('Network:', network);
  console.log('Contract:', deploymentInfo.contractName);
  console.log('Address:', contractAddress);
  console.log('');

  if (network === 'localhost' || network === 'hardhat') {
    console.log('Verification is not required for local networks.');
    console.log('Exiting...');
    process.exit(0);
  }

  try {
    console.log('Submitting contract for verification...');
    console.log('This may take a few minutes...\n');

    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log('');
    console.log('Contract verified successfully!');
    console.log('');
    console.log('View on Etherscan:');
    if (network === 'sepolia') {
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
    }
    console.log('');

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verifiedAt = new Date().toISOString();

    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log('Deployment information updated with verification status.');

  } catch (error) {
    if (error.message.includes('Already Verified')) {
      console.log('Contract is already verified on Etherscan!');
      console.log('');
      if (network === 'sepolia') {
        console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
      }
    } else {
      console.error('Verification failed:', error.message);
      console.error('');
      console.error('Common issues:');
      console.error('1. Make sure ETHERSCAN_API_KEY is set in your .env file');
      console.error('2. Wait a few minutes after deployment before verifying');
      console.error('3. Ensure the contract was compiled with the same settings');
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Verification process failed:', error);
    process.exit(1);
  });
