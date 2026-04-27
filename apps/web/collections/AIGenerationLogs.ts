import type { CollectionConfig } from 'payload'

export const AIGenerationLogs: CollectionConfig = {
  slug: 'ai-generation-logs',
  admin: {
    useAsTitle: 'destination',
    defaultColumns: ['destination', 'angle', 'modelUsed', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'stories',
    },
    {
      name: 'communityPost',
      type: 'relationship',
      relationTo: 'community-posts',
    },
    {
      name: 'destination',
      type: 'text',
      required: true,
    },
    {
      name: 'angle',
      type: 'text',
    },
    {
      name: 'contentType',
      type: 'select',
      options: [
        { label: 'Story', value: 'story' },
        { label: 'Community Photo Story', value: 'photo-story' },
        { label: 'Community Travel Tip', value: 'travel-tip' },
      ],
      required: true,
    },
    {
      name: 'modelUsed',
      type: 'text',
    },
    {
      name: 'promptTokens',
      type: 'number',
    },
    {
      name: 'completionTokens',
      type: 'number',
    },
    {
      name: 'imageCost',
      type: 'number',
    },
    {
      name: 'generationTimeMs',
      type: 'number',
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
