import { NAV_LINKS } from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

export function Nav() {
  return (
    <header className="nav">
      <button className="nav-logo" onClick={() => scrollToSection('#hero')} aria-label="Back to top">
        <span className="nav-mono">SS</span>
      </button>
      <nav className="nav-links" aria-label="Primary">
        {NAV_LINKS.map((l) => (
          <button key={l.target} onClick={() => scrollToSection(l.target)}>
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
