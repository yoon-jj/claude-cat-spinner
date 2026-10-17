import { expect, test } from 'claude-code/testing'

import { CATS } from '../hooks/cats'

const MODES = ['thinking', 'tool-input', 'tool-use', 'responding', 'requesting'] as const
const GROUP = { thinking: 'thinking', 'tool-input': 'tool', 'tool-use': 'tool', responding: 'responding', requesting: 'requesting' } as const

const engine = (on: any) =>
  on('ui.render', { component: 'Spinner' }, ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{`✻ ${e.props.message ?? e.props.word}${e.props.suffix} (12s · ↓ 300 tokens · high effort)`}</Text>
  })

const mount = ($: any, props: object, columns = 160) =>
  $.ui.mount({
    plugin: 'cat-spinner', surface: 'terminal', component: 'Spinner',
    props: { word: 'Sauteing', message: null, suffix: '…', mode: 'thinking', ...props },
    viewport: { columns, rows: 40 },
  })

test('모든 모드: 그 모드 묶음의 고양이 단어가 나오고 원래 정보가 남음', async ($, on) => {
  engine(on)
  for (const mode of MODES) {
    const verbs = CATS.filter(c => c.group === GROUP[mode]).flatMap(c => c.verbs)
    const ui = await mount($, { mode })
    const line = (await ui.find({ type: 'Text', text: /tokens · high effort/ }))?.text ?? ''
    expect(verbs.some(v => line.includes(v))).toBe(true)
    expect(await ui.find({ text: /\S/, in: 'cat' })).toBeDefined()
    await ui.unmount()
  }
})

test('엔진이 message를 띄우면 그 문구가 그대로 보임', async ($, on) => {
  engine(on)
  const ui = await mount($, { message: 'Compacting conversation…' })
  expect((await ui.find({ type: 'Text', text: /tokens/ }))?.text).toMatch(/Compacting conversation/)
  await ui.unmount()
})

test('모드가 바뀌면 다시 그려짐', async ($, on) => {
  engine(on)
  const ui = await mount($, { mode: 'thinking' })
  await ui.redraw({ word: 'Sauteing', message: null, suffix: '…', mode: 'requesting' })
  const verbs = CATS.filter(c => c.group === 'requesting').flatMap(c => c.verbs)
  const line = (await ui.find({ type: 'Text', text: /tokens/ }))?.text ?? ''
  expect(verbs.some(v => line.includes(v))).toBe(true)
  await ui.advance(5000)
  expect(await ui.find({ text: /\S/, in: 'cat' })).toBeDefined()
  await ui.unmount()
})

test('80칸 터미널: 줄이 넘치지 않게 고양이 폭 + 원래 줄 공간 확보', async ($, on) => {
  engine(on)
  for (let i = 0; i < 20; i++) {
    const ui = await $.ui.mount({
      plugin: 'cat-spinner', surface: 'terminal', component: 'Spinner', requestId: `agent-${i}`,
      props: { word: 'Sauteing', message: null, suffix: '…', mode: MODES[i % MODES.length] },
      viewport: { columns: 80, rows: 40 },
    })
    const cat = (await ui.findAll({ type: 'Text', in: 'cat' })).map(t => t.text ?? '')
    const widest = Math.max(...cat.map(t => [...t].length))
    expect(80 - widest - 1).toBeGreaterThanOrEqual(64)
    await ui.unmount()
  }
})

test('ascii 옵션: 유니코드 없이 그려짐', { options: { style: 'ascii' } }, async ($, on) => {
  engine(on)
  for (const mode of MODES) {
    const ui = await mount($, { mode })
    for (const t of await ui.findAll({ type: 'Text', in: 'cat' })) {
      expect(/^[\x20-\x7e]*$/.test(t.text ?? '')).toBe(true)
    }
    await ui.unmount()
  }
})

test('desktop: 원래 스피너 그대로', async ($, on) => {
  engine(on)
  const ui = await $.ui.mount({
    plugin: 'cat-spinner', surface: 'desktop', component: 'Spinner',
    props: { word: 'Creating notes.md', message: null, suffix: '…', mode: 'tool-use' },
  })
  expect((await ui.find({ type: 'Text', text: /tokens/ }))?.text).toMatch(/Creating notes\.md/)
  await ui.unmount()
})

test('프레임 타이머: 시간이 흐르면 고양이 프레임이 바뀜', async ($, on) => {
  engine(on)
  const ui = await mount($, { mode: 'thinking' })
  const seen = new Set<string>()
  for (let i = 0; i < 12; i++) {
    seen.add((await ui.findAll({ type: 'Text', in: 'cat' })).map(t => t.text).join('\n'))
    await ui.advance(250)
  }
  expect(seen.size).toBeGreaterThan(1)
  await ui.unmount()
})
