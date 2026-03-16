import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'

export default function CreatePage() {
  const { loreSlug } = useParams()
  const navigate = useNavigate()
  const [lore, setLore] = useState<any>(null)
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
        .eq('slug', loreSlug)
        .single()

      setLore(loreData)
    } catch (error) {
      console.error('Error fetching lore:', error)
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

  if (!lore) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-[#E5E5E5] mb-4">Lore not found</h1>
        <Link to="/" className="text-[#C4A962]">Return home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to={`/lore/${lore.slug}`} 
          className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {lore.title}
        </Link>
        
        <h1 className="text-3xl font-serif font-bold text-[#E5E5E5]">Add a Page</h1>
        <p className="text-[#A0A0A0] mt-1">Create a new page in {lore.title}</p>
      </div>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        onSuccess={handleSuccess}
        showToast={showToast}
      />
    </div>
  )
}
