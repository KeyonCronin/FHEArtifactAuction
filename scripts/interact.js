const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Contract Interaction Script\n');

  const network = hre.network.name;
  const [signer] = await hre.ethers.getSigners();

  console.log('Configuration:');
  console.log('=============');
  console.log('Network:', network);
  console.log('Signer:', signer.address);
  console.log('Balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), 'ETH');
  console.log('');

  // Load deployment information
  const deploymentPath = path.join(__dirname, '..', 'deployments', `${network}-deployment.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`Error: Deployment file not found at ${deploymentPath}`);
    console.error('Please deploy the contract first.');
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  console.log('Contract Address:', contractAddress);
  console.log('');

  // Connect to the contract
  const ConfidentialArtifactAuction = await hre.ethers.getContractFactory('ConfidentialArtifactAuction');
  const auction = ConfidentialArtifactAuction.attach(contractAddress);

  console.log('Connected to ConfidentialArtifactAuction contract\n');

  // Example interactions
  console.log('=== Contract Information ===\n');

  // Get owner
  const owner = await auction.owner();
  console.log('Contract Owner:', owner);

  // Get current auction ID
  const currentAuctionId = await auction.currentAuctionId();
  console.log('Current Auction ID:', currentAuctionId.toString());
  console.log('');

  // Check if signer is an authenticator
  const isAuthenticator = await auction.authenticators(signer.address);
  console.log('Is Current Signer an Authenticator?', isAuthenticator);
  console.log('');

  // Get active auctions
  console.log('=== Active Auctions ===\n');
  const activeAuctions = await auction.getActiveAuctions();
  console.log('Number of Active Auctions:', activeAuctions.length);

  if (activeAuctions.length > 0) {
    console.log('Active Auction IDs:', activeAuctions.map(id => id.toString()).join(', '));
    console.log('');

    // Get details of the first active auction
    const firstAuctionId = activeAuctions[0];
    console.log(`Details for Auction #${firstAuctionId}:`);
    console.log('----------------------------');

    const auctionInfo = await auction.getAuctionInfo(firstAuctionId);
    console.log('Name:', auctionInfo[0]);
    console.log('Description:', auctionInfo[1]);
    console.log('Category:', auctionInfo[2]);
    console.log('Seller:', auctionInfo[3]);
    console.log('Start Time:', new Date(Number(auctionInfo[4]) * 1000).toLocaleString());
    console.log('End Time:', new Date(Number(auctionInfo[5]) * 1000).toLocaleString());
    console.log('Minimum Bid:', hre.ethers.formatEther(auctionInfo[6]), 'ETH');
    console.log('Is Active:', auctionInfo[7]);
    console.log('Authenticated:', auctionInfo[8]);
    console.log('Total Bids:', auctionInfo[9].toString());
    console.log('');

    // Get artifact details
    const artifactDetails = await auction.getArtifactDetails(firstAuctionId);
    console.log('Artifact Details:');
    console.log('Year Created:', artifactDetails[3].toString());
    console.log('Provenance:', artifactDetails[4]);
    console.log('');
  } else {
    console.log('No active auctions found.');
    console.log('');
  }

  // Example: Create a new auction (commented out by default)
  console.log('=== Example Operations ===\n');
  console.log('To create a new auction, uncomment and modify the following code:');
  console.log('');
  console.log('const tx = await auction.createAuction(');
  console.log('  "Ancient Greek Vase",');
  console.log('  "Authentic 5th century BC amphora",');
  console.log('  "ceramic",');
  console.log('  hre.ethers.parseEther("1.0"),');
  console.log('  7 * 24 * 60 * 60, // 7 days duration');
  console.log('  -450,');
  console.log('  "Excavated from Athens archaeological site"');
  console.log(');');
  console.log('await tx.wait();');
  console.log('');

  /*
  // Uncomment to create a test auction
  console.log('Creating a test auction...');
  const tx = await auction.createAuction(
    "Ancient Greek Vase",
    "Authentic 5th century BC amphora with detailed paintings",
    "ceramic",
    hre.ethers.parseEther("1.0"),
    7 * 24 * 60 * 60, // 7 days
    -450,
    "Excavated from Athens archaeological site in 1985"
  );

  const receipt = await tx.wait();
  console.log('Auction created! Transaction hash:', receipt.hash);

  // Find the AuctionCreated event
  const event = receipt.logs.find(log => {
    try {
      const parsed = auction.interface.parseLog(log);
      return parsed.name === 'AuctionCreated';
    } catch (e) {
      return false;
    }
  });

  if (event) {
    const parsed = auction.interface.parseLog(event);
    console.log('New Auction ID:', parsed.args[0].toString());
  }
  */

  console.log('');
  console.log('Interaction script completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Interaction failed:', error);
    process.exit(1);
  });
