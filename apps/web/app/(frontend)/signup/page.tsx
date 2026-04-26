import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Sign Up',
  description: 'Create your WandererDiary account.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offWhite py-12">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-brand-darkGreen mb-2">
              Join WandererDiary
            </h1>
            <p className="text-muted-foreground">Create an account to start your journey</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <Input placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 border border-brand-cream rounded-lg cursor-pointer hover:bg-brand-offWhite transition-colors has-[:checked]:border-brand-darkGreen has-[:checked]:bg-brand-offWhite">
                  <input type="radio" name="role" value="subscriber" defaultChecked className="accent-brand-darkGreen" />
                  <span className="text-sm">Reader</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-brand-cream rounded-lg cursor-pointer hover:bg-brand-offWhite transition-colors has-[:checked]:border-brand-darkGreen has-[:checked]:bg-brand-offWhite">
                  <input type="radio" name="role" value="author" className="accent-brand-darkGreen" />
                  <span className="text-sm">Author</span>
                </label>
              </div>
            </div>
            <Button className="w-full">Create Account</Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-amber hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
