# RING DYNASTY 에셋 생성 가이드

이 문서는 현재 [index.html](D:\Games\RING%20DYNASTY\index.html) 기준으로 실제 사용 중인 에셋 경로와,
앞으로 추가 제작하면 좋은 주요 에셋의 권장 구조를 정리한 문서입니다.

목표는 다음 2가지입니다.

1. 현재 게임이 바로 읽을 수 있는 파일명/위치 규칙 정리
2. 앞으로 제작할 에셋을 어떤 우선순위로 만들면 좋은지 제안

---

## 1. 현재 실제 사용 중인 에셋 경로

현재 게임은 아래 경로를 직접 읽습니다.

```text
data/images/wrestlers/
data/images/icon/
data/images/SHOW LOGISTICS/
data/images/shows/
data/images/titles/
```

즉, 당장 새 에셋을 연결하려면 `assets/` 보다 위 경로들을 우선 맞추는 것이 가장 빠릅니다.

---

## 2. 권장 전체 폴더 구조

현재 구조를 유지하면서, 앞으로 제작할 때는 아래처럼 관리하는 것을 권장합니다.

```text
data/images/
  wrestlers/
    portraits/
    battle_sprites/
    versus/
  icon/
  shows/
  titles/
  SHOW LOGISTICS/
  ui/
    logo/
    badges/
    buttons/
    particles/
    panels/
    quest/
    legacy/
    story/
```

현재 코드는 `data/images/wrestlers/` 바로 아래 파일을 읽고 있으므로,
실사용은 아래 2가지 방식 중 하나를 추천합니다.

### 방식 A. 당장 호환 우선

```text
data/images/wrestlers/
  roman_reigns.png
  cody_rhodes.png
  ...
```

### 방식 B. 장기 구조 우선

```text
data/images/wrestlers/portraits/
data/images/wrestlers/battle_sprites/
data/images/wrestlers/versus/
```

이 경우 코드도 나중에 `portraitImage`, `battleSpriteSheet`, `versusImage`로 분리하는 것이 좋습니다.

---

## 3. 선수 에셋 제작 규칙

선수 1명당 권장 에셋은 3종입니다.

1. 대표 초상화
2. VS 화면 전용 반신 일러스트
3. 전투 스프라이트 시트

### 3-1. 파일명 규칙

- 영문 소문자만 사용
- 단어 구분은 `_`
- 확장자는 `png` 권장
- 파일명은 선수 ID와 동일하게 맞춤

예시:

```text
roman_reigns.png
cody_rhodes.png
seth_rollins.png
the_rock.png
```

### 3-2. 선수 1명 기준 권장 세트

예시: `roman_reigns`

```text
data/images/wrestlers/
  roman_reigns.png

권장 확장 구조
data/images/wrestlers/portraits/
  roman_reigns.png
data/images/wrestlers/versus/
  roman_reigns_vs.png
data/images/wrestlers/battle_sprites/
  roman_reigns_sheet.png
```

---

## 4. 선수 초상화 규격

현재 게임에서 가장 많이 쓰이는 대표 이미지입니다.

### 용도

- 로스터 카드
- 선수 상세 모달
- 가챠 결과 카드
- 전투 중 초상화 렌더
- VS 화면 연출

### 권장 원본 규격

- 파일 형식: `PNG`
- 배경: 투명 권장
- 방향: 세로형
- 권장 크기: `512 x 768`
- 최소 권장: `256 x 384`

### 구도 가이드

- 얼굴이 이미지 상단 30%~40% 부근에 오게 배치
- 어깨 위 또는 상반신 위주
- 중앙 정렬
- 머리 윗부분이 너무 잘리지 않게 여백 확보

### 이유

현재 UI는 대부분 `cover` 또는 세로형 크롭을 사용하므로,
얼굴이 화면 중앙보다 너무 아래 있으면 가챠 결과/VS 화면에서 잘립니다.

---

## 5. VS 화면 전용 에셋 권장 규격

