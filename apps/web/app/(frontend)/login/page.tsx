import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Log In',
  description: 'Sign in to your WandererDiary account.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offWhite py-12">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-brand-darkGreen mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">Sign in to your WandererDiary account</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Sign In</Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand-amber hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
