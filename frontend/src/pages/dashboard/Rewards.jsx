import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { Loader, Alert, Badge } from '../../components/ui'
import { RewardCard } from '../../components/dashboard'
import { fmt, fmtDateTime } from '../../utils'

export default function Rewards() {
  const { user, refreshUser } = useAuth()
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/rewards'), api.get('/rewards/redemptions')])
      .then(([rw, rd]) => {
        setRewards(rw.rewards || [])
        setRedemptions(rd.redemptions || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function redeem(reward) {
    setError('')
    setMsg('')
    try {
      await api.post(`/rewards/${reward.id}/redeem`)
      await refreshUser()
      const rw = await api.get('/rewards')
      const rd = await api.get('/rewards/redemptions')
      setRewards(rw.rewards || [])
      setRedemptions(rd.redemptions || [])
      setMsg(`${reward.name} berhasil ditukar! 🎉`)
    } catch (err) {
      setError(err.message || 'Gagal menukar reward')
    }
  }

  if (loading) return <Loader label="LOADING..." />

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h2 className="heading" style={{ fontSize: 40 }}>⭐ Rewards</h2>
          <p style={{ fontWeight: 600, opacity: 0.7 }}>Your points. Your rewards.</p>
        </div>
        <div className="card" style={{ padding: '14px 20px', background: 'var(--lime)' }}>
          <span className="card-title">MY POINTS</span>
          <div className="fat-num" style={{ fontSize: 34 }}>{fmt(user?.points)}</div>
        </div>
      </div>

      {msg && <Alert type="success">{msg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid-4" style={{ gap: 24 }}>
        {rewards.map((r) => (
          <RewardCard
            key={r.id}
            reward={r}
            onRedeem={redeem}
            disabled={(user?.points || 0) < r.points_required || r.stock <= 0}
          />
        ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: 28 }}>Redemption History</h3>
          <Badge variant="lime" rotate={-3}>{redemptions.length} REDEEMED</Badge>
        </div>
        <div className="divider-dashed" />
        {redemptions.length === 0 && <p style={{ opacity: 0.7 }}>Belum ada penukaran.</p>}
        {redemptions.map((rd) => (
          <div key={rd.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 28 }} aria-hidden="true">🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900 }}>{rd.reward_name || 'Reward'}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{fmtDateTime(rd.created_at)}</div>
            </div>
            <span className="tag" style={{ background: 'var(--orange)', color: 'var(--paper)' }}>-{rd.points_used} pts</span>
            <Badge variant="green" rotate={3}>{rd.status.toUpperCase()}</Badge>
          </div>
        ))}
      </div>
    </>
  )
}