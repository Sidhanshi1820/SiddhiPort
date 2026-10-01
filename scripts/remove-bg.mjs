// Removes the background from src/assets/portrait.jpg and writes a
// transparent cutout to src/assets/portrait-cutout.png.
// First run downloads the segmentation model (~40 MB) into node_modules.
import { removeBackground } from '@imgly/background-removal-node'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = path.join(root, 'src/assets/portrait.jpg')
const dest = path.join(root, 'src/assets/portrait-cutout.png')

console.log('removing background…')
// The library can't read local file paths directly — hand it a Blob.
const imageBlob = new Blob([fs.readFileSync(src)], { type: 'image/jpeg' })
const blob = await removeBackground(imageBlob, {
  output: { format: 'image/png', quality: 1 },
  progress: (key, current, total) => {
    if (key.startsWith('fetch')) {
      console.log(`model download ${(current / total * 100).toFixed(0)}%`)
    }
  },
})
const buf = Buffer.from(await blob.arrayBuffer())
fs.writeFileSync(dest, buf)
console.log('saved:', path.relative(root, dest), `(${Math.round(buf.length / 1024)} KB)`)
