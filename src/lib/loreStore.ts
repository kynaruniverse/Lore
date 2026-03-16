import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'
import { Database } from './database.types'

export type Lore = Database['public']['Tables']['lores']['Row']
export type Page = Database['public']['Tables']['pages']['Row']
export type Relationship = Database['public']['Tables']['relationships']['Row']

// Hooks for realtime data
export function useLores() {
  const [lores, setLores] = useState<Lore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchLores()
    
    // Subscribe to changes
    const subscription = supabase
      .channel('lores_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lores' }, 
        () => fetchLores()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchLores() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('lores')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setLores(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { lores, loading, error }
}

export function useLore(slug: string) {
  const [lore, setLore] = useState<Lore | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return
    fetchLore()
  }, [slug])

  async function fetchLore() {
    try {
      setLoading(true)
      
      // Fetch lore
      const { data: loreData, error: loreError } = await supabase
        .from('lores')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (loreError) throw loreError
      setLore(loreData)

      // Fetch pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .order('title')
      
      if (pagesError) throw pagesError
      setPages(pagesData || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { lore, pages, loading, error }
}
