import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

interface Suggestion {
  id: string
  title: string
  type: 'lore' | 'page'
  slug: string
  lore_slug?: string
}

export function SearchAutocomplete() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const searchTerm = `%${query}%`
      
      const [lores, pages] = await Promise.all([
        supabase
          .from('lores')
          .select('id, title, slug')
          .ilike('title', searchTerm)
          .limit(3),
        supabase
          .from('pages')
          .select('id, title, slug, lore_id, lores!inner(slug)')
          .ilike('title', searchTerm)
          .limit(3)
      ])

      const allSuggestions: Suggestion[] = [
        ...(lores.data?.map(l => ({ ...l, type: 'lore' as const })) || []),
        ...(pages.data?.map(p => ({ 
          ...p, 
          type: 'page' as const,
          lore_slug: p.lores.slug 
        })) || [])
      ]

      setSuggestions(allSuggestions)
    }

    const timeout = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(timeout)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      const suggestion = suggestions[selectedIndex]
      if (suggestion.type === 'lore') {
        window.location.href = `/lore/${suggestion.slug}`
      } else {
        window.location.href = `/lore/${suggestion.lore_slug}/${suggestion.slug}`
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Quick search... (press '/')"
          className="w-full pl-9 pr-8 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {suggestions.map((suggestion, index) => (
            <Link
              key={`${suggestion.type}-${suggestion.id}`}
              to={suggestion.type === 'lore' 
                ? `/lore/${suggestion.slug}`
                : `/lore/${suggestion.lore_slug}/${suggestion.slug}`
              }
              className={`
                block px-4 py-2 hover:bg-accent transition-colors
                ${index === selectedIndex ? 'bg-accent' : ''}
              `}
              onClick={() => setShowSuggestions(false)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                  {suggestion.type}
                </span>
                <span className="text-sm">{suggestion.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
