import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="frontend-page min-h-screen flex flex-col bg-white text-brand-dark font-sans antialiased">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  )
}
