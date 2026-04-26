import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin } from 'lucide-react'

const destinations = [
  { name: 'Bali, Indonesia', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', slug: 'bali' },
  { name: 'Switzerland', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=600&q=80', slug: 'switzerland' },
  { name: 'New Zealand', country: 'New Zealand', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&q=80', slug: 'new-zealand' },
  { name: 'Portugal', country: 'Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80', slug: 'portugal' },
  { name: 'Thailand', country: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', slug: 'thailand' },
  { name: 'Iceland', country: 'Iceland', image: 'https://images.unsplash.com/photo-1520638023360-6def43369781?w=600&q=80', slug: 'iceland' },
]

export const metadata = {
  title: 'Destinations',
  description: 'Explore breathtaking places handpicked by the community.',
}

export default function DestinationsPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
            Top Destinations
          </h1>
          <p className="text-muted-foreground mb-8">
            Explore breathtaking places handpicked by the community.
          </p>

          <div className="relative max-w-md mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search destinations..." className="pl-9" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 gradient-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {dest.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline">Load More Destinations</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
