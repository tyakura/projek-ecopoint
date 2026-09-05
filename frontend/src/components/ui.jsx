export function Button({ children, variant = '', className = '', ...props }) {
  return (
    <button className={`btn ${variant ? `btn-${variant}` : ''} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Card({ children, variant = '', className = '', style }) {
  return (
    <div className={`card card-${variant} ${className}`} style={style}>
      {children}
    </div>
  )
}

export function Badge({ children, variant = '', rotate = 0, className = '' }) {
  return (
    <span
      className={`sticker ${variant ? `sticker-${variant}` : ''} ${className}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {children}
    </span>
  )
}

export function Input({ label, ...props }) {
  return (
    <div className="field">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input className="input" {...props} />
    </div>
  )
}

export function ProgressBar({ value = 0, max = 100, className = '', fillClassName = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={`progress-track ${className}`}>
      <div className={`progress-fill ${fillClassName}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Alert({ type = 'error', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>
}

export function Loader({ label = 'Loading...' }) {
  return (
    <div style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
      {label}
    </div>
  )
}