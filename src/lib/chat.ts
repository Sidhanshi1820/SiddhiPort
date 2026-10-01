import { certifications, education, profile, projects, skillGroups } from '../data/portfolio'

// Chat brain, shared by the floating widget and the embedded contact chat.
// askAI tries the server's Gemini proxy (any question, real AI) and falls
// back to local keyword answers over portfolio.ts so the chat always works —
// even with no API key configured or when the network fails.

type Msg = { from: 'bot' | 'user'; text: string }

export function localReplyFor(raw: string): string {
  const t = raw.toLowerCase()

  if (/\b(hi+|hello|hey|namaste|salam|hola)\b/.test(t)) {
    return `Hey! Tap a topic below, or ask things like "what tech does she use?", "tell me about the wi-fi detector", "is she open to internships?"`
  }
  if (/\b(thank|thanks|shukriya|dhanyavad|great|awesome|nice)/.test(t)) {
    return 'Anytime! If something here sparks an idea, the email button in the contact section is the fastest way to say hi.'
  }
  if (/\b(resume|cv)\b/.test(t)) {
    return `There's no resume file hosted here — email ${profile.email} and one will come right over.`
  }
  if (/\b(contact|email|mail|reach|hire|intern|connect|touch|social|linkedin|github|available)/.test(t)) {
    return `Fastest route: ${profile.email}\n\nGitHub: ${profile.socials[0].url}\nLinkedIn: ${profile.socials[1].url}\n\nShe's currently open to cybersecurity internships — SOC, security research, or anything where breaking things is the job.`
  }
  if (/\b(education|college|degree|cgpa|niet|study|student|btech|b\.tech|padhai)/.test(t)) {
    return `${education.degree}\n${education.school}\n${education.period} · CGPA ${education.cgpa}`
  }
  if (/\b(cert|certification|training|course|forage|cisco|codsoft)/.test(t)) {
    return `Certifications on record:\n\n${certifications
      .map((c) => `• ${c.name} — ${c.issuer}, ${c.year}`)
      .join('\n')}`
  }
  if (/\b(wi-?fi|wifi|rogue|detect|evil twin)/.test(t)) {
    const p = projects[0]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the case file card.`
  }
  if (/\b(crypto|encrypt|fastapi)/.test(t)) {
    const p = projects[1]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the case file card.`
  }
  if (/\b(event|manager|php|mysql)/.test(t)) {
    const p = projects[2]
    return `${p.index} · ${p.title} (${p.tagline})\n\n${p.description}\n\nLive and source links sit on the case file card.`
  }
  if (/\b(skill|tech|stack|technolog|language|tools|know)/.test(t)) {
    return `The full stack:\n\n${skillGroups.map((g) => `${g.title}: ${g.skills.join(', ')}`).join('\n')}`
  }
  if (/\b(project|case|work|build|portfolio)/.test(t)) {
    return `Three case files live on the site:\n\n${projects
      .map((p) => `${p.index} · ${p.title} — ${p.tagline}`)
      .join('\n')}\n\nAsk about any one by name, like "wi-fi detector".`
  }
  if (/\b(who|about|intro|sidhanshi|yourself|kaun|location|where|from|noida)/.test(t)) {
    return `${profile.name} — ${profile.role}, based in ${profile.location}.\n\n${profile.availability}`
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
