import type { CollectionConfig } from 'payload'

export const Tips: CollectionConfig = {
  slug: 'tips',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req, id }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      return { author: { equals: req.user?.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'Packing', value: 'packing' },
        { label: 'Budget', value: 'budget' },
        { label: 'Safety', value: 'safety' },
        { label: 'Photography', value: 'photography' },
        { label: 'Solo Travel', value: 'solo_travel' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
