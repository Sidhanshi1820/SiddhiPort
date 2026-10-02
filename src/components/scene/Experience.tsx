import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { LOW_END } from '../../lib/quality'
import { CAM_POINTS } from '../../lib/paths'
import { CameraRig } from './CameraRig'
import { SceneObjects } from './SceneObjects'

/**
 * The fixed WebGL stage behind the scrolling DOM. Kept intentionally simple:
 * fog, warm accent lights, and one floating tool model per section that the camera drifts past on the way down the page.
 */
export function Experience() {
  return (
    <div className="canvas-holder" aria-hidden="true">
      <Canvas
        dpr={LOW_END ? 1 : [1, 1.5]}
        camera={{ fov: 55, near: 0.1, far: 320, position: CAM_POINTS[0] }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      >
        <color attach="background" args={['#12100e']} />
        <fog attach="fog" args={['#12100e', 14, 95]} />

        <ambientLight intensity={0.45} color="#a08a5c" />
        <directionalLight position={[6, 12, 6]} intensity={0.65} color="#e0c48a" />
        <pointLight position={[0, 5, -46]} intensity={140} distance={50} decay={2} color="#c5a059" />
        <pointLight position={[0, 5, -78]} intensity={140} distance={50} decay={2} color="#e0c48a" />

        <Suspense fallback={null}>
          <CameraRig />
          <SceneObjects />
        </Suspense>
      </Canvas>
    </div>
  )
}
