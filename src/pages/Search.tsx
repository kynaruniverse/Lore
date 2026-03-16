import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, FileText, Flame, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type SearchResult = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  type: 'page' | 'lore'
  lore_id?: string
  lore_slug?: string
  lore_title?: string
  cover_image?: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    async function performSearch() {
      setLoading(true)
      try {
        const searchTerm = `%${debouncedQuery}%`
        
        // Search pages
        const { data: pages } = await supabase
          .from('pages')
          .select(`
            id,
            title,
            slug,
            excerpt,
            category,
            lore_id,
            lores:lores!inner (
              slug,
              title
            )
          `)
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
          .limit(10) as any

        // Search lores
        const { data: lores } = await supabase
          .from('lores')
          .select('id, title, slug, description, cover_image_url, category')
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(5)

        const formattedResults: SearchResult[] = [
          ...(lores?.map(lore => ({
            id: lore.id,
            title: lore.title,
            slug: lore.slug,
            excerpt: lore.description,
            category: lore.category,
            type: 'lore' as const,
            cover_image: lore.cover_image_url
          })) || []),
          ...(pages?.map((page: any) => ({
            id: page.id,
            title: page.title,
            slug: page.slug,
            excerpt: page.excerpt || page.title,
            category: page.category,
            type: 'page' as const,
            lore_id: page.lore_id,
            lore_slug: (page.lores as any).slug,
            lore_title: (page.lores as any).title
          })) || [])
        ]

        setResults(formattedResults)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-4">Search</h1>
        
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, characters, locations..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for "{debouncedQuery}"
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-6">
          {/* Group results by type */}
          {results.some(r => r.type === 'lore') && (
            <section>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Lores
              </h2>
              <div className="space-y-2">
                {results.filter(r => r.type === 'lore').map(result => (
                  <Link
                    key={result.id}
                    to={`/lore/${result.slug}`}
                    className="block lore-card p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {result.cover_image && (
                        <img 
                          src={result.cover_image} 
                          alt={result.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {result.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.some(r => r.type === 'page') && (
            <section>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Pages
              </h2>
              <div className="space-y-2">
                {results.filter(r => r.type === 'page').map(result => (
                  <Link
                    key={result.id}
                    to={`/lore/${result.lore_slug}/${result.slug}`}
                    className="block lore-card p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {result.lore_title}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {result.category}
                          </span>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {result.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
                    </div>
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
