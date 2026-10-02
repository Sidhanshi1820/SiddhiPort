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
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
}

// Security headers on every response (API + static).
function secure(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
}

const SYSTEM_PROMPT = `You are the assistant embedded in Sidhanshi Srivastava's portfolio website. Facts you know — never invent portfolio facts beyond these:
- B.Tech CSE (Cyber Security) at NIET, Greater Noida, UP, India (2024, pursuing), CGPA 8.4. Based in Greater Noida.
- Skills: Python, C, HTML, JavaScript; TCP/IP, DNS, HTTP/HTTPS, packet analysis, network scanning; Wireshark, Nmap; Kali Linux, Arch, Ubuntu, Windows, Docker, Git; penetration testing, Metasploit, Burp Suite, OWASP Top 10, SQLi & XSS, CTF challenges; Aircrack-ng, incident response, log analysis; local LLM deployment, PyTorch, LangChain, Gemini API, security automation.
- Projects: 01 FAKE WI-FI DETECTOR — Python tool with a locally hosted Qwen LLM that flags rogue access points and deauth floods in real time from Wireshark/Aircrack-ng captures, no cloud. 02 CRYPTOGRAPHIC SYSTEM — automated cryptographic key-management platform, FastAPI + Redis + Celery, scikit-learn/PyTorch anomaly detection, built around the CIA triad. 03 EVENT MANAGEMENT SYSTEM — HTML/CSS/JS front end, PHP + MySQL back end over REST/JSON, hardened data flow.
- Certifications: Security Analyst Job Simulation (Tata · Forage, Jul 2025); Python Programming Internship (CodSoft, Jul 2025); Introduction to Cybersecurity (Cisco, Feb 2026).
- Contact: sidhanshisrivastava00@gmail.com · github.com/Sidhanshi1820 · linkedin.com/in/sidhanshi-cybersecurity. Open to cybersecurity internships. Resume: /Sidhanshi-Srivastava-Resume.pdf
Style: friendly and concise — short plain-text lines, under 120 words unless the visitor clearly wants detail. Portfolio questions: answer only from the facts above and say honestly when something isn't listed. Any other general question (study tips, tools, career advice, small talk): just answer helpfully like a knowledgeable friend. Never claim to be a human; you're the site's assistant.`

// Per-IP rate limit. Behind Render's proxy all sockets share one address, so
// attribute by the forwarding hop. Render APPENDS to x-forwarded-for, so the
// rightmost entry is the address it observed (the leftmost is client-supplied
// and therefore spoofable).
const buckets = new Map()
const RATE_LIMIT = 20
const RATE_WINDOW = 60_000
let lastSweep = 0

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length) {
    return fwd.split(',').at(-1).trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

function limited(ip) {
  const now = Date.now()
  // Sweep expired entries at most once a minute so the map can't grow forever
  // without turning every request into a full scan.
  if (buckets.size > 2000 && now - lastSweep > 60_000) {
    lastSweep = now
    for (const [k, v] of buckets) {
      if (now > v.reset) buckets.delete(k)
    }
  }
  const b = buckets.get(ip)
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return false
  }
  b.count += 1
  return b.count > RATE_LIMIT
}

async function askGemini(message, history, signal) {
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
      signal,
    },
  )
  if (!res.ok) throw new Error(`gemini ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('')
  if (!text) throw new Error('empty reply')
  return text
}

const server = http.createServer(async (req, res) => {
  secure(res)

  // A dead client must never crash the process or waste Gemini quota.
  req.on('error', () => {})
  res.on('error', () => {})

  let url
  try {
    url = new URL(req.url, `http://${req.headers.host}`)
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end()
    return
  }

  // ---------- /api/chat ----------
  if (url.pathname === '/api/chat') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', Allow: 'POST' })
      res.end(JSON.stringify({ error: 'method_not_allowed' }))
      return
    }
    if (limited(clientIp(req))) {
      res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'rate_limited' }))
      return
    }

    let body = ''
    let oversized = false
    req.on('data', (chunk) => {
      // Answer 413 on the FIRST oversize chunk and stop buffering — otherwise
      // a huge upload is fully buffered before we ever reply.
      if (oversized) return
      body += chunk
      if (body.length > 4096) {
        oversized = true
        res.writeHead(413, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'too_large' }))
        req.destroy()
      }
    })

    req.on('end', async () => {
      if (oversized) return // already answered 413
      // Stop the upstream call if the visitor closes the tab mid-request.
      // Must listen on `res`, not `req` — a consumed request emits 'close'
      // after every normal completion, which would abort every reply.
      const abort = new AbortController()
      res.on('close', () => {
        if (!res.writableFinished) abort.abort()
      })
      const timeout = setTimeout(() => abort.abort(), 15_000)
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
        const reply = await askGemini(message.trim(), hist, abort.signal)
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ reply }))
      } catch (err) {
        console.error('chat error:', err.message)
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'ai_failed' }))
        }
      } finally {
        clearTimeout(timeout)
      }
    })
    return
  }

  // ---------- static files + SPA fallback ----------
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end()
    return
  }
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' }).end()
    return
  }
  // A null byte makes fs.readFile throw synchronously (not via the callback),
  // which would escape as an unhandled rejection and kill the process.
  if (pathname.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end()
    return
  }

  const serves = path.join(DIST, pathname === '/' ? 'index.html' : pathname)
  const hasExtension = Boolean(path.extname(serves))

  fs.readFile(serves, (err, data) => {
    if (err) {
      if (hasExtension) {
        // A missing real file (bad asset URL) must not masquerade as the app.
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found')
        return
      }
      // Extensionless deep link (/privacy, /terms, /health) → app shell.
      fs.readFile(path.join(DIST, 'index.html'), (err2, shell) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found')
          return
        }
        res.writeHead(200, {
          'Content-Type': MIME['.html'],
          'Cache-Control': 'no-cache',
        }).end(shell)
      })
      return
    }
    const ext = path.extname(serves).toLowerCase()
    // Hashed build assets are immutable; the shell must always revalidate.
    const cache = serves.includes(`${path.sep}assets${path.sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache'
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cache,
    }).end(data)
  })
})

server.listen(PORT, () => {
  console.log(`portfolio running on http://localhost:${PORT}`)
  console.log(`gemini key: ${process.env.GEMINI_API_KEY ? 'configured' : 'NOT set — chat falls back to local answers'}`)
})
