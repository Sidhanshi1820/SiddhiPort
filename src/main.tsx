import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// StrictMode is intentionally off: the preloader/camera choreography relies on
// single-shot imperative setup (Lenis + ScrollTrigger + GSAP tweens), and the
// double-mount dev pass buys nothing here.
createRoot(document.getElementById('root')!).render(<App />)
