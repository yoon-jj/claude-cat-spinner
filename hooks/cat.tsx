import type { ClientModule } from 'claude-code'

type Seg = { t: string; c: string | null; bg: string | null }
type Props = { frames: Seg[][][]; ms: number }
type State = { tick: number }

const TICK = 100

// 터미널 안에서만 도는 프레임 타이머. hooks 모듈이나 모델을 부르지 않음
const Cat: ClientModule<Props, State> = (props, surface) => {
  const { Box, Text } = surface.elements

  if (surface.state === undefined) {
    let tick = 0
    surface.setState({ tick })
    surface.every(TICK, () => {
      tick += 1
      surface.setState({ tick })
    })
  }

  const tick = surface.state?.tick ?? 0
  const frame = props.frames[Math.floor((tick * TICK) / props.ms) % props.frames.length] ?? []

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
