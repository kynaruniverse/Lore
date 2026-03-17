import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'

interface LoreMeta {
  id: string
  title: string
  slug: string
}

export default function CreatePage() {
  const { loreSlug }    = useParams<{ loreSlug: string }>()
  const navigate         = useNavigate()
  const { showToast }    = useToast()
  const [lore, setLore]  = useState<LoreMeta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loreSlug) return
    let cancelled = false

    async function fetchLore() {
      try {
        const { data, error } = await supabase
          .from('lores')
          .select('id, title, slug')
          .eq('slug', loreSlug!)
          .single()

        if (error) throw error
        if (!cancelled) setLore(data)
      } catch (err) {
        console.error('Error fetching lore:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLore()
    return () => { cancelled = true }
  }, [loreSlug])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-[#1A1A1A] rounded w-1/3" />
          <div className="h-10 bg-[#1A1A1A] rounded" />
          <div className="h-40 bg-[#1A1A1A] rounded" />
        </div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Lore not found</h1>
        <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to={`/lore/${lore.slug}`}
        className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {lore.title}
      </Link>

      <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-1">Add a Page</h1>
      <p className="text-[#606060] mb-8">Create a new page in {lore.title}</p>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        onSuccess={slug => navigate(`/lore/${loreSlug}/${slug}`)}
        showToast={showToast}
      />
    </div>
  )
}
