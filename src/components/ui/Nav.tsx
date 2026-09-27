import { NAV_LINKS, profile } from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

export function Nav() {
  return (
    <header className="nav">
      <button className="nav-logo" onClick={() => scrollToSection('#hero')} data-cursor="link" aria-label="Back to top">
        <span className="nav-logo-dot" aria-hidden="true" />
        {profile.initials}
        <span className="nav-logo-dim">.space</span>
      </button>
      <nav className="nav-links" aria-label="Primary">
        {NAV_LINKS.map((link, i) => (
          <button key={link.target} onClick={() => scrollToSection(link.target)} data-cursor="link">
            <span className="nav-index">0{i + 1}</span>
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
