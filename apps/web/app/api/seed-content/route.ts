import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production'

const storiesData = [
  {
    title: "Hidden Kyoto: A Local's Guide to Temples Without the Crowds",
    slug: 'hidden-kyoto-temples-without-crowds',
    category: 'destination',
    excerpt: 'Discover the serene side of Kyoto through ancient temples that most tourists never find.',
    location: 'Kyoto, Japan',
    content: `# Hidden Kyoto: A Local's Guide to Temples Without the Crowds

Kyoto is magical, but the famous spots are overwhelmed. Last autumn, I spent a week exploring the city's quiet corners with a local friend who showed me places that changed everything I thought I knew about this ancient capital.

## Otagi Nenbutsu-ji: The Temple of 1,200 Faces

Most visitors to Arashiyama stop at the bamboo grove and leave. But hike 20 minutes uphill and you'll find Otagi Nenbutsu-ji, a temple where 1,200 hand-carved rakan statues line the mossy pathways. Each face is unique — some laughing, some meditating, others pulling playful expressions. I sat on a stone bench for an hour, watching light filter through the maple trees and feeling like I had stumbled into a secret world.

## Giou-ji: The Moss Temple

This tiny temple in the Saga area has no famous paintings or golden halls. Instead, it offers a single thatched hut surrounded by a sea of luminous green moss. In the rainy season, the moss glows with an almost supernatural intensity. I visited on a drizzly June morning and had the entire place to myself except for one elderly monk quietly sweeping the path.

## The Philosopher's Path at Dawn

Everyone walks the Philosopher's Path during cherry blossom season. But at 5:30 AM in November, with fallen maple leaves floating on the canal and steam rising from a neighborhood onsen, it becomes something entirely different. A local fisherman cast his line near the Eikan-do bridge, nodding as I passed. This is when Kyoto belongs to its residents.

## Practical Tips
- Visit Otagi Nenbutsu-ji before 9 AM to avoid the small tour groups that arrive later
- Giou-ji requires a separate 300 yen admission — bring cash
- The path to Otagi Nenbutsu-ji involves stairs; wear comfortable shoes
- Autumn and June (rainy season) offer the most atmospheric moss viewing`,
    readTime: 8,
  },
  {
    title: 'Lisbon After Dark: A Foodie Pilgrimage Through Secret Tascas',
    slug: 'lisbon-after-dark-foodie-tascas',
    category: 'experience',
    excerpt: 'Follow the locals to family-run tascas where grandmother recipes and natural wine create unforgettable nights.',
    location: 'Lisbon, Portugal',
    content: `# Lisbon After Dark: A Foodie Pilgrimage Through Secret Tascas

Lisbon's food scene isn't in the Michelin restaurants — it's in the tascas, those unassuming family-run taverns where the menu changes daily and the wine flows from unmarked bottles. Over three weeks of evening exploration, I mapped out the ones worth traveling for.

## Tasca do Chico in Bairro Alto

This tiny spot with blue-and-white tiles and standing room only serves the best petiscos in the neighborhood. The salt cod fritters (pastéis de bacalhau) are crispy outside, creamy inside, and disappear within seconds of hitting the marble counter. Stand at the bar, order a glass of house red, and let the owner decide what you eat. Trust me on this.

## Sol e Pesca: A Fisherman's Dream

Housed in a former fishing tackle shop in Cais do Sodré, Sol e Pesca serves tinned fish elevated to art. Sardines in olive oil with roasted peppers, octopus in garlic sauce, mackerel with tomato — all served with crusty bread and cold vinho verde. The bartender explained that each tin tells the story of a specific Portuguese coastal town.

## The Secret of Taberna da Rua das Flores

No sign marks the entrance. Push through the curtain and find a room where grandmother cooks behind a counter while her grandson manages the natural wine list. The pork cheeks braised in red wine for six hours fell apart with a fork. I ate them at the communal table next to a Portuguese architect who drew me a map of his favorite spots on a paper napkin.

## Where the Locals Go
- For seafood: Cervejaria Ramiro (arrive at 5 PM to beat the line)
- For pastries: Pastelaria Aloma in Campo de Ourique
- For wine: Garrafeira Alfaia in Bairro Alto
- For midnight snacks: any tasca still open after 11 PM`,
    readTime: 7,
  },
  {
    title: 'Solo in Patagonia: A Photographer\'s Guide to the W Circuit',
    slug: 'solo-patagonia-w-circuit-photography',
    category: 'adventure',
    excerpt: 'Trekking Torres del Paine alone with a camera taught me more about light, patience, and myself than any workshop ever could.',
    location: 'Patagonia, Chile',
    content: `# Solo in Patagonia: A Photographer's Guide to the W Circuit

They say Patagonia has four seasons in a day. What they don't tell you is that each season creates entirely different photographs, and the best light lasts approximately seven minutes. Trekking the W Circuit solo with 15kg of camera gear taught me to work fast, think creatively, and embrace the chaos of weather that defines this landscape.

## The Torres at Sunrise: Worth the 4 AM Alarm

The iconic granite towers reward those who start hiking in darkness. I left Camp Torres at 3:45 AM with a headlamp, arriving at the viewpoint 45 minutes before sunrise. As the first light hit the towers, they transitioned from grey silhouettes to burning gold against a pink sky. My fingers were numb, but I captured the best landscape photograph of my life.

## Grey Glacier: Blue Ice and Dramatic Skies

The Grey Glacier viewpoint offers the most dramatic weather photography on the circuit. When storm clouds roll in from the Southern Patagonian Ice Field, the contrast between dark grey sky and electric-blue ice creates otherworldly images. Use a polarizing filter to cut through atmospheric haze and bring out the ice texture.

## French Valley: Panorama Paradise

The hanging glaciers above the French Valley create a natural amphitheater that begs for panoramic compositions. I used a 24mm lens vertically and stitched five frames together for a massive 120-megapixel image that captures the full scale of the valley. Pro tip: wait for wind gusts to create spindrift off the glaciers — it adds dynamism to otherwise static scenes.

## Camera Settings for Patagonia
- Landscape: f/11, ISO 100, 1/125s with ND grad filters
- Glacier detail: f/8, ISO 200, polarizer engaged
- Wildlife (guanacos): 70-200mm at f/4, 1/1000s minimum
- Always carry a rain cover — weather changes in seconds`,
    readTime: 10,
  },
  {
    title: 'Marrakech Off the Map: Finding Authenticity in the Medina',
    slug: 'marrakech-off-the-map-authentic-medina',
    category: 'experience',
    excerpt: 'Beyond the souks and snake charmers lies a Marrakech that guidebooks miss entirely.',
    location: 'Marrakech, Morocco',
    content: `# Marrakech Off the Map: Finding Authenticity in the Medina

The Marrakech most tourists see is a performance — Jemaa el-Fnaa square with its orange juice stalls and henna artists, the Majorelle Garden with its Instagram queues, the endless carpet shops where every vendor claims to be Berber. But if you're willing to get lost intentionally, a completely different city reveals itself.

## The Tanneries Nobody Talks About

Skip the famous Chouara Tannery in Fes — everyone goes there. Instead, find the small tannery in the Mouassine district where three families have processed leather using the same natural dyes for four centuries. The owner, Hassan, showed me how pomegranate creates red, indigo makes blue, and poppy flowers produce yellow. The smell is intense but the craft is mesmerizing.

## Tea with a Carpet Weaver's Family

I met Fatima in a narrow alley where she was washing wool in a stone basin. She invited me upstairs for mint tea and showed me the carpet she'd been weaving for eight months — a traditional Beni Ourain design with her family's symbols woven into the border. No pressure to buy, no tourist markup. Just tea, stories, and the sound of her loom.

## The Real Hammam Experience

Forget the spa hammams with rose petals and champagne. The local hammam in the Bab Doukkala neighborhood costs 20 dirhams (about $2) and offers the authentic experience: steaming rooms, black olive soap scrubs administered by women who have known each other for decades, and conversations that flow as freely as the hot water.

## Getting Lost on Purpose
- Start at the Mouassine Mosque and walk away from the main souks
- Follow the sound of metalworkers — their workshops are open to watch
- Eat where you see only Moroccan customers
- Learn "La shukran" (no thank you) — you'll use it constantly`,
    readTime: 9,
  },
  {
    title: 'New Zealand South Island: A Road Trip Through Middle-Earth',
    slug: 'new-zealand-south-island-road-trip',
    category: 'adventure',
    excerpt: 'From glaciers to fjords, this 10-day South Island itinerary covers the best of Aotearoa.',
    location: 'South Island, New Zealand',
    content: `# New Zealand South Island: A Road Trip Through Middle-Earth

New Zealand's South Island isn't just beautiful — it's almost unfairly spectacular. Over ten days of driving from Christchurch to Queenstown, I witnessed landscapes that made me understand why Peter Jackson chose this country for Middle-Earth. This itinerary balances iconic stops with hidden gems that most visitors speed past.

## Days 1-2: Christchurch to Kaikoura

Don't rush the drive north. Stop at the Waipara Valley wineries for pinot noir tastings, then continue to Kaikoura where the mountains meet the sea so dramatically it looks photoshopped. The whale watching tour delivered — we saw three sperm whales surface just meters from our boat, their massive tails rising like cathedral spires before diving.

## Days 3-4: The West Coast Glaciers

Fox and Franz Josef Glaciers are retreating rapidly, so see them now. I did the Heli-Hike on Franz Josef — a helicopter landing on the glacier followed by two hours of ice trekking through blue caves and crevasses that glowed with an impossible turquoise light. Our guide explained that this glacier moves up to 5 meters per day, constantly reshaping the landscape.

## Days 5-6: Wanaka and the Rob Roy Glacier Track

Queenstown gets the hype, but Wanaka has the soul. The Rob Roy Glacier Track is a 4-hour return hike through beech forest that opens suddenly to a valley where a massive glacier hangs between peaks, occasionally calving ice into the stream below. I sat on a rock eating lunch while kea (mountain parrots) investigated my backpack.

## Days 7-10: Milford Sound and Queenstown

Milford Sound in the rain is actually better than in sunshine — hundreds of temporary waterfalls cascade down the cliff faces, creating a scene that no camera can truly capture. The overnight cruise let us experience the sound without day-trippers, kayaking in complete silence at dawn.

## Essential Tips
- Book glacier hikes in advance — they sell out weeks ahead
- Download offline maps — cell coverage is spotty on the West Coast
- Pack for all weather regardless of season
- The drive from Wanaka to Milford is one of the world's most beautiful — allow a full day`,
    readTime: 11,
  },
]

