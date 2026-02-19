import { useEffect, useState } from 'react'
import '../styles/hero.css'

const IMG_BASE = 'https://image.tmdb.org/t/p'

export default function MovieHero({ movie, onSelectMovie, heroIndex = 0, heroTotal = 1, onSlide }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [movie?.id])

  if (!movie) return null

  const backdrop = movie.backdrop_path
    ? `${IMG_BASE}/original${movie.backdrop_path}`
    : null

  const rating = movie.vote_average?.toFixed(1)
  const year   = movie.release_date?.slice(0, 4)

  return (
    <div className="hero">
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className={`hero-backdrop ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="hero-gradient" />
      <div className={`hero-content ${loaded ? 'visible' : ''}`}>
        <div className="hero-badge">🔥 Featured Today</div>
        <h1 className="hero-title">{movie.title}</h1>
        <div className="hero-meta">
          {rating && <span className="hero-rating"><span className="star">★</span> {rating}/10</span>}
          {year   && <span className="hero-year">{year}</span>}
          {movie.original_language && (
            <span className="hero-lang">{movie.original_language.toUpperCase()}</span>
          )}
        </div>
        <p className="hero-overview">{movie.overview?.slice(0, 200)}{movie.overview?.length > 200 ? '...' : ''}</p>
        <div className="hero-actions">
          <button className="btn-hero-play" onClick={() => onSelectMovie(movie)}>▶&nbsp; Play</button>
          <button className="btn-hero-info" onClick={() => onSelectMovie(movie)}>ℹ&nbsp; More Info</button>
        </div>

        {/* Slide dots */}
        {heroTotal > 1 && (
          <div className="hero-dots">
            {Array.from({ length: heroTotal }).map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === heroIndex ? ' active' : ''}`}
                onClick={() => onSlide?.(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
