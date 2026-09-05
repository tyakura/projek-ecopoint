import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Loader, Badge } from '../../components/ui'
import { Icon } from '../../components/icons'

const RANGES = [
  { key: 'all', label: 'All Time' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

const MEDALS = { 1: 'hazard', 2: 'paper', 3: 'orange' }

export default function Leaderboard() {
  const { user } = useAuth()
  const [range, setRange] = useState('all')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/leaderboard?range=${range}`)
      .then((d) => setEntries(d.leaderboard || []))
      .finally(() => setLoading(false))
  }, [range])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h2 className="heading" style={{ fontSize: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="trophy" size={30} /> Eco Leaderboard
          </h2>
          <p style={{ fontWeight: 600, opacity: 0.7 }}>Siapa yang paling banyak mengumpulkan sampah?</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RANGES.map((r) => (
            <button
              key={r.key}
              className="btn btn-sm"
              style={{
                background: range === r.key ? 'var(--hazard)' : 'var(--paper)',
              }}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="LOADING..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Level</th>
                <th>Waste (KG)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const isMe = e.user_id === user?.id
                return (
                  <tr key={e.user_id} style={{ background: isMe ? 'var(--lime)' : undefined, fontWeight: isMe ? 900 : 600 }}>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {MEDALS[e.rank] ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Icon name="medal" size={18} style={{ color: 'var(--ink)', background: `var(--${MEDALS[e.rank]})`, border: '2px solid var(--ink)', borderRadius: 6, padding: 2 }} />
                          0{e.rank}
                        </span>
                      ) : (
                        `0${e.rank}`
                      )}
                    </td>
                    <td>
                      {e.name}
                      {isMe && <Badge variant="hazard" rotate={-3} style={undefined}>YOU</Badge>}
                    </td>
                    <td>Level 0{e.level}</td>
                    <td>{Number(e.total_waste).toFixed(1)} KG</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: 20, fontSize: 13, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="alert_circle" size={14} /> Rangking dihitung dari total berat sampah yang terkumpul.
      </p>
    </>
  )
}