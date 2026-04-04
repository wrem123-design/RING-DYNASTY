if (!window.__RING_DYNASTY_MANAGEMENT_MAP__) {
  window.__RING_DYNASTY_MANAGEMENT_MAP__ = true;

  const circuitApi = window.__RING_DYNASTY_CIRCUIT_API__ || {};
  const TRAINING_STAT_OPTIONS = ["power", "stamina", "technique", "charisma"];
  const TRAINING_STAT_LABELS = {
    power: "힘",
    stamina: "체력",
    technique: "기술",
    charisma: "카리스마"
  };
  const SLOT_ICONS = {
    mainEventer: "⚔️",
    sideFighters: "🥊",
    franchiseStars: "⭐",
    media: "🎙",
    training: "🏋️",
    specialTraining: "🔥",
    coach: "🧠",
    rest: "🛌",
    treatment: "🩹"
  };
  const SIDE_SLOT_LEVELS = {
    1: { slots: 1, cost: 0, label: "기본" },
    2: { slots: 2, cost: 1500, label: "확장 I" },
    3: { slots: 3, cost: 4000, label: "확장 II" }
  };
  const REST_LEVELS = {
    1: { slots: 2, recovery: 20, cost: 0 },
    2: { slots: 3, recovery: 28, cost: 800 },
    3: { slots: 4, recovery: 35, cost: 2000 },
    4: { slots: 5, recovery: 45, cost: 5000 }
  };
  const TREATMENT_LEVELS = {
    1: { slots: 1, healWeeks: 1, conditionBonus: 15, cost: 0 },
    2: { slots: 2, healWeeks: 2, conditionBonus: 15, cost: 1500 }
  };
  const SIDE_GUEST_NAMES = [
    ["Milo Rush", "신예 순회자"],
    ["Gage Rook", "주말 행사꾼"],
    ["Tony Vale", "거리의 베테랑"],
    ["Axel Noon", "순회 흥행꾼"],
    ["Rio Striker", "도전자"],
    ["Kai Mercer", "대타 파이터"]
  ];

  const guestPool = Object.create(null);
  const dragState = {
    wrestlerId: "",
    pointerId: null,
    ghost: null,
    sourceCard: null,
    targetSlot: null,
    active: false,
    touchTimer: null,
    originX: 0,
    originY: 0,
    touchPending: false
  };

  const baseFindWrestlerById = findWrestlerById;
  findWrestlerById = function (wrestlerId) {
    return baseFindWrestlerById(wrestlerId) || guestPool[wrestlerId] || null;
  };

  const baseCreateDefaultState = createDefaultState;
  createDefaultState = function () {
    const state = baseCreateDefaultState();
    state.managementMap = sanitizeManagementMap(null, state);
    return state;
  };

  const baseSanitizeState = sanitizeState;
  sanitizeState = function (rawState) {
    const safe = baseSanitizeState(rawState || {});
    safe.managementMap = sanitizeManagementMap(rawState?.managementMap, safe);
    return safe;
  };

  createEmptyWeeklySchedule = function () {
    return {
      mainMatch: {
        wrestlerId: null,
        forfeit: false
      },
      sideMatches: [createEmptySideMatch(0), createEmptySideMatch(1), createEmptySideMatch(2)]
    };
  };

  sanitizeWeeklySchedule = function (rawWeeklySchedule, rawWeeklyCard = []) {
    const defaults = createEmptyWeeklySchedule();
    const mainCardFallback = Array.isArray(rawWeeklyCard) ? rawWeeklyCard.find((slot) => slot?.wrestlerAId || slot?.wrestlerBId) : null;
    const mainMatch = rawWeeklySchedule?.mainMatch && typeof rawWeeklySchedule.mainMatch === "object"
      ? rawWeeklySchedule.mainMatch
      : {};
    const sideMatches = Array.isArray(rawWeeklySchedule?.sideMatches)
      ? rawWeeklySchedule.sideMatches
      : [];

    return {
      mainMatch: {
        wrestlerId: typeof mainMatch.wrestlerId === "string"
          ? mainMatch.wrestlerId
          : (typeof mainCardFallback?.wrestlerAId === "string" ? mainCardFallback.wrestlerAId : null),
        forfeit: Boolean(mainMatch.forfeit)
      },
      sideMatches: defaults.sideMatches.map((baseSlot, index) => {
        const rawSlot = sideMatches[index]
          || (Array.isArray(rawWeeklyCard) ? rawWeeklyCard[index + 1] : null)
          || {};
        return {
          id: baseSlot.id,
          wrestlerAId: typeof rawSlot.wrestlerAId === "string" ? rawSlot.wrestlerAId : null,
          wrestlerBId: typeof rawSlot.wrestlerBId === "string" ? rawSlot.wrestlerBId : null,
          mode: rawSlot.mode === "revenge" ? "revenge" : "free",
          opponentId: typeof rawSlot.opponentId === "string" ? rawSlot.opponentId : ""
        };
      })
    };
  };

  function getBaseManagementMap() {
    return {
      confirmedWeek: 0,
      forfeitMain: false,
      lastWarnings: [],
      lastAdvanceNotes: [],
      assignments: {
        mainEventer: null,
        sideFighters: [null],
        franchiseStars: [null],
        media: null,
        training: [{ wrestlerId: null, statKey: "power" }],
        specialTraining: [{ wrestlerId: null, statKey: "power" }],
        coach: [null],
        rest: [null, null],
        treatment: [null]
      },
      upgrades: {
        sideFightLevel: 1,
        restLevel: 1,
        treatmentLevel: 1,
        specialTrainingUnlocked: false,
        coachUnlocked: false
      },
      mainEventerHistory: [],
      sideGuests: {}
    };
  }

  function getSlotCapacities(state = gameState) {
    const map = state.managementMap || getBaseManagementMap();
    const sideFightLevel = clamp(Number(map.upgrades?.sideFightLevel || 1), 1, 3);
    const restLevel = clamp(Number(map.upgrades?.restLevel || 1), 1, 4);
    const treatmentLevel = clamp(Number(map.upgrades?.treatmentLevel || 1), 1, 2);
    const gymLevel = clamp(Number(state.facilities?.gym?.level || 1), 1, 3);
    const prStudioLevel = clamp(Number(state.facilities?.prStudio?.level || 0), 0, 3);
    return {
      mainEventer: 1,
      sideFighters: SIDE_SLOT_LEVELS[sideFightLevel].slots,
      franchiseStars: prStudioLevel >= 2 ? 2 : 1,
      media: 1,
      training: gymLevel,
      specialTraining: map.upgrades?.specialTrainingUnlocked && gymLevel >= 3 ? 1 : 0,
      coach: map.upgrades?.coachUnlocked ? 1 : 0,
      rest: REST_LEVELS[restLevel].slots,
      treatment: TREATMENT_LEVELS[treatmentLevel].slots
    };
  }

  function sanitizeTrainingSlots(rawSlots, size) {
    const safeSlots = Array.isArray(rawSlots) ? rawSlots : [];
    return Array.from({ length: size }, (_, index) => {
      const entry = safeSlots[index] && typeof safeSlots[index] === "object" ? safeSlots[index] : {};
      return {
        wrestlerId: typeof entry.wrestlerId === "string" ? entry.wrestlerId : null,
        statKey: TRAINING_STAT_OPTIONS.includes(entry.statKey) ? entry.statKey : "power"
      };
    });
  }

  function sanitizeIdArray(rawArray, size) {
    const list = Array.isArray(rawArray) ? rawArray : [];
    return Array.from({ length: size }, (_, index) => (typeof list[index] === "string" ? list[index] : null));
  }

  function sanitizeManagementMap(rawMap, state = gameState) {
    const defaults = getBaseManagementMap();
    const safe = rawMap && typeof rawMap === "object" ? rawMap : {};
    const upgrades = {
      sideFightLevel: clamp(Number(safe.upgrades?.sideFightLevel || defaults.upgrades.sideFightLevel), 1, 3),
      restLevel: clamp(Number(safe.upgrades?.restLevel || defaults.upgrades.restLevel), 1, 4),
      treatmentLevel: clamp(Number(safe.upgrades?.treatmentLevel || defaults.upgrades.treatmentLevel), 1, 2),
      specialTrainingUnlocked: Boolean(safe.upgrades?.specialTrainingUnlocked),
      coachUnlocked: Boolean(safe.upgrades?.coachUnlocked)
    };
    const provisional = {
      ...defaults,
      upgrades
    };
    const caps = getSlotCapacities({
      ...(state || gameState || {}),
      managementMap: provisional
    });
    return {
      confirmedWeek: Number.isFinite(safe.confirmedWeek) ? Math.max(0, Math.floor(safe.confirmedWeek)) : 0,
      forfeitMain: Boolean(safe.forfeitMain),
      lastWarnings: Array.isArray(safe.lastWarnings) ? safe.lastWarnings.filter((line) => typeof line === "string").slice(-8) : [],
      lastAdvanceNotes: Array.isArray(safe.lastAdvanceNotes) ? safe.lastAdvanceNotes.filter((line) => typeof line === "string").slice(-8) : [],
      assignments: {
        mainEventer: typeof safe.assignments?.mainEventer === "string" ? safe.assignments.mainEventer : null,
        sideFighters: sanitizeIdArray(safe.assignments?.sideFighters, caps.sideFighters),
        franchiseStars: sanitizeIdArray(safe.assignments?.franchiseStars, caps.franchiseStars),
        media: typeof safe.assignments?.media === "string" ? safe.assignments.media : null,
        training: sanitizeTrainingSlots(safe.assignments?.training, caps.training),
        specialTraining: sanitizeTrainingSlots(safe.assignments?.specialTraining, caps.specialTraining),
        coach: sanitizeIdArray(safe.assignments?.coach, caps.coach),
        rest: sanitizeIdArray(safe.assignments?.rest, caps.rest),
        treatment: sanitizeIdArray(safe.assignments?.treatment, caps.treatment)
      },
      upgrades,
      mainEventerHistory: Array.isArray(safe.mainEventerHistory) ? safe.mainEventerHistory.filter((id) => typeof id === "string").slice(-6) : [],
      sideGuests: safe.sideGuests && typeof safe.sideGuests === "object" ? safe.sideGuests : {}
    };
  }

  function ensureManagementMapState() {
    gameState.managementMap = sanitizeManagementMap(gameState.managementMap, gameState);
    return gameState.managementMap;
  }

  function getMapAssignments() {
    return ensureManagementMapState().assignments;
  }

  function getRestLevelData() {
    return REST_LEVELS[ensureManagementMapState().upgrades.restLevel];
  }

  function getTreatmentLevelData() {
    return TREATMENT_LEVELS[ensureManagementMapState().upgrades.treatmentLevel];
  }

  function isHighGrade(grade) {
    return ["A", "S", "LEGEND"].includes(grade);
  }

  function getCoachStatKey(coach) {
    return {
      gym: "power",
      matRoom: "technique",
      prStudio: "charisma",
      medical: "stamina"
    }[coach?.facilityKey] || "power";
  }

  function getSlotRef(slotType, slotIndex = null) {
    return slotIndex == null ? slotType : `${slotType}:${slotIndex}`;
  }

  function getSlotEntry(slotType, slotIndex = null) {
    const assignments = getMapAssignments();
    const value = assignments[slotType];
    if (Array.isArray(value)) {
      return value[slotIndex] || null;
    }
    return value;
  }

  function setSlotEntry(slotType, slotIndex, nextValue) {
    const assignments = getMapAssignments();
    if (Array.isArray(assignments[slotType])) {
      assignments[slotType][slotIndex] = nextValue;
    } else {
      assignments[slotType] = nextValue;
    }
  }

  function getSlotWrestlerId(slotType, slotIndex = null) {
    const entry = getSlotEntry(slotType, slotIndex);
    if (entry && typeof entry === "object") {
      return entry.wrestlerId || null;
    }
    return entry || null;
  }

  function setSlotWrestlerId(slotType, slotIndex, wrestlerId) {
    const entry = getSlotEntry(slotType, slotIndex);
    if (entry && typeof entry === "object") {
      entry.wrestlerId = wrestlerId || null;
    } else {
      setSlotEntry(slotType, slotIndex, wrestlerId || null);
    }
  }

  function clearSlot(slotType, slotIndex = null) {
    const entry = getSlotEntry(slotType, slotIndex);
    if (entry && typeof entry === "object") {
      entry.wrestlerId = null;
    } else {
      setSlotEntry(slotType, slotIndex, null);
    }
  }

  function iterateManagedSlots(callback) {
    const caps = getSlotCapacities();
    callback("mainEventer", null);
    Array.from({ length: caps.sideFighters }, (_, index) => callback("sideFighters", index));
    Array.from({ length: caps.franchiseStars }, (_, index) => callback("franchiseStars", index));
    callback("media", null);
    Array.from({ length: caps.training }, (_, index) => callback("training", index));
    Array.from({ length: caps.specialTraining }, (_, index) => callback("specialTraining", index));
    Array.from({ length: caps.coach }, (_, index) => callback("coach", index));
    Array.from({ length: caps.rest }, (_, index) => callback("rest", index));
    Array.from({ length: caps.treatment }, (_, index) => callback("treatment", index));
  }

  function getExclusiveAssignedRefs(wrestlerId) {
    const refs = [];
    iterateManagedSlots((slotType, slotIndex) => {
      if (slotType === "media") {
        return;
      }
      if (getSlotWrestlerId(slotType, slotIndex) === wrestlerId) {
        refs.push(getSlotRef(slotType, slotIndex));
      }
    });
    return refs;
  }

  function getAllAssignedRefs(wrestlerId) {
    const refs = [];
    iterateManagedSlots((slotType, slotIndex) => {
      if (getSlotWrestlerId(slotType, slotIndex) === wrestlerId) {
        refs.push(getSlotRef(slotType, slotIndex));
      }
    });
    return refs;
  }

  function getAssignmentLabel(slotType) {
    return {
      mainEventer: "메인",
      sideFighters: "사이드",
      franchiseStars: "프랜차이즈",
      media: "미디어",
      training: "훈련",
      specialTraining: "특훈",
      coach: "코치",
      rest: "휴식",
      treatment: "치료"
    }[slotType] || "배치";
  }

  function getWrestlerRoleTags(wrestlerId) {
    return getAllAssignedRefs(wrestlerId).map((ref) => getAssignmentLabel(ref.split(":")[0]));
  }

  function removeWrestlerFromAssignments(wrestlerId, options = {}) {
    const preserveMedia = Boolean(options.preserveMedia);
    iterateManagedSlots((slotType, slotIndex) => {
      if (preserveMedia && slotType === "media") {
        return;
      }
      if (getSlotWrestlerId(slotType, slotIndex) === wrestlerId) {
        clearSlot(slotType, slotIndex);
      }
    });
  }

  function validateWrestlerForSlot(wrestler, slotType, slotIndex = null) {
    if (!wrestler) {
      return { ok: false, reason: "선수가 없습니다." };
    }
    if (slotType === "coach") {
      return { ok: false, reason: "코치는 별도 선택 메뉴에서 배치합니다." };
    }
    if (slotType === "mainEventer") {
      if (wrestler.status === "injured") return { ok: false, reason: "부상 선수는 메인 경기에 나설 수 없습니다." };
      if ((wrestler.condition || 0) < 50) return { ok: false, reason: "컨디션 50% 이상만 배치할 수 있습니다." };
      return { ok: true };
    }
    if (slotType === "sideFighters") {
      if (wrestler.status === "injured") return { ok: false, reason: "부상 선수는 사이드 경기에 나설 수 없습니다." };
      if ((wrestler.condition || 0) < 30) return { ok: false, reason: "컨디션 30% 이상만 배치할 수 있습니다." };
      if (getSlotWrestlerId("media", null) === wrestler.id) return { ok: false, reason: "미디어 담당은 사이드 경기와 중복할 수 없습니다." };
      return { ok: true };
    }
    if (slotType === "franchiseStars") {
      if (!isHighGrade(wrestler.grade)) return { ok: false, reason: "A급 이상만 프랜차이즈 슬롯에 배치할 수 있습니다." };
      return { ok: true };
    }
    if (slotType === "media") {
      if ((wrestler.stats?.charisma || 0) < 40) return { ok: false, reason: "카리스마 40 이상이 필요합니다." };
      if (getExclusiveAssignedRefs(wrestler.id).some((ref) => ref.startsWith("sideFighters"))) {
        return { ok: false, reason: "사이드 경기 출전 선수는 미디어 담당과 중복할 수 없습니다." };
      }
      return { ok: true };
    }
    if (slotType === "training" || slotType === "specialTraining") {
      if (wrestler.status === "injured") return { ok: false, reason: "부상 선수는 훈련에 투입할 수 없습니다." };
      if ((wrestler.condition || 0) < 40) return { ok: false, reason: "컨디션 40% 이상이 필요합니다." };
      if (slotType === "specialTraining" && getSlotCapacities().specialTraining <= 0) {
        return { ok: false, reason: "특훈 슬롯이 아직 해금되지 않았습니다." };
      }
      return { ok: true };
    }
    if (slotType === "rest") {
      return { ok: true };
    }
    if (slotType === "treatment") {
      if (wrestler.status !== "injured") return { ok: false, reason: "부상 선수만 집중 치료 슬롯에 배치할 수 있습니다." };
      return { ok: true };
    }
    return { ok: false, reason: "배치할 수 없는 슬롯입니다." };
  }

  function isValidManagementAssignment(wrestlerId, slotType, slotIndex = null) {
    const wrestler = findWrestlerById(wrestlerId);
    const validation = validateWrestlerForSlot(wrestler, slotType, slotIndex);
    if (!validation.ok) {
      return validation;
    }
    if (slotType !== "media") {
      const refs = getExclusiveAssignedRefs(wrestlerId).filter((ref) => ref !== getSlotRef(slotType, slotIndex));
      if (refs.length) {
        return { ok: true, moveFrom: refs[0] };
      }
    }
    return { ok: true };
  }

  function getPreviewLinesForSlot(slotType, slotIndex, wrestler) {
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    if (!wrestler) {
      return [];
    }
    if (slotType === "mainEventer") {
      const rate = currentOpponent ? circuitApi.estimateWinRate?.(wrestler, currentOpponent) || 0 : 0;
      return [
        "메인 경기 투입 시",
        currentOpponent ? `vs ${currentOpponent.name}` : "모든 서킷을 클리어했습니다",
        currentOpponent ? `예상 승률: ${rate}%` : "다음 상대 없음",
        "컨디션 소모: -25% ~ -40%",
        currentOpponent ? `승리 보상: ${circuitApi.getCircuitRewardText?.(currentOpponent.reward) || ""}` : ""
      ].filter(Boolean);
    }
    if (slotType === "sideFighters") {
      const baseSideGold = Math.max(180, Math.floor(((currentOpponent?.reward?.gold || 800) * 0.4)));
      return [
        `사이드 경기 ${slotIndex + 1}`,
        `예상 수익: ${formatNumber(baseSideGold)} G`,
        "랭킹 변동 없음",
        "컨디션 소모: -15% ~ -25%"
      ];
    }
    if (slotType === "franchiseStars") {
      return [
        "프랜차이즈 스타",
        `주당 팬 수익: +${formatNumber((wrestler.stats?.charisma || 0) * 15)} G`,
        `인기도: +${Math.max(1, Math.floor((wrestler.stats?.fame || 0) / 10))}/주`,
        "Hype 베이스: +10",
        "경기 출전 불가"
      ];
    }
    if (slotType === "media") {
      return [
        "미디어 담당",
        "다음 주 사이드 경기 수익 ×1.3",
        "라이벌 강도 +5",
        "메인 경기 / 훈련과 중복 가능",
        "사이드 경기와는 중복 불가"
      ];
    }
    if (slotType === "training" || slotType === "specialTraining") {
      const statKey = getSlotEntry(slotType, slotIndex)?.statKey || "power";
      const gain = slotType === "specialTraining" ? 8 : 4;
      return [
        slotType === "specialTraining" ? "특훈" : "강화 훈련",
        `${TRAINING_STAT_LABELS[statKey]}: ${wrestler.stats?.[statKey] || 0} → ${Math.min(getAdjustedStatCap(wrestler), (wrestler.stats?.[statKey] || 0) + gain)}`,
        `컨디션 소모: -${slotType === "specialTraining" ? 25 : 10}%`,
        "이번 주 경기 불가"
      ];
    }
    if (slotType === "rest") {
      return [
        "휴식",
        `주간 회복: +${getRestLevelData().recovery}%`,
        "기본 회복보다 빠름",
        "이번 주 경기 / 훈련 불가"
      ];
    }
    if (slotType === "treatment") {
      return [
        "집중 치료",
        `부상 회복 추가 -${getTreatmentLevelData().healWeeks}주`,
        `컨디션 +${getTreatmentLevelData().conditionBonus}%`,
        "부상 선수 전용"
      ];
    }
    return [];
  }

  function renderSlotPreview(slotElement, wrestlerId) {
    const previewEl = document.getElementById("managementMapPreview");
    if (!previewEl) {
      return;
    }
    const wrestler = findWrestlerById(wrestlerId);
    const slotType = slotElement.dataset.slotType;
    const slotIndex = slotElement.dataset.slotIndex === "" || slotElement.dataset.slotIndex == null
      ? null
      : Number(slotElement.dataset.slotIndex);
    const lines = getPreviewLinesForSlot(slotType, slotIndex, wrestler);
    if (!lines.length) {
      previewEl.classList.remove("show");
      return;
    }
    previewEl.innerHTML = `
      <div class="management-preview-title">${lines[0]}</div>
      ${lines.slice(1).map((line) => `<div class="management-preview-line">${line}</div>`).join("")}
    `;
    const rect = slotElement.getBoundingClientRect();
    previewEl.style.left = `${Math.min(window.innerWidth - 260, rect.right + 10)}px`;
    previewEl.style.top = `${Math.max(12, rect.top)}px`;
    previewEl.classList.add("show");
  }

  function hideSlotPreview() {
    const previewEl = document.getElementById("managementMapPreview");
    if (previewEl) {
      previewEl.classList.remove("show");
    }
  }

  function createGuestOpponentForSlot(slotIndex, fighter) {
    const managementMap = ensureManagementMapState();
    const slotKey = `slot_${slotIndex + 1}`;
    const existingId = managementMap.sideGuests?.[slotKey];
    if (existingId && guestPool[existingId]) {
      return guestPool[existingId];
    }
    const [name, nickname] = SIDE_GUEST_NAMES[(gameState.week + slotIndex) % SIDE_GUEST_NAMES.length];
    const styleKeys = ["powerhouse", "technician", "showman"];
    const style = styleKeys[(slotIndex + gameState.week) % styleKeys.length];
    const fighterAverage = Math.max(30, Math.round(getWrestlerPower(fighter)));
    const total = clamp(Math.floor(fighterAverage * 5 * (0.92 + (slotIndex * 0.06))), 140, 700);
    const guestId = `guest_w${gameState.week}_s${slotIndex + 1}`;
    const opponent = createWrestler({
      id: guestId,
      templateId: guestId,
      name,
      nickname,
      grade: fighter.grade || "C",
      style,
      alignment: "heel",
      age: 26 + slotIndex,
      condition: 100,
      salary: 0,
      contractWeeks: 999,
      stats: {
        power: clamp(Math.round(total * 0.22), 18, 100),
        stamina: clamp(Math.round(total * 0.2), 18, 100),
        technique: clamp(Math.round(total * 0.2), 18, 100),
        charisma: clamp(Math.round(total * 0.19), 18, 100),
        fame: clamp(Math.round(total * 0.19), 18, 100)
      },
      spriteColor: getGradeColor(fighter.grade || "C"),
      finisher: "Road House Slam",
      status: "idle"
    });
    opponent.isGuest = true;
    opponent.grade = fighter.grade || "C";
    guestPool[guestId] = opponent;
    managementMap.sideGuests[slotKey] = guestId;
    return opponent;
  }

  function clearGuestPool() {
    ensureManagementMapState().sideGuests = {};
  }

  function syncManagementMapToWeeklySchedule() {
    const managementMap = ensureManagementMapState();
    const assignments = managementMap.assignments;
    if (!gameState.weeklySchedule || typeof gameState.weeklySchedule !== "object") {
      gameState.weeklySchedule = createEmptyWeeklySchedule();
    }
    gameState.weeklySchedule = sanitizeWeeklySchedule(gameState.weeklySchedule, gameState.weeklyCard);
    gameState.weeklySchedule.mainMatch.wrestlerId = assignments.mainEventer || null;
    gameState.weeklySchedule.mainMatch.forfeit = Boolean(managementMap.forfeitMain && !assignments.mainEventer);
    gameState.weeklySchedule.sideMatches = gameState.weeklySchedule.sideMatches.slice(0, 3);
    while (gameState.weeklySchedule.sideMatches.length < 3) {
      gameState.weeklySchedule.sideMatches.push(createEmptySideMatch(gameState.weeklySchedule.sideMatches.length));
    }
    gameState.weeklySchedule.sideMatches.forEach((slot, index) => {
      const fighterId = assignments.sideFighters[index] || null;
      if (!fighterId) {
        slot.wrestlerAId = null;
        slot.wrestlerBId = null;
        slot.opponentId = "";
        slot.mode = "free";
        return;
      }
      const fighter = findWrestlerById(fighterId);
      if (!fighter) {
        slot.wrestlerAId = null;
        slot.wrestlerBId = null;
        slot.opponentId = "";
        slot.mode = "free";
        return;
      }
      const guest = createGuestOpponentForSlot(index, fighter);
      slot.wrestlerAId = fighterId;
      slot.wrestlerBId = guest.id;
      slot.opponentId = guest.id;
      slot.mode = "free";
    });
    syncWeeklyCardToSchedule = function () {
      const slots = createEmptyWeeklyCard(gameState.week);
      slots[0].wrestlerAId = gameState.weeklySchedule.mainMatch.wrestlerId;
      gameState.weeklySchedule.sideMatches.slice(0, Math.max(0, slots.length - 1)).forEach((slot, index) => {
        const target = slots[index + 1];
        if (!target) {
          return;
        }
        target.wrestlerAId = slot.wrestlerAId;
        target.wrestlerBId = slot.wrestlerBId;
      });
      gameState.weeklyCard = slots;
    };
    syncWeeklyCardToSchedule();
  }

  function autoClearInvalidAssignments() {
    const warnings = [];
    iterateManagedSlots((slotType, slotIndex) => {
      const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
      if (!wrestlerId) {
        return;
      }
      if (slotType === "coach") {
        const coach = (gameState.coaches || []).find((entry) => entry.id === wrestlerId);
        if (!coach) {
          clearSlot(slotType, slotIndex);
          warnings.push("코치 슬롯 배치가 초기화되었습니다.");
        }
        return;
      }
      const validation = isValidManagementAssignment(wrestlerId, slotType, slotIndex);
      if (!validation.ok) {
        const wrestler = findWrestlerById(wrestlerId);
        clearSlot(slotType, slotIndex);
        warnings.push(`${wrestler?.name || "선수"} - ${validation.reason}`);
      }
    });
    ensureManagementMapState().lastWarnings = warnings.slice(0, 8);
    return warnings;
  }

  function assignWrestlerToSlot(wrestlerId, slotType, slotIndex = null) {
    const wrestler = findWrestlerById(wrestlerId);
    const validation = isValidManagementAssignment(wrestlerId, slotType, slotIndex);
    if (!validation.ok) {
      window.alert(validation.reason);
      return false;
    }
    if (slotType !== "media") {
      removeWrestlerFromAssignments(wrestlerId, { preserveMedia: true });
    } else if (getSlotWrestlerId("media", null) === wrestlerId) {
      return true;
    }
    const existingOccupant = getSlotWrestlerId(slotType, slotIndex);
    if (existingOccupant && existingOccupant !== wrestlerId) {
      removeWrestlerFromAssignments(existingOccupant);
    }
    setSlotWrestlerId(slotType, slotIndex, wrestlerId);
    ensureManagementMapState().forfeitMain = false;
    syncManagementMapToWeeklySchedule();
    if (slotType === "training" || slotType === "specialTraining") {
      openTrainingStatModal(slotType, slotIndex, wrestler);
    }
    return true;
  }

  function removeSlotAssignment(slotType, slotIndex = null) {
    clearSlot(slotType, slotIndex);
    if (slotType === "mainEventer") {
      gameState.managementMap.forfeitMain = false;
    }
    syncManagementMapToWeeklySchedule();
    renderActiveTab();
    saveGameState();
  }

  function openTrainingStatModal(slotType, slotIndex, wrestler) {
    const current = getSlotEntry(slotType, slotIndex)?.statKey || "power";
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">${slotType === "specialTraining" ? "특훈 설정" : "강화 훈련 설정"}</h3>
          <p class="modal-subtitle">${wrestler?.name || "선수"}에게 어떤 스탯 훈련을 시킬지 선택합니다.</p>
        </div>
        <button class="modal-close" data-modal-close>닫기</button>
      </div>
      <div class="result-list" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
        ${TRAINING_STAT_OPTIONS.map((statKey) => `
          <button class="management-weekly-button ${current === statKey ? "primary" : ""}" data-action="select-training-stat" data-slot-type="${slotType}" data-slot-index="${slotIndex}" data-stat-key="${statKey}">
            ${TRAINING_STAT_LABELS[statKey]}
          </button>
        `).join("")}
      </div>
    `);
    Array.from(document.querySelectorAll('[data-action="select-training-stat"]')).forEach((button) => {
      button.addEventListener("click", () => {
        const entry = getSlotEntry(button.dataset.slotType, Number(button.dataset.slotIndex));
        if (entry && typeof entry === "object") {
          entry.statKey = button.dataset.statKey;
          closeModal();
          renderActiveTab();
          saveGameState();
        }
      });
    });
  }

  function openCoachAssignModal(slotIndex) {
    const coaches = (gameState.coaches || []).slice();
    if (!coaches.length) {
      window.alert("배치 가능한 코치가 없습니다. 은퇴 시 코치 전환을 먼저 진행하세요.");
      return;
    }
    openModal(`
      <div class="modal-header">
        <div>
          <h3 class="modal-title">코치 슬롯 배치</h3>
          <p class="modal-subtitle">은퇴 선수를 코치로 배치해 훈련 보너스를 적용합니다.</p>
        </div>
        <button class="modal-close" data-modal-close>닫기</button>
      </div>
      <div class="result-list" style="display:grid;gap:10px;">
        ${coaches.map((coach) => `
          <button class="management-weekly-button" data-action="assign-coach" data-slot-index="${slotIndex}" data-coach-id="${coach.id}">
            ${coach.name} · 전문 ${TRAINING_STAT_LABELS[getCoachStatKey(coach)]}
          </button>
        `).join("")}
      </div>
    `);
    Array.from(document.querySelectorAll('[data-action="assign-coach"]')).forEach((button) => {
      button.addEventListener("click", () => {
        setSlotWrestlerId("coach", Number(button.dataset.slotIndex), button.dataset.coachId);
        closeModal();
        renderActiveTab();
        saveGameState();
      });
    });
  }

  function getMainEventerStreak(candidateId) {
    const history = ensureManagementMapState().mainEventerHistory.slice(-2);
    if (!candidateId) {
      return 0;
    }
    const recent = history.concat(candidateId);
    let streak = 0;
    for (let index = recent.length - 1; index >= 0; index -= 1) {
      if (recent[index] === candidateId) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }

  function isCurrentWeekConfirmed() {
    return ensureManagementMapState().confirmedWeek === gameState.week;
  }

  function confirmWeeklyAssignments() {
    ensureManagementMapState();
    const warnings = autoClearInvalidAssignments();
    if (!gameState.managementMap.assignments.mainEventer && !gameState.managementMap.forfeitMain) {
      window.alert("메인 이벤터 슬롯이 비어 있습니다. 메인 선수를 배치하거나 메인 경기 포기를 선택해야 합니다.");
      return;
    }
    gameState.managementMap.confirmedWeek = gameState.week;
    gameState.managementMap.lastWarnings = warnings.slice(0, 8);
    syncManagementMapToWeeklySchedule();
    renderActiveTab();
    saveGameState();
  }

  function toggleMainForfeit() {
    ensureManagementMapState();
    if (gameState.managementMap.assignments.mainEventer) {
      window.alert("메인 이벤터가 배치되어 있으면 포기 처리할 수 없습니다.");
      return;
    }
    if (!gameState.managementMap.forfeitMain) {
      if (!window.confirm("정말 이번 주 메인 경기를 포기하시겠습니까?\n랭킹 -1, 인기도 -5가 적용됩니다.")) {
        return;
      }
    }
    gameState.managementMap.forfeitMain = !gameState.managementMap.forfeitMain;
    syncManagementMapToWeeklySchedule();
    renderActiveTab();
    saveGameState();
  }

  function getWeeklyForecastLines() {
    const lines = [];
    const assignments = getMapAssignments();
    const restRecovery = getRestLevelData().recovery;
    const treatedBonus = getTreatmentLevelData().conditionBonus;
    if (assignments.mainEventer) {
      const wrestler = findWrestlerById(assignments.mainEventer);
      if (wrestler) {
        const nextCondition = clamp((wrestler.condition || 0) - 25 + 15, 0, 100);
        lines.push(`${wrestler.name}: 메인 경기 후 약 ${nextCondition}%`);
      }
    }
    assignments.sideFighters.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (wrestler) {
        const nextCondition = clamp((wrestler.condition || 0) - 15 + 15, 0, 100);
        lines.push(`${wrestler.name}: 사이드 경기 후 약 ${nextCondition}%`);
      }
    });
    assignments.rest.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (wrestler) {
        lines.push(`${wrestler.name}: 휴식 배치 → ${Math.min(100, (wrestler.condition || 0) + restRecovery)}% 예상`);
      }
    });
    assignments.treatment.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (wrestler) {
        lines.push(`${wrestler.name}: 집중 치료 → +${treatedBonus}% / 부상 회복 가속`);
      }
    });
    if (assignments.mainEventer) {
      const streak = getMainEventerStreak(assignments.mainEventer);
      const wrestler = findWrestlerById(assignments.mainEventer);
      if (wrestler && streak >= 3) {
        lines.push(`⚠️ ${wrestler.name}은 3주 연속 메인 출전으로 회복 -30 페널티 대상입니다.`);
      }
    }
    return lines.slice(0, 6);
  }

  function applyManagementMapBonusesToSummary() {
    if (!pendingWeeklySummary) {
      return;
    }
    const assignments = getMapAssignments();
    let incomeBonus = 0;
    let fameBonus = 0;
    let extraSideIncome = 0;
    assignments.franchiseStars.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (!wrestler) {
        return;
      }
      incomeBonus += (wrestler.stats?.charisma || 0) * 15;
      fameBonus += Math.max(1, Math.floor((wrestler.stats?.fame || 0) / 10));
    });
    const mediaWrestler = assignments.media ? findWrestlerById(assignments.media) : null;
    if (mediaWrestler) {
      pendingWeeklySummary.results.forEach((result) => {
        if (result.kind === "side") {
          const bonus = Math.floor(result.income * 0.3);
          result.income += bonus;
          extraSideIncome += bonus;
        }
      });
    }
    pendingWeeklySummary.totalIncome += incomeBonus + extraSideIncome;
    pendingWeeklySummary.fameAfter = Math.max(0, pendingWeeklySummary.fameAfter + fameBonus);
    pendingWeeklySummary.bonusLines.push(`운영 맵 수익 보너스 +${formatNumber(incomeBonus + extraSideIncome)} G`);
    if (fameBonus > 0) {
      pendingWeeklySummary.bonusLines.push(`프랜차이즈 스타 효과로 인기도 +${fameBonus}`);
    }
    if (mediaWrestler) {
      pendingWeeklySummary.bonusLines.push(`${mediaWrestler.name}의 미디어 노출로 사이드 경기 수익 ×1.3 적용`);
    }
    gameState.gold += incomeBonus + extraSideIncome;
    gameState.fame = Math.max(0, gameState.fame + fameBonus);
  }

  function applyTrainingGrowthForAssignment(wrestler, statKey, amount) {
    if (!wrestler || !wrestler.stats) {
      return null;
    }
    const before = wrestler.stats[statKey] || 0;
    const cap = getAdjustedStatCap(wrestler);
    wrestler.stats[statKey] = clamp(before + amount, 1, cap);
    return {
      wrestlerId: wrestler.id,
      wrestlerName: wrestler.name,
      facilityKey: amount >= 8 ? "특훈" : "강화 훈련",
      statKey,
      gain: wrestler.stats[statKey] - before
    };
  }

  function applyManagementWeekAdvanceEffects(previousAssignments) {
    const notes = [];
    const growthEntries = [];
    const restRecovery = getRestLevelData().recovery;
    const treatmentMeta = getTreatmentLevelData();
    const conditionBaseRecovery = circuitApi.getWeeklyConditionRecoveryAmount?.() || 15;

    const coachId = previousAssignments.coach?.[0] || null;
    const coach = coachId ? (gameState.coaches || []).find((entry) => entry.id === coachId) : null;
    const coachStatKey = coach ? getCoachStatKey(coach) : null;

    previousAssignments.rest.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (!wrestler) {
        return;
      }
      wrestler.condition = clamp((wrestler.condition || 0) + Math.max(0, restRecovery - conditionBaseRecovery), 0, 100);
      notes.push(`${wrestler.name}이 휴식 슬롯으로 추가 회복했습니다.`);
    });

    previousAssignments.treatment.forEach((wrestlerId) => {
      const wrestler = findWrestlerById(wrestlerId);
      if (!wrestler) {
        return;
      }
      wrestler.condition = clamp((wrestler.condition || 0) + treatmentMeta.conditionBonus, 0, 100);
      if (wrestler.status === "injured") {
        wrestler.injuryWeeks = Math.max(0, (wrestler.injuryWeeks || 0) - treatmentMeta.healWeeks);
        if (wrestler.injuryWeeks === 0) {
          wrestler.status = "idle";
        }
      }
      notes.push(`${wrestler.name}이 집중 치료 효과를 받았습니다.`);
    });

    previousAssignments.training.forEach((entry) => {
      const wrestler = findWrestlerById(entry.wrestlerId);
      if (!wrestler) {
        return;
      }
      const growth = applyTrainingGrowthForAssignment(wrestler, entry.statKey, 4 + (coach ? 2 : 0) + (coachStatKey === entry.statKey ? 4 : 0));
      wrestler.condition = clamp((wrestler.condition || 0) - 10, 0, 100);
      if (growth && growth.gain > 0) {
        growthEntries.push(growth);
      }
    });

    previousAssignments.specialTraining.forEach((entry, index) => {
      const wrestler = findWrestlerById(entry.wrestlerId);
      if (!wrestler) {
        return;
      }
      const growth = applyTrainingGrowthForAssignment(wrestler, entry.statKey, 8 + (coach ? 2 : 0) + (coachStatKey === entry.statKey ? 4 : 0));
      wrestler.condition = clamp((wrestler.condition || 0) - 25, 0, 100);
      if ((wrestler.stats?.[entry.statKey] || 0) >= 100) {
        clearSlot("specialTraining", index);
      }
      if (growth && growth.gain > 0) {
        growthEntries.push(growth);
      }
    });

    const currentMainId = previousAssignments.mainEventer || "";
    const streak = getMainEventerStreak(currentMainId);
    if (currentMainId && streak >= 3) {
      const wrestler = findWrestlerById(currentMainId);
      if (wrestler) {
        wrestler.condition = clamp((wrestler.condition || 0) - 30, 0, 100);
        notes.push(`${wrestler.name}은 3주 연속 메인 출전으로 회복 -30 페널티를 받았습니다.`);
      }
    }

    gameState.managementMap.mainEventerHistory = gameState.managementMap.mainEventerHistory
      .concat(currentMainId || "")
      .filter((entry) => typeof entry === "string")
      .slice(-6);
    gameState.managementMap.lastAdvanceNotes = notes.slice(0, 8);
    return growthEntries;
  }

  function capturePreviousAssignments() {
    return structuredClone(getMapAssignments());
  }

  const baseStartWeeklyMatches = startWeeklyMatches;
  startWeeklyMatches = function () {
    ensureManagementMapState();
    autoClearInvalidAssignments();
    if (!isCurrentWeekConfirmed()) {
      window.alert("이번 주 배치를 먼저 확정해야 경기를 시작할 수 있습니다.");
      return;
    }
    syncManagementMapToWeeklySchedule();
    baseStartWeeklyMatches();
    applyManagementMapBonusesToSummary();
  };

  advanceToNextWeek = function () {
    if (!pendingWeeklySummary) {
      return;
    }
    const previousAssignments = capturePreviousAssignments();
    const salaryResult = applySalaryForWeek();
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
    const conditionRecovery = circuitApi.getWeeklyConditionRecoveryAmount?.() || 15;
    gameState.roster.forEach((wrestler) => {
      wrestler.status = wrestler.status === "match" ? "idle" : wrestler.status;
      wrestler.restMode = false;
      wrestler.condition = clamp((wrestler.condition || 0) + conditionRecovery, 0, 100);
    });
    const appliedTrainingGrowth = applyManagementWeekAdvanceEffects(previousAssignments);
    gameState.week += 1;
    gameState.managementMap.confirmedWeek = 0;
    gameState.managementMap.forfeitMain = false;
    clearGuestPool();
    gameState.weeklySchedule = createEmptyWeeklySchedule();
    syncManagementMapToWeeklySchedule();
    autoClearInvalidAssignments();
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

  function formatConditionBadge(wrestler) {
    const meta = circuitApi.getConditionTierMeta?.(wrestler.condition || 0);
    return meta ? `<div class="management-slot-meta" style="color:${meta.color};">${meta.label} ${wrestler.condition || 0}%</div>` : "";
  }

  function getManagementConditionMeta(value) {
    const condition = clamp(Number(value || 0), 0, 100);
    if (condition >= 80) {
      return { color: "#2ecc71", label: "최상" };
    }
    if (condition >= 60) {
      return { color: "#f1c40f", label: "양호" };
    }
    if (condition >= 40) {
      return { color: "#e67e22", label: "주의" };
    }
    return { color: "#e74c3c", label: "위험" };
  }

  function renderManagementConditionHtml(wrestler) {
    const condition = clamp(Number(wrestler?.condition || 0), 0, 100);
    const meta = getManagementConditionMeta(condition);
    return `
      <div class="management-condition-track">
        <div class="management-condition-bar" style="width:${condition}%;background:${meta.color};"></div>
      </div>
      <div class="management-condition-text">${meta.label} ${condition}%</div>
    `;
  }

  function getManagementForecastSummary() {
    const assignments = getMapAssignments();
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    const mainWrestler = assignments.mainEventer ? findWrestlerById(assignments.mainEventer) : null;
    const mainWinRate = mainWrestler && currentOpponent ? Number(circuitApi.estimateWinRate?.(mainWrestler, currentOpponent) || 0) : 0;
    const baseMainIncome = Math.max(0, Number(currentOpponent?.reward?.gold || 0));
    const sideCount = assignments.sideFighters.filter(Boolean).length;
    const baseSideIncome = Math.max(180, Math.floor(((currentOpponent?.reward?.gold || 800) * 0.4)));
    const sideIncome = sideCount * baseSideIncome;
    const franchiseIncome = assignments.franchiseStars.reduce((sum, wrestlerId) => {
      const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
      return sum + (wrestler ? ((wrestler.stats?.charisma || 0) * 15) : 0);
    }, 0);
    const mediaBonus = assignments.media ? Math.floor(sideIncome * 0.3) : 0;
    const expectedIncome = baseMainIncome + sideIncome + franchiseIncome + mediaBonus;
    const conditionCost = (assignments.mainEventer ? 25 : 0)
      + (sideCount * 15)
      + (assignments.training.filter((entry) => entry?.wrestlerId).length * 10)
      + (assignments.specialTraining.filter((entry) => entry?.wrestlerId).length * 25);
    const hypeChange = (assignments.mainEventer ? 8 : 0)
      + (sideCount * 2)
      + (assignments.franchiseStars.filter(Boolean).length * 5)
      + (assignments.media ? 3 : 0)
      + (assignments.training.filter((entry) => entry?.wrestlerId).length)
      - (ensureManagementMapState().forfeitMain ? 5 : 0);

    return {
      mainWinRate,
      expectedIncome,
      conditionCost,
      hypeChange
    };
  }

  function createZoneHeaderHtml(kicker, title, subtitle, statsText) {
    return `
      <div class="management-zone-header">
        <div class="management-zone-headline">
          <div class="management-zone-kicker">${kicker}</div>
          <div class="management-zone-title">${title}</div>
          <div class="management-zone-subtitle">${subtitle}</div>
        </div>
        <div class="management-zone-stats">${statsText}</div>
      </div>
    `;
  }

  function getManagementRosterCardHtml(wrestler) {
    const roleTags = getWrestlerRoleTags(wrestler.id);
    const assignedExclusive = getExclusiveAssignedRefs(wrestler.id).length > 0;
    const isDragged = dragState.wrestlerId === wrestler.id && dragState.active;
    return `
      <article class="management-roster-card ${assignedExclusive ? "assigned" : ""} ${isDragged ? "dragging-source" : ""}" data-wrestler-id="${wrestler.id}" data-assigned="${assignedExclusive ? "true" : "false"}">
        <div class="management-roster-visual">
          <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:44px;height:44px;")}"></div>
        </div>
        <div class="management-roster-name">${wrestler.name}</div>
        <div class="management-roster-meta">${wrestler.grade}급 · ${getStyleMeta(wrestler.style).label}<br>PWR ${formatAverage(getWrestlerPower(wrestler))}</div>
        ${renderManagementConditionHtml(wrestler)}
        ${roleTags.length ? `<div class="management-roster-assigned">배치: ${roleTags.join(", ")}</div>` : `<div class="management-roster-assigned">대기 중</div>`}
        <div class="management-roster-actions">
          <button class="management-mini-button" data-action="open-wrestler-detail" data-wrestler-id="${wrestler.id}">상세</button>
        </div>
      </article>
    `;
  }

  function getSlotWarningClass(slotType, slotIndex) {
    const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
    if (!wrestlerId) {
      return "";
    }
    const validation = isValidManagementAssignment(wrestlerId, slotType, slotIndex);
    return validation.ok ? "" : "management-slot-warning";
  }

  function createSlotHtml(slotType, slotIndex = null, options = {}) {
    const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
    const slotLabel = options.slotLabel || getAssignmentLabel(slotType);
    const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
    const ref = getSlotRef(slotType, slotIndex);
    if (slotType === "coach") {
      const coach = wrestlerId ? (gameState.coaches || []).find((entry) => entry.id === wrestlerId) : null;
      if (coach) {
        return `
          <div class="management-slot filled ${getSlotWarningClass(slotType, slotIndex)}" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}">
            <button class="management-slot-remove" data-action="remove-management-slot" data-slot-type="${slotType}" data-slot-index="${slotIndex}">×</button>
            <div class="management-slot-icon">${SLOT_ICONS[slotType]}</div>
            <div class="management-slot-title">${slotLabel}</div>
            <div class="management-slot-name">${coach.name}</div>
            <div class="management-slot-meta">전문: ${TRAINING_STAT_LABELS[getCoachStatKey(coach)]}</div>
          </div>
        `;
      }
      return `
        <div class="management-slot" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}">
          <div class="management-slot-icon">${SLOT_ICONS[slotType]}</div>
          <div class="management-slot-title">${slotLabel}</div>
          <div class="management-slot-rule">은퇴 선수를 코치로 배치</div>
          <button class="management-slot-action" data-action="open-coach-modal" data-slot-index="${slotIndex}">선택</button>
        </div>
      `;
    }
    if (!wrestler) {
      return `
        <div class="management-slot ${getSlotWarningClass(slotType, slotIndex)}" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}" data-slot-ref="${ref}">
          <div class="management-slot-icon">${SLOT_ICONS[slotType]}</div>
          <div class="management-slot-title">${slotLabel}</div>
          <div class="management-slot-rule">${options.ruleText || "드래그해서 배치"}</div>
        </div>
      `;
    }
    const tags = getWrestlerRoleTags(wrestler.id).map((label) => `<span class="management-slot-tag">${label}</span>`).join("");
    const actionButton = slotType === "training" || slotType === "specialTraining"
      ? `<button class="management-slot-action" data-action="edit-training-stat" data-slot-type="${slotType}" data-slot-index="${slotIndex}">${TRAINING_STAT_LABELS[getSlotEntry(slotType, slotIndex)?.statKey || "power"]}</button>`
      : "";
    return `
      <div class="management-slot filled ${getSlotWarningClass(slotType, slotIndex)}" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}" data-slot-ref="${ref}">
        <button class="management-slot-remove" data-action="remove-management-slot" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}">×</button>
        ${actionButton}
        <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:50px;height:50px;")}"></div>
        <div class="management-slot-title">${slotLabel}</div>
        <div class="management-slot-name">${wrestler.name}</div>
        ${formatConditionBadge(wrestler)}
        <div class="management-slot-tags">${tags}</div>
      </div>
    `;
  }

  function renderManagementMapMainContent() {
    ensureManagementMapState();
    syncManagementMapToWeeklySchedule();
    const caps = getSlotCapacities();
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    const managementMap = ensureManagementMapState();
    const confirmChip = isCurrentWeekConfirmed()
      ? `<span class="management-confirm-chip">✅ Week ${gameState.week} 배치 확정</span>`
      : `<span class="management-status-note">⚠️ 아직 이번 주 배치가 확정되지 않았습니다.</span>`;
    const rosterCards = gameState.roster.map((wrestler) => getManagementRosterCardHtml(wrestler)).join("");
    mainDynamicContentEl.innerHTML = `
      <div class="management-map-shell">
        <div class="management-map-top">
          <section class="management-zone ring">
            ${createZoneHeaderHtml("🥊 RING ZONE", "링 구역", "메인 경기와 사이드 매치를 편성합니다.", `메인 1회 / 사이드 ${caps.sideFighters}회`)}
            <div class="management-zone-grid">
              <div class="management-slot-group">
                <div class="management-slot-group-label">메인 이벤터</div>
                <div class="management-slot-strip">
                  ${createSlotHtml("mainEventer", null, { slotLabel: "메인 이벤터", ruleText: "컨디션 50% 이상만 가능" })}
                </div>
              </div>
              <div class="management-slot-group">
                <div class="management-slot-group-label">사이드 파이터</div>
                <div class="management-slot-strip">
                  ${Array.from({ length: caps.sideFighters }, (_, index) => createSlotHtml("sideFighters", index, { slotLabel: `사이드 ${index + 1}`, ruleText: "컨디션 30% 이상 · 수익 40%" })).join("")}
                </div>
              </div>
            </div>
          </section>
          <section class="management-zone brand">
            ${createZoneHeaderHtml("⭐ BRAND ZONE", "간판 구역", "간판 선수와 미디어 노출로 흥행 기반을 만듭니다.", `프랜차이즈 ${caps.franchiseStars} / 미디어 1`)}
            <div class="management-zone-grid">
              <div class="management-slot-group">
                <div class="management-slot-group-label">프랜차이즈 스타</div>
                <div class="management-slot-strip">
                  ${Array.from({ length: caps.franchiseStars }, (_, index) => createSlotHtml("franchiseStars", index, { slotLabel: index === 0 ? "프랜차이즈" : `프랜차이즈 ${index + 1}`, ruleText: "A급 이상 · 경기와 중복 불가" })).join("")}
                </div>
              </div>
              <div class="management-slot-group">
                <div class="management-slot-group-label">미디어 담당</div>
                <div class="management-slot-strip">
                  ${createSlotHtml("media", null, { slotLabel: "미디어", ruleText: "카리스마 40+ · 사이드와 중복 불가" })}
                </div>
              </div>
            </div>
          </section>
          <section class="management-zone training">
            ${createZoneHeaderHtml("🏋 TRAINING ZONE", "훈련 구역", "주간 능력치 강화와 특훈, 코치 보조를 설정합니다.", `강화 ${caps.training} / 특훈 ${caps.specialTraining} / 코치 ${caps.coach}`)}
            <div class="management-zone-grid">
              <div class="management-slot-group">
                <div class="management-slot-group-label">강화 훈련</div>
                <div class="management-slot-strip">
                  ${Array.from({ length: caps.training }, (_, index) => createSlotHtml("training", index, { slotLabel: `강화 ${index + 1}`, ruleText: "주당 선택 스탯 +4 · 컨디션 -10%" })).join("")}
                </div>
              </div>
              <div class="management-slot-group">
                <div class="management-slot-group-label">특훈</div>
                <div class="management-slot-strip">
                  ${caps.specialTraining ? createSlotHtml("specialTraining", 0, { slotLabel: "특훈", ruleText: "선택 스탯 +8 · 컨디션 -25%" }) : `<div class="management-slot"><div class="management-slot-icon">${SLOT_ICONS.specialTraining}</div><div class="management-slot-title">특훈</div><div class="management-slot-rule">체육관 3레벨 + 3000G 해금</div></div>`}
                </div>
              </div>
              <div class="management-slot-group">
                <div class="management-slot-group-label">코치 슬롯</div>
                <div class="management-slot-strip">
                  ${caps.coach ? createSlotHtml("coach", 0, { slotLabel: "코치" }) : `<div class="management-slot"><div class="management-slot-icon">${SLOT_ICONS.coach}</div><div class="management-slot-title">코치</div><div class="management-slot-rule">2500G로 해금</div></div>`}
                </div>
              </div>
            </div>
          </section>
          <section class="management-zone recovery">
            ${createZoneHeaderHtml("✚ RECOVERY ZONE", "회복 구역", "휴식과 집중 치료로 다음 주 컨디션을 조절합니다.", `휴식 ${caps.rest} / 치료 ${caps.treatment}`)}
            <div class="management-zone-grid">
              <div class="management-slot-group">
                <div class="management-slot-group-label">휴식</div>
                <div class="management-slot-strip">
                  ${Array.from({ length: caps.rest }, (_, index) => createSlotHtml("rest", index, { slotLabel: `휴식 ${index + 1}`, ruleText: `주당 +${getRestLevelData().recovery}% 회복` })).join("")}
                </div>
              </div>
              <div class="management-slot-group">
                <div class="management-slot-group-label">집중 치료</div>
                <div class="management-slot-strip">
                  ${Array.from({ length: caps.treatment }, (_, index) => createSlotHtml("treatment", index, { slotLabel: `치료 ${index + 1}`, ruleText: `부상 회복 -${getTreatmentLevelData().healWeeks}주` })).join("")}
                </div>
              </div>
            </div>
          </section>
        </div>
        <section class="management-map-bottom">
          <div class="management-bottom-header">
            <div>
              <div class="management-bottom-title">선수 카드 목록</div>
              <div class="management-bottom-subtitle">하단 카드를 드래그해서 슬롯에 배치하세요. 배치된 선수는 흐리게 표시됩니다.</div>
            </div>
            ${confirmChip}
          </div>
          <div class="management-roster-strip">
            ${rosterCards || '<div class="placeholder-box">보유 선수가 없습니다.</div>'}
          </div>
          <div class="management-actions-bar">
            <div class="management-status-note">
              ${currentOpponent ? `다음 상대: ${currentOpponent.name} · 보상 ${circuitApi.getCircuitRewardText?.(currentOpponent.reward) || ""}` : "월드 챔피언십을 클리어했습니다."}
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button class="management-confirm-button" data-action="confirm-management-map">이번 주 배치 확정</button>
              <button class="management-weekly-button" data-action="toggle-main-forfeit">${managementMap.forfeitMain ? "메인 경기 포기 취소" : "이번 주 메인 경기 포기"}</button>
            </div>
          </div>
        </section>
      </div>
      <div class="management-preview" id="managementMapPreview"></div>
    `;
  }

  function createUpgradeRow(title, desc, action, disabled = false, buttonText = "업그레이드") {
    return `
      <div class="management-upgrade-row">
        <div class="management-upgrade-top">
          <div class="management-side-title" style="margin:0;">${title}</div>
          <button class="management-upgrade-button" data-action="${action}" ${disabled ? "disabled" : ""}>${buttonText}</button>
        </div>
        <div class="management-side-text">${desc}</div>
      </div>
    `;
  }

  function renderManagementSidePanel() {
    ensureManagementMapState();
    const assignments = getMapAssignments();
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    const mainWrestler = assignments.mainEventer ? findWrestlerById(assignments.mainEventer) : null;
    const winRate = mainWrestler && currentOpponent ? circuitApi.estimateWinRate?.(mainWrestler, currentOpponent) || 0 : 0;
    const forecastSummary = getManagementForecastSummary();
    const warnings = ensureManagementMapState().lastWarnings || [];
    const forecastLines = getWeeklyForecastLines();
    const caps = getSlotCapacities();
    const sideFightLevel = ensureManagementMapState().upgrades.sideFightLevel;
    const restLevel = ensureManagementMapState().upgrades.restLevel;
    const treatmentLevel = ensureManagementMapState().upgrades.treatmentLevel;
    const nextSideUpgrade = SIDE_SLOT_LEVELS[sideFightLevel + 1] || null;
    const nextRestUpgrade = REST_LEVELS[restLevel + 1] || null;
    const nextTreatmentUpgrade = TREATMENT_LEVELS[treatmentLevel + 1] || null;
    sideListEl.innerHTML = `
      <div class="management-side-stack">
        <section class="management-side-card management-week-summary">
          <div class="management-summary-kicker">이번 주 예상</div>
          <div class="management-summary-grid">
            <div class="management-summary-row">
              <span>메인 승률</span>
              <strong class="management-summary-value ${forecastSummary.mainWinRate >= 60 ? "positive" : forecastSummary.mainWinRate >= 40 ? "warning" : "negative"}">${mainWrestler && currentOpponent ? `${forecastSummary.mainWinRate}% ${forecastSummary.mainWinRate >= 50 ? "↑" : "↓"}` : "미배치"}</strong>
            </div>
            <div class="management-summary-row">
              <span>예상 수익</span>
              <strong class="management-summary-value">${formatNumber(forecastSummary.expectedIncome)} G</strong>
            </div>
            <div class="management-summary-row">
              <span>컨디션 소모</span>
              <strong class="management-summary-value warning">-${forecastSummary.conditionCost}%</strong>
            </div>
            <div class="management-summary-row">
              <span>Hype 변화</span>
              <strong class="management-summary-value ${forecastSummary.hypeChange >= 0 ? "positive" : "negative"}">${forecastSummary.hypeChange >= 0 ? "+" : ""}${forecastSummary.hypeChange}</strong>
            </div>
          </div>
          <div style="display:grid;gap:10px;margin-top:14px;">
            <button class="management-confirm-button confirm-button-main ${isCurrentWeekConfirmed() ? "confirmed" : ""}" data-action="confirm-management-map">${isCurrentWeekConfirmed() ? "이번 주 배치 확정 완료" : "이번 주 배치 확정"}</button>
            <button class="management-weekly-button" data-action="toggle-main-forfeit">${ensureManagementMapState().forfeitMain ? "메인 경기 포기 취소" : "이번 주 메인 경기 포기"}</button>
          </div>
        </section>
        <section class="management-side-card">
          <div class="management-side-title">주간 준비 상태</div>
          <div class="management-side-text">${mainWrestler && currentOpponent ? `${mainWrestler.name} vs ${currentOpponent.name}<br>예상 승률 ${winRate}%` : (ensureManagementMapState().forfeitMain ? "메인 경기 포기 예정" : "메인 이벤터를 배치해야 합니다.")}</div>
          <div class="management-side-text" style="margin-top:8px;">사이드 경기 ${assignments.sideFighters.filter(Boolean).length}/${caps.sideFighters} · 배치 확정 ${isCurrentWeekConfirmed() ? "완료" : "필요"}</div>
          <div style="display:grid;gap:8px;margin-top:12px;">
            <button class="management-weekly-button primary" data-action="start-managed-week" ${isCurrentWeekConfirmed() && (assignments.mainEventer || ensureManagementMapState().forfeitMain) ? "" : "disabled"}>이번 주 경기 시작</button>
            <button class="management-weekly-button" data-action="open-main-analysis" ${currentOpponent ? "" : "disabled"}>상대 분석</button>
          </div>
        </section>
        <section class="management-side-card">
          <div class="management-side-title">업그레이드</div>
          <div class="management-upgrade-list">
            ${createUpgradeRow(
              "경기 편성 확대",
              nextSideUpgrade ? `현재 ${caps.sideFighters}슬롯 → 다음 ${nextSideUpgrade.slots}슬롯 / 비용 ${formatNumber(nextSideUpgrade.cost)} G` : `최대 레벨 도달 (${caps.sideFighters}슬롯)`,
              "upgrade-side-slots",
              !nextSideUpgrade
            )}
            ${createUpgradeRow(
              "선수단 숙소 개선",
              nextRestUpgrade ? `현재 ${REST_LEVELS[restLevel].slots}칸 +${REST_LEVELS[restLevel].recovery}% → 다음 ${nextRestUpgrade.slots}칸 +${nextRestUpgrade.recovery}% / ${formatNumber(nextRestUpgrade.cost)} G` : `최대 레벨 도달 (${REST_LEVELS[restLevel].slots}칸)`,
              "upgrade-rest-slots",
              !nextRestUpgrade
            )}
            ${createUpgradeRow(
              "의무실 확장",
              nextTreatmentUpgrade ? `현재 ${TREATMENT_LEVELS[treatmentLevel].slots}칸 → 다음 ${nextTreatmentUpgrade.slots}칸 / ${formatNumber(nextTreatmentUpgrade.cost)} G` : "최대 레벨 도달",
              "upgrade-treatment-slots",
              !nextTreatmentUpgrade
            )}
            ${createUpgradeRow(
              "특훈 해금",
              ensureManagementMapState().upgrades.specialTrainingUnlocked ? "특훈 슬롯 해금 완료" : `체육관 3레벨 필요 / 비용 ${formatNumber(3000)} G`,
              "unlock-special-training",
              ensureManagementMapState().upgrades.specialTrainingUnlocked
            )}
            ${createUpgradeRow(
              "코치 슬롯 해금",
              ensureManagementMapState().upgrades.coachUnlocked ? "코치 슬롯 해금 완료" : `은퇴 코치 배치 가능 / 비용 ${formatNumber(2500)} G`,
              "unlock-coach-slot",
              ensureManagementMapState().upgrades.coachUnlocked
            )}
          </div>
        </section>
        <section class="management-side-card">
          <div class="management-side-title">다음 주 예고</div>
          <div class="management-warning-list">
            ${(forecastLines.length ? forecastLines : ["배치를 완료하면 다음 주 영향이 표시됩니다."]).map((line) => `<div class="management-list-line">${line}</div>`).join("")}
          </div>
        </section>
        <section class="management-side-card">
          <div class="management-side-title">배치 경고</div>
          <div class="management-warning-list">
            ${(warnings.length ? warnings : ["현재 자동 경고 없음"]).map((line) => `<div class="${warnings.length ? "management-warning-line" : "management-list-line"}">${line}</div>`).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function handleUpgradeAction(action) {
    const managementMap = ensureManagementMapState();
    if (action === "upgrade-side-slots") {
      const nextLevel = managementMap.upgrades.sideFightLevel + 1;
      const next = SIDE_SLOT_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      gameState.gold -= next.cost;
      managementMap.upgrades.sideFightLevel = nextLevel;
    } else if (action === "upgrade-rest-slots") {
      const nextLevel = managementMap.upgrades.restLevel + 1;
      const next = REST_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      gameState.gold -= next.cost;
      managementMap.upgrades.restLevel = nextLevel;
    } else if (action === "upgrade-treatment-slots") {
      const nextLevel = managementMap.upgrades.treatmentLevel + 1;
      const next = TREATMENT_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      gameState.gold -= next.cost;
      managementMap.upgrades.treatmentLevel = nextLevel;
    } else if (action === "unlock-special-training") {
      if ((gameState.facilities?.gym?.level || 1) < 3) return window.alert("체육관 레벨 3 이상이 필요합니다.");
      if (managementMap.upgrades.specialTrainingUnlocked) return;
      if (gameState.gold < 3000) return window.alert("골드가 부족합니다.");
      gameState.gold -= 3000;
      managementMap.upgrades.specialTrainingUnlocked = true;
    } else if (action === "unlock-coach-slot") {
      if (managementMap.upgrades.coachUnlocked) return;
      if (gameState.gold < 2500) return window.alert("골드가 부족합니다.");
      gameState.gold -= 2500;
      managementMap.upgrades.coachUnlocked = true;
    } else {
      return;
    }
    gameState.managementMap = sanitizeManagementMap(gameState.managementMap, gameState);
    syncManagementMapToWeeklySchedule();
    renderActiveTab();
    saveGameState();
  }

  function refreshTabLabels() {
    const rosterButton = document.querySelector('.tab-button[data-tab="roster"]');
    const rosterIcon = rosterButton?.querySelector(".nav-tab-icon");
    const rosterLabel = rosterButton?.querySelector(".nav-tab-label");
    if (rosterIcon) rosterIcon.textContent = "🗺";
    if (rosterLabel) rosterLabel.textContent = "운영 맵";

    const cardsButton = document.querySelector('.tab-button[data-tab="cards"]');
    const cardsIcon = cardsButton?.querySelector(".nav-tab-icon");
    const cardsLabel = cardsButton?.querySelector(".nav-tab-label");
    if (cardsIcon) cardsIcon.textContent = "⚔️";
    if (cardsLabel) cardsLabel.textContent = "주간 진행";
    if (cardsButton) {
      cardsButton.classList.add("tab-button-hidden");
      cardsButton.hidden = true;
      cardsButton.setAttribute("aria-hidden", "true");
      cardsButton.tabIndex = -1;
    }
  }

  function createGhostCard(wrestler) {
    const ghost = document.createElement("div");
    ghost.className = "management-drag-ghost";
    ghost.innerHTML = `
      <div class="management-roster-name">${wrestler.name}</div>
      <div class="management-roster-meta">${wrestler.grade}급 · ${getStyleMeta(wrestler.style).label}</div>
      ${renderManagementConditionHtml(wrestler)}
    `;
    document.body.appendChild(ghost);
    return ghost;
  }

  function clearSlotTargetState() {
    document.querySelectorAll(".management-slot").forEach((slot) => {
      slot.classList.remove("valid-target", "invalid-target", "slot-valid-target", "slot-invalid-target", "slot-occupied-swappable");
      slot.querySelector(".slot-tooltip")?.remove();
    });
  }

  function showSlotTooltip(slot, message) {
    slot.querySelector(".slot-tooltip")?.remove();
    if (!message) {
      return;
    }
    const tooltip = document.createElement("div");
    tooltip.className = "slot-tooltip";
    tooltip.textContent = message;
    slot.appendChild(tooltip);
  }

  function cleanupDragState() {
    if (dragState.touchTimer) clearTimeout(dragState.touchTimer);
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.sourceCard) dragState.sourceCard.classList.remove("dragging-source");
    if (dragState.sourceCard && dragState.pointerId != null && dragState.sourceCard.hasPointerCapture?.(dragState.pointerId)) {
      dragState.sourceCard.releasePointerCapture(dragState.pointerId);
    }
    clearSlotTargetState();
    hideSlotPreview();
    dragState.wrestlerId = "";
    dragState.pointerId = null;
    dragState.ghost = null;
    dragState.sourceCard = null;
    dragState.targetSlot = null;
    dragState.active = false;
    dragState.touchTimer = null;
    dragState.touchPending = false;
  }

  function moveGhostCard(event) {
    if (!dragState.ghost) return;
    dragState.ghost.style.left = `${event.clientX + 12}px`;
    dragState.ghost.style.top = `${event.clientY + 12}px`;
  }

  function updateDragTarget(event) {
    const hovered = document.elementFromPoint(event.clientX, event.clientY)?.closest(".management-slot[data-slot-type]");
    clearSlotTargetState();
    dragState.targetSlot = null;
    hideSlotPreview();
    if (!hovered || !dragState.wrestlerId) return;
    const slotType = hovered.dataset.slotType;
    const slotIndex = hovered.dataset.slotIndex === "" || hovered.dataset.slotIndex == null ? null : Number(hovered.dataset.slotIndex);
    const validation = isValidManagementAssignment(dragState.wrestlerId, slotType, slotIndex);
    const currentOccupantId = getSlotWrestlerId(slotType, slotIndex);
    if (!validation.ok) {
      hovered.classList.add("slot-invalid-target");
      showSlotTooltip(hovered, validation.reason);
    } else if (currentOccupantId && currentOccupantId !== dragState.wrestlerId) {
      hovered.classList.add("slot-occupied-swappable");
      showSlotTooltip(hovered, "현재 배치된 선수와 교체 가능");
      dragState.targetSlot = hovered;
    } else {
      hovered.classList.add("slot-valid-target");
      dragState.targetSlot = hovered;
    }
    renderSlotPreview(hovered, dragState.wrestlerId);
  }

  function beginDrag(card, wrestlerId, event) {
    const wrestler = findWrestlerById(wrestlerId);
    if (!wrestler) return;
    event.preventDefault();
    dragState.active = true;
    dragState.wrestlerId = wrestlerId;
    dragState.pointerId = event.pointerId;
    dragState.sourceCard = card;
    card.setPointerCapture?.(event.pointerId);
    card.classList.add("dragging-source");
    dragState.ghost = createGhostCard(wrestler);
    moveGhostCard(event);
    updateDragTarget(event);
  }

  function attachManagementDragEvents() {
    Array.from(mainDynamicContentEl.querySelectorAll(".management-roster-card")).forEach((card) => {
      const wrestlerId = card.dataset.wrestlerId;
      const isAssigned = card.dataset.assigned === "true";
      if (!wrestlerId || isAssigned) return;
      card.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        if (event.target.closest("button")) return;
        event.preventDefault();
        dragState.originX = event.clientX;
        dragState.originY = event.clientY;
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          dragState.touchPending = true;
          dragState.touchTimer = window.setTimeout(() => beginDrag(card, wrestlerId, event), 500);
        } else {
          beginDrag(card, wrestlerId, event);
        }
      });
    });
  }

  window.addEventListener("pointermove", (event) => {
    if (dragState.touchPending && !dragState.active) {
      const moved = Math.hypot(event.clientX - dragState.originX, event.clientY - dragState.originY);
      if (moved > 12 && dragState.touchTimer) {
        clearTimeout(dragState.touchTimer);
        dragState.touchTimer = null;
        dragState.touchPending = false;
      }
    }
    if (!dragState.active || dragState.pointerId !== event.pointerId) return;
    moveGhostCard(event);
    updateDragTarget(event);
  });

  window.addEventListener("pointerup", (event) => {
    if (dragState.touchPending && dragState.touchTimer) {
      clearTimeout(dragState.touchTimer);
      dragState.touchTimer = null;
      dragState.touchPending = false;
    }
    if (!dragState.active || dragState.pointerId !== event.pointerId) return;
    if (dragState.targetSlot) {
      const slotType = dragState.targetSlot.dataset.slotType;
      const slotIndex = dragState.targetSlot.dataset.slotIndex === "" || dragState.targetSlot.dataset.slotIndex == null ? null : Number(dragState.targetSlot.dataset.slotIndex);
      assignWrestlerToSlot(dragState.wrestlerId, slotType, slotIndex);
      renderActiveTab();
      saveGameState();
    }
    cleanupDragState();
  });

  window.addEventListener("pointercancel", cleanupDragState);

  function attachManagementMapEvents() {
    attachManagementDragEvents();
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="open-wrestler-detail"]')).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openWrestlerDetailModal(button.dataset.wrestlerId);
      });
    });
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="remove-management-slot"]')).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        removeSlotAssignment(button.dataset.slotType, button.dataset.slotIndex === "" ? null : Number(button.dataset.slotIndex));
      });
    });
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="edit-training-stat"]')).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const slotType = button.dataset.slotType;
        const slotIndex = Number(button.dataset.slotIndex);
        const wrestler = findWrestlerById(getSlotWrestlerId(slotType, slotIndex));
        openTrainingStatModal(slotType, slotIndex, wrestler);
      });
    });
    Array.from(mainDynamicContentEl.querySelectorAll('[data-action="open-coach-modal"]')).forEach((button) => {
      button.addEventListener("click", () => openCoachAssignModal(Number(button.dataset.slotIndex)));
    });
    Array.from(document.querySelectorAll('[data-action="confirm-management-map"]')).forEach((button) => {
      button.addEventListener("click", confirmWeeklyAssignments);
    });
    Array.from(document.querySelectorAll('[data-action="toggle-main-forfeit"]')).forEach((button) => {
      button.addEventListener("click", toggleMainForfeit);
    });
    Array.from(sideListEl.querySelectorAll('[data-action^="upgrade-"], [data-action^="unlock-"]')).forEach((button) => {
      button.addEventListener("click", () => handleUpgradeAction(button.dataset.action));
    });
    sideListEl.querySelector('[data-action="start-managed-week"]')?.addEventListener("click", startWeeklyMatches);
    sideListEl.querySelector('[data-action="open-main-analysis"]')?.addEventListener("click", () => circuitApi.openOpponentAnalysisModal?.());
  }

  renderRosterMainContent = function () {
    refreshTabLabels();
    renderManagementMapMainContent();
    attachManagementMapEvents();
  };

  renderCardsMainContent = function () {
    refreshTabLabels();
    renderManagementMapMainContent();
    attachManagementMapEvents();
  };

  renderCardsSidePanel = function () {
    renderManagementSidePanel();
    attachManagementMapEvents();
  };

  renderFreeAgentsPanel = function () {
    renderManagementSidePanel();
    attachManagementMapEvents();
  };

  attachRosterCardEvents = function () {
    attachManagementMapEvents();
  };

  attachCardsTabEvents = function () {
    attachManagementMapEvents();
  };

  TAB_CONTENT.roster.mainTitle = "🗺 단체 운영 맵";
  TAB_CONTENT.roster.mainSubtitle = () => `Week ${gameState.week} · 배치 확정 ${isCurrentWeekConfirmed() ? "완료" : "필요"}`;
  TAB_CONTENT.roster.sideTitle = "운영 현황";
  TAB_CONTENT.roster.sideSubtitle = "업그레이드, 경고, 다음 주 예고를 확인합니다.";
  TAB_CONTENT.roster.mainInfo = [
    { label: "메인 이벤터", value: () => findWrestlerById(getMapAssignments().mainEventer)?.name || (ensureManagementMapState().forfeitMain ? "포기 예정" : "미배치") },
    { label: "사이드 경기", value: () => `${getMapAssignments().sideFighters.filter(Boolean).length}/${getSlotCapacities().sideFighters}` },
    { label: "휴식 슬롯", value: () => `${getMapAssignments().rest.filter(Boolean).length}/${getSlotCapacities().rest}` }
  ];
  TAB_CONTENT.cards.mainTitle = () => `⚔️ Week ${gameState.week} 주간 운영`;
  TAB_CONTENT.cards.mainSubtitle = () => `${circuitApi.getCurrentCircuitOpponent?.()?.name || "서킷 완료"} · 배치 확정 ${isCurrentWeekConfirmed() ? "완료" : "필요"}`;
  TAB_CONTENT.cards.sideTitle = "주간 실행";
  TAB_CONTENT.cards.sideSubtitle = "상대 분석과 경기 시작, 업그레이드를 관리합니다.";
  TAB_CONTENT.cards.mainInfo = [
    { label: "현재 랭킹", value: () => `${circuitApi.getCircuitProgressState?.().currentRank || 1}위` },
    { label: "메인 승률", value: () => {
      const opponent = circuitApi.getCurrentCircuitOpponent?.();
      const wrestler = findWrestlerById(getMapAssignments().mainEventer);
      return opponent && wrestler ? `${circuitApi.estimateWinRate?.(wrestler, opponent) || 0}%` : "미배치";
    } },
    { label: "사이드 수", value: () => `${getMapAssignments().sideFighters.filter(Boolean).length}경기` }
  ];
  TAB_CONTENT.cards.mainTitle = TAB_CONTENT.roster.mainTitle;
  TAB_CONTENT.cards.mainSubtitle = TAB_CONTENT.roster.mainSubtitle;
  TAB_CONTENT.cards.sideTitle = TAB_CONTENT.roster.sideTitle;
  TAB_CONTENT.cards.sideSubtitle = TAB_CONTENT.roster.sideSubtitle;
  TAB_CONTENT.cards.mainInfo = TAB_CONTENT.roster.mainInfo;
}
