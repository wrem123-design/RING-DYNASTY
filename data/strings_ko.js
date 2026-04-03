// @charset "UTF-8";
(function () {
  window.RING_DYNASTY_STRINGS = {
    encodingGuard: {
      invalidCharset: "문자셋이 UTF-8이 아닙니다. 한글이 깨질 수 있습니다.",
      suspiciousSave: "세이브 데이터에서 깨진 문자열 징후가 감지되었습니다. 백업을 확인하세요.",
      blockedSave: "깨진 문자열이 감지되어 현재 저장을 중단했습니다. 기존 세이브는 유지됩니다.",
      restoredBackup: "손상된 세이브 대신 이전 백업 세이브를 복구했습니다."
    },
    operations: {
      statLabels: {
        power: "힘",
        stamina: "체력",
        technique: "기술",
        charisma: "카리스마"
      },
      validation: {
        unknownSlot: "알 수 없는 슬롯입니다.",
        coachOnly: "코치 슬롯에는 코치만 배치할 수 있습니다.",
        wrestlerNotFound: "선수를 찾을 수 없습니다.",
        treatmentOnly: "집중 치료는 부상 선수만 사용할 수 있습니다.",
        injuredBlocked: "부상 중인 선수는 이 슬롯에 배치할 수 없습니다.",
        minCondition: "컨디션 {value}% 이상이 필요합니다.",
        minGrade: "{value}급 이상만 배치할 수 있습니다.",
        minCharisma: "카리스마 {value} 이상이 필요합니다.",
        mediaSideConflict: "미디어 담당과 사이드 경기는 중복 배치할 수 없습니다.",
        sideMediaConflict: "사이드 경기 선수는 미디어 담당을 겸할 수 없습니다.",
        specialGym: "특훈은 체육관 레벨 3 이상이 필요합니다.",
        specialUnlock: "특훈 슬롯을 먼저 해금해야 합니다.",
        exclusiveConflict: "이미 다른 주요 슬롯에 배치되어 있습니다."
      },
      preview: {
        coachTitle: "코치 슬롯",
        coachAssigned: "{name} 코치 배치",
        coachGrowth: "훈련 중인 선수 성장 +2",
        coachSpecialty: "주특기 훈련 추가 +4",
        mainTitle: "메인 경기 투입",
        noOpponent: "상대 없음",
        winRate: "예상 승률: {value}%",
        mainConditionCost: "컨디션 소모: -25% ~ -40%",
        noReward: "보상 없음",
        rewardGold: "승리 보상: {value}G",
        sideTitle: "사이드 경기",
        sideRevenue: "예상 수익: {value}G",
        sideNoRank: "랭킹 변동 없음",
        sideConditionCost: "컨디션 소모: -15% ~ -25%",
        sideExtraMatch: "이번 주 경기 1회 추가",
        franchiseTitle: "프랜차이즈 스타",
        franchiseGold: "주당 팬 수익: +{value}G",
        franchiseFame: "인기도 +{value}/주",
        franchiseHype: "Hype 베이스 +10",
        noMatch: "경기 출전 불가",
        mediaTitle: "미디어 담당",
        mediaRevenue: "다음 주 사이드 수익 x1.3",
        mediaRivalry: "라이벌 강도 +5",
        mediaConflict: "사이드 경기와 중복 불가",
        specialTitle: "특훈",
        trainingTitle: "강화 훈련",
        statGain: "{stat}: {from} → {to}",
        conditionCost: "컨디션 소모: -{value}%",
        noGameThisWeek: "이번 주 경기 불가",
        restTitle: "휴식",
        restRecovery: "컨디션 회복: +{value}%",
        restFaster: "기본 자동 회복보다 빠름",
        restNoAction: "이번 주 경기/훈련 불가",
        treatmentTitle: "집중 치료",
        treatmentWeeks: "부상 회복: -{value}주",
        treatmentCondition: "컨디션 추가 +15%",
        treatmentOnlyInjured: "부상 선수 전용"
      }
    }
  };
})();
