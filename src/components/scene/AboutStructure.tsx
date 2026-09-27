import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GlowCore } from './GlowCore'
import { ABOUT_POSITION } from '../../lib/paths'

// About station: a wireframe identity sphere with a violet core, orbit ring
// and drifting octahedral fragments.
export function AboutStructure() {
  const group = useRef<THREE.Group>(null)
  const sphere = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const cubes = useRef<THREE.Mesh[]>([])

  const fragments = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 4,
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.22,
        color: Math.random() < 0.5 ? '#67e8f9' : '#a78bfa',
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.position.y = ABOUT_POSITION[1] + Math.sin(t * 0.4) * 0.12
    if (sphere.current) sphere.current.rotation.y += delta * 0.1
    if (ring.current) {
      ring.current.rotation.x += delta * 0.16
      ring.current.rotation.z += delta * 0.07
    }
    fragments.forEach((f, i) => {
      const mesh = cubes.current[i]
      if (!mesh) return
      mesh.position.y = f.position[1] + Math.sin(t * 0.8 + f.phase) * 0.3
      mesh.rotation.x += delta * 0.4
      mesh.rotation.y += delta * 0.3
    })
  })

  return (
    <group ref={group} position={ABOUT_POSITION}>
      <mesh ref={sphere}>
        <sphereGeometry args={[2.3, 20, 20]} />
        <meshBasicMaterial color="#8b7cf7" wireframe transparent opacity={0.22} toneMapped={false} />
      </mesh>
      <GlowCore radius={1.0} colorA="#2b1e6b" colorB="#a78bfa" speed={1.3} />
      <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0.2]}>
        <torusGeometry args={[3.1, 0.012, 8, 140]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} transparent opacity={0.5} />
      </mesh>
      {fragments.map((f, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            if (mesh) cubes.current[i] = mesh
          }}
          position={f.position}
        >
          <octahedronGeometry args={[f.scale]} />
          <meshBasicMaterial color={f.color} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
