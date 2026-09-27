import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CAM_POINTS, LOOK_POINTS, SECTION_COUNT } from '../../lib/paths'
import { scrollState } from '../../lib/scrollState'

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Drives the camera along the scroll journey. The page progress is remapped so
 * the camera dwells at each section's waypoint while that section is on screen,
 * then glides to the next station during the tail of the scroll (smoothstep
 * between 55% and 98% of the inter-section span). Damping adds weight; mouse
 * parallax and a short dolly-in finish the feel.
 */
export function CameraRig() {
  const curves = useMemo(
    () => ({
      cam: new THREE.CatmullRomCurve3(
        CAM_POINTS.map((p) => new THREE.Vector3(...p)),
        false,
        'centripetal',
      ),
      look: new THREE.CatmullRomCurve3(
        LOOK_POINTS.map((p) => new THREE.Vector3(...p)),
        false,
        'centripetal',
      ),
    }),
    [],
  )

  const smooth = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), [])

  // Window-level listener: the canvas sits behind the DOM sections, so R3F's
  // own pointer state never receives events.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const lambda = REDUCED_MOTION ? 14 : 3.8
    smooth.current = THREE.MathUtils.damp(smooth.current, scrollState.progress, lambda, dt)

    // Dwell-and-fly remap: hold at station i, transit near the section change.
    const span = SECTION_COUNT - 1
    const sf = THREE.MathUtils.clamp(smooth.current, 0, 1) * span
    const i = Math.min(Math.floor(sf), span - 1)
    const f = sf - i
    const transit = THREE.MathUtils.smoothstep(f, 0.55, 0.98)
    const t = THREE.MathUtils.clamp((i + transit) / span, 0, 1)

    curves.cam.getPoint(t, tmp.pos)
    curves.look.getPoint(t, tmp.look)

    const intro = scrollState.intro
    const px = REDUCED_MOTION ? 0 : mouse.current.x
    const py = REDUCED_MOTION ? 0 : mouse.current.y

    state.camera.position.set(
      tmp.pos.x + px * 0.4,
      tmp.pos.y + py * 0.25 + (1 - intro) * 0.6,
      tmp.pos.z + (1 - intro) * 6,
    )
    state.camera.lookAt(tmp.look.x + px * 0.7, tmp.look.y + py * 0.4, tmp.look.z)
    state.camera.rotation.z += px * 0.035
  })

  return null
}
