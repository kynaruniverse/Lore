import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Global keyboard shortcuts:
 *   /  → go to Search
 *   c  → go to Create (without Ctrl/Cmd)
 */
export function useKeyboardNav() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        navigate('/search')
      } else if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        navigate('/create')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}
