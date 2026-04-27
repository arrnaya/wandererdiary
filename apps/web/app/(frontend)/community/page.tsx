'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Heart,
  MessageCircle,
  Share2,
  Award,
  TrendingUp,
  ImageIcon,
  Video,
  Trophy,
  Wallet,
} from 'lucide-react'

interface CommunityPost {
  id: string
  caption: string
  author: {
    name: string
    avatar?: string
  }
  media: Array<{
    url?: string
    type: string
  }>
  location?: string
  likes: number
  comments?: number
  aiScore?: {
    overall: number
  }
  nomadTokensEarned?: number
  nftMinted?: boolean
  createdAt: string
}

interface LeaderboardUser {
  rank: number
  name: string
  posts: number
  tokens: number
  avatar?: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch community posts
        const postsRes = await fetch('/api/community-posts?limit=50&sort=-createdAt&depth=2')
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          const mappedPosts = postsData.docs.map((doc: any) => ({
            id: doc.id,
            caption: doc.caption,
            author: {
              name: doc.author?.name || 'Unknown',
              avatar: doc.author?.avatar?.url,
            },
            media: doc.media?.map((m: any) => ({
              url: m.file?.url,
              type: m.type,
            })) || [],
            location: doc.location,
            likes: doc.likes || 0,
            comments: 0,
            aiScore: doc.aiScore,
            nomadTokensEarned: doc.nomadTokensEarned || 0,
            nftMinted: doc.nftMinted,
            createdAt: doc.createdAt,
          }))
          setPosts(mappedPosts)
        }

        // Fetch leaderboard (authors sorted by tokens)
        const authorsRes = await fetch('/api/authors?limit=10&sort=-nomadTokens')
        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          const mappedLeaderboard = authorsData.docs.map((doc: any, index: number) => ({
            rank: index + 1,
            name: doc.name,
            posts: Math.floor((doc.nomadTokens || 0) / 10), // Approximate
            tokens: doc.nomadTokens || 0,
            avatar: doc.avatar?.url,
          }))
          setLeaderboard(mappedLeaderboard)
        }
      } catch (error) {
        console.error('Failed to fetch community data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="py-12 bg-brand-darkGreen text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Wanderlust Community
              </h1>
              <p className="text-white/80 max-w-lg">
                Share your travel photos and videos. Earn Nomad tokens for original, helpful content.
                Mint your best shots as NFTs!
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
              <Button className="gap-2 bg-brand-amber hover:bg-brand-amber/90">
                <ImageIcon className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-white">
              <TabsTrigger value="feed" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="nfts" className="gap-2">
                <Award className="w-4 h-4" />
                NFT Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Posts Feed */}
                <div className="lg:col-span-2 space-y-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading community posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-muted-foreground text-lg">No community posts yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Our AI will be posting photo stories and travel tips daily.
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback className="bg-brand-darkGreen text-white">
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{post.author.name}</p>
                              <p className="text-xs text-muted-foreground">{post.location}</p>
                            </div>
                          </div>
                          {post.nftMinted && (
                            <Badge variant="amber" className="gap-1">
                              <Award className="w-3 h-3" />
                              NFT
                            </Badge>
                          )}
                        </div>

                        {/* Media */}
                        <div className={`grid ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
                          {post.media.map((m, i) => (
                            <div key={i} className="relative aspect-square">
                              {m.url ? (
                                <Image src={m.url} alt="" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-brand-cream flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="p-4">
                          <div className="flex items-center gap-4 mb-3">
                            <button className="flex items-center gap-1 text-sm hover:text-red-500 transition-colors">
                              <Heart className="w-5 h-5" />
                              {post.likes}
                            </button>
                            <button className="flex items-center gap-1 text-sm hover:text-brand-amber transition-colors">
                              <MessageCircle className="w-5 h-5" />
                              {post.comments}
                            </button>
                            <button className="flex items-center gap-1 text-sm ml-auto hover:text-brand-darkGreen transition-colors">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>

                          <p className="text-sm mb-3">{post.caption}</p>

                          {post.aiScore && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="gap-1">
                                <TrendingUp className="w-3 h-3" />
                                AI Score: {post.aiScore.overall}/100
                              </Badge>
                              <Badge variant="amber" className="gap-1">
                                <Award className="w-3 h-3" />
                                {post.nomadTokensEarned} NOMAD
                              </Badge>
                            </div>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Token Info */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-lg mb-2">Nomad Tokens</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Earn NOMAD tokens for every post. Tokens will be listed on Uniswap in 6 months.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Balance</span>
                        <span className="font-semibold">0 NOMAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Posts This Month</span>
                        <span className="font-semibold">0</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 gap-2" variant="outline">
                      <Wallet className="w-4 h-4" />
                      View Wallet
                    </Button>
                  </div>

                  {/* Mini Leaderboard */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-lg mb-4">Top Creators</h3>
                    <div className="space-y-3">
                      {leaderboard.slice(0, 3).map((user) => (
                        <div key={user.rank} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.rank === 1 ? 'bg-brand-amber text-white' :
                            user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                            'bg-amber-700 text-white'
                          }`}>
                            {user.rank}
                          </span>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-brand-cream text-brand-darkGreen">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.posts} posts</p>
                          </div>
                          <Badge variant="amber" className="text-xs">
                            {user.tokens} NOMAD
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-sm" onClick={() => setActiveTab('leaderboard')}>
                      View Full Leaderboard
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-brand-cream">
                    <h2 className="font-display text-2xl font-bold text-brand-darkGreen">
                      Community Leaderboard
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top contributors ranked by post quality and engagement.
                    </p>
                  </div>
                  <div className="divide-y divide-brand-cream">
                    {leaderboard.map((user) => (
                      <div key={user.rank} className="flex items-center gap-4 p-4 hover:bg-brand-offWhite transition-colors">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          user.rank === 1 ? 'bg-brand-amber text-white' :
                          user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          user.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-brand-cream text-brand-darkGreen'
                        }`}>
                          {user.rank}
                        </span>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-brand-darkGreen text-white">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.posts} posts</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-amber">{user.tokens} NOMAD</p>
                          <p className="text-xs text-muted-foreground">earned</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <div className="max-w-6xl mx-auto">
                <div className="bg-brand-darkGreen rounded-xl p-8 text-white text-center mb-8">
                  <Award className="w-12 h-12 mx-auto mb-4 text-brand-amber" />
                  <h2 className="font-display text-3xl font-bold mb-2">NFT Gallery</h2>
                  <p className="text-white/80 max-w-lg mx-auto">
                    Every image posted on the community can be minted as an NFT on the blockchain.
                    Stored on IPFS, owned by you forever.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {posts
                    .filter((p) => p.nftMinted)
                    .flatMap((p) => p.media)
                    .map((m, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        {m.url ? (
                          <Image src={m.url} alt="NFT" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-cream flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Wallet className="w-4 h-4" />
                            Add to Wallet
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="amber" className="gap-1">
                            <Award className="w-3 h-3" />
                            NFT
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
                {posts.filter((p) => p.nftMinted).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No NFTs minted yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
