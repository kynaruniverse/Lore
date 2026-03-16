import { useState, useEffect } from 'react'
import { Command } from 'lucide-react'

const shortcuts = [
  { key: '⌘K', description: 'Open command palette' },
  { key: '/', description: 'Focus search' },
  { key: 'C', description: 'Create new lore' },
  { key: 'ESC', description: 'Close modals' },
  { key: '?', description: 'Show this help' },
]

export function KeyboardHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.target) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold">Keyboard Shortcuts</h2>
            <Command className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{description}</span>
                <kbd className="px-3 py-1.5 bg-muted rounded-lg text-sm font-mono">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setOpen(false)}
            className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
