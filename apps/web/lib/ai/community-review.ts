import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function reviewCommunityPost(
  caption: string,
  mediaCount: number
): Promise<{
  originality: number
  helpfulness: number
  overall: number
  tokens: number
  feedback: string
}> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an AI content reviewer for WandererDiary's Wanderlust Community.
Review this travel post for originality and helpfulness to other travelers.

Caption: "${caption}"
Media files attached: ${mediaCount}

Score from 0-100 on:
1. Originality - Is this unique, personal content?
2. Helpfulness - Would this help other travelers plan trips?

Respond ONLY as JSON:
{
  "originality": 0-100,
  "helpfulness": 0-100,
  "overall": 0-100,
  "tokens": number (overall / 10, rounded),
  "feedback": "brief feedback to the user"
}

High scores (80+) should be given to posts with specific locations, tips, and unique perspectives.
Low scores should go to generic or promotional content.`,
        },
      ],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { originality: 50, helpfulness: 50, overall: 50, tokens: 5, feedback: 'Review pending.' }
  } catch (error) {
    console.error('Community review failed:', error)
    return { originality: 50, helpfulness: 50, overall: 50, tokens: 5, feedback: 'Review service unavailable.' }
  }
}
