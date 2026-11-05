'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import Logo from '@/components/brand/Logo'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        password,
        redirect: false,
      })
      if (res?.error) {
        setError('Invalid password')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      console.error('Login request failed', err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5EF] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="/shop" variant="dark" showTagline={false} />
        </div>
        <section className="rounded-3xl border border-[#E8DED0] bg-white p-7 shadow-[0_16px_48px_rgba(36,28,25,0.08)] sm:p-9">
          <div className="mb-7 text-center">
            <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F5EF] text-[#A7823D]">
              <ShieldCheck size={23} strokeWidth={1.6} />
            </span>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A7823D]">
              Catalogue management
            </p>
            <h1 className="font-heading text-4xl text-[#241C19]">Admin sign in</h1>
            <p className="mt-2 text-sm text-[#777068]">
              Enter your password to manage the catalogue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#514840]"
              >
                Password
              </label>
              <div className="relative">
                <KeyRound
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A49A8F]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input min-h-12 rounded-xl border-[#E8DED0] pl-11 pr-12 focus:border-[#C5A46D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#777068] hover:bg-[#F8F5EF]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
        <p className="mt-5 text-center text-xs text-[#8B8178]">
          AWWALSHOP catalogue administration
        </p>
      </div>
    </main>
  )
}
