import { supabase } from './supabaseClient'
import { useEffect, useState, useRef } from 'react'
import type { Database } from './database.types'

export type Lore         = Database['public']['Tables']['lores']['Row']
export type Page         = Database['public']['Tables']['pages']['Row']
export type Relationship = Database['public']['Tables']['relationships']['Row']

// ── useLores ──────────────────────────────────────────────────────────────────
export function useLores() {
  const [lores, setLores]     = useState<Lore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)
  // Ref so the realtime callback always sees the current cancelled state
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    async function fetchLores() {
      try {
        const { data, error: err } = await supabase
          .from('lores')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
        if (err) throw err
        if (!cancelledRef.current) setLores(data ?? [])
      } catch (err) {
        if (!cancelledRef.current) setError(err as Error)
      } finally {
        if (!cancelledRef.current) setLoading(false)
      }
    }

    fetchLores()

    // Realtime subscription — fetchLores reads cancelledRef so it's always current
    const sub = supabase
      .channel('lores_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lores' }, fetchLores)
      .subscribe()

    return () => {
      cancelledRef.current = true
      sub.unsubscribe()
    }
  }, [])

  return { lores, loading, error }
}

// ── useLore ───────────────────────────────────────────────────────────────────
export function useLore(slug: string) {
  const [lore, setLore]       = useState<Lore | null>(null)
  const [pages, setPages]     = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function fetchLore() {
      try {
        setLoading(true)

        const { data: loreData, error: le } = await supabase
          .from('lores').select('*').eq('slug', slug).single()
        if (le) throw le
        if (!cancelled) setLore(loreData)

        const { data: pagesData, error: pe } = await supabase
          .from('pages').select('*').eq('lore_id', loreData.id).order('title')
        if (pe) throw pe
        if (!cancelled) setPages(pagesData ?? [])
      } catch (err) {
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLore()
    return () => { cancelled = true }
  }, [slug])

  return { lore, pages, loading, error }
}
