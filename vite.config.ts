import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base: the built site works when served from a domain root, a
  // sub-path (e.g. GitHub Pages project sites) or opened directly from disk.
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Deterministic split: react stack gets its own small chunk, gsap/lenis
        // another, and everything else third-party (three, fiber, drei,
        // postprocessing, drei's deps) lands in the 3D chunk that only the
        // lazy Experience import pulls in. Leaving react to Rollup's default
        // placement dropped it into the three chunk, forcing the entry to
        // load all 1.3 MB up front.
        manualChunks(id) {
          // Vite's dynamic-import preload helper must ship with the entry:
          // left to default placement it landed in the 3D chunk, and the
          // entry's static import of the helper pulled all 1.3 MB in up front.
          if (id.includes('vite/preload-helper')) return 'react'
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (/[\\/]node_modules[\\/](gsap|lenis)[\\/]/.test(id)) return 'motion'
          return 'three'
        },
      },
    },
  },
})
