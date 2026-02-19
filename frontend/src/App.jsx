import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    /* Restore auth session */
    const savedToken = localStorage.getItem('authToken')
    const savedUser  = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }

    /* Restore theme preference */
    const theme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const handleLoginSuccess = (authToken, userData) => {
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <>
      <ScrollProgress />
      {isAuthenticated ? (
        <HomePage user={user} token={token} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default App
