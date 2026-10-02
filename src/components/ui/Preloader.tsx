import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../../data/portfolio'

/**
 * Boot curtain: ramps a progress readout to 100%, then plays a reveal
 * sequence: bar seals, content lifts, curtain wipes up, and onReveal fires
 * mid-wipe so the hero intro overlaps the lift.
 *
 * Deliberately free of drei/useProgress: the scene is fully procedural and
 * its chunk streams in lazily behind this curtain, so tracking "asset
 * progress" would drag the whole three.js bundle into the entry chunk.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const onRevealRef = useRef(onReveal)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [display, setDisplay] = useState(0)
  const [finished, setFinished] = useState(false)

  // Keep the callback fresh without mutating a ref during render.
  useEffect(() => {
    onRevealRef.current = onReveal
  }, [onReveal])

  useEffect(() => {
    const startedAt = performance.now()
    // Nothing is actually downloading; the minimum just keeps the curtain
    // readable instead of a strobe (and covers the 3D chunk streaming in).
    const minimum = 700
    let rafId = 0

    const finish = () => {
      setDisplay(100)
      timelineRef.current?.kill()
      timelineRef.current = gsap
        .timeline({ onComplete: () => setFinished(true) })
        .to(fillRef.current, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .to(contentRef.current, { y: -26, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.3)
        .call(() => onRevealRef.current(), [], 0.55)
        .to(rootRef.current, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 0.55)
    }

    const tick = () => {
      const value = Math.min(1, (performance.now() - startedAt) / minimum) * 100
      setDisplay(value)
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${value / 100})`

      if (value >= 99.9) {
        finish()
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      // Otherwise onReveal/onComplete can fire after unmount.
      timelineRef.current?.kill()
    }
  }, [])

  if (finished) return null

  return (
    <div className="preloader" ref={rootRef}>
      <div className="pre-inner" ref={contentRef}>
        <p className="pre-name" aria-hidden="true">{profile.initials}</p>
        {/* Single polite announcement; the per-frame counter is decorative. */}
        <p className="pre-status" role="status">establishing secure session…</p>
        <div className="pre-bar" aria-hidden="true">
          <div className="pre-bar-fill" ref={fillRef} />
        </div>
        <p className="pre-count" aria-hidden="true">
          {Math.round(display).toString().padStart(3, '0')} %
        </p>
      </div>
    </div>
  )
}
