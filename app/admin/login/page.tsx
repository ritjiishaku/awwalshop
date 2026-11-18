'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
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
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="aw-auth-shell">
      <div className="aw-auth-card">
        <div className="aw-auth-brand">
          <Logo href="/shop" variant="dark" showTagline={false} compact />
          <span className="aw-auth-brand-tag">Catalogue admin</span>
        </div>

        <span className="aw-auth-lock" aria-hidden="true">
          <ShieldCheck size={22} strokeWidth={1.6} />
        </span>
        <p className="aw-auth-eyebrow">Admin only</p>
        <h1 className="aw-auth-title">Sign in</h1>
        <p className="aw-auth-hint">
          Enter the admin password to manage the AWWALSHOP catalogue.
        </p>

        <form onSubmit={handleSubmit} className="aw-auth-form">
          <label className="aw-auth-field" htmlFor="password">
            <span className="aw-auth-label">Password</span>
            <span className="aw-auth-pass-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter the admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="aw-auth-pass-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {error && (
            <p role="alert" className="aw-auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="aw-auth-submit"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
      <p className="aw-auth-footer">AWWALSHOP catalogue administration</p>
    </main>
  )
}
