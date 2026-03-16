import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { PAGE_CATEGORIES } from '../lib/contentConfig'

interface PageFormProps {
  loreId: string
  loreSlug: string
  initialData?: {
    id: string
    title: string
    content: string
    category: string
    tags: string[]
  }
  isEditing?: boolean
  onSuccess: (slug: string) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

function buildExcerpt(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= 160) return trimmed
  return trimmed.slice(0, 157) + '...'
}

function buildSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function PageForm({
  loreId,
  loreSlug: _loreSlug,
  initialData,
  isEditing = false,
  onSuccess,
  showToast,
}: PageFormProps) {
  const [loading, setLoading]   = useState(false)
  const [title, setTitle]       = useState(initialData?.title    ?? '')
  const [content, setContent]   = useState(initialData?.content  ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'Character')
  const [tags, setTags]         = useState(initialData?.tags?.join(', ') ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setLoading(true)

    try {
      const slug = buildSlug(title)

      const parsedTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const pageData = {
        lore_id:  loreId,
        slug,
        title:    title.trim(),
        category,
        content:  content.trim(),
        excerpt:  buildExcerpt(content),
        tags:     parsedTags,
      }

      if (isEditing && initialData) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', initialData.id)

        if (error) throw error
        showToast('Page updated successfully!', 'success')
      } else {
        const { error } = await supabase.from('pages').insert(pageData)
        if (error) throw error
        showToast('Page created successfully!', 'success')
      }

      onSuccess(slug)
    } catch (err) {
      console.error('Error saving page:', err)
      showToast('Failed to save page. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-[#111] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] ' +
    'placeholder-[#505050] focus:outline-none focus:border-[#C4A962] transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={inputCls}
          placeholder="e.g. Geralt of Rivia"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={inputCls}
        >
          {PAGE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
          Tags <span className="text-[#606060] font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className={inputCls}
          placeholder="e.g. protagonist, witcher, human"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
          Content{' '}
          <span className="text-[#606060] font-normal text-xs">Markdown supported</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={12}
          className={inputCls}
          placeholder={'## Overview\n\nDescribe this page here...\n\n## Background\n\n...'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold
                   hover:bg-[#B89A52] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Page' : 'Create Page'}
      </button>
    </form>
  )
}
