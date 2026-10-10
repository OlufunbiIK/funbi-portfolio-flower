'use client'

import { useEffect, useRef, useState } from 'react'
import { CASE_IDS } from '@/data/caseStudies'
import { PROJECTS } from '@/data/projects'
import { SITE } from '@/lib/site'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { BootSplash } from '@/components/shared/BootSplash'
import { CvLink } from '@/components/shared/CvLink'
import { Quotes } from '@/components/shared/KindWords'
import { Modal } from '@/components/shared/Modal'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { SheetsProvider } from '@/components/shared/Sheets'
import { ThemeSwitch } from '@/components/shared/ThemeSwitch'
import { Bouquet } from './Bouquet'
import { FLOWERS, SHELF_GROUPS, WRAPS, flowerById, type FlowerId, type WrapKey } from './data'
import { Shelf } from './Shelf'

type Scene = 'intro' | 'build' | 'reveal' | 'all'
type Tab = FlowerId | 'kind' | 'shelf'

export function FlowerApp() {
  return (
    <SheetsProvider>
      <App />
    </SheetsProvider>
  )
}

/** A few petals that drift down when the bouquet is revealed. */
function Petals() {
  const [petals] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      dx: `${(Math.random() - 0.5) * 160}px`,
      rt: `${Math.random() * 540}deg`,
      dur: `${3.5 + Math.random() * 3}s`,
      delay: `${Math.random() * 1.6}s`,
      tone: ['#F6B7C8', '#E8789C', '#F7D6DF'][i % 3],
    })),
  )
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 8500)
    return () => window.clearTimeout(t)
  }, [])
  if (gone) return null
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <i
          key={i}
          style={
            {
              left: p.left,
              '--dx': p.dx,
              '--rt': p.rt,
              animationDuration: p.dur,
              animationDelay: p.delay,
              background: `linear-gradient(135deg,${p.tone},#E8789C)`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function App() {
  const reduced = useReducedMotion()
  const [scene, setScene] = useState<Scene>('intro')
  const [step, setStep] = useState(0)
  const [stems, setStems] = useState<FlowerId[]>([])
  const [wrap, setWrap] = useState<WrapKey | null>(null)
  const [tab, setTab] = useState<Tab | null>(null)
  const [fresh, setFresh] = useState<FlowerId | null>(null)
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [error, setError] = useState('')
  const [tying, setTying] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const v1 = useRef<HTMLVideoElement>(null)
  const v2 = useRef<HTMLVideoElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (reduced) {
      v1.current?.pause()
      v2.current?.pause()
    }
  }, [reduced])

  // Move focus to the new screen's heading, so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const h = document.querySelector<HTMLElement>(`#s-${scene} h1, #s-${scene} h2`)
    h?.setAttribute('tabindex', '-1')
    h?.focus({ preventScroll: true })
  }, [scene])

  const go = (s: Scene) => {
    setScene(s)
    setError('')
  }
  const reset = () => {
    setScene('intro')
    setStep(0)
    setStems([])
    setWrap(null)
    setTab(null)
    setFresh(null)
    setForm({ name: '', email: '', note: '' })
    setTying(false)
  }
  const toggle = (id: FlowerId) => {
    setStems((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
    setFresh(stems.includes(id) ? null : id)
  }
  const ordered = FLOWERS.filter((f) => stems.includes(f.id))
  const current = typeof tab === 'string' ? flowerById(tab) : undefined
  const bg = scene === 'build' || scene === 'reveal' ? '2' : '1'

  const next = () => {
    if (step === 0) {
      if (!stems.length) return setError('Pick at least one flower.')
      setError('')
      setStep(1)
    } else if (step === 1) {
      if (!wrap) return setError('Choose a timeline.')
      setError('')
      setStep(2)
    } else {
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
        return setError('That email looks incomplete. Check it or leave it blank.')
      setError('')
      setTab(ordered[0].id)
      setTying(true)
      window.setTimeout(
        () => {
          setTying(false)
          setScene('reveal')
        },
        reduced ? 0 : 2300,
      )
    }
  }

  const firstName = form.name.trim().split(' ')[0]
  const noteBody = `Hi Funbi,\n\nI am looking for: ${ordered.map((f) => f.lab).join('; ')}.\nTimeline: ${wrap ? WRAPS[wrap].l : 'Not set'}.\n\n${form.note}\n\n${form.name}${form.email ? `\n${form.email}` : ''}`

  return (
    <>
      <BootSplash />
      <a className="skipl" href="#fl-main">
        Skip to content
      </a>
      <div id="app" data-bg={bg} data-sc={scene}>
        <video
          ref={v1}
          className="bgv"
          id="v1"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/bg-greenhouse.jpg"
          src="/media/bg-greenhouse.mp4"
          aria-hidden="true"
        />
        <video
          ref={v2}
          className="bgv"
          id="v2"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/bg-market.jpg"
          src="/media/bg-market.mp4"
          aria-hidden="true"
        />
        <div id="shade" />

        <header className="ftop" id="ftop">
          <a
            className="logo"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              reset()
            }}
          >
            FUNBI
          </a>
          <p className="avail">
            <i aria-hidden="true" />
            Open to remote roles
          </p>
          <span className="gap" />
          <button type="button" className="smb hide-s" onClick={() => go('all')}>
            Everything at a glance
          </button>
          <div className="nvr">
            <ThemeSwitch />
            <CvLink className="btn g cvn">Résumé</CvLink>
          </div>
        </header>

        <main id="fl-main">
          {scene === 'intro' && (
            <section className="scene on" id="s-intro" aria-label="Introduction">
              <div className="hp glass">
                <p className="avail" style={{ marginBottom: 12 }}>
                  <i aria-hidden="true" />
                  Open to remote roles
                </p>
                <p className="hola" lang="es">
                  ¡Hola! Me llamo Funbi.
                </p>
                <h1>I build the screens people fill in.</h1>
                <p className="lead">
                  Frontend developer at Leadway Assurance in Abuja. Build a bouquet and I&apos;ll show you the work that
                  fits.
                </p>
                <div className="bt">
                  <button className="btn" type="button" onClick={() => go('build')}>
                    Build a bouquet
                  </button>
                  <button className="btn g" type="button" onClick={() => go('all')}>
                    See everything at a glance
                  </button>
                </div>
              </div>
            </section>
          )}

          {scene === 'build' && (
            <section className="scene on" id="s-build" aria-label="Bouquet builder">
              <div className="flp glass" id="bp">
                <ol className="fsteps">
                  {['Flowers', 'Timeline', 'Card'].map((n, i) => (
                    <li key={n} className={i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>
                      {n}
                    </li>
                  ))}
                </ol>

                {step === 0 && (
                  <>
                    <h2>What do you need?</h2>
                    <p className="s">Pick the flowers you want. Only the ones you pick go in the bouquet.</p>
                    <div className="opts">
                      {FLOWERS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className="opt"
                          aria-pressed={stems.includes(f.id)}
                          onClick={() => toggle(f.id)}
                        >
                          <img src={`/flowers/m-${f.id}.webp`} alt="" width={48} height={48} />
                          <div>
                            <b>{f.lab}</b>
                            <span>{f.sub}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="fnote">Eucalyptus and baby&apos;s breath come with every bouquet.</p>
                  </>
                )}
                {step === 1 && (
                  <>
                    <h2>When do you need it?</h2>
                    <p className="s">The wrapping paper takes on the colour.</p>
                    <div className="opts">
                      {(Object.keys(WRAPS) as WrapKey[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          className="opt"
                          aria-pressed={wrap === k}
                          onClick={() => setWrap(k)}
                        >
                          <i className="sw3" style={{ background: WRAPS[k].c }} />
                          <div>
                            <b>{WRAPS[k].l}</b>
                            <span>{WRAPS[k].s}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2>Write your card</h2>
                    <p className="s">A few lines about the role or project. I read every one.</p>
                    <label htmlFor="nm">Your name</label>
                    <input
                      id="nm"
                      autoComplete="name"
                      value={form.name}
                      disabled={tying}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <label htmlFor="em">Your email</label>
                    <input
                      id="em"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      disabled={tying}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <label htmlFor="tx">Your note</label>
                    <textarea
                      id="tx"
                      rows={3}
                      value={form.note}
                      disabled={tying}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
                  </>
                )}

                <div className="fnav">
                  {step > 0 && (
                    <button
                      className="btn g"
                      type="button"
                      disabled={tying}
                      onClick={() => {
                        setStep(step - 1)
                        setError('')
                      }}
                    >
                      Back
                    </button>
                  )}
                  <button className="btn" type="button" disabled={tying} onClick={next}>
                    {step === 0 ? 'Next: timeline' : step === 1 ? 'Next: card' : 'Wrap it up'}
                  </button>
                  <span className="msg" role="status">
                    {error || (tying && !reduced ? 'Tying the ribbon...' : '')}
                  </span>
                  {step === 0 && (
                    <button className="linkb" type="button" onClick={() => go('all')}>
                      Skip to everything
                    </button>
                  )}
                </div>
              </div>
              <div className="stage">
                <Bouquet stems={stems} wrap={wrap} fresh={fresh} tied={tying} visitor={firstName} />
              </div>
            </section>
          )}

          {scene === 'reveal' && (
            <section className="scene on" id="s-reveal" aria-label="Your bouquet">
              <div className="stage">
                <Bouquet
                  stems={stems}
                  wrap={wrap}
                  tied
                  interactive
                  selected={tab}
                  onPick={setTab}
                  visitor={firstName}
                />
                <Petals />
              </div>
              <div className="flp glass" id="rp">
                <h2>Your bouquet</h2>
                <p className="s">Pick a flower to open the work behind it.</p>
                <div className="chips2" role="tablist">
                  {ordered.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      className="chip2"
                      aria-selected={tab === f.id}
                      onClick={() => setTab(f.id)}
                    >
                      <img src={`/flowers/m-${f.id}.webp`} alt="" width={30} height={30} />
                      {f.lab}
                    </button>
                  ))}
                  <button
                    type="button"
                    role="tab"
                    className="chip2"
                    aria-selected={tab === 'kind'}
                    onClick={() => setTab('kind')}
                  >
                    <span className="ic" aria-hidden="true">
                      &ldquo;
                    </span>
                    Kind words
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className="chip2"
                    aria-selected={tab === 'shelf'}
                    onClick={() => setTab('shelf')}
                  >
                    <span className="ic" aria-hidden="true">
                      &#127807;
                    </span>
                    Greenhouse
                  </button>
                </div>
                {current && (
                  <>
                    <h3 style={{ margin: '2px 0 4px' }}>{current.lab}</h3>
                    <p className="s" style={{ marginBottom: 8 }}>
                      {current.sub}
                    </p>
                    <div className="tr">
                      {current.ids.map((i) => (
                        <ProjectCard key={i} id={i} />
                      ))}
                    </div>
                  </>
                )}
                {tab === 'kind' && (
                  <>
                    <h3 style={{ margin: '2px 0 8px' }}>Kind words</h3>
                    <Quotes />
                  </>
                )}
                {tab === 'shelf' && (
                  <>
                    <h3 style={{ margin: '2px 0 4px' }}>On my greenhouse shelf</h3>
                    <p className="s" style={{ marginBottom: 8 }}>
                      The tools I reach for most. Tap a pot to see what I built with it.
                    </p>
                    <Shelf />
                  </>
                )}
                <div className="acts">
                  <button className="btn" type="button" onClick={() => setNoteOpen(true)}>
                    Send my note
                  </button>
                  <button
                    className="btn g"
                    type="button"
                    onClick={() => {
                      setStep(0)
                      go('build')
                    }}
                  >
                    Change my bouquet
                  </button>
                  <CvLink>Download CV</CvLink>
                  <button className="btn g" type="button" onClick={() => go('all')}>
                    Everything at a glance
                  </button>
                </div>
              </div>
            </section>
          )}

          {scene === 'all' && (
            <section className="scene on" id="s-all" aria-label="Everything at a glance">
              <div className="all-in">
                <h1>Everything at a glance</h1>
                <p>All the work in one place, for when you are short on time. Tap anything to open it.</p>
                <div className="allbar">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setStep(0)
                      go('build')
                    }}
                  >
                    Build a bouquet instead
                  </button>
                  <CvLink>Download CV</CvLink>
                  <a className="btn g" href={`mailto:${SITE.email}`}>
                    Email me
                  </a>
                  <a className="btn g" href={SITE.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a className="btn g" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
                <h2>Case studies</h2>
                <div className="agrid">
                  {CASE_IDS.map((i) => (
                    <ProjectCard key={i} id={i} />
                  ))}
                </div>
                {SHELF_GROUPS.map(([title, ids]) => (
                  <div key={title}>
                    <h2>{title}</h2>
                    <div className="agrid">
                      {ids
                        .filter((i) => PROJECTS[i])
                        .map((i) => (
                          <ProjectCard key={i} id={i} />
                        ))}
                    </div>
                  </div>
                ))}
                <h2>Kind words</h2>
                <Quotes />
                <h2>On my greenhouse shelf</h2>
                <div className="glass allglass">
                  <Shelf />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Modal id="ord" label="Your note" open={noteOpen} onClose={() => setNoteOpen(false)}>
        <div className="mb" style={{ margin: 0, paddingTop: 26 }}>
          <button type="button" className="x" aria-label="Close" onClick={() => setNoteOpen(false)}>
            &times;
          </button>
          <h2>Your note</h2>
          <div>
            <p>
              <b>Flowers:</b> {ordered.map((f) => f.lab).join('; ')}
            </p>
            <p>
              <b>Timeline:</b> {wrap ? WRAPS[wrap].l : 'Not set'}
            </p>
            <p>
              <b>Card:</b> {form.note || 'No note'}
            </p>
            <p>
              <b>From:</b> {form.name || 'Anonymous'}
              {form.email ? ` (${form.email})` : ''}
            </p>
          </div>
          <p className="pv">Nothing is sent from this page. The button opens your email app with the note filled in.</p>
          <p>
            <a
              className="btn"
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Bouquet note from ${form.name || 'your portfolio'}`)}&body=${encodeURIComponent(noteBody)}`}
            >
              Send by email
            </a>
          </p>
        </div>
      </Modal>
    </>
  )
}
