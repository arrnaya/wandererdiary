import { generateChatCompletion, MODELS } from './gateway'

async function runModeration(text: string): Promise<{
  safe: boolean
  flags: string[]
  score: number
}> {
  try {
    const { text: responseText } = await generateChatCompletion({
      model: MODELS.fast,
      messages: [
        {
          role: 'system',
          content:
            'You are a content safety moderator. Evaluate text for inappropriate, harmful, or low-quality travel content. Respond as JSON.',
        },
        {
          role: 'user',
          content: `Evaluate this travel content for safety and quality:\n\n${text.substring(0, 2000)}\n\nRespond as JSON:\n{\n  "safe": true/false,\n  "flags": ["list of issues if any"],\n  "score": 0-100 (quality score)\n}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    })

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { safe: true, flags: [], score: 80 }
  } catch (error) {
    console.error('Moderation failed:', error)
    return { safe: true, flags: ['moderation-unavailable'], score: 50 }
  }
}

export async function moderateContent(text: string): Promise<{
  safe: boolean
  flags: string[]
  score: number
}> {
  return runModeration(text)
}

export async function moderateComment(text: string): Promise<{
  safe: boolean
  isClean: boolean
  flags: string[]
  score: number
  confidence: number
}> {
  const result = await runModeration(text)
  return {
    ...result,
    isClean: result.safe,
    confidence: result.score / 100,
  }
}
