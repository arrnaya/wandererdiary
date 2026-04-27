import { NextRequest, NextResponse } from 'next/server'
import { generateImage, MODELS } from '@/lib/ai/gateway'

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = MODELS.image, size = '1024x1024' } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const result = await generateImage({ prompt, model, size })

    return NextResponse.json({
      success: true,
      image: result.b64_json,
      url: result.url,
      revised_prompt: result.revised_prompt,
    })
  } catch (error) {
    console.error('Image generation API error:', error)
    return NextResponse.json(
      { error: 'Image generation failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
