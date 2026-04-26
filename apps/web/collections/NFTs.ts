import type { CollectionConfig } from 'payload'

export const NFTs: CollectionConfig = {
  slug: 'nfts',
  admin: {
    useAsTitle: 'tokenId',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'tokenId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'contractAddress',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: ['authors', 'subscribers'],
      required: true,
    },
    {
      name: 'communityPost',
      type: 'relationship',
      relationTo: 'community-posts',
      required: true,
    },
    {
      name: 'metadataUri',
      type: 'text',
      required: true,
    },
    {
      name: 'ipfsHash',
      type: 'text',
      required: true,
    },
    {
      name: 'transactionHash',
      type: 'text',
    },
    {
      name: 'mintedAt',
      type: 'date',
      required: true,
    },
  ],
}
