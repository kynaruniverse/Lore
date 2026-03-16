import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoreScene3D from '../components/3d/LoreScene3D'
import { supabase } from '../lib/supabaseClient'

type Lore = {
  id: string
  slug: string
  title: string
  description: string
  cover_image_url: string
  color: string
}

export default function Home3D() {
  const [lores, setLores] = useState<Lore[]>([])
  const [loading, setLoading] = useState(true)
  const [show2D, setShow2D] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLores()
  }, [])

  async function fetchLores() {
    try {
      const { data } = await supabase
        .from('lores')
        .select('id, slug, title, description, cover_image_url, color')
        .eq('is_public', true)
      
      setLores(data || [])
    } catch (error) {
      console.error('Error fetching lores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Lore Explorer...</div>
      </div>
    )
  }

  if (show2D) {
    navigate('/')
    return null
  }

  return (
    <div className="relative">
      {/* Toggle between 2D and 3D */}
      <button
        onClick={() => setShow2D(true)}
        className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
      >
        Switch to 2D View
      </button>

      {/* 3D Scene */}
      <LoreScene3D lores={lores} />
    </div>
  )
}
