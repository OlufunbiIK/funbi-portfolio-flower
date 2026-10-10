export type FlowerId = 'peony' | 'rose' | 'daisy' | 'lav' | 'tulip'
export type WrapKey = 'now' | 'quarter' | 'look'
export type Paper = 'kraft' | 'pink' | 'sage'

export type Flower = { id: FlowerId; w: number; lab: string; sub: string; ids: string[] }

/** Each flower stands for a body of work. Only the flowers a visitor picks go into the bouquet. */
export const FLOWERS: Flower[] = [
  {
    id: 'peony',
    w: 33,
    lab: 'Event sites',
    sub: 'Weddings, showers, birthdays, community gatherings',
    ids: ['wedding', 'shower', 'bday', 'popcorn'],
  },
  {
    id: 'rose',
    w: 25,
    lab: 'Admin portals and permissions',
    sub: 'Dashboards, roles, back-office tools',
    ids: ['portal', 'vendor', 'life', 'general'],
  },
  {
    id: 'daisy',
    w: 26,
    lab: 'Polished interfaces',
    sub: 'Personal projects, built end to end',
    ids: ['money', 'quiz', 'food', 'inno', 'meal'],
  },
  {
    id: 'lav',
    w: 25,
    lab: 'Open source and backend',
    sub: 'Stellar, Soroban, NestJS',
    ids: ['maint', 'stellarts', 'sentinel', 'xconfess', 'manta', 'ecom', 'stark'],
  },
  {
    id: 'tulip',
    w: 15,
    lab: 'Complex flows and payments',
    sub: 'Journeys that people actually finish',
    ids: ['portal'],
  },
]

/** Where each flower sits, by how many flowers are in the bouquet: [left %, top %]. */
export const LAYOUT: Record<number, [number, number][]> = {
  1: [[50, 34]],
  2: [
    [38, 36],
    [62, 40],
  ],
  3: [
    [50, 26],
    [33, 42],
    [67, 42],
  ],
  4: [
    [50, 24],
    [31, 38],
    [69, 38],
    [50, 50],
  ],
  5: [
    [50, 22],
    [30, 36],
    [70, 36],
    [36, 47],
    [64, 48],
  ],
}

export const WRAPS: Record<WrapKey, { c: string; p: Paper; l: string; s: string }> = {
  now: { c: '#F0678F', p: 'pink', l: 'Needed now', s: 'A role or project that is open today' },
  quarter: { c: '#6FCF97', p: 'sage', l: 'This quarter', s: 'Planning ahead for the next few months' },
  look: { c: '#EADFC9', p: 'kraft', l: 'Just looking', s: 'Browsing, no deadline' },
}

export const flowerById = (id: string | null) => FLOWERS.find((f) => f.id === id)

export const SHELF_GROUPS: [string, string[]][] = [
  ['The day job: Leadway', ['portal', 'vendor', 'life', 'general']],
  ['Open source', ['maint', 'stellarts', 'sentinel', 'xconfess']],
  ['Event sites with Eventlybuilt', ['wedding', 'shower', 'bday', 'popcorn']],
  ['Personal projects', ['money', 'quiz', 'food', 'inno', 'meal']],
  ['Backend and APIs', ['manta', 'ecom', 'stark']],
]
