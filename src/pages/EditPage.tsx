import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import type { Lore, Page } from '../lib/loreStore'

export default function EditPage() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const navigate   = useNavigate()
  const { showToast } = useToast()
  const [lore, setLore]   = useState<Pick<Lore, 'id' | 'title' | 'slug'> | null>(null)
  const [page, setPage]   = useState<Page | null>(null)
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loreSlug || !pageSlug) return
    let cancelled = false

    async function fetchData() {
      try {
        const { data: loreData, error: le } = await supabase
          .from('lores')
          .select('id, title, slug')
          .eq('slug', loreSlug)
          .single()
        if (le || !loreData) throw le ?? new Error('Lore not found')
        if (!cancelled) setLore(loreData)

        const { data: pageData, error: pe } = await supabase
          .from('pages')
          .select('*')
          .eq('lore_id', loreData.id)
          .eq('slug', pageSlug)
          .single()
        if (pe || !pageData) throw pe ?? new Error('Page not found')
        if (!cancelled) setPage(pageData)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [loreSlug, pageSlug])

  async function handleDelete() {
    if (!page || !lore) return
    if (!window.confirm(`Delete "${page.title}"? This cannot be undone.`)) return

    setDeleting(true)
    try {
      const { error } = await supabase.from('pages').delete().eq('id', page.id)
      if (error) throw error
      showToast('Page deleted', 'info')
      navigate(`/lore/${lore.slug}`)
    } catch (err) {
      console.error('Error deleting page:', err)
      showToast('Failed to delete page', 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-4 animate-pulse">
        <div className="h-6 bg-[#1A1A1A] rounded w-1/3" />
        <div className="h-10 bg-[#1A1A1A] rounded" />
        <div className="h-40 bg-[#1A1A1A] rounded" />
      </div>
    )
  }

  if (!lore || !page) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Page not found</h1>
        <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/lore/${lore.slug}/${page.slug}`}
          className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {page.title}
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300
                     bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors
                     disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-1">Edit Page</h1>
      <p className="text-[#606060] mb-8">Editing {page.title} in {lore.title}</p>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        initialData={page}
        isEditing
        onSuccess={slug => navigate(`/lore/${loreSlug}/${slug}`)}
        showToast={showToast}
      />
    </div>
  )
}
