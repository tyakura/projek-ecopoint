export const LEVELS = [
  { level: 1, title: 'Eco Starter', xp: 0, icon: 'sprout' },
  { level: 2, title: 'Green Explorer', xp: 500, icon: 'leaf' },
  { level: 3, title: 'Eco Warrior', xp: 1500, icon: 'recycle' },
  { level: 4, title: 'Earth Guardian', xp: 3000, icon: 'globe' },
]

export function levelInfo(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xp) current = l
  }
  const next = LEVELS.find((l) => l.xp > xp)
  return {
    level: current.level,
    title: current.title,
    icon: current.icon,
    current,
    isMax: !next,
    next: next || LEVELS[LEVELS.length - 1],
    xpInLevel: xp - current.xp,
    xpGap: next ? next.xp - current.xp : 0,
    progressPercent: next
      ? Math.min(100, Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100))
      : 100,
  }
}

export function fmt(n) {
  return Number(n || 0).toLocaleString('id-ID')
}

export function fmtDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function fmtDateTime(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export const WASTE_TYPES = [
  { value: 'plastic_bottle', label: 'Plastic Bottle', icon: 'package' },
  { value: 'plastic_bag', label: 'Plastic Bag', icon: 'package' },
  { value: 'recyclable', label: 'Recyclable Mixed', icon: 'recycle' },
  { value: 'can', label: 'Aluminium Can', icon: 'package' },
  { value: 'glass', label: 'Glass Bottle', icon: 'droplet' },
  { value: 'paper', label: 'Paper & Cardboard', icon: 'package' },
]

export function wasteTypeLabel(value) {
  return WASTE_TYPES.find((w) => w.value === value)?.label || value
}

export function wasteTypeIcon(value) {
  return WASTE_TYPES.find((w) => w.value === value)?.icon || 'recycle'
}

const ICON_ALIASES = {
  '♻️': 'recycle',
  '♻': 'recycle',
  '🌱': 'sprout',
  '🌎': 'globe',
  '🌍': 'globe',
  '🗑️': 'trash_2',
  '🗑': 'trash_2',
  '💰': 'banknote',
  '🎟️': 'ticket',
  '🎟': 'ticket',
  '👕': 'shirt',
  '🎁': 'gift',
  '🏆': 'trophy',
  '🥇': 'medal',
  '🥈': 'medal',
  '🥉': 'medal',
  '⭐': 'star',
  '🌟': 'sparkles',
  '🍾': 'package',
  '💪': 'flame',
  '💡': 'alert_circle',
  '🔒': 'lock',
  '👤': 'user',
  '🎉': 'sparkles',
}

export function iconFor(value) {
  return (value && ICON_ALIASES[value]) || value || 'gift'
}