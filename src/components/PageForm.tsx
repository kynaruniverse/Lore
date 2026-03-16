import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const PAGE_CATEGORIES = [
  'Character', 'Location', 'Event', 'Item', 'Organisation',
  'Concept', 'Timeline', 'Episode', 'Season', 'Driver',
  'Team', 'Circuit', 'Match', 'Other'
]

const RELATIONSHIP_TYPES = [
  'appears_in', 'related_to', 'happened_at', 'ally_of',
  'enemy_of', 'part_of', 'located_in', 'teammate_of'
]

interface PageFormProps {
  loreId: string
  loreSlug: string
  initialData?: any
  isEditing?: boolean
  existingPages?: Array<{ id: string; title: string; slug: string }>
  onSuccess: (slug: string) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export default function PageForm({ 
  loreId, 
  loreSlug, 
  initialData, 
  isEditing = false,
  existingPages = [],
  onSuccess,
  showToast
}: PageFormProps) {
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState(initialData?.title || '')
  const [category, setCategory] = useState(initialData?.category || 'Character')
  const [content, setContent] = useState(initialData?.content || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '')
  const [relationships, setRelationships] = useState<any[]>(
    initialData?.relationships?.map((r: any) => ({
      targetPageId: r.target_page_id,
      type: r.type,
      label: r.label || r.target_page_id
    })) || []
  )
  
  const [newRelTitle, setNewRelTitle] = useState('')
  const [newRelType, setNewRelType] = useState('related_to')

  const addRelationship = () => {
    if (!newRelTitle.trim()) {
      showToast('Please enter a page title', 'error')
      return
    }
    
    const match = existingPages.find(
      p => p.title.toLowerCase() === newRelTitle.trim().toLowerCase()
    )
    
    const targetPageId = match?.id || `pending-${Date.now()}`
    
    if (!match) {
      showToast('Page not found, but relationship will be saved', 'info')
    }
    
    setRelationships([
      ...relationships,
      { targetPageId, type: newRelType, label: newRelTitle.trim() }
    ])
    setNewRelTitle('')
  }

  const removeRelationship = (index: number) => {
    setRelationships(relationships.filter((_, i) => i !== index))
  }

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

      const excerpt = content
        .replace(/[#*`]/g, '')
        .slice(0, 160)
        .trim() + (content.length > 160 ? '...' : '')

      const tagArray = tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)

      const pageData = {
        lore_id: loreId,
        slug,
        title: title.trim(),
        category,
        content: content.trim(),
        excerpt,
        image_url: imageUrl.trim() || null,
        tags: tagArray,
        completeness: content.length > 200 ? 70 : 40,
        missing_fields: [],
        relationships: relationships.map(r => ({
          target_page_id: r.targetPageId,
          type: r.type,
          label: r.label
        }))
      }

      if (isEditing && initialData) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', initialData.id)

        if (error) throw error

        await supabase
          .from('relationships')
          .delete()
          .eq('source_page_id', initialData.id)

        for (const rel of relationships) {
          await supabase
            .from('relationships')
            .insert({
              source_page_id: initialData.id,
              target_page_id: rel.targetPageId,
              type: rel.type,
              label: rel.label
            })
        }

        onSuccess(slug)
      } else {
        const { data: newPage, error } = await supabase
          .from('pages')
          .insert(pageData)
          .select()
          .single()

        if (error) throw error

        for (const rel of relationships) {
          await supabase
            .from('relationships')
            .insert({
              source_page_id: newPage.id,
              target_page_id: rel.targetPageId,
              type: rel.type,
              label: rel.label
            })
        }

        await supabase
          .from('lores')
          .update({ 
            page_count: existingPages.length + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', loreId)

        onSuccess(slug)
      }
    } catch (error) {
      console.error('Error saving page:', error)
      showToast('Error saving page. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Walter White, Winterfell, The Battle of Blackwater..."
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {PAGE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Content
          </label>
          <span className="text-sm text-muted-foreground">{wordCount} words</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... Use ## for headings, **bold** for emphasis."
          rows={12}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports Markdown: ## Heading, **bold**, *italic*, &gt; blockquote
        </p>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Image URL (optional)
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. Protagonist, Chemistry, Albuquerque"
          className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Relationships */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Relationships
        </label>
        
        {relationships.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {relationships.map((rel, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm"
              >
                <span>{rel.label}</span>
                <span className="text-xs text-muted-foreground">({rel.type})</span>
                <button
                  type="button"
                  onClick={() => removeRelationship(i)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {existingPages.length > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            Existing pages: {existingPages.slice(0, 5).map(p => p.title).join(', ')}
            {existingPages.length > 5 && ` +${existingPages.length - 5} more`}
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newRelTitle}
            onChange={(e) => setNewRelTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRelationship())}
            placeholder="Page title..."
            className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={newRelType}
            onChange={(e) => setNewRelType(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {RELATIONSHIP_TYPES.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addRelationship}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 ember-glow"
      >
        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Page')}
      </button>
    </form>
  )
}
