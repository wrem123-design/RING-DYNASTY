# RING DYNASTY Godot Conversion Baseline

작성일: 2026-04-29

## 목적

이 문서는 현재 웹 버전 `RING-DYNASTY`의 핵심 특징과 구현 기록을 남기고, Godot 재빌드 시 어떤 시스템을 유지하고 어떤 부분을 다시 설계할지 정리하기 위한 기준서다.

이번 전환의 핵심 목표는 단순한 HTML/JS 포팅이 아니다. 현재 게임의 강점인 로스터, 카드, 성장, 라이벌리, PPV 구조는 살리되, 가장 약한 부분인 쇼 진행 gameplay를 Godot에서 더 재미있는 핵심 루프로 재구축한다.

## 현재 프로젝트 구조 요약

현재 게임은 브라우저 기반 단일 페이지 게임에 가깝다.

- 주요 실행 파일: `index.html`
- 주요 스타일 파일: `index.css`
- 추가 시스템 스크립트: `data/*.js`
- 이미지/사운드 에셋: `data/images`, `data/sounds`
- 도구성 스크립트: `scripts/*.js`, `scripts/*.py`, `scripts/*.ps1`
- 문서: `docs`

`index.html` 안에 상태 관리, 로스터 생성, 경기 시뮬레이션, 쇼 진행, UI 렌더링, 저장/불러오기 로직이 많이 들어 있다. 기능 밀도는 높지만, 장기적으로 유지보수와 확장에는 불리한 구조다.

## 현재 게임의 주요 특징

### 1. 프로레슬링 단체 경영

플레이어는 프로레슬링 단체를 운영한다.

- 주차 단위 진행
- 골드, 명성, 하이프 관리
- 선수 영입/방출/육성
- 쇼 편성
- 타이틀 관리
- PPV 주간 운영
- 단체 시설 및 운영 업그레이드

Godot 전환 시 이 정체성은 유지한다. 게임의 핵심 판타지는 "선수를 모으고, 쇼를 짜고, 라이벌리를 키워 PPV에서 터뜨리는 GM 게임"이다.

### 2. 로스터와 선수 카드

선수는 카드/캐릭터 단위로 관리된다.

주요 속성:

- 이름, 닉네임
- 등급: C, B, A, S, LEGEND 계열
- 스타일: powerhouse, technician, showman
- 능력치: power, stamina, technique, charisma, fame
- 성향: face, heel, neutral
- 컨디션, 사기, 계약 기간, 급여
- 승패 기록
- 피니셔
- 포트레이트/배틀 스프라이트

Godot에서는 선수 데이터를 `WrestlerData` 리소스 또는 JSON 데이터로 분리하는 것이 좋다. 런타임 상태와 원본 템플릿도 분리해야 한다.

예상 구조:

- `WrestlerTemplate`: 원본 선수 데이터
- `RosterWrestler`: 플레이어가 보유한 선수 인스턴스
- `WrestlerRuntimeState`: 컨디션, 사기, 계약, 승패, 부상 등 변동 상태

### 3. 가챠/영입 시스템

현재 게임에는 등급 기반 선수 획득과 티켓/재화 기반 영입 구조가 있다.

유지할 요소:

- 등급별 획득 연출
- 1회/10회 뽑기
- 중복 처리
- 조각/보상성 재화
- 레전드 또는 고등급 획득의 기대감

Godot 전환 시 가챠는 초반 필수 범위는 아니다. 1차 프로토타입에서는 고정 로스터로 쇼 진행 재미를 먼저 검증하고, 이후 카드 획득 연출과 경제 시스템을 붙이는 편이 안전하다.

### 4. 경기 시뮬레이션

현재 게임에는 전투/경기 시뮬레이션 로직이 이미 존재한다.

확인된 요소:

- 스타일 상성
- 능력치 기반 승패 계산
- 체력/스태미나성 진행
- 피니셔
- 핀폴/서브미션/타임리밋 등 결과 타입
- 난입 처리
- 경기 하이라이트 로그
- 경기 결과에 따른 하이프/통계 반영

Godot에서는 이 로직을 시각화와 분리해야 한다.

권장 분리:

- `MatchSimulator`: 순수 경기 계산
- `MatchResult`: 승자, 패자, 피니시 타입, 하이라이트, 부상/피로, 하이프
- `MatchPresentation`: 링 화면, 로그, 카메라, 사운드, 연출

