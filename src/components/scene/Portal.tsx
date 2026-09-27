import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { PORTAL_POSITION } from '../../lib/paths'

const discVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

// Swirling event-horizon disc: spiral arms + pulsing rings, hot enough to bloom.
// Distance-faded so the beacon emerges from the fog as you approach.
const discFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float arms = 0.5 + 0.5 * sin(a * 3.0 - r * 10.0 + uTime * 1.4);
    float rings = 0.5 + 0.5 * sin(r * 22.0 - uTime * 2.2);
    float edge = smoothstep(1.0, 0.72, r);
    float center = smoothstep(0.0, 0.32, r);
    vec3 col = mix(vec3(1.0, 0.62, 0.28), vec3(1.0, 0.85, 0.6), arms);
    float glow = (arms * 0.55 + rings * 0.3) * edge * (0.35 + 0.65 * center);
    float fogFade = smoothstep(30.0, 95.0, distance(cameraPosition, vWorld));
    gl_FragColor = vec4(col * glow * 1.45 * (1.0 - fogFade), edge * 0.85 * (1.0 - fogFade));
  }
`

// Contact station: the uplink beacon: a hot amber gate with a swirling core
// and a light pillar anchored to the grid below.
export function Portal() {
  const ring = useRef<THREE.Mesh>(null)
  const inner = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state, delta) => {
    uniforms.uTime.value += delta
    const t = state.clock.elapsedTime
    if (ring.current) {
      ring.current.rotation.x = Math.sin(t * 0.4) * 0.06
      ring.current.rotation.y = Math.cos(t * 0.3) * 0.08
    }
    if (inner.current) inner.current.rotation.z = t * 0.25
  })

  return (
    <group position={PORTAL_POSITION}>
      <mesh ref={ring}>
        <torusGeometry args={[2.7, 0.06, 16, 220]} />
        <meshBasicMaterial color="#ffb86b" toneMapped={false} />
      </mesh>
      <mesh ref={inner} rotation={[0, 0, 0.6]}>
        <torusGeometry args={[2.35, 0.018, 10, 180]} />
        <meshBasicMaterial color="#ffd9a8" toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.35, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={discVert}
          fragmentShader={discFrag}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight intensity={90} distance={40} decay={2} color="#ffb86b" />
      <mesh position={[0, -4.6, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 8.2, 12, 1, true]} />
        <meshBasicMaterial
          color="#ffb86b"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text position={[0, -3.35, 0]} fontSize={0.26} color="#ffd9a8" letterSpacing={0.5} anchorX="center" anchorY="middle">
        TRANSMIT
      </Text>
    </group>
  )
}
