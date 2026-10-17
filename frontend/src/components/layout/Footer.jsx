import { Link } from 'react-router-dom'
import { Logo, Icon } from '../icons'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-logo" style={{ marginBottom: 16 }}>
              <Logo size={28} /> ECOPOINT
            </div>
            <p style={{ maxWidth: 320, opacity: 0.85 }}>
              Turn Waste Into Value. Kumpulkan sampah, raih poin, dan buat dampak nyata bagi lingkungan.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <Link to="/dashboard/rewards">Rewards</Link>
            <Link to="/dashboard/leaderboard">Leaderboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#problem">About</a>
            <a href="#impact">Impact</a>
            <a href="#rewards">Rewards Preview</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#footer">Help Center</a>
            <a href="#footer">Contact</a>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 EcoPoint: Turn Waste Into Value.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="heart" size={16} /> Made for a cleaner planet
          </span>
        </div>
      </div>
    </footer>
  )
}