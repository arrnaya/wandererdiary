import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, MapPin, Star, ArrowLeft } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

const regions = [
  { label: 'All', value: 'all' },
  { label: 'Asia', value: 'asia' },
  { label: 'Europe', value: 'europe' },
  { label: 'Middle East', value: 'middle-east' },
  { label: 'USA', value: 'usa' },
  { label: 'Africa', value: 'africa' },
  { label: 'Australia', value: 'australia' },
  { label: 'South America', value: 'south-america' },
  { label: 'North America', value: 'north-america' },
]

const activities = [
  { label: 'Hiking', value: 'hiking' },
  { label: 'Honeymoon', value: 'honeymoon' },
  { label: 'Backpacking', value: 'backpacking' },
  { label: 'Solo Travel', value: 'solo-travel' },
  { label: 'Group Travel', value: 'group-travel' },
  { label: 'Food', value: 'food' },
  { label: 'Culture', value: 'culture' },
  { label: 'Adventure', value: 'adventure' },
]

async function getRankedDestinations() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'destinations',
    where: {
      worldRanking: {
        less_than_equal: 50,
      },
    },
    sort: 'worldRanking',
    limit: 100,
    depth: 1,
  })
  return result.docs
}

export const metadata = {
  title: 'World Tourism Rankings',
  description: 'Top destinations ranked by world tourism rankings. Filter by region and activity.',
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; activity?: string }>
}) {
  const params = await searchParams
  const selectedRegion = params.region || 'all'
  const selectedActivity = params.activity || null

  const allDestinations = await getRankedDestinations()

  const destinations = allDestinations.filter((dest: any) => {
    if (selectedRegion !== 'all' && dest.region !== selectedRegion) return false
    if (selectedActivity) {
      const acts = dest.activities?.map((a: any) => a.activity) || []
      if (!acts.includes(selectedActivity)) return false
    }
    return true
  })

  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-darkGreen mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-brand-amber" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen">
              World Tourism Rankings
            </h1>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Top 50 destinations ranked by international visitor arrivals (UNWTO data).
            Discover the world&apos;s most beloved places and filter by region or activity.
          </p>

          {/* Region Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {regions.map((region) => (
              <Link
                key={region.value}
                href={`/destinations/rankings?region=${region.value}${selectedActivity ? `&activity=${selectedActivity}` : ''}`}
              >
                <Badge
                  variant={selectedRegion === region.value ? 'default' : 'secondary'}
                  className="cursor-pointer text-sm py-1.5 px-3"
                >
                  {region.label}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Activity Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {activities.map((activity) => (
              <Link
                key={activity.value}
                href={`/destinations/rankings?region=${selectedRegion}&activity=${activity.value}`}
              >
                <Badge
                  variant={selectedActivity === activity.value ? 'amber' : 'outline'}
                  className="cursor-pointer text-sm py-1 px-2.5"
                >
                  {activity.label}
                </Badge>
              </Link>
            ))}
            {selectedActivity && (
              <Link href={`/destinations/rankings?region=${selectedRegion}`}>
                <Badge variant="outline" className="cursor-pointer text-sm py-1 px-2.5 border-red-300 text-red-600 hover:bg-red-50">
                  Clear Activity
                </Badge>
              </Link>
            )}
          </div>

          {/* Rankings List */}
          <div className="space-y-4">
            {destinations.map((dest: any) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="flex items-center gap-4 bg-white rounded-xl p-4 hover:shadow-md transition-shadow group"
              >
                {/* Rank */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                    dest.worldRanking === 1
                      ? 'bg-brand-amber text-white'
                      : dest.worldRanking === 2
                      ? 'bg-gray-300 text-gray-700'
                      : dest.worldRanking === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-brand-cream text-brand-darkGreen'
                  }`}
                >
                  {dest.worldRanking}
                </div>

                {/* Image */}
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                  {dest.coverImage?.url ? (
                    <Image
                      src={dest.coverImage.url}
                      alt={dest.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-cream flex items-center justify-center text-brand-darkGreen font-bold">
                      {dest.name[0]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-lg text-brand-darkGreen group-hover:text-brand-amber transition-colors">
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                    {dest.region && (
                      <span className="capitalize">• {dest.region.replace(/-/g, ' ')}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {dest.activities?.slice(0, 3).map((a: any) => (
                      <Badge key={a.activity} variant="secondary" className="text-xs">
                        {a.activity.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0 hidden md:block">
                  <div className="flex items-center gap-1 text-brand-amber">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{dest.tourismScore || '—'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Tourism Score</p>
                </div>

                <Button variant="ghost" size="sm" className="shrink-0">
                  Explore
                </Button>
              </Link>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl">
              <Trophy className="w-12 h-12 text-brand-cream mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No destinations match these filters.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try selecting a different region or activity.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
