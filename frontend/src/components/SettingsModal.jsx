import { useState, useEffect } from 'react'
import '../styles/settings-modal.css'

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="setting-row">
      <div className="setting-text">
        <span className="setting-label">{label}</span>
        {description && <span className="setting-desc">{description}</span>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        className={`toggle-btn${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  )
}

export default function SettingsModal({ onClose }) {
  const [darkMode,    setDarkModeState] = useState(() => localStorage.getItem('theme') !== 'light')
  const [autoplay,    setAutoplay]      = useState(() => localStorage.getItem('autoplay') !== 'false')
  const [notifs,      setNotifs]        = useState(() => localStorage.getItem('notifs') !== 'false')
  const [hdQuality,   setHdQuality]     = useState(() => localStorage.getItem('quality') !== 'sd')

  /* Apply dark/light mode */
  const setDarkMode = (val) => {
    setDarkModeState(val)
    const theme = val ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }
  const savePref = (key, val, setter) => { setter(val); localStorage.setItem(key, String(val)) }

  /* Close on Escape */
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sm-panel" role="dialog" aria-label="Settings">

        {/* Header */}
        <div className="sm-header">
          <div className="sm-header-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M10 1v2m0 14v2M1 10h2m14 0h2m-3.93-6.07-1.41 1.41M5.34 14.66l-1.41 1.41m12.14 0-1.41-1.41M5.34 5.34 3.93 3.93" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="sm-title">Settings</h2>
            <p className="sm-subtitle">Customize your CineHub experience</p>
          </div>
          <button className="sm-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="sm-body">

          {/* ── Appearance ── */}
          <section className="sm-section">
            <h3 className="sm-section-title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.8"/>
                <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M3.2 3.2l1.1 1.1M9.7 9.7l1.1 1.1M10.8 3.2l-1.1 1.1M4.3 9.7l-1.1 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Appearance
            </h3>

            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              label="Cinematic Dark Mode"
              description="Deep black premium theme. Recommended for movie viewing."
            />

            <div className="theme-preview">
              <div className={`theme-chip${darkMode ? ' active' : ''}`} onClick={() => setDarkMode(true)}>
                <div className="chip-swatch dark-swatch" />
                <span>Dark</span>
              </div>
              <div className={`theme-chip${!darkMode ? ' active' : ''}`} onClick={() => setDarkMode(false)}>
                <div className="chip-swatch light-swatch" />
                <span>Light</span>
              </div>
            </div>
          </section>

          <div className="sm-divider" />

          {/* ── Playback ── */}
          <section className="sm-section">
            <h3 className="sm-section-title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polygon points="2,1 12,7 2,13" fill="currentColor" opacity="0.8"/>
              </svg>
              Playback
            </h3>

            <Toggle
              checked={autoplay}
              onChange={(v) => savePref('autoplay', v, setAutoplay)}
              label="Autoplay Next Episode"
              description="Automatically play the next title in a series."
            />

            <Toggle
              checked={hdQuality}
              onChange={(v) => savePref('quality', v ? 'hd' : 'sd', setHdQuality)}
              label="Stream in 4K HDR"
              description="Best quality, uses more bandwidth."
            />
          </section>

          <div className="sm-divider" />

          {/* ── Notifications ── */}
          <section className="sm-section">
            <h3 className="sm-section-title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1a5 5 0 015 5v2l1.5 2H.5L2 8V6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M5.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Notifications
            </h3>

            <Toggle
              checked={notifs}
              onChange={(v) => savePref('notifs', v, setNotifs)}
              label="Push Notifications"
              description="Get notified about new releases and recommendations."
            />
          </section>

          <div className="sm-divider" />

          {/* ── Account ── */}
          <section className="sm-section">
            <h3 className="sm-section-title">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Account
            </h3>
            <div className="account-info">
              <div className="account-row">
                <span className="account-label">Plan</span>
                <span className="account-val premium-val">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1l1.1 2.4L9 3.6l-2 1.9.5 2.8L5 7l-2.5 1.3.5-2.8L1 3.6l2.9-.2L5 1z" fill="#f5c518"/>
                  </svg>
                  Premium
                </span>
              </div>
              <div className="account-row">
                <span className="account-label">Billing Cycle</span>
                <span className="account-val">Monthly</span>
              </div>
              <div className="account-row">
                <span className="account-label">Next Renewal</span>
                <span className="account-val">March 19, 2026</span>
              </div>
              <div className="account-row">
                <span className="account-label">Screens</span>
                <span className="account-val">Up to 5 devices</span>
              </div>
            </div>
          </section>
        </div>

        <div className="sm-footer">
          <button className="sm-save-btn" onClick={onClose}>Save & Close</button>
        </div>
      </div>
    </div>
  )
}
