import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.65 + 0.35 * sin(uTime * 1.6 + aPhase);
    vAlpha = twinkle;
    gl_PointSize = min(uSize * aScale * (240.0 / max(0.1, -mvPosition.z)), 42.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, alpha * vAlpha * uOpacity);
  }
`

type Props = {
  positions: Float32Array
  color?: string
  size?: number
  opacity?: number
  speed?: number
}

/** Soft round GPU points with per-particle twinkle — shared by stars, dust and halos. */
export function ParticleField({ positions, color = '#9fd8ff', size = 1.2, opacity = 0.8, speed = 1 }: Props) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const count = positions.length / 3
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      scales[i] = 0.5 + Math.random()
      phases[i] = Math.random() * Math.PI * 2
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [positions])

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 20 },
      uSize: { value: size },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, size, opacity],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * speed
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
