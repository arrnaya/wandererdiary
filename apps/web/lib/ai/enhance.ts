import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function enhanceStory(raw: string): Promise<{
  enhanced: string
  summary: string
}> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a travel writing editor at WandererDiary.
Your task is to enhance the following travel story for readability,
emotional depth, and descriptive richness.
CRITICAL RULES:
- Preserve the author's unique voice and first-person perspective
- Do NOT add fictional details or change facts
- Do NOT alter the overall structure or story arc
- Improve sentence flow, sensory language, and pacing
Respond ONLY as JSON: {"enhanced": "...", "summary": "..."}
Story: ${raw}`,
        },
      ],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    // Extract JSON from possible markdown code block
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { enhanced: raw, summary: 'No enhancement needed.' }
  } catch (error) {
    console.error('Anthropic enhancement failed, falling back to OpenAI:', error)
    return fallbackEnhance(raw)
  }
}

async function fallbackEnhance(raw: string): Promise<{
  enhanced: string
  summary: string
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a travel writing editor. Enhance stories while preserving voice.',
        },
        {
          role: 'user',
          content: `Enhance this travel story. Preserve voice. Output JSON: {"enhanced": "...", "summary": "..."}\n\n${raw}`,
        },
      ],
      response_format: { type: 'json_object' },
    })
    const text = completion.choices[0].message.content || '{}'
    return JSON.parse(text)
  } catch (error) {
    console.error('OpenAI fallback failed:', error)
    return { enhanced: raw, summary: 'Enhancement service unavailable.' }
  }
}
