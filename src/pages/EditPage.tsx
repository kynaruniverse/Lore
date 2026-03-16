import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'

export default function EditPage() {
  const { loreSlug, pageSlug } = useParams()
  const navigate = useNavigate()
  const [lore, setLore] = useState<any>(null)
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loreSlug && pageSlug) {
      fetchData()
    }
  }, [loreSlug, pageSlug])

  async function fetchData() {
    try {
      const { data: loreData } = await supabase
        .from('lores')
        .select('id, title, slug')
        .eq('slug', loreSlug)
        .single()

      if (!loreData) return
      setLore(loreData)

      const { data: pageData } = await supabase
        .from('pages')
        .select('*')
        .eq('lore_id', loreData.id)
        .eq('slug', pageSlug)
        .single()

      if (!pageData) return
      setPage(pageData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (slug: string) => {
    navigate(`/lore/${loreSlug}/${slug}`)
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    alert(message)
  }

  if (loading) {
    return <div className="text-center py-12 text-[#E5E5E5]">Loading...</div>
  }

  if (!lore || !page) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-[#E5E5E5] mb-4">Page not found</h1>
        <Link to="/" className="text-[#C4A962]">Return home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to={`/lore/${lore.slug}/${page.slug}`} 
          className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {page.title}
        </Link>
        
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5]">Edit Page</h1>
        <p className="text-[#A0A0A0] mt-1">Editing {page.title} in {lore.title}</p>
      </div>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        initialData={page}
        isEditing={true}
        onSuccess={handleSuccess}
        showToast={showToast}
      />
    </div>
  )
}
