import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Flame } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoreCard from '../components/LoreCard'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
  cover_image_url: string
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
        .select('id, slug, title, description, cover_image_url')
        .order('title')
      
      console.log('Fetched lores:', data)
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
        <div className="text-[#C4A962]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#C4A962]" />
              <h1 className="text-2xl font-serif font-bold text-[#E5E5E5]">Lore</h1>
            </div>
            <Link to="/search">
              <button className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors">
                <Search className="w-5 h-5 text-[#A0A0A0]" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-serif font-bold text-[#E5E5E5] mb-2">Discover</h2>
        <p className="text-[#A0A0A0] mb-6">Explore knowledge universes</p>

        {/* Card grid - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {lores.map((lore) => (
            <LoreCard
              key={lore.id}
              id={lore.id}
              title={lore.title}
              description={lore.description}
              imageUrl={lore.cover_image_url}
              slug={lore.slug}
            />
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] py-2 px-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Flame className="w-5 h-5 text-[#C4A962]" />
            <span className="text-xs text-[#C4A962]">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1">
            <Search className="w-5 h-5 text-[#A0A0A0]" />
            <span className="text-xs text-[#A0A0A0]">Search</span>
          </Link>
          <Link to="/create" className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-[#C4A962] flex items-center justify-center">
              <span className="text-[#0F0F0F] text-xl font-bold">+</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  )
}
