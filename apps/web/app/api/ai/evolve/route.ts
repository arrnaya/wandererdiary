import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { analyzePerformance, evolvePrompts } from '@/lib/ai/self-evolve'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = req.headers.get('x-vercel-cron-secret')

    if (CRON_SECRET && cronSecret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // 1. Fetch last week's stories
    const storiesResult = await payload.find({
      collection: 'stories',
      where: {
        publishedAt: {
          greater_than_equal: weekAgo.toISOString(),
        },
      },
      limit: 100,
    })

    // 2. Fetch last week's community posts
    const communityResult = await payload.find({
      collection: 'community-posts',
      where: {
        createdAt: {
          greater_than_equal: weekAgo.toISOString(),
        },
      },
      limit: 100,
    })

    // 3. Analyze performance
    const performance = await analyzePerformance(storiesResult, communityResult)

    // 4. Evolve prompts
    const evolution = await evolvePrompts(performance)

    // 5. Store evolution log
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - 7)

    await payload.create({
      collection: 'self-evolution-logs',
      data: {
        weekStart: weekStart.toISOString(),
        weekEnd: now.toISOString(),
        topPerformingAngles: evolution.topPerformingAngles,
        topPerformingDestinations: evolution.topPerformingDestinations,
        promptAdjustments: evolution.promptAdjustments,
        newAnglesToTry: evolution.newAnglesToTry.map((a) => ({ angle: a })),
        destinationsToAvoid: evolution.destinationsToAvoid.map((d) => ({ destination: d })),
        destinationsToPrioritize: evolution.destinationsToPrioritize.map((d) => ({ destination: d })),
        engagementScore: evolution.engagementScore,
        createdAt: now.toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      evolution: {
        engagementScore: evolution.engagementScore,
        promptAdjustments: evolution.promptAdjustments,
        newAnglesToTry: evolution.newAnglesToTry,
        destinationsToAvoid: evolution.destinationsToAvoid,
        destinationsToPrioritize: evolution.destinationsToPrioritize,
      },
    })
  } catch (error) {
    console.error('Evolution failed:', error)
    return NextResponse.json(
      { error: 'Evolution analysis failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
