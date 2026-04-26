import { NextRequest, NextResponse } from 'next/server'
import { mintNFT } from '@/lib/web3/contracts'
import { uploadJSONToIPFS, pinToIPFS } from '@/lib/web3/ipfs'

export async function POST(req: NextRequest) {
  try {
    const { postId, imageUrl, caption, ownerAddress } = await req.json()
    
    if (!imageUrl || !ownerAddress) {
      return NextResponse.json(
        { error: 'Image URL and owner address required' },
        { status: 400 }
      )
    }

    const metadata = {
      name: `WandererDiary #${postId}`,
      description: caption || 'A moment from the WandererDiary community',
      image: imageUrl,
      attributes: [
        { trait_type: 'Platform', value: 'WandererDiary' },
        { trait_type: 'Type', value: 'Community Post' },
      ],
    }

    const metadataCid = await uploadJSONToIPFS(metadata)
    await pinToIPFS(metadataCid)
    
    const metadataUri = `https://ipfs.io/ipfs/${metadataCid}`
    const result = await mintNFT(ownerAddress, metadataUri)
    
    return NextResponse.json({
      success: true,
      tokenId: result.tokenId,
      txHash: result.txHash,
      metadataUri,
      ipfsHash: metadataCid,
    })
  } catch (error) {
    console.error('NFT mint API error:', error)
    return NextResponse.json(
      { error: 'Minting failed' },
      { status: 500 }
    )
  }
}
