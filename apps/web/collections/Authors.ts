import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req, id }) => {
      if (req.user?.role === 'admin') return true
      return { id: { equals: req.user?.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.email) {
          // Link past anonymous stories
          try {
            const result = await req.payload.update({
              collection: 'stories',
              where: {
                guestEmail: { equals: doc.email },
                author: { exists: false },
              },
              data: {
                author: doc.id,
              },
            })
            if (result.errors.length === 0) {
              console.log(`Linked ${result.docs.length} stories to new author ${doc.email}`)
            }
          } catch (e) {
            console.error('Failed to link anonymous stories:', e)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Author', value: 'author' },
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'author',
      required: true,
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
    {
      name: 'nomadTokens',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'walletAddress',
      type: 'text',
    },
  ],
}
