import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, RoundedBox, Text } from '@react-three/drei'
import { projects } from '../../data/portfolio'
import { SLAB_TRANSFORMS } from '../../lib/paths'
import type { Project } from '../../data/portfolio'

const scanVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

// Holographic display: dark glass, fine scanlines, a slow traveling highlight
// band and an accent-lit border. Distance-faded to match the scene fog.
const scanFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vec3 col = vec3(0.012, 0.02, 0.045);
    float scan = 0.05 + 0.04 * sin((vUv.y + uTime * 0.045) * 220.0);
    col += uAccent * scan;
    float band = exp(-pow((fract(vUv.y * 0.7 - uTime * 0.06) - 0.5) * 7.0, 2.0));
    col += uAccent * band * 0.35;
    vec2 b = min(vUv, 1.0 - vUv);
    float edge = smoothstep(0.035, 0.0, min(b.x, b.y));
    col += uAccent * edge * 0.9;
    float fogFade = smoothstep(30.0, 95.0, distance(cameraPosition, vWorld));
    col = mix(col, vec3(0.012, 0.012, 0.035), fogFade);
    gl_FragColor = vec4(col, 1.0);
  }
`

const FRAME_PARTS: Array<{ args: [number, number, number]; position: [number, number, number] }> = [
  { args: [4.6, 0.05, 0.2], position: [0, 1.39, 0] },
  { args: [4.6, 0.05, 0.2], position: [0, -1.39, 0] },
  { args: [0.05, 2.83, 0.2], position: [2.24, 0, 0] },
  { args: [0.05, 2.83, 0.2], position: [-2.24, 0, 0] },
]

function Slab({ project, index }: { project: Project; index: number }) {
  const transform = SLAB_TRANSFORMS[index]
  const screenMat = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 5 },
      uAccent: { value: new THREE.Color(project.accent) },
    }),
    [project.accent],
  )

  useFrame((_, delta) => {
    if (screenMat.current) uniforms.uTime.value += delta
  })

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.85} floatingRange={[-0.12, 0.12]}>
      <group position={transform.position} rotation={[0, transform.rotationY, 0]}>
        <RoundedBox args={[4.4, 2.7, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#0d1024" metalness={0.55} roughness={0.42} />
        </RoundedBox>

        {FRAME_PARTS.map((part, i) => (
          <mesh key={i} position={part.position}>
            <boxGeometry args={part.args} />
            <meshBasicMaterial color={project.accent} toneMapped={false} />
          </mesh>
        ))}

        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[4.1, 2.4]} />
          <shaderMaterial
            ref={screenMat}
            uniforms={uniforms}
            vertexShader={scanVert}
            fragmentShader={scanFrag}
          />
        </mesh>

        <Text position={[-1.85, 0.85, 0.11]} fontSize={0.32} color={project.accent} letterSpacing={0.18} anchorX="left" anchorY="middle">
          {project.index}
        </Text>
        <Text position={[-1.85, -0.95, 0.11]} fontSize={0.3} color="#e9edf6" letterSpacing={0.06} anchorX="left" anchorY="middle">
          {project.title}
        </Text>
      </group>
    </Float>
  )
}

export function ProjectSlabs() {
  return (
    <>
      {projects.slice(0, SLAB_TRANSFORMS.length).map((project, i) => (
        <Slab key={project.index} project={project} index={i} />
      ))}
    </>
  )
}
