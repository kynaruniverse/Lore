import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useSmoothScroll() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top smoothly on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])
}
