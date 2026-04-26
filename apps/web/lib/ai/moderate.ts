import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function moderateComment(content: string): Promise<{
  isClean: boolean
  confidence: number
  flags: string[]
}> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a content moderation AI for WandererDiary. Analyze this comment for:
- Obscenity / profanity
- Hate speech
- Harassment
- Spam
- Harmful content
- Personal attacks

Comment: "${content}"

Respond ONLY as JSON: {"isClean": true/false, "confidence": 0.0-1.0, "flags": ["reason1", "reason2"]}
Be strict but fair. Reject only genuinely harmful content.`,
        },
      ],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { isClean: true, confidence: 0.5, flags: [] }
  } catch (error) {
    console.error('Moderation failed:', error)
    // Fail-safe: approve if AI fails
    return { isClean: true, confidence: 0, flags: ['ai-error'] }
  }
}
