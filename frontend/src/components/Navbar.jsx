import { useState, useEffect, useRef } from 'react'
import '../styles/navbar.css'

/* ── Inline SVG Logo (Netflix-red, no orange) ── */
function CineHubLogo({ className = '' }) {
  return (
    <svg className={className} width="130" height="36" viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" aria-label="CineHub">
      <defs>
        <linearGradient id="logoRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#b20710" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Icon box */}
      <rect x="4" y="8" width="62" height="62" rx="13" fill="#0b0b0f" stroke="url(#logoRed)" strokeWidth="2" opacity="0.9" />
      <rect x="4" y="8" width="62" height="62" rx="13" fill="url(#logoRed)" opacity="0.12" />
      {/* Film-reel notches */}
      <rect x="4" y="20" width="8" height="5" rx="1.5" fill="url(#logoRed)" opacity="0.8" />
      <rect x="4" y="46" width="8" height="5" rx="1.5" fill="url(#logoRed)" opacity="0.8" />
      <rect x="58" y="20" width="8" height="5" rx="1.5" fill="url(#logoRed)" opacity="0.8" />
      <rect x="58" y="46" width="8" height="5" rx="1.5" fill="url(#logoRed)" opacity="0.8" />
      {/* Play triangle */}
      <polygon points="28,26 52,39 28,52" fill="url(#logoRed)" filter="url(#logoGlow)" opacity="0.95" />
      {/* Wordmark */}
      <text x="82" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="white" letterSpacing="-1.5">
        Cine
      </text>
      <text x="177" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="url(#logoRed)" letterSpacing="-1.5">
        Hub
      </text>
    </svg>
  )
}

const NAV_ITEMS = ['Home', 'Trending', 'Movies']

export default function Navbar({ user, activeCategory, setActiveCategory, onLogout, onOpenProfile, onOpenSettings, onHomeRefresh }) {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Close on Escape */
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') setDropdownOpen(false) }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [])

  const displayName = user?.username || 'Member'
  const displayEmail = user?.email || ''
  const initial = displayName[0]?.toUpperCase() || 'M'

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <button className="navbar-logo-btn" onClick={() => setActiveCategory('Home')} aria-label="Go home">
          <CineHubLogo className="navbar-logo-svg" />
        </button>

        {/* Nav links */}
        <div className="navbar-links">
          {NAV_ITEMS.map(cat => (
            <button
              key={cat}
              className={`nav-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => {
                if (cat === 'Home' && activeCategory === 'Home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  onHomeRefresh?.()
                } else {
                  setActiveCategory(cat)
                  if (cat === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Profile pill */}
        <div className="navbar-right">
          <div className="profile-pill" ref={dropdownRef}>
            <button
              className={`profile-trigger${dropdownOpen ? ' open' : ''}`}
              onClick={() => setDropdownOpen(p => !p)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span className="profile-avatar">
                <span className="avatar-glow" />
                {initial}
              </span>
              <span className="profile-name">{displayName}</span>
              <svg className={`chevron${dropdownOpen ? ' up' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            <div className={`profile-dropdown${dropdownOpen ? ' visible' : ''}`} role="menu">
              <div className="dropdown-header">
                <span className="dropdown-avatar">
                  <span className="avatar-glow-lg" />
                  {initial}
                </span>
                <div className="dropdown-user-info">
                  <span className="dropdown-name">{displayName}</span>
                  {displayEmail && <span className="dropdown-email">{displayEmail}</span>}
                  <span className="premium-badge">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1l1.1 2.4L9 3.6l-2 1.9.5 2.8L5 7l-2.5 1.3.5-2.8L1 3.6l2.9-.2L5 1z" fill="#f5c518"/>
                    </svg>
                    Premium Member
                  </span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="dropdown-menu-items">
                <button className="dropdown-item" role="menuitem" onClick={() => { setDropdownOpen(false); onOpenProfile?.() }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  My Profile
                </button>
                <button className="dropdown-item" role="menuitem" onClick={() => { setDropdownOpen(false); onOpenSettings?.() }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v1.5m0 11V15m7-7h-1.5M2.5 8H1m11.2-4.2-1.1 1.1M4.9 11.1l-1.1 1.1m9.3 0-1.1-1.1M4.9 4.9 3.8 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Settings
                </button>
              </div>

              <div className="dropdown-divider" />

              <button className="dropdown-item logout-item" onClick={() => { setDropdownOpen(false); onLogout() }} role="menuitem">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 11l3-3-3-3m3 3H5.5m3-6H3a1 1 0 00-1 1v10a1 1 0 001 1h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
