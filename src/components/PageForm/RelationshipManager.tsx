import { Plus, X } from 'lucide-react'
import { useState } from 'react'

const RELATIONSHIP_TYPES = [
  'appears_in', 'related_to', 'happened_at', 'ally_of',
  'enemy_of', 'part_of', 'located_in', 'teammate_of'
]

interface Relationship {
  targetPageId: string
  type: string
  label: string
}

interface RelationshipManagerProps {
  relationships: Relationship[]
  existingPages: Array<{ id: string; title: string; slug: string }>
  onAdd: (rel: Relationship) => void
  onRemove: (index: number) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function RelationshipManager({ 
  relationships, 
  existingPages, 
  onAdd, 
  onRemove,
  showToast 
}: RelationshipManagerProps) {
  const [newRelTitle, setNewRelTitle] = useState('')
  const [newRelType, setNewRelType] = useState('related_to')

  const handleAdd = () => {
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
    
    onAdd({ targetPageId, type: newRelType, label: newRelTitle.trim() })
    setNewRelTitle('')
  }

  return (
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
                onClick={() => onRemove(i)}
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
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
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
          onClick={handleAdd}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
