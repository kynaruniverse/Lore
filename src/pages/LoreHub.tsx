import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FileText, Users, Eye, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import FloatingCard from '../components/FloatingCard'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
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

  // Group pages by category
  const pagesByCategory = pages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = []
    acc[page.category].push(page)
    return acc
  }, {} as Record<string, Page[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-[#C4A962]">Loading...</div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-[#E5E5E5] mb-4">Lore not found</h1>
          <Link to="/" className="text-[#C4A962]">Return home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Discovery</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={lore.hero_image_url || lore.cover_image_url}
          alt={lore.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryPages.map(page => (
                <FloatingCard
                  key={page.id}
                  id={page.id}
                  title={page.title}
                  description={page.excerpt || page.content.slice(0, 100) + '...'}
                  imageUrl={page.image_url || lore.cover_image_url}
                  slug={`${lore.slug}/${page.slug}`}
                  category={page.category}
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
    </div>
  )
}
