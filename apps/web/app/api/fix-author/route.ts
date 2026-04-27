import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find all authors with "Wanderer AI" name
    const authors = await payload.find({
      collection: 'authors',
      where: {
        name: { equals: 'Wanderer AI' },
      },
      limit: 100,
    })

    const results = []
    for (const author of authors.docs) {
      await payload.update({
        collection: 'authors',
        id: author.id,
        data: {
          name: 'Wanderer',
        } as any,
      })
      results.push({ id: author.id, username: author.username, action: 'renamed' })
    }

    // Also update any authors with username wanderer-ai to wanderer
    const oldUsernameAuthors = await payload.find({
      collection: 'authors',
      where: {
        username: { equals: 'wanderer-ai' },
      },
      limit: 100,
    })

    for (const author of oldUsernameAuthors.docs) {
      await payload.update({
        collection: 'authors',
        id: author.id,
        data: {
          username: 'wanderer',
          name: 'Wanderer',
        } as any,
      })
      results.push({ id: author.id, username: 'wanderer', action: 'renamed-and-fixed-username' })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Fix author failed:', error)
    return NextResponse.json(
      { error: 'Fix author failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
