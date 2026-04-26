import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Instagram, Twitter, Youtube, Facebook, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Newsletter Bar — dark green */}
      <div className="bg-brand-darkGreen py-10 relative overflow-hidden">
        {/* Decorative mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full text-white" preserveAspectRatio="none">
            <path d="M0 120 L240 40 L400 80 L600 30 L800 70 L1000 20 L1200 60 L1440 40 L1440 120 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-4 right-[15%] opacity-20 pointer-events-none">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M5 20 L15 10 L35 20 L15 30 Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <line x1="35" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-white text-lg">Get Travel Stories & Tips</h4>
                <p className="text-sm text-white/70">Delivered to your inbox. Join our community and never miss an adventure.</p>
              </div>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white border-0 text-brand-dark placeholder:text-brand-dark/50 w-full md:w-72 focus-visible:ring-brand-amber"
              />
              <Button className="shrink-0 bg-brand-amber hover:bg-brand-amber/90 text-white">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer — cream background */}
      <div className="bg-brand-cream pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/wd-full-logo.png"
                  alt="WandererDiary"
                  width={360}
                  height={90}
                  className="h-14 md:h-20 w-auto object-contain"
                  priority
                />
              </Link>
              <p className="text-brand-dark/70 text-sm max-w-xs mb-6 leading-relaxed">
                A community for travel lovers and storytellers. Explore. Experience. Express.
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 md:p-2.5 bg-brand-darkGreen rounded-full hover:bg-brand-amber transition-colors">
                  <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>
                <a href="#" className="p-2 md:p-2.5 bg-brand-darkGreen rounded-full hover:bg-brand-amber transition-colors">
                  <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>
                <a href="#" className="p-2 md:p-2.5 bg-brand-darkGreen rounded-full hover:bg-brand-amber transition-colors">
                  <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>
                <a href="#" className="p-2 md:p-2.5 bg-brand-darkGreen rounded-full hover:bg-brand-amber transition-colors">
                  <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-display font-semibold text-brand-darkGreen mb-4 text-sm tracking-wide uppercase">Explore</h4>
              <ul className="space-y-2.5 text-sm text-brand-dark/70">
                <li><Link href="/destinations" className="hover:text-brand-darkGreen transition-colors">Destinations</Link></li>
                <li><Link href="/stories" className="hover:text-brand-darkGreen transition-colors">Stories</Link></li>
                <li><Link href="/tips" className="hover:text-brand-darkGreen transition-colors">Travel Tips</Link></li>
                <li><Link href="/community" className="hover:text-brand-darkGreen transition-colors">Photo Stories</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-display font-semibold text-brand-darkGreen mb-4 text-sm tracking-wide uppercase">Community</h4>
              <ul className="space-y-2.5 text-sm text-brand-dark/70">
                <li><Link href="/write" className="hover:text-brand-darkGreen transition-colors">Write a Story</Link></li>
                <li><Link href="/authors" className="hover:text-brand-darkGreen transition-colors">Authors</Link></li>
                <li><Link href="/community" className="hover:text-brand-darkGreen transition-colors">Leaderboard</Link></li>
                <li><Link href="/community" className="hover:text-brand-darkGreen transition-colors">Forums</Link></li>
              </ul>
            </div>

            {/* Let's Connect */}
            <div className="lg:border-l lg:border-brand-darkGreen/10 lg:pl-8">
              <h4 className="font-display font-semibold text-brand-darkGreen mb-4 text-sm tracking-wide uppercase">Let's Connect</h4>
              <p className="text-sm text-brand-dark/70 mb-4">
                Have questions or want to collaborate? We'd love to hear from you!
              </p>
              <div className="flex items-center gap-2 text-sm text-brand-dark/70">
                <Mail className="w-4 h-4 text-brand-amber" />
                <span>hello@wandererdiary.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Bar — dark green */}
      <div className="bg-brand-darkGreen py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} WandererDiary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
