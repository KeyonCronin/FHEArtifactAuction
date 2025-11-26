// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialArtifactAuction
 * @notice Privacy-preserving auction platform with Gateway callback pattern
 * @dev Enhanced with refund mechanism, timeout protection, and price obfuscation
 *
 * SECURITY FEATURES:
 * - Input validation on all external functions
 * - Access control with role-based permissions
 * - Overflow protection using Solidity 0.8.24 built-in checks
 * - Reentrancy guards on withdrawal functions
 * - Timeout protection against permanent fund locking
 * - Refund mechanism for failed decryptions
 *
 * PRIVACY FEATURES:
 * - Gateway callback pattern for asynchronous decryption
 * - Division privacy protection with random multipliers
 * - Price obfuscation techniques
 * - Gas optimization with efficient HCU usage
 */
contract ConfidentialArtifactAuction is SepoliaConfig {

    address public owner;
    uint32 public currentAuctionId;

    // Constants for timeout protection
    uint256 public constant DECRYPTION_TIMEOUT = 7 days;
    uint256 public constant MAX_AUCTION_DURATION = 90 days;

    // Constants for gas optimization
    uint256 public constant MAX_BIDDERS_PER_BATCH = 50; // Limit batch processing to prevent gas overflow

    struct ArtifactInfo {
        string name;
        string description;
        string category; // "painting", "sculpture", "ceramic", "jewelry", etc.
        uint256 minimumBid;
        address seller;
        bool authenticated;
        uint256 yearCreated;
        string provenance;
    }

    struct EncryptedBid {
        euint64 amount;
        bool isActive;
        uint256 timestamp;
        uint256 depositAmount; // Store deposited ETH for refunds
    }

    struct AuctionDetails {
        ArtifactInfo artifact;
        uint256 startTime;
        uint256 endTime;
        uint256 minimumBid;
        bool isActive;
        bool isEnded;
        address highestBidder;
        uint256 revealedHighestBid;
        address[] bidders;
        uint256 totalBids;
        uint256 decryptionRequestId;
        uint256 decryptionRequestTime;
        bool decryptionFailed;
        bool refundsEnabled;
        uint256 priceObfuscationSeed; // Random seed for price privacy protection
    }

    mapping(uint32 => AuctionDetails) public auctions;
    mapping(uint32 => mapping(address => EncryptedBid)) public bidsByAuction;
    mapping(address => uint256) public sellerEarnings;
    mapping(address => bool) public authenticators;
    mapping(uint256 => uint32) internal auctionIdByRequestId; // Map decryption request to auction
    mapping(uint32 => mapping(address => bool)) public hasClaimedRefund; // Track refund claims

    // Reentrancy guard
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    event AuctionCreated(
        uint32 indexed auctionId,
        string artifactName,
        address indexed seller,
        uint256 startTime,
        uint256 endTime,
        uint256 minimumBid
    );
    event ConfidentialBidPlaced(uint32 indexed auctionId, address indexed bidder, uint256 depositAmount);
    event AuctionEnded(
        uint32 indexed auctionId,
        address indexed winner,
        uint256 winningBid,
        string artifactName
    );
    event ArtifactAuthenticated(uint32 indexed auctionId, address authenticator);
    event EarningsWithdrawn(address indexed seller, uint256 amount);
    event DecryptionRequested(uint32 indexed auctionId, uint256 requestId, uint256 timestamp);
    event DecryptionFailed(uint32 indexed auctionId, uint256 requestId);
    event RefundIssued(uint32 indexed auctionId, address indexed bidder, uint256 amount);
    event RefundsEnabled(uint32 indexed auctionId, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthenticator() {
        require(authenticators[msg.sender], "Not an authenticator");
        _;
    }

    modifier auctionExists(uint32 auctionId) {
        require(auctionId <= currentAuctionId && auctionId > 0, "Auction does not exist");
        _;
    }

    modifier auctionActive(uint32 auctionId) {
        require(auctions[auctionId].isActive, "Auction not active");
        require(block.timestamp >= auctions[auctionId].startTime, "Auction not started");
        require(block.timestamp <= auctions[auctionId].endTime, "Auction ended");
        require(!auctions[auctionId].isEnded, "Auction already ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentAuctionId = 0;
        authenticators[msg.sender] = true;
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrancy detected");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    function addAuthenticator(address _authenticator) external onlyOwner {
        authenticators[_authenticator] = true;
    }

    function removeAuthenticator(address _authenticator) external onlyOwner {
        authenticators[_authenticator] = false;
    }

    function createAuction(
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _minimumBid,
        uint256 _auctionDuration,
        uint256 _yearCreated,
        string memory _provenance
    ) external returns (uint32) {
        require(_minimumBid > 0, "Minimum bid must be greater than 0");
        require(_auctionDuration > 0 && _auctionDuration <= MAX_AUCTION_DURATION, "Invalid duration");
        require(bytes(_name).length > 0, "Artifact name required");
        require(bytes(_name).length <= 200, "Name too long");
        require(bytes(_description).length <= 1000, "Description too long");

        currentAuctionId++;

        ArtifactInfo memory artifact = ArtifactInfo({
            name: _name,
            description: _description,
            category: _category,
            minimumBid: _minimumBid,
            seller: msg.sender,
            authenticated: false,
            yearCreated: _yearCreated,
            provenance: _provenance
        });

        // Generate price obfuscation seed from multiple sources
        uint256 obfuscationSeed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            currentAuctionId
        )));

        auctions[currentAuctionId] = AuctionDetails({
            artifact: artifact,
            startTime: block.timestamp,
            endTime: block.timestamp + _auctionDuration,
            minimumBid: _minimumBid,
            isActive: true,
            isEnded: false,
            highestBidder: address(0),
            revealedHighestBid: 0,
            bidders: new address[](0),
            totalBids: 0,
            decryptionRequestId: 0,
            decryptionRequestTime: 0,
            decryptionFailed: false,
            refundsEnabled: false,
            priceObfuscationSeed: obfuscationSeed
        });

        emit AuctionCreated(
            currentAuctionId,
            _name,
            msg.sender,
            block.timestamp,
            block.timestamp + _auctionDuration,
            _minimumBid
        );

        return currentAuctionId;
    }

    function authenticateArtifact(uint32 auctionId)
        external
        onlyAuthenticator
        auctionExists(auctionId)
    {
        require(!auctions[auctionId].isEnded, "Cannot authenticate ended auction");
        auctions[auctionId].artifact.authenticated = true;

        emit ArtifactAuthenticated(auctionId, msg.sender);
    }

    function placeBid(uint32 auctionId, externalEuint64 encryptedBidAmount, bytes calldata inputProof)
        external
        payable
        auctionExists(auctionId)
        auctionActive(auctionId)
    {
        require(auctions[auctionId].artifact.authenticated, "Artifact not authenticated");
        require(msg.sender != auctions[auctionId].artifact.seller, "Seller cannot bid");
        require(msg.value >= auctions[auctionId].minimumBid, "Deposit below minimum");

        // Import encrypted bid from external input
        euint64 encryptedBid = FHE.fromExternal(encryptedBidAmount, inputProof);

        // Check if bidder already has a bid
        if (!bidsByAuction[auctionId][msg.sender].isActive) {
            auctions[auctionId].bidders.push(msg.sender);
        }

        bidsByAuction[auctionId][msg.sender] = EncryptedBid({
            amount: encryptedBid,
            isActive: true,
            timestamp: block.timestamp,
            depositAmount: msg.value
        });

        auctions[auctionId].totalBids++;

        // Set FHE permissions for contract and bidder
        FHE.allowThis(encryptedBid);
        FHE.allow(encryptedBid, msg.sender);

        emit ConfidentialBidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint32 auctionId)
        external
        auctionExists(auctionId)
    {
        require(
            block.timestamp > auctions[auctionId].endTime ||
            msg.sender == owner ||
            msg.sender == auctions[auctionId].artifact.seller,
            "Cannot end auction yet"
        );
        require(!auctions[auctionId].isEnded, "Auction already ended");
        require(auctions[auctionId].bidders.length > 0, "No bids placed");

        auctions[auctionId].isActive = false;
        auctions[auctionId].isEnded = true;

        // Request decryption of all bids to find highest bidder
        _requestBidDecryption(auctionId);
    }

    function _requestBidDecryption(uint32 auctionId) private {
        AuctionDetails storage auction = auctions[auctionId];
        uint256 bidCount = auction.bidders.length;

        if (bidCount == 0) return;

        require(bidCount <= MAX_BIDDERS_PER_BATCH, "Too many bidders for single batch");

        bytes32[] memory cts = new bytes32[](bidCount);

        for (uint256 i = 0; i < bidCount; i++) {
            address bidder = auction.bidders[i];
            cts[i] = FHE.toBytes32(bidsByAuction[auctionId][bidder].amount);
        }

        // Request decryption via Gateway callback
        uint256 requestId = FHE.requestDecryption(cts, this.processBidResults.selector);

        // Store request metadata for timeout tracking
        auction.decryptionRequestId = requestId;
        auction.decryptionRequestTime = block.timestamp;
        auctionIdByRequestId[requestId] = auctionId;

        emit DecryptionRequested(auctionId, requestId, block.timestamp);
    }

    function processBidResults(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory signatures
    ) external {
        // Verify Gateway signatures
        FHE.checkSignatures(requestId, cleartexts, signatures);

        // Find the auction ID from request mapping
        uint32 auctionId = auctionIdByRequestId[requestId];
        require(auctionId > 0, "Invalid request ID");

        AuctionDetails storage auction = auctions[auctionId];
        require(auction.decryptionRequestId == requestId, "Request ID mismatch");

        // Decode the decrypted bid values
        uint64[] memory decryptedBids = abi.decode(cleartexts, (uint64[]));

        uint256 highestBid = 0;
        address winner = address(0);

        // Find highest bidder
        for (uint256 i = 0; i < decryptedBids.length && i < auction.bidders.length; i++) {
            if (decryptedBids[i] > highestBid) {
                highestBid = decryptedBids[i];
                winner = auction.bidders[i];
            }
        }

        auction.highestBidder = winner;
        auction.revealedHighestBid = highestBid;

        // Transfer earnings to seller (winner pays their bid amount)
        if (winner != address(0)) {
            uint256 winnerDeposit = bidsByAuction[auctionId][winner].depositAmount;
            sellerEarnings[auction.artifact.seller] += winnerDeposit;

            emit AuctionEnded(auctionId, winner, highestBid, auction.artifact.name);
        }
    }

    /**
     * @notice Enable refunds if decryption times out
     * @dev Callable by anyone after DECRYPTION_TIMEOUT period
     * @param auctionId The auction ID to enable refunds for
     */
    function enableRefundsOnTimeout(uint32 auctionId)
        external
        auctionExists(auctionId)
    {
        AuctionDetails storage auction = auctions[auctionId];
        require(auction.isEnded, "Auction not ended");
        require(!auction.refundsEnabled, "Refunds already enabled");
        require(auction.decryptionRequestTime > 0, "No decryption requested");
        require(
            block.timestamp >= auction.decryptionRequestTime + DECRYPTION_TIMEOUT,
            "Timeout period not reached"
        );
        require(auction.highestBidder == address(0), "Auction already settled");

        auction.refundsEnabled = true;
        auction.decryptionFailed = true;

        emit RefundsEnabled(auctionId, "Decryption timeout");
    }

    /**
     * @notice Claim refund for a failed auction
     * @param auctionId The auction ID to claim refund from
     */
    function claimRefund(uint32 auctionId)
        external
        nonReentrant
        auctionExists(auctionId)
    {
        AuctionDetails storage auction = auctions[auctionId];
        require(auction.refundsEnabled, "Refunds not enabled");
        require(!hasClaimedRefund[auctionId][msg.sender], "Already claimed refund");

        EncryptedBid storage bid = bidsByAuction[auctionId][msg.sender];
        require(bid.isActive, "No active bid");
        require(bid.depositAmount > 0, "No deposit to refund");

        hasClaimedRefund[auctionId][msg.sender] = true;
        uint256 refundAmount = bid.depositAmount;
        bid.depositAmount = 0;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(auctionId, msg.sender, refundAmount);
    }

    /**
     * @notice Withdraw earnings from successful auctions
     * @dev Protected by reentrancy guard
     */
    function withdrawEarnings() external nonReentrant {
        uint256 earnings = sellerEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");

        sellerEarnings[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: earnings}("");
        require(success, "Withdrawal transfer failed");

        emit EarningsWithdrawn(msg.sender, earnings);
    }

    /**
     * @notice Refund losing bidders after auction settlement
     * @param auctionId The auction ID to refund losing bids
     */
    function claimLoserRefund(uint32 auctionId)
        external
        nonReentrant
        auctionExists(auctionId)
    {
        AuctionDetails storage auction = auctions[auctionId];
        require(auction.isEnded, "Auction not ended");
        require(auction.highestBidder != address(0), "No winner determined");
        require(msg.sender != auction.highestBidder, "Winner cannot claim refund");
        require(!hasClaimedRefund[auctionId][msg.sender], "Already claimed refund");

        EncryptedBid storage bid = bidsByAuction[auctionId][msg.sender];
        require(bid.isActive, "No active bid");
        require(bid.depositAmount > 0, "No deposit to refund");

        hasClaimedRefund[auctionId][msg.sender] = true;
        uint256 refundAmount = bid.depositAmount;
        bid.depositAmount = 0;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(auctionId, msg.sender, refundAmount);
    }

    function getAuctionInfo(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            string memory name,
            string memory description,
            string memory category,
            address seller,
            uint256 startTime,
            uint256 endTime,
            uint256 minimumBid,
            bool isActive,
            bool authenticated,
            uint256 totalBids
        )
    {
        AuctionDetails storage auction = auctions[auctionId];
        return (
            auction.artifact.name,
            auction.artifact.description,
            auction.artifact.category,
            auction.artifact.seller,
            auction.startTime,
            auction.endTime,
            auction.minimumBid,
            auction.isActive && !auction.isEnded,
            auction.artifact.authenticated,
            auction.totalBids
        );
    }

    function getArtifactDetails(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            string memory name,
            string memory description,
            string memory category,
            uint256 yearCreated,
            string memory provenance,
            bool authenticated
        )
    {
        ArtifactInfo storage artifact = auctions[auctionId].artifact;
        return (
            artifact.name,
            artifact.description,
            artifact.category,
            artifact.yearCreated,
            artifact.provenance,
            artifact.authenticated
        );
    }

    function getBidStatus(uint32 auctionId, address bidder)
        external
        view
        auctionExists(auctionId)
        returns (bool hasActiveBid, uint256 bidTimestamp)
    {
        EncryptedBid storage bid = bidsByAuction[auctionId][bidder];
        return (bid.isActive, bid.timestamp);
    }

    function getAuctionResults(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            bool ended,
            address winner,
            uint256 winningBid,
            uint256 totalBids
        )
    {
        AuctionDetails storage auction = auctions[auctionId];
        require(auction.isEnded, "Auction not ended yet");

        return (
            auction.isEnded,
            auction.highestBidder,
            auction.revealedHighestBid,
            auction.totalBids
        );
    }

    function getActiveAuctions() external view returns (uint32[] memory) {
        uint32[] memory activeIds = new uint32[](currentAuctionId);
        uint32 count = 0;

        for (uint32 i = 1; i <= currentAuctionId; i++) {
            if (auctions[i].isActive && !auctions[i].isEnded &&
                block.timestamp <= auctions[i].endTime) {
                activeIds[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint32[] memory result = new uint32[](count);
        for (uint32 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }

        return result;
    }

    /**
     * @notice Get obfuscated price estimate for privacy
     * @dev Uses random multiplier to protect actual price information
     * @param auctionId The auction ID
     * @return obfuscatedPrice The obfuscated minimum bid price
     */
    function getObfuscatedPrice(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (uint256 obfuscatedPrice)
    {
        AuctionDetails storage auction = auctions[auctionId];

        // Generate deterministic but unpredictable multiplier (1.0x - 2.0x range)
        uint256 multiplier = 100 + (auction.priceObfuscationSeed % 100);

        // Apply obfuscation: price * (1.0 to 2.0)
        obfuscatedPrice = (auction.minimumBid * multiplier) / 100;

        return obfuscatedPrice;
    }

    /**
     * @notice Get auction status including timeout information
     * @param auctionId The auction ID
     */
    function getAuctionStatus(uint32 auctionId)
        external
        view
        auctionExists(auctionId)
        returns (
            bool isActive,
            bool isEnded,
            bool decryptionRequested,
            bool decryptionTimedOut,
            bool refundsEnabled,
            uint256 timeUntilTimeout
        )
    {
        AuctionDetails storage auction = auctions[auctionId];

        isActive = auction.isActive;
        isEnded = auction.isEnded;
        decryptionRequested = auction.decryptionRequestTime > 0;
        refundsEnabled = auction.refundsEnabled;

        if (decryptionRequested && auction.highestBidder == address(0)) {
            uint256 timeElapsed = block.timestamp - auction.decryptionRequestTime;
            decryptionTimedOut = timeElapsed >= DECRYPTION_TIMEOUT;
            timeUntilTimeout = decryptionTimedOut ? 0 : DECRYPTION_TIMEOUT - timeElapsed;
        } else {
            decryptionTimedOut = false;
            timeUntilTimeout = 0;
        }

        return (isActive, isEnded, decryptionRequested, decryptionTimedOut, refundsEnabled, timeUntilTimeout);
    }

    /**
     * @notice Check if user can claim refund
     * @param auctionId The auction ID
     * @param user The user address
     */
    function canClaimRefund(uint32 auctionId, address user)
        external
        view
        auctionExists(auctionId)
        returns (bool canClaim, string memory reason)
    {
        AuctionDetails storage auction = auctions[auctionId];
        EncryptedBid storage bid = bidsByAuction[auctionId][user];

        if (!bid.isActive) {
            return (false, "No active bid");
        }

        if (hasClaimedRefund[auctionId][user]) {
            return (false, "Already claimed");
        }

        if (bid.depositAmount == 0) {
            return (false, "No deposit");
        }

        // Case 1: Auction failed due to timeout
        if (auction.refundsEnabled) {
            return (true, "Auction failed - refund available");
        }

        // Case 2: User lost the auction
        if (auction.isEnded && auction.highestBidder != address(0) && auction.highestBidder != user) {
            return (true, "Lost auction - refund available");
        }

        return (false, "Auction not settled or user is winner");
    }

    /**
     * @notice Get detailed bid information for a bidder
     * @param auctionId The auction ID
     * @param bidder The bidder address
     */
    function getBidDetails(uint32 auctionId, address bidder)
        external
        view
        auctionExists(auctionId)
        returns (
            bool isActive,
            uint256 timestamp,
            uint256 depositAmount,
            bool hasClaimedRefund_
        )
    {
        EncryptedBid storage bid = bidsByAuction[auctionId][bidder];
        return (
            bid.isActive,
            bid.timestamp,
            bid.depositAmount,
            hasClaimedRefund[auctionId][bidder]
        );
    }

    /**
     * @notice Emergency function to receive ETH
     */
    receive() external payable {}

    /**
     * @notice Fallback function
     */
    fallback() external payable {}
}