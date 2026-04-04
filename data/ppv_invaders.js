if (!window.__RING_DYNASTY_PPV_INVADERS__) {
  window.__RING_DYNASTY_PPV_INVADERS__ = true;

  const circuitApi = window.__RING_DYNASTY_CIRCUIT_API__ || {};
  const PPV_INVADER_STYLE_WEIGHTS = {
    powerhouse: { power: 1.22, stamina: 1.08, technique: 0.8, charisma: 0.88, fame: 1.02 },
    technician: { power: 0.85, stamina: 1.02, technique: 1.2, charisma: 0.9, fame: 1.03 },
    showman: { power: 0.9, stamina: 0.95, technique: 0.92, charisma: 1.18, fame: 1.05 }
  };

  const PPV_INVADERS = [
    {
      id: "ppv_1_bounty_hunter",
      order: 1,
      tier: 1,
      unlockWeek: 4,
      name: "The Bounty Hunter",
      nickname: "현상금 사냥꾼",
      style: "powerhouse",
      weaknessStyle: "technician",
      total: 320,
      quote: "나는 약한 놈을 찾아다닌다. 네 단체 소문이 들리더군. 확인하러 왔다.",
      tauntOnLoss: "역시 소문만 요란했군. 다음 달에 다시 와주지.",
      reactionOnWin: "...인정한다. 넌 약하지 않다.",
      abilityName: "기본형",
      abilityDesc: "특수 능력 없음",
      reward: { tickets: 3, advancedTickets: 0, legendTickets: 0, goldMultiplier: 3, fameBonus: 30, fragments: 0, title: "PPV 챔피언" }
    },
    {
      id: "ppv_2_hitman",
      order: 2,
      tier: 1,
      unlockWeek: 8,
      name: "The Corporate Hitman",
      nickname: "기업 청부업자",
      style: "technician",
      weaknessStyle: "showman",
      total: 370,
      quote: "감정 없이 일한다. 네 선수를 부수는 것도 그냥 일이야.",
      tauntOnLoss: "예정된 결과였다. 다음 번에도 다르지 않을 거다.",
      reactionOnWin: "계약서에 없던 변수군.",
      abilityName: "냉정한 봉쇄",
      abilityDesc: "초반 10턴 동안 피니셔 게이지가 막히는 효과를 약화된 공격력으로 구현",
      reward: { tickets: 3, advancedTickets: 0, legendTickets: 0, goldMultiplier: 3.2, fameBonus: 32, fragments: 0, title: "PPV 챔피언" }
    },
    {
      id: "ppv_3_iron_rex",
      order: 3,
      tier: 1,
      unlockWeek: 12,
      name: "Iron Rex",
      nickname: "철의 렉스",
      style: "powerhouse",
      weaknessStyle: "",
      total: 430,
      quote: "약점? 그런 거 없다. 그냥 더 세게 때릴 뿐이야.",
      tauntOnLoss: "아직 부족하다. 다음 PPV에서 다시 증명해라.",
      reactionOnWin: "좋아, 오늘은 네가 더 강했다.",
      abilityName: "철벽 각성",
      abilityDesc: "약점 무시 + 전체 스탯 강화",
      reward: { tickets: 3, advancedTickets: 0, legendTickets: 0, goldMultiplier: 3.5, fameBonus: 36, fragments: 0, title: "PPV 챔피언" }
    },
    {
      id: "ppv_4_phantom",
      order: 4,
      tier: 2,
      unlockWeek: 16,
      name: "The Phantom",
      nickname: "팬텀",
      style: "technician",
      weaknessStyle: "showman",
      total: 520,
      quote: "긴 경기를 좋아하는군. 그럼 끝까지 가보지.",
      tauntOnLoss: "지치지 않는 상대가 얼마나 끔찍한지 기억해둬라.",
      reactionOnWin: "끝내 버텨냈군. 흥미롭다.",
      abilityName: "끝없는 호흡",
      abilityDesc: "스태미나 특화, 장기전 페널티 완화",
      reward: { tickets: 5, advancedTickets: 1, legendTickets: 0, goldMultiplier: 6, fameBonus: 60, fragments: 10, title: "PPV 정복자" }
    },
    {
      id: "ppv_5_destroyer",
      order: 5,
      tier: 2,
      unlockWeek: 20,
      name: "The Destroyer",
      nickname: "디스트로이어",
      style: "powerhouse",
      weaknessStyle: "technician",
      total: 590,
      quote: "한 번 쓰러뜨렸다고 끝이라 생각하지 마라.",
      tauntOnLoss: "다음엔 피니셔조차 소용없을 거다.",
      reactionOnWin: "버텨낸 건 나였지만, 끝낸 건 너였다.",
      abilityName: "파괴자의 버팀목",
      abilityDesc: "피니셔 저항을 전투력 보정과 추가 페널티로 구현",
      reward: { tickets: 5, advancedTickets: 1, legendTickets: 0, goldMultiplier: 6.5, fameBonus: 66, fragments: 10, title: "PPV 정복자" }
    },
    {
      id: "ppv_6_ghost_reaper",
      order: 6,
      tier: 2,
      unlockWeek: 24,
      name: "Ghost Reaper",
      nickname: "고스트 리퍼",
      style: "technician",
      weaknessStyle: "showman",
      total: 660,
      quote: "네 선수의 얼굴이 창백해지는군. 경기 시작도 전에 벌써 지쳤나?",
      tauntOnLoss: "압박은 시작 전에 끝났다.",
      reactionOnWin: "공포를 견뎌냈다면 다음도 버텨보지.",
      abilityName: "영혼 압박",
      abilityDesc: "경기 시작 시 우리 선수 컨디션 -20%",
      reward: { tickets: 5, advancedTickets: 1, legendTickets: 0, goldMultiplier: 7, fameBonus: 72, fragments: 10, title: "PPV 정복자" }
    },
    {
      id: "ppv_7_undying_legend",
      order: 7,
      tier: 3,
      unlockWeek: 24,
      name: "The Undying Legend",
      nickname: "불멸의 레전드",
      style: "technician",
      weaknessStyle: "showman",
      total: 850,
      quote: "...오랜만에 링에 서는군. 네가 날 쓰러뜨릴 수 있다면, 진심으로 인정하겠다.",
      tauntOnLoss: "전설은 아직 끝나지 않았다.",
      reactionOnWin: "좋다. 오늘부터 전설은 너를 기억하겠다.",
      abilityName: "불멸",
      abilityDesc: "회피/회복/광폭화를 고수치 보정으로 압축 구현",
      reward: { tickets: 0, advancedTickets: 3, legendTickets: 1, goldMultiplier: 15, fameBonus: 100, fragments: 25, title: "레전드 슬레이어" }
    }
  ];

  const ppvGuestPool = Object.create(null);

  function getDefaultInvaderState() {
    return {
      invaderIndex: 0,
      defeatedInvaderIds: [],
      totalEvents: 0,
      totalWins: 0,
      totalLosses: 0,
      consecutiveWins: 0,
      bestWinStreak: 0,
      history: [],
      fragments: {},
      advancedTickets: 0,
      legendTickets: 0,
      ownedInvaderIds: [],
      prepTreatmentIds: [],
      latestGapDelta: 0,
      longestMatchTurns: 0,
      biggestGapClear: 0,
      currentTargetId: PPV_INVADERS[0].id
    };
  }

  function sanitizeInvaderState(rawState) {
    const defaults = getDefaultInvaderState();
    const safe = rawState && typeof rawState === "object" ? rawState : {};
    return {
      ...safe,
      selectedMainEventIds: Array.isArray(safe.selectedMainEventIds) ? safe.selectedMainEventIds.filter((item) => typeof item === "string").slice(0, 2) : [],
      featuredMatchType: typeof safe.featuredMatchType === "string" ? safe.featuredMatchType : "",
      buildAppliedWeek: Number.isFinite(safe.buildAppliedWeek) ? Math.max(0, Math.floor(safe.buildAppliedWeek)) : 0,
      annualAwardBuffWeeks: Number.isFinite(safe.annualAwardBuffWeeks) ? Math.max(0, Math.floor(safe.annualAwardBuffWeeks)) : 0,
      invaderIndex: Number.isFinite(safe.invaderIndex) ? clamp(Math.floor(safe.invaderIndex), 0, PPV_INVADERS.length - 1) : defaults.invaderIndex,
      defeatedInvaderIds: Array.isArray(safe.defeatedInvaderIds) ? safe.defeatedInvaderIds.filter((id) => typeof id === "string").slice(0, PPV_INVADERS.length) : [],
      totalEvents: Number.isFinite(safe.totalEvents) ? Math.max(0, Math.floor(safe.totalEvents)) : 0,
      totalWins: Number.isFinite(safe.totalWins) ? Math.max(0, Math.floor(safe.totalWins)) : 0,
      totalLosses: Number.isFinite(safe.totalLosses) ? Math.max(0, Math.floor(safe.totalLosses)) : 0,
      consecutiveWins: Number.isFinite(safe.consecutiveWins) ? Math.max(0, Math.floor(safe.consecutiveWins)) : 0,
      bestWinStreak: Number.isFinite(safe.bestWinStreak) ? Math.max(0, Math.floor(safe.bestWinStreak)) : 0,
      history: Array.isArray(safe.history) ? safe.history.filter((entry) => entry && typeof entry === "object").slice(-24) : [],
      fragments: safe.fragments && typeof safe.fragments === "object" ? safe.fragments : {},
      advancedTickets: Number.isFinite(safe.advancedTickets) ? Math.max(0, Math.floor(safe.advancedTickets)) : 0,
      legendTickets: Number.isFinite(safe.legendTickets) ? Math.max(0, Math.floor(safe.legendTickets)) : 0,
      ownedInvaderIds: Array.isArray(safe.ownedInvaderIds) ? safe.ownedInvaderIds.filter((id) => typeof id === "string").slice(0, PPV_INVADERS.length) : [],
      prepTreatmentIds: Array.isArray(safe.prepTreatmentIds) ? safe.prepTreatmentIds.filter((id) => typeof id === "string").slice(0, 4) : [],
      latestGapDelta: Number.isFinite(safe.latestGapDelta) ? Math.floor(safe.latestGapDelta) : 0,
      longestMatchTurns: Number.isFinite(safe.longestMatchTurns) ? Math.max(0, Math.floor(safe.longestMatchTurns)) : 0,
      biggestGapClear: Number.isFinite(safe.biggestGapClear) ? Math.max(0, Math.floor(safe.biggestGapClear)) : 0,
      currentTargetId: typeof safe.currentTargetId === "string" && safe.currentTargetId ? safe.currentTargetId : defaults.currentTargetId
    };
  }

  const baseCreateDefaultState = createDefaultState;
  createDefaultState = function () {
    const state = baseCreateDefaultState();
    state.ppvState = sanitizeInvaderState(state.ppvState);
    return state;
  };

  const baseSanitizeState = sanitizeState;
  sanitizeState = function (rawState) {
    const safe = baseSanitizeState(rawState || {});
    safe.ppvState = sanitizeInvaderState(safe.ppvState);
    return safe;
  };

  function ensurePpvInvaderState() {
    gameState.ppvState = sanitizeInvaderState(gameState.ppvState);
    return gameState.ppvState;
  }

  function isPpvWeek(week = gameState.week) {
    return week % 4 === 0;
  }

  function getNextPpvWeek(week = gameState.week) {
    return isPpvWeek(week) ? week : week + (4 - (week % 4));
  }

  function getWeeksUntilInvaderPpv(week = gameState.week) {
    return getNextPpvWeek(week) - week;
  }

  function isPpvPrepWeek(week = gameState.week) {
    return getWeeksUntilInvaderPpv(week) === 1;
  }

  function getInvaderPhase(week = gameState.week) {
    if (isPpvWeek(week)) return "ppv";
    const diff = getWeeksUntilInvaderPpv(week);
    if (diff >= 1 && diff <= 3) return `build_${diff}`;
    return "normal";
  }

  function buildInvaderStats(total, style) {
    const weights = PPV_INVADER_STYLE_WEIGHTS[style] || PPV_INVADER_STYLE_WEIGHTS.powerhouse;
    const entries = Object.entries(weights);
    const weightTotal = entries.reduce((sum, [, value]) => sum + value, 0);
    const stats = {};
    let used = 0;
    entries.forEach(([key, value], index) => {
      const amount = index === entries.length - 1
        ? total - used
        : Math.max(18, Math.floor((total * value) / weightTotal));
      stats[key] = amount;
      used += amount;
    });
    return stats;
  }

  function getActiveInvader() {
    const ppvState = ensurePpvInvaderState();
    const invader = PPV_INVADERS.find((entry) => !ppvState.defeatedInvaderIds.includes(entry.id)) || PPV_INVADERS[PPV_INVADERS.length - 1];
    ppvState.currentTargetId = invader.id;
    return invader;
  }

  function getInvaderById(invaderId) {
    return PPV_INVADERS.find((entry) => entry.id === invaderId) || null;
  }

  function getInvaderPreviewInfo() {
    const invader = getActiveInvader();
    const weeksUntil = getWeeksUntilInvaderPpv();
    const ace = gameState.managementMap?.assignments?.mainEventer
      ? findWrestlerById(gameState.managementMap.assignments.mainEventer)
      : gameState.roster.slice().sort((left, right) => getWrestlerPower(right) - getWrestlerPower(left))[0];
    const aceTotal = ace ? Math.round(sumWrestlerStats(ace)) : 0;
    return {
      invader,
      weeksUntil,
      ace,
      aceTotal,
      gap: invader.total - aceTotal
    };
  }

  function sumWrestlerStats(wrestler) {
    const stats = wrestler?.stats || {};
    return (stats.power || 0) + (stats.stamina || 0) + (stats.technique || 0) + (stats.charisma || 0) + (stats.fame || 0);
  }

  function createInvaderWrestler(invader) {
    const grade = invader.tier === 3 ? "LEGEND" : invader.total >= 660 ? "S" : invader.total >= 520 ? "A" : "B";
    return createWrestler({
      id: invader.id,
      templateId: invader.id,
      name: invader.name,
      nickname: invader.nickname,
      grade,
      style: invader.style,
      alignment: "heel",
      age: invader.tier === 3 ? 41 : 31 + invader.tier,
      condition: 100,
      salary: 0,
      contractWeeks: 999,
      finisher: `${invader.nickname} Finish`,
      spriteColor: getGradeColor(grade),
      stats: buildInvaderStats(invader.total, invader.style),
      status: "match"
    });
  }

  function getConditionAdjustedStatsLocal(wrestler) {
    const meta = circuitApi.getConditionTierMeta?.(wrestler?.condition || 100) || { statMultiplier: 1 };
    return {
      power: Math.max(1, Math.round((wrestler.stats?.power || 1) * meta.statMultiplier)),
      stamina: Math.max(1, Math.round((wrestler.stats?.stamina || 1) * meta.statMultiplier)),
      technique: Math.max(1, Math.round((wrestler.stats?.technique || 1) * meta.statMultiplier)),
      charisma: Math.max(1, Math.round((wrestler.stats?.charisma || 1) * meta.statMultiplier)),
      fame: Math.max(1, Math.round((wrestler.stats?.fame || 1) * meta.statMultiplier))
    };
  }

  function buildBattleReadyWrestlerLocal(wrestler) {
    return createWrestler({
      ...structuredClone(wrestler),
      stats: getConditionAdjustedStatsLocal(wrestler)
    });
  }

  function recordWinLoss(winner, loser) {
    if (winner) recordWrestlerResult(winner, true);
    if (loser) recordWrestlerResult(loser, false);
  }

  function maybeApplyInjuryFromCondition(wrestler, injuryLines) {
    if (!wrestler || wrestler.status === "injured") {
      return;
    }
    const tier = circuitApi.getConditionTierMeta?.(wrestler.condition || 100) || { riskBonus: 0 };
    const prevention = Number(gameState.facilities?.medical?.prevention || 0);
    const injuryChance = Math.max(0, tier.riskBonus - prevention);
    if (Math.random() < injuryChance) {
      wrestler.status = "injured";
      wrestler.injuryWeeks = clamp(1 + Math.floor(Math.random() * 3), 1, 4);
      injuryLines.push({ wrestlerId: wrestler.id, name: wrestler.name, weeks: wrestler.injuryWeeks });
    }
  }

  function applyConditionLossFromBattleLocal(wrestler, battlePackage, context, won, injuryLines) {
    if (!wrestler) {
      return;
    }
    const baseLoss = context === "main" ? (won ? 25 : 40) : (won ? 15 : 25);
    const finisherHit = (battlePackage?.battleEvents || []).some((event) => event.type === "finisher" && event.defenderId === wrestler.id);
    const longMatch = (battlePackage?.battleResult?.totalTurns || 0) >= 60;
    const totalLoss = baseLoss + (finisherHit ? 10 : 0) + (longMatch ? 10 : 0);
    wrestler.condition = clamp((wrestler.condition || 100) - totalLoss, 0, 100);
    maybeApplyInjuryFromCondition(wrestler, injuryLines);
  }

  function getPpvMainAssignedWrestler() {
    const wrestlerId = gameState.managementMap?.assignments?.mainEventer || gameState.weeklySchedule?.mainMatch?.wrestlerId;
    return wrestlerId ? findWrestlerById(wrestlerId) : null;
  }

  function getPpvMainIncome(invader) {
    const baseGold = Math.max(1200, invader.total * 5);
    return Math.floor(baseGold * (invader.reward.goldMultiplier || 3));
  }

  function getPpvGapAnalysis(hero, invader) {
    const heroTotal = Math.round(sumWrestlerStats(hero));
    const gap = heroTotal - invader.total;
    const weeklyTrainingGain = 16;
    return {
      heroTotal,
      invaderTotal: invader.total,
      gap,
      projectedGap: gap + weeklyTrainingGain
    };
  }

  function applyInvaderAbilityPreBattle(invader, hero, summary) {
    const heroBattle = buildBattleReadyWrestlerLocal(hero);
    const invaderBattle = createInvaderWrestler(invader);
    const abilityLines = [];
    if (ensurePpvInvaderState().prepTreatmentIds.includes(hero.id)) {
      hero.condition = clamp((hero.condition || 0) + 10, 0, 100);
      heroBattle.condition = hero.condition;
      heroBattle.stats = getConditionAdjustedStatsLocal(hero);
      abilityLines.push("PPV 집중 관리 효과: 메인 선수 컨디션 +10%");
    }
    switch (invader.id) {
      case "ppv_2_hitman":
        heroBattle.stats.power = Math.max(1, Math.round(heroBattle.stats.power * 0.88));
        heroBattle.stats.technique = Math.max(1, Math.round(heroBattle.stats.technique * 0.88));
        abilityLines.push("⚡ The Corporate Hitman의 특수 능력 발동! 초반 피니셔 봉쇄");
        break;
      case "ppv_3_iron_rex":
        Object.keys(invaderBattle.stats).forEach((key) => {
          invaderBattle.stats[key] = Math.max(1, Math.round(invaderBattle.stats[key] * 1.12));
        });
        abilityLines.push("⚡ Iron Rex의 특수 능력 발동! 약점이 드러나지 않습니다");
        break;
      case "ppv_4_phantom":
        invaderBattle.stats.stamina = clamp(Math.round(invaderBattle.stats.stamina * 1.25), 1, 100);
        abilityLines.push("⚡ The Phantom의 특수 능력 발동! 끝없는 회복");
        break;
      case "ppv_5_destroyer":
        Object.keys(invaderBattle.stats).forEach((key) => {
          invaderBattle.stats[key] = Math.max(1, Math.round(invaderBattle.stats[key] * 1.08));
        });
        abilityLines.push("⚡ The Destroyer의 특수 능력 발동! 피니셔 저항");
        break;
      case "ppv_6_ghost_reaper":
        hero.condition = clamp((hero.condition || 0) - 20, 0, 100);
        heroBattle.condition = hero.condition;
        heroBattle.stats = getConditionAdjustedStatsLocal(hero);
        abilityLines.push("⚡ Ghost Reaper의 특수 능력 발동! 경기 시작 전 컨디션 -20%");
        break;
      case "ppv_7_undying_legend":
        Object.keys(invaderBattle.stats).forEach((key) => {
          invaderBattle.stats[key] = Math.max(1, Math.round(invaderBattle.stats[key] * 1.18));
        });
        abilityLines.push("⚡ The Undying Legend의 특수 능력 발동! 불멸의 오라");
        break;
      default:
        break;
    }
    summary.ppvAbilityLines.push(...abilityLines);
    return { heroBattle, invaderBattle };
  }

  function applyInvaderAbilityPostBattle(invader, hero, battlePackage, summary) {
    const result = battlePackage?.battleResult || {};
    if (invader.id === "ppv_5_destroyer" && result.winnerId === hero.id && result.winnerStats?.finisherUsed) {
      summary.ppvAbilityLines.push("The Destroyer가 피니셔를 버텨냈다! 승부는 더 거칠어졌다.");
      hero.condition = clamp((hero.condition || 0) - 10, 0, 100);
    }
    if (invader.id === "ppv_7_undying_legend") {
      if (result.totalTurns >= 25) {
        summary.ppvAbilityLines.push("불멸의 레전드가 전투 내내 체력을 회복하며 버텼다.");
      }
      if (result.winnerId === hero.id && result.winnerStats?.finisherUsed) {
        summary.ppvAbilityLines.push("전설이 한 차례 피니셔를 흘려냈지만, 끝내 쓰러졌다.");
      }
    }
  }

  function runManagedSideMatch(slot, summary, battlePackages, incomeMultiplier = 1) {
    const left = findWrestlerById(slot.wrestlerAId);
    const right = findWrestlerById(slot.wrestlerBId);
    if (!left || !right) {
      return;
    }
    left.status = "match";
    right.status = right.isGuest ? "match" : "match";
    const battlePackage = runBattleSimulation(buildBattleReadyWrestlerLocal(left), buildBattleReadyWrestlerLocal(right), {
      startingHype: clamp(gameState.hype, 0, 100)
    });
    const winner = battlePackage.battleResult.winnerId === left.id ? left : right;
    const loser = winner.id === left.id ? right : left;
    recordWinLoss(winner.isGuest ? null : winner, loser.isGuest ? null : loser);
    applyConditionLossFromBattleLocal(left, battlePackage, "side", winner.id === left.id, summary.injuries);
    if (!right.isGuest) {
      applyConditionLossFromBattleLocal(right, battlePackage, "side", winner.id === right.id, summary.injuries);
    }
    const baseIncome = Math.max(220, Math.floor((((circuitApi.getCurrentCircuitOpponent?.()?.reward?.gold) || 900) * 0.4) * incomeMultiplier));
    const matchIncome = Math.floor(baseIncome + (battlePackage.battleResult.hypeGenerated * 8));
    summary.totalIncome += matchIncome;
    summary.results.push({
      kind: "side",
      wrestlerAName: left.name,
      wrestlerBName: right.name,
      wrestlerAId: left.id,
      wrestlerBId: right.id,
      winnerName: winner.name,
      winnerId: winner.id,
      income: matchIncome,
      battleResult: battlePackage.battleResult,
      finishType: battlePackage.battleResult.finishType,
      highlightLabel: getHighlightLabel(battlePackage.battleResult.highlight),
      turnCount: battlePackage.battleResult.totalTurns,
      rewardText: "랭킹 변동 없음",
      summaryText: "사이드 경기"
    });
    battlePackages.push(battlePackage);
    left.status = left.status === "injured" ? "injured" : "idle";
  }

  function applyPpvCompanyBonuses(summary) {
    const assignments = gameState.managementMap?.assignments || {};
    let incomeBonus = 0;
    let fameBonus = 0;
    (assignments.franchiseStars || []).forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (!wrestler) {
        return;
      }
      const multiplier = isPpvWeek(summary.week) ? 2 : 1;
      incomeBonus += (wrestler.stats?.charisma || 0) * 15 * multiplier;
      fameBonus += Math.max(1, Math.floor((wrestler.stats?.fame || 0) / 10));
    });
    const mediaWrestler = assignments.media ? findWrestlerById(assignments.media) : null;
    if (mediaWrestler) {
      summary.results.forEach((result) => {
        if (result.kind === "side") {
          const bonus = Math.floor(result.income * 0.3);
          result.income += bonus;
          summary.totalIncome += bonus;
        }
      });
      summary.bonusLines.push(`${mediaWrestler.name}의 미디어 효과로 사이드 수익 ×1.3`);
    }
    if (incomeBonus > 0) {
      summary.totalIncome += incomeBonus;
      summary.bonusLines.push(`간판 슬롯 보너스 +${formatNumber(incomeBonus)} G`);
    }
    if (fameBonus > 0) {
      summary.fameDelta += fameBonus;
    }
  }

  function createBaseWeeklySummary(label) {
    return {
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
      mainWrestlerId: "",
      opponentId: "",
      revengeUsed: false,
      availableRevengeSlots: 0,
      weeklyIncomeMultiplier: 1,
      ppvAbilityLines: [],
      ppvModeLabel: label
    };
  }

  function runPpvPreparationWeek() {
    const summary = createBaseWeeklySummary("PPV 준비 주간");
    const battlePackages = [];
    circuitApi.getReadySideMatches?.().forEach((slot) => {
      runManagedSideMatch(slot, summary, battlePackages, 1);
    });
    applyPpvCompanyBonuses(summary);
    summary.fameAfter = Math.max(0, gameState.fame + summary.fameDelta);
    gameState.gold += summary.totalIncome;
    gameState.fame = summary.fameAfter;
    summary.matchCount = summary.results.length;
    summary.ppvPreparationWeek = true;
    summary.bonusLines.push("다음 주 PPV를 앞두고 메인 경기는 건너뛰었습니다.");
    pendingWeeklySummary = summary;
    activeTab = "home";
    render();
    if (battlePackages.length) {
      matchAnimationState.finishCallback = openWeeklyResultsModal;
      startMatchAnimation(battlePackages);
    } else {
      openWeeklyResultsModal();
    }
  }

  function runPpvInvaderWeek() {
    const invader = getActiveInvader();
    const hero = getPpvMainAssignedWrestler();
    if (!hero) {
      window.alert("PPV 주간에는 메인 이벤터를 반드시 배치해야 합니다.");
      return;
    }
    const summary = createBaseWeeklySummary(`PPV 침략자 - ${invader.name}`);
    const battlePackages = [];
    summary.mainWrestlerId = hero.id;
    summary.opponentId = invader.id;
    summary.ppvInvader = invader;
    summary.ppvGap = getPpvGapAnalysis(hero, invader);
    summary.ppvDialogue = invader.quote;
    const { heroBattle, invaderBattle } = applyInvaderAbilityPreBattle(invader, hero, summary);
    hero.status = "match";
    const battlePackage = runBattleSimulation(heroBattle, invaderBattle, {
      startingHype: clamp(gameState.hype + 18, 0, 100),
      matchType: ""
    });
    applyInvaderAbilityPostBattle(invader, hero, battlePackage, summary);
    const won = battlePackage.battleResult.winnerId === hero.id;
    summary.mainMatchLost = !won;
    summary.mainMatchCompleted = true;
    applyConditionLossFromBattleLocal(hero, battlePackage, "main", won, summary.injuries);
    recordWinLoss(won ? hero : null, won ? null : hero);
    const mainIncome = won ? getPpvMainIncome(invader) : 0;
    summary.totalIncome += mainIncome;
    summary.results.push({
      kind: "main",
      wrestlerAName: hero.name,
      wrestlerBName: invader.name,
      wrestlerAId: hero.id,
      wrestlerBId: invader.id,
      winnerName: won ? hero.name : invader.name,
      winnerId: won ? hero.id : invader.id,
      income: mainIncome,
      battleResult: battlePackage.battleResult,
      finishType: battlePackage.battleResult.finishType,
      highlightLabel: getHighlightLabel(battlePackage.battleResult.highlight),
      turnCount: battlePackage.battleResult.totalTurns,
      rewardText: won ? `${invader.reward.tickets ? `일반권 ${invader.reward.tickets}` : ""}${invader.reward.advancedTickets ? ` / 고급권 ${invader.reward.advancedTickets}` : ""}${invader.reward.legendTickets ? ` / 레전드권 ${invader.reward.legendTickets}` : ""}` : "용기 보상 일반권 1장",
      summaryText: won ? "PPV 침략자 격파" : "PPV 침략자 패배"
    });
    hero.status = hero.status === "injured" ? "injured" : "idle";
    battlePackages.push(battlePackage);
    circuitApi.getReadySideMatches?.().forEach((slot) => {
      runManagedSideMatch(slot, summary, battlePackages, 1.15);
    });
    applyPpvCompanyBonuses(summary);
    if (won) {
      summary.ticketReward = invader.reward.tickets || 0;
      summary.ppvAdvancedTicketReward = invader.reward.advancedTickets || 0;
      summary.ppvLegendTicketReward = invader.reward.legendTickets || 0;
      summary.ppvFragmentReward = invader.reward.fragments || 0;
      summary.fameDelta += invader.reward.fameBonus || 0;
      summary.bonusLines.push(`${invader.name} 격파! ${invader.reward.title} 획득`);
      if (ensurePpvInvaderState().consecutiveWins === 1) {
        summary.ticketReward += 1;
        summary.bonusLines.push("PPV 2연속 격파 보너스: 일반 뽑기권 +1");
      } else if (ensurePpvInvaderState().consecutiveWins >= 2) {
        summary.ppvAdvancedTicketReward += 1;
        summary.bonusLines.push("PPV 3연속 격파 보너스: 고급 뽑기권 +1");
      }
    } else {
      summary.ticketReward = 1;
      summary.ppvAdvancedTicketReward = 0;
      summary.ppvLegendTicketReward = 0;
      summary.ppvFragmentReward = 0;
      summary.fameDelta += 5;
      summary.warningLines.push(invader.tauntOnLoss);
      summary.bonusLines.push("용기 있는 도전 보상: 일반 뽑기권 1장");
    }
    summary.fameAfter = Math.max(0, gameState.fame + summary.fameDelta);
    gameState.gold += Math.max(0, summary.totalIncome);
    gameState.fame = summary.fameAfter;
    summary.matchCount = summary.results.length;
    pendingWeeklySummary = summary;
    activeTab = "home";
    render();
    matchAnimationState.finishCallback = openWeeklyResultsModal;
    startMatchAnimation(battlePackages);
  }

  const baseStartWeeklyMatches = startWeeklyMatches;
  startWeeklyMatches = function () {
    ensurePpvInvaderState();
    const phase = getInvaderPhase();
    if (phase === "build_1") {
      runPpvPreparationWeek();
      return;
    }
    if (phase === "ppv") {
      runPpvInvaderWeek();
      return;
    }
    baseStartWeeklyMatches();
  };

  const baseOpenWeeklyResultsModal = openWeeklyResultsModal;
  openWeeklyResultsModal = function () {
    if (!pendingWeeklySummary?.ppvInvader) {
      baseOpenWeeklyResultsModal();
      return;
    }
    const summary = pendingWeeklySummary;
    const invader = summary.ppvInvader;
    const gapInfo = summary.ppvGap;
    const won = !summary.mainMatchLost;
    const lines = [
      `내 에이스 스탯: ${gapInfo.heroTotal}`,
      `상대 스탯: ${gapInfo.invaderTotal}`,
      `차이: ${gapInfo.gap >= 0 ? "+" : ""}${gapInfo.gap}`
    ];
    if (!won) {
      lines.push(`훈련 4주 시 예상 차이: ${gapInfo.projectedGap >= 0 ? "+" : ""}${gapInfo.projectedGap}`);
      lines.push("B급 이상 선수 영입 시 격차를 빠르게 줄일 수 있습니다.");
    }
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">${won ? `${invader.name} 격파!` : `${invader.name}에게 패배`}</h3>
          <p class="modal-subtitle">${summary.ppvDialogue}</p>
        </div>
      </div>
      <div class="story-banner ppv-night"></div>
      <div class="result-summary" style="margin-top:14px;">
        <div class="result-summary-grid">
          <div class="result-summary-item"><div class="result-summary-label">PPV 수익</div><div class="result-summary-value">+${formatNumber(summary.totalIncome)} G</div></div>
          <div class="result-summary-item"><div class="result-summary-label">인기도</div><div class="result-summary-value">${summary.fameBefore} → ${summary.fameAfter}</div></div>
          <div class="result-summary-item"><div class="result-summary-label">일반 뽑기권</div><div class="result-summary-value">+${summary.ticketReward}</div></div>
          <div class="result-summary-item"><div class="result-summary-label">고급 / 레전드권</div><div class="result-summary-value">+${summary.ppvAdvancedTicketReward || 0} / +${summary.ppvLegendTicketReward || 0}</div></div>
        </div>
        <div class="result-summary-item" style="margin-top:12px;line-height:1.8;">
          <div class="result-summary-label">격차 분석</div>
          <div>${lines.map((line) => `<div>${line}</div>`).join("")}</div>
        </div>
        <div class="result-summary-item" style="margin-top:12px;line-height:1.8;">
          <div class="result-summary-label">특수 능력 / 보상</div>
          <div>${(summary.ppvAbilityLines.length ? summary.ppvAbilityLines : ["특수 능력 없음"]).map((line) => `<div>${line}</div>`).join("")}</div>
          <div style="margin-top:8px;">${summary.bonusLines.map((line) => `<div>✅ ${line}</div>`).join("")}</div>
          ${summary.warningLines.length ? `<div style="margin-top:8px;color:#ffb0a7;">${summary.warningLines.map((line) => `<div>⚠️ ${line}</div>`).join("")}</div>` : ""}
        </div>
        <div class="modal-actions">
          <button class="modal-action-button cancel" id="analysisFromSummaryButton">상대 분석</button>
          <button class="modal-action-button confirm" id="advanceWeekButton">다음 주 시작 →</button>
        </div>
      </div>
    `, { locked: true, className: "settlement-mode ppv-mode" });
    document.getElementById("analysisFromSummaryButton")?.addEventListener("click", () => window.alert(`${invader.name}\n${invader.abilityName}\n${invader.abilityDesc}\n약점 스타일: ${invader.weaknessStyle ? getStyleMeta(invader.weaknessStyle).label : "없음"}`));
    document.getElementById("advanceWeekButton")?.addEventListener("click", advanceToNextWeek);
  };

  const baseAdvanceToNextWeek = advanceToNextWeek;
  advanceToNextWeek = function () {
    if (pendingWeeklySummary?.ppvPreparationWeek) {
      ensurePpvInvaderState().prepTreatmentIds = (gameState.managementMap?.assignments?.treatment || []).filter(Boolean);
    }
    if (pendingWeeklySummary?.ppvInvader) {
      const ppvState = ensurePpvInvaderState();
      const invader = pendingWeeklySummary.ppvInvader;
      const won = !pendingWeeklySummary.mainMatchLost;
      ppvState.totalEvents += 1;
      if (won) {
        ppvState.totalWins += 1;
        ppvState.consecutiveWins += 1;
        ppvState.bestWinStreak = Math.max(ppvState.bestWinStreak, ppvState.consecutiveWins);
        if (!ppvState.defeatedInvaderIds.includes(invader.id)) {
          ppvState.defeatedInvaderIds.push(invader.id);
        }
        ppvState.fragments[invader.id] = Math.max(0, Math.floor(ppvState.fragments[invader.id] || 0) + (pendingWeeklySummary.ppvFragmentReward || 0));
        ppvState.advancedTickets += pendingWeeklySummary.ppvAdvancedTicketReward || 0;
        ppvState.legendTickets += pendingWeeklySummary.ppvLegendTicketReward || 0;
        ppvState.currentTargetId = (PPV_INVADERS.find((entry) => !ppvState.defeatedInvaderIds.includes(entry.id)) || invader).id;
        if (!gameState.legacy.titles.includes(invader.reward.title)) {
          gameState.legacy.titles.push(invader.reward.title);
        }
        if (invader.id === "ppv_7_undying_legend" && !gameState.legacy.titles.includes("레전드 슬레이어")) {
          gameState.legacy.titles.push("레전드 슬레이어");
        }
      } else {
        ppvState.totalLosses += 1;
        ppvState.consecutiveWins = 0;
        const ace = getPpvMainAssignedWrestler();
        if (ace) {
          ace.stats.fame = clamp((ace.stats?.fame || 0) + 5, 1, getAdjustedStatCap(ace));
        }
      }
      const mainTurns = pendingWeeklySummary.results.find((entry) => entry.kind === "main")?.turnCount || 0;
      ppvState.longestMatchTurns = Math.max(ppvState.longestMatchTurns, mainTurns);
      if (won && pendingWeeklySummary.ppvGap.gap < 0) {
        ppvState.biggestGapClear = Math.max(ppvState.biggestGapClear, Math.abs(pendingWeeklySummary.ppvGap.gap));
      }
      ppvState.history.push({
        week: pendingWeeklySummary.week,
        invaderId: invader.id,
        invaderName: invader.name,
        win: won,
        turns: mainTurns,
        gap: pendingWeeklySummary.ppvGap.gap
      });
      ppvState.history = ppvState.history.slice(-24);
      ppvState.prepTreatmentIds = [];
    }
    baseAdvanceToNextWeek();
  };

  function injectPpvBannerIntoHome() {
    const preview = getInvaderPreviewInfo();
    const phase = getInvaderPhase();
    if (phase === "normal") {
      return;
    }
    const tierLabel = preview.invader.tier === 1 ? "강력한 도전자" : preview.invader.tier === 2 ? "전설급 침략자" : "레전드 침략자";
    const styleWeakness = preview.invader.weaknessStyle ? getStyleMeta(preview.invader.weaknessStyle).label : "없음";
    const extraInfo = phase === "build_2"
      ? `<div>정보 입수: ${preview.invader.name}의 힘은 ${buildInvaderStats(preview.invader.total, preview.invader.style).power}입니다</div>`
      : phase === "build_1"
        ? `<div>정보 입수: 약점 스타일은 ${styleWeakness}</div><div>이번 주는 준비 주간입니다. 메인 경기는 쉬고 컨디션을 정비하세요.</div>`
        : `<div>입장 대사: ${preview.invader.quote}</div>`;
    mainDynamicContentEl.insertAdjacentHTML("afterbegin", `
      <div class="countdown-box" style="margin-bottom:14px;border-color:${phase === "ppv" ? "#f1c40f" : "rgba(231,76,60,0.5)"};background:${phase === "ppv" ? "rgba(31,24,10,0.92)" : "rgba(38,12,12,0.88)"};">
        <div style="font-weight:700;margin-bottom:6px;">${phase === "ppv" ? `⚡ PPV 침략자 - ${preview.invader.name}` : `⚠️ PPV까지 ${preview.weeksUntil}주`}</div>
        <div>${preview.invader.name} / ${preview.invader.nickname}</div>
        <div>${tierLabel} · 예상 전력 ${preview.invader.total}</div>
        <div>현재 에이스: ${preview.ace ? `${preview.ace.name} (${preview.aceTotal})` : "미배치"} / 차이 ${preview.gap >= 0 ? "+" : ""}${preview.gap}</div>
        ${extraInfo}
      </div>
    `);
  }

  function injectPpvInfoIntoManagement() {
    const phase = getInvaderPhase();
    if (phase === "normal" || activeTab === "home" || !mainDynamicContentEl.querySelector(".management-map-shell")) {
      return;
    }
    const invader = getActiveInvader();
    mainDynamicContentEl.insertAdjacentHTML("afterbegin", `
      <div class="countdown-box" style="margin-bottom:14px;border-color:${phase === "ppv" ? "#e74c3c" : "#f39c12"};">
        <div style="font-weight:700;margin-bottom:6px;">${phase === "ppv" ? `⚡ PPV - ${invader.name}` : phase === "build_1" ? "다음 주 PPV! 메인 슬롯 준비 주간" : `${getWeeksUntilInvaderPpv()}주 후 PPV`}</div>
        <div>${invader.nickname} · ${invader.abilityName}</div>
        <div>${phase === "build_1" ? "이번 주는 서킷 메인 경기가 없습니다. 휴식/치료/특훈 위주로 배치하세요." : invader.abilityDesc}</div>
      </div>
    `);
    const mainSlot = mainDynamicContentEl.querySelector('.management-slot[data-slot-type="mainEventer"]');
    if (mainSlot && phase === "ppv") {
      mainSlot.style.borderColor = "#e74c3c";
      mainSlot.style.boxShadow = "0 0 0 1px rgba(231,76,60,0.32), 0 0 16px rgba(231,76,60,0.2)";
    }
  }

  const baseRenderHomeMainContent = renderHomeMainContent;
  renderHomeMainContent = function () {
    baseRenderHomeMainContent();
    injectPpvBannerIntoHome();
  };

  const baseRenderCardsMainContent = renderCardsMainContent;
  renderCardsMainContent = function () {
    baseRenderCardsMainContent();
    injectPpvInfoIntoManagement();
  };

  const baseRenderRosterMainContent = renderRosterMainContent;
  renderRosterMainContent = function () {
    baseRenderRosterMainContent();
    injectPpvInfoIntoManagement();
  };

  function decoratePpvManagementSidePanel() {
    const phase = getInvaderPhase();
    if (!sideListEl || !["build_1", "build_2", "build_3", "ppv"].includes(phase)) {
      return;
    }
    const invader = getActiveInvader();
    const startButton = sideListEl.querySelector('[data-action="start-managed-week"]');
    if (startButton && phase === "build_1") {
      startButton.disabled = !isCurrentWeekConfirmed();
      startButton.textContent = "준비 주간 진행";
    } else if (startButton && phase === "ppv") {
      startButton.textContent = "PPV 시작";
    }
    sideListEl.insertAdjacentHTML("afterbegin", `
      <div class="side-card" style="border-color:${phase === "ppv" ? "#e74c3c" : "#f39c12"};">
        <div class="side-card-title">${phase === "ppv" ? "PPV 당일" : phase === "build_1" ? "PPV 직전 주" : "PPV 빌드업"}</div>
        <div class="side-card-desc">${invader.name}<br>${phase === "build_1" ? "이번 주는 메인 경기가 비활성화됩니다." : phase === "ppv" ? "서킷은 잠시 멈추고 침략자가 찾아옵니다." : invader.abilityDesc}</div>
      </div>
    `);
  }

  const baseRenderCardsSidePanel = renderCardsSidePanel;
  renderCardsSidePanel = function () {
    baseRenderCardsSidePanel();
    decoratePpvManagementSidePanel();
  };

  const baseRenderFreeAgentsPanel = renderFreeAgentsPanel;
  renderFreeAgentsPanel = function () {
    baseRenderFreeAgentsPanel();
    decoratePpvManagementSidePanel();
  };

  const baseRenderHomeSidePanel = renderHomeSidePanel;
  renderHomeSidePanel = function () {
    baseRenderHomeSidePanel();
    const phase = getInvaderPhase();
    if (phase === "normal") {
      return;
    }
    const invader = getActiveInvader();
    sideListEl.insertAdjacentHTML("afterbegin", `
      <div class="side-card" style="border-color:${phase === "ppv" ? "#f1c40f" : "#e67e22"};">
        <div class="side-card-title">PPV 침략자</div>
        <div class="side-card-desc">${invader.name}<br>${invader.abilityName}<br>${phase === "ppv" ? "오늘 밤 침략자가 메인 경기를 장악합니다." : `${getWeeksUntilInvaderPpv()}주 후 침략자 도착`}</div>
      </div>
    `);
  };

  function recruitInvader(invaderId, method) {
    const ppvState = ensurePpvInvaderState();
    const invader = getInvaderById(invaderId);
    if (!invader || ppvState.ownedInvaderIds.includes(invaderId)) {
      return;
    }
    if (method === "fragments") {
      if ((ppvState.fragments[invaderId] || 0) < 25) {
        window.alert("침략자 조각이 부족합니다.");
        return;
      }
      ppvState.fragments[invaderId] -= 25;
    } else {
      if (ppvState.advancedTickets < 5) {
        window.alert("고급 뽑기권이 부족합니다.");
        return;
      }
      ppvState.advancedTickets -= 5;
    }
    addRosterMember(createWrestler({
      ...createInvaderWrestler(invader),
      id: createWrestlerId("w"),
      templateId: invader.id,
      status: "idle",
      condition: 100
    }));
    ppvState.ownedInvaderIds.push(invaderId);
    renderActiveTab();
    saveGameState();
  }

  const baseRenderRecordsMainContent = renderRecordsMainContent;
  renderRecordsMainContent = function () {
    baseRenderRecordsMainContent();
    const ppvState = ensurePpvInvaderState();
    const rows = ppvState.history.slice().reverse().map((entry) => `<tr><td>Week ${entry.week}</td><td>${entry.invaderName}</td><td>${entry.win ? "승리" : "패배"}</td><td>${entry.turns}턴</td><td>${entry.gap >= 0 ? "+" : ""}${entry.gap}</td></tr>`).join("");
    const currentTarget = getActiveInvader();
    const hallRows = PPV_INVADERS.map((invader) => {
      const cleared = ppvState.defeatedInvaderIds.includes(invader.id);
      const recruitable = cleared && !ppvState.ownedInvaderIds.includes(invader.id);
      return `
        <tr>
          <td>${cleared ? "✅" : currentTarget.id === invader.id ? "❌" : "ㆍ"}</td>
          <td>${invader.name}</td>
          <td>${cleared ? `격파 완료` : currentTarget.id === invader.id ? "도전 중" : "잠금"}</td>
          <td>${ppvState.fragments[invader.id] || 0}/25</td>
          <td>${recruitable ? `<button class="management-mini-button" data-action="recruit-invader" data-invader-id="${invader.id}" data-method="fragments">조각 영입</button><button class="management-mini-button" data-action="recruit-invader" data-invader-id="${invader.id}" data-method="tickets">고급권 영입</button>` : "-"}</td>
        </tr>
      `;
    }).join("");
    mainDynamicContentEl.insertAdjacentHTML("beforeend", `
      <div class="section-heading"><div><h3>⚡ PPV 명예의 전당</h3><p>총 ${ppvState.totalEvents}회 · ${ppvState.totalWins}승 ${ppvState.totalLosses}패</p></div></div>
      <div class="history-table-wrap">
        <table class="history-table">
          <thead><tr><th>주차</th><th>침략자</th><th>결과</th><th>턴</th><th>격차</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5">아직 PPV 기록이 없습니다.</td></tr>'}</tbody>
        </table>
      </div>
      <div class="history-table-wrap" style="margin-top:14px;">
        <table class="history-table">
          <thead><tr><th>상태</th><th>침략자</th><th>진행</th><th>조각</th><th>영입</th></tr></thead>
          <tbody>${hallRows}</tbody>
        </table>
      </div>
    `);
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="recruit-invader"]')).forEach((button) => {
      button.addEventListener("click", () => recruitInvader(button.dataset.invaderId, button.dataset.method));
    });
  };

  const baseRenderRecordsSidePanel = renderRecordsSidePanel;
  renderRecordsSidePanel = function () {
    baseRenderRecordsSidePanel();
    const ppvState = ensurePpvInvaderState();
    const currentTarget = getActiveInvader();
    sideListEl.insertAdjacentHTML("beforeend", `
      <div class="side-card">
        <div class="side-card-title">PPV 자원</div>
        <div class="side-card-desc">일반 연속 승리 ${ppvState.consecutiveWins}<br>고급 뽑기권 ${ppvState.advancedTickets}장 / 레전드권 ${ppvState.legendTickets}장</div>
      </div>
      <div class="side-card">
        <div class="side-card-title">현재 침략자</div>
        <div class="side-card-desc">${currentTarget.name}<br>${currentTarget.abilityName}<br>최장 경기 ${ppvState.longestMatchTurns}턴 / 최대 격차 극복 ${ppvState.biggestGapClear}</div>
      </div>
    `);
  };
}
