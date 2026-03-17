import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FileText, Users, Eye, ArrowLeft, GitBranch, PlusCircle, Settings } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { categoryConfig } from '../lib/contentConfig'
import type { Lore, Page } from '../lib/loreStore'
import type { PageCategory } from '../lib/contentConfig'

function PageCard({ page, loreSlug, coverFallback }: {
  page: Page; loreSlug: string; coverFallback: string
}) {
  const cfg      = categoryConfig[page.category as PageCategory]
  const colorCls = 'bg-[#C4A962]/10 text-[#C4A962] border-[#C4A962]/20'

  return (
    <Link
      to={`/lore/${loreSlug}/${page.slug}`}
      className="group flex gap-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#C4A962]/30 transition-all"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#111]">
        <img
          src={page.image_url ?? coverFallback}
          alt={page.title}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.src = coverFallback }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {cfg && <span className="text-xs leading-none">{cfg.icon}</span>}
          <span className={`text-xs px-2 py-0.5 rounded-full border ${colorCls}`}>{page.category}</span>
        </div>
        <h3 className="font-semibold text-[#E5E5E5] group-hover:text-[#C4A962] transition-colors truncate">
          {page.title}
        </h3>
        {page.excerpt && (
          <p className="text-xs text-[#606060] line-clamp-1 mt-0.5">{page.excerpt}</p>
        )}
      </div>
    </Link>
  )
}

export default function LoreHub() {
  const { loreSlug }  = useParams<{ loreSlug: string }>()
  const navigate       = useNavigate()
  const [lore, setLore]             = useState<Lore | null>(null)
  const [pages, setPages]           = useState<Page[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  useEffect(() => { setActiveCategory('All') }, [loreSlug])

  useEffect(() => {
    if (!loreSlug) return
    let cancelled = false

    async function fetchLoreAndPages() {
      try {
        const { data: loreData, error: le } = await supabase
          .from('lores').select('*').eq('slug', loreSlug).single()
        if (le || !loreData) throw le ?? new Error('Not found')
        if (!cancelled) setLore(loreData)

        const { data: pagesData, error: pe } = await supabase
          .from('pages').select('*').eq('lore_id', loreData.id).order('title')
        if (pe) throw pe
        if (!cancelled) setPages(pagesData ?? [])
      } catch (err) {
        console.error('Error fetching lore:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLoreAndPages()
    return () => { cancelled = true }
  }, [loreSlug])

  const categories = ['All', ...Array.from(new Set(pages.map(p => p.category))).sort()]
  const filtered   = activeCategory === 'All' ? pages : pages.filter(p => p.category === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <div className="h-64 bg-[#1A1A1A] animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Lore not found</h1>
          <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
        </div>
      </div>
    )
  }

  const coverImg = lore.hero_image_url || lore.cover_image_url

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Discovery</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Edit lore settings */}
            <button
              onClick={() => navigate(`/lore/${loreSlug}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A0A0A0]
                         bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#3A3A3A]
                         hover:text-[#E5E5E5] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" /> Edit Lore
            </button>
            <button
              onClick={() => navigate(`/lore/${loreSlug}/graph`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A0A0A0]
                         bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#C4A962]/40
                         hover:text-[#C4A962] transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" /> Graph
            </button>
            <button
              onClick={() => navigate(`/lore/${loreSlug}/create-page`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#0F0F0F]
                         bg-[#C4A962] rounded-lg hover:bg-[#B89A52] transition-colors font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Page
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={coverImg} alt={lore.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#E5E5E5] mb-1">{lore.title}</h1>
            <p className="text-sm text-[#A0A0A0] max-w-xl line-clamp-2">{lore.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-sm text-[#606060]">
            <FileText className="w-4 h-4" />
            <span className="text-[#E5E5E5] font-semibold">{lore.page_count ?? pages.length}</span> pages
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#606060]">
            <Users className="w-4 h-4" />
            <span className="text-[#E5E5E5] font-semibold">{lore.contributor_count ?? 0}</span> contributors
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[#606060]">
            <Eye className="w-4 h-4" />
            <span className="text-[#E5E5E5] font-semibold">{(lore.views ?? 0).toLocaleString()}</span> views
          </span>
        </div>
      </div>

      {/* Category filter pills */}
      {categories.length > 2 && (
        <div className="border-b border-[#2A2A2A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
            {categories.map(cat => {
              const cfg    = cat !== 'All' ? categoryConfig[cat as PageCategory] : null
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-[#C4A962] text-[#0F0F0F] border-[#C4A962] font-semibold'
                      : 'bg-[#1A1A1A] text-[#A0A0A0] border-[#2A2A2A] hover:border-[#3A3A3A]'
                  }`}
                >
                  {cfg && <span className="text-xs leading-none">{cfg.icon}</span>}
                  {cat}
                  {cat !== 'All' && (
                    <span className="opacity-60">{pages.filter(p => p.category === cat).length}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Pages list */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#505050] mb-4">No pages yet.</p>
            <Link
              to={`/lore/${loreSlug}/create-page`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C4A962] text-[#0F0F0F]
                         rounded-xl font-semibold hover:bg-[#B89A52] transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Create first page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(page => (
              <PageCard key={page.id} page={page} loreSlug={loreSlug!} coverFallback={lore.cover_image_url} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
