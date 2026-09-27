import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { Experience } from './components/scene/Experience'
import { Overlay } from './components/ui/Overlay'
import { Nav } from './components/ui/Nav'
import { Preloader } from './components/ui/Preloader'
import { lenisRef, scrollState } from './lib/scrollState'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [revealed, setRevealed] = useState(false)

  // Smooth scroll + scroll-driven choreography, wired once on mount.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({ lerp: 0.1 })
    lenisRef.current = lenis
    lenis.stop() // locked until the preloader lifts

    lenis.on('scroll', () => ScrollTrigger.update())
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      const journey = ScrollTrigger.create({
        trigger: '#page',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scrollState.progress = self.progress
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
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(raf)
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
      <Experience />
      <Overlay />
      <Nav />
      <div className="vignette" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Preloader onReveal={() => setRevealed(true)} />
    </>
  )
}
