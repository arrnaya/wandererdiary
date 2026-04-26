import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { Clock, Bookmark } from 'lucide-react'

interface StoryCardProps {
  story: {
    id: string
    title: string
    slug: string
    excerpt?: string
    category: string
    coverImage?: {
      url: string
      alt: string
    }
    author?: {
      name: string
      avatar?: { url: string }
    }
    publishedAt?: string
    readTime?: number
  }
  variant?: 'default' | 'horizontal' | 'featured'
}

export function StoryCard({ story, variant = 'default' }: StoryCardProps) {
  if (variant === 'horizontal') {
    return (
      <article className="flex gap-4 group">
        <Link href={`/stories/${story.slug}`} className="relative w-32 h-24 md:w-48 md:h-32 shrink-0 overflow-hidden rounded-lg">
          {story.coverImage ? (
            <Image
              src={story.coverImage.url}
              alt={story.coverImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-brand-cream" />
          )}
        </Link>
        <div className="flex flex-col justify-center">
          <Badge className="w-fit mb-2">{story.category}</Badge>
          <Link href={`/stories/${story.slug}`}>
            <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-brand-amber transition-colors line-clamp-2">
              {story.title}
            </h3>
          </Link>
          {story.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 hidden md:block">
              {story.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {story.author && (
              <span className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={story.author.avatar?.url} />
                  <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                </Avatar>
                {story.author.name}
              </span>
            )}
            {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
            {story.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {story.readTime} min read
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-xl">
        <Link href={`/stories/${story.slug}`} className="relative block aspect-[4/3] md:aspect-[16/10]">
          {story.coverImage ? (
            <Image
              src={story.coverImage.url}
              alt={story.coverImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-brand-cream" />
          )}
          <div className="absolute inset-0 gradient-overlay" />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <Badge className="mb-2">{story.category}</Badge>
          <Link href={`/stories/${story.slug}`}>
            <h3 className="font-display font-semibold text-xl md:text-2xl text-white leading-tight group-hover:text-brand-amber transition-colors">
              {story.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-2 text-xs text-white/80">
            {story.author && (
              <span className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5 border border-white/30">
                  <AvatarImage src={story.author.avatar?.url} />
                  <AvatarFallback className="bg-brand-darkGreen text-white text-xs">
                    {story.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                {story.author.name}
              </span>
            )}
            {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/stories/${story.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        {story.coverImage ? (
          <Image
            src={story.coverImage.url}
            alt={story.coverImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-cream" />
        )}
        <div className="absolute top-3 left-3">
          <Badge>{story.category}</Badge>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/stories/${story.slug}`}>
          <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-brand-amber transition-colors line-clamp-2">
            {story.title}
          </h3>
        </Link>
        {story.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {story.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {story.author && (
              <>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={story.author.avatar?.url} />
                  <AvatarFallback className="text-xs">{story.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{story.author.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
            <button className="p-1 hover:bg-brand-cream rounded-full transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
