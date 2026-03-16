import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['tv', 'game', 'film', 'sports', 'book', 'music', 'history']

export default function CreateLore() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tv',
    tags: '',
    isPublic: true
  })

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    alert(message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showAlert('Please enter a title', 'error')
      return
    }

    setLoading(true)

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const { error } = await supabase
        .from('lores')
        .insert({
          title: formData.title.trim(),
          slug,
          description: formData.description.trim(),
          category: formData.category,
          tags,
          is_public: formData.isPublic,
          cover_image_url: `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80`,
          color: '#C4A962'
        })

      if (error) throw error

      showAlert('Lore created successfully!', 'success')
      setTimeout(() => navigate(`/lore/${slug}`), 1000)
    } catch (error) {
      console.error('Error creating lore:', error)
      showAlert('Failed to create lore', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Discovery</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-2">Create a Lore</h1>
        <p className="text-[#A0A0A0] mb-8">Start a new knowledge space</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.isPublic}
                onChange={() => setFormData({ ...formData, isPublic: true })}
                className="text-[#C4A962]"
              />
              <span className="text-[#E5E5E5]">Public</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!formData.isPublic}
                onChange={() => setFormData({ ...formData, isPublic: false })}
                className="text-[#C4A962]"
              />
              <span className="text-[#E5E5E5]">Private</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-lg font-semibold hover:bg-[#B89A52] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Lore'}
          </button>
        </form>
      </div>
    </div>
  )
}
