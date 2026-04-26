import { NextRequest, NextResponse } from 'next/server'
import { moderateComment } from '@/lib/ai/moderate'

export async function POST(req: NextRequest) {
  try {
    const { commentId, content } = await req.json()
    
    if (!content && !commentId) {
      return NextResponse.json(
        { error: 'Comment content or ID required' },
        { status: 400 }
      )
    }

    const result = await moderateComment(content || '')
    
    return NextResponse.json({
      success: true,
      commentId,
      isClean: result.isClean,
      confidence: result.confidence,
      flags: result.flags,
      status: result.isClean ? 'approved' : 'rejected',
    })
  } catch (error) {
    console.error('Moderation API error:', error)
    return NextResponse.json(
      { error: 'Moderation failed' },
      { status: 500 }
    )
  }
}
