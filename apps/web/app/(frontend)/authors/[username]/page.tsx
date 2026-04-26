import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StoryCard } from '@/components/story/story-card'
import { BookOpen, MapPin, Award, MessageCircle } from 'lucide-react'

const author = {
  name: 'Sarah Mitchell',
  bio: 'Travel writer and photographer based in Southeast Asia. Chasing sunsets and good coffee.',
  avatar: '',
  stories: 24,
  countries: 15,
  nomadTokens: 450,
  joined: '2023-01-15',
}

const authorStories = [
  {
    id: '1',
    title: 'Finding Paradise in El Nido, Philippines',
    slug: 'finding-paradise-el-nido',
    excerpt: 'Crystal clear waters, hidden lagoons, and limestone cliffs.',
    category: 'Destination',
    coverImage: { url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80', alt: 'El Nido' },
    author: { name: 'Sarah Mitchell', avatar: { url: '' } },
    publishedAt: '2024-05-12',
    readTime: 8,
  },
  {
    id: '7',
    title: 'Hidden Waterfalls of Bali',
    slug: 'bali-waterfalls',
    excerpt: 'The secret cascades that tourists never find.',
    category: 'Adventure',
    coverImage: { url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80', alt: 'Bali' },
    author: { name: 'Sarah Mitchell', avatar: { url: '' } },
    publishedAt: '2024-04-20',
    readTime: 6,
  },
]

export default function AuthorPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <div className="bg-white rounded-xl p-8 shadow-sm text-center mb-8">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="bg-brand-darkGreen text-white text-3xl">
                {author.name[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-display text-3xl font-bold text-brand-darkGreen">
              {author.name}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">{author.bio}</p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="font-display text-2xl font-bold">{author.stories}</p>
                <p className="text-xs text-muted-foreground">Stories</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold">{author.countries}</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-brand-amber">{author.nomadTokens}</p>
                <p className="text-xs text-muted-foreground">NOMAD</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
              <Button variant="outline">Follow</Button>
            </div>
          </div>

          {/* Stories */}
          <h2 className="font-display text-2xl font-bold text-brand-darkGreen mb-6">
            Stories by {author.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
