import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'
import { profile } from '../../data/portfolio'

/**
 * Boot curtain: ramps a progress readout to 100% (respecting drei's real asset
 * progress if anything is loading), then plays a reveal sequence: bar seals,
 * content lifts, curtain wipes up, and onReveal fires mid-wipe so the hero
 * intro overlaps the lift.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const { progress, active } = useProgress()
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef({ progress, active })
  progressRef.current = { progress, active }
  const onRevealRef = useRef(onReveal)
  onRevealRef.current = onReveal
  const revealCalled = useRef(false)
  const [display, setDisplay] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const startedAt = performance.now()
    const minimum = 1700
    let value = 0
    let rafId = 0

    const finish = () => {
      setDisplay(100)
      gsap
        .timeline({ onComplete: () => setFinished(true) })
        .to(fillRef.current, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .to(contentRef.current, { y: -26, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.3)
        .call(() => onRevealRef.current(), [], 0.55)
        .to(rootRef.current, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 0.55)
    }

    const tick = () => {
      const { progress: p, active: a } = progressRef.current
      const ramp = Math.min(1, (performance.now() - startedAt) / minimum)
      const target = Math.min(a ? Math.max(p, 15) : 100, ramp * 108)
      value = Math.max(value, target)
      setDisplay(value)
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${value / 100})`

      if (value >= 99.9) {
        if (!revealCalled.current) {
          revealCalled.current = true
          finish()
        }
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  if (finished) return null

  return (
    <div className="preloader" ref={rootRef} role="status" aria-live="polite">
      <div className="pre-inner" ref={contentRef}>
        <p className="pre-name">{profile.initials}</p>
        <p className="pre-status">establishing secure session…</p>
        <div className="pre-bar" aria-hidden="true">
          <div className="pre-bar-fill" ref={fillRef} />
        </div>
        <p className="pre-count">{Math.round(display).toString().padStart(3, '0')} %</p>
      </div>
    </div>
  )
}
