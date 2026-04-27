import { generateChatCompletion, MODELS } from './gateway'

export async function generateSEO(
  content: string,
  title: string
): Promise<{
  title: string
  description: string
  keywords: string
  score: number
  suggestions: string[]
}> {
  try {
    const { text } = await generateChatCompletion({
      model: MODELS.fast,
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO expert for travel blogs. Generate optimized metadata. Respond as JSON.',
        },
        {
          role: 'user',
          content: `Generate SEO metadata for this story.
Current title: ${title}

Content: ${content.substring(0, 3000)}

Respond as JSON:
{
  "title": "optimized title (max 60 chars)",
  "description": "meta description (max 160 chars)",
  "keywords": "comma-separated keywords",
  "score": 85,
  "suggestions": ["suggestion 1", "suggestion 2"]
}`,
        },
      ],
      max_tokens: 2048,
      temperature: 0.5,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('SEO generation failed:', error)
    return {
      title: title.substring(0, 60),
      description: content.substring(0, 160),
      keywords: 'travel, adventure',
      score: 50,
      suggestions: ['Add more headings', 'Include destination keywords'],
    }
  }
}
