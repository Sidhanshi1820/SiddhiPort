import { useState } from 'react'
import {
  NAV_LINKS,
  certifications,
  ctfLabs,
  education,
  platforms,
  profile,
  projects,
  skillCategories,
} from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

const YEAR = new Date().getFullYear()

// Core technical skills highlighted in the About section (spec list first).
const CORE_SKILLS = ['Python', 'Wireshark', 'Linux', 'Burp Suite', 'Nmap', 'Metasploit', 'OWASP Top 10', 'Git']

const FOCUS_AREAS = [
  {
    title: 'Penetration Testing',
    desc: 'Hands-on offensive practice — recon, enumeration and exploitation on lab machines with Kali, Burp Suite and Metasploit.',
  },
  {
    title: 'Vulnerability Assessment',
    desc: 'Finding, triaging and documenting weaknesses: OWASP Top 10 web flaws, misconfigurations and weak crypto usage.',
  },
  {
    title: 'Network Defense',
    desc: 'Reading the wire — packet analysis in Wireshark, traffic baselining, SIEM-minded log review and incident response basics.',
  },
]

/* ---- tiny inline icon set (gold stroke) ---- */
function Icon({ d, size = 15 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  link: 'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2 M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2',
  shield: 'M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z M9 12l2 2 4-4',
  award: 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M8.5 13.5L7 21l5-3 5 3-1.5-7.5',
  code: 'M8 6l-5 6 5 6 M16 6l5 6-5 6 M13 4l-2 16',
  grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  layers: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
}

// Filled brand marks (GitHub / LinkedIn) for the social circles.
const GITHUB_MARK =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
const LINKEDIN_MARK =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.143-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

function BrandIcon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function SocialGlyph({ kind }: { kind: string }) {
  if (kind === 'github') return <BrandIcon d={GITHUB_MARK} />
  if (kind === 'linkedin') return <BrandIcon d={LINKEDIN_MARK} />
  if (kind === 'mail') return <Icon d={ICONS.mail} size={16} />
  if (kind === 'resume') return <Icon d={ICONS.file} size={16} />
  return <Icon d={ICONS.link} size={16} />
}

export default function Overlay() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const copyEmail = () => {
    navigator.clipboard
      ?.writeText(profile.email)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      })
      .catch(() => {
        // clipboard denied — the mailto button still works
      })
  }

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact — ${form.name || 'visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <main id="page">
      {/* ============ HERO ============ */}
      <section className="section section-hero" id="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-visual" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-tag" data-hero>| CYBERSECURITY STUDENT |</p>
            <h1 className="hero-title" data-hero>
              {profile.firstName} <span className="hero-gold">{profile.lastName}</span>
            </h1>
            <p className="hero-sub" data-hero>
              Available for internships, security research, and collaborative projects.
            </p>
            <div className="hero-actions" data-hero>
              <button className="btn btn-solid" onClick={() => scrollToSection('#projects')}>
                View Projects
              </button>
              <button className="btn btn-outline" onClick={() => scrollToSection('#contact')}>
                Contact Me
              </button>
            </div>
          </div>
        </div>

        <div className="hero-infobar">
          <div className="info-block">
            <p className="info-label">
              <Icon d={ICONS.shield} /> Contact information
            </p>
            <a className="info-line" href={`mailto:${profile.email}`}>
              <Icon d={ICONS.mail} /> {profile.email}
            </a>
          </div>
          <div className="info-socials" aria-label="Social platforms">
            {profile.socialIcons.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
                <SocialGlyph kind={s.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="scroll-hint" data-hero>
          <span className="scroll-hint-line" aria-hidden="true" />
          Scroll
        </div>
      </section>

      {/* ============ ABOUT ME ============ */}
      <section className="section" id="about">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>About me</p>
          <h2 className="section-title" data-reveal>
            Focused on offense to build better defense.
          </h2>
          <div className="about-grid">
            <div className="about-copy">
              <p className="body-text" data-reveal>
                I'm {profile.name}, a B.Tech CSE (Cyber Security) student at NIET, Greater Noida —
                {education.period.replace(' · pursuing', '')} batch, CGPA {education.cgpa}. My work
                sits at the intersection of offensive curiosity and defensive discipline.
              </p>
              <p className="body-text" data-reveal>
                Recent builds include an AI-based rogue Wi-Fi detector, an automated cryptographic
                key-management platform and a hardened event management system — plus the CTF reps
                and simulation certs to back the curiosity up.
              </p>
            </div>
            <div className="focus-list" data-reveal>
              {FOCUS_AREAS.map((f) => (
                <div className="focus-item" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="core-skills" data-reveal>
            <p className="core-label">Core technical skills</p>
            <ul className="chips">
              {CORE_SKILLS.map((s) => (
                <li className="chip" key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ PROJECTS ============ */}
      <section className="section" id="projects">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>Projects</p>
          <h2 className="section-title" data-reveal>
            Security projects &amp; builds.
          </h2>
          <div className="card-grid">
            {projects.map((p) => (
              <article className="card" data-reveal key={p.index}>
                <div className="card-index">{p.index}</div>
                <h3>{p.title}</h3>
                <p className="card-tagline">{p.tagline}</p>
                <p className="card-desc">{p.description}</p>
                <ul className="chips">
                  {p.tech.map((t) => (
                    <li className="chip" key={t}>{t}</li>
                  ))}
                </ul>
                <div className="card-links">
                  <a className="card-link" href={p.links.live} target="_blank" rel="noreferrer">
                    Live ↗
                  </a>
                  <a className="card-link" href={p.links.source} target="_blank" rel="noreferrer">
                    Source ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTF WRITE-UPS ============ */}
      <section className="section" id="ctf">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>CTF write-ups</p>
          <h2 className="section-title" data-reveal>
            Labs, flags &amp; notes.
          </h2>
          <div className="card-grid">
            {ctfLabs.map((lab) => (
              <article className="card" data-reveal key={lab.title}>
                <h3>{lab.title}</h3>
                <p className="card-tagline">{lab.tagline}</p>
                <p className="card-desc">{lab.description}</p>
              </article>
            ))}
          </div>
          <p className="section-note" data-reveal>
            Full write-ups are being documented on{' '}
            <a href="https://github.com/Sidhanshi1820" target="_blank" rel="noreferrer">GitHub ↗</a>.
          </p>
        </div>
      </section>

      {/* ============ ACHIEVEMENTS ============ */}
      <section className="section" id="achievements">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>Achievements</p>
          <h2 className="section-title" data-reveal>
            Platforms I practice on.
          </h2>
          <div className="platform-grid">
            {platforms.map((p) => (
              <a
                className="platform-card"
                data-reveal
                key={p.label}
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="platform-glyph" aria-hidden="true">
                  <Icon d={ICONS.layers} size={20} />
                </div>
                <h3>{p.label}</h3>
                <p className="platform-desc">{p.desc}</p>
                <span className="platform-link">Visit profile ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SKILLS & TOOLS ============ */}
      <section className="section" id="skills">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>Skills</p>
          <h2 className="section-title" data-reveal>
            Skills &amp; tools.
          </h2>
          <div className="skills-cat-grid">
            {skillCategories.map((cat) => (
              <div className="skill-cat" data-reveal key={cat.title}>
                <div className="skill-cat-head">
                  <Icon d={ICONS.grid} size={14} />
                  <h3>{cat.title}</h3>
                </div>
                <ul className="skill-cat-list">
                  {cat.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CERTIFICATIONS ============ */}
      <section className="section" id="certifications">
        <div className="wrap" data-reveal-group>
          <h2 className="section-title" data-reveal>
            Certifications
          </h2>
          <div className="cert-list">
            {certifications.map((c) => (
              <div className="cert-row" data-reveal key={c.name}>
                <span className="cert-medal" aria-hidden="true">
                  <Icon d={ICONS.award} size={18} />
                </span>
                <div>
                  <p className="cert-name">{c.name}</p>
                  <p className="cert-meta">{c.issuer} · {c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section" id="contact">
        <div className="wrap contact-wrap" data-reveal-group>
          <div className="contact-copy">
            <p className="eyebrow" data-reveal>Contact me</p>
            <h2 className="section-title" data-reveal>
              Let's build something secure.
            </h2>
            <p className="contact-sub" data-reveal>
              Internships, research collabs, CTF teams — the inbox is open. Prefer email? Skip the
              form and write directly, or copy the address.
            </p>
            <div className="contact-actions" data-reveal>
              <a className="btn btn-solid" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                className={`btn btn-outline copy-btn${copied ? ' copied' : ''}`}
                onClick={copyEmail}
                aria-live="polite"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
          <form className="contact-form" data-reveal onSubmit={submitContact}>
            <label>
              <span>Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What are we building?"
              />
            </label>
            <button className="btn btn-solid" type="submit">
              Send message
            </button>
          </form>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <span>© {YEAR} {profile.name}</span>
        <nav className="footer-nav" aria-label="Footer">
          {NAV_LINKS.map((l) => (
            <button key={l.target} onClick={() => scrollToSection(l.target)}>
              {l.label}
            </button>
          ))}
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <span>Built with React · Three.js · GSAP</span>
      </footer>
    </main>
  )
}
