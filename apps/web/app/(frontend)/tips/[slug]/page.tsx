import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Clock } from 'lucide-react'

const tip = {
  title: '10 Packing Tips for Long-Term Travelers',
  category: 'Packing',
  author: { name: 'Sarah Mitchell', avatar: '' },
  publishedAt: '2024-05-10',
  content: `
    <p>After three years of living out of a backpack, I have learned that packing is an art form. Here are my top 10 tips for traveling light without sacrificing comfort.</p>
    <h2>1. Roll, Don't Fold</h2>
    <p>Rolling your clothes saves space and prevents wrinkles. It's a game changer.</p>
    <h2>2. Pack a Universal Adapter</h2>
    <p>One adapter with USB ports covers most of your charging needs worldwide.</p>
  `,
}

export default function TipPage() {
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
            <AvatarImage src={tip.author.avatar} />
            <AvatarFallback className="bg-brand-darkGreen text-white text-xs">{tip.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{tip.author.name}</span>
          <span>{formatDate(tip.publishedAt)}</span>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen"
          dangerouslySetInnerHTML={{ __html: tip.content }}
        />
      </div>
    </article>
  )
}
