import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoreCard3D from './LoreCard3D'

interface Lore {
  id: string
  slug: string
  title: string
  description: string
  cover_image_url: string
  color: string
}

interface LoreScene3DProps {
  lores: Lore[]
}

export default function LoreScene3D({ lores }: LoreScene3DProps) {
  const navigate = useNavigate()
  const [autoRotate, setAutoRotate] = useState(true)

  // Simple circular arrangement
  const radius = 8
  const cards = lores.map((lore, i) => {
    const angle = (i / lores.length) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return {
      ...lore,
      position: [x, 0, z] as [number, number, number]
    }
  })

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-navy to-navy-light dark:from-navy dark:to-navy">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white bg-black/30 backdrop-blur-md rounded-lg p-4">
        <h1 className="text-2xl font-serif font-bold mb-2">Lore Explorer</h1>
        <p className="text-sm text-white/80 mb-4">Click cards to explore</p>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-3 py-1 bg-red text-white rounded-lg text-sm hover:bg-red-light transition-colors"
        >
          {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4361EE" />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Camera controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={30}
          />
          
          {/* Cards */}
          {cards.map((lore, i) => (
            <LoreCard3D
              key={lore.id}
              position={lore.position}
              title={lore.title}
              description={lore.description}
              imageUrl={lore.cover_image_url}
              color={lore.color || '#D32F2F'}
              index={i}
              onClick={() => navigate(`/lore/${lore.slug}`)}
            />
          ))}
          
          {/* Simple ground grid */}
          <gridHelper args={[30, 20, '#4361EE', '#1E3A8A']} position={[0, -1, 0]} />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-white/60 bg-black/30 backdrop-blur-md rounded-lg p-2">
        🖱️ Drag to rotate • Scroll to zoom • Click cards to explore
      </div>
    </div>
  )
}
