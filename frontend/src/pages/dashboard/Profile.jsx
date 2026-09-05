import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { Card, Button, Input, Alert, Loader, Badge } from '../../components/ui'
import { Icon } from '../../components/icons'
import { levelInfo, fmt, iconFor } from '../../utils'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', avatar: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const info = levelInfo(user?.xp || 0)

  useEffect(() => {
    api
      .get('/achievements/me')
      .then((d) => setAchievements(d.achievements || []))
      .catch(() => {})
  }, [])

  if (!user) return <Loader label="LOADING..." />

  function startEdit() {
    setForm({ name: user.name, avatar: user.avatar || '' })
    setEditing(true)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setMsg('')
    setError('')
    try {
      await updateProfile(form.name, form.avatar)
      setEditing(false)
      setMsg('Profile updated!')
    } catch (err) {
      setError(err.message || 'Gagal update profile')
    }
  }

  const unlocked = achievements.filter((a) => a.unlocked_at)
  const locked = achievements.filter((a) => !a.unlocked_at)

  return (
    <>
      <h2 className="heading" style={{ fontSize: 40, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="user" size={30} /> Profile
      </h2>

      {msg && <Alert type="success">{msg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
        <div>
          <Card style={{ textAlign: 'center', padding: 40 }}>
            <div
              style={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                border: '4px solid var(--ink)',
                boxShadow: '6px 6px 0 0 var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--lime)',
              }}
              aria-hidden="true"
            >
              {form.avatar || user.avatar ? (
                <span style={{ fontSize: 56 }}>{form.avatar || user.avatar}</span>
              ) : (
                <Icon name="user" size={64} />
              )}
            </div>
            <Badge variant="hazard" rotate={-3}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name={info.icon} size={14} /> LEVEL 0{info.level}
              </span>
            </Badge>
            <h3 style={{ fontSize: 30, margin: '12px 0 4px' }}>{user.name}</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>@{user.username}</p>
            <div style={{ fontWeight: 900, marginTop: 8 }}>
              Level 0{info.level} — {info.title}
            </div>

            <div className="divider-dashed" />

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Stat label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="star" size={15} /> Total Points</span>} value={fmt(user.points)} />
              <Stat label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="recycle" size={15} /> Waste Collected</span>} value={`${Number(user.total_waste).toFixed(1)} KG`} />
              <Stat label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="trash_2" size={15} /> Items Collected</span>} value={fmt(user.total_items)} />
              <Stat label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="target" size={15} /> Challenges Completed</span>} value={achievements.filter((a) => a.unlocked_at).length} />
            </div>

            <div className="divider-dashed" />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {editing ? (
                <Button variant="hazard" type="submit" form="profile-form">SAVE</Button>
              ) : (
                <Button onClick={startEdit}>EDIT PROFILE</Button>
              )}
              <Button variant="orange" onClick={() => logout()}>LOGOUT</Button>
            </div>
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 22, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="trophy" size={20} /> Achievements
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {unlocked.map((a) => (
                <div key={a.id} className="ach">
                  <span className="ach-icon"><Icon name={iconFor(a.icon)} size={22} /></span>
                  <span style={{ fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{a.name}</span>
                </div>
              ))}
              {locked.map((a) => (
                <div key={a.id} className="ach locked" title={`${a.description} — target: ${a.condition_value}`}>
                  <span className="ach-icon"><Icon name={iconFor(a.icon)} size={22} /></span>
                  <span style={{ fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{a.name}</span>
                  <span style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="lock" size={10} /> locked
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {editing && (
            <Card style={{ background: 'var(--lime)' }}>
              <h3 style={{ fontSize: 22, marginBottom: 16 }}>Edit Profile</h3>
              <form id="profile-form" onSubmit={saveEdit}>
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Avatar (icon atau URL)"
                  placeholder="URL avatar atau biarkan kosong"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
              </form>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px dashed var(--ink)', paddingBottom: 8 }}>
      <span style={{ opacity: 0.7, fontWeight: 600 }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}