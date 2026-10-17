import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { Card, Input, Button, Alert, Loader, Badge } from '../../components/ui'
import { ActivityItem } from '../../components/dashboard'
import { Icon } from '../../components/icons'
import { WASTE_TYPES, wasteTypeLabel, wasteTypeIcon, fmtDate } from '../../utils'

export default function Collection() {
  const { refreshUser } = useAuth()
  const [collections, setCollections] = useState([])
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ waste_type: 'plastic_bottle', amount: '', items_count: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  function load() {
    Promise.all([api.get('/collections'), api.get('/challenges')])
      .then(([c, ch]) => {
        setCollections(c.collections || [])
        setChallenges(ch.challenges || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMsg('')
    setBusy(true)
    try {
      const res = await api.post('/collections', {
        waste_type: form.waste_type,
        amount: parseFloat(form.amount),
        items_count: parseInt(form.items_count, 10),
      })
      setMsg(`+${res.points} POINTS earned! ${res.message}`)
      setForm({ ...form, amount: '', items_count: '' })
      await refreshUser()
      load()
    } catch (err) {
      setError(err.message || 'Could not submit collection')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loader label="LOADING..." />

  const pendingChallenges = challenges.filter((c) => !c.is_completed)

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h2 className="heading" style={{ fontSize: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="recycle" size={30} /> New Collection
        </h2>
        <p style={{ fontWeight: 600, opacity: 0.7 }}>
          Submit your waste and earn points instantly. Setiap setoran bernilai!
        </p>
      </div>

      {msg && <Alert type="success">{msg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
        <Card style={{ background: 'var(--lime)', padding: 32 }}>
          <Badge variant="hazard" rotate={-4}>+100 KG / +25 PER ITEM</Badge>
          <h3 style={{ fontSize: 24, margin: '14px 0 4px' }}>SUBMIT WASTE</h3>
          <p style={{ fontSize: 14, marginBottom: 20 }}>
            Titik pengumpulan: Jl. Daur Ulang No. 8, Kota Hijau (buka 08.00 – 17.00).
          </p>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label>Waste Type</label>
              <select
                className="input"
                value={form.waste_type}
                onChange={(e) => setForm({ ...form, waste_type: e.target.value })}
              >
                {WASTE_TYPES.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <Input
                label="Weight (KG)"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="2.5"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              <Input
                label="Items"
                type="number"
                min="1"
                step="1"
                placeholder="20"
                value={form.items_count}
                onChange={(e) => setForm({ ...form, items_count: e.target.value })}
                required
              />
            </div>
            <Button variant="ink" type="submit" className="btn-block" disabled={busy}>
              {busy ? 'SUBMITTING...' : 'SUBMIT COLLECTION →'}
            </Button>
          </form>
        </Card>

        <div>
          <h3 style={{ fontSize: 24, marginBottom: 16 }}>Active Challenges</h3>
          {pendingChallenges.length === 0 && (
            <Card><p>Semua challenge selesai! Kamu hebat.</p></Card>
          )}
          {pendingChallenges.map((c) => {
            const pct = Math.min(100, Math.round(((c.progress || 0) / c.target) * 100))
            return (
              <div key={c.id} className="card card-white" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="target" size={18} /> {c.type.toUpperCase()}
                  </div>
                  <Badge variant="orange" rotate={3}>+{c.xp_reward} XP</Badge>
                </div>
                <div style={{ fontWeight: 900, margin: '6px 0' }}>{c.title}</div>
                <div className="progress-track" style={{ height: 16 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6, fontWeight: 700 }}>
                  <span>{c.progress || 0} / {c.target}</span>
                  <Button
                    variant="hazard"
                    btn-sm
                    className="btn-sm"
                    disabled={c.progress >= c.target}
                    onClick={async () => {
                      await api.post(`/challenges/${c.id}/progress`)
                      await refreshUser()
                      load()
                    }}
                  >
                    +1 PROGRESS
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <h3 style={{ fontSize: 28, margin: '32px 0 16px' }}>Collection History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {collections.length === 0 && <Card><p>Belum ada koleksi sampah. Yuk mulai!</p></Card>}
        {collections.map((c) => (
          <ActivityItem
            key={c.id}
            icon={wasteTypeIcon(c.waste_type)}
            title={`${wasteTypeLabel(c.waste_type)} Collection`}
            meta={`${c.amount} KG · ${c.items_count} items · ${fmtDate(c.created_at)}`}
            points={`${c.points_earned} Points`}
          />
        ))}
      </div>
    </>
  )
}