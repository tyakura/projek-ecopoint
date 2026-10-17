import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { TornEdge, StickerBadge } from '../components/decorative'
import { Button, ProgressBar, Badge } from '../components/ui'
import { Logo, Icon } from '../components/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import GlyphPortal from '@/components/ui/glyph-portal'

const DEFAULT_STATS = {
  waste_collected: 12450,
  active_users: 4250,
  collections: 8920,
  rewards_claimed: 2840,
}

export default function Landing() {
  const { user } = useAuth()
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    api
      .get('/stats')
      .then(setStats)
      .catch(() => setStats(DEFAULT_STATS))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero user={user} />
        <Problem />
        <Solution />
        <HowItWorks />
        <Gamification />
        <UserProgress user={user} />
        <Impact stats={stats} />
        <RewardsPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

function Hero({ user }) {
  const [face, setFace] = useState(null)

  useEffect(() => {
    let settled = false
    const finish = (value) => {
      if (!settled) {
        settled = true
        setFace(value)
      }
    }
    const font = new FontFace(
      'Glyph Portal Jakarta',
      'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")',
      { weight: '400 700' }
    )
    font
      .load()
      .then(
        (loadedFont) => {
          document.fonts.add(loadedFont)
          finish('"Glyph Portal Jakarta", Arial, sans-serif')
        },
        () => finish('Arial, sans-serif')
      )
    const timeout = window.setTimeout(() => finish('Arial, sans-serif'), 1600)
    return () => {
      settled = true
      clearTimeout(timeout)
    }
  }, [])

  const currentFont = face || 'Arial, sans-serif'

  return (
    <div
      data-demo-scroll
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="Ecopoint. Scroll to step inside."
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#fff',
        containerType: 'inline-size',
        fontFamily: currentFont,
      }}
    >
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 20px;gap:28px;background:#0D0F0C;border:1px solid #10261d;border-radius:10px;color:#FFD100;font-size:14px;font-weight:700;box-shadow:0 1px 2px #10261d1a;transition:background .18s,box-shadow .18s;}
        [data-slipstream-demo] [data-gp-enter]:hover{background:#1a1d18;box-shadow:0 3px 8px #10261d18;}
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid #176247;outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{border-color:transparent;border-radius:8px;font-size:12px;color:#626964;}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;}
        [data-sublime-logo]{font-size:19px;font-weight:600;letter-spacing:-.065em;color:#18251e;}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:#71766f;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;font-weight:400;line-height:1.5;letter-spacing:.005em;color:#71766f;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;font-weight:400;line-height:1.5;color:#646a63;}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:#7c817b;font-size:11px;letter-spacing:.01em;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:12ch;text-align:right;}[data-sublime-eyebrow]{font-size:12px;}[data-sublime-support]{font-size:14px;}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-header]{top:18px;}[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}
        [data-slipstream-demo] [data-gp-content]{padding:5.5rem clamp(1.25rem,5cqw,5rem) 6.5rem;font-family:inherit;}
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(2rem,5svh,3.5rem);}
        [data-slipstream-copy] h2{max-width:48rem;margin:0;color:inherit;font-size:clamp(1.75rem,1.1rem + 2.1cqw,2.25rem);font-weight:400;line-height:1.25;letter-spacing:0;text-wrap:balance;}
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:1.75rem;}
        [data-slipstream-feature]{border-top:1px solid rgba(251,251,250,.22);padding-top:1.1rem;}
        [data-slipstream-feature] h3{margin:0;color:inherit;font-size:1.125rem;font-weight:500;line-height:1.2;letter-spacing:0;}
        [data-slipstream-feature] p{margin:.55rem 0 0;color:rgba(251,251,250,.85);font-size:.9375rem;line-height:1.55;}
        [data-slipstream-no]{display:inline-block;margin-right:.7rem;color:rgba(251,251,250,.85);font:500 .75rem ui-monospace,monospace;letter-spacing:.08em;transform:translateY(-.1em);}
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:3.5rem;}}
      `}</style>
      <GlyphPortal
        word="ECOPOINT"
        fontFamily={currentFont}
        fontWeight={700}
        style={{ fontFamily: currentFont }}
        scrollLength={2.4}
        interactive={true}
        annotations={false}
        enterLabel="Step inside"
        front={
          <>
            <div data-sublime-header>
              <span data-sublime-logo style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Logo size={22} /> ECOPOINT
              </span>
              <span data-sublime-category>Eco Gamification & Rewards</span>
            </div>
            <p data-sublime-eyebrow>TURN WASTE INTO VALUE.</p>
            <p data-sublime-support>Collect plastic waste, earn points, unlock rewards, and save the planet.</p>
            <span data-sublime-scroll>Scroll for a closer look ↓</span>
          </>
        }
      >
        <div data-slipstream-copy>
          <h2>Turn plastic waste into points, rewards, and real environmental impact.</h2>
          <div data-slipstream-features>
            <div data-slipstream-feature>
              <h3><span data-slipstream-no>01</span>Choose your way in</h3>
              <p>Pick any letter, then scroll. Each path takes you into the EcoPoint ecosystem.</p>
            </div>
            <div data-slipstream-feature>
              <h3><span data-slipstream-no>02</span>Collect & Earn</h3>
              <p>Deposit plastic waste at our smart collection points to gain instant XP and reward points.</p>
            </div>
            <div data-slipstream-feature>
              <h3><span data-slipstream-no>03</span>Redeem Rewards</h3>
              <p>Exchange points for cash payouts, store vouchers, merchandise, or tree planting initiatives.</p>
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-hazard">
              {user ? 'GO TO DASHBOARD →' : 'START COLLECTING →'}
            </Link>
            <a href="#problem" className="btn btn-white">SEE THE IMPACT ↓</a>
          </div>
        </div>
      </GlyphPortal>
    </div>
  )
}

function CardTilt({ children }) {
  return <div style={{ transform: 'rotate(2deg)' }}>{children}</div>
}

function Problem() {
  const items = [
    { icon: 'sprout', title: 'Soil Pollution', desc: 'Sampah plastik mencemari tanah dan merusak keseimbangan ekosistem.' },
    { icon: 'droplet', title: 'Environmental Pollution', desc: 'Limbah plastik mencemari sungai dan lautan tempat bergantungnya kehidupan.' },
    { icon: 'trash_2', title: 'Low Awareness', desc: 'Kesadaran daur ulang masih rendah — sampah berakhir di tempat pembuangan.' },
  ]
  return (
    <section className="section bg-ink" id="problem" style={{ paddingBottom: 80 }}>
      <div className="container">
        <StickerBadge color="orange" rotate={-3} className="rotate-l">THE ISSUE</StickerBadge>
        <h2 className="heading-xl" style={{ color: 'var(--paper)', margin: '20px 0 48px' }}>
          PLASTIC WASTE IS
          <br />
          EVERYONE'S PROBLEM.
        </h2>
        <div className="grid-3" style={{ gap: 24 }}>
          {items.map((it) => (
            <div key={it.title} className="card card-ink">
              <div style={{ color: 'var(--hazard)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name={it.icon} size={40} />
              </div>
              <h3 style={{ fontSize: 22, margin: '12px 0 8px', color: 'var(--hazard)' }}>{it.title}</h3>
              <p style={{ opacity: 0.85 }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <TornEdge fill="var(--ink)" flip />
    </section>
  )
}

function Solution() {
  const items = [
    { icon: 'recycle', title: 'COLLECT', desc: 'Collect recyclable waste.' },
    { icon: 'star', title: 'EARN', desc: 'Receive points for your contribution.' },
    { icon: 'gift', title: 'REDEEM', desc: 'Exchange points for rewards.' },
  ]
  return (
    <section className="section bg-paper" id="solution">
      <div className="container text-center">
        <h2 className="heading-xl">WHAT IF RECYCLING FELT LIKE A GAME?</h2>
        <p className="subheading">Setiap sampah yang kamu kumpulkan bernilai — bukan sekadar dibuang, tapi ditukar poin.</p>
        <div className="grid-3" style={{ marginTop: 48, textAlign: 'left' }}>
          {items.map((it) => (
            <div key={it.title} className="card">
              <div style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name={it.icon} size={44} />
              </div>
              <h3 style={{ fontSize: 26, margin: '12px 0 6px' }}>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'COLLECT', icon: 'recycle', desc: 'Kumpulkan sampah daur ulang di sekitarmu.' },
    { num: '02', title: 'SUBMIT', icon: 'truck', desc: 'Laporkan & serahkan sampah lewat aplikasi.' },
    { num: '03', title: 'EARN', icon: 'star', desc: 'Dapatkan poin dan XP dari setiap setoran.' },
    { num: '04', title: 'REDEEM', icon: 'gift', desc: 'Tukar poinmu dengan hadiah menarik.' },
  ]
  return (
    <section className="section bg-lime" id="how-it-works">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <StickerBadge color="ink" rotate={4} className="rotate-r">SIMPLE</StickerBadge>
            <h2 className="heading-xl" style={{ marginTop: 20 }}>HOW ECOPOINT WORKS</h2>
          </div>
          <div style={{ textAlign: 'right', maxWidth: 320 }}>
            <p style={{ fontWeight: 700 }}>4 langkah sederhana dari sampah menjadi nilai.</p>
          </div>
        </div>
        <div className="grid-4" style={{ marginTop: 48 }}>
          {steps.map((s) => (
            <div key={s.num} className="card card-white" style={{ textAlign: 'center' }}>
              <div className="step-num">{s.num}</div>
              <div style={{ marginTop: 12, color: 'var(--green)', display: 'flex', justifyContent: 'center' }}>
                <Icon name={s.icon} size={36} />
              </div>
              <h3 style={{ fontSize: 24, margin: '12px 0 8px' }}>{s.title}</h3>
              <p style={{ fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gamification() {
  const levels = [
    { num: '01', name: 'Eco Starter' },
    { num: '02', name: 'Green Explorer' },
    { num: '03', name: 'Eco Warrior' },
    { num: '04', name: 'Earth Guardian' },
  ]
  const achievements = [
    { icon: 'recycle', name: 'First Collection' },
    { icon: 'sprout', name: 'Green Starter' },
    { icon: 'globe', name: 'Earth Saver' },
    { icon: 'trophy', name: 'Eco Legend' },
  ]
  return (
    <section className="section bg-green" id="gamification">
      <div className="container">
        <h2 className="heading-xl">MAKE EVERY CONTRIBUTION COUNT.</h2>
        <div className="grid-2" style={{ marginTop: 48, alignItems: 'start' }}>
          <div>
            <div className="card card-white">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 22 }}>Levels</h3>
                <StickerBadge color="ink" rotate={-6} className="rotate-l">+250 POINTS</StickerBadge>
              </div>
              {levels.map((lv) => (
                <div key={lv.num} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px dashed var(--ink)', padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="trophy" size={18} />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, marginRight: 12 }}>LEVEL {lv.num}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>{lv.name}</span>
                </div>
              ))}
            </div>

            <div className="card card-white" style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="target" size={20} /> Weekly Challenge
                </h3>
                <Badge variant="orange" rotate={-3}>+500 XP</Badge>
              </div>
              <p><strong>Collect 10 plastic bottles</strong></p>
              <ProgressBar value={8} max={10} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 700 }}>
                <span>8 / 10 bottles</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="card card-white">
              <h3 style={{ fontSize: 22, marginBottom: 16 }}>Achievements</h3>
              <div className="grid-2" style={{ gap: 16 }}>
                {achievements.map((a) => (
                  <div key={a.name} className="ach">
                    <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, border: '3px solid var(--ink)', boxShadow: '3px 3px 0 0 var(--ink)', background: 'var(--lime)' }}>
                      <Icon name={a.icon} size={22} />
                    </span>
                    <span style={{ textAlign: 'center', fontWeight: 700, fontSize: 13 }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <CardTilt>
              <div className="card" style={{ background: 'var(--hazard)', marginTop: 28, transform: 'rotate(1deg)' }}>
                <div className="card-title">FUN FACTS</div>
                <div className="fat-num" style={{ fontSize: 40 }}>1 TON</div>
                <p>plastik daur ulang menghemat ±2 ton CO₂ yang dilepas ke atmosfer.</p>
              </div>
            </CardTilt>
          </div>
        </div>
      </div>
    </section>
  )
}

function UserProgress({ user }) {
  const pct = 82
  return (
    <section className="section bg-grey" id="progress">
      <div className="container">
        <div className="card" style={{ background: 'var(--paper)', borderWidth: 4, boxShadow: '8px 8px 0 0 var(--ink)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="heading" style={{ fontSize: 40 }}>
                {user ? <>GOOD MORNING, {user.name.split(' ')[0].toUpperCase()}</> : <>GOOD MORNING, ALEX</>}
              </h2>
              <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="star" size={18} />
                  <strong style={{ fontFamily: 'var(--font-display)' }}>{user ? Number(user.points).toLocaleString('id-ID') : '2,450'}</strong> POINTS
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="trophy" size={18} /> LEVEL 04 — EARTH GUARDIAN
                </span>
              </div>
            </div>
            <StickerBadge color="hazard" rotate={8} className="rotate-r">LEVEL UP!</StickerBadge>
          </div>
          <div style={{ margin: '24px 0 12px' }}>
            <ProgressBar value={2450} max={3000} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="recycle" size={16} /> 87 Items Collected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="sprout" size={16} /> 12.4 KG Collected
            </span>
            <span style={{ fontWeight: 900 }}>{pct}% to next level</span>
          </div>
          <div style={{ marginTop: 28 }}>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-hazard">START YOUR JOURNEY →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Impact({ stats }) {
  const counters = [
    { icon: 'recycle', num: Number(stats.waste_collected).toLocaleString('id-ID'), label: 'Waste Collected', suffix: 'KG' },
    { icon: 'users', num: Number(stats.active_users).toLocaleString('id-ID'), label: 'Active Users' },
    { icon: 'truck', num: Number(stats.collections).toLocaleString('id-ID'), label: 'Collections' },
    { icon: 'gift', num: Number(stats.rewards_claimed).toLocaleString('id-ID'), label: 'Rewards Claimed' },
  ]
  return (
    <section className="section bg-orange" id="impact" style={{ paddingBottom: 80 }}>
      <div className="container text-center">
        <StickerBadge color="ink" rotate={-3} className="rotate-l">REAL NUMBERS</StickerBadge>
        <h2 className="heading-xl" style={{ margin: '20px 0 48px' }}>SMALL ACTIONS. REAL IMPACT.</h2>
        <div className="grid-4">
          {counters.map((c) => (
            <div key={c.label}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Icon name={c.icon} size={36} />
              </div>
              <div className="fat-num" style={{ fontSize: 56 }}>{c.num}{c.suffix || ''}</div>
              <div style={{ fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{c.label}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 40, fontSize: 16, fontWeight: 700, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          "Every piece of waste collected is one small step toward a cleaner environment."
        </p>
      </div>
      <TornEdge fill="var(--orange)" flip />
    </section>
  )
}

function RewardsPreview() {
  const rewards = [
    { icon: 'banknote', name: 'Rp10.000 Reward', pts: '1,000', desc: 'Uang tunai untuk setiap 1000 poin.' },
    { icon: 'ticket', name: 'Discount Voucher', pts: '1,500', desc: 'Voucher diskon di merchant mitra.' },
    { icon: 'shirt', name: 'Eco Merchandise', pts: '5,000', desc: 'Merchandise serat daur ulang eksklusif.' },
    { icon: 'sprout', name: 'Environmental Donation', pts: '3,000', desc: 'Kami menanam satu pohon atas namamu.' },
  ]
  return (
    <section className="section bg-paper" id="rewards">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <h2 className="heading-xl">YOUR POINTS. YOUR REWARDS.</h2>
          <Link to="/register"><Button variant="green">EXPLORE REWARDS →</Button></Link>
        </div>
        <div className="grid-4" style={{ marginTop: 48 }}>
          {rewards.map((r) => (
            <div key={r.name} className="card" style={{ position: 'relative' }}>
              <div style={{ color: 'var(--green)', textAlign: 'center' }}>
                <Icon name={r.icon} size={52} />
              </div>
              <Badge variant="hazard" rotate={6} className="rotate-r">{r.pts} Points</Badge>
              <h3 style={{ fontSize: 20, margin: '12px 0 6px' }}>{r.name}</h3>
              <p style={{ fontSize: 13 }}>{r.desc}</p>
              <Button variant="ink" className="btn-block btn-sm">VIEW REWARD</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="section bg-ink text-center" id="cta">
      <div className="container">
        <h2 className="headline-lg" style={{ color: 'var(--paper)' }}>
          READY TO TURN WASTE
          <br />
          INTO <span className="hl" style={{ transform: 'rotate(1deg)' }}>VALUE?</span>
        </h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
          <Link to="/register"><Button variant="hazard">CREATE FREE ACCOUNT</Button></Link>
          <Link to="/login"><Button className="btn-white">LOGIN</Button></Link>
        </div>
      </div>
      <TornEdge fill="var(--ink)" />
    </section>
  )
}