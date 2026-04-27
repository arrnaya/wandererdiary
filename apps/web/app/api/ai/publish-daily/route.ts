import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { researchTrendingPlaces } from '@/lib/ai/trending-researcher'
import { pickUniqueAngles } from '@/lib/ai/content-engine'
import { addStoryJob, addCommunityJob } from '@/lib/jobs/queue'
import { getRecentDestinationsToAvoid } from '@/lib/ai/self-evolve'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret or auth
    const authHeader = req.headers.get('authorization')
    const cronSecret = req.headers.get('x-vercel-cron-secret')

    if (CRON_SECRET && cronSecret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // 1. Find or create AI author
    const authorsResult = await payload.find({
      collection: 'authors',
      where: { username: { equals: 'wanderer' } },
      limit: 1,
    })

    let aiAuthorId: string
    if (authorsResult.docs.length > 0) {
      aiAuthorId = authorsResult.docs[0].id as string
    } else {
      const aiAuthor = await payload.create({
        collection: 'authors',
        data: {
            name: 'Wanderer',
            email: 'wanderer@wandererdiary.com',
            username: 'wanderer',
          role: 'admin',
            bio: 'Travel storyteller exploring the world one destination at a time.',
            password: 'Wanderer2024!Secure',
        },
      })
      aiAuthorId = aiAuthor.id as string
    }

    // 2. Get recent destinations to avoid repetition
    const recentLogs = await payload.find({
      collection: 'ai-generation-logs',
      sort: '-createdAt',
      limit: 100,
    })

    const destinationsToAvoid = getRecentDestinationsToAvoid(
      recentLogs.docs.map((d: any) => ({ destination: d.destination, createdAt: d.createdAt })),
      14
    )

    // 3. Research trending places
    const trending = await researchTrendingPlaces()

    // Filter out recently covered destinations
    const availableDestinations = trending.filter(
      (d) => !destinationsToAvoid.some((avoid) => d.name.toLowerCase().includes(avoid.toLowerCase()))
    )

    const destinations = availableDestinations.length > 0 ? availableDestinations : trending

    // 4. Determine content mix
    const storyCount = Math.min(destinations.length, 3 + Math.floor(Math.random() * 3)) // 3-5 stories
    const angles = pickUniqueAngles(storyCount)

    const results = {
      stories: [] as any[],
      communityPosts: [] as any[],
      errors: [] as any[],
    }

    // 5. Queue story generation jobs
    for (let i = 0; i < storyCount; i++) {
      const dest = destinations[i % destinations.length]
      const angle = angles[i]

      try {
        const jobResult = await addStoryJob({
          destination: dest,
          angle,
          aiAuthorId,
        })
        results.stories.push({ destination: dest.name, angle, job: !!jobResult })
      } catch (err) {
        results.errors.push({ type: 'story', destination: dest.name, error: (err as Error).message })
      }
    }

    // 6. Queue community posts for 2 destinations
    const communityDestinations = destinations.slice(0, 2)
    for (const dest of communityDestinations) {
      try {
        const photoJob = await addCommunityJob({
          destination: dest,
          type: 'photo-story',
          aiAuthorId,
        })
        results.communityPosts.push({ destination: dest.name, type: 'photo-story', job: !!photoJob })

        const tipJob = await addCommunityJob({
          destination: dest,
          type: 'travel-tip',
          aiAuthorId,
        })
        results.communityPosts.push({ destination: dest.name, type: 'travel-tip', job: !!tipJob })
      } catch (err) {
        results.errors.push({
          type: 'community',
          destination: dest.name,
          error: (err as Error).message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Queued ${results.stories.length} stories and ${results.communityPosts.length} community posts.`,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Daily publish failed:', error)
    return NextResponse.json(
      { error: 'Publishing failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
