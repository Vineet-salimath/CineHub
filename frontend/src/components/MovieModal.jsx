import { useEffect } from 'react'
import '../styles/modal.css'

const IMG_BASE = 'https://image.tmdb.org/t/p'

export default function MovieModal({ movie, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!movie) return null

  const backdrop = movie.backdrop_path ? `${IMG_BASE}/w1280${movie.backdrop_path}` : null
  const poster   = movie.poster_path   ? `${IMG_BASE}/w342${movie.poster_path}`  : null
  const rating   = movie.vote_average?.toFixed(1)
  const year     = movie.release_date?.slice(0, 4)
  const genres   = movie.genre_ids?.slice(0, 3) || []

  const genreNames = { 28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
    99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',
    10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV Movie',
    53:'Thriller',10752:'War',37:'Western' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {backdrop && (
          <div className="modal-backdrop-wrap">
            <img src={backdrop} alt={movie.title} className="modal-backdrop" />
            <div className="modal-backdrop-gradient" />
          </div>
        )}

        <div className="modal-body">
          {poster && <img src={poster} alt={movie.title} className="modal-poster" />}
          <div className="modal-details">
            <h2 className="modal-title">{movie.title}</h2>
            <div className="modal-meta">
              {rating && <span className="modal-rating"><span className="star">★</span> {rating}/10</span>}
              {year   && <span className="modal-year">{year}</span>}
              {movie.original_language && <span className="modal-badge">{movie.original_language.toUpperCase()}</span>}
            </div>
            {genres.length > 0 && (
              <div className="modal-genres">
                {genres.map(id => genreNames[id] && (
                  <span key={id} className="genre-tag">{genreNames[id]}</span>
                ))}
              </div>
            )}
            <p className="modal-overview">{movie.overview}</p>
            <div className="modal-votes">
              <span>👥 {movie.vote_count?.toLocaleString()} votes</span>
              {movie.popularity && <span>📈 Popularity: {Math.round(movie.popularity)}</span>}
            </div>
            <div className="modal-actions">
              <button className="btn-modal-play">▶ Watch Now</button>
              <button className="btn-modal-list">+ My List</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
