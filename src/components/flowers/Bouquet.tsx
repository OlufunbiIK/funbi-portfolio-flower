import type { CSSProperties } from 'react'
import { FLOWERS, LAYOUT, WRAPS, type FlowerId, type WrapKey } from './data'

type Props = {
  stems: FlowerId[]
  wrap: WrapKey | null
  /** The flower that was just added, so it can grow in. */
  fresh?: FlowerId | null
  /** Ribbon tied and tag attached. */
  tied?: boolean
  /** Reveal screen: each flower becomes a button. */
  interactive?: boolean
  selected?: string | null
  onPick?: (id: FlowerId) => void
  visitor?: string
}

/** Branches of eucalyptus: [rotation in degrees, width %]. */
const EUCALYPTUS: [number, number][] = [
  [-132, 46],
  [-48, 46],
  [-104, 42],
  [-76, 42],
  [-156, 40],
  [-24, 40],
]
/** Baby's breath sprays: [rotation, width %]. */
const GYP: [number, number][] = [
  [-34, 30],
  [30, 30],
  [0, 34],
  [-14, 26],
  [16, 26],
]

/**
 * The bouquet, composed from real photo cutouts. Eucalyptus and baby's breath always come with it;
 * only the flowers the visitor picked are added. The wrapping paper and ribbon follow the timeline.
 */
export function Bouquet({ stems, wrap, fresh, tied, interactive, selected, onPick, visitor }: Props) {
  const flowers = FLOWERS.filter((f) => stems.includes(f.id))
  const spots = LAYOUT[flowers.length] ?? []
  const paper = wrap ? WRAPS[wrap].p : 'kraft'
  const label = flowers.length
    ? `A bouquet of ${flowers.map((f) => f.lab.toLowerCase()).join(', ')}`
    : 'An empty bouquet, only greenery'

  return (
    <div className={`fbq${tied ? ' tied' : ''}`} role="img" aria-label={label}>
      {EUCALYPTUS.map(([rot, w]) => (
        <img
          key={`e${rot}`}
          className="g1"
          src="/flowers/euc.webp"
          alt=""
          style={{ left: '50%', top: '76%', width: `${w}%`, rotate: `${rot}deg` }}
        />
      ))}
      {GYP.map(([rot, w]) => (
        <img
          key={`g${rot}`}
          className="g2"
          src="/flowers/gyp.webp"
          alt=""
          style={{ left: '50%', top: '78%', width: `${w}%`, rotate: `${rot}deg` }}
        />
      ))}
      <svg className="sv" viewBox="0 0 100 120" aria-hidden="true">
        {flowers.map((f, i) => {
          const [x, y] = spots[i]
          return (
            <path
              key={f.id}
              d={`M${x} ${y * 1.2}Q${(x + 50) / 2} ${y * 1.2 + 24} 50 80`}
              stroke="#4F7F57"
              strokeWidth="1.15"
              fill="none"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
      {flowers.map((f, i) => {
        const [x, y] = spots[i]
        const tilt = (x - 50) * 0.5
        return (
          <img
            key={f.id}
            className={`f${fresh === f.id ? ' n' : ''}`}
            src={`/flowers/${f.id}.webp`}
            alt={f.lab}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                width: `${f.w}%`,
                rotate: `${tilt}deg`,
                '--r': tilt,
                '--d': `-${i * 1.1}s`,
              } as CSSProperties
            }
          />
        )
      })}
      <img className="wrp" src={`/flowers/wrap-${paper}.webp`} alt="" />
      <img className="bow" src={`/flowers/bow-${paper}.webp`} alt="" />
      <div className="ftag" aria-hidden="true">
        <i />
        <div>
          To <b>Funbi</b>from {visitor || 'a visitor'}
        </div>
      </div>
      {interactive &&
        flowers.map((f, i) => {
          const [x, y] = spots[i]
          return (
            <button
              key={f.id}
              type="button"
              className={`hs${selected === f.id ? ' sel' : ''}`}
              aria-label={f.lab}
              style={{ left: `${x}%`, top: `${y}%`, width: `${f.w}%`, aspectRatio: '1' }}
              onClick={() => onPick?.(f.id)}
            />
          )
        })}
    </div>
  )
}
