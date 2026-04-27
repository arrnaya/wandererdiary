import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { marked } from 'marked'

async function getTip(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'tips',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

function renderContent(content: any): string {
  if (!content) return ''

  if (typeof content === 'string') {
    return marked.parse(content, { async: false }) as string
  }

  if (content.root?.children) {
    const firstNode = content.root.children[0]
    if (
      firstNode?.type === 'paragraph' &&
      content.root.children.length === 1 &&
      firstNode.children?.length === 1 &&
      firstNode.children[0]?.text?.includes('#')
    ) {
      return marked.parse(firstNode.children[0].text, { async: false }) as string
    }

    let html = ''
    for (const node of content.root.children) {
      if (node.type === 'paragraph') {
        const text = node.children?.map((c: any) => c.text || '').join('') || ''
        if (text) html += `<p>${text}</p>`
      } else if (node.type === 'heading') {
        const text = node.children?.map((c: any) => c.text || '').join('') || ''
        const tag = `h${node.tag || 2}`
        html += `<${tag}>${text}</${tag}>`
      } else if (node.type === 'list') {
        const items = node.children?.map((item: any) => {
          const text = item.children?.map((c: any) => c.text || '').join('') || ''
          return `<li>${text}</li>`
        }).join('') || ''
        html += `<ul>${items}</ul>`
      }
    }
    return html
  }

  return ''
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tip = await getTip(slug)
  if (!tip) return { title: 'Tip Not Found' }
  return {
    title: `${tip.title} | WandererDiary`,
    description: tip.excerpt || tip.title,
  }
}

export default async function TipPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tip = await getTip(slug)

  if (!tip) {
    notFound()
  }

  const contentHtml = renderContent(tip.content)

  return (
    <article className="animate-fade-in py-12 bg-brand-offWhite">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/tips" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-darkGreen mb-6">
          <ArrowLeft className="w-4 h-4" />
          All Tips
        </Link>

        <Badge className="mb-4">{tip.category}</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-darkGreen mb-4">
          {tip.title}
        </h1>

        <div className="flex items-center gap-3 mb-8 text-sm text-muted-foreground">
          <Avatar className="w-8 h-8">
            <AvatarImage src={tip.author?.avatar?.url} />
            <AvatarFallback className="bg-brand-darkGreen text-white text-xs">
              {tip.author?.name?.[0] || 'W'}
            </AvatarFallback>
          </Avatar>
          <span>{tip.author?.name || 'Wanderer'}</span>
          <span>{formatDate(tip.publishedAt)}</span>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen prose-a:text-brand-amber hover:prose-a:text-brand-amber/80 prose-img:rounded-xl prose-blockquote:border-l-brand-amber prose-blockquote:bg-brand-offWhite prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  )
}
