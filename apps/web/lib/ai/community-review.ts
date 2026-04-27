import { generateChatCompletion, MODELS } from './gateway'

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
    const { text } = await generateChatCompletion({
      model: MODELS.fast,
      messages: [
        {
          role: 'system',
          content:
            "You are an AI content reviewer for WandererDiary's Wanderlust Community. Review posts for originality and helpfulness. Respond as JSON.",
        },
        {
          role: 'user',
          content: `Review this travel post for originality and helpfulness to other travelers.

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
      max_tokens: 1024,
      temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return {
      originality: 50,
      helpfulness: 50,
      overall: 50,
      tokens: 5,
      feedback: 'Review pending.',
    }
  } catch (error) {
    console.error('Community review failed:', error)
    return {
      originality: 50,
      helpfulness: 50,
      overall: 50,
      tokens: 5,
      feedback: 'Review service unavailable.',
    }
  }
}