현재 전투 인트로는 초상화 기반 VS 연출로 확장 중입니다.
따라서 별도 VS 일러스트를 만들면 가장 체감이 큽니다.

### 권장 파일명

```text
roman_reigns_vs.png
cody_rhodes_vs.png
```

### 권장 위치

```text
data/images/wrestlers/versus/
```

### 권장 규격

- 파일 형식: `PNG`
- 배경: 투명
- 권장 크기: `720 x 960`
- 최소 권장: `540 x 720`

### 구도

- 허리 위 또는 가슴 위 반신
- 약간 역동적인 포즈
- 좌우 반전해도 어색하지 않은 방향
- 얼굴이 크게 나오도록

### 제작 팁

- 좌측 등장용 / 우측 등장용을 따로 만들 필요는 없음
- 1장만 만들고 좌우 반전해서 써도 충분함

---

## 6. 전투 스프라이트 시트 규격

현재 코드는 장기적으로 스프라이트 시트도 받을 수 있게 설계되어 있습니다.

### 권장 파일명

```text
roman_reigns_sheet.png
```

### 권장 위치

```text
data/images/wrestlers/battle_sprites/
```

### 규격

- 파일 형식: `PNG`
- 배경: 투명
- 프레임 크기: `48 x 48`
- 프레임 수: `12`
- 시트 배치: 가로 1줄
- 전체 크기: `576 x 48`

### 프레임 순서

```text
[0] 걷기1
[1] 걷기2
[2] 걷기3
[3] 걷기4
[4] 공격1
[5] 공격2
[6] 공격3
[7] 피니셔1
[8] 피니셔2
[9] 피니셔3
[10] 승리포즈
[11] 다운
```

### 스타일

- 도트풍이면 가장 잘 어울림
- 1프레임당 실루엣이 명확해야 함
- 상하 여백을 최소화

---

## 7. 현재 이미 있는 에셋과 역할

### 7-1. `data/images/icon/`

현재 용도:

- 시설 카드 아이콘
- 챔피언십 보조 아이콘
- 이벤트/업적 보조 연출

추가 제작 추천:

- `roster_expand.png`
- `favorite_star.png`
- `bulk_release.png`
- `contract_warning.png`
- `coach.png`
- `legacy_point.png`
- `mission_daily.png`
- `mission_weekly.png`

권장 규격:

- `128 x 128`
- 투명 PNG
- 아이콘 중앙 정렬

---

### 7-2. `data/images/SHOW LOGISTICS/`

현재 용도:

- 경기장 배경
- 타이틀 화면 배경 효과
- 경기 중 링 배경

현재 사용 중 핵심 파일:

- `ARENA1.png`
- `ARENA2.png`
- `ARENA3.png`
- `ARENA4.png`
- `RING.png`
- `EFFECTS3.png`
- `EFFECTS4.png`

추가 제작 추천:

- `PPV_GOLD_FRAME.png`
- `MAIN_EVENT_SPOTLIGHT.png`
- `TITLE_MATCH_OVERLAY.png`
- `CROWD_FIREWORKS.png`
- `CAGE_OVERLAY.png`
- `LADDER_OVERLAY.png`

권장 규격:

- 캔버스 기준 `640 x 360`에 잘 맞도록
- 원본은 `1280 x 720` 이상 권장

---

### 7-3. `data/images/shows/`

현재 용도:

- PPV/쇼 로고
- 홈 화면 빌드업 배너

추가 제작 추천:

- `royal_dynasty.png`
- `elimination_night.png`
- `iron_championship.png`
- `ring_dynasty_mania.png`
- `ppv_night_banner.png`

권장 규격:

- 가로형 로고
- `800 x 320` 권장
- 배경 투명 PNG

---

### 7-4. `data/images/titles/`

현재 용도:

- 챔피언십 카드
- 챔피언 보유 상태 표시

추가 제작 추천:

- `indie_championship.png`
- `regional_championship.png`
- `world_championship.png`
- `vacant_belt.png`

권장 규격:

- `512 x 256` 또는 `640 x 320`
- 배경 투명 PNG

---

