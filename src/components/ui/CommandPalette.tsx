import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Flame, FileText, Home, PlusCircle, Command } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<CommandItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  // Toggle command palette with ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Fetch dynamic items (lores, pages) when search changes
  useEffect(() => {
    if (!open) return

    const fetchItems = async () => {
      const baseItems: CommandItem[] = [
        {
          id: 'home',
          title: 'Home',
          icon: <Home className="w-4 h-4" />,
          action: () => {
            setOpen(false)
            navigate('/')
          },
          shortcut: 'H'
        },
        {
          id: 'create',
          title: 'Create Lore',
          description: 'Start a new knowledge space',
          icon: <PlusCircle className="w-4 h-4" />,
          action: () => {
            setOpen(false)
            navigate('/create')
          },
          shortcut: 'C'
        },
        {
          id: 'search',
          title: 'Search',
          description: 'Search all content',
          icon: <Search className="w-4 h-4" />,
          action: () => {
            setOpen(false)
            navigate('/search')
          },
          shortcut: '/'
        }
      ]

      if (search.length > 1) {
        const [lores, pages] = await Promise.all([
          supabase
            .from('lores')
            .select('id, title, slug')
            .ilike('title', `%${search}%`)
            .limit(5),
          (supabase
            .from('pages')
            .select('id, title, slug, lore_id, lores:lores!inner(slug)')
            .ilike('title', `%${search}%`)
            .limit(5) as any) as Promise<{ data: any[] | null }>
        ])

        const loreItems: CommandItem[] = (lores.data || []).map(lore => ({
          id: `lore-${lore.id}`,
          title: lore.title,
          description: 'Lore',
          icon: <Flame className="w-4 h-4" />,
          action: () => {
            setOpen(false)
            navigate(`/lore/${lore.slug}`)
          }
        }))

        const pageItems: CommandItem[] = (pages.data || []).map(page => ({
          id: `page-${page.id}`,
          title: page.title,
          description: `Page in ${page.lores?.slug}`,
          icon: <FileText className="w-4 h-4" />,
          action: () => {
            setOpen(false)
            navigate(`/lore/${page.lores?.slug}/${page.slug}`)
          }
        }))

        setItems([...baseItems, ...loreItems, ...pageItems])
      } else {
        setItems(baseItems)
      }
    }

    fetchItems()
  }, [search, open, navigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, items.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          items[selectedIndex]?.action()
          break
        case 'Escape':
          setOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, items, selectedIndex])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />
      
      {/* Command palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center border-b border-border">
            <Search className="w-5 h-5 ml-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              placeholder="Search or jump to..."
              className="w-full px-4 py-4 bg-transparent focus:outline-none"
              autoFocus
            />
            <div className="mr-4 flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded">esc</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No results found
              </div>
            ) : (
              items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                    transition-colors
                    ${index === selectedIndex ? 'bg-primary/20' : 'hover:bg-accent'}
                  `}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="text-primary">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
