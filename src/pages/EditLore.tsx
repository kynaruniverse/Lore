import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import type { Lore } from '../lib/loreStore'

const CATEGORIES = ['tv', 'game', 'film', 'sports', 'book', 'music', 'history', 'other'] as const

function buildSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function EditLore() {
  const { loreSlug }    = useParams<{ loreSlug: string }>()
  const navigate         = useNavigate()
  const { showToast }    = useToast()
  const [lore, setLore]  = useState<Lore | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({
    title:           '',
    description:     '',
    category:        'tv',
    tags:            '',
    cover_image_url: '',
    hero_image_url:  '',
    is_public:       true,
  })

  useEffect(() => {
    if (!loreSlug) return
    let cancelled = false

    async function fetchLore() {
      try {
        const { data, error } = await supabase
          .from('lores').select('*').eq('slug', loreSlug!).single()
        if (error || !data) throw error ?? new Error('Not found')
        if (!cancelled) {
          setLore(data)
          setForm({
            title:           data.title,
            description:     data.description ?? '',
            category:        data.category ?? 'other',
            tags:            data.tags?.join(', ') ?? '',
            cover_image_url: data.cover_image_url ?? '',
            hero_image_url:  data.hero_image_url ?? '',
            is_public:       data.is_public,
          })
        }
      } catch (err) {
        console.error('Error fetching lore:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLore()
    return () => { cancelled = true }
  }, [loreSlug])

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!lore || !form.title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setSaving(true)
    try {
      const newSlug = buildSlug(form.title)
      const tags    = form.tags.split(',').map(t => t.trim()).filter(Boolean)

      const { error } = await supabase
        .from('lores')
        .update({
          title:           form.title.trim(),
          slug:            newSlug,
          description:     form.description.trim(),
          category:        form.category,
          tags,
          cover_image_url: form.cover_image_url.trim(),
          hero_image_url:  form.hero_image_url.trim(),
          is_public:       form.is_public,
        })
        .eq('id', lore.id)

      if (error) throw error
      showToast('Lore updated!', 'success')
      // Navigate to new slug in case title changed
      navigate(`/lore/${newSlug}`)
    } catch (err) {
      console.error('Error updating lore:', err)
      showToast('Failed to update lore', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!lore) return
    setDeleting(true)
    try {
      // Delete pages first (FK constraint)
      await supabase.from('pages').delete().eq('lore_id', lore.id)
      const { error } = await supabase.from('lores').delete().eq('id', lore.id)
      if (error) throw error
      showToast('Lore deleted', 'info')
      navigate('/')
    } catch (err) {
      console.error('Error deleting lore:', err)
      showToast('Failed to delete lore', 'error')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-[#111] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] ' +
    'placeholder-[#404040] focus:outline-none focus:border-[#C4A962] transition-colors'

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-4 animate-pulse">
        <div className="h-6 bg-[#1A1A1A] rounded w-1/3" />
        <div className="h-10 bg-[#1A1A1A] rounded" />
        <div className="h-40 bg-[#1A1A1A] rounded" />
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
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to={`/lore/${loreSlug}`}
            className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to {lore.title}</span>
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300
                       bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg
                       transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Lore
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-1">Edit Lore</h1>
        <p className="text-[#606060] mb-8">Editing {lore.title}</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input type="text" value={form.title} onChange={set('title')} className={inputCls} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Category</label>
            <select value={form.category} onChange={set('category')} className={inputCls}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={4} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
              Tags <span className="text-[#606060] font-normal">(comma-separated)</span>
            </label>
            <input type="text" value={form.tags} onChange={set('tags')} className={inputCls} placeholder="e.g. drama, crime, AMC" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Cover Image URL</label>
            <input type="url" value={form.cover_image_url} onChange={set('cover_image_url')} className={inputCls} placeholder="https://..." />
            {form.cover_image_url && (
              <div className="mt-2 rounded-xl overflow-hidden border border-[#2A2A2A] h-32">
                <img src={form.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Hero Image URL</label>
            <input type="url" value={form.hero_image_url} onChange={set('hero_image_url')} className={inputCls} placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-3">Visibility</label>
            <div className="flex gap-4">
              {(['public', 'private'] as const).map(v => {
                const isPublic = v === 'public'
                const active   = form.is_public === isPublic
                return (
                  <label
                    key={v}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                      active
                        ? 'border-[#C4A962] bg-[#C4A962]/10 text-[#C4A962]'
                        : 'border-[#2A2A2A] bg-[#111] text-[#A0A0A0] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <input
                      type="radio" name="visibility" className="sr-only"
                      checked={active}
                      onChange={() => setForm(p => ({ ...p, is_public: isPublic }))}
                    />
                    <span className="text-sm font-medium capitalize">{v}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold
                       hover:bg-[#B89A52] active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-2 bg-red-500/10 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#E5E5E5] mb-1">Delete this lore?</h2>
                <p className="text-sm text-[#606060]">
                  <span className="text-[#A0A0A0] font-medium">"{lore.title}"</span> and all its pages
                  will be permanently deleted. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)} disabled={deleting}
                className="flex-1 py-2.5 text-sm font-medium text-[#A0A0A0] bg-[#111]
                           border border-[#2A2A2A] rounded-xl hover:bg-[#222] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500
                           hover:bg-red-600 active:scale-95 rounded-xl transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
