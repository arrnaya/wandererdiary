import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StoryCard } from '@/components/story/story-card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowLeft, Star, Calendar, TreePine } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getLocalCoverImage } from '@/lib/image-fallback'

async function getDestination(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
}

async function getRelatedStories(location: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'stories',
    where: {
      status: { equals: 'published' },
      location: { contains: location.split(',')[0] },
    },
    sort: '-publishedAt',
    limit: 4,
    depth: 2,
  })
  return result.docs
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = await getDestination(slug)
  if (!destination) return { title: 'Destination Not Found' }
  return {
    title: `${destination.name} | WandererDiary`,
    description: destination.description,
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await getDestination(slug)

  if (!destination) {
    notFound()
  }

  const relatedStories = await getRelatedStories(destination.name as string)

  return (
    <div className="animate-fade-in">
      <div className="relative h-[400px]">
        {destination.coverImage?.url ? (
          <Image
            src={destination.coverImage.url}
            alt={destination.name as string}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-darkGreen" />
        )}
        <div className="absolute inset-0 bg-brand-darkGreen/50" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div>
            <Link href="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              All Destinations
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">
              {destination.name as string}
            </h1>
            <p className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              {destination.country as string}
              {destination.region && (
                <span className="capitalize">• {(destination.region as string).replace(/-/g, ' ')}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-brand-offWhite">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            {destination.worldRanking && (
              <Badge variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                <Star className="w-4 h-4 text-brand-amber" />
                World Ranking #{destination.worldRanking}
              </Badge>
            )}
            {destination.tourismScore && (
              <Badge variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                <Star className="w-4 h-4 text-brand-amber fill-current" />
                Tourism Score: {destination.tourismScore}
              </Badge>
            )}
            {destination.bestTimeToVisit && (
              <Badge variant="secondary" className="gap-1 text-sm py-1.5 px-3">
                <Calendar className="w-4 h-4" />
                Best time: {destination.bestTimeToVisit as string}
              </Badge>
            )}
          </div>

          {/* Activities */}
          {destination.activities && (destination.activities as any[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(destination.activities as any[]).map((a: any) => (
                <Badge key={a.activity} className="text-sm py-1 px-3">
                  {a.activity.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-lg text-brand-dark/80 leading-relaxed mb-12">
            {destination.description as string}
          </p>

          {/* Rich Content */}
          {destination.richContent && (
            <div
              className="bg-white rounded-xl p-6 md:p-8 mb-12 prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-brand-amber prose-a:text-brand-amber hover:prose-a:text-brand-amber/80"
              dangerouslySetInnerHTML={{ __html: destination.richContent as string }}
            />
          )}

          {/* Offbeat Gems */}
          {destination.offbeatGems && (
            <div className="bg-white rounded-xl p-6 mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="w-5 h-5 text-brand-darkGreen" />
                <h3 className="font-display font-semibold text-xl text-brand-darkGreen">
                  Offbeat Gems
                </h3>
              </div>
              <p className="text-brand-dark/80 leading-relaxed">
                {destination.offbeatGems as string}
              </p>
            </div>
          )}

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <>
              <h2 className="font-display text-2xl font-bold text-brand-darkGreen mb-6">
                Stories from {destination.name as string}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedStories.map((story: any) => (
                  <StoryCard
                    key={story.id}
                    story={{
                      id: story.id,
                      title: story.title,
                      slug: story.slug,
                      category: story.category || 'Destination',
                      coverImage: story.coverImage?.url
                        ? { url: story.coverImage.url, alt: story.coverImage.alt || story.title }
                        : getLocalCoverImage(story.slug, story.title),
                      author: story.author
                        ? { name: story.author.name, avatar: story.author.avatar }
                        : undefined,
                      publishedAt: story.publishedAt,
                      readTime: story.readTime,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
