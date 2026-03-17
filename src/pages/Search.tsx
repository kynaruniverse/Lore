import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, FileText, Flame, ArrowRight, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type ResultType = 'page' | 'lore'

interface SearchResult {
  id:          string
  title:       string
  slug:        string
  excerpt:     string
  category:    string
  type:        ResultType
  lore_slug?:  string
  lore_title?: string
  cover_image?: string
}

interface SupabasePage {
  id:       string
  title:    string
  slug:     string
  excerpt:  string
  category: string
  lore_id:  string
  lores: {
    slug:  string
    title: string
  }
}

export default function Search() {
  const [query, setQuery]              = useState('')
  const [debouncedQuery, setDebounced] = useState('')
  const [results, setResults]          = useState<SearchResult[]>([])
  const [loading, setLoading]          = useState(false)
  const inputRef                        = useRef<HTMLInputElement>(null)

  // Focus input on mount without triggering mobile keyboard immediately
  // (only auto-focuses on non-touch devices)
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (!isTouchDevice) inputRef.current?.focus()
  }, [])

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  // Search
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    let cancelled = false

    async function performSearch() {
      setLoading(true)
      try {
        const term = `%${debouncedQuery}%`

        const [{ data: pages }, { data: lores }] = await Promise.all([
          supabase
            .from('pages')
            .select('id, title, slug, excerpt, category, lore_id, lores!inner(slug, title)')
            .or(`title.ilike.${term},content.ilike.${term},excerpt.ilike.${term}`)
            .limit(10),
          supabase
            .from('lores')
            .select('id, title, slug, description, cover_image_url, category')
            .or(`title.ilike.${term},description.ilike.${term}`)
            .limit(5),
        ])

        if (cancelled) return

        const formatted: SearchResult[] = [
          ...(lores ?? []).map(l => ({
            id:          l.id,
            title:       l.title,
            slug:        l.slug,
            excerpt:     l.description ?? '',
            category:    l.category,
            type:        'lore' as const,
            cover_image: l.cover_image_url,
          })),
          ...((pages ?? []) as unknown as SupabasePage[]).map(p => ({
            id:         p.id,
            title:      p.title,
            slug:       p.slug,
            excerpt:    p.excerpt || p.title,
            category:   p.category,
            type:       'page' as const,
            lore_slug:  p.lores.slug,
            lore_title: p.lores.title,
          })),
        ]

        setResults(formatted)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    performSearch()
    return () => { cancelled = true }
  }, [debouncedQuery])

  const loreResults = results.filter(r => r.type === 'lore')
  const pageResults = results.filter(r => r.type === 'page')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5] mb-1">Search</h1>
        <p className="text-sm text-[#606060]">
          Press{' '}
          <kbd className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#A0A0A0] text-xs font-mono">
            /
          </kbd>{' '}
          anywhere to focus
        </p>
      </div>

      {/* Input */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505050]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search pages, characters, locations..."
          className="w-full pl-10 pr-10 py-3 bg-[#111] border border-[#2A2A2A] rounded-xl
                     text-[#E5E5E5] placeholder-[#404040]
                     focus:outline-none focus:border-[#C4A962] transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#505050] hover:text-[#A0A0A0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
        <p className="text-center text-[#505050] py-12">
          No results for <span className="text-[#A0A0A0]">"{debouncedQuery}"</span>
        </p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-8">
          {/* Lores */}
          {loreResults.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xs font-semibold text-[#606060] uppercase tracking-widest mb-3">
                <Flame className="w-3.5 h-3.5" /> Lores
              </h2>
              <div className="space-y-2">
                {loreResults.map(r => (
                  <Link
                    key={r.id}
                    to={`/lore/${r.slug}`}
                    className="flex items-center gap-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A]
                               rounded-xl hover:border-[#C4A962]/40 transition-colors group"
                  >
                    {r.cover_image && (
                      <img
                        src={r.cover_image}
                        alt={r.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#E5E5E5] group-hover:text-[#C4A962] transition-colors truncate">
                        {r.title}
                      </p>
                      <p className="text-xs text-[#606060] truncate mt-0.5">{r.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#404040] group-hover:text-[#C4A962] shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Pages */}
          {pageResults.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xs font-semibold text-[#606060] uppercase tracking-widest mb-3">
                <FileText className="w-3.5 h-3.5" /> Pages
              </h2>
              <div className="space-y-2">
                {pageResults.map(r => (
                  <Link
                    key={r.id}
                    to={`/lore/${r.lore_slug}/${r.slug}`}
                    className="flex items-start gap-3 p-4 bg-[#1A1A1A] border border-[#2A2A2A]
                               rounded-xl hover:border-[#C4A962]/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#505050] truncate">{r.lore_title}</span>
                        <span className="shrink-0 text-xs bg-[#C4A962]/10 text-[#C4A962] px-2 py-0.5 rounded-full">
                          {r.category}
                        </span>
                      </div>
                      <p className="font-semibold text-[#E5E5E5] group-hover:text-[#C4A962] transition-colors">
                        {r.title}
                      </p>
                      <p className="text-xs text-[#606060] line-clamp-2 mt-0.5">{r.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#404040] group-hover:text-[#C4A962] shrink-0 transition-colors mt-1" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
