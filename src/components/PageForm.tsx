import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { PAGE_CATEGORIES, categoryConfig, buildContentTemplate } from '../lib/contentConfig'
import type { PageCategory } from '../lib/contentConfig'

interface PageFormProps {
  loreId:      string
  initialData?: {
    id:       string
    title:    string
    content:  string
    category: string
    tags:     string[]
  }
  isEditing?: boolean
  onSuccess:  (slug: string) => void
  showToast:  (message: string, type?: 'success' | 'error' | 'info') => void
}

function buildExcerpt(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= 160) return trimmed
  return trimmed.slice(0, 157) + '...'
}

function buildSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PageForm({
  loreId,
  initialData,
  isEditing = false,
  onSuccess,
  showToast,
}: PageFormProps) {
  const [loading, setLoading]   = useState(false)
  const [title, setTitle]       = useState(initialData?.title    ?? '')
  const [content, setContent]   = useState(initialData?.content  ?? '')
  const [category, setCategory] = useState<PageCategory>(
    (initialData?.category as PageCategory) ?? 'Character'
  )
  const [tags, setTags] = useState(initialData?.tags?.join(', ') ?? '')

  const config = categoryConfig[category]

  function handleCategoryChange(cat: PageCategory) {
    setCategory(cat)
    // Only inject template when creating (not editing) and content is empty
    if (!isEditing && !content.trim()) {
      setContent(buildContentTemplate(cat))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setLoading(true)
    try {
      const slug       = buildSlug(title)
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean)

      // Check for slug collision within this lore
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('lore_id', loreId)
        .eq('slug', slug)
        .single()

      if (existing && (!isEditing || existing.id !== initialData?.id)) {
        showToast('A page with this title already exists in this lore', 'error')
        setLoading(false)
        return
      }

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
        const { error } = await supabase.from('pages').update(pageData).eq('id', initialData.id)
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

      {/* Category — card picker with icon + description */}
      <div>
        <label className="block text-sm font-medium text-[#E5E5E5] mb-3">Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PAGE_CATEGORIES.map(cat => {
            const cfg    = categoryConfig[cat]
            const active = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-[#C4A962] bg-[#C4A962]/10'
                    : 'border-[#2A2A2A] bg-[#111] hover:border-[#3A3A3A]'
                }`}
              >
                <span className="text-base leading-none">{cfg.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${active ? 'text-[#C4A962]' : 'text-[#E5E5E5]'}`}>
                    {cat}
                  </p>
                  <p className="text-[10px] text-[#505050] truncate">{cfg.description}</p>
                </div>
              </button>
            )
          })}
        </div>
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[#E5E5E5]">
            Content <span className="text-[#606060] font-normal text-xs">Markdown supported</span>
          </label>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setContent(buildContentTemplate(category))}
              className="text-xs text-[#C4A962] hover:text-[#D4B972] transition-colors"
            >
              {config.icon} Insert {category} template
            </button>
          )}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={14}
          className={inputCls}
          placeholder={`## Overview\n\nDescribe this ${category.toLowerCase()} here...`}
        />
        {!isEditing && !content.trim() && (
          <p className="text-xs text-[#505050] mt-1.5">
            Suggested sections for {category}: {config.suggestedSections.join(', ')}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-semibold
                   hover:bg-[#B89A52] active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Page' : 'Create Page'}
      </button>
    </form>
  )
}
