import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import MovieHero from '../components/MovieHero'
import MovieRow from '../components/MovieRow'
import MovieModal from '../components/MovieModal'
import Footer from '../components/Footer'
import ProfileModal from '../components/ProfileModal'
import SettingsModal from '../components/SettingsModal'
import '../styles/home.css'

const TMDB_KEY  = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const get       = (url) => axios.get(url)

function SkeletonRow({ title }) {
  return (
    <div className="movie-row">
      {title && <div className="row-header"><h2 className="row-title">{title}</h2></div>}
      <div className="skeleton-scroll">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    </div>
  )
}

function LoadMoreSpinner() {
  return (
    <div className="load-more-wrap">
      <div className="load-more-spinner" />
      <span>Loading more</span>
    </div>
  )
}

export default function HomePage({ user, onLogout }) {
  const [movies,   setMovies]  = useState({ trending: [], popular: [], topRated: [], upcoming: [] })
  const [pages,    setPages]   = useState({ trending: 1, popular: 1, topRated: 1, upcoming: 1 })
  const [loading,  setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error,    setError]   = useState('')
  const [activeCategory, setActiveCategory] = useState('Home')
  const [selectedMovie,  setSelectedMovie]  = useState(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const [trendingTab, setTrendingTab] = useState('today')
  const [trendingData, setTrendingData] = useState({ today: [], topRated: [], popularIndia: [], aiRec: [] })
  const [trendingLoading, setTrendingLoading] = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const sentinelRef = useRef(null)

  const fetchMovies = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [t, p, r, u] = await Promise.all([
        get(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}`),
        get(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`),
        get(`${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}`),
        get(`${TMDB_BASE}/movie/upcoming?api_key=${TMDB_KEY}`),
      ])
      setMovies({
        trending:  t.data.results || [],
        popular:   p.data.results || [],
        topRated:  r.data.results || [],
        upcoming:  u.data.results || [],
      })
      setPages({ trending: 1, popular: 1, topRated: 1, upcoming: 1 })
      setHeroIndex(0)
    } catch (err) {
      console.error('TMDB fetch error:', err)
      setError('Failed to load movies. Check your TMDB API key.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMovies() }, [fetchMovies])

  const heroMovies = useMemo(
    () => movies.trending.filter(m => m.backdrop_path).slice(0, 10),
    [movies.trending]
  )

  useEffect(() => {
    if (heroMovies.length < 2) return
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroMovies.length)
    }, 60000)
    return () => clearInterval(timer)
  }, [heroMovies.length])

  const heroMovie = heroMovies[heroIndex] || null

  const fetchMore = useCallback(async () => {
    if (loadingMore || loading) return
    setLoadingMore(true)
    try {
      const np = {
        trending: Math.min(pages.trending + 1, 500),
        popular:  Math.min(pages.popular  + 1, 500),
        topRated: Math.min(pages.topRated  + 1, 500),
        upcoming: Math.min(pages.upcoming  + 1, 500),
      }
      const [t, p, r, u] = await Promise.all([
        get(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${np.trending}`),
        get(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&page=${np.popular}`),
        get(`${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}&page=${np.topRated}`),
        get(`${TMDB_BASE}/movie/upcoming?api_key=${TMDB_KEY}&page=${np.upcoming}`),
      ])
      const unique = (prev, next) => {
        const ids = new Set(prev.map(m => m.id))
        return [...prev, ...(next || []).filter(m => !ids.has(m.id))]
      }
      setMovies(prev => ({
        trending:  unique(prev.trending,  t.data.results),
        popular:   unique(prev.popular,   p.data.results),
        topRated:  unique(prev.topRated,  r.data.results),
        upcoming:  unique(prev.upcoming,  u.data.results),
      }))
      setPages(np)
    } catch (err) {
      console.error('Load more error:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, loading, pages])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchMore() },
      { threshold: 0.1, rootMargin: '300px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchMore])

  useEffect(() => {
    if (activeCategory !== 'Trending') return
    if (trendingData[trendingTab]?.length > 0) return
    setTrendingLoading(true)
    const endpoints = {
      today:        `${TMDB_BASE}/trending/movie/day?api_key=${TMDB_KEY}`,
      topRated:     `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}`,
      popularIndia: `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&region=IN`,
      aiRec:        `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&sort_by=vote_average.desc&vote_count.gte=1000`,
    }
    get(endpoints[trendingTab])
      .then(r => setTrendingData(prev => ({ ...prev, [trendingTab]: r.data.results || [] })))
      .catch(err => console.error('Trending sub fetch error:', err))
      .finally(() => setTrendingLoading(false))
  }, [activeCategory, trendingTab])

  const handleHomeRefresh = useCallback(() => { fetchMovies() }, [fetchMovies])

  const filteredRows = () => {
    if (activeCategory === 'Movies') return [
      { title: ' Popular on CineHub', movies: movies.popular },
      { title: ' Top Rated All Time', movies: movies.topRated },
      { title: ' Coming Soon', movies: movies.upcoming },
    ]
    return [
      { title: ' Trending Now', movies: movies.trending },
      { title: ' Popular on CineHub', movies: movies.popular },
      { title: ' Top Rated', movies: movies.topRated },
      { title: ' Coming Soon', movies: movies.upcoming },
    ]
  }

  const TRENDING_TABS = [
    { id: 'today',        label: 'Trending Today' },
    { id: 'topRated',     label: 'Top Rated' },
    { id: 'popularIndia', label: 'Popular in India' },
    { id: 'aiRec',        label: '\u2726 AI Picks' },
  ]

  if (loading) return (
    <div className="loading-screen">
      <div className="cinema-loader">
        <div className="reel-dot" /><div className="reel-dot" /><div className="reel-dot" />
      </div>
      <p>Loading CineHub\u2026</p>
    </div>
  )

  if (error) return (
    <div className="error-screen">
      <p>{error}</p>
      <button onClick={fetchMovies} className="btn-retry">Retry</button>
    </div>
  )

  return (
    <div className="home-container">
      <Navbar
        user={user}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onLogout={onLogout}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onHomeRefresh={handleHomeRefresh}
      />

      <div className="home-content">
        {activeCategory === 'Home' && heroMovie && (
          <MovieHero
            key={heroMovie.id}
            movie={heroMovie}
            onSelectMovie={setSelectedMovie}
            heroIndex={heroIndex}
            heroTotal={heroMovies.length}
            onSlide={(idx) => setHeroIndex(idx)}
          />
        )}

        {activeCategory === 'Trending' ? (
          <div className="trending-container">
            <div className="trending-header">
              <h1 className="trending-title">\uD83D\uDD25 Trending</h1>
              <div className="trending-tabs">
                {TRENDING_TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`trending-tab-btn${trendingTab === tab.id ? ' active' : ''}`}
                    onClick={() => setTrendingTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {trendingLoading ? (
              <SkeletonRow title="" />
            ) : (
              <MovieRow
                key={trendingTab}
                title=""
                movies={trendingData[trendingTab] || []}
                onSelectMovie={setSelectedMovie}
              />
            )}
          </div>
        ) : (
          <div className="rows-container">
            {filteredRows().map(({ title, movies: list }) =>
              list.length > 0 && (
                <MovieRow key={title} title={title} movies={list} onSelectMovie={setSelectedMovie} />
              )
            )}
            <div ref={sentinelRef} className="scroll-sentinel" />
            {loadingMore && <LoadMoreSpinner />}
          </div>
        )}
      </div>

      <Footer />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
      {profileOpen && (
        <ProfileModal user={user} onClose={() => setProfileOpen(false)} />
      )}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}