import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { GlowCore } from './GlowCore'
import { SKILLS_POSITION } from '../../lib/paths'
import { ringSkills } from '../../data/portfolio'

// Skills station: a gyroscope of two counter-rotating rings with glowing skill
// nodes orbiting on the outer ring. The camera flight path threads its center.
export function SkillsRing() {
  const group = useRef<THREE.Group>(null)
  const spinner = useRef<THREE.Group>(null)
  const gyro = useRef<THREE.Mesh>(null)

  const labels = useMemo(() => ringSkills(8), [])
  const nodeAngles = useMemo(
    () => labels.map((_, i) => (i / labels.length) * Math.PI * 2),
    [labels],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.position.y = SKILLS_POSITION[1] + Math.sin(t * 0.45) * 0.1
    // Sway the dial instead of spinning it fully so the labels stay readable.
    if (spinner.current) spinner.current.rotation.z = Math.sin(t * 0.22) * 0.3
    if (gyro.current) {
      gyro.current.rotation.x = t * 0.35
      gyro.current.rotation.y = t * 0.22
    }
  })

  return (
    <group ref={group} position={SKILLS_POSITION}>
      <mesh>
        <torusGeometry args={[3.4, 0.03, 12, 200]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh ref={gyro}>
        <torusGeometry args={[2.7, 0.015, 10, 160]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <GlowCore radius={0.62} colorA="#241a55" colorB="#67e8f9" speed={1.6} />

      <group ref={spinner}>
        {labels.map((label, i) => {
          const a = nodeAngles[i]
          return (
            <group key={label} position={[Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0]}>
              <mesh>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshBasicMaterial color="#c8faff" toneMapped={false} />
              </mesh>
              <Text
                position={[Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0]}
                fontSize={0.3}
                color="#cfe0ff"
                letterSpacing={0.1}
                anchorX="center"
                anchorY="middle"
              >
                {label}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}
