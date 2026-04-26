import type { CollectionConfig } from 'payload'

export const Chats: CollectionConfig = {
  slug: 'chats',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['sender', 'receiver', 'story', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return {
        or: [
          { sender: { equals: req.user?.id } },
          { receiver: { equals: req.user?.id } },
        ],
      }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'sender',
      type: 'relationship',
      relationTo: ['authors', 'subscribers'],
      required: true,
    },
    {
      name: 'receiver',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'stories',
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'sender',
          type: 'relationship',
          relationTo: ['authors', 'subscribers'],
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'sentAt',
          type: 'date',
          required: true,
        },
        {
          name: 'read',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
