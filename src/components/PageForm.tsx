import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { FormInput } from './ui/FormInput'
import { RelationshipManager } from './PageForm/RelationshipManager'
import BlockEditor from './BlockEditor'

const PAGE_CATEGORIES = [
  'Character', 'Location', 'Event', 'Item', 'Organisation',
  'Concept', 'Timeline', 'Episode', 'Season', 'Driver',
  'Team', 'Circuit', 'Match', 'Other'
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
            page_count: (existingPages?.length || 0) + 1,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          label="Title *" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g. Walter White..." 
          required 
        />

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
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
      </div>

      <div className="border border-border rounded-xl p-6 bg-card/50">
        <label className="block text-sm font-medium mb-4">Content</label>
        <BlockEditor 
          initialValue={content} 
          onChange={(markdown) => setContent(markdown)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          label="Image URL (optional)" 
          type="url" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="https://..." 
        />

        <FormInput 
          label="Tags (comma separated)" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)} 
          placeholder="e.g. Protagonist, Chemistry" 
        />
      </div>

      <div className="border border-border rounded-xl p-6 bg-card/50">
        <RelationshipManager 
          relationships={relationships}
          existingPages={existingPages}
          onAdd={(rel) => setRelationships([...relationships, rel])}
          onRemove={(index) => setRelationships(relationships.filter((_, i) => i !== index))}
          showToast={showToast}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 ember-glow shadow-lg transition-all"
      >
        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Page')}
      </button>
    </form>
  )
}
