// Confidential Artifact Auction DApp
class AuctionApp {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.contractAddress = "0x7070e99539Ba0B0212CD3aC243033CA37eB07849";
        this.contractABI = [
            "function owner() view returns (address)",
            "function currentAuctionId() view returns (uint32)",
            "function createAuction(string memory _name, string memory _description, string memory _category, uint256 _minimumBid, uint256 _auctionDuration, uint256 _yearCreated, string memory _provenance) returns (uint32)",
            "function authenticateArtifact(uint32 auctionId)",
            "function placeBid(uint32 auctionId, uint64 _bidAmount)",
            "function endAuction(uint32 auctionId)",
            "function withdrawEarnings()",
            "function getAuctionInfo(uint32 auctionId) view returns (string memory name, string memory description, string memory category, address seller, uint256 startTime, uint256 endTime, uint256 minimumBid, bool isActive, bool authenticated, uint256 totalBids)",
            "function getArtifactDetails(uint32 auctionId) view returns (string memory name, string memory description, string memory category, uint256 yearCreated, string memory provenance, bool authenticated)",
            "function getBidStatus(uint32 auctionId, address bidder) view returns (bool hasActiveBid, uint256 bidTimestamp)",
            "function getAuctionResults(uint32 auctionId) view returns (bool ended, address winner, uint256 winningBid, uint256 totalBids)",
            "function getActiveAuctions() view returns (uint32[])",
            "function addAuthenticator(address _authenticator)",
            "function removeAuthenticator(address _authenticator)",
            "function authenticators(address) view returns (bool)",
            "event AuctionCreated(uint32 indexed auctionId, string artifactName, address indexed seller, uint256 startTime, uint256 endTime, uint256 minimumBid)",
            "event ConfidentialBidPlaced(uint32 indexed auctionId, address indexed bidder)",
            "event AuctionEnded(uint32 indexed auctionId, address indexed winner, uint256 winningBid, string artifactName)",
            "event ArtifactAuthenticated(uint32 indexed auctionId, address authenticator)",
            "event EarningsWithdrawn(address indexed seller, uint256 amount)"
        ];

