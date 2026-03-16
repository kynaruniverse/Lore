import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'

export type Lore = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  cover_image_url: string
  hero_image_url: string
  color: string
  page_count: number
  contributor_count: number
  is_public: boolean
  tags: string[]
  views: number
  trending: boolean
  created_at: string
  updated_at: string
}

export type Page = {
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

export type Relationship = {
  source_page_id: string
  target_page_id: string
  type: string
  label: string | null
}

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
