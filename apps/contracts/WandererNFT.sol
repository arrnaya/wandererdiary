// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title WandererNFT
 * @dev ERC721 NFT contract for WandererDiary community posts
 * Images stored on IPFS, permanently pinned
 */
contract WandererNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Platform fee for minting (in wei)
    uint256 public mintFee = 0;
    
    // Mapping from token ID to original content creator
    mapping(uint256 => address) public originalCreators;
    
    // Mapping from token ID to IPFS hash
    mapping(uint256 => string) public ipfsHashes;
    
    // Authorized minters (backend wallets)
    mapping(address => bool) public authorizedMinters;
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        string tokenURI,
        string ipfsHash
    );
    
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(
        address initialOwner,
        string memory baseURI
    ) 
        ERC721("WandererDiary NFT", "WANDERER") 
        Ownable(initialOwner) 
    {
        _baseTokenURI = baseURI;
        _tokenIdCounter.increment(); // Start at 1
    }
    
    /**
     * @dev Authorize a minter address
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @dev Revoke minter authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @dev Mint a new NFT for a community post
     * @param to The address that will own the NFT
     * @param uri The IPFS URI for the metadata
     * @param ipfsHash The IPFS hash of the original image
     */
    function mint(
        address to,
        string calldata uri,
        string calldata ipfsHash
    ) external onlyAuthorizedMinter returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        originalCreators[tokenId] = to;
        ipfsHashes[tokenId] = ipfsHash;
        
        emit NFTMinted(tokenId, to, to, uri, ipfsHash);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint NFTs for gas efficiency
     */
    function batchMint(
        address[] calldata recipients,
        string[] calldata uris,
        string[] calldata hashes
    ) external onlyAuthorizedMinter {
        require(
            recipients.length == uris.length && uris.length == hashes.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
            
            originalCreators[tokenId] = recipients[i];
            ipfsHashes[tokenId] = hashes[i];
            
            emit NFTMinted(tokenId, recipients[i], recipients[i], uris[i], hashes[i]);
        }
    }
    
    /**
     * @dev Get all token IDs owned by an address
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get total NFTs minted
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    /**
     * @dev Set base URI
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
