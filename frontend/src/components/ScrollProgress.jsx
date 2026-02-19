import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        height: '2.5px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #E50914, #ff1a1a)',
        boxShadow: '0 0 8px rgba(229,9,20,0.7)',
        zIndex: 99999,
        transition: 'width 0.1s ease',
        pointerEvents: 'none',
        borderRadius: '0 2px 2px 0',
      }}
      aria-hidden="true"
    />
  )
}
