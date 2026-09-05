import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Input, Button, Alert, Loader } from '../../components/ui'
import Footer from '../../components/layout/Footer'

export default function Register() {
  const { register, user, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />
  if (loading) return <Loader label="LOADING..." />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Password confirmation does not match')
      return
    }
    setBusy(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="bg-green" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <Card style={{ padding: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52 }} aria-hidden="true">♻</div>
              <h2 className="heading-xl" style={{ fontSize: 40 }}>CREATE ACCOUNT</h2>
              <p style={{ opacity: 0.75 }}>Join EcoPoint and start turning waste into value.</p>
            </div>

            <form onSubmit={onSubmit} style={{ marginTop: 28 }}>
              {error && <Alert type="error">{error}</Alert>}
              <Input
                label="Full Name"
                placeholder="Alex Yanuar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Username"
                placeholder="alex"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Ulangi password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                required
              />
              <Button variant="hazard" type="submit" className="btn-block" disabled={busy}>
                {busy ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
              </Button>
            </form>

            <p className="text-center" style={{ marginTop: 24, fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 900, color: 'var(--ink)' }}>
                Login
              </Link>
            </p>
            <p style={{ fontSize: 12, textAlign: 'center', marginTop: 20, opacity: 0.7 }}>
              Points = 0 • Level = Eco Starter → langsung menuju Dashboard
            </p>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  )
}