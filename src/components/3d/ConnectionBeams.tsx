import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ConnectionBeamsProps {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  active?: boolean
}

export default function ConnectionBeams({ start, end, color = '#C4622D', active = true }: ConnectionBeamsProps) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 2,
      (start[2] + end[2]) / 2
    ),
    new THREE.Vector3(...end)
  ]
  
  const curve = new THREE.CatmullRomCurve3(points)
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={active ? 0.5 : 0}
        transparent 
        opacity={0.3}
      />
    </mesh>
  )
}
