
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StudyToEarnNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to authorized addresses who can update this NFT
    mapping(uint256 => address) private _tokenUpdaters;
    
    // Events
    event NFTMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event NFTUpdated(uint256 indexed tokenId, string newTokenURI);
    
    constructor() ERC721("StudyToEarn", "LEARN") {}
    
    /**
     * @dev Mints a new NFT token
     * @param to Address receiving the NFT
     * @param tokenURI The token URI pointing to metadata
     * @return The token ID of the minted NFT
     */
    function mintNFT(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // By default, the minter can update the token
        _tokenUpdaters[newTokenId] = to;
        
        emit NFTMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Updates the token URI to reflect study progress
     * @param tokenId The ID of the token to update
     * @param newTokenURI The new token URI with updated metadata
     */
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public {
        require(_exists(tokenId), "Token does not exist");
        require(
            _isApprovedOrOwner(msg.sender, tokenId) || msg.sender == _tokenUpdaters[tokenId],
            "Not authorized to update"
        );
        
        _setTokenURI(tokenId, newTokenURI);
        
        emit NFTUpdated(tokenId, newTokenURI);
    }
    
    /**
     * @dev Authorizes an address to update a specific token
     * @param tokenId The token ID to authorize for
     * @param updater The address authorized to update the token
     */
    function setTokenUpdater(uint256 tokenId, address updater) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not token owner");
        _tokenUpdaters[tokenId] = updater;
    }
    
    /**
     * @dev Check if an address is authorized to update a token
     * @param tokenId The token ID to check
     * @param updater The address to check
     * @return Whether the address is authorized to update
     */
    function isTokenUpdater(uint256 tokenId, address updater) public view returns (bool) {
        return _tokenUpdaters[tokenId] == updater;
    }
}
