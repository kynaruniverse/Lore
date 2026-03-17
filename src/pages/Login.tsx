import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()
  const { showToast }           = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let error = null
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        error = signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        error = signInError
      }

      if (error) {
        showToast(error.message, 'error')
      } else {
        showToast(
          isSignUp
            ? 'Sign up successful! Please check your email for verification.'
            : 'Logged in successfully!',
          'success'
        )
        navigate('/')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-[#111] border border-[#2A2A2A] rounded-xl text-[#E5E5E5] ' +
    'placeholder-[#505050] focus:outline-none focus:border-[#C4A962] transition-colors text-sm'

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0F0F] px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4A962] to-[#9A7C3C] flex items-center justify-center shadow-lg shadow-[#C4A962]/20">
              <span className="text-[#0F0F0F] font-bold text-xl leading-none">L</span>
            </div>
            <motion.span
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C4A962]" />
            </motion.span>
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#E5E5E5] leading-none">Lore</h1>
            <p className="text-[10px] text-[#606060] tracking-widest uppercase mt-0.5">Knowledge Universe</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-serif font-bold text-[#E5E5E5] mb-1 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-[#606060] text-center mb-6">
            {isSignUp ? 'Join the universe of knowledge' : 'Sign in to continue'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={inputCls}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={inputCls}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold
                         hover:bg-[#B89A52] active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Please wait…' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-[#C4A962] hover:text-[#D4B972] transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
