import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StoryCard } from '@/components/story/story-card'
import { MapPin, ArrowLeft } from 'lucide-react'

const destination = {
  name: 'Bali, Indonesia',
  country: 'Indonesia',
  description: 'The Island of Gods offers a perfect blend of spirituality, nature, and culture. From terraced rice paddies to ancient temples, Bali enchants every traveler.',
  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80',
}

const stories = [
  {
    id: '4',
    title: 'Exploring Kyoto: A Blend of Tradition and Tranquility',
    slug: 'exploring-kyoto',
    category: 'Destination',
    coverImage: { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', alt: 'Kyoto' },
    author: { name: 'Daniel Kim', avatar: { url: '' } },
    publishedAt: '2024-05-14',
    readTime: 5,
  },
]

export default function DestinationPage() {
  return (
    <div className="animate-fade-in">
      <div className="relative h-[400px]">
        <Image src={destination.image} alt={destination.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-brand-darkGreen/50" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div>
            <Link href="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              All Destinations
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">
              {destination.name}
            </h1>
            <p className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              {destination.country}
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-brand-offWhite">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-brand-dark/80 leading-relaxed mb-12">
            {destination.description}
          </p>

          <h2 className="font-display text-2xl font-bold text-brand-darkGreen mb-6">
            Stories from {destination.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
