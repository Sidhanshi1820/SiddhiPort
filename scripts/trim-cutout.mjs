// Removes the leftover background strip on the right edge of
// src/assets/portrait-cutout.png. Finds the rightmost opaque column run that
// is separated from the main subject by a transparent gap and erases it.
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const file = path.join(root, 'src/assets/portrait-cutout.png')

const ALPHA_T = 8 // anything below this counts as transparent
const GAP_THRESHOLD = 14 // transparent columns that separate strip from subject

const { width, height } = await sharp(file).metadata()
const raw = await sharp(file).raw().toBuffer()

const colMax = new Float64Array(width)
for (let x = 0; x < width; x++) {
  let max = 0
  for (let y = 0; y < height; y++) {
    const a = raw[(y * width + x) * 4 + 3]
    if (a > max) max = a
  }
  colMax[x] = max
}

// report opaque runs so we can see subject vs stray strip
const runs = []
let start = -1
for (let x = 0; x < width; x++) {
  const opaque = colMax[x] > ALPHA_T
  if (opaque && start === -1) start = x
  if (!opaque && start !== -1) {
    runs.push([start, x - 1])
    start = -1
  }
}
if (start !== -1) runs.push([start, width - 1])
console.log('opaque column runs:', JSON.stringify(runs))

// find rightmost run that has a transparent gap between it and the next run
// to its left — that's the stray strip.
let cutFrom = -1
for (let r = runs.length - 1; r >= 1; r--) {
  const gap = runs[r][0] - runs[r - 1][1] - 1
  if (gap >= GAP_THRESHOLD) {
    cutFrom = runs[r][0]
    console.log(`stray strip: columns ${runs[r][0]}–${runs[r][1]} (gap ${gap}px to subject)`)
    break
  }
}

if (cutFrom === -1) {
  console.log('no separated strip found — nothing to erase')
  process.exit(0)
}

for (let x = cutFrom; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const i = (y * width + x) * 4
    raw[i] = 0
    raw[i + 1] = 0
    raw[i + 2] = 0
    raw[i + 3] = 0
  }
}

await sharp(raw, { raw: { width, height, channels: 4 } }).png().toFile(file)
console.log(`erased columns ${cutFrom}–${width - 1}, saved ${file}`)
