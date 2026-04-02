# RING DYNASTY

단일 파일로 동작하는 레슬링 단체 운영 게임입니다. 메인 실행 파일은 [index.html](D:\Games\RING%20DYNASTY\index.html) 입니다.

## 에셋 교체

`index.html` 안에 아래 두 주석 블록이 들어 있습니다.

- `=== 스프라이트 에셋 교체 방법 ===`
- `=== 배경 이미지 교체 방법 ===`

권장 구조는 다음과 같습니다.

```text
assets/
  bg_indie.png
  bg_arena.png
  bg_stadium.png
  bg_ppv.png
  wrestler_name.png
```

### 레슬러 스프라이트

`wrestlerData` 또는 템플릿 데이터에 아래 필드를 연결하면 됩니다.

```js
spriteSheet: "./assets/wrestler_name.png"
```

스프라이트 시트 권장 규격:

- 프레임 크기: `48x48px`
- 프레임 순서:
  - `[0] 걷기1`
  - `[1] 걷기2`
  - `[2] 걷기3`
  - `[3] 걷기4`
  - `[4] 공격1`
  - `[5] 공격2`
  - `[6] 공격3`
  - `[7] 필살기1`
  - `[8] 필살기2`
  - `[9] 필살기3`
  - `[10] 승리포즈`
  - `[11] 다운`

배경은 투명 PNG를 권장합니다.

### 경기장 배경

단체 단계에 따라 아래 파일을 교체할 수 있습니다.

- `stage 1`: `./assets/bg_indie.png`
- `stage 2`: `./assets/bg_arena.png`
- `stage 3`: `./assets/bg_stadium.png`
- `stage 4`: `./assets/bg_ppv.png`

현재는 코드 기반 배경이 기본값으로 렌더링되며, 나중에 `drawImage()`로 실제 배경 에셋을 연결할 수 있게 구조를 잡아두었습니다.
