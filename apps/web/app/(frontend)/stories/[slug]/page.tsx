import { notFound } from 'next/navigation'
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
import { getPayload } from 'payload'
import config from '@payload-config'
import { marked } from 'marked'
import { getLocalCoverImage } from '@/lib/image-fallback'

async function getStory(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'stories',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

async function getRelatedStories(currentId: string, category: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'stories',
    where: {
      status: { equals: 'published' },
      id: { not_equals: currentId },
      category: { equals: category },
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 2,
  })
  return result.docs
}

async function getComments(storyId: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'comments',
    where: {
      story: { equals: storyId },
    },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
  })
  return result.docs
}

function renderContent(content: any): string {
  if (!content) return ''

  // If content is a string (markdown), render it directly
  if (typeof content === 'string') {
    return marked.parse(content, { async: false }) as string
  }

  // If it's lexical format, try to extract markdown text from it
  if (content.root?.children) {
    const firstNode = content.root.children[0]
    if (
      firstNode?.type === 'paragraph' &&
      content.root.children.length === 1 &&
      firstNode.children?.length === 1 &&
      firstNode.children[0]?.text?.includes('#')
    ) {
      // This is a markdown text stored in a single paragraph — parse it properly
      return marked.parse(firstNode.children[0].text, { async: false }) as string
    }

    // Properly formatted lexical content — convert to HTML
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
      } else if (node.type === 'quote') {
        const text = node.children?.map((c: any) => c.text || '').join('') || ''
        html += `<blockquote>${text}</blockquote>`
      }
    }
    return html
  }

  return ''
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return { title: 'Story Not Found' }
  return {
    title: `${story.title} | WandererDiary`,
    description: story.excerpt,
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) {
    notFound()
  }

  const relatedStories = await getRelatedStories(story.id as string, story.category as string)
  const comments = await getComments(story.id as string)
  const contentHtml = renderContent(story.content)
  const tags = story.tags?.map((t: any) => t.name || t) || []

  return (
    <article className="animate-fade-in">
      <div className="relative h-[500px] md:h-[600px]">
        {story.coverImage?.url ? (
          <Image
            src={story.coverImage.url}
            alt={story.coverImage.alt || story.title}
            fill
            className="object-cover"
            priority
          />
        ) : getLocalCoverImage(story.slug as string, story.title as string)?.url ? (
          <Image
            src={getLocalCoverImage(story.slug as string, story.title as string)!.url}
            alt={story.title as string}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-darkGreen flex items-center justify-center">
            <span className="text-white text-6xl font-bold opacity-20">
              {story.title?.[0]}
            </span>
          </div>
        )}
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
                  <AvatarImage src={story.author?.avatar?.url} />
                  <AvatarFallback className="bg-brand-darkGreen text-white text-xs">
                    {story.author?.name?.[0] || 'W'}
                  </AvatarFallback>
                </Avatar>
                {story.author?.name || 'Wanderer'}
              </span>
              <span>{formatDate(story.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.readTime || 5} min read
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
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen prose-a:text-brand-amber hover:prose-a:text-brand-amber/80 prose-img:rounded-xl prose-blockquote:border-l-brand-amber prose-blockquote:bg-brand-offWhite prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

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
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={comment.author?.avatar?.url} />
                      <AvatarFallback className="bg-brand-cream text-brand-darkGreen">
                        {comment.author?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-brand-offWhite rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{comment.author?.name || 'User'}</span>
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
                  <AvatarImage src={story.author?.avatar?.url} />
                  <AvatarFallback className="bg-brand-darkGreen text-white">
                    {story.author?.name?.[0] || 'W'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{story.author?.name || 'Wanderer'}</p>
                  <p className="text-xs text-muted-foreground">Travel Writer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {story.author?.bio || 'Travel enthusiast sharing stories from around the world.'}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/authors/${story.author?.username || ''}`}>View Profile</Link>
              </Button>
            </div>
            <div>
              <p className="text-xs tracking-wider uppercase text-brand-amber font-semibold mb-4">
                Related Stories
              </p>
              <div className="space-y-4">
                {relatedStories.map((s: any) => (
                  <StoryCard
                    key={s.id}
                    story={{
                      id: s.id,
                      title: s.title,
                      slug: s.slug,
                      category: s.category || 'Destination',
                      coverImage: s.coverImage?.url
                        ? { url: s.coverImage.url, alt: s.coverImage.alt || s.title }
                        : getLocalCoverImage(s.slug, s.title),
                      author: s.author
                        ? { name: s.author.name, avatar: s.author.avatar }
                        : undefined,
                      publishedAt: s.publishedAt,
                      readTime: s.readTime,
                    }}
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
