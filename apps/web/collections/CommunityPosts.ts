import type { CollectionConfig } from 'payload'

export const CommunityPosts: CollectionConfig = {
  slug: 'community-posts',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'author', 'status', 'aiScore', 'nomadTokensEarned'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req, id }) => {
      if (req.user?.role === 'admin') return true
      return { author: { equals: req.user?.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.status === 'pending') {
          // Trigger AI review for Nomad tokens
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/community/review`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ postId: doc.id }),
            })
          } catch (e) {
            console.error('AI review trigger failed:', e)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'caption',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: ['authors', 'subscribers'],
      required: true,
    },
    {
      name: 'media',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'aiScore',
      type: 'group',
      fields: [
        { name: 'originality', type: 'number', min: 0, max: 100 },
        { name: 'helpfulness', type: 'number', min: 0, max: 100 },
        { name: 'overall', type: 'number', min: 0, max: 100 },
      ],
    },
    {
      name: 'nomadTokensEarned',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'nftMinted',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'nftTokenId',
      type: 'text',
    },
    {
      name: 'ipfsHash',
      type: 'text',
    },
  ],
}
