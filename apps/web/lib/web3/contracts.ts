import { ethers } from 'ethers'

// Nomad ERC20 Token ABI (simplified)
export const NOMAD_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]

// NFT Contract ABI (simplified)
export const NFT_ABI = [
  'function mint(address to, string memory tokenURI) returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]

export function getProvider() {
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
}

export function getNomadTokenContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const address = process.env.NEXT_PUBLIC_NOMAD_TOKEN_ADDRESS
  if (!address) throw new Error('Nomad token address not configured')
  return new ethers.Contract(address, NOMAD_TOKEN_ABI, signerOrProvider || getProvider())
}

export function getNFTContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const address = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  if (!address) throw new Error('NFT contract address not configured')
  return new ethers.Contract(address, NFT_ABI, signerOrProvider || getProvider())
}

export async function mintNomadTokens(to: string, amount: number) {
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw new Error('Private key not configured')
  
  const provider = getProvider()
  const wallet = new ethers.Wallet(privateKey, provider)
  const contract = getNomadTokenContract(wallet)
  
  const decimals = await contract.decimals()
  const parsedAmount = ethers.parseUnits(amount.toString(), decimals)
  
  const tx = await contract.mint(to, parsedAmount)
  await tx.wait()
  return tx.hash
}

export async function mintNFT(to: string, tokenURI: string) {
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw new Error('Private key not configured')
  
  const provider = getProvider()
  const wallet = new ethers.Wallet(privateKey, provider)
  const contract = getNFTContract(wallet)
  
  const tx = await contract.mint(to, tokenURI)
  const receipt = await tx.wait()
  
  // Extract tokenId from event logs
  const iface = new ethers.Interface(NFT_ABI)
  const log = receipt.logs.find((l: any) => {
    try {
      const parsed = iface.parseLog(l)
      return parsed?.name === 'Transfer'
    } catch {
      return false
    }
  })
  
  const tokenId = log ? iface.parseLog(log)?.args[2].toString() : '0'
  return { txHash: tx.hash, tokenId }
}
