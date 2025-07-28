//Smart contract 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin NFT contract features
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Define our NFT contract
contract GreenProofNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter = 0;

    // Pass token name + symbol to ERC721, and owner to Ownable
    constructor() ERC721("GreenProof", "GREEN") Ownable(msg.sender) {}

    // Public function to mint an NFT
    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tokenIdCounter++;
    }
}



// This contract allows minting of NFTs with a URI that points to metadata, such as an image or other data.