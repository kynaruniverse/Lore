import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardNav() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case '/':
          e.preventDefault()
          navigate('/search')
          break
        case 'c':
          if (e.ctrlKey || e.metaKey) return
          e.preventDefault()
          navigate('/create')
          break
        case 'Escape':
          // Handle escape - could close modals, etc.
          break
        case '?':
          e.preventDefault()
          // Show keyboard shortcuts help
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}
