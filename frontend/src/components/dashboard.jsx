import { ProgressBar, Badge } from './ui'
import { Icon } from './icons'

export function StatCard({ icon, value, label, color = 'paper', badge }) {
  return (
    <div className={`card card-${color}`} style={{ minHeight: 160 }}>
      {badge && <Badge rotate={-6} variant="lime" style={undefined} className="rotate-l">{badge}</Badge>}
      <Icon name={icon} size={36} />
      <div className="fat-num" style={{ marginTop: 8 }}>{value}</div>
      <div className="card-title" style={{ marginTop: 4 }}>{label}</div>
    </div>
  )
}

export function PointsCard({ points, weeklyDelta = '+250' }) {
  return (
    <div className="card card-lime" style={{ minHeight: 180 }}>
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="star" size={18} /> TOTAL POINTS
      </div>
      <div className="fat-num" style={{ fontSize: 56 }}>{Number(points).toLocaleString('id-ID')}</div>
      <Badge variant="hazard" rotate={-3}>{weeklyDelta} this week</Badge>
    </div>
  )
}

export function WasteCard({ waste, items }) {
  return (
    <div className="card" style={{ minHeight: 180 }}>
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="recycle" size={18} /> WASTE COLLECTED
      </div>
      <div className="fat-num" style={{ fontSize: 56 }}>{Number(waste).toFixed(1)} KG</div>
      <div className="card-title" style={{ marginTop: 8, opacity: 0.6 }}>{items} items</div>
    </div>
  )
}

export function LevelCard({ level, title, xp, xpNext, color = 'green' }) {
  const maxLevel = !xpNext || isNaN(xpNext) || xpNext <= 0
  const pct = maxLevel ? 100 : Math.min(100, Math.round((xp / xpNext) * 100))
  return (
    <div className={`card card-${color}`} style={{ minHeight: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge variant="paper" rotate={4} className="rotate-r">LEVEL 0{level}</Badge>
        <Icon name="trophy" size={28} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 24, marginTop: 16, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
        {title}
      </div>
      <div className="card-title" style={{ marginTop: 8 }}>
        {maxLevel ? 'MAX LEVEL REACHED' : `${Number(xp).toLocaleString('id-ID')} / ${Number(xpNext).toLocaleString('id-ID')} XP`}
      </div>
      <ProgressBar value={maxLevel ? 1 : xp} max={maxLevel ? 1 : xpNext} />
      <div className="card-title" style={{ marginTop: 8 }}>{maxLevel ? 'Legendary!' : `${pct}% to next level`}</div>
    </div>
  )
}

export function ChallengeCard({ challenge }) {
  if (!challenge) return null
  const pct = challenge.target > 0 ? Math.min(100, Math.round((challenge.progress || 0) / challenge.target * 100)) : 0
  return (
    <div className="card card-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="target" size={18} /> {challenge.type?.toUpperCase()} CHALLENGE
        </div>
        {challenge.is_completed && <Badge variant="green" rotate={-3}>DONE</Badge>}
      </div>
      <h3 style={{ fontSize: 22, margin: '8px 0 12px' }}>{challenge.title}</h3>
      <ProgressBar value={challenge.progress || 0} max={challenge.target} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 700 }}>
        <span>({challenge.progress || 0} / {challenge.target})</span>
        <span className="tag">+{challenge.xp_reward} XP</span>
      </div>
    </div>
  )
}

export function RewardIcon({ image }) {
  const name = image || 'gift'
  return <Icon name={name} size={64} />
}

export function RewardCard({ reward, onRedeem, disabled }) {
  return (
    <div className="card card-white" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', color: 'var(--green)' }}>
          <RewardIcon image={reward.image} />
        </div>
        <Badge variant="hazard" rotate={8} className="rotate-r" style={undefined}>
          {Number(reward.points_required).toLocaleString('id-ID')} PTS
        </Badge>
      </div>
      <div style={{ fontWeight: 900, fontSize: 18, fontFamily: 'var(--font-display)' }}>{reward.name}</div>
      <div style={{ fontSize: 13, opacity: 0.75 }}>{reward.description}</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>Stock: {reward.stock}</div>
      <button className="btn btn-green btn-block btn-sm" onClick={() => onRedeem(reward)} disabled={disabled}>
        REDEEM
      </button>
    </div>
  )
}

export function ActivityItem({ icon = 'recycle', title, meta, points, positive = true }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', boxShadow: '3px 3px 0 0 var(--ink)' }}>
      <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--ink)', boxShadow: '3px 3px 0 0 var(--ink)', background: 'var(--lime)' }}>
        <Icon name={icon} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900 }}>{title}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{meta}</div>
      </div>
      <span className="tag" style={{ background: positive ? 'var(--lime)' : 'var(--orange)' }}>
        {positive ? '+' : ''}{points}
      </span>
    </div>
  )
}