import { useEffect, useState } from 'react'
import { PAGE_SECTIONS } from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

export function SectionDots() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = PAGE_SECTIONS.findIndex((s) => s.id === entry.target.id)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { threshold: 0.55 },
    )
    PAGE_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="dots" aria-label="Section navigation">
      {PAGE_SECTIONS.map((s, i) => (
        <button
          key={s.id}
          className={`dot${i === active ? ' active' : ''}`}
          onClick={() => scrollToSection('#' + s.id)}
          aria-label={s.label}
          data-cursor="link"
        />
      ))}
    </nav>
  )
}
