import { useState } from 'react'
import axios from 'axios'
import '../styles/auth.css'

const API = import.meta.env.VITE_API_BASE_URL

/* ── SVG Logo (inline, same as Navbar) ── */
function AuthLogo() {
  return (
    <svg width="160" height="44" viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" aria-label="CineHub">
      <defs>
        <linearGradient id="aLogoRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#b20710" />
        </linearGradient>
        <filter id="aLogoGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="4" y="8" width="62" height="62" rx="13" fill="#0b0b0f" stroke="url(#aLogoRed)" strokeWidth="2" opacity="0.9" />
      <rect x="4" y="8" width="62" height="62" rx="13" fill="url(#aLogoRed)" opacity="0.12" />
      <rect x="4" y="20" width="8" height="5" rx="1.5" fill="url(#aLogoRed)" opacity="0.8" />
      <rect x="4" y="46" width="8" height="5" rx="1.5" fill="url(#aLogoRed)" opacity="0.8" />
      <rect x="58" y="20" width="8" height="5" rx="1.5" fill="url(#aLogoRed)" opacity="0.8" />
      <rect x="58" y="46" width="8" height="5" rx="1.5" fill="url(#aLogoRed)" opacity="0.8" />
      <polygon points="28,26 52,39 28,52" fill="url(#aLogoRed)" filter="url(#aLogoGlow)" opacity="0.95" />
      <text x="82" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="white" letterSpacing="-1.5">Cine</text>
      <text x="177" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="url(#aLogoRed)" letterSpacing="-1.5">Hub</text>
    </svg>
  )
}

/* ── Eye toggle icon ── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

/* ── Password field with eye toggle ── */
function PasswordField({ name, placeholder, value, onChange, disabled, label }) {
  const [show, setShow] = useState(false)
  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="pw-wrap">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          className="input-field pw-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={name === 'password' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          className="pw-eye"
          onClick={() => setShow(p => !p)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ userId: '', username: '', email: '', phone: '', password: '', confirmPassword: '' })

  const change = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError('') }

  const register = async (e) => {
    e.preventDefault()
    if (!form.userId || !form.username || !form.email || !form.phone || !form.password) return setError('All fields are required')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    try {
      const r = await axios.post(`${API}/auth/register`, {
        userId: form.userId, username: form.username,
        email: form.email, phone: form.phone, password: form.password
      })
      if (r.data.success) onLoginSuccess(r.data.token, r.data.user)
    } catch (err) { setError(err.response?.data?.error || 'Registration failed') }
    finally { setLoading(false) }
  }

  const login = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) return setError('Username and password are required')
    setLoading(true)
    try {
      const r = await axios.post(`${API}/auth/login`, { username: form.username, password: form.password })
      if (r.data.success) onLoginSuccess(r.data.token, r.data.user)
    } catch (err) { setError(err.response?.data?.error || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const switchMode = () => {
    setIsLogin(p => !p); setError('')
    setForm({ userId: '', username: '', email: '', phone: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="auth-page">
      {/* Cinematic ambient background */}
      <div className="auth-ambient">
        <div className="amb-orb amb-1" />
        <div className="amb-orb amb-2" />
        <div className="amb-orb amb-3" />
        <div className="amb-noise" />
      </div>

      {/* Centered container */}
      <div className="auth-center">
        {/* Logo */}
        <div className="auth-logo-wrap">
          <AuthLogo />
          <p className="auth-tagline">Premium Streaming. Unlimited Cinema.</p>
        </div>

        {/* Glass card */}
        <div className="auth-card">
          {/* Tab switcher */}
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={isLogin}
              className={`auth-tab${isLogin ? ' active' : ''}`}
              onClick={() => { if (!isLogin) switchMode() }}
            >
              Sign In
            </button>
            <button
              role="tab"
              aria-selected={!isLogin}
              className={`auth-tab${!isLogin ? ' active' : ''}`}
              onClick={() => { if (isLogin) switchMode() }}
            >
              Create Account
            </button>
          </div>

          <div className="auth-form-body">
            {/* Error */}
            {error && (
              <div className="auth-error" role="alert">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="7" stroke="#ff1a1a" strokeWidth="1.2"/><path d="M7.5 4.5v4m0 2h.01" stroke="#ff1a1a" strokeWidth="1.4" strokeLinecap="round"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={isLogin ? login : register} className="auth-form" noValidate>
              {/* Register fields */}
              {!isLogin && (
                <div className={`register-fields${!isLogin ? ' show' : ''}`}>
                  <div className="field-row-2">
                    <div className="field-group">
                      <label>User ID</label>
                      <input name="userId" type="text" className="input-field" placeholder="Unique identifier" value={form.userId} onChange={change} disabled={loading} autoComplete="username" />
                    </div>
                    <div className="field-group">
                      <label>Username</label>
                      <input name="username" type="text" className="input-field" placeholder="Display name" value={form.username} onChange={change} disabled={loading} autoComplete="nickname" />
                    </div>
                  </div>
                  <div className="field-row-2">
                    <div className="field-group">
                      <label>Email Address</label>
                      <input name="email" type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={change} disabled={loading} autoComplete="email" />
                    </div>
                    <div className="field-group">
                      <label>Phone</label>
                      <input name="phone" type="tel" className="input-field" placeholder="+1 555 000 0000" value={form.phone} onChange={change} disabled={loading} autoComplete="tel" />
                    </div>
                  </div>
                  <div className="field-row-2">
                    <PasswordField name="password" label="Password" placeholder="Min. 8 characters" value={form.password} onChange={change} disabled={loading} />
                    <PasswordField name="confirmPassword" label="Confirm Password" placeholder="Re-enter password" value={form.confirmPassword} onChange={change} disabled={loading} />
                  </div>
                </div>
              )}

              {/* Login fields */}
              {isLogin && (
                <div className="login-fields">
                  <div className="field-group">
                    <label>Username or User ID</label>
                    <input name="username" type="text" className="input-field" placeholder="Enter your username" value={form.username} onChange={change} disabled={loading} autoComplete="username" />
                  </div>
                  <PasswordField name="password" label="Password" placeholder="••••••••" value={form.password} onChange={change} disabled={loading} />
                </div>
              )}

              {/* CTA Button */}
              <button type="submit" className="auth-cta" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In to CineHub' : 'Create My Account'}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              {isLogin ? "New to CineHub?" : "Already a member?"}
              {' '}
              <button type="button" className="auth-switch-btn" onClick={switchMode} disabled={loading}>
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="auth-trust">
          {['🔒 Bank-grade Security', '🎬 10,000+ Titles', '⭐ 4K HDR Streaming', '🌐 Multi-device'].map(b => (
            <span key={b} className="trust-badge">{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}