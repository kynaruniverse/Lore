import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { ArrowLeft, Edit, Eye, Calendar, Tag, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

type Page = {
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

type Lore = {
  id: string
  slug: string
  title: string
  cover_image_url: string
}

type RelatedPage = {
  id: string
  title: string
  slug: string
  category: string
}

type Relationship = {
  source_page_id: string
  target_page_id: string
  type: string
  label: string | null
  target_page: RelatedPage
}

export default function PageView() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const [page, setPage] = useState<Page | null>(null)
  const [lore, setLore] = useState<Lore | null>(null)
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loreSlug && pageSlug) {
      fetchPage()
    }
  }, [loreSlug, pageSlug])

  async function fetchPage() {
    try {
      setLoading(true)
      
      // Fetch lore first
      const { data: loreData } = await supabase
        .from('lores')
        .select('id, slug, title, cover_image_url')
        .eq('slug', loreSlug)
        .single()
      
      if (!loreData) return
      setLore(loreData)

      // Fetch page
      const { data: pageData } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .eq('slug', pageSlug)
        .single()
      
      if (!pageData) return
      setPage(pageData)

      // Increment view count
      await supabase
        .from('pages')
        .update({ views: (pageData.views || 0) + 1 })
        .eq('id', pageData.id)

      // Fetch relationships with target page details
      const { data: relData } = await supabase
        .from('relationships')
        .select(`
          source_page_id,
          target_page_id,
          type,
          label,
          target_page:pages!relationships_target_page_id_fkey (
            id,
            title,
            slug,
            category
          )
        `)
        .eq('source_page_id', pageData.id)

      if (relData) {
        setRelationships(relData as Relationship[])
      }
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading page...</div>
      </div>
    )
  }

  if (!page || !lore) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <Link to={`/lore/${loreSlug}`} className="text-primary hover:underline">
          Back to Lore
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb and Edit */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/lore/${lore.slug}`} className="text-muted-foreground hover:text-foreground">
            {lore.title}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{page.title}</span>
        </div>
        
        <Link
          to={`/lore/${lore.slug}/${page.slug}/edit`}
          className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
            {page.category}
          </span>
          {page.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          {page.title}
        </h1>
        
        {page.excerpt && (
          <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4">
            {page.excerpt}
          </p>
        )}
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {page.views || 0} views
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Updated {new Date(page.updated_at).toLocaleDateString()}
        </span>
      </div>

      {/* Featured image */}
      {page.image_url && (
        <div className="mb-8 rounded-xl overflow-hidden border border-border">
          <img 
            src={page.image_url} 
            alt={page.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Main content */}
      <div className="prose prose-invert max-w-none mb-12">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {page.content}
        </ReactMarkdown>
      </div>

      {/* Knowledge gaps */}
      {page.missing_fields && page.missing_fields.length > 0 && (
        <div className="mb-8 border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Knowledge Gaps</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {page.completeness}% complete
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            This page is missing the following information:
          </p>
          
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {page.missing_fields.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Relationships */}
      {relationships.length > 0 && (
        <div className="border-t border-border pt-8">
          <h2 className="text-xl font-serif font-semibold mb-4">Relationships</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationships.map((rel, i) => (
              <Link
                key={i}
                to={`/lore/${lore.slug}/${rel.target_page.slug}`}
                className="lore-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 mt-2 rounded-full bg-primary" />
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {rel.target_page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rel.label || rel.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rel.target_page.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
