import { NAV_LINKS } from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

export function Nav() {
  return (
    <header className="nav">
      <button className="nav-logo" onClick={() => scrollToSection('#hero')} aria-label="Back to top">
        <span className="nav-mono">SS</span>
      </button>
      {/* Real anchors so destinations stay middle-clickable and copy-linkable. */}
      <nav className="nav-links" aria-label="Primary">
        {NAV_LINKS.map((l) => (
          <a
            key={l.target}
            href={l.target}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection(l.target)
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
