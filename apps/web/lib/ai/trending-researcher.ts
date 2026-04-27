import { generateChatCompletion, MODELS } from './gateway'

export interface TrendingDestination {
  name: string
  country: string
  region: string
  whyTrending: string
  bestExperiences: string[]
  offbeatGems: string[]
}

export async function researchTrendingPlaces(): Promise<TrendingDestination[]> {
  const { text } = await generateChatCompletion({
    model: MODELS.reasoning,
    messages: [
      {
        role: 'system',
        content:
          'You are a travel trend analyst. Research the 5 most sought-after travel destinations right now. Consider seasonal trends, viral social media spots, major events, and emerging offbeat locations. Be specific and realistic.',
      },
      {
        role: 'user',
        content: `Research the 5 most trending travel destinations this week worldwide. For each, provide:
- Name and country
- Region (asia, europe, middle-east, usa, africa, australia, south-america, north-america)
- Why it is trending right now
- 3 best experiences
- 2 offbeat gems to beat the crowd

Respond ONLY as valid JSON array:
[
  {
    "name": "City/Region Name",
    "country": "Country",
    "region": "asia",
    "whyTrending": "Brief reason",
    "bestExperiences": ["experience 1", "experience 2", "experience 3"],
    "offbeatGems": ["hidden gem 1", "hidden gem 2"]
  }
]`,
      },
    ],
    max_tokens: 4096,
    temperature: 0.8,
  })

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const destinations = JSON.parse(jsonMatch[0]) as TrendingDestination[]
      return destinations.slice(0, 5)
    }
    throw new Error('No JSON array found in response')
  } catch (error) {
    console.error('Failed to parse trending destinations:', error)
    // Fallback to curated diverse list
    return getFallbackDestinations()
  }
}

function getFallbackDestinations(): TrendingDestination[] {
  return [
    {
      name: 'Kyoto',
      country: 'Japan',
      region: 'asia',
      whyTrending: 'Cherry blossom season and renewed interest in traditional Japanese culture',
      bestExperiences: [
        'Walk through the Arashiyama Bamboo Grove at dawn',
        'Visit Fushimi Inari shrine early morning',
        'Tea ceremony in a 400-year-old machiya',
      ],
      offbeatGems: ['Otagi Nenbutsu-ji temple with 1200 rakan statues', 'Kurama to Kibune mountain hike'],
    },
    {
      name: 'Lisbon',
      country: 'Portugal',
      region: 'europe',
      whyTrending: 'Digital nomad hub with affordable luxury and vibrant food scene',
      bestExperiences: [
        'Sunset at Miradouro da Senhora do Monte',
        'Fado performance in Alfama',
        'Day trip to Sintra palaces',
      ],
      offbeatGems: ['LX Factory street art district', 'Cacilhas fishing village across the river'],
    },
    {
      name: 'Patagonia',
      country: 'Chile',
      region: 'south-america',
      whyTrending: 'Adventure travel boom and desire for remote wilderness experiences',
      bestExperiences: [
        'Trekking the W Circuit in Torres del Paine',
        'Glacier kayaking on Grey Lake',
        'Wildlife spotting at Punta Arenas',
      ],
      offbeatGems: ['Cerro Castillo trek without the crowds', 'Capitan Prat Valley hidden lakes'],
    },
    {
      name: 'Marrakech',
      country: 'Morocco',
      region: 'africa',
      whyTrending: 'Cultural immersion and luxury riad stays trending on social media',
      bestExperiences: [
        'Sunrise hot air balloon over the Atlas Mountains',
        'Cooking class in a traditional riad',
        'Sunset at Jemaa el-Fnaa square',
      ],
      offbeatGems: ['Le Jardin Secret hidden garden', 'Tamesloht village and shrine'],
    },
    {
      name: 'Queenstown',
      country: 'New Zealand',
      region: 'australia',
      whyTrending: "Adventure capital of the world with Lord of the Rings tourism surge",
      bestExperiences: [
        'Bungee jumping at Kawarau Bridge',
        'Milford Sound overnight cruise',
        'Wine tasting in Central Otago',
      ],
      offbeatGems: ['Glenorchy lagoon walk at golden hour', 'Arrowtown Chinese settlement history'],
    },
  ]
}