const tipsData = [
  {
    title: 'How to Beat Jet Lag: A Science-Backed Strategy for Long-Haul Flights',
    slug: 'beat-jet-lag-science-backed-strategy',
    category: 'planning',
    excerpt: 'Stop suffering through jet lag. This timed approach to light exposure, meals, and melatonin will reset your circadian rhythm faster.',
    content: `# How to Beat Jet Lag: A Science-Backed Strategy

Jet lag isn't just tiredness — it's your circadian rhythm fighting against a new time zone. After dozens of long-haul flights, I've developed a system that minimizes recovery time from days to hours.

## Before You Fly

**Shift your schedule gradually.** Three days before departure, move your bedtime 30 minutes earlier or later each day toward your destination time. Use the app Timeshifter — it creates a personalized plan based on your sleep pattern and flight details.

**Fast before flying.** A 16-hour fast before your destination's breakfast time helps reset your body clock. Eat your last meal at the appropriate time for your destination, then break the fast with a substantial breakfast after landing.

## During the Flight

**Control light exposure aggressively.** If it's nighttime at your destination, wear an eye mask and avoid screens. If it's daytime, keep the window shade open and stay awake. Blue light blocking glasses help if you must use devices during "night" hours.

**Time your melatonin carefully.** Take 0.5-3mg of melatonin 30 minutes before your destination's bedtime — not your departure time. More is not better; higher doses can cause grogginess.

## After Landing

**Get outside immediately.** Natural light is the strongest signal for resetting your circadian rhythm. A 30-minute walk in morning sunlight works better than any supplement.

**Exercise lightly.** A 20-minute jog or yoga session boosts alertness and helps your body adjust. Avoid intense workouts in the evening — they can delay sleep.

**Eat on local time immediately.** Even if you're not hungry, eat breakfast at local breakfast time. Your digestive system plays a major role in circadian rhythm regulation.`,
  },
  {
    title: 'The Carry-On Only Packing Method: Travel Light Without Sacrificing Style',
    slug: 'carry-on-only-packing-method',
    category: 'packing',
    excerpt: 'Pack everything you need for two weeks in a single carry-on. This capsule wardrobe system changed how I travel forever.',
    content: `# The Carry-On Only Packing Method

I used to check bags everywhere. Then an airline lost my luggage on a two-week Europe trip, and I was forced to survive with just my backpack. That accident taught me that most of what we pack is unnecessary. Here's the system I now use for every trip, from weekend getaways to month-long adventures.

## The 5-4-3-2-1 Rule

This formula covers two weeks of travel in any climate:
- **5** tops (mix of short and long sleeve)
- **4** bottoms (pants, shorts, skirts)
- **3** pairs of shoes (walking, dressy, sandals/flip-flops)
- **2** bags (daypack and crossbody)
- **1** of everything else (hat, swimsuit, jacket, watch)

## Fabric Strategy

Choose merino wool for base layers — it resists odor, regulates temperature, and dries overnight. For pants, lightweight technical fabrics with some stretch work everywhere. Avoid cotton except for sleepwear.

## Rolling vs. Folding

Roll everything except structured items (blazers, dress shirts). Use packing cubes to compress and organize. I use color-coded cubes: black for tops, grey for bottoms, blue for underwear and socks.

## The Wear-It-There Rule

Your bulkiest items (jacket, boots, jeans) should be worn on the plane. This saves significant space in your bag and prepares you for temperature changes during travel.

## Toiletries Minimalism

Solid toiletries are game changers: shampoo bars, solid sunscreen, and toothpaste tablets. They don't count against liquid limits, won't leak, and last longer than bottled versions.`,
  },
  {
    title: 'Travel Photography for Non-Photographers: Capture Better Memories',
    slug: 'travel-photography-non-photographers',
    category: 'photography',
    excerpt: 'You do not need expensive gear. These composition and timing techniques will transform your travel photos using just your phone.',
    content: `# Travel Photography for Non-Photographers

The best travel photo I ever took was on an iPhone 8. It wasn't the camera — it was understanding light, composition, and timing. Here are the techniques that will immediately improve your travel photos regardless of what device you use.

## The Golden Hours Are Non-Negotiable

Sunrise and sunset provide the most flattering light for any scene. The hour after sunrise and before sunset creates warm, directional light that adds depth and dimension. Set your alarm — the best photos happen when most tourists are still asleep.

## Rule of Thirds, Then Break It

Place your subject at the intersection of imaginary grid lines for balanced compositions. But once you understand the rule, break it intentionally — center symmetry works beautifully for reflections and architecture.

## Include a Human Element

Landscapes are more compelling with a person in the frame for scale and story. Ask a travel companion to walk into the scene, or use yourself with a tripod and timer. The figure should be small — about 10% of the frame height.

## Leading Lines and Layers

Roads, rivers, fences, and shorelines draw the viewer's eye into the image. Combine this with layers — foreground interest, midground subject, background context — to create depth.

## Edit With Restraint

Adjust exposure, contrast, and saturation modestly. Avoid heavy filters that make scenes look unnatural. The goal is to recreate how the scene felt, not to create something that never existed.`,
  },
  {
    title: 'Solo Travel Safety: Essential Strategies for Confident Exploration',
    slug: 'solo-travel-safety-essential-strategies',
    category: 'safety',
    excerpt: 'Traveling alone does not mean being vulnerable. These practical habits will keep you safe while preserving the freedom that makes solo travel magical.',
    content: `# Solo Travel Safety: Essential Strategies

Solo travel is empowering, liberating, and occasionally intimidating. After five years of traveling alone across six continents, I've developed habits that keep me safe without restricting the spontaneity that makes solo adventures special.

## Before You Go

**Share your itinerary with someone reliable.** Not just your flight details — share accommodation addresses, planned activities, and check-in times. Use Google Maps to drop pins at your accommodations so someone knows exactly where you are.

**Research common scams for your destination.** Every country has specific scams targeting tourists. Knowing them beforehand makes you nearly immune. The "friendly local who wants to practice English" leading you to an overpriced shop is universal.

**Get a local SIM card immediately.** Having data means you can use maps, translation apps, and ride services. It's worth the $20 for the peace of mind alone.

## On the Ground

**Trust your instincts absolutely.** If a situation feels wrong, leave immediately — no explanation needed. Your subconscious processes danger signals faster than your conscious mind can explain them.

**Avoid appearing lost.** Even when you are lost, walk with purpose. Step into a shop or cafe to check your map rather than standing on a street corner looking confused.

**Keep emergency cash hidden.** I divide my cash into three stashes: wallet, hidden pocket, and hidden in my luggage. If one gets stolen, I'm not stranded.

**Join walking tours on your first day.** You'll meet other travelers, get oriented to the city, and learn which neighborhoods are safe after dark. Plus, tour guides give better restaurant recommendations than any app.`,
  },
  {
    title: 'Eat Like a Local: How to Find Authentic Food Anywhere in the World',
    slug: 'eat-like-local-authentic-food-anywhere',
    category: 'food',
    excerpt: 'Tourist restaurants serve predictable dishes to predictable palates. Here is how to find the meals locals actually eat.',
    content: `# Eat Like a Local: How to Find Authentic Food Anywhere

The difference between a forgettable vacation meal and a transformative food experience often comes down to one thing: whether you're eating where tourists eat or where locals eat. After years of seeking out authentic meals, I've developed a reliable system for finding the real food culture of any destination.

## Follow the Golden Rules

**Eat where the menu isn't in English.** If a restaurant has photos of food on the menu and translations in six languages, you're in a tourist trap. The best places often have handwritten menus in one language, or no menu at all — just whatever the kitchen is cooking today.

**Time your meals with the locals.** In Spain, dinner at 6 PM means you're eating with other tourists. Eat at 9:30 PM and you'll be surrounded by locals. In Japan, watch for the lunch rush — the places packed with office workers at noon are the ones worth remembering.

**Look for queues of locals.** A line of tourists means Instagram fame. A line of locals means genuine quality. The best ramen shop I found in Tokyo had a 40-minute wait — and every person in line was Japanese.

## Use Technology Wisely

**Google Maps reviews are more reliable than TripAdvisor.** Look for restaurants with 4.2-4.6 stars (not perfect 5.0 scores, which are often fake) and reviews written in the local language.

**Instagram location tags reveal hidden gems.** Search the location tag of a city and filter by recent posts. Locals posting food photos will lead you to places no guidebook covers.

**Ask your accommodation host for their personal spots.** Not "where should I eat?" — ask "where do YOU eat?" The answer is always different and always better.`,
  },
]

