import { getPayload } from 'payload'
import config from '../apps/web/payload.config'
import { generateChatCompletion, generateImage, MODELS } from '../apps/web/lib/ai/gateway'
import fs from 'fs'
import path from 'path'

// Mock environment since we're running in CLI
process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, '../apps/web/payload.config.ts')

async function uploadBase64ToMedia(base64: string, filename: string, payload: any): Promise<any> {
  const buffer = Buffer.from(base64, 'base64')
  
  // Create a dummy file object for Payload Local API
  const file = {
    data: buffer,
    mimetype: 'image/jpeg',
    name: filename,
    size: buffer.length,
  }
  
  const doc = await payload.create({
    collection: 'media',
    data: { alt: filename },
    file,
  })
  
  return doc
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

async function main() {
  const payload = await getPayload({ config })
  console.log('Payload initialized')
  
  // Find unpolished stories
  const result = await payload.find({
    collection: 'stories',
    where: {
      aiEnhanced: { not_equals: true },
    },
    limit: 1, // Do 1 at a time
  })
  
  if (result.docs.length === 0) {
    console.log('No unpolished stories found')
    process.exit(0)
  }
  
  const story = result.docs[0]
  console.log(`Polishing story: ${story.title}`)
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

  console.log('Generating polished text...')
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
  if (!jsonMatch) {
    console.error('Failed to parse AI JSON response', aiRes.text)
    process.exit(1)
  }
  const parsed = JSON.parse(jsonMatch[0])
  
  let { title, excerpt, content, coverImagePrompt, characterConsistency } = parsed
  console.log('Text generated. Generating images...')
  
  // Generate Cover Image
  let coverImageId = story.coverImage
  if (coverImagePrompt) {
    try {
      console.log('Generating cover image...')
      const fullPrompt = `${coverImagePrompt}. Stunning, high definition, 8k, photorealistic travel photography.`
      const imgRes = await generateImage({ prompt: fullPrompt, size: '1024x1024' })
      if (imgRes.b64_json) {
        const mediaDoc = await uploadBase64ToMedia(imgRes.b64_json, `cover-${story.slug}-${Date.now()}.jpg`, payload)
        coverImageId = mediaDoc.id
        console.log('Cover image uploaded:', mediaDoc.id)
      }
    } catch (e) {
      console.error('Cover image gen failed', e)
    }
  }
  
  // Process inline images
  const regex = /\[IMAGE_PROMPT:\s*(.*?)\]/g
  const matches = Array.from(content.matchAll(regex))
  
  if (matches.length > 0) {
    console.log(`Generating ${matches.length} inline images...`)
    const imagePromises = matches.map(async (match: any, i: number) => {
      try {
        const prompt = `${match[1]}. Stunning, high definition, 8k, photorealistic travel photography.`
        const imgRes = await generateImage({ prompt, size: '1024x1024' })
        if (imgRes.b64_json) {
          const mediaDoc = await uploadBase64ToMedia(imgRes.b64_json, `inline-${Date.now()}-${i}.jpg`, payload)
          console.log(`Inline image ${i+1} uploaded:`, mediaDoc.id)
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

  console.log('Updating story...')
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

  console.log(`Successfully polished: ${title}`)
  process.exit(0)
}

main().catch(console.error)