## 8. 아직 없는 주요 UI 에셋 추천 리스트

아래는 현재 텍스트/도형으로 대체 중이라, 제작하면 체감이 큰 순서입니다.

### 우선순위 1

1. 선수 VS 일러스트
2. 선수 전투 스프라이트 시트
3. 자체 PPV 로고 4종
4. 인디/지역/월드 전용 벨트 이미지

### 우선순위 2

5. 타이틀 화면 로고 이미지
6. 업적 토스트 아이콘 세트
7. 미션 탭 전용 아이콘
8. 레거시 포인트/프레스티지 아이콘

### 우선순위 3

9. 라이벌전 전용 배너
10. 페이스/힐 역할 엠블럼
11. 스타일 상성 아이콘
12. 훈련 시설별 백그라운드 일러스트

---

## 9. 추천 파일명 목록

### 선수 관련

```text
data/images/wrestlers/roman_reigns.png
data/images/wrestlers/cody_rhodes.png

data/images/wrestlers/versus/roman_reigns_vs.png
data/images/wrestlers/versus/cody_rhodes_vs.png

data/images/wrestlers/battle_sprites/roman_reigns_sheet.png
data/images/wrestlers/battle_sprites/cody_rhodes_sheet.png
```

### PPV / 쇼 로고

```text
data/images/shows/royal_dynasty.png
data/images/shows/elimination_night.png
data/images/shows/iron_championship.png
data/images/shows/ring_dynasty_mania.png
```

### 챔피언십

```text
data/images/titles/indie_championship.png
data/images/titles/regional_championship.png
data/images/titles/world_championship.png
```

### UI / 시스템

```text
data/images/ui/logo/ring_dynasty_logo.png
data/images/ui/badges/face_badge.png
data/images/ui/badges/heel_badge.png
data/images/ui/badges/neutral_badge.png
data/images/ui/badges/powerhouse_badge.png
data/images/ui/badges/technician_badge.png
data/images/ui/badges/showman_badge.png
data/images/ui/quest/daily_quest.png
data/images/ui/quest/weekly_mission.png
data/images/ui/legacy/legacy_point.png
data/images/ui/story/rivalry_climax.png
```

---

## 10. 제작 우선순위 추천

### 가장 먼저 만들 것

1. `wrestlers/*.png`
2. `wrestlers/versus/*_vs.png`
3. `shows/*.png`
4. `titles/*.png`

### 그 다음

5. `wrestlers/battle_sprites/*_sheet.png`
6. `ui/logo/*.png`
7. `ui/badges/*.png`

---

## 11. 실제 적용 시 권장 코드 분리 방향

현재는 `spriteSheet` 필드 하나로 초상화와 전투 이미지를 같이 처리합니다.
장기적으로는 아래처럼 나누는 것을 추천합니다.

```js
{
  portraitImage: "data/images/wrestlers/roman_reigns.png",
  versusImage: "data/images/wrestlers/versus/roman_reigns_vs.png",
  battleSpriteSheet: "data/images/wrestlers/battle_sprites/roman_reigns_sheet.png",
  spriteFrames: 12
}
```

이렇게 분리하면:

- 로스터/가챠/상세 = `portraitImage`
- VS 인트로 = `versusImage`
- 실제 경기 애니메이션 = `battleSpriteSheet`

로 역할이 명확해집니다.

---

## 12. 최소 제작 세트 요약

선수 1명당 최소:

```text
1. 초상화 1장
2. VS용 반신 1장
3. 전투 스프라이트 시트 1장
```

쇼 1개당 최소:

```text
1. 쇼 로고 1장
2. 이벤트 배너 1장
```

챔피언십 1개당 최소:

```text
1. 벨트 이미지 1장
```

---

## 13. 한 줄 권장 결론

지금 바로 작업 효율이 가장 좋은 순서는 아래입니다.

1. 선수 초상화 보정/통일
2. VS 전용 반신 이미지 제작
3. PPV 로고 4종 제작
4. 자체 챔피언십 벨트 3종 제작
5. 전투 스프라이트 시트 제작