        this.contractBytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008060016101000a81548163ffffffff021916908363ffffffff16021790555060016004600033673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506127d0806100d96000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a2578063b88d4fde11610071578063b88d4fde146102e8578063c87b56dd14610304578063e985e9c514610334578063f2fde38b14610364578063f3993d111461038057610116565b8063715018a6146102805780638da5cb5b1461028a57806395d89b41146102a8578063a22cb465146102c657610116565b806323b872dd116100e957806323b872dd146101c257806342842e0e146101de5780636352211e146101fa5780636c0360eb1461022a57806370a082311461024857610116565b806301ffc9a71461011b57806306fdde031461014b578063081812fc14610169578063095ea7b314610199575b600080fd5b61013560048036038101906101309190611a85565b610398565b6040516101429190611acd565b60405180910390f35b61015361047a565b6040516101609190611b78565b60405180910390f35b610183600480360381019061017e9190611bd0565b61050c565b6040516101909190611c3e565b60405180910390f35b6101b360048036038101906101ae9190611c85565b610552565b005b6101dc60048036038101906101d79190611cc5565b610669565b005b6101f860048036038101906101f39190611cc5565b6106c9565b005b610214600480360381019061020f9190611bd0565b6106e9565b6040516102219190611c3e565b60405180910390f35b61023261079a565b60405161023f9190611b78565b60405180910390f35b610262600480360381019061025d9190611d18565b610828565b60405161026f9190611d54565b60405180910390f35b6102886108df565b005b610292610967565b60405161029f9190611c3e565b60405180910390f35b6102b0610990565b6040516102bd9190611b78565b60405180910390f35b6102e060048036038101906102db9190611d9b565b610a22565b005b61030260048036038101906102fd9190611f10565b610a38565b005b61031e60048036038101906103199190611bd0565b610a9a565b60405161032b9190611b78565b60405180910390f35b61034e60048036038101906103499190611f93565b610b41565b60405161035b9190611acd565b60405180910390f35b61037e60048036038101906103799190611d18565b610bd5565b005b610398600480360381019061039391906120b4565b610ccc565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061046357507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610473575061047282610e37565b5b9050919050565b606060008054610489906121e3565b80601f01602080910402602001604051908101604052809291908181526020018280546104b5906121e3565b80156105025780601f106104d757610100808354040283529160200191610502565b820191906000526020600020905b8154815290600101906020018083116104e557829003601f168201915b5050505050905090565b600061051782610ea1565b610556576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054d90612287565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061055d826106e9565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156105ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c590612319565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166105ed610f0d565b73ffffffffffffffffffffffffffffffffffffffff16148061061c575061061b81610616610f0d565b610b41565b5b61065b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610652906123ab565b60405180910390fd5b6106658383610f15565b5050565b61067a610674610f0d565b82610fce565b6106b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b09061243d565b60405180910390fd5b6106c48383836110ac565b505050565b6106e483838360405180602001604052806000815250610a38565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610791576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610788906124cf565b60405180910390fd5b80915050919050565b600680546107a7906121e3565b80601f01602080910402602001604051908101604052809291908181526020018280546107d3906121e3565b80156108205780601f106107f557610100808354040283529160200191610820565b820191906000526020600020905b81548152906001019060200180831161080357829003601f168201915b505050505081565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610899576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089090612561565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6108e7610f0d565b73ffffffffffffffffffffffffffffffffffffffff16610905610967565b73ffffffffffffffffffffffffffffffffffffffff161461095b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610952906125cd565b60405180910390fd5b6109656000611313565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606001805461099f906121e3565b80601f01602080910402602001604051908101604052809291908181526020018280546109cb906121e3565b8015610a185780601f106109ed57610100808354040283529160200191610a18565b820191906000526020600020905b8154815290600101906020018083116109fb57829003601f168201915b5050505050905090565b610a34610a2d610f0d565b83836113d7565b5050565b610a49610a43610f0d565b83610fce565b610a88576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7f9061243d565b60405180910390fd5b610a9484848484611544565b50505050565b6060610aa582610ea1565b610ae4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610adb9061265f565b60405180910390fd5b6000610aee6115a0565b90506000815111610b0e5760405180602001604052806000815250610b39565b80610b1884611632565b604051602001610b299291906126bb565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610bdd610f0d565b73ffffffffffffffffffffffffffffffffffffffff16610bfb610967565b73ffffffffffffffffffffffffffffffffffffffff1614610c51576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c48906125cd565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610cc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb890612751565b60405180910390fd5b610cca81611313565b50565b610cd4610f0d565b73ffffffffffffffffffffffffffffffffffffffff16610cf2610967565b73ffffffffffffffffffffffffffffffffffffffff1614610d48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3f906125cd565b60405180910390fd5b60008251905060005b81811015610e31576000848281518110610d6e57610d6d612771565b5b602002602001015190506000848381518110610d8d57610d8c612771565b5b60200260200101519050610da081611793565b610ddf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dd6906127ec565b60405180910390fd5b610de982826117d4565b7f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d412139688585858481518110610e1e57610e1d612771565b5b6020026020010151604051610e339190611c3e565b60405180910390a1505080610e479061283b565b9050610d51565b50505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610f88836106e9565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610fd982610ea1565b611018576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100f906128f6565b60405180910390fd5b6000611023836106e9565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148061109257508373ffffffffffffffffffffffffffffffffffffffff1661107a8461050c565b73ffffffffffffffffffffffffffffffffffffffff16145b806110a357506110a28185610b41565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff166110cc826106e9565b73ffffffffffffffffffffffffffffffffffffffff1614611122576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111990612988565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611192576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118990612a1a565b60405180910390fd5b61119d8383836118d4565b6111a8600082610f15565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546111f89190612a3a565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461124f9190612a6e565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a461130e8383836118d9565b505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611446576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161143d90612b10565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516115379190611acd565b60405180910390a3505050565b61154f8484846110ac565b61155b848484846118de565b61159a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161159190612ba2565b60405180910390fd5b50505050565b6060600680546115af906121e3565b80601f01602080910402602001604051908101604052809291908181526020018280546115db906121e3565b80156116285780601f106115fd57610100808354040283529160200191611628565b820191906000526020600020905b81548152906001019060200180831161160b57829003601f168201915b5050505050905090565b6060600082141561167a576040518060400160405280600181526020017f3000000000000000000000000000000000000000000000000000000000000000815250905061178e565b600082905060005b600082146116ac5780806116959061283b565b915050600a826116a59190612bf1565b9150611682565b60008167ffffffffffffffff8111156116c8576116c7611de5565b5b6040519080825280601f01601f1916602001820160405280156116fa5781602001600182028036833780820191505090505b5090505b600085146117875760018261171391906130a565b9150600a856117229190612c22565b603061172e9190612a6e565b60f81b81838151811061174457611743612771565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856117809190612bf1565b94506116fe565b8093505050505b919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611844576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161183b90612c9f565b60405180910390fd5b61184d81610ea1565b1561188d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161188490612d0b565b60405180910390fd5b611899600083836118d4565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546118e99190612a6e565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a46119aa600083836118d9565b5050565b505050565b505050565b60006119d06119cb84612d4b565b612d26565b9050828152602081018484840111156119ec576119eb612d79565b5b6119f7848285612d7e565b509392505050565b600081359050611a0e81612e7e565b92915050565b600081359050611a2381612e95565b92915050565b600081359050611a3881612eac565b92915050565b600081519050611a4d81612eac565b92915050565b600082601f830112611a6857611a67612d74565b5b8135611a788482602086016119bd565b91505092915050565b600060208284031215611a9757611a96612d88565b5b6000611aa584828501611a29565b91505092915050565b600060208284031215611ac457611ac3612d88565b5b6000611ad284828501611a3e565b91505092915050565b611ae481612e18565b82525050565b611af381612e2a565b82525050565b6000611b0482612d7c565b611b0e8185612d87565b9350611b1e818560208601612d8d565b611b2781612dc0565b840191505092915050565b6000611b3d82612d7c565b611b478185612d98565b9350611b57818560208601612d8d565b80840191505092915050565b611b6c81612e68565b82525050565b6000602082019050611b876000830184611adb565b92915050565b6000602082019050611ba26000830184611aea565b92915050565b60006020820190508181036000830152611bc28184611af9565b905092915050565b600060208284031215611be057611bdf612d88565b5b6000611bee848285016119ff565b91505092915050565b60008060408385031215611c0e57611c0d612d88565b5b6000611c1c858286016119ff565b9250506020611c2d85828601611a14565b9150509250929050565b600060208201905081810360008301526119ff565b600060408201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b600060208201905081810360008301526119ff565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061221b57019150806020021061220057019150806020021061208657019150806020021061206a57019150806020021061205657019150806020021061204257019150806020021061203757019150806020021061202d57019150806020021061202357019150808202811115611fa1576020026000fd5b611faa81612e68565b8114611fb557600080fd5b50565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c0000602082015250565b600061205482612038565b905081810360008301526120688184611af9565b905092915050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206e6f7220617070726f766564000000000000000000000000000000000000602082015250565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60008201527f7574206f6620626f756e64730000000000000000000000000000000000000000602082015250565b6000611a0e82612e48565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008201527f73206e6f74206f776e0000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b60006121f482611e0e565b915081905092915050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b6000819050818103905092915050565b600061260882611e48565b91506126138361260d565b925082821015612626576126256121f9565b5b828103905092915050565b600061264c82611e48565b915061265783611e48565b925082612667576126666122fb565b5b828206905092915050565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b6000604051905090565b600067ffffffffffffffff82111561270e5761270d612d85565b5b61271782612dc0565b9050602081019050919050565b82818337600083830152505050565b600061273e82612e28565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156127915780820151818401526020810190506127ea565b838111156127a0576000848401525b50505050565b600060028204905060018216806127be57019150602002919050565b61271081612e48565b8114612728576000000080fd5b50565b61275081612e28565b811461275b57600080fd5b50565b61276781612e48565b811461277257600080fd5b50565b61277e81612e58565b811461278957600080fd5b5056fea2646970667358221220abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd64736f6c63430008070033";

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkWalletConnection();
        this.loadAuctions();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });

        // Contract deployment
        document.getElementById('deployContract').addEventListener('click', () => {
            this.deployContract();
        });

        // Create auction form
        document.getElementById('createAuctionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAuction();
        });

        // Authenticate artifact
        document.getElementById('authenticateBtn').addEventListener('click', () => {
            this.authenticateArtifact();
        });

        // End auction
        document.getElementById('endAuctionBtn').addEventListener('click', () => {
            this.endAuction();
        });

        // Withdraw earnings
        document.getElementById('withdrawBtn').addEventListener('click', () => {
            this.withdrawEarnings();
        });

        // Get auction results
        document.getElementById('getResultsBtn').addEventListener('click', () => {
            this.getAuctionResults();
        });
    }

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabId).classList.add('active');

        // Add active class to selected tab
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Load auctions when switching to auctions tab
        if (tabId === 'auctions') {
            this.loadAuctions();
        }
    }

    async checkWalletConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await this.connectWallet();
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
            }
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                this.showError('Please install MetaMask to use this application');
                return;
            }

            console.log('Requesting accounts...');
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            console.log('Creating provider...');
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();

            console.log('Getting address...');
            const address = await this.signer.getAddress();
            const network = await this.provider.getNetwork();

            console.log('Connected:', address, network);

            document.getElementById('walletAddress').textContent = `${address.substring(0, 6)}...${address.substring(38)}`;
            document.getElementById('networkName').textContent = network.name || `Chain ID: ${network.chainId}`;

            // Try to load existing contract
            console.log('Loading contract...');
            await this.loadContract();

            this.showSuccess('Wallet connected successfully');

        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
        }
    }

    async loadContract() {
        // For demo purposes, we'll show deploy button if no contract is set
        // In production, you would have a deployed contract address
        if (!this.contractAddress) {
            document.getElementById('contractStatus').textContent = 'Not deployed';
            document.getElementById('deployContract').style.display = 'inline-block';
        } else {
            try {
                this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
                console.log('Contract created:', this.contractAddress);

                // Try to get current auction ID to verify contract is working
                try {
                    const currentId = await this.contract.currentAuctionId();
                    console.log('Current auction ID:', currentId.toString());
                    document.getElementById('contractStatus').textContent = `Connected (${currentId} auctions)`;
                } catch (e) {
                    console.log('Cannot get auction ID, contract may not be deployed or different ABI:', e.message);
                    document.getElementById('contractStatus').textContent = `Address: ${this.contractAddress.substring(0, 10)}...`;
                }

                document.getElementById('deployContract').style.display = 'none';
            } catch (error) {
                console.error('Error loading contract:', error);
                document.getElementById('contractStatus').textContent = 'Error loading contract';
            }
        }
    }

    async deployContract() {
        try {
            this.showInfo('Deploying contract...');

            const factory = new ethers.ContractFactory(this.contractABI, this.contractBytecode, this.signer);
            const contract = await factory.deploy();
            await contract.deployed();

            this.contractAddress = contract.address;
            this.contract = contract;

            document.getElementById('contractStatus').textContent = `Deployed at ${this.contractAddress.substring(0, 10)}...`;
            document.getElementById('deployContract').style.display = 'none';

            this.showSuccess('Contract deployed successfully!');
            this.loadAuctions();

        } catch (error) {
            console.error('Error deploying contract:', error);
            this.showError('Failed to deploy contract: ' + error.message);
        }
    }

    async createAuction() {
        try {
            if (!this.contract) {
                this.showError('Please connect wallet and deploy contract first');
                return;
            }

            const name = document.getElementById('artifactName').value;
            const description = document.getElementById('artifactDescription').value;
            const category = document.getElementById('artifactCategory').value;
            const yearCreated = parseInt(document.getElementById('yearCreated').value);
            const provenance = document.getElementById('provenance').value;
            const minimumBid = ethers.utils.parseEther(document.getElementById('minimumBid').value);
            const duration = parseInt(document.getElementById('auctionDuration').value) * 3600; // Convert hours to seconds

            this.showInfo('Creating auction...');

            const tx = await this.contract.createAuction(
                name,
                description,
                category,
                minimumBid,
                duration,
                yearCreated,
                provenance
            );

            await tx.wait();

            this.showSuccess('Auction created successfully!');
            document.getElementById('createAuctionForm').reset();
            this.loadAuctions();

        } catch (error) {
            console.error('Error creating auction:', error);
            this.showError('Failed to create auction: ' + error.message);
        }
    }

    async authenticateArtifact() {
        try {
            if (!this.contract) {
                this.showError('Please connect wallet and deploy contract first');
                return;
            }

            const auctionId = parseInt(document.getElementById('authAuctionId').value);
            if (!auctionId) {
                this.showError('Please enter a valid auction ID');
                return;
            }

            // Check if auction exists
            try {
                await this.contract.getAuctionInfo(auctionId);
            } catch (e) {
                this.showError(`Auction ID ${auctionId} does not exist. Please create an auction first.`);
                return;
            }

            this.showInfo('Authenticating artifact...');

            const tx = await this.contract.authenticateArtifact(auctionId);
            await tx.wait();

            this.showSuccess('Artifact authenticated successfully!');
            this.loadAuctions();

        } catch (error) {
            console.error('Error authenticating artifact:', error);
            this.showError('Failed to authenticate artifact: ' + error.message);
        }
    }

    async placeBid(auctionId) {
        try {
            const bidAmount = prompt('Enter your bid amount (ETH):');
            if (!bidAmount) return;

            const bidValue = parseFloat(bidAmount);
            if (bidValue <= 0) {
                this.showError('Bid amount must be greater than 0');
                return;
            }

            this.showInfo('Placing bid...');

            // Convert to uint64 for FHEVM
            const bidInWei = Math.floor(bidValue * 1e18);
            const tx = await this.contract.placeBid(auctionId, bidInWei);
            await tx.wait();

            this.showSuccess('Bid placed successfully!');
            this.loadAuctions();

        } catch (error) {
            console.error('Error placing bid:', error);
            this.showError('Failed to place bid: ' + error.message);
        }
    }

    async endAuction() {
        try {
            if (!this.contract) {
                this.showError('Please connect wallet and deploy contract first');
                return;
            }

            const auctionId = parseInt(document.getElementById('endAuctionId').value);
            if (!auctionId) {
                this.showError('Please enter a valid auction ID');
                return;
            }

            this.showInfo('Ending auction...');

            const tx = await this.contract.endAuction(auctionId);
            await tx.wait();

            this.showSuccess('Auction ended successfully!');
            this.loadAuctions();

        } catch (error) {
            console.error('Error ending auction:', error);
            this.showError('Failed to end auction: ' + error.message);
        }
    }

    async withdrawEarnings() {
        try {
            if (!this.contract) {
                this.showError('Please connect wallet and deploy contract first');
                return;
            }

            this.showInfo('Withdrawing earnings...');

            const tx = await this.contract.withdrawEarnings();
            await tx.wait();

            this.showSuccess('Earnings withdrawn successfully!');

        } catch (error) {
            console.error('Error withdrawing earnings:', error);
            this.showError('Failed to withdraw earnings: ' + error.message);
        }
    }

    async getAuctionResults() {
        try {
            if (!this.contract) {
                this.showError('Please connect wallet and deploy contract first');
                return;
            }

            const auctionId = parseInt(document.getElementById('resultAuctionId').value);
            if (!auctionId) {
                this.showError('Please enter a valid auction ID');
                return;
            }

            const results = await this.contract.getAuctionResults(auctionId);

            const resultsDiv = document.getElementById('auctionResults');
            resultsDiv.innerHTML = `
                <div class="card">
                    <h4>Auction ${auctionId} Results</h4>
                    <p><strong>Ended:</strong> ${results.ended ? 'Yes' : 'No'}</p>
                    <p><strong>Winner:</strong> ${results.winner}</p>
                    <p><strong>Winning Bid:</strong> ${ethers.utils.formatEther(results.winningBid)} ETH</p>
                    <p><strong>Total Bids:</strong> ${results.totalBids.toString()}</p>
                </div>
            `;

        } catch (error) {
            console.error('Error getting auction results:', error);
            this.showError('Failed to get auction results: ' + error.message);
        }
    }

    async loadAuctions() {
        try {
            if (!this.contract) {
                document.getElementById('auctionsList').innerHTML = '<div class="loading">Please connect wallet and deploy contract first</div>';
                return;
            }

            document.getElementById('auctionsList').innerHTML = '<div class="loading">Loading auctions...</div>';

            const currentAuctionId = await this.contract.currentAuctionId();
            const auctionsHtml = [];

            for (let i = 1; i <= currentAuctionId; i++) {
                try {
                    const auctionInfo = await this.contract.getAuctionInfo(i);
                    const artifactDetails = await this.contract.getArtifactDetails(i);

                    const endTime = new Date(auctionInfo.endTime * 1000);
                    const now = new Date();
                    const isActive = auctionInfo.isActive && now <= endTime;

                    auctionsHtml.push(`
                        <div class="auction-item">
                            <h4>${auctionInfo.name}</h4>
                            <p><strong>Category:</strong> ${auctionInfo.category}</p>
                            <p><strong>Description:</strong> ${auctionInfo.description}</p>
                            <p><strong>Year Created:</strong> ${artifactDetails.yearCreated}</p>
                            <p><strong>Minimum Bid:</strong> ${ethers.utils.formatEther(auctionInfo.minimumBid)} ETH</p>
                            <p><strong>Total Bids:</strong> ${auctionInfo.totalBids}</p>
                            <p><strong>End Time:</strong> ${endTime.toLocaleString()}</p>
                            <p><strong>Status:</strong>
                                <span class="auction-status ${isActive ? 'status-active' : 'status-ended'}">
                                    ${isActive ? 'Active' : 'Ended'}
                                </span>
                                ${auctionInfo.authenticated ?
                                    '<span class="auction-status status-authenticated">Authenticated</span>' :
                                    '<span class="auction-status">Not Authenticated</span>'
                                }
                            </p>
                            ${isActive && auctionInfo.authenticated ?
                                `<button class="btn" onclick="app.placeBid(${i})">Place Bid</button>` :
                                ''
                            }
                        </div>
                    `);
                } catch (error) {
                    console.error(`Error loading auction ${i}:`, error);
                }
            }

            document.getElementById('auctionsList').innerHTML = auctionsHtml.length > 0 ?
                auctionsHtml.join('') :
                '<div class="loading">No auctions found</div>';

        } catch (error) {
            console.error('Error loading auctions:', error);
            document.getElementById('auctionsList').innerHTML = '<div class="error">Failed to load auctions</div>';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }

    showInfo(message) {
        // You can implement info messages similar to success/error
        this.showSuccess(message);
    }
}

// Initialize the application
let app;
window.addEventListener('DOMContentLoaded', () => {
    // Check if ethers.js is loaded
    if (typeof ethers === 'undefined') {
        console.error('Ethers.js failed to load');
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                <h2>Loading Error</h2>
                <p>Failed to load ethers.js library. Please check your internet connection and refresh the page.</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px;">Refresh Page</button>
            </div>
        `;
        return;
    }

    app = new AuctionApp();
});