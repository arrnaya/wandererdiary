'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  PenTool, ListChecks, Eye, Send, Upload, Lightbulb, Check,
  Save, ChevronRight, Wand2, Image as ImageIcon, Loader2, X,
} from 'lucide-react'

// Dynamically import markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(m => m.default), { ssr: false })

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
  const [coverImageId, setCoverImageId] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [ideas, setIdeas] = useState('')
  const [characterDesc, setCharacterDesc] = useState('')
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [signupPassword, setSignupPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateStory = async () => {
    if (!ideas) return alert('Please enter some ideas first.')
    setIsGeneratingStory(true)
    try {
      const res = await fetch('/api/ai/write-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideas, category, characterDescription: characterDesc }),
      })
      const data = await res.json()
      if (data.success) {
        setTitle(data.data.title)
        setExcerpt(data.data.excerpt)
        setContent(data.data.content)
      } else {
        alert(data.error || 'Failed to generate story')
      }
    } catch (e) {
      console.error(e)
      alert('An error occurred while generating the story.')
    }
    setIsGeneratingStory(false)
  }

  const handleGenerateImage = async () => {
    if (!ideas && !title) return alert('Please provide a title or ideas for the image prompt.')
    setIsGeneratingImage(true)
    try {
      const prompt = 'A beautiful travel cover photo for a story titled "' + title + '". ' + ideas + (characterDesc ? ' Featuring character: ' + characterDesc : '')
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1024x1024' }),
      })
      const data = await res.json()
      if (data.success && data.image) {
        const dataUrl = 'data:image/jpeg;base64,' + data.image
        setCoverImageUrl(dataUrl)
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'generated-cover-' + Date.now() + '.jpg', { type: 'image/jpeg' })
        await uploadToMedia(file)
      } else if (data.url) {
        setCoverImageUrl(data.url)
      } else {
        alert(data.error || 'Failed to generate image')
      }
    } catch (e) {
      console.error(e)
      alert('Error generating image.')
    }
    setIsGeneratingImage(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverImageUrl(URL.createObjectURL(file))
    await uploadToMedia(file)
  }

  const uploadToMedia = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.doc?.id) setCoverImageId(data.doc.id)
    } catch (e) {
      console.error('Media upload failed:', e)
    }
  }

  const saveStory = async (status: 'draft' | 'published', authorId?: string) => {
    if (!title || !content) return alert('Title and content are required.')
    setIsSaving(true)
    try {
      const payload = {
        title, excerpt,
        content: {
          root: {
            children: content.split('\n\n').filter(Boolean).map(paragraph => ({
              children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: paragraph, type: 'text', version: 1 }],
              direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1
            })),
            direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
          }
        },
        category: category || 'adventure',
        status,
        ...(coverImageId ? { coverImage: coverImageId } : {}),
        ...(authorId ? { author: authorId } : { guestName, guestEmail }),
      }

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Story successfully ' + (status === 'draft' ? 'saved as draft' : 'published') + '!')
        window.location.href = '/'
      } else {
        const err = await res.json()
        alert('Error: ' + JSON.stringify(err))
      }
    } catch (e) {
      console.error(e)
      alert('Error saving story.')
    }
    setIsSaving(false)
  }

  const handleSignupAndSave = async () => {
    if (!guestName || !guestEmail || !signupPassword) return alert('Please fill in all fields.')
    setIsSaving(true)
    try {
      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          email: guestEmail,
          username: guestName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000),
          password: signupPassword,
          role: 'author',
        }),
      })
      const data = await res.json()
      if (data.doc?.id) {
        setShowSignupModal(false)
        await saveStory('draft', data.doc.id)
      } else {
        alert('Signup failed: ' + JSON.stringify(data.errors || data))
      }
    } catch (e) {
      console.error(e)
      alert('Signup failed.')
    }
    setIsSaving(false)
  }

  return (
    <div className="animate-fade-in relative">
      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setShowSignupModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-2xl font-bold text-brand-darkGreen mb-2">Sign up to Save Draft</h2>
            <p className="text-sm text-gray-600 mb-6">Create an account so you can come back and edit your draft anytime.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <Input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button onClick={handleSignupAndSave} disabled={isSaving} className="w-full mt-4">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Account &amp; Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative h-[400px]">
        <Image src="/images/write-your-story-hero-bg.png" alt="Write your story" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <p className="font-script tracking-wider text-3xl text-brand-amberRed font-semibold mb-2">Share Your Journey</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Write Your Story</h1>
            <p className="text-white/80">Every journey has a story worth telling. Share your experiences and inspire fellow travelers.</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="bg-white border-b border-brand-cream">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <div className={'w-10 h-10 rounded-full flex items-center justify-center ' + (currentStep >= step.id ? 'bg-brand-darkGreen text-white' : 'bg-brand-cream text-brand-darkGreen')}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={'hidden md:block text-sm font-medium ' + (currentStep >= step.id ? 'text-brand-darkGreen' : 'text-muted-foreground')}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
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

              {/* AI Assist Box */}
              <div className="bg-gradient-to-r from-brand-cream to-brand-offWhite rounded-xl p-6 shadow-sm border border-brand-teal/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-5 h-5 text-brand-teal" />
                  <h2 className="font-display text-xl font-semibold text-brand-darkGreen">AI Writing Assistant</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Don&apos;t want to start from scratch? Give us some ideas and our AI will draft a beautiful, human-like story for you.
                </p>
                <div className="space-y-3">
                  <Textarea
                    placeholder="E.g., I visited Paris last summer, saw the Eiffel Tower at night, and had the best croissant near the Louvre..."
                    value={ideas}
                    onChange={e => setIdeas(e.target.value)}
                    rows={3}
                  />
                  <Input
                    placeholder="Optional: Describe your character (e.g., 'A 30-year-old solo female traveler with a red backpack') for consistent image generation."
                    value={characterDesc}
                    onChange={e => setCharacterDesc(e.target.value)}
                  />
                  <Button onClick={handleGenerateStory} disabled={isGeneratingStory} className="gap-2 bg-brand-teal hover:bg-brand-teal/90">
                    {isGeneratingStory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {isGeneratingStory ? 'Generating Story...' : 'Generate Draft'}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-brand-darkGreen mb-6">Story Details</h2>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Story Title <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g., A Magical Sunrise in the Himalayas" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Category <span className="text-red-500">*</span></label>
                    <select
                      className="flex h-10 w-full rounded-md border border-brand-cream bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-darkGreen"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="adventure">Adventure</option>
                      <option value="destination">Destination</option>
                      <option value="experience">Experience</option>
                      <option value="tips">Tips</option>
                      <option value="photo_story">Photo Story</option>
                    </select>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Cover Image <span className="text-red-500">*</span></label>
                    {coverImageUrl ? (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-brand-cream group">
                        <Image src={coverImageUrl} alt="Cover" fill className="object-cover" unoptimized={coverImageUrl.startsWith('data:')} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button variant="secondary" onClick={() => { setCoverImageUrl(null); setCoverImageId(null) }}>Remove Image</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="border-2 border-dashed border-brand-cream rounded-lg p-6 text-center hover:bg-brand-offWhite transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground font-medium">Upload Image</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                        </div>
                        <div
                          className="border-2 border-dashed border-brand-cream rounded-lg p-6 text-center hover:bg-brand-offWhite transition-colors cursor-pointer"
                          onClick={handleGenerateImage}
                        >
                          {isGeneratingImage ? <Loader2 className="w-6 h-6 mx-auto mb-2 text-brand-teal animate-spin" /> : <ImageIcon className="w-6 h-6 mx-auto mb-2 text-brand-teal" />}
                          <p className="text-sm text-muted-foreground font-medium">{isGeneratingImage ? 'Generating...' : 'AI Generate'}</p>
                          <p className="text-xs text-muted-foreground mt-1">Based on title &amp; ideas</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Excerpt</label>
                    <Textarea placeholder="Write a short summary of your story (max 160 characters)" value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={160} rows={2} />
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Your Story <span className="text-red-500">*</span></label>
                    <div data-color-mode="light">
                      <MDEditor
                        value={content}
                        onChange={v => setContent(v || '')}
                        height={400}
                        preview="edit"
                        visibleDragbar={false}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use Markdown to format your story. Add <code>[IMAGE: description]</code> placeholders where you want images.
                    </p>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Name (Optional)</label>
                      <Input placeholder="Guest Author" value={guestName} onChange={e => setGuestName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Email (Optional)</label>
                      <Input type="email" placeholder="For linking if you sign up" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-brand-cream">
                    <Button variant="outline" className="gap-2" onClick={() => setShowSignupModal(true)} disabled={isSaving}>
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>
                    <Button className="gap-2" onClick={() => saveStory('published')} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Publish Story
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-brand-amber" />
                  <h3 className="font-display font-semibold">Writing Guidelines</h3>
                </div>
                <ul className="space-y-3">
                  {guidelines.map(g => (
                    <li key={g} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span className="text-brand-dark/80">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="w-5 h-5 text-brand-darkGreen" />
                  <h3 className="font-display font-semibold">Tips for a Great Story</h3>
                </div>
                <div className="space-y-4">
                  {tips.map(tip => (
                    <div key={tip.title}>
                      <p className="font-medium text-sm">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markdown Cheat Sheet */}
              <div className="bg-brand-cream/50 rounded-xl p-5 shadow-sm">
                <h3 className="font-display font-semibold text-sm mb-3 text-brand-darkGreen">Markdown Quick Reference</h3>
                <div className="space-y-1 text-xs font-mono text-brand-dark/70">
                  <p># Heading 1</p>
                  <p>## Heading 2</p>
                  <p>**bold text**</p>
                  <p>*italic text*</p>
                  <p>- List item</p>
                  <p>[IMAGE: description]</p>
                  <p>&gt; Blockquote</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
