import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Trophy } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getDestinations() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'destinations',
    sort: 'worldRanking',
    limit: 50,
    depth: 1,
  })
  return result.docs
}

export const metadata = {
  title: 'Destinations',
  description: 'Explore breathtaking places handpicked by the community.',
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
                Top Destinations
              </h1>
              <p className="text-muted-foreground mb-8">
                Explore breathtaking places handpicked by the community.
              </p>
            </div>
            <Button variant="dark" className="hidden md:flex gap-2" asChild>
              <Link href="/destinations/rankings">
                <Trophy className="w-4 h-4" />
                World Rankings
              </Link>
            </Button>
          </div>

          <div className="relative max-w-md mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search destinations..." className="pl-9" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest: any) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                {dest.coverImage?.url ? (
                  <Image
                    src={dest.coverImage.url}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-darkGreen flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{dest.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 gradient-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {dest.name}
                  </h3>
                  {dest.worldRanking && (
                    <span className="text-xs text-white/70">
                      World Ranking #{dest.worldRanking}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No destinations found.</p>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/destinations/rankings">
                <Trophy className="w-4 h-4 mr-2" />
                View World Rankings
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
