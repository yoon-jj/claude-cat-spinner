import { CATS, type Cat, type Group } from './cats'

// 한 줄의 한 조각: 글자와 색. null이면 고양이 기본색
export type Seg = { t: string; c: string | null; bg: string | null }
export type Style = 'cute' | 'ascii'

const PINK = '#f08fb0'
const BLUE = '#79b8e8'
const YELLOW = '#f2c66d'
const GREEN = '#8fcf8f'
const SCREEN_FG = '#8df0a8'
const SCREEN_BG = '#16352a'

const ASCII: [RegExp, string][] = [
  [/ᓚᘏᗢ/g, '=^.^='], [/•/g, 'o'], [/ꞈ/g, '.'], [/ᴗ/g, '-'], [/º/g, 'O'], [/♡/g, '<3'], [/[♪♫]/g, '~'],
  [/⌒/g, '~'], [/[✧✦⋆]/g, '*'], [/▭/g, '='], [/·/g, '.'], [/[つっ]/g, 'o'], [/[ノﾉ]/g, '/'],
]

// 터미널에서 두 칸을 차지하는 문자 (한글, 가나, 전각). 폭 모호 문자는 한 칸으로 봄
const isWide = (code: number) =>
  (code >= 0x1100 && code <= 0x115f) || (code >= 0x2e80 && code <= 0x303e) || (code >= 0x3041 && code <= 0x33ff) ||
  (code >= 0x3400 && code <= 0x4dbf) || (code >= 0x4e00 && code <= 0x9fff) || (code >= 0xac00 && code <= 0xd7a3) ||
  (code >= 0xf900 && code <= 0xfaff) || (code >= 0xfe30 && code <= 0xfe4f) || (code >= 0xff00 && code <= 0xff60) ||
  (code >= 0xffe0 && code <= 0xffe6)

export const width = (s: string) => [...s].reduce((n, ch) => n + (isWide(ch.codePointAt(0) ?? 0) ? 2 : 1), 0)

const ACCENT = /(\{[^}]*\})|(♡|<3)|(><>|<><)|([✧✦⋆♪♫*])|(<:3 \)~|@)|(z+Z*z*|Z+z*)|(▭+)/g

export function segments(line: string): Seg[] {
  const out: Seg[] = []
  const plain = (t: string) => t && out.push({ t, c: null, bg: null })
  let last = 0
  for (const m of line.matchAll(ACCENT)) {
    plain(line.slice(last, m.index))
    const [all, screen, heart, fish, star, toy, zzz] = m
    if (screen) {
      plain('|')
      out.push({ t: screen.slice(1, -1), c: SCREEN_FG, bg: SCREEN_BG })
      plain('|')
    } else {
      const c = heart ? PINK : fish || zzz ? BLUE : star ? YELLOW : toy ? 'inactive' : GREEN
      out.push({ t: all, c, bg: null })
    }
    last = (m.index ?? 0) + all.length
  }
  plain(line.slice(last))
  return out
}

// 고양이 한 마리의 프레임을 스타일에 맞게 바꾸고, 줄마다 같은 폭으로 채움
export function framesOf(cat: Cat, style: Style): string[][] {
  const mapped = cat.frames.map(f => f.map(l => (style === 'ascii' ? ASCII.reduce((s, [re, r]) => s.replace(re, r), l) : l)))
  const lines = mapped.every(f => f[0].trim() === '') ? mapped.map(f => [f[1]]) : mapped
  const w = Math.max(...lines.flat().map(width))
  return lines.map(f => f.map(l => l + ' '.repeat(w - width(l))))
}

const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

export const GROUPS = {
  thinking: 'thinking', 'tool-input': 'tool', 'tool-use': 'tool', responding: 'responding', requesting: 'requesting',
} as const satisfies Record<string, Group>

// 같은 key면 같은 고양이와 같은 단어
export function pick(group: Group, key: string): { cat: Cat; verb: string } {
  const pool = CATS.filter(c => c.group === group)
  const h = hash(key)
  const cat = pool[h % pool.length] ?? CATS[0]!
  return { cat, verb: cat.verbs[(h >>> 8) % cat.verbs.length] ?? cat.verbs[0]! }
}
