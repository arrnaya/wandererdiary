import { generateChatCompletion, MODELS } from './gateway'
import type { TrendingDestination } from './trending-researcher'

export type StoryAngle = 'classic' | 'offbeat' | 'foodie' | 'photography' | 'locals-guide'

export interface GeneratedStory {
  title: string
  slug: string
  excerpt: string
  content: string
  readTime: number
  category: string
  location: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export interface GeneratedCommunityPost {
  caption: string
  location: string
  type: 'photo-story' | 'travel-tip'
}

const anglePrompts: Record<StoryAngle, string> = {
  classic:
    'Write a classic destination guide covering the must-see attractions, but with personal anecdotes and humanized storytelling. Include practical tips woven into the narrative.',
  offbeat:
    'Focus entirely on hidden gems, off-the-beaten-path locations, and lesser-known experiences. Help travelers escape the crowds. Be specific about how to reach these places.',
  foodie:
    'Center the story around culinary experiences - street food, local markets, family-run restaurants, cooking traditions. Make readers taste the destination through your words.',
  photography:
    'Write from a photographer\'s perspective. Describe the best spots, lighting conditions, and moments to capture. Include camera settings advice and composition tips.',
  'locals-guide':
    'Write as if a local friend is showing you around. Include insider tips, neighborhood secrets, and authentic cultural experiences that tourists usually miss.',
}

export async function generateStory(
  destination: TrendingDestination,
  angle: StoryAngle
): Promise<GeneratedStory> {
  const anglePrompt = anglePrompts[angle]

  const { text } = await generateChatCompletion({
    model: MODELS.writing,
    messages: [
      {
        role: 'system',
        content: `You are an award-winning travel writer for WandererDiary. Your stories are vivid, emotionally resonant, and deeply human. You write in first person with a warm, engaging voice. Each story feels like a letter from a well-traveled friend. ${anglePrompt}`,
      },
      {
        role: 'user',
        content: `Write a unique travel story about ${destination.name}, ${destination.country}.

Angle: ${angle}
Why trending: ${destination.whyTrending}
Best experiences: ${destination.bestExperiences.join(', ')}
Offbeat gems: ${destination.offbeatGems.join(', ')}

Requirements:
- Title: catchy, under 80 characters
- Excerpt: compelling summary under 160 characters
- Content: 800-1200 words in rich markdown (headings, paragraphs, bullet points where relevant)
- Include a human moment: interaction with a local person, a surprise discovery, or a personal reflection
- Read time estimate
- SEO-optimized metadata

Respond as JSON:
{
  "title": "...",
  "slug": "url-friendly-slug",
  "excerpt": "...",
  "content": "# Heading\\n\\nParagraph...",
  "readTime": 6,
  "category": "destination",
  "location": "City, Country",
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "keyword1, keyword2, keyword3"
}`,
      },
    ],
    max_tokens: 4096,
    temperature: 0.85,
  })

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || `${destination.name} Travel Guide`,
        slug: parsed.slug || destination.name.toLowerCase().replace(/\s+/g, '-'),
        excerpt: parsed.excerpt || `Discover ${destination.name}`,
        content: parsed.content || `# ${destination.name}\n\nA wonderful destination.`,
        readTime: parsed.readTime || 5,
        category: parsed.category || 'destination',
        location: parsed.location || `${destination.name}, ${destination.country}`,
        seoTitle: parsed.seoTitle || parsed.title,
        seoDescription: parsed.seoDescription || parsed.excerpt,
        seoKeywords: parsed.seoKeywords || `${destination.name}, travel, ${destination.country}`,
      }
    }
  } catch (e) {
    console.error('Failed to parse generated story JSON:', e)
  }

  // Fallback
  return {
    title: `Discovering ${destination.name}`,
    slug: `discovering-${destination.name.toLowerCase().replace(/\s+/g, '-')}`,
    excerpt: `An unforgettable journey through ${destination.name}, ${destination.country}.`,
    content: `# Discovering ${destination.name}\n\n${destination.whyTrending}\n\n## Best Experiences\n\n${destination.bestExperiences.map((e) => `- ${e}`).join('\n')}`,
    readTime: 5,
    category: 'destination',
    location: `${destination.name}, ${destination.country}`,
    seoTitle: `Discovering ${destination.name} | WandererDiary`,
    seoDescription: `An unforgettable journey through ${destination.name}, ${destination.country}.`,
    seoKeywords: `${destination.name}, travel, ${destination.country}`,
  }
}

export async function generatePhotoStory(
  destination: TrendingDestination
): Promise<GeneratedCommunityPost> {
  const { text } = await generateChatCompletion({
    model: MODELS.fast,
    messages: [
      {
        role: 'system',
        content:
          'You are a travel photographer sharing a stunning photo moment on social media. Write short, vivid captions that make followers feel like they are there. Use emojis naturally. Keep it under 300 characters.',
      },
      {
        role: 'user',
        content: `Write a photo story caption for ${destination.name}, ${destination.country}. Highlight one incredible visual moment. Mention why it is trending.`,
      },
    ],
    max_tokens: 512,
    temperature: 0.9,
  })

  return {
    caption: text.trim().substring(0, 500),
    location: `${destination.name}, ${destination.country}`,
    type: 'photo-story',
  }
}

export async function generateTravelTip(
  destination: TrendingDestination
): Promise<GeneratedCommunityPost> {
  const { text } = await generateChatCompletion({
    model: MODELS.fast,
    messages: [
      {
        role: 'system',
        content:
          'You are a savvy traveler sharing one practical, money-saving or experience-enhancing tip. Be specific and actionable. Use emojis. Keep it under 400 characters.',
      },
      {
        role: 'user',
        content: `Write a travel tip for visiting ${destination.name}, ${destination.country}. Focus on one of these: avoiding crowds, saving money, or a local insider secret.`,
      },
    ],
    max_tokens: 512,
    temperature: 0.85,
  })

  return {
    caption: text.trim().substring(0, 500),
    location: `${destination.name}, ${destination.country}`,
    type: 'travel-tip',
  }
}

export function pickUniqueAngles(count: number, usedAngles: StoryAngle[] = []): StoryAngle[] {
  const allAngles: StoryAngle[] = ['classic', 'offbeat', 'foodie', 'photography', 'locals-guide']
  const available = allAngles.filter((a) => !usedAngles.includes(a))

  const result: StoryAngle[] = []
  for (let i = 0; i < count; i++) {
    const pool = available.length > 0 ? available : allAngles
    const angle = pool[Math.floor(Math.random() * pool.length)]
    result.push(angle)
    const idx = available.indexOf(angle)
    if (idx > -1) available.splice(idx, 1)
  }

  return result
}
