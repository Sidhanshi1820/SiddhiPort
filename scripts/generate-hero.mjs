// Generates the cinematic hero portrait with Gemini's image model, using
// src/assets/portrait.jpg as the identity reference. Usage:
//   1. put GEMINI_API_KEY=... in .env (free key: aistudio.google.com/apikey)
//   2. npm run hero        (writes src/assets/hero-portrait.png)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

try {
  for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {
  // handled below
}

const key = process.env.GEMINI_API_KEY
if (!key) {
  console.error('GEMINI_API_KEY missing. Put it in .env:  GEMINI_API_KEY=yourkey')
  process.exit(1)
}

const PROMPT = `Create a high-end cinematic portfolio hero portrait for a professional creative portfolio. Use the uploaded personal photo as the exact identity and facial reference. Preserve her real facial features, skin tone, hairstyle, and natural appearance.

Composition: elegant waist-up portrait, subject positioned slightly to the right side of the frame, leaving generous dark negative space on the left for website text. Dark cinematic studio background with subtle warm brown/black tones, soft atmospheric texture, dramatic but natural lighting, warm golden highlights on the face, subtle rim light separating the subject from the background.

Mood: confident, artistic, sophisticated, cinematic, premium, calm and professional. Natural realistic photography, high-end editorial portfolio, refined color grading, realistic skin texture, soft depth of field, subtle film grain.

Aspect ratio: 16:9 wide website hero image. No text, no logos, no typography, no UI elements, no watermark. Keep the left side visually clean and dark for portfolio text overlay.`

const imageBase64 = fs.readFileSync(path.join(root, 'src/assets/portrait.jpg')).toString('base64')

async function generate(useImageConfig) {
  const body = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      ...(useImageConfig ? { imageConfig: { aspectRatio: '16:9' } } : {}),
    },
  }
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
    },
  )
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`
    return { error: msg }
  }
  const parts = data?.candidates?.[0]?.content?.parts || []
  const imgPart = parts.find((p) => p.inlineData)
  if (!imgPart) {
    const textPart = parts.find((p) => p.text)
    return { error: textPart ? `no image, model said: ${textPart.text.slice(0, 200)}` : 'no image in response' }
  }
  return { mime: imgPart.inlineData.mimeType, data: imgPart.inlineData.data }
}

let out = await generate(true)
if (out.error && /imageConfig|aspect|Unknown name/i.test(out.error)) {
  console.log('retrying without imageConfig…')
  out = await generate(false)
}
if (out.error) {
  console.error('FAILED:', out.error)
  process.exit(1)
}

const ext = out.mime.includes('png') ? 'png' : 'jpg'
const dest = path.join(root, 'src/assets/hero-portrait.' + ext)
fs.writeFileSync(dest, Buffer.from(out.data, 'base64'))
console.log('saved:', path.relative(root, dest), `(${Math.round(out.data.length * 0.75 / 1024)} KB)`)
console.log('next: import it in Overlay.tsx hero and rebuild')
