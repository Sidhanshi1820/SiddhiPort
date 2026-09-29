import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { LOW_END } from '../../lib/quality'
import { CAM_POINTS } from '../../lib/paths'
import { CameraRig } from './CameraRig'
import { Stars } from './Stars'
import { DataShards } from './DataShards'
import { HeroObject } from './HeroObject'
import { AboutStructure } from './AboutStructure'
import { ProjectSlabs } from './ProjectSlabs'
import { SkillsRing } from './SkillsRing'
import { Portal } from './Portal'
import { SceneGrid } from './SceneGrid'
import { Effects } from './Effects'

/**
 * The fixed WebGL stage behind the scrolling DOM. Everything is procedural;
 * no assets to load, so the scene mounts instantly and the preloader is pure
 * theater for the intro reveal.
 */
export function Experience() {
  return (
    <div className="canvas-holder" aria-hidden="true">
      <Canvas
        dpr={LOW_END ? 1 : [1, 1.5]}
        camera={{ fov: 55, near: 0.1, far: 320, position: CAM_POINTS[0] }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      >
        <color attach="background" args={['#030309']} />
        <fog attach="fog" args={['#030309', 14, 95]} />

        <ambientLight intensity={0.35} color="#5560a8" />
        <directionalLight position={[6, 12, 6]} intensity={0.7} color="#8fa7ff" />
        <pointLight position={[0, 5, -46]} intensity={140} distance={50} decay={2} color="#67e8f9" />
        <pointLight position={[0, 5, -78]} intensity={140} distance={50} decay={2} color="#a78bfa" />

        <Suspense fallback={null}>
          <CameraRig />
          <Stars />
          <DataShards />
          <HeroObject />
          <AboutStructure />
          <ProjectSlabs />
          <SkillsRing />
          <Portal />
          <SceneGrid />
        </Suspense>

        <Effects />
      </Canvas>
    </div>
  )
}
