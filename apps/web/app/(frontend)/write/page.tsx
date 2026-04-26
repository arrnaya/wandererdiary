'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  PenTool,
  ListChecks,
  Eye,
  Send,
  Upload,
  Lightbulb,
  Check,
  Save,
  ChevronRight,
  BookOpen,
} from 'lucide-react'

const steps = [
  { id: 1, label: 'Write', icon: PenTool },
  { id: 2, label: 'Add Details', icon: ListChecks },
  { id: 3, label: 'Preview', icon: Eye },
  { id: 4, label: 'Publish', icon: Send },
]

const guidelines = [
  'Write authentic and original content.',
  'Share real experiences and practical tips.',
  'Be respectful of local cultures and people.',
  'Avoid promotional or spammy content.',
  'Add high-quality images to make your story more engaging.',
]

const tips = [
  { title: 'Start with a catchy title', desc: 'A great title grabs attention and makes people want to read more.' },
  { title: 'Add a stunning cover image', desc: 'A high-quality image sets the tone for your story.' },
  { title: 'Share useful details', desc: 'Include tips, costs, best time to visit, and important info.' },
  { title: 'Be yourself', desc: 'Your unique perspective is what makes your story special.' },
]

export default function WritePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[480px]">
        <Image
          src="/images/write-your-story-hero-bg.png"
          alt="Write your story"
          fill
          className="object-cover"
        />
        <div className="absolute" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <p className="font-script tracking-wider text-3xl text-brand-amberRed font-semibold mb-2">
              Share Your Journey
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              Write Your Story
            </h1>
            <p className="text-white/80">
              Every journey has a story worth telling. Share your experiences and inspire fellow travelers.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="bg-white border-b border-brand-cream">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-brand-darkGreen text-white'
                        : 'bg-brand-cream text-brand-darkGreen'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`hidden md:block text-sm font-medium ${
                      currentStep >= step.id ? 'text-brand-darkGreen' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="py-12 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-brand-darkGreen mb-1">
                  Let&apos;s start with your story
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill in the details below to share your travel experience.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Story Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., A Magical Sunrise in the Himalayas"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      {title.length}/100
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Story Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-brand-cream bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-darkGreen"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="adventure">Adventure</option>
                      <option value="destination">Destination</option>
                      <option value="experience">Experience</option>
                      <option value="tips">Tips</option>
                      <option value="photo_story">Photo Story</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Cover Image <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-brand-cream rounded-lg p-8 text-center hover:bg-brand-offWhite transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop an image here or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 1600x900px (JPG, PNG up to 5MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Excerpt</label>
                    <Textarea
                      placeholder="Write a short summary of your story (max 160 characters)"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      maxLength={160}
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      {excerpt.length}/160
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Your Story <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-brand-cream rounded-lg overflow-hidden">
                      <div className="flex items-center gap-1 px-3 py-2 bg-brand-offWhite border-b border-brand-cream">
                        {['Paragraph', 'B', 'I', 'U', '""', '•', '1.', '\u2192', '\u238c', '\u21b7'].map((tool, i) => (
                          <button
                            key={i}
                            className="px-2 py-1 text-xs rounded hover:bg-white transition-colors"
                          >
                            {tool}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Write your story here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border-0 rounded-none min-h-[300px] resize-y"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Add Location</label>
                    <Input placeholder="e.g., Manali, Himachal Pradesh, India" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Adding a location helps others find your story.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tags</label>
                    <Input placeholder="Add tags separated by commas" />
                    <p className="text-xs text-muted-foreground mt-1">
                      e.g., adventure, solo travel, mountains, budget travel
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-cream">
                  <Button variant="outline" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </Button>
                  <Button className="gap-2" onClick={() => setCurrentStep(2)}>
                    Save & Continue
                  </Button>
                </div>
              </div>

              {/* Draft Banner */}
              <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Send className="w-8 h-8 text-brand-amber" />
                  <div>
                    <p className="font-semibold">Not ready to publish?</p>
                    <p className="text-sm text-muted-foreground">
                      Save your draft and come back anytime.
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save as Draft
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-brand-amber" />
                  <h3 className="font-display font-semibold">Writing Guidelines</h3>
                </div>
                <ul className="space-y-3">
                  {guidelines.map((g) => (
                    <li key={g} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span className="text-brand-dark/80">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="w-5 h-5 text-brand-darkGreen" />
                  <h3 className="font-display font-semibold">Tips for a Great Story</h3>
                </div>
                <div className="space-y-4">
                  {tips.map((tip) => (
                    <div key={tip.title}>
                      <p className="font-medium text-sm">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Stories */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-brand-darkGreen" />
                  <h3 className="font-display font-semibold">Your Stories</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t published any stories yet. Start writing and inspire the community!
                </p>
                <Button variant="dark" className="w-full" size="sm">
                  View My Stories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
