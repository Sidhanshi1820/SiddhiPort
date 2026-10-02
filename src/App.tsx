import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
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

// If that chunk ever fails to load (flaky network, mid-deploy refresh), the
// site must stay usable — the canvas is purely decorative.
class SceneBoundary extends Component<{ children?: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error('3D scene failed to load:', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

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
    // Own gsap.context so these tweens are reverted on unmount like the rest.
    const ctx = gsap.context(() => {
      gsap.to(scrollState, { intro: 1, duration: 2.4, ease: 'back.out(1.1)' })
      gsap.fromTo(
        '[data-hero]',
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.09, ease: 'power3.out', delay: 0.25 },
      )
    })
    return () => ctx.revert()
  }, [revealed])

  return (
    <>
      <SceneBoundary>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </SceneBoundary>
      <Overlay />
      <Nav />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <ChatWidget />
      <Preloader onReveal={() => setRevealed(true)} />
    </>
  )
}
