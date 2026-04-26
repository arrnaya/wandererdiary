import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'story', 'authorName', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      return { status: { equals: 'approved' } }
    },
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.status === 'pending') {
          // Trigger AI moderation
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai/moderate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ commentId: doc.id }),
            })
          } catch (e) {
            console.error('AI moderation trigger failed:', e)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'stories',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorEmail',
      type: 'email',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: ['authors', 'subscribers'],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'aiModerationResult',
      type: 'group',
      fields: [
        { name: 'isClean', type: 'checkbox' },
        { name: 'confidence', type: 'number', min: 0, max: 1 },
        { name: 'flags', type: 'text' },
        { name: 'reviewedAt', type: 'date' },
      ],
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
    },
  ],
}
