import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Overlay from './components/ui/Overlay'
import { Nav } from './components/ui/Nav'
import { Preloader } from './components/ui/Preloader'
import { ChatWidget } from './components/ui/ChatWidget'
import { lenisRef, scrollState } from './lib/scrollState'

gsap.registerPlugin(ScrollTrigger)

// The WebGL stage streams in as its own chunk behind the preloader curtain,
// so first paint only waits on the small app shell.
const Experience = lazy(() =>
  import('./components/scene/Experience').then((m) => ({ default: m.Experience })),
)

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // Smooth scroll + scroll-driven choreography, wired once on mount.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    // Reduced motion: skip Lenis entirely and let ScrollTrigger run on the
    // native scroll — the journey still works, just without smoothing.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    let raf: ((time: number) => void) | null = null
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.15 })
      lenisRef.current = lenis
      lenis.stop() // locked until the preloader lifts

      lenis.on('scroll', () => ScrollTrigger.update())
      raf = (time: number) => {
        lenisRef.current?.raf(time * 1000)
      }
      gsap.ticker.add(raf)
    }
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      const journey = ScrollTrigger.create({
        trigger: '#page',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scrollState.progress = self.progress
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`
          }
        },
      })
      scrollState.progress = journey.progress

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]')
        if (!items.length) return
        gsap.fromTo(
          items,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.085,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 68%', toggleActions: 'play none none reverse' },
          },
        )
      })
    })

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      ctx.revert()
      lenis?.destroy()
      lenisRef.current = null
      if (raf) gsap.ticker.remove(raf)
    }
  }, [])

  // Fired mid-wipe of the preloader curtain: unlock scrolling, pin the page to
  // the top (some environments restore a stale scroll position after mount),
  // dolly the camera in, and stagger the hero copy.
  useEffect(() => {
    if (!revealed) return
    lenisRef.current?.start()
    window.scrollTo(0, 0)
    lenisRef.current?.scrollTo(0, { immediate: true })
    gsap.to(scrollState, { intro: 1, duration: 2.4, ease: 'back.out(1.1)' })
    gsap.fromTo(
      '[data-hero]',
      { y: 42, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.09, ease: 'power3.out', delay: 0.25 },
    )
  }, [revealed])

  return (
    <>
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <Overlay />
      <Nav />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <ChatWidget />
      <Preloader onReveal={() => setRevealed(true)} />
    </>
  )
}
