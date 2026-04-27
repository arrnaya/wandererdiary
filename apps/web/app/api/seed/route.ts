import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const topDestinations = [
      {
        name: 'France',
        slug: 'france',
        description:
          "The world's most visited country, France offers iconic landmarks, world-class cuisine, romantic cities, and diverse landscapes from the Alps to the Riviera.",
        country: 'France',
        region: 'europe',
        activities: [{ activity: 'culture' }, { activity: 'food' }, { activity: 'honeymoon' }],
        worldRanking: 1,
        tourismScore: 98,
        isTrending: true,
        bestTimeToVisit: 'April to June, September to November',
        offbeatGems:
          'Colmar in Alsace for fairy-tale villages, Verdon Gorge for turquoise waters without the crowds of Provence.',
        featured: true,
      },
      {
        name: 'Spain',
        slug: 'spain',
        description:
          "Vibrant culture, stunning architecture, world-famous beaches, and some of the best food on Earth. From Barcelona to Seville, Spain enchants every traveler.",
        country: 'Spain',
        region: 'europe',
        activities: [{ activity: 'culture' }, { activity: 'food' }, { activity: 'beach' }],
        worldRanking: 2,
        tourismScore: 95,
        isTrending: true,
        bestTimeToVisit: 'May to June, September to October',
        offbeatGems:
          'Ronda for dramatic cliffside views, Cadaqués for Dalí-inspired coastal charm away from Costa del Sol.',
        featured: true,
      },
      {
        name: 'United States',
        slug: 'united-states',
        description:
          'From national parks to vibrant cities, the USA offers unparalleled diversity. New York, Yellowstone, Hawaii, and Route 66 — endless adventures await.',
        country: 'United States',
        region: 'usa',
        activities: [{ activity: 'adventure' }, { activity: 'solo-travel' }, { activity: 'group-travel' }],
        worldRanking: 3,
        tourismScore: 94,
        isTrending: true,
        bestTimeToVisit: 'Varies by region — Spring and Fall generally ideal',
        offbeatGems:
          'Marfa, Texas for desert art installations, Apostle Islands sea caves in Wisconsin for untouched beauty.',
        featured: true,
      },
      {
        name: 'Italy',
        slug: 'italy',
        description:
          "The cradle of Western civilization, Italy is a feast for the senses. Ancient ruins, Renaissance art, coastal villages, and the world's best gelato.",
        country: 'Italy',
        region: 'europe',
        activities: [{ activity: 'culture' }, { activity: 'food' }, { activity: 'honeymoon' }],
        worldRanking: 4,
        tourismScore: 93,
        isTrending: true,
        bestTimeToVisit: 'April to June, September to October',
        offbeatGems:
          'Matera for ancient cave dwellings, Procida island for colorful villages without Capri crowds.',
        featured: true,
      },
      {
        name: 'Turkey',
        slug: 'turkey',
        description:
          "Where East meets West. Turkey offers Istanbul's grandeur, Cappadocia's fairy chimneys, Pamukkale's thermal pools, and Aegean coastal gems.",
        country: 'Turkey',
        region: 'middle-east',
        activities: [{ activity: 'culture' }, { activity: 'adventure' }, { activity: 'honeymoon' }],
        worldRanking: 5,
        tourismScore: 90,
        isTrending: true,
        bestTimeToVisit: 'April to May, September to November',
        offbeatGems:
          'Amasya for riverside Ottoman houses, Mount Nemrut for sunrise with ancient stone heads.',
        featured: true,
      },
      {
        name: 'Mexico',
        slug: 'mexico',
        description:
          "Ancient pyramids, colonial cities, Caribbean beaches, and one of the world's great cuisines. Mexico is far more than its resorts.",
        country: 'Mexico',
        region: 'north-america',
        activities: [{ activity: 'culture' }, { activity: 'food' }, { activity: 'beach' }],
        worldRanking: 6,
        tourismScore: 89,
        isTrending: true,
        bestTimeToVisit: 'November to April',
        offbeatGems:
          'Bacalar Lagoon of Seven Colors, Guanajuato for underground streets and colorful tunnels.',
        featured: true,
      },
      {
        name: 'United Kingdom',
        slug: 'united-kingdom',
        description:
          "From London's icons to the Scottish Highlands, the UK blends history, literature, and natural beauty. Pubs, castles, and rolling countryside.",
        country: 'United Kingdom',
        region: 'europe',
        activities: [{ activity: 'culture' }, { activity: 'hiking' }, { activity: 'solo-travel' }],
        worldRanking: 7,
        tourismScore: 88,
        isTrending: false,
        bestTimeToVisit: 'May to September',
        offbeatGems:
          'Staithes on the Yorkshire coast for fishing village charm, Luskentyre Beach in the Outer Hebrides.',
        featured: false,
      },
      {
        name: 'Germany',
        slug: 'germany',
        description:
          "Fairytale castles, the Black Forest, Berlin's creative energy, and Bavarian charm. Germany combines efficiency with deep cultural heritage.",
        country: 'Germany',
        region: 'europe',
        activities: [{ activity: 'culture' }, { activity: 'adventure' }, { activity: 'food' }],
        worldRanking: 8,
        tourismScore: 87,
        isTrending: false,
        bestTimeToVisit: 'May to September, December for Christmas markets',
        offbeatGems:
          'Bastei Bridge in Saxon Switzerland, Monschau for half-timbered houses without Rothenburg crowds.',
        featured: false,
      },
      {
        name: 'Greece',
        slug: 'greece',
        description:
          "Ancient mythology meets island paradise. Athens' Acropolis, Santorini's sunsets, and hidden Cyclades islands define Mediterranean dreams.",
        country: 'Greece',
        region: 'europe',
        activities: [{ activity: 'beach' }, { activity: 'culture' }, { activity: 'honeymoon' }],
        worldRanking: 9,
        tourismScore: 86,
        isTrending: true,
        bestTimeToVisit: 'May to June, September to October',
        offbeatGems:
          'Naxos for authentic island life, Zagori for stone villages and Vikos Gorge hiking.',
        featured: true,
      },
      {
        name: 'Austria',
        slug: 'austria',
        description:
          "Alpine lakes, Vienna's imperial grandeur, and Sound of Music landscapes. Austria is Europe's hidden gem for culture and nature lovers.",
        country: 'Austria',
        region: 'europe',
        activities: [{ activity: 'hiking' }, { activity: 'culture' }, { activity: 'honeymoon' }],
        worldRanking: 10,
        tourismScore: 85,
        isTrending: false,
        bestTimeToVisit: 'May to September, December for skiing',
        offbeatGems:
          'Hallstatt viewpoint from the Salzberg, Wachau Valley for vineyards without the Rhine crowds.',
        featured: false,
      },
    ]

    const results = []
    for (const dest of topDestinations) {
      const existing = await payload.find({
        collection: 'destinations',
        where: { slug: { equals: dest.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'destinations',
          data: dest as any,
        })
        results.push({ name: dest.name, action: 'created' })
      } else {
        results.push({ name: dest.name, action: 'already-exists' })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed failed:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
