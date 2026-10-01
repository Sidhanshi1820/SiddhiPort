import { useEffect, type ReactNode } from 'react'

// Shared shell for the flat legal routes (/privacy, /terms). Rendered by
// main.tsx instead of the 3D portfolio so they open instantly with no
// preloader, canvas, or Lenis.
const LEGAL_STYLES = `
  .lg-body {
    background: #12100e;
    color: #f0ebe1;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    line-height: 1.7;
    padding: 4rem 1.5rem 6rem;
    min-height: 100vh;
  }
  .lg-main { max-width: 720px; margin: 0 auto; }
  .lg-eyebrow {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c5a059;
    margin-bottom: 1.2rem;
  }
  .lg-title { font-size: clamp(1.9rem, 4vw, 2.8rem); letter-spacing: -0.02em; margin-bottom: 0.6rem; }
  .lg-updated { color: #a89f8d; font-size: 0.85rem; margin-bottom: 2.5rem; }
  .lg-main h2 {
    font-size: 1.05rem;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    letter-spacing: 0.08em;
    color: #c5a059;
    margin: 2.2rem 0 0.7rem;
  }
  .lg-main p, .lg-main li { color: #a89f8d; font-size: 0.95rem; }
  .lg-main ul { padding-left: 1.2rem; margin: 0.5rem 0; }
  .lg-main li { margin-bottom: 0.4rem; }
  .lg-main strong { color: #f0ebe1; font-weight: 600; }
  .lg-main a { color: #c5a059; }
  .lg-back {
    display: inline-block;
    margin-top: 3rem;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #a89f8d;
    border: 1px solid rgba(197, 160, 89, 0.35);
    border-radius: 4px;
    padding: 0.7rem 1.3rem;
    text-decoration: none;
  }
  .lg-back:hover { color: #c5a059; border-color: #c5a059; }
`

type LegalPageProps = {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
}

export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  useEffect(() => {
    document.title = `${title} | Sidhanshi Srivastava`
  }, [title])

  return (
    <>
      <style>{LEGAL_STYLES}</style>
      <div className="lg-body">
        <main className="lg-main">
          <p className="lg-eyebrow">{eyebrow}</p>
          <h1 className="lg-title">{title}</h1>
          <p className="lg-updated">Last updated: {updated}</p>
          {children}
          <a className="lg-back" href="./">
            Back to portfolio
          </a>
        </main>
      </div>
    </>
  )
}
