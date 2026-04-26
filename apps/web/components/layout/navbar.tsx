'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/stories', label: 'Stories' },
  { href: '/tips', label: 'Tips' },
  { href: '/about', label: 'About Us' },
  { href: '/write', label: 'Write a Story' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-brand-cream/50 transition-all duration-300 ease-out ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div
        className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled ? 'h-14 md:h-16' : 'h-20 md:h-24'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/wd-full-logo.png"
            alt="WandererDiary"
            width={360}
            height={100}
            className={`w-auto object-contain transition-all duration-300 ease-out ${
              scrolled ? 'h-9 md:h-11' : 'h-14 md:h-[72px]'
            }`}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className="text-sm font-medium text-brand-dark/70 hover:text-brand-darkGreen transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-amber group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className="p-2 hover:bg-brand-cream rounded-full transition-colors">
            <Search className="w-5 h-5 text-brand-darkGreen" />
          </button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-brand-darkGreen" />
          ) : (
            <Menu className="w-6 h-6 text-brand-darkGreen" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-brand-cream bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="text-sm font-medium text-brand-dark/80 hover:text-brand-darkGreen hover:bg-brand-cream/50 rounded-lg px-3 py-3 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 mt-2 border-t border-brand-cream">
              <Button variant="secondary" className="flex-1" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