1차 Godot 버전에서는 경기 전체 조작보다 "GM이 편성하고 결과를 받아보는 쇼 운영"을 우선한다.

### 5. 라이벌리 시스템

현재 게임은 라이벌리 정보를 꽤 많이 가지고 있다.

주요 요소:

- 두 선수 간 라이벌리
- 라이벌리 타입: 일반 대립, 타이틀 대립, face vs heel 등
- heat/intensity
- freshness
- arc stage
- PPV 결착 여부
- 히스토리
- 다음 트리거
- 쿨다운/리매치 제한

Godot 전환에서 가장 살릴 가치가 큰 시스템이다. 쇼 진행을 재미있게 만드는 핵심은 경기 결과 자체보다 라이벌리가 다음 주에 어떻게 이어지는지다.

Godot에서는 라이벌리를 별도 도메인 모델로 둔다.

- `Rivalry`
- `RivalryManager`
- `StoryHook`
- `WeeklyStoryState`

### 6. 주간 쇼와 PPV

현재 주간 쇼는 RAW/SmackDown/NXT 계열 로고와 4주 단위 PPV 구조를 가진다.

확인된 구조:

- 일반 주간 쇼
- 4주 단위 PPV
- PPV 이름 순환
- PPV 경기 방식: LADDER_MATCH, CAGE_MATCH, IRON_MAN_MATCH
- 타이틀전 요구
- PPV 침입자/특수 상대 시스템
- PPV 결착 후 라이벌리 쿨다운

유지할 큰 흐름:

1. 1-3주차: 라이벌리 빌드업
2. 4주차: PPV 결착
3. 결착 후 새로운 도전자/스토리 훅 생성

## 현재 쇼 진행부의 문제

현재 쇼 진행부는 기능은 많지만 gameplay 감각이 약하다.

문제점:

- 쇼를 직접 운영한다는 감각이 약함
- 자동 생성 세그먼트가 플레이어 선택과 충분히 연결되지 않음
- 경기 결과가 다음 주 기대감으로 강하게 이어지지 않음
- 관객 반응/하이프/라이벌리 변화가 숫자로는 존재하지만 체감이 약함
- 세그먼트별 연출 차이가 부족함
- PPV까지의 빌드업이 "목표"라기보다 "결과 처리"처럼 느껴짐
- GM 선택지가 제한적이고 전략적 손익이 약함

Godot 재빌드의 1순위는 이 부분을 개선하는 것이다.

## Godot 재빌드 목표

### 목표 1. 쇼 진행을 핵심 gameplay로 만든다

쇼는 다음 구조로 진행한다.

1. 오늘의 쇼 카드 공개
2. 오프닝 세그먼트
3. 중간 경기/프로모/백스테이지 사건
4. GM 선택 이벤트
5. 메인 이벤트
6. 쇼 결과 발표
7. 다음 주 훅 생성

각 세그먼트는 다음 값을 가진다.

- type
- title
- participants
- rivalry
- expectedReaction
- risk
- reward
- possibleChoices
- result

### 목표 2. 플레이어 선택에 손익을 만든다

예시 선택지:

- 난입을 방치한다: 라이벌리 heat 증가, 부상/불만 위험 증가
- 보안팀을 투입한다: 위험 감소, 관객 반응 감소
- 즉석 타이틀전으로 승격한다: 큰 반응, 챔피언 피로/타이틀 변동 위험
- 프로모 시간을 늘린다: charisma 높은 선수 보너스, 경기 수 감소
- 약체 선수를 업셋 후보로 밀어준다: 성공 시 스타 탄생, 실패 시 쇼 평점 하락
- PPV 계약식을 연다: 결착전 확정, 당일 경기 반응은 낮을 수 있음

선택의 결과는 즉시 수치로 보이고, 다음 주에도 흔적이 남아야 한다.

### 목표 3. PPV를 목표 지점으로 만든다

주간 쇼는 PPV를 향한 빌드업이어야 한다.

- 1주차: 대립 시작
- 2주차: 갈등 심화
- 3주차: 계약식/난입/최종 예고
- 4주차: PPV 결착

PPV에서는 일반 쇼와 다른 규칙을 적용한다.

- 타이틀전/특수 경기 강제 또는 보너스
- 관객 반응 배수
- 라이벌리 결착 보상
- 패자 후유증 또는 휴식 필요
- 새 도전자 공개

### 목표 4. 시각적 연출을 강화한다

