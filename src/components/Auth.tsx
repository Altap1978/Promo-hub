import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { AuthError } from '@supabase/supabase-js'

type AuthMode = 'signin' | 'signup'

interface AuthProps {
  onSuccess: () => void
}

export default function Auth({ onSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let result
    if (mode === 'signup') {
      result = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })
    } else {
      result = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
    }

    setLoading(false)

    if (result.error) {
      setError(formatError(result.error))
      return
    }

    if (result.data.user) {
      onSuccess()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex mb-6">
        <button
          onClick={() => {
            setMode('signin')
            setError(null)
          }}
          className={`flex-1 py-2 text-center font-medium rounded-l-xl transition-colors ${
            mode === 'signin'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('signup')
            setError(null)
          }}
          className={`flex-1 py-2 text-center font-medium rounded-r-xl transition-colors ${
            mode === 'signup'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-gray-500 mb-6">
        {mode === 'signin'
          ? 'Sign in to share your videos'
          : 'Sign up to start promoting your content'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

function formatError(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please check your email to confirm your account.'
    case 'User already registered':
      return 'An account with this email already exists. Try signing in instead.'
    default:
      return error.message || 'An error occurred. Please try again.'
  }
}