const communityPostsData = [
  {
    caption: 'Golden hour at Otagi Nenbutsu-ji in Kyoto 🍁 No tourists, just 1,200 stone rakan statues watching the sunset. This is the Kyoto most people never see.',
    location: 'Kyoto, Japan',
    type: 'photo-story',
  },
  {
    caption: 'Pro tip for Lisbon: Skip the Time Out Market and head to Sol e Pesca in Cais do Sodré. Tinned fish + vinho verde + zero tourists = perfection 🐟🍷',
    location: 'Lisbon, Portugal',
    type: 'travel-tip',
  },
  {
    caption: 'Patagonia W Circuit day 3: Woke up at 3:45 AM to hike to the Torres viewpoint in complete darkness. When the sun hit the granite peaks, I actually cried. Worth every frozen finger 🏔️',
    location: 'Torres del Paine, Chile',
    type: 'photo-story',
  },
  {
    caption: 'Marrakech secret: The local hammam in Bab Doukkala neighborhood costs 20 dirhams (~$2) and is 100x more authentic than any spa hammam. Just bring your own towel and embrace the experience 🧖‍♀️',
    location: 'Marrakech, Morocco',
    type: 'travel-tip',
  },
  {
    caption: 'New Zealand road trip pro tip: Drive the road from Wanaka to Milford Sound at sunrise. You will have the entire landscape to yourself, and the light on the mountains is unreal 🚗🇳🇿',
    location: 'South Island, New Zealand',
    type: 'photo-story',
  },
]

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find AI author
    const authorsResult = await payload.find({
      collection: 'authors',
      where: { username: { equals: 'wanderer' } },
      limit: 1,
    })

    let aiAuthorId: string
    if (authorsResult.docs.length > 0) {
      aiAuthorId = authorsResult.docs[0].id as string
    } else {
      return NextResponse.json({ error: 'AI author not found. Run /api/seed first.' }, { status: 400 })
    }

    const results = {
      stories: [] as any[],
      tips: [] as any[],
      communityPosts: [] as any[],
    }

    // Create stories
    for (const story of storiesData) {
      const existing = await payload.find({
        collection: 'stories',
        where: { slug: { equals: story.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        const doc = await payload.create({
          collection: 'stories',
          data: {
            title: story.title,
            slug: story.slug,
            author: aiAuthorId,
            status: 'published',
            category: story.category,
            excerpt: story.excerpt,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: story.content }],
                  },
                ],
              },
            },
            location: story.location,
            publishedAt: new Date().toISOString(),
            readTime: story.readTime,
            viewCount: Math.floor(Math.random() * 500) + 50,
          },
        })
        results.stories.push({ id: doc.id, title: story.title, action: 'created' })
      } else {
        results.stories.push({ title: story.title, action: 'already-exists' })
      }
    }

    // Create tips
    for (const tip of tipsData) {
      const existing = await payload.find({
        collection: 'tips',
        where: { slug: { equals: tip.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        const doc = await payload.create({
          collection: 'tips',
          data: {
            title: tip.title,
            slug: tip.slug,
            author: aiAuthorId,
            status: 'published',
            category: tip.category,
            excerpt: tip.excerpt,
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: tip.content }],
                  },
                ],
              },
            },
            publishedAt: new Date().toISOString(),
          },
        })
        results.tips.push({ id: doc.id, title: tip.title, action: 'created' })
      } else {
        results.tips.push({ title: tip.title, action: 'already-exists' })
      }
    }

    // Create community posts
    for (const post of communityPostsData) {
      const doc = await payload.create({
        collection: 'community-posts',
        data: {
          caption: post.caption,
          author: { relationTo: 'authors', value: aiAuthorId },
          location: post.location,
          status: 'published',
          likes: Math.floor(Math.random() * 200) + 20,
        },
      })
      results.communityPosts.push({ id: doc.id, location: post.location, type: post.type, action: 'created' })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed content failed:', error)
    return NextResponse.json(
      { error: 'Seed content failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
