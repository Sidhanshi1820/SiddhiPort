import { certifications, profile, projects, skillCategories } from '../data/portfolio'

// Chat brain, shared by the floating widget and the embedded contact chat.
// askAI tries the server's Gemini proxy (any question, real AI) and falls
// back to local keyword answers over portfolio.ts so the chat always works —
// even with no API key configured or when the network fails.

type Msg = { from: 'bot' | 'user'; text: string }

const RESUME_URL = '/Sidhanshi-Srivastava-Resume.pdf'

export function localReplyFor(raw: string): string {
  const t = raw.toLowerCase()

  // Specific topics first — greetings and politeness must never shadow them.
  if (/\b(resume|cv)/.test(t)) {
    return `The resume is hosted right on this site — it opens here: ${RESUME_URL} (also linked via the document icon in the hero bar).`
  }
  if (/\b(contact|email|mail|reach|hire|intern|connect|touch|social|linkedin|github|available)/.test(t)) {
    return `Fastest route: ${profile.email}\n\nGitHub: ${profile.socials[0].url}\nLinkedIn: ${profile.socials[1].url}\n\nShe's currently open to cybersecurity internships — SOC, security research, or anything where breaking things is the job.`
  }
  if (/\b(cert|certification|training|course|forage|cisco|codsoft)/.test(t)) {
    return `Certifications on record:\n\n${certifications
      .map((c) => `• ${c.name} — ${c.issuer}, ${c.year}`)
      .join('\n')}`
  }
  if (/\b(wi-?fi|wifi|rogue|detect|evil twin)/.test(t)) {
    const p = projects[0]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the project card.`
  }
  if (/\b(crypto|encrypt|fastapi)/.test(t)) {
    const p = projects[1]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the project card.`
  }
  if (/\b(event|manager|php|mysql)/.test(t)) {
    const p = projects[2]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the project card.`
  }
  if (/\b(skill|tech|stack|technolog|language|tool)/.test(t)) {
    return `The full stack:\n\n${skillCategories
      .map((c) => `${c.title}: ${c.skills.join(', ')}`)
      .join('\n')}`
  }
  if (/\b(project|case|work|build|portfolio)/.test(t)) {
    return `Three projects live on the site:\n\n${projects
      .map((p) => `${p.index} · ${p.title} — ${p.tagline}`)
      .join('\n')}\n\nAsk about any one by name, like "wi-fi detector".`
  }
  if (/\b(who|about|intro|sidhanshi|yourself|kaun|location|where|noida)/.test(t)) {
    return `${profile.name} — ${profile.role}, based in ${profile.location}.\n\n${profile.availability}`
  }
  if (/\b(hi+|hello|hey|namaste|salam|hola)\b/.test(t)) {
    return `Hey! Tap a topic below, or ask things like "what tech does she use?", "tell me about the wi-fi detector", "is she open to internships?"`
  }
  if (/\b(thank|thanks|shukriya|dhanyavad)\b/.test(t)) {
    return 'Anytime! If something here sparks an idea, the email button in the contact section is the fastest way to say hi.'
  }
  return `That one's outside my lane — I'm sharpest on skills, projects, certifications, education and contact. Try the buttons below, or ask "tell me about the wi-fi detector".`
}

export async function askAI(message: string, history: Msg[]): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.slice(0, 600),
        history: history.slice(-6).map((m) => ({ from: m.from, text: m.text })),
      }),
      signal: AbortSignal.timeout(25_000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.reply === 'string' && data.reply.trim()) {
        return data.reply
      }
    }
  } catch {
    // server down, no key, timeout — fall through to local answers
  }
  return localReplyFor(message)
}
