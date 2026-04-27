import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, Lightbulb } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

const categories = ['All Tips', 'Planning', 'Packing', 'Budget', 'Safety', 'Photography', 'Solo Travel', 'Food', 'Culture']

async function getTips() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'tips',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })
  return result.docs
}

export const metadata = {
  title: 'Travel Tips & Guides',
  description: 'Practical tips to help you travel smarter and better.',
}

export default async function TipsPage() {
  const tips = await getTips()

  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-brand-amber" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen">
              Travel Tips & Guides
            </h1>
          </div>
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
            {tips.map((tip: any) => (
              <article
                key={tip.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/tips/${tip.slug}`} className="relative block aspect-[16/9]">
                  {tip.coverImage?.url ? (
                    <Image
                      src={tip.coverImage.url}
                      alt={tip.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-darkGreen flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-white/50" />
                    </div>
                  )}
                </Link>
                <div className="p-5">
                  <Badge className="mb-2">{tip.category}</Badge>
                  <Link href={`/tips/${tip.slug}`}>
                    <h3 className="font-display font-semibold text-lg leading-tight hover:text-brand-amber transition-colors">
                      {tip.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {tip.excerpt || 'Read this travel tip to travel smarter.'}
                  </p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>{tip.author?.name || 'Wanderer'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tip.publishedAt ? new Date(tip.publishedAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {tips.length === 0 && (
            <div className="text-center py-20">
              <Lightbulb className="w-12 h-12 text-brand-cream mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No tips published yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for AI-generated travel wisdom.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
