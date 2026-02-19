import { useRef, useState } from 'react'
import '../styles/movie-row.css'

const IMG_BASE = 'https://image.tmdb.org/t/p'

export default function MovieRow({ title, movies, onSelectMovie }) {
  const rowRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 900, behavior: 'smooth' })
    }
  }

  const onMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - rowRef.current.offsetLeft)
    setScrollLeft(rowRef.current.scrollLeft)
  }
  const onMouseLeave = () => setIsDragging(false)
  const onMouseUp = () => setIsDragging(false)
  const onMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - rowRef.current.offsetLeft
    rowRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5
  }

  return (
    <div className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-controls">
          <button className="btn-scroll" onClick={() => scroll(-1)} aria-label="Previous">&#8592;</button>
          <button className="btn-scroll" onClick={() => scroll(1)} aria-label="Next">&#8594;</button>
        </div>
      </div>
      <div
        className="movie-scroll"
        ref={rowRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => onSelectMovie(movie)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectMovie(movie)}
          >
            {movie.poster_path ? (
              <img
                src={`${IMG_BASE}/w342${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                loading="lazy"
              />
            ) : (
              <div className="movie-no-poster">
                <span>🎬</span>
                <p>{movie.title}</p>
              </div>
            )}
            <div className="movie-card-info">
              <div className="card-rating">
                <span className="star">★</span>
                <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="card-badges">
                {movie.adult && <span className="badge">18+</span>}
                <span className="badge">{movie.release_date?.slice(0, 4) || '—'}</span>
              </div>
            </div>
            <div className="movie-card-overlay">
              <h3 className="overlay-title">{movie.title}</h3>
              <p className="overlay-desc">{movie.overview?.slice(0, 80)}...</p>
              <button className="overlay-play">▶ Play</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
