import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePhotoStory, generateTravelTip } from '@/lib/ai/content-engine'
import { generateCommunityImage } from '@/lib/ai/image-generator'
import { reviewCommunityPost } from '@/lib/ai/community-review'
import type { TrendingDestination } from '@/lib/ai/trending-researcher'

export async function processCommunityJob(data: {
  destination: TrendingDestination
  type: 'photo-story' | 'travel-tip'
  aiAuthorId: string
}) {
  const payload = await getPayload({ config })
  const startTime = Date.now()

  try {
    // 1. Generate content
    const post =
      data.type === 'photo-story'
        ? await generatePhotoStory(data.destination)
        : await generateTravelTip(data.destination)

    // 2. Generate image
    const imageResult = await generateCommunityImage(data.destination.name, data.type)

    // 3. Upload image
    const buffer = Buffer.from(imageResult.b64_json, 'base64')
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: imageResult.altText,
        caption: post.caption.substring(0, 100),
      },
      file: {
        data: buffer,
        name: `community-${data.type}-${Date.now()}.jpg`,
        mimetype: 'image/jpeg',
        size: buffer.length,
      } as any,
    })

    // 4. AI Review for tokens
    const review = await reviewCommunityPost(post.caption, 1)

    // 5. Create community post
    const postDoc = await payload.create({
      collection: 'community-posts',
      data: {
        caption: post.caption,
        author: { relationTo: 'authors', value: data.aiAuthorId },
        media: [
          {
            file: mediaDoc.id,
            type: 'image',
          },
        ],
        location: post.location,
        status: 'published',
        aiScore: {
          originality: review.originality,
          helpfulness: review.helpfulness,
          overall: review.overall,
        },
        nomadTokensEarned: review.tokens,
        likes: 0,
      },
    })

    // 6. Log generation
    const generationTime = Date.now() - startTime
    await payload.create({
      collection: 'ai-generation-logs',
      data: {
        communityPost: postDoc.id,
        destination: `${data.destination.name}, ${data.destination.country}`,
        contentType: data.type,
        modelUsed: 'anthropic/claude-sonnet-4',
        generationTimeMs: generationTime,
        createdAt: new Date().toISOString(),
      },
    })

    return { success: true, postId: postDoc.id }
  } catch (error) {
    console.error('Community post generation failed:', error)
    return { success: false, error: (error as Error).message }
  }
}
