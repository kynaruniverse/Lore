import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FileText, Users, Eye } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/Layout'
import FlipCard from '../components/FlipCard'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
  category: string
  cover_image_url: string
  hero_image_url: string
  page_count: number
  contributor_count: number
  views: number
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
      
      const { data: loreData } = await supabase
        .from('lores')
        .select('*')
        .eq('slug', loreSlug)
        .single()

      if (!loreData) return
      setLore(loreData)

      const { data: pagesData } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .order('category')

      setPages(pagesData || [])
    } catch (error) {
      console.error('Error fetching lore:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout showBackButton backTo="/" backLabel="Home">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!lore) {
    return (
      <Layout showBackButton backTo="/" backLabel="Home">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl text-[#E5E5E5] mb-4">Lore not found</h1>
        </div>
      </Layout>
    )
  }

  // Group pages by category
  const pagesByCategory = pages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = []
    acc[page.category].push(page)
    return acc
  }, {} as Record<string, Page[]>)

  return (
    <Layout showBackButton backTo="/" backLabel="Home">
      {/* Hero section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={lore.hero_image_url || lore.cover_image_url}
          alt={lore.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-2">
              {lore.title}
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl">
              {lore.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <div className="text-center">
            <FileText className="w-6 h-6 text-[#C4A962] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#E5E5E5]">{lore.page_count || pages.length}</div>
            <div className="text-sm text-[#A0A0A0]">Pages</div>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 text-[#C4A962] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#E5E5E5]">{lore.contributor_count}</div>
            <div className="text-sm text-[#A0A0A0]">Contributors</div>
          </div>
          <div className="text-center">
            <Eye className="w-6 h-6 text-[#C4A962] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#E5E5E5]">{lore.views?.toLocaleString() || 0}</div>
            <div className="text-sm text-[#A0A0A0]">Views</div>
          </div>
        </div>

        {/* Pages by category */}
        {Object.entries(pagesByCategory).map(([category, categoryPages]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-[#E5E5E5] mb-6">
              {category}
              <span className="text-sm text-[#A0A0A0] ml-2">({categoryPages.length})</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryPages.map(page => (
                <FlipCard
                  key={page.id}
                  id={page.id}
                  title={page.title}
                  imageUrl={page.image_url || lore.cover_image_url}
                  description={page.excerpt || page.content.slice(0, 100) + '...'}
                  loreSlug={lore.slug}
                  pageSlug={page.slug}
                  type="page"
                  category={page.category}
                  tags={page.tags}
                  onClick={() => window.location.href = `/lore/${lore.slug}/${page.slug}`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Create page button */}
        <div className="text-center mt-8">
          <Link
            to={`/lore/${lore.slug}/create-page`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4A962] text-[#0F0F0F] rounded-xl font-medium hover:bg-[#B89A52] transition-colors"
          >
            + Add New Page
          </Link>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </Layout>
  )
}
