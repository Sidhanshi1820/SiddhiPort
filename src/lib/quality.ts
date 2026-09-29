// Rough device tier so the 3D scene can trade fidelity for frame rate on
// weak or absent GPUs. Evaluated once at module load; ?quality=low|high in
// the URL overrides the probe (handy for testing the low tier on a fast rig).
export type QualityTier = 'high' | 'low'

function detectTier(): QualityTier {
  const forced = new URLSearchParams(window.location.search).get('quality')
  if (forced === 'low' || forced === 'high') return forced

  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 8
  if (cores <= 4 || memory <= 4) return 'low'

  // Software rasterizers and budget mobile GPUs never get the full stack.
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  let renderer = ''
  if (gl) {
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).toLowerCase()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
  if (/swiftshader|llvmpipe|software|mali|powervr|adreno [1-5]|intel hd/.test(renderer)) {
    return 'low'
  }
  return 'high'
}

export const QUALITY: QualityTier = detectTier()
export const LOW_END = QUALITY === 'low'
