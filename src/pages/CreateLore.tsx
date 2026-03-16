import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/ui/Toast'

const CATEGORIES = ['tv', 'game', 'film', 'sports', 'book', 'music', 'history']

export default function CreateLore() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tv',
    tags: '',
    isPublic: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setLoading(true)

    try {
      // Generate slug
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Parse tags
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
          cover_image_url: `https://source.unsplash.com/random/800x600/?${slug}`,
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        })

      if (error) throw error

      showToast('Lore created successfully!', 'success')
      setTimeout(() => navigate(`/lore/${slug}`), 1000)
    } catch (error) {
      console.error('Error creating lore:', error)
      showToast('Failed to create lore', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-3xl font-serif font-bold">Create a Lore</h1>
        <p className="text-muted-foreground mt-1">
          Start a new knowledge space for any topic
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Breaking Bad, Elden Ring, Formula 1"
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
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="What is this Lore about?"
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
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., fantasy, drama, history"
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Public/Private toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.isPublic}
              onChange={() => setFormData({ ...formData, isPublic: true })}
              className="text-primary"
            />
            <span className="text-sm">Public</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!formData.isPublic}
              onChange={() => setFormData({ ...formData, isPublic: false })}
              className="text-primary"
            />
            <span className="text-sm">Private</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 ember-glow"
        >
          {loading ? 'Creating...' : 'Create Lore'}
        </button>
      </form>
    </div>
  )
}
