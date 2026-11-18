'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react'
import Logo from '@/components/brand/Logo'

interface AdminLoginFormProps {
  callbackUrl: string
  authError?: string
}

const authErrorMessages: Record<string, string> = {
  CredentialsSignin: 'That password did not match. Try again.',
  Credentials: 'That password did not match. Try again.',
  AccessDenied: 'This account does not have admin access.',
  Configuration: 'Sign-in is not set up correctly. Contact the site owner.',
  Verification: 'That sign-in request expired. Try again.',
}

function authErrorMessage(code?: string) {
  if (!code) return ''
  return authErrorMessages[code] ?? 'We could not sign you in. Please try again.'
}

export default function AdminLoginForm({
  callbackUrl,
  authError,
}: AdminLoginFormProps) {
  const router = useRouter()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(() => authErrorMessage(authError))
  const [capsLock, setCapsLock] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const busy = loading || signedIn
  const describedBy =
    [
      error ? 'admin-login-error' : null,
      capsLock && !busy ? 'admin-login-caps' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  /** Put the cursor back in the password field so a retry is one keystroke. */
  function showError(message: string) {
    setError(message)
    passwordRef.current?.focus()
    passwordRef.current?.select()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    if (!password) {
      showError('Enter the admin password to continue.')
      return
    }

    if (password.length < 8) {
      showError('The admin password is at least 8 characters.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
      })

      if (result?.error) {
        showError(authErrorMessage(result.error))
        setLoading(false)
        return
      }

      setSignedIn(true)
      router.replace(callbackUrl)
      router.refresh()
    } catch {
      showError('We could not reach the server. Check your connection and try again.')
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
        <h1 className="aw-auth-title">Welcome back</h1>
        <p className="aw-auth-hint">
          Enter the admin password to manage the AWWALSHOP catalogue.
        </p>

        <form onSubmit={handleSubmit} className="aw-auth-form" noValidate>
          <label className="aw-auth-field" htmlFor="password">
            <span className="aw-auth-label">Password</span>
            <span className="aw-auth-pass-field">
              <input
                ref={passwordRef}
                name="password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="current-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Enter the admin password"
                value={password}
                disabled={busy}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(event) => setCapsLock(event.nativeEvent.getModifierState('CapsLock'))}
                onKeyUp={(event) => setCapsLock(event.nativeEvent.getModifierState('CapsLock'))}
                onBlur={() => setCapsLock(false)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                aria-controls="password"
                disabled={busy}
                className="aw-auth-pass-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {capsLock && !busy && (
            <p id="admin-login-caps" className="aw-auth-caps">
              <AlertCircle size={13} aria-hidden="true" />
              Caps Lock is on
            </p>
          )}

          {error && (
            <p id="admin-login-error" role="alert" className="aw-auth-error">
              {error}
            </p>
          )}

          {signedIn && (
            <p role="status" className="aw-auth-success">
              Signed in. Opening the admin…
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="aw-auth-submit"
          >
            {loading ? (
              <>
                <LoaderCircle size={16} className="aw-auth-spinner" aria-hidden="true" />
                Checking…
              </>
            ) : signedIn ? (
              'Opening admin…'
            ) : (
              'Unlock'
            )}
          </button>
        </form>
      </div>
      <p className="aw-auth-footer">AWWALSHOP catalogue administration</p>
    </main>
  )
}
