const hre = require('hardhat');

async function main() {
  console.log('Auction Simulation Script\n');
  console.log('This script simulates a complete auction lifecycle\n');

  // Get signers
  const [deployer, seller, authenticator, bidder1, bidder2, bidder3] = await hre.ethers.getSigners();

  console.log('Simulation Participants:');
  console.log('=======================');
  console.log('Deployer/Owner:', deployer.address);
  console.log('Seller:', seller.address);
  console.log('Authenticator:', authenticator.address);
  console.log('Bidder 1:', bidder1.address);
  console.log('Bidder 2:', bidder2.address);
  console.log('Bidder 3:', bidder3.address);
  console.log('');

  // Deploy contract
  console.log('Step 1: Deploying Contract...');
  console.log('==============================');
  const ConfidentialArtifactAuction = await hre.ethers.getContractFactory('ConfidentialArtifactAuction');
  const auction = await ConfidentialArtifactAuction.deploy();
  await auction.waitForDeployment();
  const contractAddress = await auction.getAddress();
  console.log('Contract deployed at:', contractAddress);
  console.log('');

  // Add authenticator
  console.log('Step 2: Adding Authenticator...');
  console.log('================================');
  let tx = await auction.addAuthenticator(authenticator.address);
  await tx.wait();
  console.log('Authenticator added:', authenticator.address);
  console.log('');

  // Create auction
  console.log('Step 3: Creating Auction...');
  console.log('===========================');
  const artifactName = 'Roman Gold Coin';
  const description = 'Rare aureus featuring Emperor Augustus';
  const category = 'jewelry';
  const minimumBid = hre.ethers.parseEther('0.5');
  const auctionDuration = 24 * 60 * 60; // 24 hours
  const yearCreated = -27; // 27 BC
  const provenance = 'Discovered in Roman ruins, Italy 2010';

  tx = await auction.connect(seller).createAuction(
    artifactName,
    description,
    category,
    minimumBid,
    auctionDuration,
    yearCreated,
    provenance
  );

  const receipt = await tx.wait();

  // Extract auction ID from event
  let auctionId = 1;
  for (const log of receipt.logs) {
    try {
      const parsed = auction.interface.parseLog(log);
      if (parsed.name === 'AuctionCreated') {
        auctionId = parsed.args[0];
        break;
      }
    } catch (e) {
      // Skip logs that can't be parsed
    }
  }

  console.log('Auction created successfully!');
  console.log('Auction ID:', auctionId.toString());
  console.log('Artifact:', artifactName);
  console.log('Minimum Bid:', hre.ethers.formatEther(minimumBid), 'ETH');
  console.log('');

  // Get auction info
  const auctionInfo = await auction.getAuctionInfo(auctionId);
  console.log('Auction Details:');
  console.log('  Name:', auctionInfo[0]);
  console.log('  Seller:', auctionInfo[3]);
  console.log('  Authenticated:', auctionInfo[8]);
  console.log('');

  // Authenticate artifact
  console.log('Step 4: Authenticating Artifact...');
  console.log('===================================');
  tx = await auction.connect(authenticator).authenticateArtifact(auctionId);
  await tx.wait();
  console.log('Artifact authenticated by:', authenticator.address);

  const updatedInfo = await auction.getAuctionInfo(auctionId);
  console.log('Authentication status:', updatedInfo[8]);
  console.log('');

  // Place bids
  console.log('Step 5: Placing Encrypted Bids...');
  console.log('==================================');

  const bid1Amount = 600000000; // 0.6 ETH in wei (as uint64)
  const bid2Amount = 800000000; // 0.8 ETH
  const bid3Amount = 750000000; // 0.75 ETH

  console.log('Bidder 1 placing bid: 0.6 ETH');
  tx = await auction.connect(bidder1).placeBid(auctionId, bid1Amount);
  await tx.wait();
  console.log('Bid placed successfully');

  console.log('Bidder 2 placing bid: 0.8 ETH');
  tx = await auction.connect(bidder2).placeBid(auctionId, bid2Amount);
  await tx.wait();
  console.log('Bid placed successfully');

  console.log('Bidder 3 placing bid: 0.75 ETH');
  tx = await auction.connect(bidder3).placeBid(auctionId, bid3Amount);
  await tx.wait();
  console.log('Bid placed successfully');
  console.log('');

  // Check bid statuses
  console.log('Bid Status Check:');
  console.log('-----------------');
  const bid1Status = await auction.getBidStatus(auctionId, bidder1.address);
  const bid2Status = await auction.getBidStatus(auctionId, bidder2.address);
  const bid3Status = await auction.getBidStatus(auctionId, bidder3.address);

  console.log('Bidder 1 has active bid:', bid1Status[0]);
  console.log('Bidder 2 has active bid:', bid2Status[0]);
  console.log('Bidder 3 has active bid:', bid3Status[0]);
  console.log('');

  // Get updated auction info
  const finalInfo = await auction.getAuctionInfo(auctionId);
  console.log('Auction Status:');
  console.log('  Total Bids:', finalInfo[9].toString());
  console.log('  Is Active:', finalInfo[7]);
  console.log('');

  // Check active auctions
  console.log('Step 6: Checking Active Auctions...');
  console.log('====================================');
  const activeAuctions = await auction.getActiveAuctions();
  console.log('Number of active auctions:', activeAuctions.length);
  console.log('Active auction IDs:', activeAuctions.map(id => id.toString()).join(', '));
  console.log('');

  console.log('Note: To end the auction and reveal the winner, the auction duration must expire');
  console.log('or the owner/seller must call endAuction(). In a real scenario, this would be');
  console.log('done after the auction period ends.');
  console.log('');

  console.log('Expected outcome when auction ends:');
  console.log('  Winner: Bidder 2 (highest bid of 0.8 ETH)');
  console.log('  Winning Bid: 0.8 ETH');
  console.log('  Seller Earnings: 0.8 ETH');
  console.log('');

  console.log('=================================');
  console.log('Simulation Completed Successfully!');
  console.log('=================================');
  console.log('');
  console.log('Summary:');
  console.log('  Contract deployed:', contractAddress);
  console.log('  Auction created: ID', auctionId.toString());
  console.log('  Artifact authenticated: Yes');
  console.log('  Bids placed: 3');
  console.log('  Auction status: Active');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Simulation failed:', error);
    process.exit(1);
  });
