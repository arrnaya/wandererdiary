import { generateChatCompletion, generateImage, MODELS } from './gateway'

export async function polishOneStory(payload: any) {
  const result = await payload.find({
    collection: 'stories',
    where: { aiEnhanced: { not_equals: true } },
    limit: 1,
  })
  
  if (result.docs.length === 0) return { message: 'No unpolished stories found' }
  const story = result.docs[0]
  
  let rawContent = ''
  if (typeof story.content === 'string') rawContent = story.content
  else if (story.content?.root?.children) {
    for (const node of story.content.root.children) {
      if (node.children) {
        for (const child of node.children) {
          if (child.text) rawContent += child.text + '\n'
        }
      }
    }
  }
  
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
  
  async function uploadBase64(base64: string, filename: string) {
    const buffer = Buffer.from(base64, 'base64')
    const file = { data: buffer, mimetype: 'image/jpeg', name: filename, size: buffer.length }
    const doc = await payload.create({ collection: 'media', data: { alt: filename }, file })
    return doc
  }
  
  let coverImageId = story.coverImage
  if (coverImagePrompt) {
    try {
      const fullPrompt = `${coverImagePrompt}. Stunning, high definition, 8k, photorealistic travel photography.`
      const imgRes = await generateImage({ prompt: fullPrompt, size: '1024x1024' })
      if (imgRes.b64_json) {
        const mediaDoc = await uploadBase64(imgRes.b64_json, `cover-${story.slug}-${Date.now()}.jpg`)
        coverImageId = mediaDoc.id
      } else if (imgRes.url) {
        // Store URL as an external media entry
        const mediaDoc = await payload.create({
          collection: 'media',
          data: { alt: title, url: imgRes.url },
        })
        coverImageId = mediaDoc.id
      }
    } catch (e) { console.error('Cover image gen failed', e) }
  }
  
  const regex = /\[IMAGE_PROMPT:\s*(.*?)\]/g
  const matches = Array.from(content.matchAll(regex))
  if (matches.length > 0) {
    const imagePromises = matches.map(async (match: any) => {
      try {
        const prompt = `${match[1]}. Stunning, high definition, 8k, photorealistic travel photography.`
        const imgRes = await generateImage({ prompt, size: '1024x1024' })
        let imgUrl = ''
        if (imgRes.b64_json) {
          const mediaDoc = await uploadBase64(imgRes.b64_json, `inline-${Date.now()}.jpg`)
          imgUrl = mediaDoc.url
        } else if (imgRes.url) {
          imgUrl = imgRes.url
        }
        if (imgUrl) {
          const imgTag = '<img src="' + imgUrl + '" alt="' + match[1].replace(/"/g, '') + '" class="rounded-xl object-cover h-64 w-full" loading="lazy" />'
          return { original: match[0], replacement: imgTag }
        }
      } catch (e) { console.error('Inline image gen failed', e) }
      return { original: match[0], replacement: '' }
    })
    const replacements = await Promise.all(imagePromises)
    for (const r of replacements) {
      if (r.replacement) content = content.replace(r.original, r.replacement)
      else content = content.replace(r.original, '')
    }
  }
  
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

  await payload.update({
    collection: 'stories',
    id: story.id,
    data: {
      title, excerpt, content: newLexical, coverImage: coverImageId, aiEnhanced: true,
      enhancementSummary: `Polished content and generated images using ${characterConsistency}`,
    }
  })

  return { success: true, story: title }
}
