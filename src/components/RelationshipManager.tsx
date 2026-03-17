import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GitBranch, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from './Toast'
import { categoryConfig } from '../lib/contentConfig'
import type { PageCategory } from '../lib/contentConfig'

interface RelatedPage {
  id:       string
  title:    string
  slug:     string
  category: string
}

interface Relationship {
  source_page_id: string
  target_page_id: string
  type:           string
  label:          string | null
  page:           RelatedPage
}

const RELATIONSHIP_TYPES = [
  'ally_of', 'enemy_of', 'located_in', 'part_of',
  'created_by', 'related_to', 'parent_of', 'child_of',
] as const

interface Props {
  pageId:   string
  loreId:   string
  loreSlug: string
}

export default function RelationshipManager({ pageId, loreId, loreSlug }: Props) {
  const { showToast }           = useToast()
  const [open, setOpen]         = useState(false)
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [allPages, setAllPages] = useState<RelatedPage[]>([])
  const [loading, setLoading]   = useState(false)
  const [adding, setAdding]     = useState(false)

  const [form, setForm] = useState({
    target_page_id: '',
    type:           'related_to',
    label:          '',
  })

  const fetchRelationships = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('relationships')
        .select('source_page_id, target_page_id, type, label')
        .eq('source_page_id', pageId)

      if (error) throw error

      if (!data?.length) { setRelationships([]); return }

      // Fetch the target pages in one query
      const targetIds = data.map(r => r.target_page_id)
      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug, category')
        .in('id', targetIds)

      const pageMap = Object.fromEntries((pages ?? []).map(p => [p.id, p]))

      setRelationships(
        data
          .filter(r => pageMap[r.target_page_id])
          .map(r => ({ ...r, page: pageMap[r.target_page_id] }))
      )
    } catch (err) {
      console.error('Error fetching relationships:', err)
    } finally {
      setLoading(false)
    }
  }, [pageId])

  // Fetch all pages in this lore for the target selector
  useEffect(() => {
    if (!open) return
    let cancelled = false

    async function fetchPages() {
      const { data } = await supabase
        .from('pages')
        .select('id, title, slug, category')
        .eq('lore_id', loreId)
        .neq('id', pageId)  // exclude self
        .order('title')

      if (!cancelled) setAllPages(data ?? [])
    }

    fetchPages()
    fetchRelationships()
    return () => { cancelled = true }
  }, [open, loreId, pageId, fetchRelationships])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.target_page_id) {
      showToast('Please select a target page', 'error')
      return
    }

    setAdding(true)
    try {
      const { error } = await supabase
        .from('relationships')
        .upsert({
          source_page_id: pageId,
          target_page_id: form.target_page_id,
          type:           form.type,
          label:          form.label.trim() || null,
        }, { onConflict: 'source_page_id,target_page_id' })

      if (error) throw error
      showToast('Relationship added', 'success')
      setForm({ target_page_id: '', type: 'related_to', label: '' })
      await fetchRelationships()
    } catch (err) {
      console.error('Error adding relationship:', err)
      showToast('Failed to add relationship', 'error')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(targetId: string) {
    try {
      const { error } = await supabase
        .from('relationships')
        .delete()
        .eq('source_page_id', pageId)
        .eq('target_page_id', targetId)

      if (error) throw error
      showToast('Relationship removed', 'info')
      setRelationships(prev => prev.filter(r => r.target_page_id !== targetId))
    } catch (err) {
      console.error('Error deleting relationship:', err)
      showToast('Failed to remove relationship', 'error')
    }
  }

  const inputCls =
    'w-full px-3 py-2 bg-[#111] border border-[#2A2A2A] rounded-lg text-[#E5E5E5] text-sm ' +
    'placeholder-[#404040] focus:outline-none focus:border-[#C4A962] transition-colors'

  return (
    <div className="mt-8 border border-[#2A2A2A] rounded-2xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#1A1A1A] hover:bg-[#1E1E1E] transition-colors"
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#C4A962]" />
          <span className="text-sm font-semibold text-[#E5E5E5]">Relationships</span>
          {relationships.length > 0 && (
            <span className="text-xs bg-[#C4A962]/10 text-[#C4A962] px-2 py-0.5 rounded-full border border-[#C4A962]/20">
              {relationships.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#606060]" /> : <ChevronDown className="w-4 h-4 text-[#606060]" />}
      </button>

      {open && (
        <div className="p-5 space-y-5 bg-[#111]">
          {/* Existing relationships */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-12 bg-[#1A1A1A] rounded-xl animate-pulse" />)}
            </div>
          ) : relationships.length > 0 ? (
            <div className="space-y-2">
              {relationships.map(rel => {
                const cfg = categoryConfig[rel.page.category as PageCategory]
                return (
                  <div
                    key={rel.target_page_id}
                    className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl group"
                  >
                    {cfg && <span className="text-sm leading-none shrink-0">{cfg.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/lore/${loreSlug}/${rel.page.slug}`}
                        className="text-sm font-medium text-[#E5E5E5] hover:text-[#C4A962] transition-colors truncate block"
                      >
                        {rel.page.title}
                      </Link>
                      <p className="text-xs text-[#505050]">
                        {rel.label && <span className="text-[#A0A0A0] mr-1">{rel.label} ·</span>}
                        {rel.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(rel.target_page_id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#505050] hover:text-red-400
                                 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-[#505050] text-center py-3">No relationships yet</p>
          )}

          {/* Add relationship form */}
          <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-[#2A2A2A]">
            <p className="text-xs font-semibold text-[#606060] uppercase tracking-widest">
              Add Relationship
            </p>

            <select
              value={form.target_page_id}
              onChange={e => setForm(f => ({ ...f, target_page_id: e.target.value }))}
              className={inputCls}
            >
              <option value="">Select a page…</option>
              {allPages.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.category})
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className={inputCls}
              >
                {RELATIONSHIP_TYPES.map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>

              <input
                type="text"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Label (optional)"
                className={inputCls}
              />
            </div>

            <button
              type="submit" disabled={adding || !form.target_page_id}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C4A962] text-[#0F0F0F]
                         rounded-xl text-sm font-semibold hover:bg-[#B89A52] active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {adding ? 'Adding…' : 'Add Relationship'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
