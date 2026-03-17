import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { Edit, Calendar, Tag, ArrowLeft, Eye, Home, Search, PlusCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { categoryConfig, completenessCriteria } from '../lib/contentConfig'
import type { PageCategory } from '../lib/contentConfig'
import type { Page, Lore } from '../lib/loreStore'
import RelationshipManager from '../components/RelationshipManager'

// ── Section parser ────────────────────────────────────────────────────────────
interface Section { title: string; content: string }

function parseContentSections(content: string): { sections: Section[]; preamble: string } {
  const lines = content.split('\n')
  const sections: Section[] = []
  let current: Section | null = null
  const preambleLines: string[] = []
  let hasSections = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      hasSections = true
      if (current) sections.push(current)
      current = { title: line.replace(/^##\s+/, '').trim(), content: '' }
    } else if (current) {
      current.content += line + '\n'
    } else {
      preambleLines.push(line)
    }
  }
  if (current) sections.push(current)
  return { preamble: preambleLines.join('\n').trim(), sections: hasSections ? sections : [] }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
      <div className="h-6 bg-[#1A1A1A] rounded w-1/4" />
      <div className="h-12 bg-[#1A1A1A] rounded w-2/3" />
      <div className="h-4 bg-[#1A1A1A] rounded w-full" />
      <div className="h-4 bg-[#1A1A1A] rounded w-5/6" />
      <div className="h-48 bg-[#1A1A1A] rounded-xl" />
    </div>
  )
}

// ── Bottom nav ────────────────────────────────────────────────────────────────
function BottomNav() {
  const navigate     = useNavigate()
  const { loreSlug } = useParams<{ loreSlug: string }>()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-[#2A2A2A]">
      <div className="max-w-sm mx-auto flex items-center justify-around px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-1 px-4 py-1 text-[#606060] hover:text-[#A0A0A0] transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">Home</span>
        </button>
        <button
          onClick={() => navigate('/search')}
          className="flex flex-col items-center gap-1 px-4 py-1 text-[#606060] hover:text-[#A0A0A0] transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">Search</span>
        </button>
        {loreSlug && (
          <button
            onClick={() => navigate(`/lore/${loreSlug}`)}
            className="flex flex-col items-center gap-1 px-4 py-1 text-[#606060] hover:text-[#A0A0A0] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide uppercase">Lore</span>
          </button>
        )}
      </div>
    </nav>
  )
}

// ── Empty content hint ────────────────────────────────────────────────────────
function EmptyContentHint({ category, loreSlug, pageSlug }: {
  category: string; loreSlug: string; pageSlug: string
}) {
  const cfg      = categoryConfig[category as PageCategory]
  const criteria = completenessCriteria[category as PageCategory]

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-dashed border-[#2A2A2A] text-center">
      {cfg && <p className="text-4xl mb-3">{cfg.icon}</p>}
      <h3 className="text-base font-semibold text-[#E5E5E5] mb-2">This page has no content yet</h3>
      {criteria && (
        <div className="mb-4 text-left max-w-xs mx-auto">
          <p className="text-xs text-[#505050] mb-2 text-center">Suggested sections for {category}:</p>
          <ul className="space-y-1">
            {criteria.map(c => (
              <li key={c} className="flex items-center gap-2 text-xs text-[#606060]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A3A3A] shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cfg?.suggestedSections && (
        <p className="text-xs text-[#505050] mb-4">
          Try sections: {cfg.suggestedSections.join(' · ')}
        </p>
      )}
      <Link
        to={`/lore/${loreSlug}/${pageSlug}/edit`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#C4A962] text-[#0F0F0F]
                   rounded-xl text-sm font-semibold hover:bg-[#B89A52] transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add content
      </Link>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PageView() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const [page, setPage]        = useState<Page | null>(null)
  const [lore, setLore]        = useState<Pick<Lore, 'id' | 'slug' | 'title'> | null>(null)
  const [loading, setLoading]  = useState(true)

  useEffect(() => {
    if (!loreSlug || !pageSlug) return
    let cancelled = false

    async function fetchPage() {
      try {
        const { data: loreData, error: le } = await supabase
          .from('lores').select('id, slug, title').eq('slug', loreSlug).single()
        if (le || !loreData) throw le ?? new Error('Lore not found')
        if (!cancelled) setLore(loreData)

        const { data: pageData, error: pe } = await supabase
          .from('pages').select('*').eq('lore_id', loreData.id).eq('slug', pageSlug).single()
        if (pe || !pageData) throw pe ?? new Error('Page not found')
        if (!cancelled) setPage(pageData)
      } catch (err) {
        console.error('Error fetching page:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPage()
    return () => { cancelled = true }
  }, [loreSlug, pageSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <div className="h-14 border-b border-[#2A2A2A] bg-[#0F0F0F]" />
        <Skeleton />
        <BottomNav />
      </div>
    )
  }

  if (!page || !lore) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Page not found</h1>
          <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const cfg                    = categoryConfig[page.category as PageCategory]
  const { preamble, sections } = parseContentSections(page.content)
  const hasContent             = !!(preamble || sections.length > 0 || page.content.trim())

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to={`/lore/${lore.slug}`}
            className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{lore.title}</span>
          </Link>
          <Link
            to={`/lore/${lore.slug}/${page.slug}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A0A0A0]
                       bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg
                       hover:text-[#E5E5E5] hover:border-[#3A3A3A] transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28">
        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#C4A962]/10 text-[#C4A962] text-xs font-medium rounded-full border border-[#C4A962]/20">
            {cfg && <span className="leading-none">{cfg.icon}</span>}
            {page.category}
          </span>
          {page.tags?.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#1A1A1A] text-[#A0A0A0] text-xs rounded-full border border-[#2A2A2A]">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-4 leading-tight">
          {page.title}
        </h1>

        {page.excerpt && (
          <p className="text-lg text-[#A0A0A0] border-l-4 border-[#C4A962] pl-4 mb-6 italic">
            {page.excerpt}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-4 text-xs text-[#505050] pb-6 mb-6 border-b border-[#2A2A2A]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Updated {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {!!page.views && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {page.views.toLocaleString()} views
            </span>
          )}
        </div>

        {page.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#2A2A2A]">
            <img src={page.image_url} alt={page.title} className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}

        {/* Content or empty state */}
        {!hasContent ? (
          <EmptyContentHint category={page.category} loreSlug={lore.slug} pageSlug={page.slug} />
        ) : (
          <>
            {preamble && (
              <div className="prose max-w-none mb-8">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{preamble}</ReactMarkdown>
              </div>
            )}
            {sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map((section, i) => (
                  <section key={i} className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
                    <h2 className="text-xl font-serif font-semibold text-[#E5E5E5] mb-4 pb-3 border-b border-[#2A2A2A]">
                      {section.title}
                    </h2>
                    <div className="prose max-w-none">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{section.content.trim()}</ReactMarkdown>
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              !preamble && (
                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
                  <div className="prose max-w-none">
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{page.content}</ReactMarkdown>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {/* Relationship manager — collapsible section below content */}
        <RelationshipManager
          pageId={page.id}
          loreId={lore.id}
          loreSlug={lore.slug}
        />
      </article>

      <BottomNav />
    </div>
  )
}
