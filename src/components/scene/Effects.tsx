import { useMemo } from 'react'
import * as THREE from 'three'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'

export function Effects() {
  const caOffset = useMemo(() => new THREE.Vector2(0.0008, 0.0008), [])

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.3} radius={0.72} />
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.4} />
      <Vignette offset={0.22} darkness={0.72} />
    </EffectComposer>
  )
}
