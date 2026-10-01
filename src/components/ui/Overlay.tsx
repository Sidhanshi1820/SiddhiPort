import { useState } from 'react'
import {
  NAV_LINKS,
  certifications,
  ctfLabs,
  education,
  profile,
  projects,
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
  phone: 'M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  link: 'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2 M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2',
  shield: 'M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z M9 12l2 2 4-4',
  award: 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M8.5 13.5L7 21l5-3 5 3-1.5-7.5',
  code: 'M8 6l-5 6 5 6 M16 6l5 6-5 6 M13 4l-2 16',
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
            <span className="info-line">
              <Icon d={ICONS.phone} /> {profile.phone}
            </span>
          </div>
          <div className="info-block">
            <p className="info-label">
              <Icon d={ICONS.award} /> Professional profiles
            </p>
            {profile.socials.map((s) => (
              <a key={s.label} className="info-line" href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <div className="info-socials" aria-label="Social platforms">
            {profile.socialIcons.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon d={ICONS.link} size={17} />
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

      {/* ============ CERTIFICATIONS ============ */}
      <section className="section" id="certifications">
        <div className="wrap" data-reveal-group>
          <p className="eyebrow" data-reveal>Certifications</p>
          <h2 className="section-title" data-reveal>
            Training on record.
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
            <p className="contact-phone" data-reveal>
              <Icon d={ICONS.phone} /> {profile.phone}
            </p>
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
