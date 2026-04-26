// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NomadToken
 * @dev ERC20 token for WandererDiary community rewards
 * Will be listed on Uniswap in Phase II
 */
contract NomadToken is ERC20, ERC20Burnable, Ownable {
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 public constant REWARD_POOL = 40_000_000 * 10**18; // 40% for community rewards
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensRewarded(address indexed user, uint256 amount, string reason);
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor(address initialOwner) 
        ERC20("Nomad", "NOMAD") 
        Ownable(initialOwner) 
    {
        // Mint initial supply to owner for liquidity provision
        _mint(initialOwner, 10_000_000 * 10**18); // 10M for liquidity
        
        // Reward pool stays unminted until distributed
    }
    
    /**
     * @dev Add an authorized minter (e.g., the backend wallet)
     */
    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }
    
    /**
     * @dev Remove an authorized minter
     */
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }
    
    /**
     * @dev Mint tokens as rewards for community contributions
     */
    function mintReward(
        address to, 
        uint256 amount, 
        string calldata reason
    ) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensRewarded(to, amount, reason);
    }
    
    /**
     * @dev Batch mint rewards for gas efficiency
     */
    function batchMintRewards(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string[] calldata reasons
    ) external onlyMinter {
        require(
            recipients.length == amounts.length && amounts.length == reasons.length,
            "Array length mismatch"
        );
        
        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            emit TokensRewarded(recipients[i], amounts[i], reasons[i]);
        }
    }
    
    /**
     * @dev Burn tokens from sender
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
    }
    
    /**
     * @dev Get remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
