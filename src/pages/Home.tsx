import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Sparkles, Menu } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import FloatingCard from '../components/FloatingCard'
import { motion } from 'framer-motion'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
  cover_image_url: string
  category: string
  page_count: number
  contributor_count: number
}

export default function Home() {
  const [lores, setLores] = useState<Lore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLores()
  }, [])

  async function fetchLores() {
    try {
      const { data } = await supabase
        .from('lores')
        .select('id, slug, title, description, cover_image_url, category, page_count, contributor_count')
        .order('title')
      
      setLores(data || [])
    } catch (error) {
      console.error('Error fetching lores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <motion.div 
          className="text-[#C4A962] text-xl"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Lore...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-[#2A2A2A]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo with sparkle */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C4A962] to-[#B89A52] flex items-center justify-center shadow-lg shadow-[#C4A962]/20">
                  <span className="text-[#0F0F0F] text-xl font-bold">L</span>
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-[#C4A962]" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#E5E5E5]">Lore</h1>
                <p className="text-xs text-[#A0A0A0]">Knowledge Universe</p>
              </div>
            </motion.div>

            {/* Search and Menu */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/search">
                  <button className="p-3 bg-[#1A1A1A] hover:bg-[#222] rounded-2xl border border-[#333] transition-all">
                    <Search className="w-5 h-5 text-[#A0A0A0]" />
                  </button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="p-3 bg-[#1A1A1A] hover:bg-[#222] rounded-2xl border border-[#333] transition-all md:hidden">
                  <Menu className="w-5 h-5 text-[#A0A0A0]" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-4">
              Discover <span className="text-[#C4A962]">Universes</span>
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl">
              Explore immersive knowledge worlds. Tap any card to flip and discover more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards Section - Full width but with margins */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {lores.map((lore, index) => (
            <motion.div
              key={lore.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FloatingCard
                id={lore.id}
                title={lore.title}
                description={lore.description}
                imageUrl={lore.cover_image_url}
                slug={lore.slug}
                pageCount={lore.page_count}
                contributorCount={lore.contributor_count}
                category={lore.category}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom padding */}
      <div className="h-24" />
    </div>
  )
}
