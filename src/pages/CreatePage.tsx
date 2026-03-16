import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/ui/Toast'

type Lore = {
  id: string
  title: string
  slug: string
}

export default function CreatePage() {
  const { loreSlug } = useParams<{ loreSlug: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [lore, setLore] = useState<Lore | null>(null)
  const [existingPages, setExistingPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loreSlug) {
      fetchLore()
    }
  }, [loreSlug])

  async function fetchLore() {
    try {
      const { data: loreData } = await supabase
        .from('lores')
        .select('id, title, slug')
        .eq('slug', loreSlug || '')
        .single()

      if (loreData) {
        setLore(loreData)

        const { data: pages } = await supabase
          .from('pages')
          .select('id, title, slug')
          .eq('lore_id', loreData.id)

        setExistingPages(pages || [])
      }
    } catch (error) {
      console.error('Error fetching lore:', error)
      showToast('Failed to load lore', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (slug: string) => {
    showToast('Page created successfully!', 'success')
    setTimeout(() => navigate(`/lore/${loreSlug}/${slug}`), 1000)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!lore) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Lore not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          to={`/lore/${lore.slug}`} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {lore.title}
        </Link>
        
        <h1 className="text-3xl font-serif font-bold">Add a Page</h1>
        <p className="text-muted-foreground mt-1">
          Create a new page in {lore.title}
        </p>
      </div>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        existingPages={existingPages}
        onSuccess={handleSuccess}
        showToast={showToast}
      />
    </div>
  )
}
