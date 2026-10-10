'use client'

import { useId } from 'react'
import { STACK } from '@/data/stack'
import { useSheets } from '@/components/shared/sheetsContext'

const LEAF = '#4F9A5F'
const LEAF_DARK = '#357A49'

/** One of five plant shapes, chosen by position, so the shelf looks varied. */
function Plant({ type, accent }: { type: number; accent: string }) {
  switch (type) {
    case 0:
      return (
        <>
          <ellipse cx="28" cy="30" rx="11" ry="15" fill={LEAF} transform="rotate(-25 28 30)" />
          <ellipse cx="52" cy="30" rx="11" ry="15" fill={LEAF_DARK} transform="rotate(25 52 30)" />
          <ellipse cx="40" cy="22" rx="11" ry="16" fill={LEAF} />
        </>
      )
    case 1:
      return (
        <path
          d="M40 52L30 12L38 50ZM40 52L40 6L44 50ZM40 52L52 12L46 50ZM40 52L20 22L36 52ZM40 52L62 22L44 52Z"
          fill={LEAF}
        />
      )
    case 2:
      return (
        <>
          <path
            d="M40 52Q20 38 18 14M40 52Q60 38 62 14M40 52Q40 30 40 6"
            stroke={LEAF_DARK}
            strokeWidth="2.5"
            fill="none"
          />
          {[
            [24, 36],
            [20, 26],
            [19, 17],
            [56, 36],
            [60, 26],
            [61, 17],
            [40, 32],
            [40, 20],
            [40, 10],
          ].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="5" ry="3.4" fill={LEAF} />
          ))}
        </>
      )
    case 3:
      return (
        <>
          <ellipse cx="40" cy="44" rx="9" ry="14" fill={LEAF_DARK} />
          <ellipse cx="29" cy="44" rx="8" ry="12" fill={LEAF} transform="rotate(-35 29 44)" />
          <ellipse cx="51" cy="44" rx="8" ry="12" fill={LEAF} transform="rotate(35 51 44)" />
          <ellipse cx="40" cy="40" rx="7" ry="11" fill={LEAF} />
        </>
      )
    default:
      return (
        <>
          <path d="M40 54V16" stroke={LEAF_DARK} strokeWidth="3" />
          <ellipse cx="30" cy="36" rx="9" ry="5" fill={LEAF} transform="rotate(-20 30 36)" />
          <ellipse cx="50" cy="28" rx="9" ry="5" fill={LEAF} transform="rotate(20 50 28)" />
          <circle cx="40" cy="14" r="8" fill={accent} />
          <circle cx="40" cy="14" r="3" fill="#fff" />
        </>
      )
  }
}

function Pot({ k, index }: { k: string; index: number }) {
  const { openStack } = useSheets()
  const gradient = useId()
  const [name, short, [c1, c2], ids] = STACK[k]
  return (
    <button
      type="button"
      className="pot"
      data-k={k}
      aria-label={`${name}, ${ids.length} projects`}
      onClick={() => openStack(k)}
    >
      <svg viewBox="0 0 80 90" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="0" x2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <Plant type={index % 5} accent={c1} />
        <path d="M18 52H62L57 86H23Z" fill={`url(#${gradient})`} />
        <rect x="15" y="48" width="50" height="8" rx="2" fill={c1} />
        <text
          x="40"
          y="76"
          textAnchor="middle"
          fontFamily="Bricolage Grotesque,sans-serif"
          fontWeight="800"
          fontSize="14"
          fill="#fff"
        >
          {short}
        </text>
      </svg>
      <span>{name}</span>
    </button>
  )
}

/** The tools I use, as a shelf of potted plants. Tapping a pot shows the projects built with it. */
export function Shelf() {
  return (
    <div className="shelf">
      {Object.keys(STACK).map((k, i) => (
        <Pot key={k} k={k} index={i} />
      ))}
    </div>
  )
}
