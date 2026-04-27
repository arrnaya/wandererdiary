import OpenAI from 'openai'

const apiKey = process.env.VERCEL_AI_KEY

if (!apiKey) {
  console.warn('VERCEL_AI_KEY is not set. AI Gateway will not function.')
}

export const gateway = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  baseURL: 'https://ai-gateway.vercel.sh/v1',
  timeout: 30000,
  maxRetries: 2,
})

// Model aliases — Vercel AI Gateway supported models
export const MODELS = {
  reasoning: 'google/gemini-2.0-flash',
  writing: 'google/gemini-2.0-flash',
  fast: 'google/gemini-2.0-flash',
  image: 'google/gemini-2.0-flash-exp',
  multimodalImage: 'google/gemini-2.0-flash-exp',
  vision: 'google/gemini-2.0-flash',
} as const

export async function generateChatCompletion({
  model,
  messages,
  max_tokens = 2048,
  temperature = 0.7,
  response_format,
}: {
  model: string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  max_tokens?: number
  temperature?: number
  response_format?: { type: 'json_object' }
}) {
  const start = Date.now()

  const completion = await Promise.race([
    gateway.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
      ...(response_format ? { response_format } : {}),
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Gateway request timed out after 30s')), 30000)
    ),
  ])

  const duration = Date.now() - start

  return {
    text: completion.choices[0]?.message?.content || '',
    usage: completion.usage || { prompt_tokens: 0, completion_tokens: 0 },
    duration,
  }
}

export async function generateImage({
  prompt,
  model = MODELS.image,
  size = '1024x1024',
}: {
  prompt: string
  model?: string
  size?: string
}): Promise<{ b64_json?: string; url?: string; revised_prompt?: string }> {
  // Try the dedicated images API (Vercel AI Gateway supports this for Gemini Flash)
  try {
    const result = await gateway.images.generate({
      model,
      prompt: `Photorealistic, high-definition travel photograph: ${prompt}. Style: professional travel photography, 8K, stunning composition, vibrant colors.`,
      response_format: 'b64_json',
      size: size as any,
      n: 1,
    } as any)

    const image = result.data?.[0]
    if (image?.b64_json) {
      return { b64_json: image.b64_json, url: image.url }
    }
    if (image?.url) {
      return { url: image.url }
    }
    throw new Error('No image data in response')
  } catch (primaryError) {
    console.error('Image generation failed:', (primaryError as Error).message)

    // Graceful fallback: Unsplash URL based on prompt keywords
    const keywords = prompt
      .replace(/[^a-zA-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 4)
      .join(',')
    return {
      url: `https://source.unsplash.com/1024x768/?${encodeURIComponent(keywords || 'travel,landscape')}`,
    }
  }
}
