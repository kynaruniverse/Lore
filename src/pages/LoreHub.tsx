import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, Users, Eye, AlertCircle, TrendingUp, Network } from 'lucide-react'
import { useLore } from '../lib/loreStore'

export default function LoreHub() {
  const { loreSlug } = useParams<{ loreSlug: string }>()
  const { lore, pages, loading } = useLore(loreSlug || '')

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading lore...</div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Lore not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  // Group pages by category
  const pagesByCategory = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = []
    }
    acc[page.category].push(page)
    return acc
  }, {} as Record<string, typeof pages>)

  const categories = Object.keys(pagesByCategory).sort()
  const incompletePages = pages.filter(page => page.completeness < 70)

  return (
    <div className="space-y-8">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to={`/lore/${lore.slug}/graph`}>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors">
              <Network className="w-4 h-4" />
              <span className="hidden sm:inline">Graph</span>
            </button>
          </Link>
          
          <Link to={`/lore/${lore.slug}/create-page`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 ember-glow">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Page</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Lore hero */}
      <div className="relative rounded-xl overflow-hidden border border-border">
        <img 
          src={lore.hero_image_url || lore.cover_image_url} 
          alt={lore.title}
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {lore.category}
            </span>
            {lore.trending && (
              <span className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            {lore.title}
          </h1>
          
          <p className="text-muted-foreground max-w-2xl">
            {lore.description}
          </p>
        </div>
      </div>

      {/* Lore stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="lore-card p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xl font-semibold">{lore.page_count || pages.length}</div>
            <div className="text-xs text-muted-foreground">Pages</div>
          </div>
        </div>
        
        <div className="lore-card p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xl font-semibold">{lore.contributor_count}</div>
            <div className="text-xs text-muted-foreground">Contributors</div>
          </div>
        </div>
        
        <div className="lore-card p-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xl font-semibold">{lore.views.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
        </div>
      </div>

      {/* Knowledge gaps */}
      {incompletePages.length > 0 && (
        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Knowledge Gaps</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {incompletePages.length} need attention
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            These pages are missing information. Help complete them to strengthen this Lore.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {incompletePages.slice(0, 5).map(page => (
              <Link 
                key={page.id} 
                to={`/lore/${lore.slug}/${page.slug}`}
                className="px-3 py-1 bg-card border border-border rounded-full text-xs hover:border-primary/40 transition-colors"
              >
                {page.title} <span className="text-primary ml-1">{page.completeness}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pages by category */}
      {categories.map(category => (
        <section key={category}>
          <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
            {category}
            <span className="text-sm text-muted-foreground font-normal">
              ({pagesByCategory[category].length})
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagesByCategory[category].map(page => (
              <Link key={page.id} to={`/lore/${lore.slug}/${page.slug}`}>
                <div className="lore-card p-4 group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-semibold group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {page.excerpt || page.content.slice(0, 120) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {page.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Completeness ring */}
                    <div className="relative w-8 h-8">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-border"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - page.completeness / 100)}`}
                          className="text-primary"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                        {page.completeness}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
