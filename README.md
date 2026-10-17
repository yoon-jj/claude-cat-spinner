# claude-cat-spinner 🐾

Claude Code가 일하는 동안 돌아가는 스피너 옆에 ASCII 고양이가 놀러 와요.

*A Claude Code mod that puts a tiny animated ASCII cat next to the spinner. Zero extra tokens.*

```
 /\_/\
( ᴗꞈᴗ ) zZz  ✻ Dozing… (12s · ↓ 1.2k tokens · high effort)
```

```
 /\_/\   |>==_|
( •ꞈ•)つ/______\  ✻ Coding… (34s · ↓ 3.4k tokens · high effort)
```

## 이런 게 돼요

- **고양이 24종**: Claude가 지금 뭘 하는지에 따라 어울리는 고양이가 나와요. 생각할 땐 꾸벅꾸벅 졸고, 도구를 쓸 땐 노트북을 두드려요.
- **스피너 단어도 고양이 말로**: `Dozing…`, `Kneading…`, `Munching churu…`, `Chasing the dot…`
- **원래 정보는 그대로**: 별 문자 회전, 글자 반짝임, 경과 시간, 토큰 수, effort 표시는 전혀 건드리지 않아요.
- **토큰 비용 0**: 고양이는 내 터미널 안에서만 그려져요. 모델에는 아무것도 보내지 않아요.

## 설치

Claude Code 입력창에서:

```
/plugin install cat-spinner --marketplace yoon-jj/claude-cat-spinner
```

마켓플레이스를 추가할지 물으면 `y`, 그다음 설치 범위를 고르면 끝이에요. 다음 작업부터 고양이가 나와요.

셸에서 설치하려면:

```
claude plugin install cat-spinner --marketplace yoon-jj/claude-cat-spinner
```

## 고양이 도감

- **움직이는 도감**: 저장소를 받아서 `docs/cat-gallery.html`을 브라우저(Chrome, Safari 등)로 열면 24종이 실제로 움직여요. 체크박스로 마음에 드는 고양이를 고르고, 입 모양과 감은 눈 모양도 바꿔 볼 수 있어요.
- **데모 영상**: [docs/cat-gallery-demo.mov](docs/cat-gallery-demo.mov) (도감이 움직이는 8초짜리 화면 녹화)

| Claude가 하는 일 | 나오는 고양이 |
|---|---|
| 생각 중 | 꾸벅꾸벅, 물고기 꿈, 두리번두리번, 귀 쫑긋, 식빵 굽기, 별 세기 |
| 도구 사용 중 | 실뭉치 데굴데굴, 꾹꾹이, 노트북 타닥타닥, 상자에 쏙, 쥐돌이 사냥, 낚시 |
| 답변 쓰는 중 | 꼬리 살랑, 하트 뿅뿅, 츄르 냠냠, 골골송, 안녕 손인사, 반짝 윙크 |
| 응답 기다리는 중 | 총총 걸어가기, 물고기 쫓기, 기지개 쭉, 폴짝 점프, 레이저 포인터 |
| 창이 좁을 때 | 한 줄 산책냥 `ᓚᘏᗢ` |

## 설정

`/config`에서 바꿀 수 있어요.

| 설정 | 값 | 설명 |
|---|---|---|
| `style` | `cute` (기본) / `ascii` | 고양이 모양이 밀려 보이면 `ascii`로. 순수 ASCII로만 그려요. |
| `speed` | 숫자, 기본 `1` | 애니메이션 속도. `2`면 두 배 빨라요. |

## 끄기 / 지우기

```
claude plugin disable cat-spinner@claude-cat-spinner     # 잠깐 끄기
claude plugin enable cat-spinner@claude-cat-spinner      # 다시 켜기
claude plugin uninstall cat-spinner@claude-cat-spinner   # 지우기
```

## 알아 두면 좋은 것

- 고양이는 터미널에서만 나와요. VS Code와 데스크톱 앱에서는 원래 스피너 그대로예요.
- 창이 좁아서 원래 스피너 줄이 잘릴 것 같으면 한 줄 고양이로 바뀌어요.
- `• ♡ ♪` 같은 문자는 터미널 설정에 따라 두 칸으로 그려질 수 있어요. 고양이가 찌그러져 보이면 `style`을 `ascii`로 바꿔 주세요.
- Claude Code 플러그인 API는 아직 얼리 액세스라, Claude Code가 업데이트되면 동작이 달라질 수 있어요.

## 개발

```
claude plugin validate .
claude plugin test .
```

고양이 데이터는 `hooks/cats.ts`, 색칠과 폭 맞추기는 `hooks/art.ts`, 프레임 타이머는 `hooks/cat.tsx`에 있어요.

## 라이선스

[MIT](LICENSE)
