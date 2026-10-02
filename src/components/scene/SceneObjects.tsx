import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// One cyber-security tool per section, staged along the camera corridor.
// Each model is built from primitives (no assets to load): shield, padlock,
// wi-fi signal, network graph, magnifier, certificate and key. They bob in
// place and emerge from the fog as you travel past their section.
type ToolKind = 'shield' | 'wifi' | 'lock' | 'network' | 'lens' | 'cert' | 'key'

// Shield silhouette drawn once at module load; extruded per instance.
const SHIELD_SHAPE = (() => {
  const s = new THREE.Shape()
  s.moveTo(0, 1.3)
  s.bezierCurveTo(0.7, 1.15, 1.05, 1.05, 1.05, 0.6)
  s.lineTo(1.05, -0.2)
  s.bezierCurveTo(1.05, -0.75, 0.5, -1.15, 0, -1.4)
  s.bezierCurveTo(-0.5, -1.15, -1.05, -0.75, -1.05, -0.2)
  s.lineTo(-1.05, 0.6)
  s.bezierCurveTo(-1.05, 1.05, -0.7, 1.15, 0, 1.3)
  return s
})()

type Station = {
  position: [number, number, number]
  color: string
  kind: ToolKind
  scale: number
  phase: number
  spin: number
}

const STATIONS: Station[] = [
  { position: [-3.8, 1.2, -33], color: '#c5a059', kind: 'shield', scale: 1.0, phase: 0.2, spin: 0.32 },
  { position: [3.8, 1.1, -54], color: '#a8823f', kind: 'lock', scale: 0.85, phase: 1.1, spin: 0.32 },
  { position: [-3.8, 1.1, -66], color: '#d4b57a', kind: 'wifi', scale: 1.15, phase: 2.0, spin: 0.36 },
  { position: [3.8, 1.2, -78], color: '#e0c48a', kind: 'network', scale: 1.0, phase: 2.9, spin: 0.3 },
  { position: [-3.8, 1.1, -90], color: '#e0c48a', kind: 'lens', scale: 1.05, phase: 3.7, spin: 0.3 },
  { position: [-3.6, 1.15, -102], color: '#d4b57a', kind: 'cert', scale: 0.9, phase: 4.1, spin: 0.28 },
  // Contact camera dwells at z=-118; keep the key ~10u ahead of it so the
  // ring isn't clipped by the near plane.
  { position: [1.4, 1.0, -128], color: '#ffd23f', kind: 'key', scale: 1.0, phase: 4.6, spin: 0.3 },
]

function Metal({ color }: { color: string }) {
  // Emissive keeps the hue alive deep in the corridor, where the point
  // lights never reach.
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.3}
      roughness={0.3}
      metalness={0.3}
    />
  )
}

function Glow({ color, opacity = 0.9 }: { color: string; opacity?: number }) {
  return <meshBasicMaterial color={color} toneMapped={false} transparent opacity={opacity} />
}

function ShieldTool({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, 0]}>
      <mesh position={[0, 0, -0.1]}>
        <extrudeGeometry
          args={[SHIELD_SHAPE, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 2 }]}
        />
        <Metal color={color} />
      </mesh>
      {/* chest bar detail so the face reads as a badge, not a blob */}
      <mesh position={[0, 0.45, 0.06]}>
        <boxGeometry args={[0.95, 0.1, 0.1]} />
        <Glow color={color} opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.1, 0.06]}>
        <boxGeometry args={[0.95, 0.1, 0.1]} />
        <Glow color={color} opacity={0.55} />
      </mesh>
    </group>
  )
}

function WifiTool({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.85, 0]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <Glow color={color} />
      </mesh>
      {[0.55, 1.0, 1.45].map((r) => (
        <mesh key={r} position={[0, -0.85, 0]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[r, 0.09, 12, 48, Math.PI / 2]} />
          <Glow color={color} />
        </mesh>
      ))}
    </group>
  )
}

function LockTool({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.62, 0]}>
        <torusGeometry args={[0.52, 0.13, 16, 40, Math.PI]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.45, 1.1, 0.6]} />
        <Metal color={color} />
      </mesh>
      {/* keyhole: dark circle + stem cut into the body face */}
      <mesh position={[0, -0.18, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshBasicMaterial color="#030309" />
      </mesh>
      <mesh position={[0, -0.45, 0.31]}>
        <boxGeometry args={[0.1, 0.3, 0.08]} />
        <meshBasicMaterial color="#030309" />
      </mesh>
    </group>
  )
}

