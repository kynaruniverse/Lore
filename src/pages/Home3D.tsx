import { useNavigate } from 'react-router-dom'

/**
 * Home3D is currently a placeholder.
 * 
 * The original file imported `../components/3d/LoreScene3D` which does not
 * exist in the codebase. To implement the 3D view, install:
 *   pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing @types/three
 * Then create src/components/3d/LoreScene3D.tsx using @react-three/fiber.
 *
 * For now this route redirects to the standard 2D home.
 */
export default function Home3D() {
  const navigate = useNavigate()

  // Immediately redirect — the route is registered but the feature isn't ready
  if (typeof window !== 'undefined') {
    navigate('/', { replace: true })
  }

  return null
}
