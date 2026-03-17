import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'

const CATEGORIES = ['tv', 'game', 'film', 'sports', 'book', 'music', 'history', 'other'] as const
type Category = typeof CATEGORIES[number]

function buildSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CreateLore() {
  const navigate        = useNavigate()
  const { showToast }   = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title:       '',
    description: '',
    category:    'tv' as Category,
    tags:        '',
    isPublic:    true,
  })

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setLoading(true)
    try {
      const slug = buildSlug(form.title)
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

      const { error } = await supabase.from('lores').insert({
        title:           form.title.trim(),
        slug,
        description:     form.description.trim(),
        category:        form.category,
        tags,
        is_public:       form.isPublic,
        cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
        color:           '#C4A962',
      })

      if (error) throw error
      showToast('Lore created successfully!', 'success')
      navigate(`/lore/${slug}`)
    } catch (err) {
      console.error('Error creating lore:', err)
      showToast('Failed to create lore. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-[#111] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] ' +
    'placeholder-[#404040] focus:outline-none focus:border-[#C4A962] transition-colors'

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Discovery</span>
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-1">Create a Lore</h1>
        <p className="text-[#606060] mb-8">Start a new knowledge space</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text" value={form.title} onChange={set('title')}
              className={inputCls} placeholder="e.g. Breaking Bad" required
            />
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
            <textarea
              value={form.description} onChange={set('description')} rows={4}
              className={inputCls} placeholder="A brief summary of this lore universe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
              Tags <span className="text-[#606060] font-normal">(comma-separated)</span>
            </label>
            <input
              type="text" value={form.tags} onChange={set('tags')}
              className={inputCls} placeholder="e.g. drama, crime, AMC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-3">Visibility</label>
            <div className="flex gap-4">
              {(['public', 'private'] as const).map(v => {
                const isPublic = v === 'public'
                const active   = form.isPublic === isPublic
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
                      type="radio"
                      name="visibility"
                      className="sr-only"
                      checked={active}
                      onChange={() => setForm(p => ({ ...p, isPublic }))}
                    />
                    <span className="text-sm font-medium capitalize">{v}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold
                       hover:bg-[#B89A52] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Lore'}
          </button>
        </form>
      </div>
    </div>
  )
}
