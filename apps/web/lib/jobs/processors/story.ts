import { getPayload } from 'payload'
import config from '@payload-config'
import { generateStory, type StoryAngle } from '@/lib/ai/content-engine'
import { generateCoverImageForStory } from '@/lib/ai/image-generator'
import { generateSEO } from '@/lib/ai/seo'
import { moderateContent } from '@/lib/ai/moderate'
import type { TrendingDestination } from '@/lib/ai/trending-researcher'

export async function processStoryJob(data: {
  destination: TrendingDestination
  angle: string
  aiAuthorId: string
}) {
  const payload = await getPayload({ config })
  const startTime = Date.now()

  try {
    // 1. Generate story content
    const story = await generateStory(data.destination, data.angle as StoryAngle)

    // 2. Moderate content
    const moderation = await moderateContent(story.content)
    if (!moderation.safe) {
      console.warn('Story failed moderation:', moderation.flags)
      return { success: false, reason: 'moderation-failed', flags: moderation.flags }
    }

    // 3. Generate cover image
    const imageResult = await generateCoverImageForStory(data.destination.name, data.angle)

    // 4. Upload image to Media collection
    const buffer = Buffer.from(imageResult.b64_json, 'base64')
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: imageResult.altText,
        caption: `AI-generated cover for ${story.title}`,
      },
      file: {
        data: buffer,
        name: `${story.slug}-cover.jpg`,
        mimetype: 'image/jpeg',
        size: buffer.length,
      } as any,
    })

    // 5. Generate SEO
    const seo = await generateSEO(story.content, story.title)

    // 6. Create story in CMS
    const storyDoc = await payload.create({
      collection: 'stories',
      data: {
        title: story.title,
        slug: story.slug,
        author: data.aiAuthorId,
        status: 'published',
        category: story.category as any,
        coverImage: mediaDoc.id,
        excerpt: story.excerpt,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: story.content }],
              },
            ],
          },
        },
        location: story.location,
        publishedAt: new Date().toISOString(),
        seo: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          score: seo.score,
        },
        aiEnhanced: true,
        enhancementSummary: `Angle: ${data.angle}. Model: claude-sonnet-4.`,
        readTime: story.readTime,
      },
    })

    // 7. Log generation
    const generationTime = Date.now() - startTime
    await payload.create({
      collection: 'ai-generation-logs',
      data: {
        story: storyDoc.id,
        destination: `${data.destination.name}, ${data.destination.country}`,
        angle: data.angle,
        contentType: 'story',
        modelUsed: 'anthropic/claude-sonnet-4',
        generationTimeMs: generationTime,
        createdAt: new Date().toISOString(),
      },
    })

    return { success: true, storyId: storyDoc.id }
  } catch (error) {
    console.error('Story generation failed:', error)
    return { success: false, error: (error as Error).message }
  }
}
