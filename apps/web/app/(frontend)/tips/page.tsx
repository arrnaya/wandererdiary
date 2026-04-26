import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Lightbulb } from 'lucide-react'

const tips = [
  {
    id: '1',
    title: '10 Packing Tips for Long-Term Travelers',
    slug: 'packing-tips-long-term',
    category: 'Packing',
    excerpt: 'Pack smart, travel light, and enjoy the journey without the extra baggage.',
    coverImage: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=400&q=80',
    author: 'Sarah Mitchell',
    publishedAt: '2024-05-10',
  },
  {
    id: '2',
    title: 'How to Travel on a Budget in 2024',
    slug: 'travel-budget-2024',
    category: 'Budget',
    excerpt: 'Save more, spend less. Tips and tricks for budget travelers.',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
    author: 'Lena Hoffman',
    publishedAt: '2024-05-08',
  },
  {
    id: '3',
    title: 'Staying Safe While Traveling Solo',
    slug: 'solo-travel-safety',
    category: 'Safety',
    excerpt: 'Your safety is your superpower. Travel smart with these solo tips.',
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80',
    author: 'Arjun Mehta',
    publishedAt: '2024-05-06',
  },
]

const categories = ['All Tips', 'Planning', 'Packing', 'Budget', 'Safety', 'Photography', 'Solo Travel']

export const metadata = {
  title: 'Travel Tips & Guides',
  description: 'Practical tips to help you travel smarter and better.',
}

export default function TipsPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
            Travel Tips & Guides
          </h1>
          <p className="text-muted-foreground mb-8">
            Practical tips to help you travel smarter and better.
          </p>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={cat === 'All Tips' ? 'default' : 'secondary'}
                className="cursor-pointer whitespace-nowrap"
              >
                {cat}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <article
                key={tip.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/tips/${tip.slug}`} className="relative block aspect-[16/9]">
                  <Image
                    src={tip.coverImage}
                    alt={tip.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="p-5">
                  <Badge className="mb-2">{tip.category}</Badge>
                  <Link href={`/tips/${tip.slug}`}>
                    <h3 className="font-display font-semibold text-lg leading-tight hover:text-brand-amber transition-colors">
                      {tip.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {tip.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>{tip.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tip.publishedAt}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
