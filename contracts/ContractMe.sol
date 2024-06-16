// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "solmate/src/tokens/ERC721.sol";
import "solmate/src/utils/LibString.sol";
import "solmate/src/auth/Owned.sol";

contract ContractMe is ERC721, Owned {
    using LibString for uint256;

    struct Star {
        string name;
        string github;
        string x;
        string email;
    }
    
    mapping(address => uint256) lastModifyTime;
    mapping(address => uint256) public userTokens;
    mapping(uint256 => Star) private tokenCardStorage;
    uint256 tokenIdCounter = 1;
    uint256 public mintPrice = 0.0005 ether;
    uint256 public modifyPrice = 0.0001 ether;
    string[] starsImsage;
    address _owner;
    error ALREADY_MINTED();
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
        Star memory newStar = Star({
            name:name,
            github:github,
            x:x,
            email:email  
        });
        uint256 tokenId = tokenIdCounter;
        tokenIdCounter++;
        _safeMint(msg.sender,tokenId);
        userTokens[msg.sender] = tokenId;
        tokenCardStorage[tokenId] = newStar;
        lastModifyTime[msg.sender] = block.timestamp;
        emit MINT_SUCCESS(tokenId);
    }
    
    function starWork(uint256 tokenId) external view returns(Star  memory star,bool isOwner){
        if (ownerOf(tokenId) == msg.sender){
            isOwner = true;
        }
        star = tokenCardStorage[tokenId];
    }

    function modifyCard(string memory name,string memory github,string memory x,string memory email) external payable {
        uint256 tokenId = userTokens[msg.sender];
        Star memory start = tokenCardStorage[tokenId];
        start.name = name;
        start.github = github;
        start.x = x;
        start.email = email;
        tokenCardStorage[tokenId] = start;
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