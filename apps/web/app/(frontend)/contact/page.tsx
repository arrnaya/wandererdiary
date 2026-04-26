import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Instagram, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contact Us',
  description: "Have questions or want to collaborate? We'd love to hear from you!",
}

export default function ContactPage() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 bg-brand-offWhite">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-darkGreen mb-2">
                Let&apos;s Connect
              </h1>
              <p className="text-muted-foreground">
                Have questions or want to collaborate? We&apos;d love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Form */}
              <form className="bg-white rounded-xl p-8 shadow-sm space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Your Name</label>
                  <Input placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Your Message</label>
                  <Textarea placeholder="Tell us what's on your mind..." rows={5} />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>

              {/* Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-semibold text-xl mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-brand-darkGreen" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">hello@wandererdiary.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                        <Instagram className="w-5 h-5 text-brand-darkGreen" />
                      </div>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">@wandererdiary</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-brand-darkGreen" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">Working from around the world</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-darkGreen rounded-xl p-6 text-white">
                  <h4 className="font-display font-semibold mb-2">Want to Write for Us?</h4>
                  <p className="text-sm text-white/80 mb-4">
                    We are always looking for passionate travel writers to join our community.
                  </p>
                  <Button variant="secondary" size="sm" className="w-full">
                    Apply to be an Author
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
