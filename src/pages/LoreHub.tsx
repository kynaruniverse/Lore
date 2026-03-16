import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, FileText, Users, Eye, AlertCircle, TrendingUp, Network } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { ContentBox, ContentGrid, KnowledgeGapCard } from '../components/PageLayout'
import { categoryConfig } from '../lib/contentConfig'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
  category: string
  cover_image_url: string
  hero_image_url: string
  color: string
  page_count: number
  contributor_count: number
  views: number
  trending: boolean
}

interface Page {
  id: string
  lore_id: string
  slug: string
  title: string
  category: string
  content: string
  excerpt: string
  image_url: string | null
  tags: string[]
  completeness: number
  missing_fields: string[]
  views: number
  created_at: string
  updated_at: string
}

export default function LoreHub() {
  const { loreSlug } = useParams<{ loreSlug: string }>()
  const [lore, setLore] = useState<Lore | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loreSlug) {
      fetchLoreAndPages()
    }
  }, [loreSlug])

  async function fetchLoreAndPages() {
    try {
      setLoading(true)
      
      const { data: loreData, error: loreError } = await supabase
        .from('lores')
        .select('*')
        .eq('slug', loreSlug)
        .single()

      if (loreError) throw loreError
      if (!loreData) throw new Error('Lore not found')
      
      setLore(loreData)

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .order('category', { ascending: true })
        .order('title', { ascending: true })

      if (pagesError) throw pagesError
      
      setPages(pagesData || [])
    } catch (err) {
      console.error('Error fetching lore:', err)
    } finally {
      setLoading(false)
    }
  }

  const pagesByCategory = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = []
    }
    acc[page.category].push(page)
    return acc
  }, {} as Record<string, Page[]>)

  const categories = Object.keys(pagesByCategory).sort()
  const incompletePages = pages.filter(page => page.completeness < 70)

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-border rounded w-32"></div>
          <div className="h-64 bg-border rounded"></div>
          <ContentGrid cols={3}>
            <div className="h-20 bg-border rounded"></div>
            <div className="h-20 bg-border rounded"></div>
            <div className="h-20 bg-border rounded"></div>
          </ContentGrid>
        </div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Lore not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-4 md:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to={`/lore/${lore.slug}/graph`}>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors">
              <Network className="w-4 h-4" />
              <span>Graph</span>
            </button>
          </Link>
          
          <Link to={`/lore/${lore.slug}/create-page`}>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 ember-glow">
              <Plus className="w-4 h-4" />
              <span>Add Page</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Lore hero */}
      <div className="relative rounded-xl overflow-hidden border border-border mb-8">
        <div className="aspect-[2/1] sm:aspect-[3/1] md:aspect-[4/1]">
          <img 
            src={lore.hero_image_url || lore.cover_image_url} 
            alt={lore.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {lore.category}
            </span>
            {lore.trending && (
              <span className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
            {lore.title}
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl line-clamp-2 md:line-clamp-3">
            {lore.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <ContentGrid cols={3} gap="md" className="mb-8">
        <ContentBox variant="compact">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <div>
              <div className="text-xl font-semibold">{lore.page_count || pages.length}</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
          </div>
        </ContentBox>
        
        <ContentBox variant="compact">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary shrink-0" />
            <div>
              <div className="text-xl font-semibold">{lore.contributor_count}</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
          </div>
        </ContentBox>
        
        <ContentBox variant="compact">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary shrink-0" />
            <div>
              <div className="text-xl font-semibold">{lore.views?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
          </div>
        </ContentBox>
      </ContentGrid>

      {/* Knowledge gaps */}
      {incompletePages.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold">Knowledge Gaps</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {incompletePages.length} need attention
            </span>
          </div>
          
          <ContentGrid cols={3} gap="md">
            {incompletePages.slice(0, 3).map(page => (
              <Link key={page.id} to={`/lore/${lore.slug}/${page.slug}`}>
                <ContentBox variant="compact" className="hover:border-primary/40 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{page.title}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {page.completeness}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {page.excerpt || 'Missing information'}
                  </p>
                </ContentBox>
              </Link>
            ))}
          </ContentGrid>
        </div>
      )}

      {/* Pages by category */}
      {categories.length === 0 ? (
        <ContentBox className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No pages yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Be the first to add a page to this Lore</p>
          <Link to={`/lore/${lore.slug}/create-page`}>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">
              Add your first page
            </button>
          </Link>
        </ContentBox>
      ) : (
        categories.map(category => (
          <section key={category} className="mb-8">
            <h2 className="text-lg md:text-xl font-serif font-semibold mb-4 flex items-center gap-2">
              <span style={{ color: categoryConfig[category as keyof typeof categoryConfig]?.color }}>
                {categoryConfig[category as keyof typeof categoryConfig]?.icon || '📄'}
              </span>
              {category}
              <span className="text-sm text-muted-foreground font-normal">
                ({pagesByCategory[category].length})
              </span>
            </h2>
            
            <ContentGrid cols={3} gap="md">
              {pagesByCategory[category].map(page => (
                <Link key={page.id} to={`/lore/${lore.slug}/${page.slug}`}>
                  <ContentBox className="h-full hover:border-primary/40 transition-colors">
                    <div className="flex flex-col h-full">
                      <h3 className="font-serif font-semibold text-base mb-2 line-clamp-2">
                        {page.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                        {page.excerpt || page.content.slice(0, 100) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-1 flex-wrap">
                          {page.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
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
                  </ContentBox>
                </Link>
              ))}
            </ContentGrid>
          </section>
        ))
      )}
    </div>
  )
}
