import Image from 'next/image'
import { Globe, Users, BookOpen, Compass } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description: 'WandererDiary was born out of a love for travel and storytelling.',
}

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
          alt="Team"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-darkGreen/70" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-2xl text-white">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-lg text-white/80">
              WandererDiary was born out of a love for travel and storytelling.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-darkGreen">
            <p className="text-xl text-brand-dark/80 leading-relaxed">
              We believe every journey has something to teach and every traveler has a story worth sharing. 
              Our mission is to build a platform where real experiences inspire, cultures connect, and stories 
              create a lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: BookOpen, title: 'Authentic Stories', desc: 'Real experiences from real travelers, not sponsored content.' },
              { icon: Globe, title: 'Global Community', desc: 'Connect with fellow wanderers from every corner of the world.' },
              { icon: Compass, title: 'Travel Inspiration', desc: 'Discover new destinations and plan your next adventure.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-brand-offWhite rounded-xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-darkGreen flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 bg-brand-darkGreen rounded-xl p-8 text-center">
            {[
              { value: '10K+', label: 'Stories Shared' },
              { value: '5K+', label: 'Active Members' },
              { value: '100+', label: 'Countries' },
              { value: '\u221e', label: 'Memories' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-4xl font-bold text-brand-amber">
                  {stat.value}
                </p>
                <p className="text-sm text-white/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
