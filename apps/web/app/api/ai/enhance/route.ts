import { NextRequest, NextResponse } from 'next/server'
import { enhanceStory } from '@/lib/ai/enhance'

export async function POST(req: NextRequest) {
  try {
    const { storyId, content } = await req.json()
    
    if (!content && !storyId) {
      return NextResponse.json(
        { error: 'Story content or ID required' },
        { status: 400 }
      )
    }

    const result = await enhanceStory(content || '')
    
    return NextResponse.json({
      success: true,
      storyId,
      enhanced: result.enhanced,
      summary: result.summary,
    })
  } catch (error) {
    console.error('Enhance API error:', error)
    return NextResponse.json(
      { error: 'Enhancement failed' },
      { status: 500 }
    )
  }
}
