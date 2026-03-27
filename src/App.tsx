import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Chat } from './components/Chat'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="app-wrapper">
      <nav className="app-nav">
        <div className="nav-brand">VulnAI</div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            💬 Chat
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            📊 Threat Intelligence
          </Link>
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
