// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "solmate/src/tokens/ERC721.sol";
import "solmate/src/utils/LibString.sol";
import "solmate/src/auth/Owned.sol";
import "hardhat/console.sol";
contract ContractMe is ERC721, Owned {
    using LibString for uint256;

    struct Star {
        uint256 tokenId;
        string name;
        string github;
        string x;
        string email;
    }
    
    mapping(address => uint256) lastWalkTime;
    mapping(address => uint256) public userTokens;
    mapping(uint256 => Star) private tokenCardStorage;
    uint256 tokenIdCounter = 1;
    uint256 public mintPrice = 0.0005 ether;
    uint256 public modifyPrice = 0.0001 ether;
    string[] starsImsage;
    address _owner;
    error ALREADY_MINTED();
    error NOT_MINTED();
    error NOT_OWNER();
    error ERROR_PRICE();
    error TransferFailed();
    event MINT_SUCCESS(uint256 indexed tokenId);
    event MODIFY_SUCCESS(uint256 indexed tokenId);

    constructor() ERC721("Contract Me","CM") Owned(msg.sender){
         starsImsage.push("https://ipfs.filebase.io/ipfs/QmUjRzowzuEtx1VMzDFoFpM3Baabyijx9pNHKV8zMQzSfC");
         starsImsage.push("https://ipfs.filebase.io/ipfs/QmZHt8V3diwVTFqXKx8NQNtgAKAQ4qMxrCcoVxaRkHmKeQ");
    }

    function tokenURI(uint256 id) public view override returns (string memory){
        uint mod = id % starsImsage.length;
        return starsImsage[mod];
    }

    function mint(string memory name,string memory github,string memory x,string memory email) payable external {
        if(balanceOf(msg.sender)>0){
            revert ALREADY_MINTED();
        }
        if(msg.value < mintPrice){
            revert ERROR_PRICE();
        }
         uint256 tokenId = tokenIdCounter;
        Star memory newStar = Star({
            tokenId:tokenId,
            name:name,
            github:github,
            x:x,
            email:email  
        });
        tokenIdCounter++;
        _safeMint(msg.sender,tokenId);
        userTokens[msg.sender] = tokenId;
        tokenCardStorage[tokenId] = newStar;
        emit MINT_SUCCESS(tokenId);
    }
    
    function starOf(uint256 tokenId) external view returns(Star  memory star){
        if (ownerOf(tokenId) != msg.sender){
            revert NOT_OWNER();
        }
        star = tokenCardStorage[tokenId];
    }

    function starWalk() external view returns(Star memory star) {
        require(tokenIdCounter>1,"no Star");
        uint256 random = getRandomTokenId();
        star = tokenCardStorage[random];
    }

    function getRandomTokenId() internal view returns(uint256){
        bytes32 randomBytes = keccak256(abi.encodePacked(block.number, msg.sender, blockhash(block.timestamp-1)));
        uint256 maxId = tokenIdCounter - 1;
        
        return (uint256(randomBytes) % maxId) + 1;
    }
    function modify(string memory name,string memory github,string memory x,string memory email) external payable {
        if(balanceOf(msg.sender)==0){
            revert NOT_MINTED();
        }
        if(msg.value < modifyPrice){
            revert ERROR_PRICE();
        }
        uint256 tokenId = userTokens[msg.sender];
        Star memory star = tokenCardStorage[tokenId];
        star.name = name;
        star.github = github;
        star.x = x;
        star.email = email;
        tokenCardStorage[tokenId] = star;
        emit MODIFY_SUCCESS(tokenId);
    }

    function totalStars() public view returns(uint256){
        return tokenIdCounter-1;
    }

    // owner method
    function setPrice(uint256 p) onlyOwner() external {
        mintPrice  = p;
    }
    function setModifyPrice(uint256 p) onlyOwner() external {
        modifyPrice  = p;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert TransferFailed();
        }
    }

    fallback() external payable {    
    }
    receive() external payable { 
    }

}