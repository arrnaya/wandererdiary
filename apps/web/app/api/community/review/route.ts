import { NextRequest, NextResponse } from 'next/server'
import { reviewCommunityPost } from '@/lib/ai/community-review'

export async function POST(req: NextRequest) {
  try {
    const { postId, caption, mediaCount } = await req.json()
    
    if (!caption) {
      return NextResponse.json(
        { error: 'Caption required' },
        { status: 400 }
      )
    }

    const result = await reviewCommunityPost(caption, mediaCount || 1)
    
    return NextResponse.json({
      success: true,
      postId,
      originality: result.originality,
      helpfulness: result.helpfulness,
      overall: result.overall,
      tokens: result.tokens,
      feedback: result.feedback,
    })
  } catch (error) {
    console.error('Community review API error:', error)
    return NextResponse.json(
      { error: 'Review failed' },
      { status: 500 }
    )
  }
}
