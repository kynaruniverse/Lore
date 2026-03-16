import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import PageForm from '../components/PageForm'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/ui/Toast'

export default function EditPage() {
  const { loreSlug, pageSlug } = useParams<{ loreSlug: string; pageSlug: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [lore, setLore] = useState<any>(null)
  const [page, setPage] = useState<any>(null)
  const [existingPages, setExistingPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

      const { data: relData } = await supabase
        .from('relationships')
        .select('target_page_id, type, label')
        .eq('source_page_id', pageData.id)

      if (relData) {
        setPage({
          ...pageData,
          relationships: relData
        })
      }

      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug')
        .eq('lore_id', loreData.id)
        .neq('id', pageData.id)

      setExistingPages(pages || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Failed to load page', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!page || !lore) return

    try {
      await supabase
        .from('relationships')
        .delete()
        .eq('source_page_id', page.id)

      await supabase
        .from('relationships')
        .delete()
        .eq('target_page_id', page.id)

      await supabase
        .from('pages')
        .delete()
        .eq('id', page.id)

      showToast('Page deleted successfully', 'success')
      setTimeout(() => navigate(`/lore/${lore.slug}`), 1000)
    } catch (error) {
      console.error('Error deleting page:', error)
      showToast('Failed to delete page', 'error')
    }
  }

  const handleSuccess = (slug: string) => {
    showToast('Page updated successfully!', 'success')
    setTimeout(() => navigate(`/lore/${loreSlug}/${slug}`), 1000)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!lore || !page) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/lore/${lore.slug}/${page.slug}`} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {page.title}
          </Link>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Are you sure?</span>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm bg-destructive text-white rounded-lg hover:opacity-90"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-serif font-bold">Edit Page</h1>
        <p className="text-muted-foreground mt-1">
          Editing {page.title} in {lore.title}
        </p>
      </div>

      <PageForm
        loreId={lore.id}
        loreSlug={lore.slug}
        initialData={page}
        existingPages={existingPages}
        isEditing={true}
        onSuccess={handleSuccess}
        showToast={showToast}
      />
    </div>
  )
}
