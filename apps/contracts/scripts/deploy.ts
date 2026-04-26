import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with account:', deployer.address)

  // Deploy NomadToken
  const NomadToken = await ethers.getContractFactory('NomadToken')
  const nomadToken = await NomadToken.deploy(deployer.address)
  await nomadToken.waitForDeployment()
  console.log('NomadToken deployed to:', await nomadToken.getAddress())

  // Deploy WandererNFT
  const WandererNFT = await ethers.getContractFactory('WandererNFT')
  const wandererNFT = await WandererNFT.deploy(
    deployer.address,
    'https://ipfs.io/ipfs/'
  )
  await wandererNFT.waitForDeployment()
  console.log('WandererNFT deployed to:', await wandererNFT.getAddress())

  // Save deployment info
  const deploymentInfo = {
    nomadToken: await nomadToken.getAddress(),
    wandererNFT: await wandererNFT.getAddress(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  }
  console.log('\nDeployment Info:', deploymentInfo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
