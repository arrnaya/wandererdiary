import { NextRequest, NextResponse } from 'next/server'
import { generateChatCompletion, MODELS } from '@/lib/ai/gateway'

export async function POST(req: NextRequest) {
  try {
    const { ideas, category, characterDescription } = await req.json()
    
    if (!ideas) {
      return NextResponse.json(
        { error: 'Ideas are required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert travel writer at WandererDiary. 
Your task is to take the user's ideas and write a complete, engaging, human-like travel story.
Category: ${category || 'travel'}.
${characterDescription ? `Maintain this character consistency in the story: ${characterDescription}` : ''}
CRITICAL RULES:
- Write in a highly engaging, human-like, first-person perspective.
- Format the content in Markdown or HTML suitable for a rich text editor.
- The story should be long enough to keep readers hooked, with placeholders for images like [IMAGE: prompt for the image].
- Respond ONLY as a JSON object with these keys: "title" (catchy, max 100 chars), "excerpt" (short summary, max 160 chars), "content" (the full story).`

    const result = await generateChatCompletion({
      model: MODELS.writing,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Here are the ideas to expand into a story: ${ideas}`,
        },
      ],
      max_tokens: 4096,
      temperature: 0.8,
    })

    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    let parsedResult = { title: '', excerpt: '', content: '' }
    if (jsonMatch) {
      parsedResult = JSON.parse(jsonMatch[0])
    } else {
      throw new Error('Failed to parse AI response into JSON')
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
    })
  } catch (error) {
    console.error('Write Story API error:', error)
    return NextResponse.json(
      { error: 'Failed to write story' },
      { status: 500 }
    )
  }
}
