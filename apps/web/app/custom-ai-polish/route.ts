import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateChatCompletion, generateImage, MODELS } from '@/lib/ai/gateway'

async function uploadBase64ToMedia(base64: string, filename: string): Promise<any> {
  // Convert base64 to Blob
  const buffer = Buffer.from(base64, 'base64')
  
  // Need to use FormData to call the local /api/media
  const formData = new FormData()
  formData.append('file', new Blob([buffer], { type: 'image/jpeg' }), filename)
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'}/api/media`, {
    method: 'POST',
    body: formData,
  })
  
  if (!res.ok) {
    throw new Error('Failed to upload image')
  }
  
  const data = await res.json()
  return data.doc
}

function extractTextFromLexical(content: any): string {
  if (typeof content === 'string') return content
  if (!content?.root?.children) return ''
  
  let text = ''
  for (const node of content.root.children) {
    if (node.children) {
      for (const child of node.children) {
        if (child.text) text += child.text + '\n'
      }
    }
  }
  return text
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Find unpolished stories
    const result = await payload.find({
      collection: 'stories',
      where: {
        aiEnhanced: { not_equals: true },
      },
      limit: 1, // Do 1 at a time to avoid timeout
    })
    
    if (result.docs.length === 0) {
      return NextResponse.json({ message: 'No unpolished stories found' })
    }
    
    const story = result.docs[0]
    const rawContent = extractTextFromLexical(story.content)
    
    const systemPrompt = `You are an expert travel editor. Rewrite the following travel story to make it extremely engaging, human-like, and beautifully formatted.
Add clear headings. Add "Pro Tip" boxes using this exact HTML structure:
<div class="bg-brand-cream border-l-4 border-brand-amber p-4 rounded-r-lg my-6 shadow-sm">
  <h4 class="font-bold text-brand-darkGreen m-0">Pro Tip</h4>
  <p class="m-0 mt-2">tip text...</p>
</div>

Also, decide on a cohesive character appearance to use for the images in this story (e.g., "a 25-year-old solo female traveler with a yellow beanie").
Include a prompt for a stunning cover image.
Also insert exactly 2 gallery image placeholders inside the content where appropriate, using this exact format:
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  [IMAGE_PROMPT: description of first image, including the character]
  [IMAGE_PROMPT: description of second image, including the character]
</div>

Respond ONLY as a JSON object with:
"title": "catchy title",
"excerpt": "short summary",
"content": "the full markdown/html story",
"coverImagePrompt": "detailed prompt for cover image including character",
"characterConsistency": "the character description used"
`

    const aiRes = await generateChatCompletion({
      model: MODELS.writing,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Original Title: ${story.title}\n\nOriginal Content: ${rawContent}` }
      ],
      max_tokens: 4096,
      temperature: 0.8,
    })

    const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Failed to parse AI JSON response')
    const parsed = JSON.parse(jsonMatch[0])
    
    let { title, excerpt, content, coverImagePrompt, characterConsistency } = parsed
    
    // Generate Cover Image
    let coverImageId = story.coverImage as string
    if (coverImagePrompt) {
      try {
        const fullPrompt = `${coverImagePrompt}. Stunning, high definition, 8k, photorealistic travel photography.`
        const imgRes = await generateImage({ prompt: fullPrompt, size: '1024x1024' })
        if (imgRes.b64_json) {
          const mediaDoc = await uploadBase64ToMedia(imgRes.b64_json, `cover-${story.slug}-${Date.now()}.jpg`)
          coverImageId = mediaDoc.id
        }
      } catch (e) {
        console.error('Cover image gen failed', e)
      }
    }
    
    // Process inline images
    const regex = /\[IMAGE_PROMPT:\s*(.*?)\]/g
    const matches = Array.from(content.matchAll(regex))
    
    if (matches.length > 0) {
      const imagePromises = matches.map(async (match: any) => {
        try {
          const prompt = `${match[1]}. Stunning, high definition, 8k, photorealistic travel photography.`
          const imgRes = await generateImage({ prompt, size: '1024x1024' })
          if (imgRes.b64_json) {
            const mediaDoc = await uploadBase64ToMedia(imgRes.b64_json, `inline-${Date.now()}.jpg`)
            return {
              original: match[0],
              replacement: `<img src="${mediaDoc.url}" alt="${match[1].replace(/"/g, '')}" class="rounded-xl object-cover h-64 w-full" loading="lazy" />`
            }
          }
        } catch (e) {
          console.error('Inline image gen failed', e)
        }
        return { original: match[0], replacement: '' }
      })
      
      const replacements = await Promise.all(imagePromises)
      for (const r of replacements) {
        if (r.replacement) {
          content = content.replace(r.original, r.replacement)
        } else {
          content = content.replace(r.original, '') // Remove if failed
        }
      }
    }
    
    // Convert text back to lexical
    const newLexical = {
      root: {
        children: [
          {
            children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: content, type: 'text', version: 1 }],
            direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1
          }
        ],
        direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
      }
    }

    // Update Story
    await payload.update({
      collection: 'stories',
      id: story.id,
      data: {
        title,
        excerpt,
        content: newLexical,
        coverImage: coverImageId,
        aiEnhanced: true,
        enhancementSummary: `Polished content and generated images using ${characterConsistency}`,
      }
    })

    return NextResponse.json({
      success: true,
      story: title,
      message: 'Successfully polished and generated images.'
    })
  } catch (e) {
    console.error('Polish error:', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