function Bar({
  a,
  b,
  color,
}: {
  a: [number, number, number]
  b: [number, number, number]
  color: string
}) {
  const va = new THREE.Vector3(...a)
  const vb = new THREE.Vector3(...b)
  const mid = va.clone().add(vb).multiplyScalar(0.5)
  const dir = vb.clone().sub(va)
  const len = dir.length()
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize(),
  )
  const euler = new THREE.Euler().setFromQuaternion(quat)
  return (
    <mesh position={mid.toArray()} rotation={[euler.x, euler.y, euler.z]}>
      <cylinderGeometry args={[0.045, 0.045, len, 10]} />
      <Glow color={color} opacity={0.7} />
    </mesh>
  )
}

function NetworkTool({ color }: { color: string }) {
  const nodes: [number, number, number][] = [
    [0, 1.0, 0],
    [-1.15, -0.7, 0],
    [1.15, -0.7, 0],
    [0, -0.1, 0],
  ]
  const edges: Array<[[number, number, number], [number, number, number]]> = [
    [nodes[0], nodes[1]],
    [nodes[0], nodes[2]],
    [nodes[1], nodes[2]],
    [nodes[0], nodes[3]],
    [nodes[1], nodes[3]],
    [nodes[2], nodes[3]],
  ]
  return (
    <group>
      {edges.map(([a, b], i) => (
        <Bar key={i} a={a} b={b} color={color} />
      ))}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.2, 20, 20]} />
          <Glow color={color} />
        </mesh>
      ))}
    </group>
  )
}

function LensTool({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[-0.3, 0.4, 0]}>
        <torusGeometry args={[0.72, 0.11, 16, 48]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[-0.3, 0.4, 0]}>
        <circleGeometry args={[0.64, 40]} />
        <Glow color={color} opacity={0.14} />
      </mesh>
      <mesh position={[0.66, -0.66, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.13, 1.35, 12]} />
        <Metal color={color} />
      </mesh>
    </group>
  )
}

function KeyTool({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.85, 0]}>
        <torusGeometry args={[0.42, 0.13, 16, 40]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 1.5, 12]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[0.22, -0.62, 0]}>
        <boxGeometry args={[0.36, 0.13, 0.13]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[0.18, -0.88, 0]}>
        <boxGeometry args={[0.28, 0.13, 0.13]} />
        <Metal color={color} />
      </mesh>
    </group>
  )
}

function CertTool({ color }: { color: string }) {
  // Certificate: a framed document with a wax-seal ring.
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.1, 0.12]} />
        <Metal color={color} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.25, 0.86, 0.04]} />
        <meshStandardMaterial color="#1a1712" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.16, 0.14]}>
        <torusGeometry args={[0.22, 0.05, 12, 32]} />
        <Glow color={color} />
      </mesh>
      <mesh position={[0, 0.16, 0.13]}>
        <circleGeometry args={[0.13, 24]} />
        <Glow color={color} opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.24, 0.14]}>
        <boxGeometry args={[0.9, 0.06, 0.03]} />
        <Glow color={color} opacity={0.45} />
      </mesh>
    </group>
  )
}

function CyberTool({ kind, color }: { kind: ToolKind; color: string }) {
  switch (kind) {
    case 'shield':
      return <ShieldTool color={color} />
    case 'wifi':
      return <WifiTool color={color} />
    case 'lock':
      return <LockTool color={color} />
    case 'network':
      return <NetworkTool color={color} />
    case 'lens':
      return <LensTool color={color} />
    case 'cert':
      return <CertTool color={color} />
    case 'key':
      return <KeyTool color={color} />
  }
}

export function SceneObjects() {
  const stationRefs = useRef<(THREE.Group | null)[]>([])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    stationRefs.current.forEach((g, i) => {
      if (!g) return
      const s = STATIONS[i]
      g.rotation.y += delta * s.spin
      g.position.y = s.position[1] + Math.sin(t * 0.5 + s.phase) * 0.22
    })
  })

  return (
    <>
      {STATIONS.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            stationRefs.current[i] = el
          }}
          position={s.position}
          scale={s.scale}
        >
          <CyberTool kind={s.kind} color={s.color} />
        </group>
      ))}
    </>
  )
}
