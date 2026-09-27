import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = cameraPosition - world.xyz;
    vLocal = position;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColA;
  uniform vec3 uColB;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  varying vec3 vWorld;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fres = pow(1.0 - abs(dot(n, v)), 2.2);
    float bands = 0.5 + 0.5 * sin(vLocal.y * 16.0 - uTime * 1.8);
    float pulse = 0.85 + 0.15 * sin(uTime * 1.3);
    vec3 color = mix(uColA, uColB, clamp(fres * 1.4, 0.0, 1.0));
    color *= (0.42 + fres * 2.1 + bands * 0.10) * pulse;
    float fogFade = smoothstep(30.0, 95.0, distance(cameraPosition, vWorld));
    color = mix(color, vec3(0.012, 0.012, 0.035), fogFade);
    gl_FragColor = vec4(color, 1.0);
  }
`

type Props = {
  radius?: number
  colorA?: string
  colorB?: string
  speed?: number
}

/** Pulsing fresnel "energy core": the hero centerpiece and the heart of other structures. */
export function GlowCore({ radius = 1.2, colorA = '#3b2a8f', colorB = '#67e8f9', speed = 1 }: Props) {
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 10 },
      uColA: { value: new THREE.Color(colorA) },
      uColB: { value: new THREE.Color(colorB) },
    }),
    [colorA, colorB],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * speed
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.15
      mesh.current.rotation.x += delta * 0.05
    }
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[radius, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  )
}
