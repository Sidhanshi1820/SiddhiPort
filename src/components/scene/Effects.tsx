import { useMemo } from 'react'
import * as THREE from 'three'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { LOW_END } from '../../lib/quality'

export function Effects() {
  const caOffset = useMemo(() => new THREE.Vector2(0.0008, 0.0008), [])

  // Every pass here is full-screen per-frame work. Weak GPUs drop MSAA and
  // the chromatic pass; bloom stays because it carries the whole neon look.
  return (
    <EffectComposer multisampling={LOW_END ? 0 : 2}>
      <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.3} radius={0.72} />
      {!LOW_END && <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.4} />}
      <Vignette offset={0.22} darkness={0.72} />
    </EffectComposer>
  )
}
