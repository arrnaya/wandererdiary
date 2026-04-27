import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production'

// Rich destination content with sections
const destinationContent: Record<string, {
  overview: string
  topAttractions: string[]
  foodDrink: string[]
  gettingAround: string
  whereToStay: string
  practicalTips: string[]
}> = {
  france: {
    overview: `France is more than Paris. From the lavender fields of Provence to the snow-capped Alps, the rugged coastlines of Brittany to the glamorous Riviera, France offers an unparalleled diversity of landscapes and experiences. It is the world's most visited country for good reason — every region feels like a different country with its own dialect, cuisine, and traditions.

The French approach to life — the art de vivre — is infectious. Long lunches, excellent wine, passionate debates in cafes, and a deep appreciation for beauty in everyday things. Whether you're exploring medieval villages, skiing in the Alps, or simply people-watching at a Parisian terrace, France delivers moments of pure joy.`,
    topAttractions: [
      'Eiffel Tower and Champs-Élysées in Paris',
      'Palace of Versailles and its magnificent gardens',
      'Mont Saint-Michel rising from the tidal flats',
      'The lavender fields and hilltop villages of Provence',
      'Loire Valley châteaux spanning centuries of architecture',
    ],
    foodDrink: [
      'Croissants and café au lait at a neighborhood boulangerie',
      'Coq au vin and beef bourguignon in a classic bistro',
      'Fresh oysters and seafood along the Brittany coast',
      'Provencal ratatouille and bouillabaisse in Marseille',
      'Champagne tasting in Reims at historic maisons',
    ],
    gettingAround: 'France has an excellent high-speed rail network (TGV) connecting major cities. For rural areas and wine regions, renting a car gives you flexibility. Paris has an extensive Metro system, and most cities have reliable public transport. Domestic flights are available but trains are often faster for city-center to city-center travel.',
    whereToStay: 'In Paris, stay in Le Marais for historic charm or Saint-Germain for Left Bank elegance. Provence offers beautiful countryside gîtes and farmhouse B&Bs. The Alps have cozy chalets, while the Riviera ranges from Cannes luxury to Nice boutique hotels. For budget travelers, France has excellent hostels and campsite networks.',
    practicalTips: [
      'Learn basic French phrases — locals appreciate the effort',
      'Many shops close Sunday and Monday — plan accordingly',
      'Restaurant meals are leisurely — do not rush',
      'Tipping is included (service compris) but rounding up is appreciated',
      'Museums are often free on first Sundays of the month',
    ],
  },
  spain: {
    overview: `Spain pulses with life. From the flamenco rhythms of Andalusia to the avant-garde architecture of Barcelona, the rolling vineyards of La Rioja to the volcanic landscapes of the Canary Islands, Spain is a country of dramatic contrasts and passionate people.

The Spanish lifestyle revolves around food, family, and fiesta. Dinner starts at 9 PM, siestas are still sacred in smaller towns, and every village has a festival worth traveling for. The country's Moorish, Roman, and Catholic heritage layers together in a cultural tapestry that is uniquely Spanish — visible in the architecture, tasted in the food, and felt in the warm hospitality of its people.`,
    topAttractions: [
      'Sagrada Família and Park Güell in Barcelona',
      'The Alhambra palace complex in Granada',
      'Madrid\'s Prado Museum and Royal Palace',
      'Seville Cathedral and the Real Alcázar',
      'The Camino de Santiago pilgrimage routes',
    ],
    foodDrink: [
      'Tapas hopping in Seville\'s Triana neighborhood',
      'Paella valenciana at a beachfront restaurant',
      'Pintxos and txakoli wine in San Sebastián',
      'Jamón ibérico and Manchego cheese tasting',
      'Vermouth and anchovies at a Madrid vermutería',
    ],
    gettingAround: 'Spain\'s AVE high-speed rail connects Madrid, Barcelona, Seville, and Valencia in under 3 hours. Regional trains and buses reach smaller towns. For Andalusia and northern Spain, renting a car is ideal. Major cities have excellent metro systems. Domestic flights are affordable via Vueling and Iberia.',
    whereToStay: 'Barcelona\'s Gothic Quarter puts you in the heart of the action, while Gràcia offers local flavor. In Madrid, Malasaña is trendy and central. Seville\'s Santa Cruz is touristy but charming — consider Triana across the river for authenticity. Parador hotels in historic buildings offer unique luxury stays.',
    practicalTips: [
      'Shops close mid-day (2-5 PM) in smaller cities — plan around siesta',
      'Free tapas come with drinks in Granada and León',
      'Book Alhambra tickets weeks in advance',
      'August is extremely hot — seek northern Spain or coast',
      'Spaniards eat late — restaurants often empty before 9 PM',
    ],
  },
  'united-states': {
    overview: `The United States is a continent-sized country of staggering diversity. From the neon canyons of New York City to the red rock deserts of Utah, the misty forests of the Pacific Northwest to the tropical keys of Florida, America offers every type of landscape and experience imaginable.

What unites this vast nation is a spirit of optimism and reinvention. Each state feels like its own country with distinct accents, cuisines, and attitudes. The national parks system — the crown jewel of American conservation — protects some of the most spectacular wilderness on Earth. Road trips here are legendary, with scenic byways crossing mountains, deserts, coastlines, and prairies.`,
    topAttractions: [
      'Grand Canyon National Park in Arizona',
      'Yellowstone\'s geysers and wildlife',
      'New York City\'s Manhattan skyline and Central Park',
      'Yosemite Valley and Half Dome in California',
      'New Orleans French Quarter and live jazz',
    ],
    foodDrink: [
      'Texas BBQ brisket in Austin or Lockhart',
      'New York City pizza by the slice at 2 AM',
      'New Orleans gumbo and beignets at Café du Monde',
      'Pacific Northwest farm-to-table dining in Portland',
      'Southern fried chicken and biscuits in Nashville',
    ],
    gettingAround: 'Renting a car is essential for national parks and road trips. Major cities have public transit, but outside them it is limited. Domestic flights cover long distances affordably. Amtrak offers scenic routes but is slower than flying. Rideshare apps work nationwide.',
    whereToStay: 'National park lodges book up months in advance — plan early. NYC offers everything from hostels to luxury. For road trips, mix chain motels (consistent, affordable) with unique Airbnbs and boutique hotels. National park campgrounds are spectacular but require reservations.',
    practicalTips: [
      'Tipping 18-20% is expected at restaurants',
      'National parks require entry passes — buy an annual pass if visiting multiple',
      'Sales tax is added at checkout — prices shown are pre-tax',
      'Distances are huge — do not underestimate drive times',
      'Health care is expensive — travel insurance is essential',
    ],
  },
  italy: {
    overview: `Italy is the world's greatest classroom of beauty. For three millennia, this boot-shaped peninsula has produced the finest art, architecture, cuisine, and fashion humanity has known. Every hill town has a story, every vineyard a family legacy, and every nonna a recipe perfected over generations.

But Italy is not a museum — it is vibrantly alive. Vespas zip through medieval streets, espresso is consumed in seconds at standing-room-only bars, and the passeggiata (evening stroll) is a sacred ritual. From the Dolomites' jagged peaks to Sicily's Greek temples, Italy rewards those who slow down and savor each moment.`,
    topAttractions: [
      'The Colosseum and Roman Forum in Rome',
      'Florence\'s Uffizi Gallery and Duomo',
      'Venice\'s Grand Canal and St. Mark\'s Basilica',
      'Cinque Terre\'s colorful coastal villages',
      'The ancient ruins of Pompeii near Naples',
    ],
    foodDrink: [
      'Authentic Neapolitan pizza in its birthplace',
      'Fresh pasta carbonara in Rome\'s Trastevere',
      'Florentine bistecca alla fiorentina (T-bone steak)',
      'Aperitivo with Aperol spritz in Milan',
      'Gelato from artisanal shops — look for natural colors',
    ],
    gettingAround: 'High-speed trains (Frecciarossa, Italo) connect major cities quickly. Regional trains reach smaller towns. For Tuscany and the countryside, rent a car. Venice is entirely walkable and boat-based. Rome and Milan have metros, but walking is often faster in city centers.',
    whereToStay: 'In Rome, Trastevere offers local atmosphere. Florence\'s historic center is walkable but pricey — consider across the river. Venice\'s main island is magical but expensive; stay in Cannaregio for quieter authenticity. Tuscany agriturismos (farm stays) provide unforgettable experiences.',
    practicalTips: [
      'Cover shoulders and knees when visiting churches',
      'Validate train tickets before boarding — fines are steep',
      'Lunch is the main meal; many restaurants close between lunch and dinner',
      'Coffee at the bar is cheaper than at a table',
      'August is when Italians vacation — cities empty, coasts fill',
    ],
  },
  turkey: {
    overview: `Turkey straddles two continents and countless civilizations. Where else can you watch the sun rise over ancient Greek ruins, swim in turquoise coves once sailed by pirates, and haggle for spices in a bazaar unchanged since Ottoman times — all in the same day?

Istanbul alone justifies the trip. The Hagia Sophia, Blue Mosque, and Topkapi Palace form one of the world's greatest cultural concentrations. But venture beyond and Turkey reveals its true depth: Cappadocia's fairy chimneys, Pamukkale's travertine pools, Ephesus's marble streets, and the wild coastline of Lycia. Turkish hospitality is legendary — expect to be invited for tea by strangers.`,
    topAttractions: [
      'Hagia Sophia and the Blue Mosque in Istanbul',
      'Hot air ballooning over Cappadocia\'s fairy chimneys',
      'The ancient city of Ephesus near Selçuk',
      'Pamukkale\'s white travertine thermal pools',
      'The Turquoise Coast and Blue Cruise gulet trips',
    ],
    foodDrink: [
      'Turkish breakfast spread with simit, olives, and honey',
      'Iskender kebap and adana kebap in their hometown of Bursa/Adana',
      'Meze and rakı by the Bosphorus at sunset',
      'Baklava from Güllüoğlu in Istanbul',
      'Turkish tea (çay) served in tulip glasses everywhere',
    ],
    gettingAround: 'Domestic flights are affordable and efficient (Turkish Airlines, Pegasus). Buses connect everywhere with surprising comfort. Dolmuş (shared minibuses) are cheap for short trips. In Istanbul, use the Istanbulkart for ferries, metro, and trams. Renting a car is ideal for the Turquoise Coast and Cappadocia.',
    whereToStay: 'Istanbul\'s Sultanahmet is central for sightseeing; Beyoğlu (Karaköy/Cihangir) is trendy. Cappadocia cave hotels are a must — book early. Bodrum and Antalya have resorts, but smaller towns like Kaş offer charm. Ottoman-era mansions converted to hotels provide unique stays.',
    practicalTips: [
      'Get an e-visa online before arrival — it is quick and required',
      'Bargaining is expected in bazaars — start at 50% of asking price',
      'Dress modestly when visiting mosques (headscarves provided)',
      'Turkish baths (hammam) are gender-segregated or have separate hours',
      'The call to prayer (ezan) happens five times daily — embrace the rhythm',
    ],
  },
  mexico: {
    overview: `Mexico is far more than beaches and margaritas. It is a civilization layered with Aztec temples, Spanish colonial cities, revolutionary art, and some of the world's most diverse ecosystems — from copper canyons to cloud forests to coral reefs.

The warmth of Mexican culture is immediate and genuine. Strangers become friends over tacos, mariachi music fills plazas on weekends, and every region claims its cuisine is the country's best (and they all have valid arguments). From the color-drenched streets of Guanajuato to the Mayan ruins of the Yucatán, Mexico rewards curiosity and courage.`,
    topAttractions: [
      'Chichén Itzá and Tulum Mayan ruins',
      'Mexico City\'s historic center and Frida Kahlo Museum',
      'Oaxaca\'s Day of the Dead celebrations',
      'Copper Canyon Railway through the Sierra Madre',
      'The cenotes (sinkholes) of the Yucatán Peninsula',
    ],
    foodDrink: [
      'Street tacos al pastor with pineapple and cilantro',
      'Oaxacan mole negro — chocolate meets chili in complex perfection',
      'Fresh ceviche on the Pacific coast',
      'Mezcal tasting in Oaxaca with a knowledgeable guide',
      'Churros and hot chocolate at El Moro in Mexico City',
    ],
    gettingAround: 'ADO buses are comfortable and reliable for intercity travel. Domestic flights (Volaris, Viva Aerobus) are cheap. In cities, Uber works well. Renting a car is fine for the Yucatán but avoid driving at night in remote areas. Collectivos (shared vans) are the local way to get around cheaply.',
    whereToStay: 'Mexico City\'s Roma and Condesa neighborhoods are hip and walkable. Oaxaca\'s historic center is magical. For beaches, Tulum is trendy but crowded — consider Bacalar or Holbox for quieter alternatives. Colonial cities like San Miguel de Allende and Guanajuato have beautiful boutique hotels in restored mansions.',
    practicalTips: [
      'Drink only bottled or purified water — even locals do',
      'Street food is generally safe if the stall is busy and cooking fresh',
      'Carry small bills — change is often scarce',
      'Learn basic Spanish — it transforms your experience',
      'Haggling is expected in markets; fixed prices in shops',
    ],
  },
  'united-kingdom': {
    overview: `The United Kingdom is a storybook come to life. Castles perch on cliffs, villages nestle into green hills, and London remains one of the world's most dynamic cities. But beyond the obvious lies a country of surprising wildness — the Scottish Highlands, the Lake District's fells, and the rugged coastlines of Wales and Cornwall.

British culture is a delightful mix of tradition and innovation. You can attend a medieval jousting tournament in the morning and a cutting-edge art exhibition in the afternoon. Pubs are the social heart of every community, serving real ales, Sunday roasts, and the kind of conversation that stretches for hours.`,
    topAttractions: [
      'The Tower of London and British Museum',
      'Edinburgh Castle and the Royal Mile',
      'Stonehenge and the surrounding Neolithic landscape',
      'The Lake District\'s lakes and fells',
      'The Scottish Highlands and Isle of Skye',
    ],
    foodDrink: [
      'Sunday roast with Yorkshire pudding at a village pub',
      'Fish and chips by the seaside — wrapped in paper',
      'Afternoon tea with scones and clotted cream',
      'Scottish whisky tasting in Speyside or Islay',
      'Curry on Brick Lane in London',
    ],
    gettingAround: 'Trains connect major cities (book in advance for cheaper fares). The London Underground is extensive. For Scotland and Wales, renting a car opens up remote areas. National Express coaches are budget-friendly. Domestic flights serve Scotland and Northern Ireland.',
    whereToStay: 'London\'s Shoreditch is trendy; South Kensington is classic. Edinburgh\'s Old Town is atmospheric. In the countryside, look for pubs with rooms (fantastic food and character). Scotland has both castles and remote bothies (basic shelters for hikers).',
    practicalTips: [
      'Always carry an umbrella — weather changes instantly',
      'Stand on the right side of escalators in London',
      'Pubs close early (11 PM) outside cities',
      'The NHS provides free emergency care — keep your passport handy',
      'Tipping 10-12.5% is standard at restaurants',
    ],
  },
  germany: {
    overview: `Germany confounds stereotypes. Yes, the trains run on time and the beer is excellent, but this country also harbors romantic castles, cutting-edge contemporary art, dense forests that inspired fairy tales, and cities that party from Thursday to Monday.

From the Baltic Sea to the Alps, Germany's regions are fiercely distinct. Bavaria feels like a different country from Berlin, which feels galaxies away from the Rhineland. The country's dark history is confronted with remarkable honesty at memorials and museums, while its future is being built by one of Europe's most innovative economies.`,
    topAttractions: [
      'Neuschwanstein Castle in the Bavarian Alps',
      'Berlin Wall Memorial and Museum Island',
      'The Rhine Valley and its castle-dotted vineyards',
      'Black Forest driving routes and hiking trails',
      'Dresden\'s rebuilt Frauenkirche and art collections',
    ],
    foodDrink: [
      'Currywurst and döner kebab in Berlin',
      'Pretzels and weisswurst at a Munich beer garden',
      'Riesling wine tasting along the Mosel River',
      'Black Forest cake in its namesake region',
      'Craft beer in Hamburg and Cologne',
    ],
    gettingAround: 'Germany\'s Deutsche Bahn rail network is excellent (if occasionally delayed). Autobahns make driving efficient. Cities have superb public transit. Bike infrastructure is world-class — rent a bike for the best city exploration. Long-distance buses (FlixBus) are budget alternatives.',
    whereToStay: 'Berlin\'s Mitte is central; Kreuzberg and Neukölln are edgy. Munich\'s Altstadt is charming but pricey — consider across the river. The Romantic Road has fairy-tale guesthouses. For unique stays, look for Schlosshotels (castle hotels) and Bauernhöfe (farm stays).',
    practicalTips: [
      'Cash is still king — many places do not accept cards',
      'Shops are closed Sunday — plan ahead',
      'Beer purity law (Reinheitsgebot) ensures quality',
      'Tipping is by rounding up or 5-10%',
      'Jaywalking is frowned upon — wait for the green light',
    ],
  },
  greece: {
    overview: `Greece is where Western civilization began, and it still feels like the center of the world when you're watching the sun set over the Aegean from a cliffside taverna. The country's magic lies in its contrasts: ancient temples beside buzzing beach bars, sleepy fishing villages an hour from cosmopolitan Athens, and islands that range from volcanic wilderness to jet-set playgrounds.

Greek hospitality (philoxenia) is not a marketing slogan — it is a sacred duty. You will be fed until you cannot move, offered advice like a local, and treated like family. Combined with some of the Mediterranean's best food, clearest waters, and most spectacular sunsets, Greece delivers on every promise.`,
    topAttractions: [
      'The Acropolis and Parthenon in Athens',
      'Santorini\'s caldera views and Oia sunsets',
      'Delphi, the ancient center of the world',
      'Meteora\'s monasteries perched on rock pillars',
      'The Palace of Knossos on Crete',
    ],
    foodDrink: [
      'Fresh Greek salad with local feta and olive oil',
      'Grilled octopus and saganaki at a seaside taverna',
      'Moussaka and souvlaki from family-run restaurants',
      'Assyrtiko wine from Santorini\'s volcanic vineyards',
      'Baklava and galaktoboureko from Athens pastry shops',
    ],
    gettingAround: 'Ferries connect the islands (book ahead in summer). Athens has a metro to the airport and ports. Renting a car on larger islands (Crete, Rhodes, Corfu) is ideal. Domestic flights (Olympic, Aegean) save time for distant islands. Athens to the islands: Piraeus port for most, Rafina for Cyclades.',
    whereToStay: 'Athens\' Plaka is touristy but convenient — consider Koukaki for local flavor. Santorini\'s Oia is iconic but expensive; stay in Pyrgos or Akrotiri for value. Mykonos Town is the place to be for nightlife. Naxos and Paros offer authentic island life without the crowds.',
    practicalTips: [
      'Island ferries are weather-dependent — build buffer days',
      'August is peak season — prices double, crowds triple',
      'Tavernas often serve complimentary dessert and raki',
      'Cash is preferred on smaller islands',
      'The Greek coffee culture means lingering for hours — embrace it',
    ],
  },
  austria: {
    overview: `Austria is the refined heart of Central Europe. Imperial Vienna, with its coffee houses and opera, feels like a living museum of European culture. But beyond the capital, Austria reveals itself as an outdoor paradise — the Alps dominate the landscape, providing world-class skiing in winter and breathtaking hiking in summer.

The country's Habsburg legacy is visible everywhere: baroque churches, grand palaces, and a cultural obsession with music (Mozart, Strauss, and Haydn all called Austria home). Yet Austria is not stuck in the past — its contemporary art scene, innovative cuisine, and progressive social policies keep it relevant and exciting.`,
    topAttractions: [
      'Schönbrunn Palace and Vienna\'s historic center',
      'Salzburg\'s old town and Mozart\'s birthplace',
      'Hallstatt and the Dachstein Ice Caves',
      'Innsbruck\'s alpine setting and Golden Roof',
      'The Grossglockner High Alpine Road',
    ],
    foodDrink: [
      'Viennese schnitzel at a traditional heuriger (wine tavern)',
      'Sachertorte and melange coffee at Hotel Sacher',
      'Käsespätzle and apfelstrudel in the Alps',
      'Grüner Veltliner and Riesling from Wachau Valley',
      'Goulash and dumplings at a mountain hut',
    ],
    gettingAround: 'ÖBB trains are punctual and comfortable, connecting all major cities. The Vienna U-Bahn is excellent. For alpine regions, buses and cable cars are well-coordinated. Renting a car is great for scenic drives like the Grossglockner Road. Bike paths are extensive and well-marked.',
    whereToStay: 'Vienna\'s Innere Stadt is central; Neubau and Margareten are hip. Salzburg\'s Altstadt is charming but pricey — look across the river. Alpine villages like Zell am See and Kitzbühel offer ski-in/ski-out hotels. Mountain huts (Almhütten) provide rustic, unforgettable experiences.',
    practicalTips: [
      'Vienna\'s coffee houses are UNESCO heritage — linger as long as you like',
      'Ski passes are expensive — buy multi-day passes for savings',
      'Shops close early (6 PM) and all day Sunday',
      'The Vienna Pass covers major attractions and public transport',
      'Learn German pleasantries — Austrians appreciate the effort',
    ],
  },
}

