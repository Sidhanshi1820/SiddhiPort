// Production server: serves the built portfolio AND the /api/chat endpoint
// that proxies questions to Google Gemini. Replaces `serve -s dist` so the
// Gemini API key stays server-side and never ships to the browser.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

// Local-dev convenience: pick up .env if present (Render injects env itself).
try {
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {
  // no .env — fine
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
}

const SYSTEM_PROMPT = `You are the assistant embedded in Sidhanshi Srivastava's portfolio website. Facts you know — never invent portfolio facts beyond these:
- B.Tech CSE (Cyber Security) at NIET, Greater Noida, UP, India (2024, pursuing), CGPA 8.4. Based in Greater Noida.
- Skills: Python, C, HTML, JavaScript; TCP/IP, DNS, HTTP/HTTPS, packet analysis, network scanning; Wireshark, Nmap; Kali Linux, Arch, Ubuntu, Windows, Docker, Git; penetration testing, Metasploit, Burp Suite, OWASP Top 10, SQLi & XSS, CTF challenges; SOC analysis, SIEM, Aircrack-ng, incident response, log analysis; local LLM deployment, PyTorch, LangChain, Gemini API, security automation.
- Projects: 01 FAKE WI-FI DETECTOR — Python tool with a locally hosted Qwen LLM that flags rogue access points and deauth floods in real time from Wireshark/Aircrack-ng captures, no cloud. 02 CRYPTOGRAPHIC SYSTEM — automated cryptographic key-management platform, FastAPI + Redis + Celery, scikit-learn/PyTorch anomaly detection, built around the CIA triad. 03 SECURE EVENT MANAGER — HTML/CSS/JS front end, PHP + MySQL back end over REST/JSON, hardened data flow.
- Certifications: Security Analyst Job Simulation (Tata · Forage, Jul 2025); Python Programming Internship (CodSoft, Jul 2025); Introduction to Cybersecurity (Cisco, Feb 2026).
- Contact: sidhanshisrivastava00@gmail.com · github.com/Sidhanshi1820 · linkedin.com/in/sidhanshi-cybersecurity. Open to cybersecurity internships.
Style: friendly and concise — short plain-text lines, under 120 words unless the visitor clearly wants detail. Portfolio questions: answer only from the facts above and say honestly when something isn't listed. Any other general question (study tips, tools, career advice, small talk): just answer helpfully like a knowledgeable friend. Never claim to be a human; you're the site's assistant.`

// Light per-IP rate limit so a bot can't burn the Gemini quota.
const buckets = new Map()
function limited(ip) {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  b.count += 1
  return b.count > 20
}

async function askGemini(message, history) {
  const contents = [...history, { from: 'user', text: message }].map((m) => ({
    role: m.from === 'bot' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    },
  )
  if (!res.ok) throw new Error(`gemini ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('')
  if (!text) throw new Error('empty reply')
  return text
}

const server = http.createServer((req, res) => {
  let url
  try {
    url = new URL(req.url, `http://${req.headers.host}`)
  } catch {
    res.writeHead(400).end()
    return
  }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown'
    if (limited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'rate_limited' }))
      return
    }
    let body = ''
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 4096) req.destroy()
      body += chunk
    })
    req.on('end', async () => {
      try {
        const { message, history } = JSON.parse(body || '{}')
        if (typeof message !== 'string' || !message.trim() || message.length > 600) {
          res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'bad_request' }))
          return
        }
        if (!process.env.GEMINI_API_KEY) {
          // Client falls back to its built-in portfolio answers.
          res.writeHead(501, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'no_key' }))
          return
        }
        const hist = (Array.isArray(history) ? history.slice(-6) : [])
          .filter((h) => h && typeof h.text === 'string')
          .map((h) => ({ from: h.from === 'bot' ? 'bot' : 'user', text: String(h.text).slice(0, 500) }))
        const reply = await askGemini(message.trim(), hist)
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ reply }))
      } catch (err) {
        console.error('chat error:', err.message)
        res.writeHead(502, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'ai_failed' }))
      }
    })
    return
  }

  // Static files with SPA fallback (same behaviour as `serve -s dist`).
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400).end()
    return
  }
  if (pathname.includes('..')) {
    res.writeHead(403).end()
    return
  }
  let file = path.join(DIST, pathname === '/' ? 'index.html' : pathname)
  if (!path.extname(file)) file = path.join(DIST, 'index.html') // extensionless → app shell
  fs.readFile(file, (err, data) => {
    if (err) {
      // unknown path → app shell (client routes /privacy, /terms, /health)
      fs.readFile(path.join(DIST, 'index.html'), (err2, shell) => {
        if (err2) {
          res.writeHead(404).end('not found')
          return
        }
        res.writeHead(200, { 'Content-Type': MIME['.html'] }).end(shell)
      })
      return
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    }).end(data)
  })
})

server.listen(PORT, () => {
  console.log(`portfolio running on http://localhost:${PORT}`)
  console.log(`gemini key: ${process.env.GEMINI_API_KEY ? 'configured' : 'NOT set — chat falls back to local answers'}`)
})
