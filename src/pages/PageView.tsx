import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { Edit, Calendar, Tag } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/Layout'

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
  views: number
  created_at: string
  updated_at: string
}

interface Lore {
  id: string
  slug: string
  title: string
}

export default function PageView() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const [page, setPage] = useState<Page | null>(null)
  const [lore, setLore] = useState<Lore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loreSlug && pageSlug) {
      fetchPage()
    }
  }, [loreSlug, pageSlug])

  async function fetchPage() {
    try {
      setLoading(true)
      
      const { data: loreData } = await supabase
        .from('lores')
        .select('id, slug, title')
        .eq('slug', loreSlug)
        .single()

      if (!loreData) return
      setLore(loreData)

      const { data: pageData } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .eq('slug', pageSlug)
        .single()

      if (!pageData) return
      setPage(pageData)
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  // Parse content into sections
  const parseContentIntoSections = (content: string) => {
    const lines = content.split('\n')
    const sections: { title: string; content: string[] }[] = []
    let currentSection: { title: string; content: string[] } | null = null

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentSection) sections.push(currentSection)
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: []
        }
      } else if (currentSection) {
        currentSection.content.push(line)
      }
    })

    if (currentSection) sections.push(currentSection)
    return sections
  }

  if (loading) {
    return (
      <Layout showBackButton backTo={`/lore/${loreSlug}`} backLabel="Back to Lore">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!page || !lore) {
    return (
      <Layout showBackButton backTo="/" backLabel="Home">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Page not found</h1>
        </div>
      </Layout>
    )
  }

  const sections = parseContentIntoSections(page.content)

  return (
    <Layout showBackButton backTo={`/lore/${lore.slug}`} backLabel={`Back to ${lore.title}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#2A2A2A] text-[#C4A962] text-sm rounded-full">
                {page.category}
              </span>
              {page.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#2A2A2A] text-[#A0A0A0] text-sm rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to={`/lore/${lore.slug}/${page.slug}/edit`}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2A2A2A] text-[#E5E5E5] rounded-lg hover:bg-[#333] transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-4">
            {page.title}
          </h1>
          
          {page.excerpt && (
            <p className="text-lg text-[#A0A0A0] border-l-4 border-[#C4A962] pl-4">
              {page.excerpt}
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-[#A0A0A0] mb-8 pb-6 border-b border-[#2A2A2A]">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Updated {new Date(page.updated_at).toLocaleDateString()}
          </span>
        </div>

        {/* Featured image */}
        {page.image_url && (
          <div className="mb-8 rounded-xl overflow-hidden border border-[#2A2A2A]">
            <img 
              src={page.image_url} 
              alt={page.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
              <h2 className="text-2xl font-serif font-semibold text-[#E5E5E5] mb-4 pb-2 border-b border-[#2A2A2A]">
                {section.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                  {section.content.join('\n')}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </Layout>
  )
}
