import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StoryCard } from '@/components/story/story-card'
import { formatDate } from '@/lib/utils'
import {
  Clock,
  Bookmark,
  Share2,
  MessageCircle,
  Heart,
  Send,
  MapPin,
  ChevronLeft,
} from 'lucide-react'

const story = {
  id: '1',
  title: 'Finding Paradise in El Nido, Philippines',
  slug: 'finding-paradise-el-nido',
  category: 'Destination',
  coverImage: { url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80', alt: 'El Nido' },
  author: { name: 'Sarah Mitchell', avatar: { url: '' }, bio: 'Travel writer and photographer based in Southeast Asia.' },
  publishedAt: '2024-05-12',
  location: 'El Nido, Palawan, Philippines',
  content: `
    <p>El Nido is not just a place, it is a feeling. A gateway to nature's raw beauty and serenity. There are places that stay with you long after you leave, and El Nido is one of them. From crystal-clear lagoons to towering limestone cliffs, every moment feels like a dream.</p>
    <h2>A Journey Worth Taking</h2>
    <p>The boat ride from the mainland sets the tone for what awaits. Turquoise waters stretch endlessly, and as you approach the islands, the dramatic karst formations rise from the sea like ancient guardians. It is a landscape that demands silence and awe.</p>
    <p>We spent our days island hopping, discovering hidden lagoons accessible only through narrow openings between cliffs. Each lagoon felt like a secret world, untouched and pristine. The Big Lagoon, Small Lagoon, and Secret Lagoon each offered their own magic.</p>
    <h2>Where to Stay</h2>
    <p>El Nido town proper offers a range of accommodations, but for the true experience, consider staying at one of the eco-resorts on the outlying islands. We chose a beachfront cottage on Lagen Island, where we fell asleep to the sound of waves and woke to sunrise painting the cliffs in gold.</p>
    <h2>Practical Tips</h2>
    <ul>
      <li>Visit during the dry season (November to May) for the best weather</li>
      <li>Book island hopping tours in advance during peak season</li>
      <li>Bring reef-safe sunscreen to protect the coral</li>
      <li>Cash is king — ATMs are limited and often offline</li>
    </ul>
  `,
  tags: ['Philippines', 'Island Hopping', 'Beach', 'Southeast Asia'],
  readTime: 8,
}

const relatedStories = [
  {
    id: '2',
    title: 'A Week in Santorini: Sunsets & Sea',
    slug: 'week-in-santorini',
    category: 'Experience',
    coverImage: { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', alt: 'Santorini' },
    author: { name: 'James Carter', avatar: { url: '' } },
    publishedAt: '2024-05-08',
  },
  {
    id: '3',
    title: 'Trekking the Himalayas: Lessons from the Mountains',
    slug: 'trekking-himalayas',
    category: 'Adventure',
    coverImage: { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80', alt: 'Himalayas' },
    author: { name: 'Arjun Mehta', avatar: { url: '' } },
    publishedAt: '2024-05-05',
  },
]

const comments = [
  {
    id: '1',
    authorName: 'Emily Watson',
    content: 'This brought back so many memories! El Nido was the highlight of my Philippines trip. The Secret Lagoon is absolutely magical.',
    createdAt: '2024-05-13',
    avatar: '',
  },
  {
    id: '2',
    authorName: 'Michael Chen',
    content: 'Great tips on the cash situation. We learned that the hard way! Would love to see a follow-up on Coron.',
    createdAt: '2024-05-14',
    avatar: '',
  },
]

export default function StoryPage() {
  return (
    <article className="animate-fade-in">
      <div className="relative h-[500px] md:h-[600px]">
        <Image
          src={story.coverImage.url}
          alt={story.coverImage.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Stories
            </Link>
            <Badge className="mb-3">{story.category}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              {story.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border border-white/30">
                  <AvatarImage src={story.author.avatar.url} />
                  <AvatarFallback className="bg-brand-darkGreen text-white text-xs">
                    {story.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                {story.author.name}
              </span>
              <span>{formatDate(story.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.readTime} min read
              </span>
              {story.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {story.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen prose-a:text-brand-amber hover:prose-a:text-brand-amber/80 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            <div className="flex flex-wrap gap-2 mt-8">
              {story.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-brand-cream">
              <Button variant="outline" className="gap-2">
                <Heart className="w-4 h-4" />
                Like
              </Button>
              <Button variant="outline" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" className="gap-2 ml-auto" asChild>
                <Link href="/chat">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Author
                </Link>
              </Button>
            </div>

            <div className="mt-12">
              <h3 className="font-display text-2xl font-bold text-brand-darkGreen mb-6">
                Comments ({comments.length})
              </h3>
              <form className="mb-8">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className="bg-brand-cream text-brand-darkGreen">Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts... (comments are AI-moderated)"
                      className="w-full rounded-lg border border-brand-cream bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-darkGreen min-h-[100px] resize-y"
                    />
                    <div className="flex justify-end mt-2">
                      <Button type="submit" className="gap-2">
                        <Send className="w-4 h-4" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="bg-brand-cream text-brand-darkGreen">
                        {comment.authorName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-brand-offWhite rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-brand-dark/80">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-offWhite rounded-xl p-6">
              <p className="text-xs tracking-wider uppercase text-brand-amber font-semibold mb-4">
                About the Author
              </p>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={story.author.avatar.url} />
                  <AvatarFallback className="bg-brand-darkGreen text-white">
                    {story.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{story.author.name}</p>
                  <p className="text-xs text-muted-foreground">Travel Writer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{story.author.bio}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/authors">View Profile</Link>
              </Button>
            </div>
            <div>
              <p className="text-xs tracking-wider uppercase text-brand-amber font-semibold mb-4">
                Related Stories
              </p>
              <div className="space-y-4">
                {relatedStories.map((s) => (
                  <StoryCard key={s.id} story={s} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
