import type { CSSProperties } from 'react'
import {
  NAV_LINKS,
  certifications,
  education,
  profile,
  projects,
  skillGroups,
} from '../../data/portfolio'
import { scrollToSection } from '../../lib/scrollState'

const YEAR = new Date().getFullYear()

export function Overlay() {
  return (
    <main id="page">
      {/* ============ HERO ============ */}
      <section className="section section-hero" id="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow" data-hero>{`// secops.portfolio — sidhanshi`}</p>
          <h1 className="hero-title" data-hero>
            <span className="hero-line">{profile.firstName}</span>
            <span className="hero-line hero-line-accent">{profile.lastName}</span>
          </h1>
          <p className="hero-role" data-hero>{profile.role}</p>
          <p className="hero-tagline" data-hero>{profile.tagline}</p>
          <div className="hero-actions" data-hero>
            <button className="btn btn-primary" onClick={() => scrollToSection('#work-1')} data-cursor="link">
              View case files
            </button>
            <button className="btn btn-ghost" onClick={() => scrollToSection('#contact')} data-cursor="link">
              Open uplink
            </button>
          </div>
        </div>
        <div className="scroll-hint" data-hero>
          <span className="scroll-hint-line" aria-hidden="true" />
          Scroll
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section section-about" id="about">
        <div className="about-inner" data-reveal-group>
          <div>
            <p className="eyebrow" data-reveal>{'// 01 — identity'}</p>
            <h2 className="section-title" data-reveal>
              Breaking things to understand
              <br />
              how to defend them.
            </h2>
          </div>
          <div>
            <p className="body-text" data-reveal>
              I'm a B.Tech Computer Science student specializing in Cyber Security at NIET, Greater
              Noida. My work spans the full stack of defense — writing detection tools in Python,
              dissecting packets in Wireshark, probing web apps with Burp Suite, and deploying local
              LLMs that reason over security data instead of shipping it to someone else's cloud.
            </p>
            <p className="body-text" data-reveal>
              Recent builds include an AI-based rogue Wi-Fi detector, an AI-driven cryptographic
              management platform, and a secure event management system designed around the CIA
              triad — plus the CTF reps and simulation certs to back the curiosity up.
            </p>
            <dl className="stat-panel" data-reveal>
              <p className="panel-title">system.status</p>
              {profile.stats.map((stat) => (
                <div className="stat-row" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="stat-panel log-panel" data-reveal>
              <p className="panel-title">training.log</p>
              <div className="log-row log-row--head">
                <span className="log-name">{education.degree}</span>
                <span className="log-meta">{education.period} · CGPA {education.cgpa}</span>
                <span className="log-sub">{education.school}</span>
              </div>
              {certifications.map((cert) => (
                <div className="log-row" key={cert.name}>
                  <span className="log-name">{cert.name}</span>
                  <span className="log-meta">{cert.issuer} · {cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CASE FILES ×3 ============ */}
      {projects.map((project, i) => (
        <section
          className={`section section-work ${i % 2 === 0 ? 'section-work--right' : 'section-work--left'}`}
          id={`work-${i + 1}`}
          key={project.index}
        >
          <div className="work-card" data-reveal-group>
            <p className="eyebrow" data-reveal>
              {i === 0 ? '// 02 — case files' : '// 02 — case files · cont.'}
            </p>
            <article className="work-card-inner" data-reveal style={{ '--card-accent': project.accent } as CSSProperties}>
              <div className="work-meta">
                <span className="work-index">{project.index}</span>
                <span className="work-count">/ 0{projects.length}</span>
              </div>
              <h3 className="work-title">{project.title}</h3>
              <p className="work-tagline">{project.tagline}</p>
              <p className="work-desc">{project.description}</p>
              <ul className="chips">
                {project.tech.map((tech) => (
                  <li className="chip" key={tech}>{tech}</li>
                ))}
              </ul>
              <div className="work-links">
                <a className="btn btn-ghost" href={project.links.live} target="_blank" rel="noreferrer" data-cursor="link">
                  Live ↗
                </a>
                <a className="btn btn-ghost" href={project.links.source} target="_blank" rel="noreferrer" data-cursor="link">
                  Source ↗
                </a>
              </div>
            </article>
          </div>
        </section>
      ))}

      {/* ============ SKILLS ============ */}
      <section className="section section-skills" id="skills">
        <div className="skills-inner" data-reveal-group>
          <p className="eyebrow" data-reveal>{'// 03 — protocol stack'}</p>
          <h2 className="section-title" data-reveal>
            Systems
            <br />
            &amp; craft.
          </h2>
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <div className="skill-group" data-reveal key={group.title}>
                <h3>{group.title}</h3>
                <ul className="chips">
                  {group.skills.map((skill) => (
                    <li className="chip" key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section section-contact" id="contact">
        <div className="contact-inner" data-reveal-group>
          <p className="eyebrow" data-reveal>{'// 04 — uplink'}</p>
          <h2 className="contact-title" data-reveal>
            Let's build
            <br />
            <span>the future.</span>
          </h2>
          <p className="contact-sub" data-reveal>{profile.availability}</p>
          <div className="contact-actions" data-reveal>
            <a className="btn btn-primary" href={`mailto:${profile.email}`} data-cursor="link">
              {profile.email}
            </a>
          </div>
          <nav className="socials" data-reveal aria-label="Social links">
            {profile.socials.map((social) => (
              <a key={social.label} className="social-link" href={social.url} target="_blank" rel="noreferrer" data-cursor="link">
                {social.label} ↗
              </a>
            ))}
          </nav>
        </div>
        <footer className="footer">
          <span>© {YEAR} {profile.name}</span>
          <span className="footer-nav">
            {NAV_LINKS.map((link) => (
              <button key={link.target} onClick={() => scrollToSection(link.target)} data-cursor="link">
                {link.label}
              </button>
            ))}
          </span>
          <span>React · Three.js · GSAP</span>
        </footer>
      </section>
    </main>
  )
}
