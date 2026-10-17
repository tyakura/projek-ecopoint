import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Input, Button, Alert, Loader } from '../../components/ui'
import { Logo } from '../../components/icons'
import Footer from '../../components/layout/Footer'

export default function Login() {
  const { login, user, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <NavigateTo />
  if (loading) return <Loader label="LOADING..." />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="bg-hazard" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <Card style={{ padding: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }} aria-hidden="true"><Logo size={52} /></div>
              <h2 className="heading-xl" style={{ fontSize: 40 }}>ECOPOINT</h2>
              <p style={{ fontSize: 18, fontWeight: 900 }}>Welcome Back</p>
              <p style={{ opacity: 0.7 }}>Log in to continue your journey.</p>
            </div>

            <form onSubmit={onSubmit} style={{ marginTop: 28 }}>
              {error && <Alert type="error">{error}</Alert>}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div style={{ textAlign: 'right', marginBottom: 20, fontSize: 13 }}>
                <a href="#forgot" style={{ color: 'var(--ink)', fontWeight: 700 }}>Forgot password?</a>
              </div>
              <Button variant="hazard" type="submit" className="btn-block" disabled={busy}>
                {busy ? 'LOGGING IN...' : 'LOGIN →'}
              </Button>
            </form>

            <p className="text-center" style={{ marginTop: 24, fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 900, color: 'var(--ink)' }}>
                Register
              </Link>
            </p>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }}>Demo: alex@ecopoint.io / demo123456</p>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  )
}

function NavigateTo() {
  return <Navigate to="/dashboard" replace />
}