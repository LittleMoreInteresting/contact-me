// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "solmate/tokens/ERC721.sol";
import "solmate/utils/LibString.sol";

contract ContractMe is ERC721 {
    using LibString for uint256;

    enum Gender {
        M,
        FM
    }
    struct Card {
        string name;
        Gender gender;
        string github;
        string x;
        string telegram;
    }

    mapping(address => uint256) public lastModifyTime;
    mapping(address => uint256) public userTokens;
    mapping(uint256 => Card) private tokenCardStorage;
    uint256 tokenIdCounter = 1;
    uint256 mintPrice = 0.001 ether;

    error ALREADY_MINTED();
    event MINT_SUCCESS(uint256 indexed tokenId);

    constructor() ERC721("Contract Me","CM"){

    }

    function tokenURI(uint256 id) public pure override returns (string memory){
        return id.toString();
    }

    function mint(string memory name,Gender gender,string memory github,string memory x,string memory telegram) payable external {
        if(balanceOf(msg.sender)>0){
            revert ALREADY_MINTED();
        }
        Card memory newCard = Card({
            name:name,
            gender:gender,
            github:github,
            x:x,
            telegram:telegram  
        });
        uint256 tokenId = tokenIdCounter;
        tokenIdCounter++;
        _safeMint(msg.sender,tokenId);
        tokenCardStorage[tokenId] = newCard;
        emit MINT_SUCCESS(tokenId);
    }

    
    function selfCard() external view returns(Card memory){

    }
}