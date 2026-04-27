import { generateImage, MODELS } from './gateway'

export interface GeneratedImage {
  b64_json: string
  altText: string
  prompt: string
}

export function buildTravelImagePrompt({
  destination,
  scene,
  activity,
  timeOfDay = 'golden hour',
  style = 'cinematic travel photography',
}: {
  destination: string
  scene: string
  activity?: string
  timeOfDay?: string
  style?: string
}): string {
  const peopleContext = activity
    ? `travelers and locals enjoying ${activity}`
    : 'diverse group of travelers exploring, laughing, and taking photos'

  return `${style} of ${destination}. ${scene}. ${peopleContext} in the foreground, candid natural moments, authentic interactions. ${timeOfDay} lighting with warm tones, photorealistic, shot on Sony A7IV with 35mm f/1.4 lens, natural skin tones, vibrant colors, editorial travel magazine quality, depth of field, atmospheric perspective. No text, no watermarks.`
}

export async function generateTravelImage({
  destination,
  scene,
  activity,
  timeOfDay,
}: {
  destination: string
  scene: string
  activity?: string
  timeOfDay?: string
}): Promise<GeneratedImage> {
  const prompt = buildTravelImagePrompt({ destination, scene, activity, timeOfDay })

  const imageResult = await generateImage({
    prompt,
    model: MODELS.image,
    size: '1024x1024',
  })

  if (!imageResult.b64_json) {
    throw new Error('No image data returned from generation')
  }

  const altText = await generateAltText({ destination, scene, activity })

  return {
    b64_json: imageResult.b64_json,
    altText,
    prompt,
  }
}

export async function generateAltText({
  destination,
  scene,
  activity,
}: {
  destination: string
  scene: string
  activity?: string
}): Promise<string> {
  const activityText = activity ? ` while ${activity}` : ''
  return `Travelers exploring ${destination}${activityText}. ${scene}. Candid travel photography with natural lighting.`
}

export async function generateCoverImageForStory(
  destination: string,
  angle: string
): Promise<GeneratedImage> {
  const angleScenes: Record<string, string> = {
    classic: `iconic landmark view of ${destination} with visitors admiring the scenery`,
    offbeat: `hidden alley or lesser-known viewpoint in ${destination} with curious explorers`,
    foodie: `local food market or street food scene in ${destination} with people tasting dishes`,
    photography: `photographers capturing stunning vistas at ${destination} during perfect light`,
    'locals-guide': `local guide sharing stories with a small group of travelers in ${destination}`,
  }

  const scene = angleScenes[angle] || angleScenes.classic

  return generateTravelImage({
    destination,
    scene,
    activity: angle === 'foodie' ? 'tasting local cuisine' : 'sightseeing',
    timeOfDay: 'golden hour',
  })
}

export async function generateCommunityImage(
  destination: string,
  type: 'photo-story' | 'travel-tip'
): Promise<GeneratedImage> {
  const scenes: Record<string, string> = {
    'photo-story': `breathtaking panoramic view of ${destination} with travelers taking photos and enjoying the moment`,
    'travel-tip': `practical travel moment in ${destination} - navigating streets, reading maps, discovering hidden spots`,
  }

  return generateTravelImage({
    destination,
    scene: scenes[type],
    activity: type === 'photo-story' ? 'photography' : 'exploring',
    timeOfDay: type === 'photo-story' ? 'golden hour' : 'daytime',
  })
}
