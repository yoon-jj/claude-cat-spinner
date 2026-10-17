import type { Register } from 'claude-code'

import { framesOf, GROUPS, pick, segments, width } from './art'

// 원래 스피너 줄(단어 + 시간·토큰·effort)에 남겨 둘 칸. 모자라면 한 줄 고양이로 바꿔 줄이 잘리지 않게 함
const LINE_ROOM = 64

export const register: Register = (on, options) => {
  const style = options.style === 'ascii' ? 'ascii' : 'cute'
  const speed = typeof options.speed === 'number' && options.speed > 0 ? options.speed : 1
  let turn = 0

  on('prompt.submit', ($, e, next) => {
    turn += 1

    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'terminal') {
      return next(e)
    }

    const columns = e.viewport?.columns ?? Infinity
    const group = GROUPS[e.props.mode]
    let { cat, verb } = pick(group, `${e.requestId}:${turn}:${group}`)
    const catWidth = width(framesOf(cat, style)[0]?.[0] ?? '')
    if (columns - catWidth - 1 < LINE_ROOM) {
      ;({ cat, verb } = pick('mini', `${e.requestId}:${turn}:mini`))
    }

    // 단어만 바꾸고 별 문자·반짝임·시간·토큰·effort는 엔진이 그대로 그림
    const drawing = await next({ ...e, props: { ...e.props, word: verb } })
    const lines = framesOf(cat, style)
    const frames = lines.map(f => f.map(segments))
    const shownWidth = width(lines[0]?.[0] ?? '')
    const { Box, Client, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" alignItems="flex-end">
        {/* 고양이 칸은 줄어들지 않게 고정: 줄어들면 줄이 접혀 귀와 얼굴이 떨어짐 */}
        <Box flexShrink={0} width={shownWidth}>
          <Client key="cat" module="./cat.tsx" props={{ frames, ms: Math.round(cat.ms / speed) }} />
        </Box>
        <Text> </Text>
        {drawing}
      </Box>
    )
  })
}
