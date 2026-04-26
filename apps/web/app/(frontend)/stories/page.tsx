import Link from 'next/link'
import { StoryCard } from '@/components/story/story-card'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const categories = ['All Categories', 'Adventure', 'Destination', 'Experience', 'Tips', 'Photo Story']

const allStories = [
  {
    id: '1',
    title: 'Finding Paradise in El Nido, Philippines',
    slug: 'finding-paradise-el-nido',
    excerpt: 'Crystal clear waters, hidden lagoons, and limestone cliffs that take your breath away.',
    category: 'Destination',
    coverImage: { url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80', alt: 'El Nido' },
    author: { name: 'Sarah Mitchell', avatar: { url: '' } },
    publishedAt: '2024-05-12',
    readTime: 8,
  },
  {
    id: '2',
    title: 'Trekking the Himalayas: Lessons from the Mountains',
    slug: 'trekking-himalayas',
    excerpt: 'What a month in the world\'s highest mountain range taught me about resilience and gratitude.',
    category: 'Adventure',
    coverImage: { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', alt: 'Himalayas' },
    author: { name: 'Arjun Mehta', avatar: { url: '' } },
    publishedAt: '2024-05-05',
    readTime: 12,
  },
  {
    id: '3',
    title: 'A Week in Santorini: Sunsets & Sea',
    slug: 'week-in-santorini',
    excerpt: 'The Greek island that lives up to every postcard you\'ve ever seen.',
    category: 'Experience',
    coverImage: { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', alt: 'Santorini' },
    author: { name: 'James Carter', avatar: { url: '' } },
    publishedAt: '2024-05-08',
    readTime: 6,
  },
  {
    id: '4',
    title: 'Exploring Kyoto: A Blend of Tradition and Tranquility',
    slug: 'exploring-kyoto',
    excerpt: 'Kyoto is a city where ancient traditions meet beautiful simplicity.',
    category: 'Destination',
    coverImage: { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', alt: 'Kyoto' },
    author: { name: 'Daniel Kim', avatar: { url: '' } },
    publishedAt: '2024-05-14',
    readTime: 5,
  },
  {
    id: '5',
    title: 'Road Tripping Iceland: The Ultimate Itinerary',
    slug: 'iceland-road-trip',
    excerpt: 'From waterfalls to volcanic beaches, here is our 7-day road trip across Iceland\'s Ring Road.',
    category: 'Adventure',
    coverImage: { url: 'https://images.unsplash.com/photo-1520638023360-6def43369781?w=800&q=80', alt: 'Iceland' },
    author: { name: 'Lena Hoffman', avatar: { url: '' } },
    publishedAt: '2024-05-11',
    readTime: 7,
  },
  {
    id: '6',
    title: 'Lost in Morocco: Colors, Culture & Kindness',
    slug: 'lost-in-morocco',
    excerpt: 'A soulful journey through the medinas, mountains, and magical moments.',
    category: 'Experience',
    coverImage: { url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80', alt: 'Morocco' },
    author: { name: 'Omar Farid', avatar: { url: '' } },
    publishedAt: '2024-05-09',
    readTime: 6,
  },
]

export const metadata = {
  title: 'Stories',
  description: 'Real experiences, honest stories. Endless inspiration.',
}

export default function StoriesPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
            Stories from Around the World
          </h1>
          <p className="text-muted-foreground mb-8">
            Real experiences, honest stories. Endless inspiration.
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={cat === 'All Categories' ? 'default' : 'secondary'}
                  className="cursor-pointer whitespace-nowrap"
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 md:ml-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search stories..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            {[1, 2, 3, '...', 8].map((page, i) => (
              <Button
                key={i}
                variant={page === 1 ? 'default' : 'outline'}
                size="sm"
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
