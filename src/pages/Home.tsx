import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Sparkles, PlusCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import FloatingCard from '../components/FloatingCard'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import type { Lore } from '../lib/loreStore'

const MotionLink = motion(Link)

// ── Contrast circle icon — geometric half-fill representing light/dark ────────
function ContrastIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Full circle outline */}
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      {/* Half fill — left side filled when dark, right side when light */}
      <motion.path
        d={isDark
          ? "M8 1 A7 7 0 0 0 8 15 Z"   // left half filled = dark mode
          : "M8 1 A7 7 0 0 1 8 15 Z"    // right half filled = light mode
        }
        fill="currentColor"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ transformOrigin: '8px 8px' }}
      />
    </svg>
  )
}

export default function Home() {
  const [lores, setLores]     = useState<Lore[]>([])
  const [loading, setLoading] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    let cancelled = false

    async function fetchLores() {
      try {
        const { data, error } = await supabase
          .from('lores')
          .select('id, slug, title, description, cover_image_url, category, page_count, contributor_count')
          .eq('is_public', true)
          .order('title')

        if (error) throw error
        if (!cancelled) setLores(data ?? [])
      } catch (err) {
        console.error('Error fetching lores:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLores()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-xl border-b border-[#2A2A2A]">
        <div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4A962] to-[#9A7C3C] flex items-center justify-center shadow-lg shadow-[#C4A962]/20">
                <span className="text-[#0F0F0F] font-bold text-lg leading-none">L</span>
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
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 bg-[#1A1A1A] hover:bg-[#222] rounded-xl border border-[#2A2A2A] transition-colors text-[#A0A0A0] hover:text-[#E5E5E5]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <ContrastIcon isDark={isDark} />
            </motion.button>

            <MotionLink
              to="/search"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-[#1A1A1A] hover:bg-[#222] rounded-xl border border-[#2A2A2A] transition-colors inline-flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#A0A0A0]" />
            </MotionLink>

            <MotionLink
              to="/create"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-[#C4A962] hover:bg-[#B89A52] rounded-xl transition-colors inline-flex items-center justify-center"
              aria-label="Create lore"
            >
              <PlusCircle className="w-4 h-4 text-[#0F0F0F]" />
            </MotionLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-10 pb-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-3">
            Discover <span className="text-[#C4A962]">Universes</span>
          </h2>
          <p className="text-base text-[#707070] max-w-lg">
            Immersive knowledge worlds. Tap any card to reveal details.
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] animate-pulse"
                style={{ minHeight: 400 }}
              />
            ))}
          </div>
        ) : lores.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#505050] text-lg mb-6">No lores yet.</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold hover:bg-[#B89A52] transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Create the first one
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {lores.map((lore, i) => (
              <motion.div
                key={lore.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <FloatingCard
                  id={lore.id}
                  title={lore.title}
                  description={lore.description ?? ''}
                  imageUrl={lore.cover_image_url}
                  slug={lore.slug}
                  pageCount={lore.page_count}
                  contributorCount={lore.contributor_count}
                  category={lore.category}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <div className="h-8" />
    </div>
  )
}
