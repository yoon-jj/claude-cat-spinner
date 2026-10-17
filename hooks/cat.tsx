import type { ClientModule } from 'claude-code'

type Seg = { t: string; c: string | null; bg: string | null }
type Props = { frames: Seg[][][]; ms: number }
// box는 타이머와 그리기가 함께 보는 값: 지금 고양이의 프레임 간격과 흐른 시간
type Box = { ms: number; elapsed: number; idx: number }
type State = { idx: number; box: Box }

const TICK = 50

// 터미널 안에서만 도는 프레임 타이머. hooks 모듈이나 모델을 부르지 않음.
// 프레임이 실제로 바뀔 때만 setState 해서 다시 그리는 횟수를 줄임
const Cat: ClientModule<Props, State> = (props, surface) => {
  const { Box, Text } = surface.elements

  if (surface.state === undefined) {
    const box: Box = { ms: props.ms, elapsed: 0, idx: 0 }
    surface.setState({ idx: 0, box })
    surface.every(TICK, () => {
      box.elapsed += TICK
      const idx = Math.floor(box.elapsed / box.ms)
      if (idx !== box.idx) {
        box.idx = idx
        surface.setState({ idx, box })
      }
    })
  } else {
    // 고양이가 바뀌면 새 고양이의 속도로
    surface.state.box.ms = props.ms
  }

  const idx = surface.state?.idx ?? 0
  const frame = props.frames[idx % props.frames.length] ?? []

  return (
    <Box flexDirection="column">
      {frame.map(line => (
        <Text color="claude" wrap="truncate">
          {line.map(s =>
            s.bg ? (
              <Text color={s.c ?? 'claude'} backgroundColor={s.bg}>{s.t}</Text>
            ) : (
              <Text color={s.c ?? 'claude'}>{s.t}</Text>
            ),
          )}
        </Text>
      ))}
    </Box>
  )
}

export default Cat
