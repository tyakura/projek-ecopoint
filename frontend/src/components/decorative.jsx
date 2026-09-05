export function TornEdge({ fill = 'var(--paper)', flip = false }) {
  return (
    <div className="torn-edge" style={flip ? { transform: 'rotate(180deg)' } : undefined} aria-hidden="true">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          fill={fill}
          d="M0,40 L0,18 L70,28 L140,12 L210,30 L280,15 L350,26 L420,10 L490,22 L560,32 L630,14 L700,25 L770,8 L840,24 L910,16 L980,28 L1050,12 L1120,22 L1200,10 L1200,40 Z"
        />
      </svg>
    </div>
  )
}

export function StickerBadge({ children, color = 'lime', rotate = -4, onClick, className = '' }) {
  return (
    <span
      className={`sticker ${color ? `sticker-${color}` : ''} ${onClick ? '' : ''} ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, cursor: onClick ? 'pointer' : 'default', display: 'inline-block' }}
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export function HardShadowWrapper({ children, className = '' }) {
  return <div className={`card card-white ${className}`}>{children}</div>
}