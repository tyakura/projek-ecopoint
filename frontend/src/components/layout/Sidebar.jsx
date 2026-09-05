import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Logo, Icon } from '../icons'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'layout_dashboard', end: true },
  { to: '/dashboard/collection', label: 'Collection', icon: 'recycle', end: false },
  { to: '/dashboard/rewards', label: 'Rewards', icon: 'gift', end: false },
  { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: 'trophy', end: false },
  { to: '/dashboard/profile', label: 'Profile', icon: 'user', end: false },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        <Logo size={26} /> ECOPOINT
      </Link>

      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <Icon name={it.icon} size={18} /> {it.label}
        </NavLink>
      ))}

      <div style={{ flex: 1 }} />

      <div
        style={{
          border: '2px solid var(--paper)',
          padding: 12,
          fontSize: 12,
          background: 'rgba(255,209,0,0.1)',
          marginTop: 12,
        }}
      >
        <div style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="user" size={14} /> {user?.name || 'Guest'}
        </div>
        <div style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="star" size={14} /> {Number(user?.points || 0).toLocaleString('id-ID')} pts
        </div>
        <div style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="trophy" size={14} /> {user?.level_title}
        </div>
      </div>

      <button
        className="btn btn-sm btn-block"
        onClick={() => {
          logout()
          navigate('/')
        }}
      >
        LOGOUT
      </button>
    </aside>
  )
}