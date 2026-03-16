import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { Edit, Eye, Calendar, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { ContentSection, ContentBox, ContentGrid, KnowledgeGapCard } from '../components/PageLayout'
import { categoryConfig } from '../lib/contentConfig'

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

interface Lore {
  id: string
  slug: string
  title: string
  cover_image_url: string
}

interface RelatedPage {
  id: string
  title: string
  slug: string
  category: string
}

interface Relationship {
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
      
      const { data: loreData, error: loreError } = await supabase
        .from('lores')
        .select('id, slug, title, cover_image_url')
        .eq('slug', loreSlug)
        .single()

      if (loreError) throw loreError
      if (!loreData) return
      setLore(loreData)

      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .eq('slug', pageSlug)
        .single()

      if (pageError) throw pageError
      if (!pageData) return
      setPage(pageData)

      await supabase
        .from('pages')
        .update({ views: (pageData.views || 0) + 1 })
        .eq('id', pageData.id)

      const { data: relData, error: relError } = await supabase
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

      if (relError) throw relError
      
      if (relData) {
        const formattedRelationships = relData.map((rel: any) => ({
          ...rel,
          target_page: Array.isArray(rel.target_page) ? rel.target_page[0] : rel.target_page
        }))
        setRelationships(formattedRelationships)
      }
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  // Parse markdown content into sections
  const parseContentIntoSections = (content: string) => {
    const lines = content.split('\n')
    const sections: { title: string; content: string[] }[] = []
    let currentSection: { title: string; content: string[] } | null = null

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: []
        }
      } else if (currentSection) {
        currentSection.content.push(line)
      }
    })

    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-border rounded w-32"></div>
          <div className="h-12 bg-border rounded w-3/4"></div>
          <div className="h-64 bg-border rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-border rounded w-full"></div>
            <div className="h-4 bg-border rounded w-full"></div>
            <div className="h-4 bg-border rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!page || !lore) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <Link to={`/lore/${loreSlug}`} className="text-primary hover:underline">
          Back to Lore
        </Link>
      </div>
    )
  }

  const sections = parseContentIntoSections(page.content)
  const categoryInfo = categoryConfig[page.category as keyof typeof categoryConfig] || categoryConfig.Other

  return (
    <div className="container max-w-5xl py-4 md:py-6">
      {/* Breadcrumb */}
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
          <span className="text-foreground font-medium">{page.title}</span>
        </div>
        
        <Link
          to={`/lore/${lore.slug}/${page.slug}/edit`}
          className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm hover:border-primary/40 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span 
            className="px-2 py-1 text-xs rounded-full"
            style={{ 
              backgroundColor: `${categoryInfo.color}20`,
              color: categoryInfo.color 
            }}
          >
            <span className="mr-1">{categoryInfo.icon}</span>
            {page.category}
          </span>
          {page.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
          {page.title}
        </h1>
        
        {page.excerpt && (
          <p className="text-lg md:text-xl text-muted-foreground italic border-l-4 border-primary pl-4">
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

      {/* Main content with beautiful sections */}
      <div className="mb-12 space-y-8">
        {sections.map((section, index) => (
          <ContentSection key={index} title={section.title}>
            <ReactMarkdown 
              rehypePlugins={[rehypeSanitize]}
              components={{
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                em: ({node, ...props}) => <em className="italic text-muted-foreground" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
                ),
              }}
            >
              {section.content.join('\n')}
            </ReactMarkdown>
          </ContentSection>
        ))}
      </div>

      {/* Knowledge gaps - cleaner design */}
      <KnowledgeGapCard 
        missingFields={page.missing_fields} 
        completeness={page.completeness}
        className="mb-8"
      />

      {/* Relationships - as cards */}
      {relationships.length > 0 && (
        <div className="border-t border-border pt-8">
          <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6">Relationships</h2>
          
          <ContentGrid cols={2} gap="md">
            {relationships.map((rel, i) => (
              <Link
                key={i}
                to={`/lore/${lore.slug}/${rel.target_page.slug}`}
                className="group"
              >
                <ContentBox variant="compact" className="hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-8 bg-primary rounded-full mt-1" />
                    <div className="flex-1">
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
                </ContentBox>
              </Link>
            ))}
          </ContentGrid>
        </div>
      )}
    </div>
  )
}
