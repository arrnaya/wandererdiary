import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateSEO(content: string, title: string): Promise<{
  title: string
  description: string
  keywords: string
  score: number
  suggestions: string[]
}> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an SEO expert for travel blogs. Generate SEO metadata for this story.
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
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
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
