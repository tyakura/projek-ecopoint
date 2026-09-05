import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Logo, Icon } from '../icons'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Impact', href: '#impact' },
  { label: 'Rewards', href: '#rewards' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <Logo size={28} /> ECOPOINT
        </Link>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          {user && <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-hazard btn-sm">MY DASHBOARD</Link>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--paper)' }}
                onClick={() => { logout(); navigate('/') }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
                LOGIN
              </Link>
              <Link to="/register" className="btn btn-hazard btn-sm">GET STARTED →</Link>
            </>
          )}
          <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}