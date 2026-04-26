import { create } from 'ipfs-http-client'

function getClient() {
  const auth =
    'Basic ' +
    Buffer.from(
      `${process.env.IPFS_API_KEY}:${process.env.IPFS_API_SECRET}`
    ).toString('base64')

  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: { authorization: auth },
  })
}

export async function uploadToIPFS(data: string | Buffer | Blob): Promise<string> {
  const client = getClient()
  const result = await client.add(data)
  return result.cid.toString()
}

export async function uploadJSONToIPFS(json: object): Promise<string> {
  const data = JSON.stringify(json)
  return uploadToIPFS(data)
}

export function getIPFSUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`
}

export async function pinToIPFS(cid: string): Promise<void> {
  const client = getClient()
  await client.pin.add(cid)
}
