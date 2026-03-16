import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to the top of the page on every route change. */
export function useSmoothScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
}