// Generate HTML content from structured data
function generateDestinationHtml(slug: string, existingDesc: string): string {
  const data = destinationContent[slug]
  if (!data) return `<p>${existingDesc}</p>`

  return `
<h2>Overview</h2>
<p>${data.overview}</p>

<h2>Top Attractions</h2>
<ul>
${data.topAttractions.map(a => `<li>${a}</li>`).join('')}
</ul>

<h2>Food &amp; Drink</h2>
<ul>
${data.foodDrink.map(f => `<li>${f}</li>`).join('')}
</ul>

<h2>Getting Around</h2>
<p>${data.gettingAround}</p>

<h2>Where to Stay</h2>
<p>${data.whereToStay}</p>

<h2>Practical Tips</h2>
<ul>
${data.practicalTips.map(t => `<li>${t}</li>`).join('')}
</ul>
`
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get all destinations
    const destinations = await payload.find({
      collection: 'destinations',
      limit: 100,
    })

    const results = []

    for (const dest of destinations.docs) {
      const slug = dest.slug as string
      const content = generateDestinationHtml(slug, dest.description as string)

      // Update destination with rich content
      await payload.update({
        collection: 'destinations',
        id: dest.id,
        data: {
          richContent: content,
        } as any,
      })

      results.push({ name: dest.name, action: 'updated' })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed destinations failed:', error)
    return NextResponse.json(
      { error: 'Seed destinations failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
