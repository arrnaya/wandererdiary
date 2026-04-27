import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

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
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (!data.slug && data.title) {
            data.slug = slugify(data.title)
          }
        }
        return data
      },
    ],
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
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
        { label: 'Food', value: 'food' },
        { label: 'Culture', value: 'culture' },
      ],
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
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