Godot에서 쇼 세그먼트는 단순 텍스트가 아니라 장면으로 보여준다.

필요 장면:

- `ShowOpeningScene`
- `RingPromoScene`
- `MatchHighlightScene`
- `BackstageIncidentScene`
- `InterferenceScene`
- `ContractSigningScene`
- `ShowResultScene`

각 장면은 같은 데이터 구조를 받아 서로 다른 연출을 한다.

## Godot 권장 구조

### 폴더 구조 초안

```text
godot/
  project.godot
  scenes/
    main/
      Main.tscn
    show/
      ShowFlow.tscn
      ShowOpening.tscn
      SegmentView.tscn
      ShowResult.tscn
    roster/
      RosterScreen.tscn
    match/
      MatchHighlight.tscn
  scripts/
    core/
      GameState.gd
      SaveManager.gd
    data/
      WrestlerData.gd
      ChampionshipData.gd
      ShowData.gd
    systems/
      ShowGenerator.gd
      ShowResolver.gd
      MatchSimulator.gd
      RivalryManager.gd
      EconomyManager.gd
    ui/
      WrestlerCard.gd
      SegmentCard.gd
  data/
    wrestlers.json
    championships.json
    show_templates.json
    segment_templates.json
  assets/
    images/
    sounds/
```

### 핵심 클래스 초안

```text
GameState
- week
- gold
- fame
- hype
- roster
- championships
- rivalries
- current_show
- last_show_result

ShowState
- week
- show_name
- is_ppv
- segments
- current_index
- gm_choices

ShowSegment
- id
- type
- title
- participants
- rivalry_id
- expected_reaction
- risk
- choices
- resolved_result

SegmentChoice
- id
- label
- description
- effects

ShowResult
- rating
- crowd_reaction
- income_gain
- fame_gain
- segment_results
- next_week_hooks
```

## 1차 프로토타입 범위

최초 Godot 프로토타입은 다음만 구현한다.

- 고정 로스터 8-12명
- 주간 쇼 1회 생성
- 5개 세그먼트 진행
- 세그먼트별 선택지
- 간단한 경기 시뮬레이션
- 라이벌리 heat/freshness 변화
- 쇼 평점 계산
- 다음 주 훅 생성
- 저장 없이 메모리 상태로 진행

이 단계의 성공 기준:

- 쇼를 한 번 진행했을 때 "다음 주가 궁금하다"는 느낌이 있어야 한다.
- 선택지가 단순 장식이 아니라 결과에 영향을 줘야 한다.
- PPV까지 4주를 돌려보고 하나의 대립이 결착되는 흐름이 보여야 한다.

## 기존 웹 버전에서 가져올 것

가져올 가치가 높은 것:

- 선수 데이터와 이미지 에셋
- 등급/스타일 구조
- 능력치 체계
- 경기 결과 타입
- 라이벌리 heat/intensity/freshness 개념
- PPV 4주 주기
- 타이틀/디비전 개념
- 가챠 등급 기준
- 사운드/카드/쇼 로고 에셋

바로 가져오지 않을 것:

- DOM 기반 UI 구조
- HTML 문자열 렌더링 방식
- CSS 중심 레이아웃
- 거대한 단일 파일 구조
- 현재 쇼 진행 UI의 세부 구현

## 전환 원칙

1. 기능을 그대로 베끼지 말고 재미를 기준으로 재설계한다.
2. 로직과 연출을 분리한다.
3. 데이터와 런타임 상태를 분리한다.
4. 쇼 진행부를 먼저 완성하고, 이후 가챠/경제/시설을 붙인다.
5. 매주 결과가 다음 주 선택지를 바꾸게 만든다.
6. PPV는 단순 보너스 주간이 아니라 한 달 루프의 결말이어야 한다.
7. Godot 에디터에서 세그먼트 템플릿과 선수 데이터를 쉽게 수정할 수 있게 한다.

## 다음 작업 제안

1. `godot/` 프로젝트 뼈대 생성
2. 고정 테스트 로스터 JSON 작성
3. `ShowGenerator.gd` 작성
4. `ShowFlow.tscn`에서 5개 세그먼트 진행 구현
5. 세그먼트 선택지와 결과 계산 구현
6. 4주 루프와 PPV 결착 구현
7. 기존 이미지 에셋 일부 연결

이 문서는 Godot 컨버팅 중 계속 갱신한다.
