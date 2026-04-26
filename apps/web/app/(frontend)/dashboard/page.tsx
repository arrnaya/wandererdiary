'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Heart,
  MessageCircle,
  Award,
  Wallet,
  Settings,
  ImageIcon,
  TrendingUp,
} from 'lucide-react'

const savedStories = [
  { id: '1', title: 'Finding Paradise in El Nido', author: 'Sarah Mitchell', category: 'Destination' },
  { id: '2', title: 'Trekking the Himalayas', author: 'Arjun Mehta', category: 'Adventure' },
]

const myComments = [
  { id: '1', story: 'Finding Paradise in El Nido', content: 'This brought back so many memories!', date: '2024-05-13' },
]

const myNFTs = [
  { id: '1', name: 'Sahara Sunset #001', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=300&q=80', tokenId: '1' },
  { id: '2', name: 'Bali Waterfall #042', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=300&q=80', tokenId: '42' },
]

export default function DashboardPage() {
  return (
    <div className="animate-fade-in py-12 bg-brand-offWhite min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-darkGreen">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your stories, favorites, and NFTs.</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="amber" className="gap-1 text-base px-4 py-2">
                <Award className="w-4 h-4" />
                450 NOMAD
              </Badge>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Stories', value: '12', icon: BookOpen },
              { label: 'Saved', value: '24', icon: Heart },
              { label: 'Comments', value: '8', icon: MessageCircle },
              { label: 'NFTs', value: '2', icon: ImageIcon },
            ].map((stat) => (
              <div key={stat.label} className="bg-brand-offWhite rounded-lg p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-brand-darkGreen" />
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="saved">
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="w-4 h-4" />
              Saved Stories
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              My Comments
            </TabsTrigger>
            <TabsTrigger value="nfts" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              My NFTs
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {savedStories.length === 0 ? (
                <div className="p-12 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-brand-cream" />
                  <p className="text-muted-foreground">No saved stories yet.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/stories">Browse Stories</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-brand-cream">
                  {savedStories.map((story) => (
                    <div key={story.id} className="flex items-center justify-between p-4 hover:bg-brand-offWhite transition-colors">
                      <div>
                        <Link href={`/stories/${story.id}`} className="font-semibold hover:text-brand-amber transition-colors">
                          {story.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {story.author} · <Badge variant="secondary" className="text-xs">{story.category}</Badge>
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {myComments.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No comments yet.
                </div>
              ) : (
                <div className="divide-y divide-brand-cream">
                  {myComments.map((comment) => (
                    <div key={comment.id} className="p-4 hover:bg-brand-offWhite transition-colors">
                      <p className="text-sm text-muted-foreground mb-1">
                        On <span className="font-medium text-brand-dark">{comment.story}</span>
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{comment.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nfts">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {myNFTs.map((nft) => (
                <div key={nft.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm">{nft.name}</p>
                    <p className="text-xs text-muted-foreground">Token #{nft.tokenId}</p>
                    <Button variant="outline" size="sm" className="w-full mt-3 gap-1">
                      <Wallet className="w-3 h-3" />
                      View on Chain
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-md mx-auto">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-brand-darkGreen" />
              <h3 className="font-display text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your MetaMask or WalletConnect to manage your Nomad tokens and NFTs.
              </p>
              <Button className="gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
