import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { Edit, Calendar, Tag, ArrowLeft, Eye } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import type { Page, Lore } from '../lib/loreStore'

// ── Content section parser ──────────────────────────────────────────────────
interface Section {
  title: string
  content: string
}

function parseContentSections(content: string): { sections: Section[]; preamble: string } {
  const lines    = content.split('\n')
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

  return {
    preamble: preambleLines.join('\n').trim(),
    sections: hasSections ? sections : [],
  }
}

// ── Loading skeleton ────────────────────────────────────────────────────────
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

// ── Main component ──────────────────────────────────────────────────────────
export default function PageView() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const [page, setPage]   = useState<Page | null>(null)
  const [lore, setLore]   = useState<Pick<Lore, 'id' | 'slug' | 'title'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loreSlug || !pageSlug) return
    let cancelled = false

    async function fetchPage() {
      try {
        const { data: loreData, error: le } = await supabase
          .from('lores')
          .select('id, slug, title')
          .eq('slug', loreSlug)
          .single()
        if (le || !loreData) throw le ?? new Error('Lore not found')
        if (!cancelled) setLore(loreData)

        const { data: pageData, error: pe } = await supabase
          .from('pages')
          .select('*')
          .eq('lore_id', loreData.id)
          .eq('slug', pageSlug)
          .single()
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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <div className="h-14 border-b border-[#2A2A2A] bg-[#0F0F0F]" />
        <Skeleton />
      </div>
    )
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!page || !lore) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#E5E5E5] mb-4">Page not found</h1>
          <Link to="/" className="text-[#C4A962] hover:underline">Return home</Link>
        </div>
      </div>
    )
  }

  const { preamble, sections } = parseContentSections(page.content)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Back header — PageView renders its own header since it doesn't use Layout */}
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
          <span className="px-3 py-1 bg-[#C4A962]/10 text-[#C4A962] text-xs font-medium rounded-full border border-[#C4A962]/20">
            {page.category}
          </span>
          {page.tags?.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#1A1A1A] text-[#A0A0A0] text-xs rounded-full border border-[#2A2A2A]">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#E5E5E5] mb-4 leading-tight">
          {page.title}
        </h1>

        {/* Excerpt */}
        {page.excerpt && (
          <p className="text-lg text-[#A0A0A0] border-l-4 border-[#C4A962] pl-4 mb-6 italic">
            {page.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-4 text-xs text-[#505050] pb-6 mb-6 border-b border-[#2A2A2A]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Updated {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {page.views != null && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {page.views.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Featured image */}
        {page.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#2A2A2A]">
            <img src={page.image_url} alt={page.title} className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}

        {/* Preamble (content before first ## heading) */}
        {preamble && (
          <div className="prose prose-invert max-w-none mb-8">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{preamble}</ReactMarkdown>
          </div>
        )}

        {/* Sections */}
        {sections.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, i) => (
              <section
                key={i}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]"
              >
                <h2 className="text-xl font-serif font-semibold text-[#E5E5E5] mb-4 pb-3 border-b border-[#2A2A2A]">
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {section.content.trim()}
                  </ReactMarkdown>
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Fallback: render full content without section parsing
          !preamble && (
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{page.content}</ReactMarkdown>
              </div>
            </div>
          )
        )}
      </article>
    </div>
  )
}
