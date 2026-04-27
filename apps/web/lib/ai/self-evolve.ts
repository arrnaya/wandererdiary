import { generateChatCompletion, MODELS } from './gateway'
import type { PaginatedDocs } from 'payload'

export interface PerformanceData {
  stories: Array<{
    id: string
    title: string
    viewCount: number
    angle?: string
    destination?: string
    publishedAt: string
  }>
  communityPosts: Array<{
    id: string
    caption: string
    likes: number
    type?: string
    destination?: string
    publishedAt: string
  }>
}

export interface EvolutionResult {
  topPerformingAngles: Record<string, number>
  topPerformingDestinations: Record<string, number>
  promptAdjustments: string
  newAnglesToTry: string[]
  destinationsToAvoid: string[]
  destinationsToPrioritize: string[]
  engagementScore: number
}

export async function analyzePerformance(
  storiesData: PaginatedDocs<any>,
  communityData: PaginatedDocs<any>
): Promise<PerformanceData> {
  const stories = storiesData.docs.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    viewCount: doc.viewCount || 0,
    angle: doc.enhancementSummary || undefined,
    destination: doc.location || undefined,
    publishedAt: doc.publishedAt || doc.createdAt,
  }))

  const communityPosts = communityData.docs.map((doc: any) => ({
    id: doc.id,
    caption: doc.caption || '',
    likes: doc.likes || 0,
    type: doc.aiScore ? 'photo-story' : 'travel-tip',
    destination: doc.location || undefined,
    publishedAt: doc.createdAt,
  }))

  return { stories, communityPosts }
}

export async function evolvePrompts(performance: PerformanceData): Promise<EvolutionResult> {
  // Calculate basic metrics
  const anglePerformance: Record<string, number[]> = {}
  const destPerformance: Record<string, number[]> = {}

  performance.stories.forEach((s) => {
    if (s.angle) {
      anglePerformance[s.angle] = anglePerformance[s.angle] || []
      anglePerformance[s.angle].push(s.viewCount)
    }
    if (s.destination) {
      destPerformance[s.destination] = destPerformance[s.destination] || []
      destPerformance[s.destination].push(s.viewCount)
    }
  })

  const topAngles: Record<string, number> = {}
  Object.entries(anglePerformance).forEach(([angle, views]) => {
    topAngles[angle] = Math.round(views.reduce((a, b) => a + b, 0) / views.length)
  })

  const topDests: Record<string, number> = {}
  Object.entries(destPerformance).forEach(([dest, views]) => {
    topDests[dest] = Math.round(views.reduce((a, b) => a + b, 0) / views.length)
  })

  const totalViews = performance.stories.reduce((sum, s) => sum + s.viewCount, 0)
  const totalLikes = performance.communityPosts.reduce((sum, p) => sum + p.likes, 0)
  const engagementScore = Math.min(
    100,
    Math.round((totalViews / Math.max(performance.stories.length, 1)) * 0.7 +
      (totalLikes / Math.max(performance.communityPosts.length, 1)) * 0.3)
  )

  // Use AI to generate strategic recommendations
  const performanceSummary = JSON.stringify({
    angleAverages: topAngles,
    destinationAverages: topDests,
    totalStories: performance.stories.length,
    totalCommunityPosts: performance.communityPosts.length,
    engagementScore,
  })

  const { text } = await generateChatCompletion({
    model: MODELS.reasoning,
    messages: [
      {
        role: 'system',
        content:
          'You are an AI content strategist optimizing a travel blog. Analyze performance data and suggest concrete prompt adjustments and content strategy changes.',
      },
      {
        role: 'user',
        content: `Based on this week's performance data for our travel content AI:

${performanceSummary}

Provide strategic recommendations as JSON:
{
  "promptAdjustments": "Specific changes to make to story generation prompts",
  "newAnglesToTry": ["angle1", "angle2"],
  "destinationsToAvoid": ["overperformed destination"],
  "destinationsToPrioritize": ["underexplored high-potential destination"]
}

Focus on diversity, engagement, and avoiding content fatigue.`,
      },
    ],
    max_tokens: 2048,
    temperature: 0.7,
  })

  let recommendations = {
    promptAdjustments: 'Continue current strategy.',
    newAnglesToTry: [] as string[],
    destinationsToAvoid: [] as string[],
    destinationsToPrioritize: [] as string[],
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      recommendations = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse evolution recommendations:', e)
  }

  return {
    topPerformingAngles: topAngles,
    topPerformingDestinations: topDests,
    promptAdjustments: recommendations.promptAdjustments,
    newAnglesToTry: recommendations.newAnglesToTry || [],
    destinationsToAvoid: recommendations.destinationsToAvoid || [],
    destinationsToPrioritize: recommendations.destinationsToPrioritize || [],
    engagementScore,
  }
}

export function getRecentDestinationsToAvoid(
  logs: Array<{ destination: string; createdAt: string }>,
  days = 14
): string[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const recent = new Set<string>()
  logs.forEach((log) => {
    if (new Date(log.createdAt) > cutoff) {
      recent.add(log.destination)
    }
  })

  return Array.from(recent)
}
