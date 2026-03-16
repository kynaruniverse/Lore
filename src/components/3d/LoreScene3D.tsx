import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Float, Sparkles, Text } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { Suspense, useState, useMemo } from 'react'
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
  const [layout, setLayout] = useState<'circle' | 'grid' | 'spiral'>('circle')

  // Arrange cards based on layout
  const cards = useMemo(() => {
    const radius = 8
    return lores.map((lore, i) => {
      let position: [number, number, number] = [0, 0, 0]
      
      if (layout === 'circle') {
        const angle = (i / lores.length) * Math.PI * 2
        position = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      } else if (layout === 'grid') {
        const cols = Math.ceil(Math.sqrt(lores.length))
        const x = (i % cols) * 4 - (cols * 2)
        const z = Math.floor(i / cols) * 4 - (cols * 2)
        position = [x, 0, z]
      } else if (layout === 'spiral') {
        const angle = 0.5 * i
        const r = 1.5 * i
        position = [Math.cos(angle) * r, i * 0.5, Math.sin(angle) * r]
      }
      
      return { ...lore, position }
    })
  }, [lores, layout])

  return (
    <div className="relative w-full h-screen bg-black">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white bg-black/80 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-serif font-bold mb-1 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Lore Universe</h1>
        <p className="text-xs text-gray-400 mb-4 tracking-widest uppercase">Experimental 3D Interface</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-tighter block mb-2">View Mode</label>
            <div className="flex gap-2">
              {(['circle', 'grid', 'spiral'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-3 py-1 rounded-md text-xs capitalize transition-all ${
                    layout === l ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Auto Rotation</span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-10 h-5 rounded-full transition-colors relative ${autoRotate ? 'bg-primary' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRotate ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
          >
            Return to 2D View
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[15, 15, 15]} intensity={1.5} color="#4F46E5" />
          <pointLight position={[-15, -15, -15]} intensity={1} color="#C4622D" />
          <spotLight position={[0, 20, 0]} intensity={2} angle={0.3} penumbra={1} castShadow />
          
          {/* Environment */}
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
          <Sparkles count={200} scale={[20, 20, 20]} size={2} speed={0.5} opacity={0.3} color="#fff" />
          <Environment preset="night" />

          {/* Center text */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[0, 4, 0]}
              fontSize={0.8}
              color="white"
              font="/fonts/serif-bold.woff"
              anchorX="center"
              anchorY="middle"
            >
              LORE
            </Text>
          </Float>
          
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
          <EffectComposer enableNormalPass={false}>
            <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={[0.0015, 0.0015]} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
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
