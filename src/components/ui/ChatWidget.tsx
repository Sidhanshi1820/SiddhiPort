import { useEffect, useRef, useState } from 'react'
import { profile } from '../../data/portfolio'
import { askAI } from '../../lib/chat'

// Portfolio assistant chat: one floating bubble (ChatWidget) that mounts the
// ChatPanel. Replies come from the server's Gemini proxy when a key is
// configured, with the local portfolio matcher as an always-works fallback
// (see lib/chat.ts).

type Msg = { from: 'bot' | 'user'; text: string }

const QUICK_CHIPS = ['Skills', 'Projects', 'Certifications', 'Education', 'Contact']

const WELCOME = `Hi! I'm the portfolio assistant. Ask me about ${profile.firstName}'s skills, projects, certifications, education or how to reach her — ask me anything else too.`

const CHAT_STYLES = `
  .cw-btn {
    position: fixed;
    bottom: 1.3rem;
    right: 1.3rem;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--gold-dim);
    color: var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 55;
    box-shadow: 0 6px 26px rgba(197, 160, 89, 0.2);
    transition: box-shadow 0.3s, transform 0.15s;
  }
  .cw-btn:hover { box-shadow: 0 8px 30px rgba(197, 160, 89, 0.4); transform: translateY(-2px); }
  .cw-btn:active { transform: scale(0.95); }
  .cw-panel {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--gold-dim);
    border-radius: 12px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.55);
    overflow: hidden;
  }
  .cw-panel-float {
    position: fixed;
    bottom: 5.6rem;
    right: 1.3rem;
    width: min(372px, calc(100vw - 2rem));
    height: min(540px, 72vh);
    height: min(540px, 72svh);
    z-index: 56;
  }
  .cw-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--line);
  }
  .cw-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 10px rgba(197, 160, 89, 0.7);
    animation: cw-pulse 2.2s ease-in-out infinite;
  }
  @keyframes cw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
  .cw-title {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .cw-close {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
  }
  .cw-close:hover { color: var(--ink); }
  .cw-log {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .cw-msg {
    max-width: 86%;
    padding: 0.55rem 0.8rem;
    border-radius: 10px;
    font-size: 0.85rem;
    line-height: 1.55;
    white-space: pre-line;
    color: var(--ink);
  }
  .cw-msg-bot { align-self: flex-start; background: var(--surface-2); border: 1px solid var(--gold-dim); }
  .cw-msg-user { align-self: flex-end; background: rgba(197, 160, 89, 0.14); border: 1px solid var(--gold-dim); }
  .cw-typing { display: inline-flex; gap: 4px; padding: 0.2rem 0; }
  .cw-typing span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--gold);
    animation: cw-bounce 1s ease-in-out infinite;
  }
  .cw-typing span:nth-child(2) { animation-delay: 0.15s; }
  .cw-typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes cw-bounce { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; } }
  .cw-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 0.7rem; }
  .cw-chip {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.06em;
    border: 1px solid var(--gold-dim);
    background: none;
    color: var(--muted);
    padding: 0.32rem 0.68rem;
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.3s, color 0.3s;
  }
  .cw-chip:hover { border-color: var(--gold); color: var(--gold); }
  .cw-input-row { display: flex; border-top: 1px solid var(--line); }
  .cw-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.85rem 1rem;
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }
  .cw-input::placeholder { color: var(--muted); }
  .cw-send {
    background: none;
    border: none;
    color: var(--gold);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0 1.1rem;
    cursor: pointer;
  }
  .cw-send:hover { color: var(--gold-light); }
`

export function ChatPanel({ variant = 'float', id }: { variant?: 'float' | 'card'; id?: string }) {
  const [messages, setMessages] = useState<Msg[]>([{ from: 'bot', text: WELCOME }])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)

  // Keep the newest message in view.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, typing])

  // Focus the input when the panel first appears.
  useEffect(() => {
    inputRef.current?.focus()
    return () => {
      mountedRef.current = false
    }
  }, [])

  const send = async (text: string) => {
    const clean = text.trim()
    if (!clean || typing) return
    const base = messages
    setMessages([...base, { from: 'user', text: clean }])
    setDraft('')
    setTyping(true)
    const reply = await askAI(clean, base)
    // The panel can unmount (closed) while the AI call is in flight.
    if (!mountedRef.current) return
    setMessages([...base, { from: 'user', text: clean }, { from: 'bot', text: reply }])
    setTyping(false)
    inputRef.current?.focus()
  }

  return (
    <div
      className={`cw-panel cw-panel-${variant}`}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-label="Portfolio chat"
    >
      <div className="cw-head">
        <span className="cw-dot" aria-hidden="true" />
        <span className="cw-title">Portfolio Assistant</span>
        {variant === 'float' && (
          <button className="cw-close" onClick={() => window.dispatchEvent(new Event('cw-close'))} aria-label="Close chat">
            ×
          </button>
        )}
      </div>

      <div className="cw-log" ref={logRef} data-lenis-prevent role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`cw-msg cw-msg-${m.from}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="cw-msg cw-msg-bot">
            <span className="cw-typing" aria-label="Assistant is typing">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
      </div>

      <div className="cw-chips">
        {QUICK_CHIPS.map((chip) => (
          <button key={chip} className="cw-chip" onClick={() => send(chip)} disabled={typing}>
            {chip}
          </button>
        ))}
      </div>

      <form
        className="cw-input-row"
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <input
          ref={inputRef}
          className="cw-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask me anything…"
          aria-label="Type your question"
          disabled={typing}
        />
        <button className="cw-send" type="submit" disabled={typing}>
          Send
        </button>
      </form>
    </div>
  )
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)

  // The panel lives in a portal-free fixed layer; the close button inside it
  // signals out via this custom event so state stays in one place.
  useEffect(() => {
    const onClose = () => setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('cw-close', onClose)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('cw-close', onClose)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      <style>{CHAT_STYLES}</style>
      <button
        className="cw-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat about skills, projects and portfolio'}
        aria-expanded={open}
        aria-controls="cw-panel"
      >
        {open ? (
          <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>×</span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.4c-.5.4-1.3 0-1.3-.7V5.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="9.5" r="1" fill="currentColor" />
            <circle cx="12.5" cy="9.5" r="1" fill="currentColor" />
            <circle cx="16" cy="9.5" r="1" fill="currentColor" />
          </svg>
        )}
      </button>

      {open && <ChatPanel variant="float" id="cw-panel" />}
    </>
  )
}
