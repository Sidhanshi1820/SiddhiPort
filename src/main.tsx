import { createRoot } from 'react-dom/client'
import App from './App'
import { PrivacyPage } from './components/ui/PrivacyPage'
import { TermsPage } from './components/ui/TermsPage'
import './styles/global.css'

// StrictMode is intentionally off: the preloader/camera choreography relies on
// single-shot imperative setup (Lenis + ScrollTrigger + GSAP tweens), and the
// double-mount dev pass buys nothing here.

// Flat routes off the same shell: legal pages render instantly without the 3D
// portfolio, and SPA-fallback hosts (serve -s, static CDNs) serve them at
// /privacy and /terms.
const path = window.location.pathname.replace(/\/+$/, '')
const page = path.endsWith('/privacy') ? (
  <PrivacyPage />
) : path.endsWith('/terms') ? (
  <TermsPage />
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(page)
