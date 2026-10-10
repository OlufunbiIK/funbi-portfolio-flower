'use client'

import { useState, type ReactNode } from 'react'
import { PROJECTS } from '@/data/projects'
import { Mock } from '@/components/mocks/Mock'

type Props = {
  id: string
  /** Inside a project sheet: mock screens become clickable. */
  live?: boolean
}

/** The picture for a project: a real screenshot or a recreated screen. */
export function ProjectVisual({ id, live }: Props) {
  const p = PROJECTS[id]
  const [loaded, setLoaded] = useState(false)
  const heavy = Boolean(p.img)
  const track = (el: HTMLImageElement | null) => {
    if (el?.complete) setLoaded(true)
  }

  let inner: ReactNode
  if (p.img) {
    inner = (
      <img
        ref={track}
        src={`/images/${p.img}.webp`}
        alt={`Screenshot of ${p.name}`}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    )
  } else {
    inner = (
      <div className="mk" aria-hidden={live ? undefined : true}>
        <Mock id={id} live={live} />
      </div>
    )
  }

  return (
    <div
      className={`art ${heavy && !loaded ? 'sk' : 'ok'}`}
      style={{ background: `linear-gradient(135deg,${p.c[0]},${p.c[1]})` }}
    >
      {inner}
    </div>
  )
}
