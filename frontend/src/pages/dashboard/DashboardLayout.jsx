import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import { Logo } from '../../components/icons'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout() {
  const { user } = useAuth()
  return (
    <div className="dash">
      <Sidebar />
      <div className="dash-main">
        <div className="dash-top">
          <span className="tag"><Logo size={12} /> ECOPOINT</span>
          <span>{user ? `${user.name} · Level 0${user.level}` : ''}</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}