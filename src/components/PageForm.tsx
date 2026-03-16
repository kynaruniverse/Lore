import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface PageFormProps {
  loreId: string
  loreSlug: string
  initialData?: any
  isEditing?: boolean
  existingPages?: any[]
  onSuccess: (slug: string) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export default function PageForm({ 
  loreId, 
  loreSlug, 
  initialData, 
  isEditing = false,
  onSuccess,
  showToast
}: PageFormProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [category, setCategory] = useState(initialData?.category || 'Character')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setLoading(true)

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const pageData = {
        lore_id: loreId,
        slug,
        title: title.trim(),
        category,
        content: content.trim(),
        excerpt: content.slice(0, 160) + '...',
        tags: []
      }

      if (isEditing && initialData) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', initialData.id)

        if (error) throw error
        onSuccess(slug)
      } else {
        const { error } = await supabase
          .from('pages')
          .insert(pageData)

        if (error) throw error
        onSuccess(slug)
      }
    } catch (error) {
      console.error('Error saving page:', error)
      showToast('Error saving page', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
        >
          <option value="Character">Character</option>
          <option value="Location">Location</option>
          <option value="Event">Event</option>
          <option value="Item">Item</option>
          <option value="Organisation">Organisation</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] focus:outline-none focus:border-[#C4A962]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-lg font-semibold hover:bg-[#B89A52] transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
      </button>
    </form>
  )
}
