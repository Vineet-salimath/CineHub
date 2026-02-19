import { useEffect } from 'react'
import '../styles/profile-modal.css'

const WATCH_HISTORY = [
  { id: 1, title: 'Inception', year: 2010, watchedAt: '2h ago', rating: 8.8 },
  { id: 2, title: 'The Dark Knight', year: 2008, watchedAt: 'Yesterday', rating: 9.0 },
  { id: 3, title: 'Interstellar', year: 2014, watchedAt: '3 days ago', rating: 8.7 },
  { id: 4, title: 'Dune: Part Two', year: 2024, watchedAt: 'Last week', rating: 8.5 },
  { id: 5, title: 'Oppenheimer', year: 2023, watchedAt: '2 weeks ago', rating: 8.9 },
]

const SAVED_LIST = [
  { id: 6, title: 'Poor Things', year: 2023, genre: 'Fantasy / Comedy' },
  { id: 7, title: 'Past Lives', year: 2023, genre: 'Romance / Drama' },
  { id: 8, title: 'Killers of the Flower Moon', year: 2023, genre: 'Crime / Drama' },
  { id: 9, title: 'The Zone of Interest', year: 2023, genre: 'Historical' },
]

export default function ProfileModal({ user, onClose }) {
  const displayName = user?.username || 'Member'
  const displayEmail = user?.email || 'premium@cinehub.com'
  const initial = displayName[0]?.toUpperCase() || 'M'

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
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-panel" role="dialog" aria-label="Profile">

        {/* Header */}
        <div className="pm-header">
          <div className="pm-avatar-wrap">
            <div className="pm-avatar">{initial}</div>
            <div className="pm-avatar-glow" />
          </div>
          <div className="pm-header-info">
            <h2 className="pm-name">{displayName}</h2>
            <p className="pm-email">{displayEmail}</p>
            <span className="pm-badge">
              <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1.1 2.4L9 3.6l-2 1.9.5 2.8L5 7l-2.5 1.3.5-2.8L1 3.6l2.9-.2L5 1z" fill="#f5c518"/>
              </svg>
              Premium Member
            </span>
          </div>
          <button className="pm-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Membership info */}
        <div className="pm-membership">
          <div className="pm-stat">
            <span className="pm-stat-value">∞</span>
            <span className="pm-stat-label">Movies</span>
          </div>
          <div className="pm-stat-divider" />
          <div className="pm-stat">
            <span className="pm-stat-value">4K</span>
            <span className="pm-stat-label">Quality</span>
          </div>
          <div className="pm-stat-divider" />
          <div className="pm-stat">
            <span className="pm-stat-value">5</span>
            <span className="pm-stat-label">Screens</span>
          </div>
          <div className="pm-stat-divider" />
          <div className="pm-stat">
            <span className="pm-stat-value" style={{ color: '#22c55e' }}>Active</span>
            <span className="pm-stat-label">Status</span>
          </div>
        </div>

        <div className="pm-body">
          {/* Watch History */}
          <section className="pm-section">
            <div className="pm-section-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <h3>Watch History</h3>
              <span className="pm-count">{WATCH_HISTORY.length}</span>
            </div>
            <div className="pm-list">
              {WATCH_HISTORY.map(item => (
                <div key={item.id} className="pm-list-item">
                  <div className="pm-list-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polygon points="2,1 10,6 2,11" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="pm-list-info">
                    <span className="pm-list-title">{item.title}</span>
                    <span className="pm-list-sub">{item.year}</span>
                  </div>
                  <div className="pm-list-meta">
                    <span className="pm-list-badge">★ {item.rating}</span>
                    <span className="pm-list-time">{item.watchedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saved List */}
          <section className="pm-section">
            <div className="pm-section-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h8a1 1 0 011 1v10l-5-3-5 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              <h3>My List</h3>
              <span className="pm-count">{SAVED_LIST.length}</span>
            </div>
            <div className="pm-list">
              {SAVED_LIST.map(item => (
                <div key={item.id} className="pm-list-item">
                  <div className="pm-list-icon saved">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2h8l-4 8-4-8z" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </div>
                  <div className="pm-list-info">
                    <span className="pm-list-title">{item.title}</span>
                    <span className="pm-list-sub">{item.year}</span>
                  </div>
                  <span className="pm-genre">{item.genre}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pm-footer">
          <p className="pm-footer-text">Member since 2026 · CineHub Premium</p>
        </div>
      </div>
    </div>
  )
}
