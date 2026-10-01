// Shared mutable state bridging the DOM scroll world (GSAP / Lenis) with the
// WebGL render loop. Kept outside React state so the 60fps loop never re-renders.
export const scrollState = {
  /** 0..1 progress across the entire page, driven by ScrollTrigger. */
  progress: 0,
  /** 0..1 intro reveal, tweened once the preloader lifts. */
  intro: 0,
}

type LenisLike = {
  scrollTo: (target: string | number, options?: Record<string, unknown>) => void
  stop: () => void
  start: () => void
  raf: (time: number) => void
}

export const lenisRef: { current: LenisLike | null } = { current: null }

export function scrollToSection(selector: string) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(selector, {
      duration: 1.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    })
  } else {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }
}
