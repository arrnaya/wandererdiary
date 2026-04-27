import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt', 'featured'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      return { status: { equals: 'published' } }
    },
    create: () => true, // Allow anonymous posting
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
    afterChange: [
      async ({ doc, operation, req }) => {
        if (doc.status === 'published' && operation === 'create') {
          // Trigger AI enhancement pipeline asynchronously
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ai/enhance`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ storyId: doc.id }),
            })
          } catch (e) {
            console.error('AI enhancement trigger failed:', e)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: false, // Made optional for anonymous posts
    },
    {
      name: 'guestName',
      type: 'text',
      admin: {
        condition: (data) => !data.author,
      },
    },
    {
      name: 'guestEmail',
      type: 'email',
      admin: {
        condition: (data) => !data.author,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Adventure', value: 'adventure' },
        { label: 'Destination', value: 'destination' },
        { label: 'Experience', value: 'experience' },
        { label: 'Tips', value: 'tips' },
        { label: 'Photo Story', value: 'photo_story' },
      ],
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 160,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', maxLength: 60 },
        { name: 'description', type: 'textarea', maxLength: 160 },
        { name: 'keywords', type: 'text' },
        { name: 'score', type: 'number', min: 0, max: 100 },
      ],
    },
    {
      name: 'aiEnhanced',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'enhancementSummary',
      type: 'textarea',
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'readTime',
      type: 'number',
    },
  ],
}
