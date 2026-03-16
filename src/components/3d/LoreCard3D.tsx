import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface LoreCard3DProps {
  position: [number, number, number]
  title: string
  description: string
  imageUrl: string
  color: string
  index: number
  onClick: () => void
}

export default function LoreCard3D({ position, title, description, imageUrl, color, index, onClick }: LoreCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const floatY = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
      meshRef.current.position.y = position[1] + floatY
      
      const targetRotationY = flipped ? Math.PI : (hovered ? 0.2 : 0)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1)
      
      const scale = hovered ? 1.15 : 1
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1))
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    setFlipped(!flipped)
    if (flipped) {
      setTimeout(onClick, 500)
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2.8, 0.1]} />
      <meshStandardMaterial 
        color={color} 
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.3}
        metalness={0.1}
      />
      
      {!flipped ? (
        <group>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.8}
          >
            {title}
          </Text>
        </group>
      ) : (
        <group rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.8}
          >
            {description.length > 100 ? description.slice(0, 100) + '...' : description}
          </Text>
        </group>
      )}
    </mesh>
  )
}
