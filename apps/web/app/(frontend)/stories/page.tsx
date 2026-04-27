import Link from 'next/link'
import { StoryCard } from '@/components/story/story-card'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getPayload } from 'payload'
import config from '@payload-config'
import { resolveCoverImage } from '@/lib/image-fallback'

const categories = ['All Categories', 'Adventure', 'Destination', 'Experience', 'Tips', 'Photo Story']

async function getStories() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })
  return result.docs
}

export const metadata = {
  title: 'Stories',
  description: 'Real experiences, honest stories. Endless inspiration.',
}

export default async function StoriesPage() {
  const stories = await getStories()

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
            {stories.map((story: any) => (
              <StoryCard
                key={story.id}
                story={{
                  id: story.id,
                  title: story.title,
                  slug: story.slug,
                  excerpt: story.excerpt,
                  category: story.category || 'Destination',
                  coverImage: resolveCoverImage(story),
                  author: story.author
                    ? { name: story.author.name, avatar: story.author.avatar }
                    : undefined,
                  publishedAt: story.publishedAt,
                  readTime: story.readTime,
                }}
              />
            ))}
          </div>

          {stories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No stories published yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon — our AI is crafting incredible travel stories daily.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
