if (!window.__RING_DYNASTY_CIRCUIT_REWORK__) {
  window.__RING_DYNASTY_CIRCUIT_REWORK__ = true;

  const buildCircuitStats = (total, style) => {
    const styleWeights = {
      powerhouse: { power: 1.2, stamina: 1.1, technique: 0.75, charisma: 0.85, fame: 1.0 },
      technician: { power: 0.85, stamina: 1.0, technique: 1.2, charisma: 0.9, fame: 1.05 },
      showman: { power: 0.9, stamina: 0.95, technique: 0.9, charisma: 1.2, fame: 1.05 }
    }[style] || { power: 1, stamina: 1, technique: 1, charisma: 1, fame: 1 };
    const entries = Object.entries(styleWeights);
    const weightSum = entries.reduce((sum, [, value]) => sum + value, 0);
    const stats = {};
    let runningTotal = 0;
    entries.forEach(([key, value], index) => {
      const amount = index === entries.length - 1
        ? total - runningTotal
        : Math.max(18, Math.floor((total * value) / weightSum));
      stats[key] = amount;
      runningTotal += amount;
    });
    return stats;
  };

  const buildCircuitReward = (gold, tickets = 0, extras = {}) => ({
    gold,
    tickets,
    ...extras
  });

  const CIRCUIT_LADDER = [
    {
      id: "indies",
      label: "인디 리그",
      bossRewardText: '3000 G + 뽑기권 2 + "인디 챔피언" 칭호',
      opponents: [
        { id: "c1_1", name: "Rookie Randy", nickname: "갓 데뷔한 신인", style: "showman", weaknessStyle: "powerhouse", finisher: "Flash Rollup", total: 150, reward: buildCircuitReward(500, 0), quote: "이기면 창피하고 지면 더 창피하다" },
        { id: "c1_2", name: "Bobby Brawler", nickname: "골목길 펀처", style: "powerhouse", weaknessStyle: "technician", finisher: "Back Alley Smash", total: 175, reward: buildCircuitReward(650, 0), quote: "정면 승부만 고집하는 난폭가" },
        { id: "c1_3", name: "The Crusher", nickname: "링의 불도저", style: "powerhouse", weaknessStyle: "technician", finisher: "Concrete Drop", total: 195, reward: buildCircuitReward(800, 1), quote: "강공격 위주, 서브미션은 거의 없다" },
        { id: "c1_4", name: "Jack Savage", nickname: "무대 위의 폭군", style: "showman", weaknessStyle: "powerhouse", finisher: "Savage Line", total: 215, reward: buildCircuitReward(1100, 1), quote: "팬을 흔들지만 체계적인 압박엔 약하다" },
        { id: "c1_5", name: "King of Indies", nickname: "인디의 왕", style: "technician", weaknessStyle: "showman", finisher: "Indie Crown Driver", total: 280, reward: buildCircuitReward(3000, 2, { title: "인디 챔피언" }), quote: "소규모 단체를 평정한 인디 보스" }
      ]
    },
    {
      id: "regional",
      label: "지역 서킷",
      bossRewardText: "8000 G + 뽑기권 3 + 시설 업그레이드 1회",
      opponents: [
        { id: "c2_1", name: "Mason Vale", nickname: "고속 역습가", style: "technician", weaknessStyle: "showman", finisher: "Vale Lock", total: 305, reward: buildCircuitReward(1500, 0), quote: "반격 타이밍이 정확한 지역 강자" },
        { id: "c2_2", name: "Tyrel Knox", nickname: "남부의 해머", style: "powerhouse", weaknessStyle: "technician", finisher: "Knox Out", total: 330, reward: buildCircuitReward(1900, 0), quote: "한 방은 무겁지만 경기 운영은 단순하다" },
        { id: "c2_3", name: "Silver Vane", nickname: "스포트라이트 스틸러", style: "showman", weaknessStyle: "powerhouse", finisher: "Velvet Crash", total: 350, reward: buildCircuitReward(2300, 1), quote: "관중 장악력은 최고지만 압박에 흔들린다" },
        { id: "c2_4", name: "Gunnar Steel", nickname: "아이언 월", style: "powerhouse", weaknessStyle: "technician", finisher: "Steelbreaker", total: 365, reward: buildCircuitReward(2800, 1), quote: "체력과 맷집으로 끌고 가는 타입" },
        { id: "c2_5", name: "The Regional Beast", nickname: "지방 순회 절대자", style: "powerhouse", weaknessStyle: "technician", finisher: "Frontier Bomb", total: 380, reward: buildCircuitReward(8000, 3, { facilityUpgrade: true }), quote: "지역 서킷을 지배하는 파괴 본능" }
      ]
    },
    {
      id: "national",
      label: "전국 리그",
      bossRewardText: "20000 G + 레전드 스카우트 패스",
      opponents: [
        { id: "c3_1", name: "Reiji Storm", nickname: "속전속결의 귀재", style: "technician", weaknessStyle: "showman", finisher: "Storm Trigger", total: 395, reward: buildCircuitReward(4000, 1), quote: "짧고 빠르게 승부를 끝내려 든다" },
        { id: "c3_2", name: "Damien Cross", nickname: "사선의 지휘자", style: "showman", weaknessStyle: "powerhouse", finisher: "Crossfire Finale", total: 420, reward: buildCircuitReward(4800, 1), quote: "카리스마 싸움에 능한 전국구 스타" },
        { id: "c3_3", name: "Atlas Forge", nickname: "국가대표 철인", style: "powerhouse", weaknessStyle: "technician", finisher: "Forge Press", total: 445, reward: buildCircuitReward(5600, 1), quote: "후반으로 갈수록 강해지는 장기전 특화형" },
        { id: "c3_4", name: "Lucian Vale", nickname: "완벽주의 천재", style: "technician", weaknessStyle: "showman", finisher: "Silent Checkmate", total: 470, reward: buildCircuitReward(6500, 2), quote: "기술전의 정점, 허점은 적다" },
        { id: "c3_5", name: "The National Champion", nickname: "전국 제패자", style: "technician", weaknessStyle: "showman", finisher: "Crown Lock Driver", total: 495, reward: buildCircuitReward(20000, 4, { specialText: "레전드 스카우트 패스 지급" }), quote: "기술과 운영이 모두 완성된 전국 챔피언" }
      ]
    },
    {
      id: "major",
      label: "메이저 리그",
      bossRewardText: "50000 G + 레전드 확정 스카우트 패스",
      opponents: [
        { id: "c4_1", name: "Victor Gale", nickname: "메이저의 선봉장", style: "showman", weaknessStyle: "powerhouse", finisher: "Gale Impact", total: 520, reward: buildCircuitReward(9000, 1), quote: "초반 기세가 엄청난 메이저 스타" },
        { id: "c4_2", name: "Colossus Cain", nickname: "거인의 행진", style: "powerhouse", weaknessStyle: "technician", finisher: "Titan Crash", total: 550, reward: buildCircuitReward(11000, 1), quote: "정면 대결에서는 거의 밀리지 않는다" },
        { id: "c4_3", name: "Orion Flux", nickname: "무중력 엔터테이너", style: "showman", weaknessStyle: "powerhouse", finisher: "Flux Driver", total: 580, reward: buildCircuitReward(13000, 2), quote: "쇼맨십과 리듬 싸움에 특화된 슈퍼스타" },
        { id: "c4_4", name: "Rex Dominion", nickname: "왕좌의 집행자", style: "technician", weaknessStyle: "showman", finisher: "Dominion Clutch", total: 610, reward: buildCircuitReward(16000, 2), quote: "실수 유도와 카운터 능력이 뛰어나다" },
        { id: "c4_5", name: "The Franchise Star", nickname: "흥행의 얼굴", style: "showman", weaknessStyle: "powerhouse", finisher: "Franchise Finale", total: 645, reward: buildCircuitReward(50000, 5, { specialText: "레전드 확정 스카우트 패스 지급" }), quote: "흥행과 승리를 모두 쥔 메이저 리그 간판" }
      ]
    },
    {
      id: "world",
      label: "월드 챔피언십",
      bossRewardText: "엔딩 + 프레스티지 해금",
      opponents: [
        { id: "c5_1", name: "Ares Nova", nickname: "세계 무대의 개척자", style: "powerhouse", weaknessStyle: "technician", finisher: "Nova Slam", total: 680, reward: buildCircuitReward(22000, 2), quote: "세계 순회 무대를 거친 강철 같은 베테랑" },
        { id: "c5_2", name: "Cipher Saint", nickname: "천재 전략가", style: "technician", weaknessStyle: "showman", finisher: "Saint Lock", total: 715, reward: buildCircuitReward(26000, 2), quote: "정교한 경기 운영으로 상대를 질식시킨다" },
        { id: "c5_3", name: "Monarch Blaze", nickname: "황금 세대의 왕", style: "showman", weaknessStyle: "powerhouse", finisher: "Blaze Parade", total: 760, reward: buildCircuitReward(32000, 3), quote: "관중 반응까지 이용하는 완성형 스타" },
        { id: "c5_4", name: "Obsidian Titan", nickname: "암흑 제왕", style: "powerhouse", weaknessStyle: "technician", finisher: "Nightfall Bomb", total: 820, reward: buildCircuitReward(40000, 3), quote: "파워와 체력에서 압도적인 최종 관문급 강자" },
        { id: "c5_5", name: "The Undisputed World Champion", nickname: "절대 왕자", style: "technician", weaknessStyle: "showman", finisher: "Legacy Ender", total: 900, reward: buildCircuitReward(60000, 6, { ending: true, prestigeUnlock: true }), quote: "전설 그 자체. 마지막 시험" }
      ]
    }
  ];

  const CIRCUIT_WEAKNESS_STYLE = {
    powerhouse: "technician",
    technician: "showman",
    showman: "powerhouse"
  };

  const hashCircuitSeed = (value) => {
    let hash = 0;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getCircuitOpponentGrade = (total) => (
    total >= 780 ? "LEGEND" : total >= 520 ? "S" : total >= 380 ? "A" : total >= 240 ? "B" : "C"
  );

  const getCircuitTemplatePool = (grade, excludedTemplateIds = []) => {
    const excluded = new Set((excludedTemplateIds || []).filter(Boolean));
    const gradePool = wrestlerPool.filter((wrestler) => wrestler?.grade === grade && !excluded.has(wrestler.id));
    if (gradePool.length) {
      return gradePool;
    }
    const fallbackPool = wrestlerPool.filter((wrestler) => !excluded.has(wrestler.id));
    return fallbackPool.length ? fallbackPool : wrestlerPool.slice();
  };

  const pickCircuitTemplateForSlot = (slotKey, grade, excludedTemplateIds = []) => {
    const pool = getCircuitTemplatePool(grade, excludedTemplateIds);
    if (!pool.length) {
      return null;
    }
    return pool[hashCircuitSeed(`${slotKey}:${grade}`) % pool.length];
  };

  let circuitOpponentsCache = null;
  let circuitOpponentsCacheKey = "";

  const buildCircuitOpponents = () => {
    const usedCircuitTemplateIds = new Set();
    return CIRCUIT_LADDER.flatMap((circuit, circuitIndex) => circuit.opponents.map((opponent, localIndex) => {
      const grade = getCircuitOpponentGrade(opponent.total);
      const template = pickCircuitTemplateForSlot(`${circuit.id}:${opponent.id}`, grade, Array.from(usedCircuitTemplateIds));
      if (template?.id) {
        usedCircuitTemplateIds.add(template.id);
      }
      const style = template?.style || opponent.style;
      return {
        ...opponent,
        name: template?.name || opponent.name,
        nickname: template?.nickname || opponent.nickname,
        style,
        weaknessStyle: CIRCUIT_WEAKNESS_STYLE[style] || opponent.weaknessStyle,
        finisher: template?.finisher || opponent.finisher,
        templateId: template?.id || opponent.id,
        spriteSheet: template?.spriteSheet || null,
        battleSpriteSheet: template?.battleSpriteSheet || null,
        spriteFrames: Number.isFinite(template?.spriteFrames) ? template.spriteFrames : 1,
        battleSpriteFrames: Number.isFinite(template?.battleSpriteFrames) ? template.battleSpriteFrames : 1,
        portraitMode: typeof template?.portraitMode === "boolean" ? template.portraitMode : true,
        spriteColor: template?.spriteColor || getGradeColor(grade),
        circuitId: circuit.id,
        circuitLabel: circuit.label,
        circuitIndex,
        localRank: localIndex + 1,
        globalRank: (circuitIndex * 5) + localIndex + 1,
        grade,
        stats: buildCircuitStats(opponent.total, style),
        bossRewardText: circuit.bossRewardText
      };
    }));
  };

  const getCircuitOpponents = () => {
    const nextCacheKey = wrestlerPool.map((wrestler) => wrestler.id).join("|");
    if (!Array.isArray(circuitOpponentsCache) || circuitOpponentsCacheKey !== nextCacheKey) {
      circuitOpponentsCache = buildCircuitOpponents();
      circuitOpponentsCacheKey = nextCacheKey;
    }
    return circuitOpponentsCache;
  };

  const getCircuitRankFloor = (rank) => (Math.floor((Math.max(1, rank) - 1) / 5) * 5) + 1;
  const getCircuitOpponentByRank = (rank) => {
    const opponents = getCircuitOpponents();
    return opponents.find((opponent) => opponent.globalRank === clamp(rank, 1, 25)) || opponents[0];
  };
  const getCircuitProgressState = () => {
    if (!gameState.weeklySchedule || typeof gameState.weeklySchedule !== "object") {
      gameState.weeklySchedule = createEmptyWeeklySchedule();
    }
    if (!gameState.circuitProgress || typeof gameState.circuitProgress !== "object") {
      gameState.circuitProgress = createDefaultCircuitProgress();
    }
    if (!Array.isArray(gameState.weeklySchedule.sideMatches) || gameState.weeklySchedule.sideMatches.length !== 2) {
      gameState.weeklySchedule = sanitizeWeeklySchedule(gameState.weeklySchedule, gameState.weeklyCard);
    }
    gameState.circuitProgress = sanitizeCircuitProgress(gameState.circuitProgress);
    return gameState.circuitProgress;
  };

  const syncScheduleToLegacyWeeklyCard = () => {
    getCircuitProgressState();
    const slots = createEmptyWeeklyCard(gameState.week);
    slots[0].wrestlerAId = gameState.weeklySchedule.mainMatch.wrestlerId;
    gameState.weeklySchedule.sideMatches.forEach((slot, index) => {
      const target = slots[index + 1];
      if (!target) {
        return;
      }
      target.wrestlerAId = slot.wrestlerAId;
      target.wrestlerBId = slot.wrestlerBId;
    });
    gameState.weeklyCard = slots;
  };

  const getCurrentCircuitOpponent = () => {
    const progress = getCircuitProgressState();
    if (progress.completed) {
      return null;
    }
    return getCircuitOpponentByRank(progress.currentRank);
  };

  const isScoutRevealUnlocked = () => Number(gameState.facilities?.scoutTeam?.level || 0) >= 1;
  const hasSeenOpponent = (opponentId) => getCircuitProgressState().seenOpponentIds.includes(opponentId);
  const revealOpponent = (opponentId) => {
    const progress = getCircuitProgressState();
    if (opponentId && !progress.seenOpponentIds.includes(opponentId)) {
      progress.seenOpponentIds.push(opponentId);
    }
  };

  const getConditionTierMeta = (conditionValue) => {
    const condition = clamp(Math.floor(conditionValue || 0), 0, 100);
    if (condition >= 80) {
      return { label: "정상", color: "#2ecc71", statMultiplier: 1, staminaMultiplier: 1, riskBonus: 0, icon: "" };
    }
    if (condition >= 60) {
      return { label: "살짝 피곤", color: "#f1c40f", statMultiplier: 0.92, staminaMultiplier: 0.9, riskBonus: 0, icon: "😮‍💨" };
    }
    if (condition >= 40) {
      return { label: "피로 누적", color: "#f39c12", statMultiplier: 0.8, staminaMultiplier: 0.82, riskBonus: 0.08, icon: "피로" };
    }
    if (condition >= 20) {
      return { label: "한계", color: "#e67e22", statMultiplier: 0.65, staminaMultiplier: 0.72, riskBonus: 0.2, icon: "⚠️ 위험" };
    }
    return { label: "탈진", color: "#e74c3c", statMultiplier: 0.5, staminaMultiplier: 0.6, riskBonus: 0.35, icon: "⛔ 탈진" };
  };

  const getWeeklyConditionRecoveryAmount = () => 15 + Math.max(0, Math.round(((gameState.facilities?.medical?.healSpeed || 1) - 1) * 5));
  const getConditionColor = (value) => getConditionTierMeta(value).color;
  const getConditionWarningText = (wrestler) => {
    const meta = getConditionTierMeta(wrestler?.condition || 0);
    if ((wrestler?.condition || 0) < 20) {
      return `⛔ ${wrestler.name}은 탈진 상태입니다. 강행하면 부상 위험이 높습니다.`;
    }
    if ((wrestler?.condition || 0) < 40) {
      return `⚠️ 컨디션 ${wrestler.condition}% - 패배 위험`;
    }
    return meta.icon ? `${meta.icon} ${meta.label}` : "";
  };

  const getConditionAdjustedStats = (wrestler) => {
    const meta = getConditionTierMeta(wrestler?.condition || 100);
    return {
      power: Math.max(1, Math.round((wrestler.stats?.power || 1) * meta.statMultiplier)),
      stamina: Math.max(1, Math.round((wrestler.stats?.stamina || 1) * meta.statMultiplier)),
      technique: Math.max(1, Math.round((wrestler.stats?.technique || 1) * meta.statMultiplier)),
      charisma: Math.max(1, Math.round((wrestler.stats?.charisma || 1) * meta.statMultiplier)),
      fame: Math.max(1, Math.round((wrestler.stats?.fame || 1) * meta.statMultiplier))
    };
  };

  const getConditionBarHtml = (wrestler) => {
    const condition = clamp(Math.floor(wrestler?.condition || 0), 0, 100);
    const meta = getConditionTierMeta(condition);
    return `
      <div style="margin-top:8px;">
        <div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#d7dde5;">
          <span>컨디션 ${condition}%</span>
          <span style="color:${meta.color};">${meta.label}</span>
        </div>
        <div style="height:7px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;">
          <div style="width:${condition}%;height:100%;background:${meta.color};"></div>
        </div>
      </div>
    `;
  };

  const createCircuitBattleWrestler = (opponent) => createWrestler({
    id: opponent.id,
    templateId: opponent.templateId || opponent.id,
    name: opponent.name,
    nickname: opponent.nickname,
    grade: opponent.grade,
    stats: structuredClone(opponent.stats),
    style: opponent.style,
    alignment: "heel",
    age: 28 + opponent.circuitIndex,
    salary: 0,
    contractWeeks: 999,
    wins: 0,
    losses: 0,
    condition: 100,
    finisher: opponent.finisher,
    spriteSheet: opponent.spriteSheet || null,
    battleSpriteSheet: opponent.battleSpriteSheet || null,
    spriteFrames: Number.isFinite(opponent.spriteFrames) ? opponent.spriteFrames : 1,
    battleSpriteFrames: Number.isFinite(opponent.battleSpriteFrames) ? opponent.battleSpriteFrames : 1,
    portraitMode: Boolean(opponent.portraitMode),
    spriteColor: opponent.spriteColor || getGradeColor(opponent.grade),
    status: "match"
  });

  const getManagementBattleStats = (wrestler, baseStats) => {
    const api = window.__RING_DYNASTY_MANAGEMENT_BUFFS__;
    return api?.getBattleReadyStats ? api.getBattleReadyStats(wrestler, baseStats) : baseStats;
  };

  const buildBattleReadyWrestler = (wrestler) => {
    if (!wrestler) {
      return wrestler;
    }
    if (wrestler.managementBattleReady) {
      return createWrestler({
        ...structuredClone(wrestler),
        stats: structuredClone(wrestler.stats || {})
      });
    }
    return createWrestler({
      ...structuredClone(wrestler),
      stats: getManagementBattleStats(wrestler, getConditionAdjustedStats(wrestler)),
      managementBattleReady: true
    });
  };

  const getEffectivePowerValue = (wrestler) => {
    if (!wrestler) {
      return 0;
    }
    const stats = wrestler.managementBattleReady
      ? structuredClone(wrestler.stats || {})
      : (wrestler.stats ? getConditionAdjustedStats(wrestler) : {});
    return (
      (stats.power || 0)
      + (stats.stamina || 0)
      + (stats.technique || 0)
      + (stats.charisma || 0)
      + (stats.fame || 0)
    ) / 5;
  };

  const getBattleEffectivePowerValue = (wrestler) => {
    if (!wrestler) {
      return 0;
    }
    const baseStats = wrestler.managementBattleReady
      ? structuredClone(wrestler.stats || {})
      : (wrestler.stats ? getConditionAdjustedStats(wrestler) : {});
    const stats = wrestler.managementBattleReady ? baseStats : getManagementBattleStats(wrestler, baseStats);
    return (
      (stats.power || 0)
      + (stats.stamina || 0)
      + (stats.technique || 0)
      + (stats.charisma || 0)
      + (stats.fame || 0)
    ) / 5;
  };

  const getStyleAdvantageBonus = (leftStyle, rightStyle) => {
    const matchup = getStyleMatchup(leftStyle, rightStyle);
    return matchup > 0 ? 10 : matchup < 0 ? -10 : 0;
  };

  const estimateWinRate = (wrestler, opponent) => {
    if (!wrestler || !opponent) {
      return 0;
    }
    const wrestlerPower = getBattleEffectivePowerValue(wrestler);
    const opponentProxy = createCircuitBattleWrestler(opponent);
    const opponentPower = getBattleEffectivePowerValue(opponentProxy);
    const conditionMeta = getConditionTierMeta(wrestler.condition || 100);
    const styleBonus = getStyleAdvantageBonus(wrestler.style, opponent.style);
    const weaknessBonus = opponent.weaknessStyle === wrestler.style ? 12 : 0;
    const base = 50 + ((wrestlerPower - opponentPower) * 0.55) + styleBonus + weaknessBonus - (conditionMeta.riskBonus * 30);
    return clamp(Math.round(base), 5, 95);
  };

  const getRecommendedWrestlerForOpponent = (opponent) => {
    const candidates = gameState.roster
      .filter((wrestler) => wrestler.status !== "injured")
      .slice()
      .sort((left, right) => estimateWinRate(right, opponent) - estimateWinRate(left, opponent));
    return candidates[0] || null;
  };

  const getOpponentDifficultyText = (opponent, wrestler = null) => {
    const rate = wrestler ? estimateWinRate(wrestler, opponent) : 50;
    if (rate >= 76) return "★☆☆☆☆";
    if (rate >= 61) return "★★☆☆☆";
    if (rate >= 46) return "★★★☆☆";
    if (rate >= 31) return "★★★★☆";
    return "★★★★★";
  };

  const getCircuitRewardText = (reward) => {
    const parts = [`${formatNumber(reward.gold || 0)} G`];
    if (reward.tickets) {
      parts.push(`뽑기권 ${reward.tickets}`);
    }
    if (reward.title) {
      parts.push(`"${reward.title}" 칭호`);
    }
    if (reward.facilityUpgrade) {
      parts.push("시설 업그레이드 1회");
    }
    if (reward.specialText) {
      parts.push(reward.specialText);
    }
    if (reward.ending) {
      parts.push("엔딩");
    }
    if (reward.prestigeUnlock) {
      parts.push("프레스티지 해금");
    }
    return parts.join(" + ");
  };

  const canBookWrestlerForMatch = (wrestler) => Boolean(
    wrestler
    && wrestler.status === "idle"
    && !wrestler.restMode
  );

  const getScheduleBookedIds = () => {
    getCircuitProgressState();
    return [
      gameState.weeklySchedule.mainMatch.wrestlerId,
      ...gameState.weeklySchedule.sideMatches.flatMap((slot) => [slot.wrestlerAId, slot.wrestlerBId])
    ].filter(Boolean);
  };

  const getReadySideMatches = () => {
    getCircuitProgressState();
    return gameState.weeklySchedule.sideMatches.filter((slot) => slot.wrestlerAId && slot.wrestlerBId);
  };

  const getCircuitProgressMeta = () => {
    const opponent = getCurrentCircuitOpponent();
    if (!opponent) {
      return {
        progressLabel: "월드 챔피언십 클리어",
        progressPercent: 100,
        circuitLabel: "월드 챔피언십",
        circuitLocalRank: "완료",
        nextOpponentText: "최종 보스를 꺾었습니다",
        rewardText: "프레스티지 도전 가능"
      };
    }
    const localProgress = opponent.localRank;
    return {
      progressLabel: `${opponent.circuitLabel} - ${localProgress}/5위`,
      progressPercent: localProgress * 20,
      circuitLabel: opponent.circuitLabel,
      circuitLocalRank: `${localProgress}/5`,
      nextOpponentText: `${opponent.name} (${opponent.localRank}위)`,
      rewardText: opponent.localRank === 5 ? opponent.bossRewardText : getCircuitRewardText(opponent.reward)
    };
  };

  const getMainAssignedWrestler = () => {
    getCircuitProgressState();
    return findWrestlerById(gameState.weeklySchedule.mainMatch.wrestlerId);
  };

  const getOpenSideSlot = () => {
    getCircuitProgressState();
    for (const slot of gameState.weeklySchedule.sideMatches) {
      if (!slot.wrestlerAId || !slot.wrestlerBId) {
        return slot;
      }
    }
    return null;
  };

  const clearScheduledWrestler = (wrestlerId) => {
    getCircuitProgressState();
    if (gameState.weeklySchedule.mainMatch.wrestlerId === wrestlerId) {
      gameState.weeklySchedule.mainMatch.wrestlerId = null;
      gameState.weeklySchedule.mainMatch.forfeit = false;
    }
    gameState.weeklySchedule.sideMatches.forEach((slot) => {
      if (slot.wrestlerAId === wrestlerId) {
        slot.wrestlerAId = null;
      }
      if (slot.wrestlerBId === wrestlerId) {
        slot.wrestlerBId = null;
      }
      if (!slot.wrestlerAId && !slot.wrestlerBId) {
        slot.mode = "free";
        slot.opponentId = "";
      }
    });
    syncScheduleToLegacyWeeklyCard();
  };

  const showExhaustionConfirmIfNeeded = (wrestler) => {
    if (!wrestler || (wrestler.condition || 0) >= 20) {
      return true;
    }
    return window.confirm(`⛔ ${wrestler.name}은 탈진 상태입니다. 강행하면 부상 위험이 높습니다.\n그래도 배치하시겠습니까?`);
  };

  const recoverWrestlerCondition = (wrestlerId, mode) => {
    const wrestler = findWrestlerById(wrestlerId);
    if (!wrestler) {
      return;
    }
    const options = {
      drink: { cost: 200, amount: 20 },
      treatment: { cost: 600, amount: 50 }
    };
    const option = options[mode];
    if (!option) {
      return;
    }
    if (gameState.gold < option.cost) {
      window.alert("골드가 부족합니다.");
      return;
    }
    gameState.gold -= option.cost;
    wrestler.condition = clamp((wrestler.condition || 0) + option.amount, 0, 100);
    render();
    saveGameState();
    openWrestlerDetailModal(wrestlerId);
  };

  const toggleWrestlerRestMode = (wrestlerId) => {
    const wrestler = findWrestlerById(wrestlerId);
    if (!wrestler) {
      return;
    }
    wrestler.restMode = !wrestler.restMode;
    if (wrestler.restMode) {
      clearScheduledWrestler(wrestlerId);
    }
    render();
    saveGameState();
    openWrestlerDetailModal(wrestlerId);
  };

  const maybeApplyConditionInjury = (wrestler, summaryInjuries) => {
    if (!wrestler || wrestler.status === "injured") {
      return;
    }
    const meta = getConditionTierMeta(wrestler.condition || 100);
    if (meta.riskBonus <= 0) {
      return;
    }
    const prevention = getMedicalInjuryPrevention();
    const injuryChance = Math.max(0, meta.riskBonus - prevention);
    if (Math.random() < injuryChance) {
      wrestler.status = "injured";
      wrestler.injuryWeeks = clamp(1 + Math.floor(Math.random() * 3), 1, 4);
      summaryInjuries.push({ wrestlerId: wrestler.id, name: wrestler.name, weeks: wrestler.injuryWeeks });
    }
  };

  const applyConditionLossFromBattle = (wrestler, battlePackage, context, won, summaryInjuries) => {
    if (!wrestler) {
      return;
    }
    const baseLoss = context === "main"
      ? (won ? 25 : 40)
      : (won ? 15 : 25);
    const finisherHit = (battlePackage?.battleEvents || []).some((event) => event.type === "finisher" && event.defenderId === wrestler.id);
    const longMatch = (battlePackage?.battleResult?.totalTurns || 0) >= 60;
    const totalLoss = baseLoss + (finisherHit ? 10 : 0) + (longMatch ? 10 : 0);
    wrestler.condition = clamp((wrestler.condition || 100) - totalLoss, 0, 100);
    maybeApplyConditionInjury(wrestler, summaryInjuries);
  };

  const recordWrestlerResult = (winner, loser) => {
    if (winner) {
      winner.wins = Math.max(0, Math.floor(winner.wins || 0) + 1);
      winner.recentResults = Array.isArray(winner.recentResults) ? winner.recentResults.slice(-4) : [];
      winner.recentResults.push("W");
    }
    if (loser) {
      loser.losses = Math.max(0, Math.floor(loser.losses || 0) + 1);
      loser.recentResults = Array.isArray(loser.recentResults) ? loser.recentResults.slice(-4) : [];
      loser.recentResults.push("L");
    }
  };

  const grantFreeFacilityUpgrade = () => {
    const candidates = ["medical", "gym", "matRoom", "prStudio", "rosterOffice"]
      .filter((facilityKey) => Boolean(getFacilityNextLevelData(facilityKey)));
    if (!candidates.length) {
      return "";
    }
    const targetKey = candidates.sort((left, right) => (gameState.facilities[left]?.level || 0) - (gameState.facilities[right]?.level || 0))[0];
    const facility = gameState.facilities[targetKey];
    facility.level += 1;
    gameState.facilities = syncFacilitiesDerived(gameState.facilities);
    if (targetKey === "rosterOffice") {
      gameState.rosterLimit = getRosterLimitFromState();
    }
    return `${facility.name} 무료 업그레이드`;
  };

  const openOpponentAnalysisModal = (opponentId = getCurrentCircuitOpponent()?.id) => {
    const opponent = getCircuitOpponents().find((entry) => entry.id === opponentId);
    if (!opponent) {
      return;
    }
    revealOpponent(opponent.id);
    const fullReveal = isScoutRevealUnlocked() || hasSeenOpponent(opponent.id);
    const recommended = getRecommendedWrestlerForOpponent(opponent);
    const recommendationText = recommended
      ? `${recommended.name} (예상 승률 ${estimateWinRate(recommended, opponent)}%)`
      : "현재 추천 가능한 선수가 없습니다";
    const showStat = (key, label) => {
      const revealed = fullReveal || key === "power" || key === "technique";
      const value = revealed ? opponent.stats[key] : "????";
      const width = revealed ? clamp(opponent.stats[key], 0, 100) : 15;
      return `
        <div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#d7dde5;"><span>${label}</span><span>${value}</span></div>
          <div style="height:7px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;">
            <div style="height:100%;width:${width}%;background:${revealed ? getGradeColor(opponent.grade) : "#555"};"></div>
          </div>
        </div>
      `;
    };
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">상대 분석</h3>
          <p class="modal-subtitle">${opponent.name} / "${opponent.nickname}"</p>
        </div>
        <button class="modal-close" data-modal-close>닫기</button>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-card"><div class="detail-info-label">스타일</div><div class="detail-info-value">${getStyleMeta(opponent.style).label}</div></div>
        <div class="detail-info-card"><div class="detail-info-label">주요 기술</div><div class="detail-info-value">${opponent.finisher}</div></div>
        <div class="detail-info-card"><div class="detail-info-label">약점</div><div class="detail-info-value">${getStyleMeta(opponent.weaknessStyle).label}에게 취약</div></div>
        <div class="detail-info-card"><div class="detail-info-label">예상 난이도</div><div class="detail-info-value">${getOpponentDifficultyText(opponent, recommended)}</div></div>
      </div>
      <div style="margin-top:14px;">
        ${showStat("power", "힘")}
        ${showStat("stamina", "체력")}
        ${showStat("technique", "기술")}
        ${showStat("charisma", "카리스마")}
      </div>
      <div class="countdown-box" style="margin-top:14px;">
        ${opponent.quote}<br>
        이런 선수가 유리합니다: ${getStyleMeta(opponent.weaknessStyle).label}<br>
        현재 추천: ${recommendationText}
      </div>
    `);
  };

  syncWeeklyCardToSchedule = function () {
    syncScheduleToLegacyWeeklyCard();
  };

  getBookedWrestlerIds = function () {
    return getScheduleBookedIds();
  };

  isWrestlerBooked = function (wrestlerId) {
    return getScheduleBookedIds().includes(wrestlerId);
  };

  getAvailableCardRoster = function () {
    getCircuitProgressState();
    return gameState.roster.filter((wrestler) => canBookWrestlerForMatch(wrestler));
  };

  getReadyMatches = function () {
    const ready = [];
    const mainWrestler = getMainAssignedWrestler();
    if (mainWrestler && getCurrentCircuitOpponent()) {
      ready.push({ type: "main", wrestlerAId: mainWrestler.id, wrestlerBId: getCurrentCircuitOpponent().id });
    }
    getReadySideMatches().forEach((slot) => ready.push({ type: "side", wrestlerAId: slot.wrestlerAId, wrestlerBId: slot.wrestlerBId }));
    return ready;
  };

  countRemainingCardSlots = function () {
    getCircuitProgressState();
    let remaining = gameState.weeklySchedule.mainMatch.wrestlerId ? 0 : 1;
    remaining += gameState.weeklySchedule.sideMatches.reduce((sum, slot) => sum + (slot.wrestlerAId && slot.wrestlerBId ? 0 : 1), 0);
    return remaining;
  };

  getWrestlerPower = function (wrestler) {
    return getEffectivePowerValue(wrestler);
  };

  createBattleState = function (wrestler) {
    const adjusted = wrestler?.stats ? buildBattleReadyWrestler(wrestler) : wrestler;
    const maxHP = calcMaxHP(adjusted);
    const ageMeta = getAgeStageMeta(adjusted.age || 20);
    const conditionMeta = getConditionTierMeta(wrestler?.condition || adjusted?.condition || 100);
    const staminaCap = Math.max(50, Math.floor(100 * conditionMeta.staminaMultiplier));
    return {
      id: adjusted.id,
      name: adjusted.name,
      nickname: adjusted.nickname,
      grade: adjusted.grade,
      style: adjusted.style,
      alignment: adjusted.alignment || "neutral",
      finisher: adjusted.finisher,
      spriteColor: adjusted.spriteColor,
      spriteSheet: adjusted.spriteSheet,
      battleSpriteSheet: adjusted.battleSpriteSheet || null,
      spriteFrames: adjusted.spriteFrames,
      battleSpriteFrames: adjusted.battleSpriteFrames || 12,
      portraitMode: adjusted.portraitMode,
      maxHP,
      currentHP: maxHP,
      maxStamina: staminaCap,
      currentStamina: staminaCap,
      finisherGauge: 0,
      finisherChargeMultiplier: ageMeta.finisherMultiplier || 1,
      momentum: 50,
      isStunned: false,
      isGrapped: false,
      isDown: false,
      downCount: 0,
      pinCount: 0,
      isPinned: false,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      attackCount: 0,
      finisherUsed: false,
      criticalHits: 0,
      kickoutsAt2: 0,
      forcedRestTurn: false,
      usedFinisherToWin: false,
      usedCheapShot: false,
      lossStreak: getRecentLossStreak(adjusted),
      age: adjusted.age || 20,
      highlightFlags: {
        criticalComeback: false
      },
      stats: { ...adjusted.stats }
    };
  };

  createRosterCardHtml = function (wrestler) {
    const gradeClass = wrestler.grade === "LEGEND" ? "grade-badge legend" : "grade-badge";
    const isSelected = rosterViewState.selectedIds.includes(wrestler.id);
    const cooldown = getAlignmentTurnCooldownRemaining(wrestler);
    const canTurnFace = canChangeAlignment(wrestler, "face");
    const canTurnHeel = canChangeAlignment(wrestler, "heel");
    const rivalryLabel = getWrestlerRivalrySummary(wrestler.id);
    const warningText = getConditionWarningText(wrestler);
    return `
      <article class="roster-card ${isSelected ? "selected" : ""}" data-wrestler-id="${wrestler.id}">
        <div class="roster-check-wrap">
          <input class="roster-checkbox" type="checkbox" data-action="toggle-select" data-wrestler-id="${wrestler.id}" ${isSelected ? "checked" : ""}>
        </div>
        <div class="${gradeClass}" style="${wrestler.grade === "LEGEND" ? "" : `background:${getGradeColor(wrestler.grade)};`}">${wrestler.grade}</div>
        <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler)}"></div>
        <div class="wrestler-info">
          ${getFavoriteStarHtml(wrestler)}
          <div class="wrestler-name">${wrestler.name}</div>
          <div class="wrestler-nickname"><em>"${wrestler.nickname}"</em></div>
          <div class="roster-inline-badges">
            <span>${getStyleBadgeHtml(wrestler.style)}</span>
            <span>${getAlignmentBadgeHtml(wrestler.alignment)}</span>
            <span>${getAgeStageBadgeHtml(wrestler.age)}</span>
            ${wrestler.restMode ? '<span style="color:#7ed6ff;">휴식 예약</span>' : ""}
          </div>
          <div class="wrestler-submeta">나이 ${wrestler.age}세 · 계약 D-${wrestler.contractWeeks}w · 주급 ${formatNumber(wrestler.salary)}</div>
          ${rivalryLabel ? `<div class="wrestler-submeta" style="color:#f39c12;">${rivalryLabel}</div>` : ""}
          ${cooldown > 0 ? `<div class="wrestler-submeta">역할 전환 쿨다운 ${cooldown}주</div>` : ""}
          ${warningText ? `<div class="wrestler-submeta" style="color:${getConditionColor(wrestler.condition)};">${warningText}</div>` : ""}
          ${getConditionBarHtml(wrestler)}
        </div>
        <div class="stat-stack">
          ${createStatRowHtml("힘", "power", wrestler.stats.power)}
          ${createStatRowHtml("체력", "stamina", wrestler.stats.stamina)}
          ${createStatRowHtml("기술", "technique", wrestler.stats.technique)}
          ${createStatRowHtml("카리", "charisma", wrestler.stats.charisma)}
          <div class="wrestler-submeta">⚡ 실전 전투력 ${formatAverage(getWrestlerPower(wrestler))}</div>
        </div>
        ${getRosterStatusBadgeHtml(wrestler)}
        <div class="action-group">
          <button class="action-button train" data-action="view-detail" data-wrestler-id="${wrestler.id}">상세 보기</button>
          <details class="roster-menu">
            <summary>⋮</summary>
            <div class="roster-menu-list">
              <button class="roster-menu-item" data-action="train" data-wrestler-id="${wrestler.id}">훈련 배치</button>
              <button class="roster-menu-item" data-action="add-to-card" data-wrestler-id="${wrestler.id}">경기 카드 배치</button>
              <button class="roster-menu-item" data-action="extend-contract" data-wrestler-id="${wrestler.id}">계약 연장</button>
              <button class="roster-menu-item" data-action="turn-face" data-wrestler-id="${wrestler.id}" ${canTurnFace ? "" : "disabled"}>페이스 전환 -500</button>
              <button class="roster-menu-item" data-action="turn-heel" data-wrestler-id="${wrestler.id}" ${canTurnHeel ? "" : "disabled"}>힐 전환 -500</button>
              <button class="roster-menu-item" data-action="retire" data-wrestler-id="${wrestler.id}">은퇴</button>
              <button class="roster-menu-item" data-action="release" data-wrestler-id="${wrestler.id}">방출</button>
            </div>
          </details>
        </div>
      </article>
    `;
  };

  openWrestlerDetailModal = function (wrestlerId) {
    const wrestler = findWrestlerById(wrestlerId);
    if (!wrestler) {
      return;
    }
    const power = formatAverage(getWrestlerPower(wrestler));
    const status = getStatusMeta(wrestler);
    const ageStage = getAgeStageMeta(wrestler.age);
    const meta = getConditionTierMeta(wrestler.condition || 100);
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">${wrestler.name}</h3>
          <p class="modal-subtitle">"${wrestler.nickname}" · ${wrestler.grade} 등급 · ${status.text} · ${getAlignmentMeta(wrestler.alignment).label} · ${wrestler.age}세 ${ageStage.short}</p>
        </div>
        <button class="modal-close" data-modal-close>닫기</button>
      </div>
      <div class="detail-layout">
        <div class="sprite-box large" style="${getWrestlerVisualStyle(wrestler)}"></div>
        <div>
          ${getConditionBarHtml(wrestler)}
          <div class="countdown-box" style="margin-top:12px;color:${meta.color};">
            ${meta.label} · 실전 전투력 ${power}<br>
            ${wrestler.restMode ? "이번 주 완전 휴식 예약됨" : "휴식 예약 없음"}
          </div>
          <div class="detail-stats" style="margin-top:14px;">
            <div class="detail-stat-card"><div class="detail-stat-label">힘</div><div class="detail-stat-value">${wrestler.stats.power}</div></div>
            <div class="detail-stat-card"><div class="detail-stat-label">체력</div><div class="detail-stat-value">${wrestler.stats.stamina}</div></div>
            <div class="detail-stat-card"><div class="detail-stat-label">기술</div><div class="detail-stat-value">${wrestler.stats.technique}</div></div>
            <div class="detail-stat-card"><div class="detail-stat-label">카리스마</div><div class="detail-stat-value">${wrestler.stats.charisma}</div></div>
            <div class="detail-stat-card"><div class="detail-stat-label">명성</div><div class="detail-stat-value">${wrestler.stats.fame}</div></div>
            <div class="detail-stat-card"><div class="detail-stat-label">전적</div><div class="detail-stat-value">${wrestler.wins}승 ${wrestler.losses}패</div></div>
          </div>
          <div class="modal-actions" style="margin-top:14px;">
            <button class="modal-action-button cancel" id="conditionDrinkButton">에너지 드링크 -200</button>
            <button class="modal-action-button cancel" id="conditionTreatButton">집중 치료 -600</button>
            <button class="modal-action-button confirm" id="conditionRestButton">${wrestler.restMode ? "휴식 해제" : "완전 휴식 예약"}</button>
          </div>
        </div>
      </div>
    `);
    const drinkButton = document.getElementById("conditionDrinkButton");
    if (drinkButton) {
      drinkButton.addEventListener("click", () => recoverWrestlerCondition(wrestlerId, "drink"));
    }
    const treatButton = document.getElementById("conditionTreatButton");
    if (treatButton) {
      treatButton.addEventListener("click", () => recoverWrestlerCondition(wrestlerId, "treatment"));
    }
    const restButton = document.getElementById("conditionRestButton");
    if (restButton) {
      restButton.addEventListener("click", () => toggleWrestlerRestMode(wrestlerId));
    }
  };

  getHomeMatchPreviewLines = function () {
    const readyMatches = getReadyMatches().map((slot) => {
      const wrestlerA = findWrestlerById(slot.wrestlerAId);
      const wrestlerB = findWrestlerById(slot.wrestlerBId);
      if (!wrestlerA || !wrestlerB) {
        return null;
      }
      return `${wrestlerA.name} VS ${wrestlerB.name}`;
    }).filter(Boolean);
    return readyMatches.length ? readyMatches : ["이번 주 아직 편성된 경기가 없습니다"];
  };

  renderHomeMainContent = function () {
    const showCard = getShowCardSummary();
    const bestCard = getBestCardSummary();
    const contractSummary = getContractAlertSummary();
    const monthlyPayroll = getMonthlyPayrollEstimate();
    const summaryNet = pendingWeeklySummary
      ? formatNumber((pendingWeeklySummary.totalIncome || 0) - (pendingWeeklySummary.salaryTotal || 0))
      : null;
    const homeSupportText = pendingWeeklySummary
      ? `직전 쇼 순이익 ${summaryNet}G · 관중 ${formatNumber(pendingWeeklySummary.totalAudience || 0)}명`
      : "저장 데이터로 바로 이어집니다. 핵심 비용과 계약만 짧게 확인합니다.";
    mainDynamicContentEl.innerHTML = `
      <div class="home-stack">
        <section>
          <div class="home-overview-card">
            <div class="home-overview-top">
              <div>
                <div class="hero-eyebrow">Home Control</div>
                <h3 class="hero-headline">홈 요약</h3>
                <p class="hero-support">${homeSupportText}</p>
              </div>
            </div>
            <div class="home-summary-grid">
              <article class="home-summary-card">
                <div class="home-summary-label">최고 카드</div>
                <div class="home-summary-value">${bestCard.name}</div>
                <div class="home-summary-note">${bestCard.note}</div>
              </article>
              <article class="home-summary-card">
                <div class="home-summary-label">월 지출 예상</div>
                <div class="home-summary-value">${formatNumber(monthlyPayroll)}G</div>
                <div class="home-summary-note">주급 ${formatNumber(getWeeklySalaryTotal())}G x 4주</div>
              </article>
              <article class="home-summary-card">
                <div class="home-summary-label">계약 임박</div>
                <div class="home-summary-value">${contractSummary.value}</div>
                <div class="home-summary-note">${contractSummary.note}</div>
              </article>
            </div>
          </div>
          <div class="home-canvas-wrap">
            <div class="canvas-shell">
              <button class="canvas-skip-button ${matchAnimationState.running ? "" : "hidden"}" id="canvasSkipButton">스킵</button>
              <canvas id="matchCanvas" width="640" height="560"></canvas>
              <div class="arena-overlay">
                ${showCard.readyMatches ? "" : `
                  <div class="arena-bottom-bar">
                    <div class="arena-bottom-grid">
                      <button class="arena-action-button" data-nav-tab="roster" style="grid-column:1 / -1;justify-self:start;">로스터에서 카드 편성</button>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `;
    const skipButton = document.getElementById("canvasSkipButton");
    if (skipButton) {
      skipButton.addEventListener("click", skipMatchAnimation);
    }
    Array.from(mainDynamicContentEl.querySelectorAll("[data-nav-tab]")).forEach((button) => {
      button.addEventListener("click", () => {
        const nextTab = button.dataset.navTab;
        if (!nextTab) {
          return;
        }
        activeTab = nextTab;
        render();
      });
    });
    drawCurrentCanvasFrame(performance.now());
  };

  renderHomeSidePanel = function () {
    sideListEl.innerHTML = "";
  };

  createBookedSlotHtml = function (slotIndex, sideKey, wrestlerId) {
    const wrestler = findWrestlerById(wrestlerId);
    if (!wrestler) {
      return `<div class="dropzone" data-slot-index="${slotIndex}" data-side="${sideKey}">선수를 선택하세요</div>`;
    }
    const warningText = getConditionWarningText(wrestler);
    const border = (wrestler.condition || 0) < 40 ? `border:1px solid ${getConditionColor(wrestler.condition)};` : "";
    return `
      <div class="dropzone filled" data-slot-index="${slotIndex}" data-side="${sideKey}" style="${border}">
        <button class="slot-remove" data-action="remove-slot" data-slot-index="${slotIndex}" data-side="${sideKey}">X</button>
        <div class="slot-card">
          <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:48px;height:48px;")}"></div>
          <div style="min-width:0;">
            <div class="slot-card-name">${wrestler.name}</div>
            <div class="slot-card-power">전투력 ${formatAverage(getWrestlerPower(wrestler))} · ${getStyleMeta(wrestler.style).icon} · ${getAlignmentMeta(wrestler.alignment).icon}</div>
            ${getConditionBarHtml(wrestler)}
            ${warningText ? `<div style="margin-top:6px;color:${getConditionColor(wrestler.condition)};font-size:11px;">${warningText}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  };

  const createMainMatchAssignmentHtml = () => {
    const opponent = getCurrentCircuitOpponent();
    const wrestler = getMainAssignedWrestler();
    if (!opponent) {
      return `<div class="placeholder-box">월드 챔피언십을 클리어했습니다.</div>`;
    }
    if (!wrestler) {
      return `<div class="dropzone" style="min-height:120px;">에이스 선수를 선택해 메인 경기에 배치하세요</div>`;
    }
    const warningText = getConditionWarningText(wrestler);
    return `
      <div class="dropzone filled" style="${(wrestler.condition || 0) < 40 ? `border:1px solid ${getConditionColor(wrestler.condition)};` : ""}">
        <button class="slot-remove" data-action="remove-main-slot">X</button>
        <div class="slot-card">
          <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:56px;height:56px;")}"></div>
          <div style="min-width:0;">
            <div class="slot-card-name">${wrestler.name}</div>
            <div class="slot-card-power">예상 승률 ${estimateWinRate(wrestler, opponent)}% · 전투력 ${formatAverage(getWrestlerPower(wrestler))}</div>
            ${getConditionBarHtml(wrestler)}
            ${warningText ? `<div style="margin-top:6px;color:${getConditionColor(wrestler.condition)};font-size:11px;">${warningText}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  };

  const createSideSlotHtml = (slot, index) => `
    <div class="match-slot">
      <div>
        <div class="slot-label">슬롯 ${index + 1} · 선수 A</div>
        ${slot.wrestlerAId ? createBookedSlotHtml(index, "A", slot.wrestlerAId) : `<div class="dropzone" data-slot-index="${index}" data-side="A">선수를 선택하세요</div>`}
      </div>
      <div class="vs-mark">VS</div>
      <div>
        <div class="slot-label">슬롯 ${index + 1} · 선수 B</div>
        ${slot.wrestlerBId ? createBookedSlotHtml(index, "B", slot.wrestlerBId) : `<div class="dropzone" data-slot-index="${index}" data-side="B">선수를 선택하세요</div>`}
      </div>
      <div style="grid-column:1 / -1;color:#95a5a6;font-size:12px;">${slot.mode === "revenge" ? "즉시 재도전 슬롯" : "랭킹 변동 없음 · 메인 경기 수익의 40%"}</div>
    </div>
  `;

  renderCardsMainContent = function () {
    getCircuitProgressState();
    const opponent = getCurrentCircuitOpponent();
    const availableRosterHtml = getAvailableCardRoster().map((wrestler) => `
      <article class="mini-wrestler-card" data-action="pick-card-wrestler" data-wrestler-id="${wrestler.id}" title="클릭으로 자동 배치">
        <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:46px;height:46px;")}"></div>
        <div class="mini-wrestler-meta">
          <div class="mini-wrestler-name">${wrestler.name}</div>
          <div class="mini-wrestler-power">전투력 ${formatAverage(getWrestlerPower(wrestler))} · 컨디션 ${wrestler.condition}%</div>
        </div>
      </article>
    `).join("");
    const sideSlots = gameState.weeklySchedule.sideMatches.map((slot, index) => createSideSlotHtml(slot, index)).join("");
    const hasMainReady = Boolean(gameState.weeklySchedule.mainMatch.wrestlerId) || gameState.weeklySchedule.mainMatch.forfeit;
    mainDynamicContentEl.innerHTML = `
      <div class="booking-topline">
        <span>Week ${gameState.week} 경기 편성</span>
        <span>메인 1경기 필수 · 사이드 최대 2경기</span>
      </div>
      <div class="match-slot-list">
        <div class="match-slot" style="grid-template-columns:1fr;">
          <div class="slot-label">⚔️ 메인 경기 (서킷 도전)</div>
          <div class="home-preview-box" style="margin-bottom:10px;">
            ${opponent ? `
              <div style="font-weight:700;">${opponent.name} (${opponent.grade} · 총합 ${opponent.total})</div>
              <div>"${opponent.nickname}"</div>
              <div>스타일: ${getStyleMeta(opponent.style).label} · 약점: ${getStyleMeta(opponent.weaknessStyle).label}</div>
              <div>예상 난이도: ${getOpponentDifficultyText(opponent, getMainAssignedWrestler())}</div>
              <div>클리어 보상: ${getCircuitRewardText(opponent.reward)}</div>
            ` : "모든 서킷 완료"}
          </div>
          ${createMainMatchAssignmentHtml()}
          <div class="booking-actions" style="justify-content:flex-start;">
            <button class="booking-button auto" data-action="open-main-analysis" ${opponent ? "" : "disabled"}>상대 분석</button>
            <button class="booking-button cancel" data-action="forfeit-main-match" ${opponent ? "" : "disabled"}>이번 주 메인 경기 포기</button>
          </div>
        </div>
        <div class="match-slot" style="grid-template-columns:1fr;">
          <div class="slot-label">사이드 경기 (선택, 최대 2경기)</div>
          <div class="gacha-small-text">사이드 수익은 메인 경기의 40% 수준이며 랭킹에는 영향을 주지 않습니다.</div>
        </div>
        ${sideSlots}
      </div>
      <div class="booked-roster-section">
        <div class="booked-roster-title">배치 가능한 선수 목록</div>
        <div class="booked-roster-strip">
          ${availableRosterHtml || '<div class="placeholder-box" style="min-height:140px;">편성 가능한 대기 선수가 없습니다</div>'}
        </div>
      </div>
      <div class="booking-actions">
        <button class="booking-button auto" data-action="auto-book">자동 편성</button>
        <button class="booking-button start" data-action="start-weekly-matches" ${hasMainReady ? "" : "disabled"}>이번 주 경기 시작</button>
      </div>
    `;
    attachCardsTabEvents();
  };

  renderCardsSidePanel = function () {
    const opponent = getCurrentCircuitOpponent();
    const assigned = getMainAssignedWrestler();
    const progress = getCircuitProgressState();
    sideListEl.innerHTML = `
      <div class="hype-panel">
        <div class="side-card">
          <div class="side-card-title">메인 경기</div>
          <div class="side-card-desc">${assigned && opponent ? `${assigned.name} vs ${opponent.name}<br>예상 승률 ${estimateWinRate(assigned, opponent)}%` : "에이스 선수를 메인 경기에 배치하세요."}</div>
        </div>
        <div class="side-card">
          <div class="side-card-title">사이드 경기</div>
          <div class="side-card-desc">${getReadySideMatches().length}/2 편성 완료<br>랭킹 변동 없음</div>
        </div>
        <div class="side-card">
          <div class="side-card-title">연승 / 연패</div>
          <div class="side-card-desc">연승 ${progress.consecutiveWins}<br>연패 ${progress.consecutiveLosses}</div>
        </div>
        ${progress.revengeAvailable ? '<div class="side-card"><div class="side-card-title">즉시 재도전 가능</div><div class="side-card-desc">결산 모달에서 같은 상대에게 다시 도전할 수 있습니다.</div></div>' : ""}
      </div>
    `;
  };

  attachCardsTabEvents = function () {
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="pick-card-wrestler"]')).forEach((button) => {
      button.addEventListener("click", () => {
        placeWrestlerIntoWeeklyCard(button.dataset.wrestlerId);
      });
    });
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="remove-slot"]')).forEach((button) => {
      button.addEventListener("click", () => {
        removeWrestlerFromWeeklyCard(Number(button.dataset.slotIndex), button.dataset.side);
      });
    });
    const removeMainButton = mainDynamicContentEl.querySelector('[data-action="remove-main-slot"]');
    if (removeMainButton) {
      removeMainButton.addEventListener("click", () => {
        gameState.weeklySchedule.mainMatch.wrestlerId = null;
        gameState.weeklySchedule.mainMatch.forfeit = false;
        syncScheduleToLegacyWeeklyCard();
        renderActiveTab();
      });
    }
    const autoButton = mainDynamicContentEl.querySelector('[data-action="auto-book"]');
    if (autoButton) {
      autoButton.addEventListener("click", autoFillWeeklyCard);
    }
    const startButton = mainDynamicContentEl.querySelector('[data-action="start-weekly-matches"]');
    if (startButton) {
      startButton.addEventListener("click", startWeeklyMatches);
    }
    const analysisButton = mainDynamicContentEl.querySelector('[data-action="open-main-analysis"]');
    if (analysisButton) {
      analysisButton.addEventListener("click", () => openOpponentAnalysisModal());
    }
    const forfeitButton = mainDynamicContentEl.querySelector('[data-action="forfeit-main-match"]');
    if (forfeitButton) {
      forfeitButton.addEventListener("click", () => {
        const opponent = getCurrentCircuitOpponent();
        if (!opponent) {
          return;
        }
        if (!window.confirm("정말 포기하시겠습니까?\n랭킹 -1, 인기도 -5가 적용됩니다.")) {
          return;
        }
        gameState.weeklySchedule.mainMatch.forfeit = true;
        syncScheduleToLegacyWeeklyCard();
        renderActiveTab();
      });
    }
  };

  placeWrestlerIntoWeeklyCard = function (wrestlerId) {
    const wrestler = findWrestlerById(wrestlerId);
    if (!canBookWrestlerForMatch(wrestler)) {
      return;
    }
    if (!showExhaustionConfirmIfNeeded(wrestler)) {
      return;
    }
    clearScheduledWrestler(wrestlerId);
    if (!gameState.weeklySchedule.mainMatch.wrestlerId) {
      gameState.weeklySchedule.mainMatch.wrestlerId = wrestlerId;
      gameState.weeklySchedule.mainMatch.forfeit = false;
    } else {
      const openSlot = getOpenSideSlot();
      if (!openSlot) {
        window.alert("사이드 경기 슬롯이 모두 찼습니다.");
        return;
      }
      if (!openSlot.wrestlerAId) {
        openSlot.wrestlerAId = wrestlerId;
      } else {
        if (openSlot.wrestlerAId === wrestlerId) {
          window.alert("같은 선수는 한 사이드 경기에 중복 배치할 수 없습니다.");
          return;
        }
        openSlot.wrestlerBId = wrestlerId;
      }
    }
    syncScheduleToLegacyWeeklyCard();
    renderActiveTab();
  };

  removeWrestlerFromWeeklyCard = function (slotIndex, side) {
    const slot = gameState.weeklySchedule.sideMatches[slotIndex];
    if (!slot) {
      return;
    }
    if (side === "A") {
      slot.wrestlerAId = null;
    } else if (side === "B") {
      slot.wrestlerBId = null;
    }
    if (!slot.wrestlerAId && !slot.wrestlerBId) {
      slot.mode = "free";
      slot.opponentId = "";
    }
    syncScheduleToLegacyWeeklyCard();
    renderActiveTab();
  };

  autoFillWeeklyCard = function () {
    const available = getAvailableCardRoster().slice().sort((left, right) => {
      const rightValue = (right.condition || 0) + getWrestlerPower(right);
      const leftValue = (left.condition || 0) + getWrestlerPower(left);
      return rightValue - leftValue;
    });
    gameState.weeklySchedule = createEmptyWeeklySchedule();
    const mainPick = available.shift();
    if (mainPick) {
      gameState.weeklySchedule.mainMatch.wrestlerId = mainPick.id;
    }
    gameState.weeklySchedule.sideMatches.forEach((slot) => {
      const left = available.shift();
      const right = available.shift();
      slot.wrestlerAId = left?.id || null;
      slot.wrestlerBId = right?.id || null;
    });
    syncScheduleToLegacyWeeklyCard();
    renderActiveTab();
  };

  clearWrestlerFromOwnership = function (wrestlerId) {
    clearScheduledWrestler(wrestlerId);
    Object.keys(gameState.championships).forEach((key) => {
      if (gameState.championships[key].holderId === wrestlerId) {
        gameState.championships[key].holderId = null;
        gameState.championships[key].defenseWeek = 0;
      }
    });
    gameState.rivalries = gameState.rivalries.filter((rivalry) => rivalry.wrestlerAId !== wrestlerId && rivalry.wrestlerBId !== wrestlerId);
  };

  const applyCircuitWinRewards = (opponent, summary, isRevenge = false) => {
    const progress = getCircuitProgressState();
    if (!progress.defeatedOpponents.includes(opponent.id)) {
      progress.defeatedOpponents.push(opponent.id);
    }
    progress.consecutiveWins += 1;
    progress.consecutiveLosses = 0;
    progress.revengeAvailable = false;
    progress.lastOpponentId = opponent.id;
    const streakMultiplier = progress.consecutiveWins >= 5 ? 2 : progress.consecutiveWins >= 3 ? 1.5 : progress.consecutiveWins >= 2 ? 1.2 : 1;
    const goldReward = Math.floor((opponent.reward.gold || 0) * streakMultiplier);
    const bonusTickets = progress.consecutiveWins >= 5 ? 1 : 0;
    summary.totalIncome += goldReward;
    summary.ticketReward += (opponent.reward.tickets || 0) + bonusTickets;
    summary.fameDelta += opponent.localRank === 5 ? 8 : 4;
    summary.bonusLines.push(`랭킹 상승: ${opponent.globalRank}위 돌파`);
    if (streakMultiplier > 1) {
      summary.bonusLines.push(`${progress.consecutiveWins}연승 보너스 ×${streakMultiplier.toFixed(1)}`);
    }
    if (bonusTickets) {
      summary.bonusLines.push("5연승 보너스 뽑기권 +1");
    }
    if (opponent.reward.title) {
      gameState.achievements.titles.push(opponent.reward.title);
      summary.bonusLines.push(`칭호 획득: ${opponent.reward.title}`);
    }
    if (opponent.reward.facilityUpgrade) {
      const upgradeText = grantFreeFacilityUpgrade();
      if (upgradeText) {
        summary.bonusLines.push(upgradeText);
      }
    }
    if (opponent.reward.specialText) {
      summary.bonusLines.push(opponent.reward.specialText);
    }
    if (opponent.reward.ending || opponent.reward.prestigeUnlock) {
      progress.completed = true;
      progress.currentRank = 25;
      if (opponent.reward.prestigeUnlock) {
        gameState.legacy.points += 5;
        gameState.legacy.totalEarned += 5;
        summary.bonusLines.push("프레스티지 도전이 해금되었습니다");
      }
      summary.bonusLines.push("월드 챔피언십 엔딩 달성");
    } else {
      progress.currentRank = clamp(opponent.globalRank + 1, 1, 25);
    }
  };

  const applyCircuitLossPenalties = (opponent, summary) => {
    const progress = getCircuitProgressState();
    const floor = getCircuitRankFloor(progress.currentRank);
    progress.currentRank = Math.max(floor, progress.currentRank - 1);
    progress.consecutiveWins = 0;
    progress.consecutiveLosses += 1;
    progress.revengeAvailable = true;
    progress.lastOpponentId = opponent.id;
    summary.fameDelta -= 4;
    summary.bonusLines.push(`랭킹 하락: ${progress.currentRank}위로 후퇴`);
    if (progress.consecutiveLosses >= 2) {
      summary.weeklyIncomeMultiplier *= 0.85;
      summary.warningLines.push("2연패 페널티: 팬 수익 -15%");
    }
    if (progress.consecutiveLosses >= 3) {
      summary.fameDelta -= 10;
      summary.warningLines.push("팬들이 실망하고 있습니다. 인기도 -10");
    }
    if (progress.consecutiveLosses >= 4) {
      progress.sponsorPenalty = 300;
      summary.warningLines.push("스폰서 계약 일부 해지: 주당 수익 -300");
    }
  };

  const createMainMatchResultEntry = (wrestler, opponent, battlePackage, won, forcedLoss = false) => {
    const battleResult = battlePackage?.battleResult || {
      winnerId: won ? wrestler.id : opponent.id,
      loserId: won ? opponent.id : wrestler.id,
      totalTurns: 0,
      finishType: forcedLoss ? "FORFEIT" : "TIME_LIMIT",
      winnerStats: { damageDealt: 0, criticalHits: 0, finisherUsed: false, stamina: 0 },
      loserStats: { damageDealt: 0, kickoutsAt2: 0, finisherUsed: false },
      hypeGenerated: 0,
      highlight: forcedLoss ? "DOMINANT" : "CLOSE_MATCH",
      matchTypeLabel: "CIRCUIT_MAIN"
    };
    return {
      kind: "main",
      wrestlerAName: wrestler?.name || "미배정",
      wrestlerBName: opponent.name,
      wrestlerAId: wrestler?.id || "",
      wrestlerBId: opponent.id,
      winnerName: won ? wrestler.name : opponent.name,
      winnerId: won ? wrestler.id : opponent.id,
      income: 0,
      battleResult,
      finishType: battleResult.finishType,
      highlightLabel: getHighlightLabel(battleResult.highlight),
      turnCount: battleResult.totalTurns,
      rewardText: getCircuitRewardText(opponent.reward),
      opponentId: opponent.id,
      summaryText: won ? "서킷 승리" : (forcedLoss ? "메인 경기 포기" : "서킷 패배"),
      injury: null
    };
  };

  const createSideMatchResultEntry = (left, right, battlePackage) => {
    const battleResult = battlePackage.battleResult;
    const winner = battleResult.winnerId === left.id ? left : right;
    return {
      kind: "side",
      wrestlerAName: left.name,
      wrestlerBName: right.name,
      wrestlerAId: left.id,
      wrestlerBId: right.id,
      winnerName: winner.name,
      winnerId: winner.id,
      income: 0,
      battleResult,
      finishType: battleResult.finishType,
      highlightLabel: getHighlightLabel(battleResult.highlight),
      turnCount: battleResult.totalTurns,
      rewardText: "랭킹 변동 없음",
      summaryText: "사이드 경기"
    };
  };

  const runSideMatch = (slot, summary, battlePackages) => {
    const left = findWrestlerById(slot.wrestlerAId);
    const right = findWrestlerById(slot.wrestlerBId);
    if (!left || !right) {
      return;
    }
    left.status = "match";
    right.status = "match";
    const battlePackage = runBattleSimulation(buildBattleReadyWrestler(left), buildBattleReadyWrestler(right), {
      startingHype: clamp(gameState.hype, 0, 100)
    });
    const winner = battlePackage.battleResult.winnerId === left.id ? left : right;
    const loser = winner.id === left.id ? right : left;
    recordWrestlerResult(winner, loser);
    applyConditionLossFromBattle(left, battlePackage, "side", winner.id === left.id, summary.injuries);
    applyConditionLossFromBattle(right, battlePackage, "side", winner.id === right.id, summary.injuries);
    const opponent = getCurrentCircuitOpponent();
    const baseIncome = Math.max(180, Math.floor(((opponent?.reward?.gold || 800) * 0.4)));
    const matchIncome = Math.floor(baseIncome + (battlePackage.battleResult.hypeGenerated * 8));
    summary.totalIncome += matchIncome;
    summary.results.push({ ...createSideMatchResultEntry(left, right, battlePackage), income: matchIncome });
    battlePackages.push(battlePackage);
    left.status = left.status === "injured" ? "injured" : "idle";
    right.status = right.status === "injured" ? "injured" : "idle";
  };

  const runMainCircuitMatch = (summary, battlePackages, options = {}) => {
    const opponent = options.opponentId
      ? getCircuitOpponents().find((entry) => entry.id === options.opponentId)
      : getCurrentCircuitOpponent();
    const wrestler = findWrestlerById(summary.mainWrestlerId);
    if (!opponent) {
      return;
    }
    revealOpponent(opponent.id);
    const forceLoss = Boolean(options.forceLoss);
    if (forceLoss) {
      applyCircuitLossPenalties(opponent, summary);
      summary.results.unshift(createMainMatchResultEntry(wrestler, opponent, null, false, true));
      summary.mainMatchLost = true;
      summary.mainMatchCompleted = true;
      summary.opponentId = opponent.id;
      if (wrestler) {
        wrestler.status = wrestler.status === "injured" ? "injured" : "idle";
      }
      return;
    }
    if (!wrestler) {
      return;
    }
    wrestler.status = "match";
    const battlePackage = runBattleSimulation(buildBattleReadyWrestler(wrestler), createCircuitBattleWrestler(opponent), {
      startingHype: clamp(gameState.hype + 5, 0, 100)
    });
    const won = battlePackage.battleResult.winnerId === wrestler.id;
    summary.mainMatchLost = !won;
    if (won) {
      applyCircuitWinRewards(opponent, summary, Boolean(options.isRevenge));
    } else {
      applyCircuitLossPenalties(opponent, summary);
    }
    recordWrestlerResult(won ? wrestler : null, won ? null : wrestler);
    applyConditionLossFromBattle(wrestler, battlePackage, "main", won, summary.injuries);
    const mainResult = createMainMatchResultEntry(wrestler, opponent, battlePackage, won, false);
    if (won) {
      mainResult.income = Math.floor(summary.totalIncome - summary.sideIncomeSnapshot);
    }
    summary.results.unshift(mainResult);
    summary.mainMatchCompleted = true;
    summary.opponentId = opponent.id;
    battlePackages.unshift(battlePackage);
    wrestler.status = wrestler.status === "injured" ? "injured" : "idle";
  };

  const canTriggerImmediateRevenge = (summary = pendingWeeklySummary) => Boolean(
    summary
    && summary.mainMatchLost
    && summary.mainWrestlerId
    && !summary.revengeUsed
    && summary.availableRevengeSlots > 0
    && getCircuitProgressState().revengeAvailable
  );

  const triggerImmediateRevenge = () => {
    if (!canTriggerImmediateRevenge()) {
      return;
    }
    const wrestler = findWrestlerById(pendingWeeklySummary.mainWrestlerId);
    if (!wrestler || !showExhaustionConfirmIfNeeded(wrestler)) {
      return;
    }
    const battlePackages = [];
    pendingWeeklySummary.sideIncomeSnapshot = pendingWeeklySummary.totalIncome;
    runMainCircuitMatch(pendingWeeklySummary, battlePackages, { isRevenge: true, opponentId: pendingWeeklySummary.opponentId });
    pendingWeeklySummary.revengeUsed = true;
    pendingWeeklySummary.availableRevengeSlots -= 1;
    pendingWeeklySummary.bonusLines.push(pendingWeeklySummary.mainMatchLost ? "즉시 재도전 실패" : "즉시 재도전 성공");
    closeModal(true);
    matchAnimationState.finishCallback = openWeeklyResultsModal;
    startMatchAnimation(battlePackages);
  };

  startWeeklyMatches = function () {
    getCircuitProgressState();
    const opponent = getCurrentCircuitOpponent();
    const mainWrestler = getMainAssignedWrestler();
    if (!opponent) {
      window.alert("이미 월드 챔피언십을 클리어했습니다.");
      return;
    }
    if (!mainWrestler && !gameState.weeklySchedule.mainMatch.forfeit) {
      window.alert("메인 경기 에이스 선수를 배치해야 합니다.");
      return;
    }
    const summary = {
      week: gameState.week,
      results: [],
      totalIncome: 0,
      sideIncomeSnapshot: 0,
      fameBefore: gameState.fame,
      fameDelta: 0,
      fameAfter: gameState.fame,
      ticketReward: 0,
      matchCount: 0,
      bonusLines: [],
      warningLines: [],
      injuries: [],
      mainMatchLost: false,
      mainMatchCompleted: false,
      mainWrestlerId: mainWrestler?.id || "",
      opponentId: opponent.id,
      revengeUsed: false,
      availableRevengeSlots: Math.max(0, 2 - getReadySideMatches().length),
      weeklyIncomeMultiplier: 1
    };
    const battlePackages = [];
    if (gameState.weeklySchedule.mainMatch.forfeit) {
      summary.mainWrestlerId = mainWrestler?.id || "";
      runMainCircuitMatch(summary, battlePackages, { forceLoss: true });
      summary.fameDelta -= 1;
    } else {
      summary.sideIncomeSnapshot = summary.totalIncome;
      runMainCircuitMatch(summary, battlePackages);
    }
    getReadySideMatches().forEach((slot) => {
      runSideMatch(slot, summary, battlePackages);
    });
    if (getCircuitProgressState().sponsorPenalty > 0) {
      summary.totalIncome = Math.max(0, summary.totalIncome - getCircuitProgressState().sponsorPenalty);
      summary.warningLines.push(`스폰서 페널티 -${formatNumber(getCircuitProgressState().sponsorPenalty)} G`);
    }
    summary.totalIncome = Math.max(0, Math.floor(summary.totalIncome * summary.weeklyIncomeMultiplier));
    summary.fameAfter = Math.max(0, gameState.fame + summary.fameDelta);
    gameState.gold += summary.totalIncome;
    gameState.fame = summary.fameAfter;
    summary.matchCount = summary.results.length;
    pendingWeeklySummary = summary;
    activeTab = "home";
    render();
    matchAnimationState.finishCallback = openWeeklyResultsModal;
    startMatchAnimation(battlePackages);
  };

  openWeeklyResultsModal = function () {
    if (!pendingWeeklySummary) {
      return;
    }
    const resultCards = pendingWeeklySummary.results.map((result, index) => `
      <div class="result-card result-reveal" style="animation-delay:${(index * 0.25).toFixed(2)}s;">
        <div class="result-match">${result.kind === "main" ? "⚔️ 메인 경기" : "🥊 사이드 경기"} · ${result.wrestlerAName} VS ${result.wrestlerBName}</div>
        <div class="result-win">→ ${result.winnerName} 승리</div>
        <div class="result-income">→ ${result.summaryText} / ${result.finishType}</div>
        <div class="result-income">→ ${result.highlightLabel} / ${result.turnCount}턴</div>
        <div class="result-income">→ 수익 ${formatNumber(result.income)} G</div>
        <div class="result-income">→ 보상 ${result.rewardText}</div>
      </div>
    `).join("");
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">WEEK ${pendingWeeklySummary.week} 결산 보고서</h3>
          <p class="modal-subtitle">메인 경기와 사이드 경기 결과를 정리했습니다.</p>
        </div>
      </div>
      <div class="result-list">${resultCards || '<div class="placeholder-box">결과가 없습니다.</div>'}</div>
      <div class="result-summary" style="margin-top:16px;">
        <div class="result-summary-grid">
          <div class="result-summary-item"><div class="result-summary-label">주간 수익</div><div class="result-summary-value">+${formatNumber(pendingWeeklySummary.totalIncome)} G</div></div>
          <div class="result-summary-item"><div class="result-summary-label">인기도</div><div class="result-summary-value">${pendingWeeklySummary.fameBefore} → ${pendingWeeklySummary.fameAfter}</div></div>
          <div class="result-summary-item"><div class="result-summary-label">주간 티켓</div><div class="result-summary-value">+${pendingWeeklySummary.ticketReward}</div></div>
          <div class="result-summary-item"><div class="result-summary-label">재도전</div><div class="result-summary-value">${canTriggerImmediateRevenge() ? "가능" : "없음"}</div></div>
        </div>
        <div class="countdown-box" style="margin-top:14px;">
          ${(pendingWeeklySummary.bonusLines.length ? pendingWeeklySummary.bonusLines.map((line) => `<div>✅ ${line}</div>`).join("") : "<div>이번 주 추가 보너스 없음</div>")}
          ${(pendingWeeklySummary.warningLines.length ? pendingWeeklySummary.warningLines.map((line) => `<div style="color:#ffb0a7;">⚠️ ${line}</div>`).join("") : "")}
          ${(pendingWeeklySummary.injuries.length ? pendingWeeklySummary.injuries.map((entry) => `<div style="color:#ffb0a7;">🩹 ${entry.name} ${entry.weeks}주 부상</div>`).join("") : "<div>부상 발생 없음</div>")}
        </div>
        <div class="modal-actions">
          ${canTriggerImmediateRevenge() ? '<button class="modal-action-button cancel" id="immediateRevengeButton">즉시 재도전</button>' : ""}
          <button class="modal-action-button cancel" id="analysisFromSummaryButton">상대 분석</button>
          <button class="modal-action-button confirm" id="advanceWeekButton">다음 주 시작 →</button>
        </div>
      </div>
    `, { locked: true, className: "settlement-mode" });
    const revengeButton = document.getElementById("immediateRevengeButton");
    if (revengeButton) revengeButton.addEventListener("click", triggerImmediateRevenge);
    const analysisButton = document.getElementById("analysisFromSummaryButton");
    if (analysisButton) analysisButton.addEventListener("click", () => openOpponentAnalysisModal(pendingWeeklySummary.opponentId));
    const advanceButton = document.getElementById("advanceWeekButton");
    if (advanceButton) advanceButton.addEventListener("click", advanceToNextWeek);
  };

  advanceToNextWeek = function () {
    if (!pendingWeeklySummary) {
      return;
    }
    const salaryResult = applySalaryForWeek();
    const appliedTrainingGrowth = applyWeeklyTraining();
    gameState.tickets += pendingWeeklySummary.ticketReward;
    pendingWeeklySummary.results.forEach((result) => {
      if (result.wrestlerAId && result.wrestlerBId && result.winnerId) {
        gameState.matchHistory.push({
          week: pendingWeeklySummary.week,
          wrestlerAId: result.wrestlerAId,
          wrestlerBId: result.wrestlerBId,
          winnerId: result.winnerId
        });
      }
    });
    gameState.matchHistory = gameState.matchHistory.slice(-100);
    const mainResult = pendingWeeklySummary.results.find((result) => result.kind === "main");
    if (mainResult) {
      if (mainResult.winnerId === pendingWeeklySummary.mainWrestlerId) {
        gameState.totalWins += 1;
      }
      gameState.totalMatches += 1;
    }
    gameState.history.unshift({
      week: pendingWeeklySummary.week,
      matchCount: pendingWeeklySummary.matchCount,
      record: mainResult ? (mainResult.winnerId === pendingWeeklySummary.mainWrestlerId ? "메인 승리" : "메인 패배") : "경기 없음",
      income: Math.max(0, pendingWeeklySummary.totalIncome - salaryResult.totalSalary),
      hype: gameState.hype
    });
    gameState.history = gameState.history.slice(0, 20);
    decrementContracts();
    removeExpiredContracts();
    const recoveredIds = updateInjuryRecoveryForNewWeek();
    const conditionRecovery = getWeeklyConditionRecoveryAmount();
    gameState.roster.forEach((wrestler) => {
      wrestler.status = wrestler.status === "match" ? "idle" : wrestler.status;
      wrestler.condition = clamp((wrestler.condition || 0) + conditionRecovery + (wrestler.restMode ? 40 : 0), 0, 100);
      wrestler.restMode = false;
    });
    gameState.week += 1;
    gameState.weeklySchedule = createEmptyWeeklySchedule();
    syncScheduleToLegacyWeeklyCard();
    gameState.freeAgents = generateFreeAgentsForWeek();
    gameState.freeAgentsWeek = gameState.week;
    gameState.prospects = generateProspectScoutsForWeek();
    gameState.prospectsWeek = gameState.week;
    const stageUnlockMessage = checkStageUnlock();
    const championshipUnlockMessages = checkChampionshipUnlocks();
    const unlockedAchievements = checkPersistentAchievements({
      matchCount: pendingWeeklySummary.matchCount,
      totalAudience: 0
    });
    pendingWeeklySummary = null;
    closeModal(true);
    saveGameState();
    render();
    openPostAdvanceNotices({
      stageUnlockMessage,
      championshipUnlockMessages,
      appliedTrainingGrowth,
      recoveredIds,
      retirementCandidates: [],
      expiringContractIds: [],
      expiredContractNames: [],
      agedUpNames: [],
      unlockedAchievements,
      eventData: null,
      triggerEnding: false
    });
  };

  window.__RING_DYNASTY_CIRCUIT_API__ = {
    CIRCUIT_LADDER,
    getCircuitOpponents,
    estimateWinRate,
    getCircuitRewardText,
    getCircuitProgressState,
    getCircuitProgressMeta,
    getCurrentCircuitOpponent,
    getMainAssignedWrestler,
    getReadySideMatches,
    getConditionTierMeta,
    getConditionBarHtml,
    getConditionWarningText,
    getOpponentDifficultyText,
    getWeeklyConditionRecoveryAmount,
    openOpponentAnalysisModal,
    syncScheduleToLegacyWeeklyCard
  };

  TAB_CONTENT.home.mainTitle = "메인 무대";
  TAB_CONTENT.home.mainSubtitle = () => `Week ${gameState.week} · 서킷 ${getCircuitProgressMeta().progressLabel}`;
  TAB_CONTENT.home.sideTitle = "";
  TAB_CONTENT.home.sideSubtitle = "";
  TAB_CONTENT.home.mainInfo = [];
  TAB_CONTENT.cards.mainTitle = () => `⚔️ Week ${gameState.week} 경기 편성`;
  TAB_CONTENT.cards.mainSubtitle = () => `메인 경기 1회 필수 · 사이드 경기 ${getReadySideMatches().length}/2`;
  TAB_CONTENT.cards.sideTitle = "서킷 정보";
  TAB_CONTENT.cards.sideSubtitle = "상대 분석과 연승 흐름을 확인합니다.";
  TAB_CONTENT.cards.mainInfo = [
    { label: "현재 랭킹", value: () => `${getCircuitProgressState().currentRank}위` },
    { label: "다음 상대", value: () => getCurrentCircuitOpponent()?.name || "클리어" },
    { label: "가용 선수", value: () => `${getAvailableCardRoster().length}명` }
  ];
}
