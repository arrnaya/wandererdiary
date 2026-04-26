import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req, id }) => {
      if (req.user?.role === 'admin') return true
      return { id: { equals: req.user?.id } }
    },
    create: () => true,
    update: ({ req, id }) => {
      if (req.user?.role === 'admin') return true
      return { id: { equals: req.user?.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Subscriber', value: 'subscriber' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'subscriber',
      required: true,
    },
    {
      name: 'favorites',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
    },
    {
      name: 'walletAddress',
      type: 'text',
    },
    {
      name: 'nomadTokens',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'subscribedToNewsletter',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
