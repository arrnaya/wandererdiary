import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, MapPin, Award } from 'lucide-react'

const authors = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    username: 'sarah-mitchell',
    bio: 'Travel writer and photographer based in Southeast Asia. Chasing sunsets and good coffee.',
    avatar: '',
    stories: 24,
    countries: 15,
    nomadTokens: 450,
  },
  {
    id: '2',
    name: 'Arjun Mehta',
    username: 'arjun-mehta',
    bio: 'Mountain lover and adventure seeker. The higher, the better.',
    avatar: '',
    stories: 18,
    countries: 12,
    nomadTokens: 280,
  },
  {
    id: '3',
    name: 'Lena Hoffman',
    username: 'lena-hoffman',
    bio: 'Road trip enthusiast exploring Europe one highway at a time.',
    avatar: '',
    stories: 31,
    countries: 22,
    nomadTokens: 380,
  },
  {
    id: '4',
    name: 'James Carter',
    username: 'james-carter',
    bio: 'Culture and history buff. Always looking for the story behind the destination.',
    avatar: '',
    stories: 15,
    countries: 9,
    nomadTokens: 250,
  },
]

export const metadata = {
  title: 'Authors',
  description: 'Meet the amazing storytellers behind WandererDiary.',
}

export default function AuthorsPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
              Our Community Authors
            </h1>
            <p className="text-muted-foreground">
              Meet the amazing storytellers behind WandererDiary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {authors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback className="bg-brand-darkGreen text-white text-2xl">
                    {author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-display font-semibold text-lg">{author.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{author.bio}</p>
                
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {author.stories}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {author.countries}
                  </span>
                </div>

                <Badge variant="amber" className="mt-3 gap-1">
                  <Award className="w-3 h-3" />
                  {author.nomadTokens} NOMAD
                </Badge>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/authors/${author.username}`}>View Profile</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
