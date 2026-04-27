import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import { Stories } from './collections/Stories'
import { Authors } from './collections/Authors'
import { Subscribers } from './collections/Subscribers'
import { Destinations } from './collections/Destinations'
import { Tips } from './collections/Tips'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Comments } from './collections/Comments'
import { CommunityPosts } from './collections/CommunityPosts'
import { NFTs } from './collections/NFTs'
import { Chats } from './collections/Chats'
import { AIGenerationLogs } from './collections/AIGenerationLogs'
import { SelfEvolutionLogs } from './collections/SelfEvolutionLogs'

const databaseUri = process.env.DATABASE_URI || 'postgres://arrnaya@localhost:5432/wandererdiary'

// Append SSL config for Neon / managed Postgres if not already present
const connectionString = databaseUri.includes('sslmode=') || databaseUri.includes('?')
  ? databaseUri
  : `${databaseUri}?sslmode=require`

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-key-change-in-production-32chars',
  admin: {
    user: 'authors',
  },
  collections: [
    Stories,
    Authors,
    Subscribers,
    Destinations,
    Tips,
    Media,
    Tags,
    Comments,
    CommunityPosts,
    NFTs,
    Chats,
    AIGenerationLogs,
    SelfEvolutionLogs,
  ],
  db: postgresAdapter({
    pool: {
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
  }),
  editor: lexicalEditor({}),
  plugins: [],
  sharp,
  // Email: configure a production adapter like Resend or Nodemailer
  // Default console adapter is used in development
  typescript: { outputFile: './payload-types.ts' },
})
