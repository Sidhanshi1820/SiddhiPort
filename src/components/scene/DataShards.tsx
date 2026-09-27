import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Thin luminous streaks flanking the flight path — data streams that sell the
// sense of speed while the camera travels the corridor.
export function DataShards() {
  const group = useRef<THREE.Group>(null)

  const shards = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        position: [
          (Math.random() < 0.5 ? -1 : 1) * (6.5 + Math.random() * 9),
          -2 + Math.random() * 10,
          14 - Math.random() * 168,
        ] as [number, number, number],
        length: 1.6 + Math.random() * 4.2,
        color: ['#67e8f9', '#a78bfa', '#f472b6'][i % 3],
      })),
    [],
  )

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.4
    }
  })

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.position}>
          <boxGeometry args={[0.045, 0.045, s.length]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
