import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GlowCore } from './GlowCore'
import { ParticleField } from './ParticleField'
import { HERO_OBJECT_POSITION } from '../../lib/paths'
import { scrollState } from '../../lib/scrollState'

function shell(count: number, rMin: number, rMax: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = rMin + Math.random() * (rMax - rMin)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.cos(phi)
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return arr
}

/**
 * Hero centerpiece: a pulsing holographic core inside a wireframe cage,
 * wrapped in two tumbling orbit rings and a dust halo. The flight path to the
 * about section deliberately threads the gap between core and rings.
 */
export function HeroObject() {
  const group = useRef<THREE.Group>(null)
  const cage = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const halo = useMemo(() => shell(320, 3.4, 4.6), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.position.set(
        HERO_OBJECT_POSITION[0],
        HERO_OBJECT_POSITION[1] + Math.sin(t * 0.55) * 0.14,
        HERO_OBJECT_POSITION[2],
      )
      group.current.scale.setScalar(Math.max(0.0001, scrollState.intro))
      group.current.rotation.y += delta * 0.05
    }
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.12
      cage.current.rotation.x = Math.sin(t * 0.3) * 0.2
    }
    if (ringA.current) {
      ringA.current.rotation.x += delta * 0.18
      ringA.current.rotation.y += delta * 0.11
    }
    if (ringB.current) {
      ringB.current.rotation.x -= delta * 0.13
      ringB.current.rotation.z += delta * 0.09
    }
  })

  return (
    <group ref={group} position={HERO_OBJECT_POSITION} scale={0.0001}>
      <GlowCore radius={1.2} />
      <mesh ref={cage}>
        <icosahedronGeometry args={[1.75, 1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0.3, 0]}>
        <torusGeometry args={[2.55, 0.014, 8, 160]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0.4]}>
        <torusGeometry args={[2.95, 0.01, 8, 160]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} transparent opacity={0.6} />
      </mesh>
      <ParticleField positions={halo} color="#9ff5ff" size={0.5} opacity={0.8} speed={1.2} />
    </group>
  )
}
