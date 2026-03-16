import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
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

  // Arrange cards in a circle
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
    <div className="relative w-full h-screen bg-black">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white bg-black/50 backdrop-blur-sm rounded-lg p-4">
        <h1 className="text-2xl font-serif font-bold mb-2">Lore Explorer</h1>
        <p className="text-sm text-gray-300 mb-4">Click cards to explore</p>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
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
              color={lore.color || '#C4622D'}
              index={i}
              onClick={() => navigate(`/lore/${lore.slug}`)}
            />
          ))}
          
          {/* Ground grid */}
          <gridHelper args={[30, 20, '#666', '#333']} position={[0, -1, 0]} />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-gray-400 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        🖱️ Drag to rotate • Scroll to zoom • Click cards to explore
      </div>
    </div>
  )
}
