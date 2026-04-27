import type { CollectionConfig } from 'payload'

export const SelfEvolutionLogs: CollectionConfig = {
  slug: 'self-evolution-logs',
  admin: {
    useAsTitle: 'weekStart',
    defaultColumns: ['weekStart', 'engagementScore', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'weekStart',
      type: 'date',
      required: true,
    },
    {
      name: 'weekEnd',
      type: 'date',
      required: true,
    },
    {
      name: 'topPerformingStories',
      type: 'array',
      fields: [
        {
          name: 'story',
          type: 'relationship',
          relationTo: 'stories',
        },
        {
          name: 'viewCount',
          type: 'number',
        },
        {
          name: 'angle',
          type: 'text',
        },
        {
          name: 'destination',
          type: 'text',
        },
      ],
    },
    {
      name: 'topPerformingAngles',
      type: 'json',
      admin: {
        description: 'JSON mapping of angles to average view counts',
      },
    },
    {
      name: 'topPerformingDestinations',
      type: 'json',
      admin: {
        description: 'JSON mapping of destinations to average engagement',
      },
    },
    {
      name: 'promptAdjustments',
      type: 'textarea',
      admin: {
        description: 'What prompt changes were recommended this week',
      },
    },
    {
      name: 'newAnglesToTry',
      type: 'array',
      fields: [
        {
          name: 'angle',
          type: 'text',
        },
      ],
    },
    {
      name: 'destinationsToAvoid',
      type: 'array',
      fields: [
        {
          name: 'destination',
          type: 'text',
        },
      ],
    },
    {
      name: 'destinationsToPrioritize',
      type: 'array',
      fields: [
        {
          name: 'destination',
          type: 'text',
        },
      ],
    },
    {
      name: 'engagementScore',
      type: 'number',
      min: 0,
      max: 100,
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
