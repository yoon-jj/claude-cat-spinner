import { expect, test } from 'claude-code/testing'

import { framesOf, width } from '../hooks/art'
import { CATS } from '../hooks/cats'

const SPINNER = { word: 'Sauteing', message: null, suffix: '…', mode: 'thinking' } as const
const VERBS = new RegExp(CATS.flatMap(c => c.verbs).join('|'))


test('터미널: 고양이와 원래 스피너 줄이 함께, 단어는 고양이 행동으로', async ($, on) => {
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{`✻ ${e.props.word}${e.props.suffix} (12s · ↓ 300 tokens · high effort)`}</Text>
  })

  const ui = await $.ui.mount({
    plugin: 'cat-spinner', surface: 'terminal', component: 'Spinner', props: SPINNER,
    viewport: { columns: 120, rows: 40 },
  })
  const line = await ui.find({ type: 'Text', text: /tokens · high effort/ })
  expect(line).toBeDefined()
  expect(line?.text).toMatch(VERBS)
  expect(line?.text).not.toMatch(/Sauteing/)
  expect(await ui.find({ text: /ꞈ/, in: 'cat' })).toBeDefined()

  await ui.advance(2000)
  expect(await ui.find({ text: /ꞈ/, in: 'cat' })).toBeDefined()
  await ui.unmount()
})

test('좁은 창: 한 줄 산책냥', async ($, on) => {
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{`✻ ${e.props.word}…`}</Text>
  })

  const ui = await $.ui.mount({
    plugin: 'cat-spinner', surface: 'terminal', component: 'Spinner', props: SPINNER,
    viewport: { columns: 60, rows: 40 },
  })
  expect(await ui.find({ text: /ᓚᘏᗢ/, in: 'cat' })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /✻/ }))?.text).toMatch(/Strolling|Prowling/)
  await ui.unmount()
})

test('vscode: 원래 스피너 그대로', async ($, on) => {
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{`✻ ${e.props.word}…`}</Text>
  })

  const ui = await $.ui.mount({ plugin: 'cat-spinner', surface: 'vscode', component: 'Spinner', props: SPINNER })
  expect((await ui.find({ type: 'Text', text: /✻/ }))?.text).toMatch(/Sauteing/)
  await ui.unmount()
})

test('모든 고양이: 프레임끼리 줄 폭이 같아서 옆 줄이 흔들리지 않음', async () => {
  for (const style of ['cute', 'ascii'] as const) {
    for (const cat of CATS) {
      const widths = new Set(framesOf(cat, style).flat().map(width))
      expect(widths.size).toBe(1)
    }
  }
  expect(CATS.length).toBe(24)
})
