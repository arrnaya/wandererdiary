import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StoryCard } from '@/components/story/story-card'
import { Globe, BookOpen, Feather, Users, ArrowRight, Send } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { polishOneStory } from '@/lib/ai/polish'

async function getHomepageData(searchParams?: any) {
  const payload = await getPayload({ config })
  if (searchParams?.polish === 'true') {
    console.log('Running story polish...')
    const res = await polishOneStory(payload)
    console.log('Polish result:', res)
  }

  const featuredStories = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 3,
    depth: 2,
  })

  const latestStories = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 6,
    depth: 2,
  })

  const topDestinations = await payload.find({
    collection: 'destinations',
    where: { worldRanking: { less_than_equal: 10 } },
    sort: 'worldRanking',
    limit: 5,
    depth: 1,
  })

  return { featuredStories, latestStories, topDestinations }
}

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const { featuredStories, latestStories, topDestinations } = await getHomepageData(params)

  const featured = featuredStories.docs.slice(0, 3)
  const latest = latestStories.docs.slice(0, 3)
  const destinations = topDestinations.docs

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[580px] md:h-[600px] lg:h-[750px] overflow-hidden bg-brand-offWhite -mt-16 md:-mt-20">
        <Image
          src="/images/landing-page-hero-bg.png"
          alt="Wanderer looking at mountains"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Paper airplane + trail — bottom right flying upward */}
        <div className="absolute bottom-[18%] right-[5%] hidden md:block">
          <svg width="160" height="100" viewBox="0 0 160 100" fill="none" className="opacity-40">
            <path d="M0,90 Q40,80 70,50 T130,10" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" fill="none"/>
            <polygon points="128,4 138,12 128,16" fill="white"/>
          </svg>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-start pt-28 md:pt-32">
          <div className="max-w-2xl">
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase mb-2 text-brand-darkGreen font-semibold">
              Explore. Experience. Express.
            </p>
            <div className="w-10 h-0.5 bg-brand-amber mb-5" />
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-2 text-brand-darkGreen">
              Every journey<br />has a story.
            </h1>
            <p className="font-script text-4xl md:text-5xl text-brand-amber mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
              Share yours.
            </p>
            <p className="text-white text-base md:text-lg mb-7 max-w-md leading-relaxed">
              WandererDiary is a global community where travelers share real experiences,
              inspiring stories, and practical tips from around the world.
            </p>
            <div className="flex gap-3">
              <Button size="lg" className="gap-2 rounded-lg bg-brand-darkGreen hover:bg-[#163328] text-white shadow-lg px-6" asChild>
                <Link href="/stories">
                  <Globe className="w-5 h-5" />
                  Explore Stories
                </Link>
              </Button>
              <Button size="lg" className="gap-2 rounded-lg bg-white text-brand-darkGreen hover:bg-brand-cream shadow-lg px-6" asChild>
                <Link href="/write">
                  <Feather className="w-5 h-5" />
                  Write a Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { icon: Globe, title: 'Discover', desc: 'Hidden gems and amazing places' },
              { icon: BookOpen, title: 'Read', desc: 'Inspiring travel stories from around the world' },
              { icon: Feather, title: 'Write', desc: 'Share your experiences and travel tips' },
              { icon: Users, title: 'Connect', desc: 'Join a community of travel lovers' },
            ].map((feature) => (
              <div key={feature.title} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white border border-brand-cream flex items-center justify-center group-hover:border-brand-darkGreen transition-colors shadow-sm">
                  <feature.icon className="w-6 h-6 text-brand-darkGreen" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-base md:text-lg text-brand-darkGreen mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-brand-amber font-semibold mb-2">
                Featured Stories
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-darkGreen">
                Handpicked Journeys
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md text-sm">
                Curated stories from our community that inspire, inform, and ignite your wanderlust.
              </p>
            </div>
            <Button variant="dark" className="hidden md:flex gap-2" asChild>
              <Link href="/stories">
                View All Stories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((story: any) => (
              <StoryCard
                key={story.id}
                story={{
                  id: story.id,
                  title: story.title,
                  slug: story.slug,
                  category: story.category || 'Destination',
                  coverImage: story.coverImage?.url
                    ? { url: story.coverImage.url, alt: story.coverImage.alt || story.title }
                    : undefined,
                  author: story.author
                    ? { name: story.author.name, avatar: story.author.avatar }
                    : undefined,
                  publishedAt: story.publishedAt,
                }}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Stories + Sidebar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <p className="text-xs tracking-[0.2em] uppercase text-brand-amber font-semibold mb-2">
                Latest Stories
              </p>
              <h2 className="font-display text-3xl font-bold text-brand-darkGreen mb-8">
                Recent from the Community
              </h2>
              <div className="space-y-6">
                {latest.map((story: any) => (
                  <StoryCard
                    key={story.id}
                    story={{
                      id: story.id,
                      title: story.title,
                      slug: story.slug,
                      excerpt: story.excerpt,
                      category: story.category || 'Destination',
                      coverImage: story.coverImage?.url
                        ? { url: story.coverImage.url, alt: story.coverImage.alt || story.title }
                        : undefined,
                      author: story.author
                        ? { name: story.author.name, avatar: story.author.avatar }
                        : undefined,
                      publishedAt: story.publishedAt,
                      readTime: story.readTime,
                    }}
                    variant="horizontal"
                  />
                ))}
              </div>
              <Button variant="outline" className="mt-8 gap-2" asChild>
                <Link href="/stories">
                  Load More Stories
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Top Destinations */}
              <div className="bg-brand-offWhite rounded-xl p-6">
                <h3 className="font-display text-xs tracking-[0.15em] uppercase font-semibold text-brand-darkGreen mb-4">Top Destinations</h3>
                <div className="space-y-3">
                  {destinations.map((dest: any) => (
                    <Link
                      key={dest.id}
                      href={`/destinations/${dest.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-brand-cream">
                        {dest.coverImage?.url ? (
                          <Image src={dest.coverImage.url} alt={dest.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-cream flex items-center justify-center text-xs font-bold text-brand-darkGreen">
                            {dest.name[0]}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium group-hover:text-brand-amber transition-colors">
                        {dest.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <Button variant="dark" size="sm" className="w-full mt-4" asChild>
                  <Link href="/destinations">Explore All Destinations</Link>
                </Button>
              </div>

              {/* Travel Tip */}
              <div className="bg-brand-offWhite rounded-xl p-6 relative overflow-hidden">
                <p className="text-xs tracking-[0.15em] uppercase text-brand-amber font-semibold mb-3">
                  Travel Tip
                </p>
                <blockquote className="font-display italic text-lg text-brand-darkGreen leading-relaxed">
                  &ldquo;The best journeys answer questions that in the beginning you didn&apos;t even think to ask.&rdquo;
                </blockquote>
                <p className="text-sm text-muted-foreground mt-3">— Unknown</p>
                {/* Compass decoration */}
                <div className="absolute bottom-2 right-2 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="#1E3D34" strokeWidth="2"/>
                    <path d="M40 10 L40 70 M10 40 L70 40" stroke="#1E3D34" strokeWidth="1"/>
                    <polygon points="40,18 44,38 40,34 36,38" fill="#1E3D34"/>
                    <polygon points="40,62 44,42 40,46 36,42" fill="#E09A43"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
