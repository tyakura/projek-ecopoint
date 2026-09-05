import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { Loader, Alert, Badge } from '../../components/ui'
import { PointsCard, WasteCard, LevelCard, ChallengeCard, ActivityItem, RewardCard } from '../../components/dashboard'
import { levelInfo, fmt, fmtDate, wasteTypeLabel } from '../../utils'

export default function Overview() {
  const { user, refreshUser } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [collections, setCollections] = useState([])
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/challenges'), api.get('/collections'), api.get('/rewards')])
      .then(([c, col, rw]) => {
        setChallenges(c.challenges || [])
        setCollections(col.collections || [])
        setRewards(rw.rewards || [])
      })
      .catch((e) => setDataError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="LOADING DASHBOARD..." />

  const info = levelInfo(user?.xp || 0)
  const firstName = (user?.name || 'Eco Hero').split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const weeklyChallenge = (challenges || []).find((c) => c.type === 'weekly') || challenges?.[0]
  const recent = (collections || []).slice(0, 5)

  return (
    <>
      {dataError && <Alert type="error">{dataError}</Alert>}

      <div style={{ marginBottom: 32 }}>
        <h2 className="heading" style={{ fontSize: 40 }}>{greeting}, {firstName} 👋</h2>
        <p style={{ fontWeight: 600, opacity: 0.7 }}>
          Your Environmental Journey — every collection counts.
        </p>
      </div>

      <div className="grid-3" style={{ gap: 24 }}>
        <PointsCard points={user?.points || 0} />
        <WasteCard waste={user?.total_waste || 0} items={user?.total_items || 0} />
        <LevelCard
          level={info.level}
          title={info.title}
          xp={info.xpInLevel}
          xpNext={info.xpGap}
        />
      </div>

      <div className="grid-2" style={{ gap: 24, marginTop: 32, alignItems: 'start' }}>
        <div>
          <ChallengeCard challenge={weeklyChallenge} />
          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="heading" style={{ fontSize: 24 }}>Recent Activity</h3>
              <Link to="/dashboard/collection" className="btn btn-sm btn-ink">+ COLLECT</Link>
            </div>
            <div className="divider-dashed" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recent.length === 0 && <p style={{ opacity: 0.7 }}>Belum ada aktivitas. Mulai collection pertamamu!</p>}
              {recent.map((c) => (
                <ActivityItem
                  key={c.id}
                  icon="♻"
                  title={`${wasteTypeLabel(c.waste_type)} Collection`}
                  meta={fmtDate(c.created_at)}
                  points={`${c.points_earned} Points`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card card-ink">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="heading" style={{ fontSize: 24, color: 'var(--paper)' }}>Level Progress</h3>
              <Badge variant="lime" rotate={-4}>{info.icon} {info.title}</Badge>
            </div>
            <div className="fat-num" style={{ color: 'var(--lime)', fontSize: 48, marginTop: 8 }}>
              LEVEL 0{info.level}
            </div>
            <div style={{ color: 'var(--paper)', fontWeight: 700, margin: '8px 0 12px' }}>
              {fmt(user?.xp || 0)} / {fmt(info.next.xp)} XP menuju {info.next.title}
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="heading" style={{ fontSize: 24 }}>Top Rewards</h3>
              <Link to="/dashboard/rewards" className="btn btn-sm btn-green">ALL →</Link>
            </div>
            <div className="divider-dashed" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(rewards || []).slice(0, 3).map((r) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 36 }} aria-hidden="true">{r.image || '🎁'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>{r.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>{fmt(r.points_required)} Points</div>
                  </div>
                  <Link to="/dashboard/rewards" className="btn btn-sm btn-hazard">REDEEM</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}