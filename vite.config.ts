import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base: the built site works when served from a domain root, a
  // sub-path (e.g. GitHub Pages project sites) or opened directly from disk.
  base: './',
  plugins: [react()],
})
