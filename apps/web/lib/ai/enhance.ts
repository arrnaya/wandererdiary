import { generateChatCompletion, MODELS } from './gateway'

export async function enhanceStory(raw: string): Promise<{
  enhanced: string
  summary: string
}> {
  try {
    const { text } = await generateChatCompletion({
      model: MODELS.writing,
      messages: [
        {
          role: 'system',
          content: `You are a travel writing editor at WandererDiary.
Your task is to enhance the following travel story for readability,
emotional depth, and descriptive richness.
CRITICAL RULES:
- Preserve the author's unique voice and first-person perspective
- Do NOT add fictional details or change facts
- Do NOT alter the overall structure or story arc
- Improve sentence flow, sensory language, and pacing
Respond ONLY as JSON: {"enhanced": "...", "summary": "..."}`,
        },
        {
          role: 'user',
          content: `Story: ${raw}`,
        },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { enhanced: raw, summary: 'No enhancement needed.' }
  } catch (error) {
    console.error('Enhancement failed:', error)
    return { enhanced: raw, summary: 'Enhancement service unavailable.' }
  }
}
