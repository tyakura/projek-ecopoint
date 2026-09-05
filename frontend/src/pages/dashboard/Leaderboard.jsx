import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Loader, Badge } from '../../components/ui'

const RANGES = [
  { key: 'all', label: 'All Time' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

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

  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h2 className="heading" style={{ fontSize: 40 }}>🏆 Eco Leaderboard</h2>
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
                    <td>{medals[e.rank] || `0${e.rank}`}</td>
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

      <p style={{ marginTop: 20, fontSize: 13, opacity: 0.7 }}>
        💡 Rangking dihitung dari total berat sampah yang terkumpul.
      </p>
    </>
  )
}