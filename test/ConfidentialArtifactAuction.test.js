const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ConfidentialArtifactAuction", function () {
  let signers;
  let auction;
  let contractAddress;

  async function deployAuctionFixture() {
    const [deployer, seller, authenticator, bidder1, bidder2, bidder3] = await ethers.getSigners();

    const ConfidentialArtifactAuction = await ethers.getContractFactory("ConfidentialArtifactAuction");
    const auctionContract = await ConfidentialArtifactAuction.deploy();
    await auctionContract.waitForDeployment();

    const address = await auctionContract.getAddress();

    return {
      auction: auctionContract,
      contractAddress: address,
      deployer,
      seller,
      authenticator,
      bidder1,
      bidder2,
      bidder3
    };
  }

  beforeEach(async function () {
    const fixture = await loadFixture(deployAuctionFixture);
    auction = fixture.auction;
    contractAddress = fixture.contractAddress;
    signers = {
      deployer: fixture.deployer,
      seller: fixture.seller,
      authenticator: fixture.authenticator,
      bidder1: fixture.bidder1,
      bidder2: fixture.bidder2,
      bidder3: fixture.bidder3
    };
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await auction.getAddress()).to.be.properAddress;
    });

    it("should set deployer as owner", async function () {
      expect(await auction.owner()).to.equal(signers.deployer.address);
    });

    it("should set deployer as authenticator", async function () {
      expect(await auction.authenticators(signers.deployer.address)).to.be.true;
    });

    it("should initialize with zero auctions", async function () {
      expect(await auction.currentAuctionId()).to.equal(0);
    });
  });

  describe("Authenticator Management", function () {
    it("should allow owner to add authenticator", async function () {
      await auction.addAuthenticator(signers.authenticator.address);
      expect(await auction.authenticators(signers.authenticator.address)).to.be.true;
    });

    it("should allow owner to remove authenticator", async function () {
      await auction.addAuthenticator(signers.authenticator.address);
      await auction.removeAuthenticator(signers.authenticator.address);
      expect(await auction.authenticators(signers.authenticator.address)).to.be.false;
    });

    it("should reject non-owner adding authenticator", async function () {
      await expect(
        auction.connect(signers.seller).addAuthenticator(signers.authenticator.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should reject non-owner removing authenticator", async function () {
      await expect(
        auction.connect(signers.seller).removeAuthenticator(signers.deployer.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Auction Creation", function () {
    const artifactName = "Ancient Roman Coin";
    const description = "Rare aureus from 50 BC";
    const category = "jewelry";
    const minimumBid = ethers.parseEther("1.0");
    const auctionDuration = 7 * 24 * 60 * 60; // 7 days
    const yearCreated = -50;
    const provenance = "Found in Roman ruins";

    it("should create auction successfully", async function () {
      const tx = await auction.connect(signers.seller).createAuction(
        artifactName,
        description,
        category,
        minimumBid,
        auctionDuration,
        yearCreated,
        provenance
      );

      await expect(tx).to.emit(auction, "AuctionCreated");
      expect(await auction.currentAuctionId()).to.equal(1);
    });

    it("should set correct auction parameters", async function () {
      await auction.connect(signers.seller).createAuction(
        artifactName,
        description,
        category,
        minimumBid,
        auctionDuration,
        yearCreated,
        provenance
      );

      const auctionInfo = await auction.getAuctionInfo(1);
      expect(auctionInfo[0]).to.equal(artifactName);
      expect(auctionInfo[1]).to.equal(description);
      expect(auctionInfo[2]).to.equal(category);
      expect(auctionInfo[3]).to.equal(signers.seller.address);
      expect(auctionInfo[6]).to.equal(minimumBid);
    });

    it("should reject auction with zero minimum bid", async function () {
      await expect(
        auction.connect(signers.seller).createAuction(
          artifactName,
          description,
          category,
          0,
          auctionDuration,
          yearCreated,
          provenance
        )
      ).to.be.revertedWith("Minimum bid must be greater than 0");
    });

    it("should reject auction with zero duration", async function () {
      await expect(
        auction.connect(signers.seller).createAuction(
          artifactName,
          description,
          category,
          minimumBid,
          0,
          yearCreated,
          provenance
        )
      ).to.be.revertedWith("Duration must be greater than 0");
    });

    it("should reject auction with empty name", async function () {
      await expect(
        auction.connect(signers.seller).createAuction(
          "",
          description,
          category,
          minimumBid,
          auctionDuration,
          yearCreated,
          provenance
        )
      ).to.be.revertedWith("Artifact name required");
    });

    it("should increment auction ID", async function () {
      await auction.connect(signers.seller).createAuction(
        artifactName,
        description,
        category,
        minimumBid,
        auctionDuration,
        yearCreated,
        provenance
      );

      await auction.connect(signers.seller).createAuction(
        "Second Artifact",
        description,
        category,
        minimumBid,
        auctionDuration,
        yearCreated,
        provenance
      );

      expect(await auction.currentAuctionId()).to.equal(2);
    });
  });

  describe("Artifact Authentication", function () {
    beforeEach(async function () {
      await auction.addAuthenticator(signers.authenticator.address);
      await auction.connect(signers.seller).createAuction(
        "Test Artifact",
        "Description",
        "painting",
        ethers.parseEther("1.0"),
        7 * 24 * 60 * 60,
        1900,
        "Test provenance"
      );
    });

    it("should allow authenticator to authenticate", async function () {
      const tx = await auction.connect(signers.authenticator).authenticateArtifact(1);
      await expect(tx).to.emit(auction, "ArtifactAuthenticated");

      const auctionInfo = await auction.getAuctionInfo(1);
      expect(auctionInfo[8]).to.be.true;
    });

    it("should reject non-authenticator authentication", async function () {
      await expect(
        auction.connect(signers.bidder1).authenticateArtifact(1)
      ).to.be.revertedWith("Not an authenticator");
    });

    it("should reject authentication of non-existent auction", async function () {
      await expect(
        auction.connect(signers.authenticator).authenticateArtifact(999)
      ).to.be.revertedWith("Auction does not exist");
    });
  });

  describe("Bidding", function () {
    beforeEach(async function () {
      await auction.addAuthenticator(signers.authenticator.address);
      await auction.connect(signers.seller).createAuction(
        "Test Artifact",
        "Description",
        "painting",
        ethers.parseEther("0.5"),
        7 * 24 * 60 * 60,
        1900,
        "Test provenance"
      );
      await auction.connect(signers.authenticator).authenticateArtifact(1);
    });

    it("should accept valid bid", async function () {
      const bidAmount = ethers.parseEther("1.0");
      const tx = await auction.connect(signers.bidder1).placeBid(1, bidAmount);
      await expect(tx).to.emit(auction, "ConfidentialBidPlaced");
    });

    it("should reject bid below minimum", async function () {
      const bidAmount = ethers.parseEther("0.1");
      await expect(
        auction.connect(signers.bidder1).placeBid(1, bidAmount)
      ).to.be.revertedWith("Bid below minimum");
    });

    it("should reject bid on unauthenticated auction", async function () {
      await auction.connect(signers.seller).createAuction(
        "Unauth Artifact",
        "Description",
        "painting",
        ethers.parseEther("1.0"),
        7 * 24 * 60 * 60,
        1900,
        "Test provenance"
      );

      await expect(
        auction.connect(signers.bidder1).placeBid(2, ethers.parseEther("2.0"))
      ).to.be.revertedWith("Artifact not authenticated");
    });

    it("should reject seller bidding on own auction", async function () {
      await expect(
        auction.connect(signers.seller).placeBid(1, ethers.parseEther("1.0"))
      ).to.be.revertedWith("Seller cannot bid");
    });

    it("should track multiple bids", async function () {
      await auction.connect(signers.bidder1).placeBid(1, ethers.parseEther("1.0"));
      await auction.connect(signers.bidder2).placeBid(1, ethers.parseEther("1.5"));
      await auction.connect(signers.bidder3).placeBid(1, ethers.parseEther("2.0"));

      const auctionInfo = await auction.getAuctionInfo(1);
      expect(auctionInfo[9]).to.equal(3); // totalBids
    });

    it("should update bid status", async function () {
      await auction.connect(signers.bidder1).placeBid(1, ethers.parseEther("1.0"));

      const bidStatus = await auction.getBidStatus(1, signers.bidder1.address);
      expect(bidStatus[0]).to.be.true; // hasActiveBid
    });
  });

  describe("Active Auctions", function () {
    it("should return empty array when no auctions", async function () {
      const activeAuctions = await auction.getActiveAuctions();
      expect(activeAuctions.length).to.equal(0);
    });

    it("should return active auctions", async function () {
      await auction.connect(signers.seller).createAuction(
        "Artifact 1",
        "Description",
        "painting",
        ethers.parseEther("1.0"),
        7 * 24 * 60 * 60,
        1900,
        "Provenance"
      );

      const activeAuctions = await auction.getActiveAuctions();
      expect(activeAuctions.length).to.equal(1);
      expect(activeAuctions[0]).to.equal(1);
    });

    it("should not include ended auctions", async function () {
      await auction.connect(signers.seller).createAuction(
        "Artifact 1",
        "Description",
        "painting",
        ethers.parseEther("1.0"),
        1, // 1 second duration
        1900,
        "Provenance"
      );

      await time.increase(2); // Wait 2 seconds

      const activeAuctions = await auction.getActiveAuctions();
      expect(activeAuctions.length).to.equal(0);
    });
  });

  describe("Artifact Details", function () {
    beforeEach(async function () {
      await auction.connect(signers.seller).createAuction(
        "Test Artifact",
        "Test Description",
        "sculpture",
        ethers.parseEther("1.0"),
        7 * 24 * 60 * 60,
        1850,
        "Test Provenance"
      );
    });

    it("should return correct artifact details", async function () {
      const details = await auction.getArtifactDetails(1);

      expect(details[0]).to.equal("Test Artifact");
      expect(details[1]).to.equal("Test Description");
      expect(details[2]).to.equal("sculpture");
      expect(details[3]).to.equal(1850);
      expect(details[4]).to.equal("Test Provenance");
      expect(details[5]).to.be.false; // not authenticated yet
    });

    it("should reject details for non-existent auction", async function () {
      await expect(
        auction.getArtifactDetails(999)
      ).to.be.revertedWith("Auction does not exist");
    });
  });

  describe("Edge Cases", function () {
    it("should handle maximum duration", async function () {
      const maxDuration = 365 * 24 * 60 * 60; // 1 year

      await expect(
        auction.connect(signers.seller).createAuction(
          "Long Auction",
          "Description",
          "painting",
          ethers.parseEther("1.0"),
          maxDuration,
          1900,
          "Provenance"
        )
      ).to.not.be.reverted;
    });

    it("should handle negative year created", async function () {
      await expect(
        auction.connect(signers.seller).createAuction(
          "Ancient Artifact",
          "Description",
          "jewelry",
          ethers.parseEther("1.0"),
          7 * 24 * 60 * 60,
          -500, // 500 BC
          "Provenance"
        )
      ).to.not.be.reverted;
    });

    it("should handle very long strings", async function () {
      const longString = "A".repeat(1000);

      await expect(
        auction.connect(signers.seller).createAuction(
          longString,
          longString,
          "category",
          ethers.parseEther("1.0"),
          7 * 24 * 60 * 60,
          1900,
          longString
        )
      ).to.not.be.reverted;
    });
  });

  describe("Gas Optimization", function () {
    it("should have reasonable deployment cost", async function () {
      const ConfidentialArtifactAuction = await ethers.getContractFactory("ConfidentialArtifactAuction");
      const deployment = await ConfidentialArtifactAuction.deploy();
      const receipt = await deployment.deploymentTransaction().wait();

      expect(receipt.gasUsed).to.be.lt(5000000); // Less than 5M gas
    });

    it("should have reasonable auction creation cost", async function () {
      const tx = await auction.connect(signers.seller).createAuction(
        "Test",
        "Description",
        "painting",
        ethers.parseEther("1.0"),
        7 * 24 * 60 * 60,
        1900,
        "Provenance"
      );
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(500000); // Less than 500k gas
    });
  });
});
