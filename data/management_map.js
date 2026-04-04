if (!window.__RING_DYNASTY_MANAGEMENT_MAP__) {
  window.__RING_DYNASTY_MANAGEMENT_MAP__ = true;

  const circuitApi = window.__RING_DYNASTY_CIRCUIT_API__ || {};
  const TRAINING_STAT_OPTIONS = ["power", "stamina", "technique", "charisma", "fame"];
  const TRAINING_STAT_LABELS = {
    power: "힘",
    stamina: "체력",
    technique: "기술",
    charisma: "카리스마",
    fame: "인지도"
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
  const MANAGEMENT_UPGRADE_ART = {
    "upgrade-side-slots": "Side Expansion",
    "upgrade-rest-slots": "Dormitory",
    "upgrade-treatment-slots": "Medical Room",
    "unlock-special-training": "Star Class",
    "unlock-coach-slot": "Coach"
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
  const FRANCHISE_GRADE_EFFECTS = {
    A: { income: 900 },
    S: { income: 1400 },
    LEGEND: { income: 2200 }
  };
  const FRANCHISE_SPECIAL_EFFECTS = {
    S: {
      powerhouse: [
        { label: "강철 훈련", bonuses: { power: 2, stamina: 1 } },
        { label: "파워 드릴", bonuses: { power: 1, stamina: 2 } },
        { label: "메인 장악력", bonuses: { power: 1, charisma: 1, fame: 1 } }
      ],
      technician: [
        { label: "기술 세션", bonuses: { technique: 2, stamina: 1 } },
        { label: "카운터 교본", bonuses: { technique: 2, charisma: 1 } },
        { label: "링 IQ", bonuses: { technique: 1, fame: 1, stamina: 1 } }
      ],
      showman: [
        { label: "스타 오라", bonuses: { charisma: 2, fame: 2 } },
        { label: "관중 장악", bonuses: { charisma: 2, power: 1 } },
        { label: "프로모션 리드", bonuses: { fame: 2, stamina: 1 } }
      ]
    },
    LEGEND: {
      powerhouse: [
        { label: "전설의 압박감", bonuses: { power: 3, stamina: 2 } },
        { label: "헤비급 규율", bonuses: { power: 2, stamina: 2, charisma: 1 } },
        { label: "지배자 오라", bonuses: { power: 2, fame: 2, stamina: 1 } }
      ],
      technician: [
        { label: "전설의 링 메이킹", bonuses: { technique: 3, charisma: 2 } },
        { label: "완성된 운영", bonuses: { technique: 2, stamina: 2, fame: 1 } },
        { label: "마스터 클래스", bonuses: { technique: 2, charisma: 1, fame: 2 } }
      ],
      showman: [
        { label: "세대의 아이콘", bonuses: { charisma: 3, fame: 3 } },
        { label: "흥행의 중심", bonuses: { charisma: 2, fame: 2, power: 1 } },
        { label: "월드 클래스", bonuses: { charisma: 2, technique: 1, fame: 2 } }
      ]
    }
  };
  const FEMALE_WRESTLER_IDS = new Set([
    "alexa_bliss",
    "asuka",
    "ava",
    "bayley",
    "becky_lynch",
    "bianca_belair",
    "charlotte_flair",
    "jade_cargill",
    "iyo_sky",
    "liv_morgan",
    "nia_jax",
    "nikki_bella",
    "rhea_ripley",
    "ronda_rousey",
    "tiffany_stratton"
  ]);
  const TRAINING_SLOT_BLUEPRINTS = [
    {
      slotType: "training",
      slotIndex: 0,
      label: "파워실",
      shortLabel: "힘",
      statBonuses: { power: 6 },
      conditionCost: 8,
      unlockLevel: 1
    },
    {
      slotType: "training",
      slotIndex: 1,
      label: "체력실",
      shortLabel: "체력",
      statBonuses: { stamina: 6 },
      conditionCost: 8,
      unlockLevel: 2
    },
    {
      slotType: "training",
      slotIndex: 2,
      label: "테크랩",
      shortLabel: "기술",
      statBonuses: { technique: 6 },
      conditionCost: 8,
      unlockLevel: 3
    },
    {
      slotType: "specialTraining",
      slotIndex: 0,
      label: "스타 클래스",
      shortLabel: "스타성",
      statBonuses: { charisma: 6, fame: 6 },
      conditionCost: 12,
      unlockLevel: 3
    }
  ];

  const guestPool = Object.create(null);
  const dragState = {
    wrestlerId: "",
    pointerId: null,
    pointerType: "",
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
      weeklyIncident: {
        week: 0,
        triggered: false,
        announced: false,
        slotType: "",
        slotIndex: null,
        wrestlerId: null,
        wrestlerName: ""
      },
      weeklyIncidentCheckedWeek: 0,
      rosterSort: "grade",
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
      franchiseStars: 1,
      media: 0,
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
      weeklyIncident: {
        week: Number.isFinite(safe.weeklyIncident?.week) ? Math.max(0, Math.floor(safe.weeklyIncident.week)) : 0,
        triggered: Boolean(safe.weeklyIncident?.triggered),
        announced: Boolean(safe.weeklyIncident?.announced),
        slotType: typeof safe.weeklyIncident?.slotType === "string" ? safe.weeklyIncident.slotType : "",
        slotIndex: Number.isFinite(safe.weeklyIncident?.slotIndex) ? Math.max(0, Math.floor(safe.weeklyIncident.slotIndex)) : null,
        wrestlerId: typeof safe.weeklyIncident?.wrestlerId === "string" ? safe.weeklyIncident.wrestlerId : null,
        wrestlerName: typeof safe.weeklyIncident?.wrestlerName === "string" ? safe.weeklyIncident.wrestlerName : ""
      },
      weeklyIncidentCheckedWeek: Number.isFinite(safe.weeklyIncidentCheckedWeek)
        ? Math.max(0, Math.floor(safe.weeklyIncidentCheckedWeek))
        : 0,
      rosterSort: ["grade", "condition", "power"].includes(safe.rosterSort) ? safe.rosterSort : "grade",
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

  function getWeeklyIncidentState() {
    return ensureManagementMapState().weeklyIncident || getBaseManagementMap().weeklyIncident;
  }

  function isWeeklyIncidentSlot(slotType, slotIndex = null) {
    const incident = getWeeklyIncidentState();
    return incident.triggered
      && incident.week === gameState.week
      && incident.slotType === slotType
      && (incident.slotIndex ?? null) === (slotIndex ?? null);
  }

  function getWeeklyIncidentSlotLabel(slotType, slotIndex = null) {
    if (slotType === "mainEventer") {
      return "메인 이벤트";
    }
    if (slotType === "sideFighters") {
      return `사이드 경기 ${Number(slotIndex) + 1}`;
    }
    return "경기 슬롯";
  }

  function getWeeklyIncidentLockReason(slotType, slotIndex = null) {
    const incident = getWeeklyIncidentState();
    if (!isWeeklyIncidentSlot(slotType, slotIndex)) {
      return "";
    }
    const wrestlerName = incident.wrestlerName || findWrestlerById(incident.wrestlerId)?.name || "선수";
    return `${wrestlerName}이 이번 주 ${getWeeklyIncidentSlotLabel(slotType, slotIndex)} 출전을 강제로 요구했습니다.`;
  }

  function getEligibleWeeklyIncidentCandidates(slotType, slotIndex = null) {
    const currentOccupantId = getSlotWrestlerId(slotType, slotIndex);
    const roster = Array.isArray(gameState.roster)
      ? gameState.roster.filter((wrestler) => wrestler?.id && validateWrestlerForSlot(wrestler, slotType, slotIndex).ok)
      : [];
    const preferred = roster.filter((wrestler) => wrestler.id !== currentOccupantId);
    return preferred.length ? preferred : roster;
  }

  function applyWeeklyIncidentAssignment(slotType, slotIndex, wrestlerId) {
    removeWrestlerFromAssignments(wrestlerId, {
      preserveRefs: [getSlotRef(slotType, slotIndex)],
      onlyConflictsWith: slotType
    });
    const existingOccupant = getSlotWrestlerId(slotType, slotIndex);
    if (existingOccupant && existingOccupant !== wrestlerId) {
      removeWrestlerFromAssignments(existingOccupant, {
        preserveRefs: [],
        onlyConflictsWith: slotType
      });
    }
    setSlotWrestlerId(slotType, slotIndex, wrestlerId);
    ensureManagementMapState().forfeitMain = false;
  }

  function ensureWeeklyIncidentForCurrentWeek(options = {}) {
    const managementMap = ensureManagementMapState();
    const incident = managementMap.weeklyIncident || getBaseManagementMap().weeklyIncident;
    if (incident.week !== gameState.week) {
      managementMap.weeklyIncident = {
        week: gameState.week,
        triggered: false,
        announced: false,
        slotType: "",
        slotIndex: null,
        wrestlerId: null,
        wrestlerName: ""
      };
    }
    if (managementMap.weeklyIncidentCheckedWeek !== gameState.week) {
      managementMap.weeklyIncidentCheckedWeek = gameState.week;
      const nextIncident = {
        ...(managementMap.weeklyIncident || {}),
        week: gameState.week,
        triggered: false,
        announced: false,
        slotType: "",
        slotIndex: null,
        wrestlerId: null,
        wrestlerName: ""
      };
      const matchSlots = [
        { slotType: "mainEventer", slotIndex: null },
        ...Array.from({ length: getSlotCapacities().sideFighters }, (_, index) => ({ slotType: "sideFighters", slotIndex: index }))
      ].filter((slot) => getEligibleWeeklyIncidentCandidates(slot.slotType, slot.slotIndex).length);
      if (matchSlots.length && Math.random() < 0.2) {
        const chosenSlot = matchSlots[Math.floor(Math.random() * matchSlots.length)];
        const candidates = getEligibleWeeklyIncidentCandidates(chosenSlot.slotType, chosenSlot.slotIndex);
        const forcedWrestler = candidates[Math.floor(Math.random() * candidates.length)] || null;
        if (forcedWrestler) {
          applyWeeklyIncidentAssignment(chosenSlot.slotType, chosenSlot.slotIndex, forcedWrestler.id);
          nextIncident.triggered = true;
          nextIncident.slotType = chosenSlot.slotType;
          nextIncident.slotIndex = chosenSlot.slotIndex;
          nextIncident.wrestlerId = forcedWrestler.id;
          nextIncident.wrestlerName = forcedWrestler.name || "";
        }
      }
      managementMap.weeklyIncident = nextIncident;
      syncManagementMapToWeeklySchedule();
      saveGameState();
    }
    if (options.announce && managementMap.weeklyIncident?.triggered && !managementMap.weeklyIncident.announced) {
      const liveIncident = managementMap.weeklyIncident;
      const wrestlerName = liveIncident.wrestlerName || findWrestlerById(liveIncident.wrestlerId)?.name || "선수";
      const slotLabel = getWeeklyIncidentSlotLabel(liveIncident.slotType, liveIncident.slotIndex);
      liveIncident.announced = true;
      if (typeof showToast === "function") {
        showToast(`${wrestlerName} 강제 출전 이벤트 발생`, "warning");
      }
      window.alert(`돌발 이벤트\n${wrestlerName}이 불만을 터뜨리며 이번 주 ${slotLabel} 출전을 요구했습니다.\n해당 슬롯은 이번 주 동안 고정됩니다.`);
      saveGameState();
    }
    return managementMap.weeklyIncident;
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

  function isMatchSlotType(slotType) {
    return slotType === "mainEventer" || slotType === "sideFighters";
  }

  function isTrainingSlotType(slotType) {
    return slotType === "training" || slotType === "specialTraining";
  }

  function isRecoverySlotType(slotType) {
    return slotType === "rest" || slotType === "treatment";
  }

  function getFranchiseGradeEffect(grade) {
    return FRANCHISE_GRADE_EFFECTS[grade] || FRANCHISE_GRADE_EFFECTS.A;
  }

  function getFranchiseSpecialEffect(wrestler) {
    if (!wrestler || !["S", "LEGEND"].includes(wrestler.grade)) {
      return null;
    }
    const gradePool = FRANCHISE_SPECIAL_EFFECTS[wrestler.grade] || FRANCHISE_SPECIAL_EFFECTS.S;
    const styleKey = gradePool[wrestler.style] ? wrestler.style : "showman";
    const templates = gradePool[styleKey] || [];
    if (!templates.length) {
      return null;
    }
    const template = templates[hashManagementOpponentSeed(wrestler.id || wrestler.name) % templates.length];
    const bonuses = cloneStatBonuses(template.bonuses);
    return {
      label: template.label,
      bonuses,
      bonusText: formatStatBonusText(bonuses)
    };
  }

  function getFranchiseEffectSummary(franchise) {
    if (!franchise) {
      return "";
    }
    if (franchise.specialEffect) {
      return `고정 ${formatNumber(franchise.income)}G · ${franchise.specialEffect.label} (${franchise.specialEffect.bonusText})`;
    }
    return `고정 ${formatNumber(franchise.income)}G`;
  }

  function getTrainingSlotBlueprint(slotType, slotIndex = null) {
    return TRAINING_SLOT_BLUEPRINTS.find((entry) => entry.slotType === slotType && entry.slotIndex === Number(slotIndex ?? 0)) || null;
  }

  function cloneStatBonuses(bonuses = {}) {
    return {
      power: Number(bonuses.power || 0),
      stamina: Number(bonuses.stamina || 0),
      technique: Number(bonuses.technique || 0),
      charisma: Number(bonuses.charisma || 0),
      fame: Number(bonuses.fame || 0)
    };
  }

  function addStatBonuses(target, source) {
    Object.entries(source || {}).forEach(([statKey, value]) => {
      if (!Number.isFinite(value) || !Object.prototype.hasOwnProperty.call(target, statKey)) {
        return;
      }
      target[statKey] += value;
    });
    return target;
  }

  function formatStatBonusText(bonuses = {}) {
    return Object.entries(bonuses)
      .filter(([, value]) => Number(value) > 0)
      .map(([statKey, value]) => `${TRAINING_STAT_LABELS[statKey] || statKey} +${value}`)
      .join(" / ");
  }

  function getAssignedCoach() {
    const coachId = getMapAssignments().coach?.[0] || null;
    return coachId ? (gameState.coaches || []).find((entry) => entry.id === coachId) || null : null;
  }

  function getTrainingSlotEffect(slotType, slotIndex = null) {
    const blueprint = getTrainingSlotBlueprint(slotType, slotIndex);
    if (!blueprint) {
      return null;
    }
    const bonuses = cloneStatBonuses(blueprint.statBonuses);
    const coach = getAssignedCoach();
    const coachStatKey = coach ? getCoachStatKey(coach) : "";
    if (coach && Object.prototype.hasOwnProperty.call(bonuses, coachStatKey) && bonuses[coachStatKey] > 0) {
      bonuses[coachStatKey] += 2;
    }
    return {
      ...blueprint,
      bonuses,
      bonusText: formatStatBonusText(bonuses)
    };
  }

  function getTrainingAssignmentsSummary(assignments = getMapAssignments()) {
    const entries = [];
    assignments.training.forEach((entry, index) => {
      if (!entry?.wrestlerId) {
        return;
      }
      const effect = getTrainingSlotEffect("training", index);
      if (!effect) {
        return;
      }
      entries.push({
        wrestlerId: entry.wrestlerId,
        slotType: "training",
        slotIndex: index,
        effect
      });
    });
    assignments.specialTraining.forEach((entry, index) => {
      if (!entry?.wrestlerId) {
        return;
      }
      const effect = getTrainingSlotEffect("specialTraining", index);
      if (!effect) {
        return;
      }
      entries.push({
        wrestlerId: entry.wrestlerId,
        slotType: "specialTraining",
        slotIndex: index,
        effect
      });
    });
    return entries;
  }

  function getFranchiseSlotEffect(assignments = getMapAssignments()) {
    const wrestlerId = assignments.franchiseStars?.[0] || null;
    const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
    if (!wrestler) {
      return null;
    }
    const gradeMeta = getFranchiseGradeEffect(wrestler.grade);
    const specialEffect = getFranchiseSpecialEffect(wrestler);
    return {
      wrestler,
      income: gradeMeta.income,
      aura: 0,
      specialEffect,
      specialEffectText: specialEffect ? `${specialEffect.label} · ${specialEffect.bonusText}` : ""
    };
  }

  function getManagementBattleBonusesForWrestler(wrestler, assignments = getMapAssignments()) {
    const bonuses = cloneStatBonuses();
    if (!wrestler) {
      return bonuses;
    }
    getTrainingAssignmentsSummary(assignments)
      .filter((entry) => entry.wrestlerId === wrestler.id)
      .forEach((entry) => addStatBonuses(bonuses, entry.effect.bonuses));
    const franchise = getFranchiseSlotEffect(assignments);
    if (franchise && gameState.roster.some((entry) => entry.id === wrestler.id)) {
      if (franchise.specialEffect?.bonuses) {
        addStatBonuses(bonuses, franchise.specialEffect.bonuses);
      }
    }
    return bonuses;
  }

  function getManagementBattleReadyStats(wrestler, baseStats = null) {
    const sourceStats = baseStats ? cloneStatBonuses(baseStats) : cloneStatBonuses(wrestler?.stats || {});
    if (!wrestler) {
      return sourceStats;
    }
    addStatBonuses(sourceStats, getManagementBattleBonusesForWrestler(wrestler));
    const cap = getAdjustedStatCap(wrestler);
    Object.keys(sourceStats).forEach((statKey) => {
      sourceStats[statKey] = clamp(sourceStats[statKey], 1, statKey === "fame" ? 100 : cap);
    });
    return sourceStats;
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
    Array.from({ length: caps.training }, (_, index) => callback("training", index));
    Array.from({ length: caps.specialTraining }, (_, index) => callback("specialTraining", index));
    Array.from({ length: caps.coach }, (_, index) => callback("coach", index));
    Array.from({ length: caps.rest }, (_, index) => callback("rest", index));
    Array.from({ length: caps.treatment }, (_, index) => callback("treatment", index));
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
      training: "훈련",
      specialTraining: "특훈",
      coach: "코치",
      rest: "휴식",
      treatment: "치료"
    }[slotType] || "배치";
  }

  function getWrestlerGender(wrestler) {
    if (!wrestler) {
      return "male";
    }
    const rawGender = String(wrestler.gender || wrestler.sex || "").trim().toLowerCase();
    if (["female", "woman", "women", "f"].includes(rawGender)) {
      return "female";
    }
    if (["male", "man", "men", "m"].includes(rawGender)) {
      return "male";
    }
    const candidates = [
      wrestler.templateId,
      wrestler.id,
      typeof wrestler.name === "string" ? wrestler.name.trim().toLowerCase().replace(/\s+/g, "_") : ""
    ].filter(Boolean);
    return candidates.some((value) => FEMALE_WRESTLER_IDS.has(String(value)))
      ? "female"
      : "male";
  }

  function requiresFemaleMatchup(slotType, slotIndex = null) {
    if (!isMatchSlotType(slotType)) {
      return false;
    }
    const opponent = getManagedOpponentForSlot(slotType, slotIndex);
    return getWrestlerGender(opponent) === "female";
  }

  function getWrestlerRoleTags(wrestlerId) {
    return getAllAssignedRefs(wrestlerId).map((ref) => getAssignmentLabel(ref.split(":")[0]));
  }

  function slotTypesConflict(leftType, rightType) {
    if (leftType === rightType && (leftType === "coach" || leftType === "franchiseStars")) {
      return true;
    }
    if (isMatchSlotType(leftType) && isMatchSlotType(rightType)) {
      return true;
    }
    if (isTrainingSlotType(leftType) && isTrainingSlotType(rightType)) {
      return true;
    }
    if (isRecoverySlotType(leftType) && isRecoverySlotType(rightType)) {
      return true;
    }
    if ((isRecoverySlotType(leftType) && (isMatchSlotType(rightType) || isTrainingSlotType(rightType)))
      || (isRecoverySlotType(rightType) && (isMatchSlotType(leftType) || isTrainingSlotType(leftType)))) {
      return true;
    }
    return false;
  }

  function getConflictingAssignedRefs(wrestlerId, targetSlotType, targetSlotIndex = null) {
    const refs = [];
    iterateManagedSlots((slotType, slotIndex) => {
      const ref = getSlotRef(slotType, slotIndex);
      if (ref === getSlotRef(targetSlotType, targetSlotIndex)) {
        return;
      }
      if (getSlotWrestlerId(slotType, slotIndex) !== wrestlerId) {
        return;
      }
      if (slotTypesConflict(slotType, targetSlotType)) {
        refs.push(ref);
      }
    });
    return refs;
  }

  function getExclusiveAssignedRefs(wrestlerId) {
    return getAllAssignedRefs(wrestlerId).filter((ref) => {
      const slotType = ref.split(":")[0];
      return isMatchSlotType(slotType) || isTrainingSlotType(slotType) || isRecoverySlotType(slotType);
    });
  }

  function removeWrestlerFromAssignments(wrestlerId, options = {}) {
    const preserveRefs = new Set(Array.isArray(options.preserveRefs) ? options.preserveRefs : []);
    const onlyConflictsWith = options.onlyConflictsWith || "";
    iterateManagedSlots((slotType, slotIndex) => {
      const ref = getSlotRef(slotType, slotIndex);
      if (preserveRefs.has(ref)) {
        return;
      }
      if (onlyConflictsWith && !slotTypesConflict(slotType, onlyConflictsWith)) {
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
    if (isWeeklyIncidentSlot(slotType, slotIndex) && getWeeklyIncidentState().wrestlerId !== wrestler.id) {
      return { ok: false, reason: getWeeklyIncidentLockReason(slotType, slotIndex) };
    }
    if (slotType === "coach") {
      return { ok: false, reason: "코치는 별도 선택 메뉴에서 배치합니다." };
    }
    if (slotType === "mainEventer") {
      if (wrestler.status === "injured") return { ok: false, reason: "부상 선수는 메인 경기에 나설 수 없습니다." };
      if ((wrestler.condition || 0) < 50) return { ok: false, reason: "컨디션 50% 이상만 배치할 수 있습니다." };
      if (requiresFemaleMatchup(slotType, slotIndex) && getWrestlerGender(wrestler) !== "female") {
        return { ok: false, reason: "여성 상대에게는 여성 선수만 메인 경기에 배치할 수 있습니다." };
      }
      return { ok: true };
    }
    if (slotType === "sideFighters") {
      if (wrestler.status === "injured") return { ok: false, reason: "부상 선수는 사이드 경기에 나설 수 없습니다." };
      if ((wrestler.condition || 0) < 30) return { ok: false, reason: "컨디션 30% 이상만 배치할 수 있습니다." };
      if (requiresFemaleMatchup(slotType, slotIndex) && getWrestlerGender(wrestler) !== "female") {
        return { ok: false, reason: `여성 상대가 있는 사이드 ${Number(slotIndex) + 1}에는 여성 선수만 배치할 수 있습니다.` };
      }
      return { ok: true };
    }
    if (slotType === "franchiseStars") {
      if (!isHighGrade(wrestler.grade)) return { ok: false, reason: "A급 이상만 프랜차이즈 슬롯에 배치할 수 있습니다." };
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
    const incident = getWeeklyIncidentState();
    if (incident.triggered && incident.week === gameState.week && incident.wrestlerId === wrestlerId && !isWeeklyIncidentSlot(slotType, slotIndex)) {
      return { ok: false, reason: `${incident.wrestlerName || wrestler?.name || "선수"}은 이번 주 강제 출전 중이라 다른 경기 슬롯으로 옮길 수 없습니다.` };
    }
    const validation = validateWrestlerForSlot(wrestler, slotType, slotIndex);
    if (!validation.ok) {
      return validation;
    }
    const refs = getConflictingAssignedRefs(wrestlerId, slotType, slotIndex);
    if (refs.length) {
      return { ok: true, moveFrom: refs[0], conflictingRefs: refs };
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
      const effect = getFranchiseSlotEffect({ franchiseStars: [wrestler.id] });
      return [
        "프랜차이즈 스타",
        `고정 수익: +${formatNumber(effect?.income || 0)} G`,
        effect?.specialEffect ? `로스터 버프: ${effect.specialEffect.label}` : "추가 버프 없음",
        effect?.specialEffect ? effect.specialEffect.bonusText : "A급은 주간 수익만 제공",
        "A급 이상만 배치",
        "경기와 중복 가능"
      ].filter(Boolean);
    }
    if (slotType === "training" || slotType === "specialTraining") {
      const effect = getTrainingSlotEffect(slotType, slotIndex);
      return [
        effect?.label || (slotType === "specialTraining" ? "특훈" : "훈련"),
        effect?.bonusText || "능력치 버프",
        `주 종료 후 컨디션 -${effect?.conditionCost || 0}%`,
        "경기 / 프랜차이즈와 중복 가능",
        "훈련 슬롯끼리만 중복 불가"
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

  function getManagedGuestGrade(total) {
    if (total >= 780) return "LEGEND";
    if (total >= 520) return "S";
    if (total >= 380) return "A";
    if (total >= 240) return "B";
    return "C";
  }

  function buildManagedGuestStats(total, style) {
    const weights = {
      powerhouse: { power: 1.22, stamina: 1.08, technique: 0.78, charisma: 0.84, fame: 1.0 },
      technician: { power: 0.88, stamina: 1.0, technique: 1.18, charisma: 0.9, fame: 1.04 },
      showman: { power: 0.92, stamina: 0.96, technique: 0.9, charisma: 1.18, fame: 1.04 }
    }[style] || { power: 1, stamina: 1, technique: 1, charisma: 1, fame: 1 };
    const entries = Object.entries(weights);
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
      previewEl.innerHTML = "";
    }
  }

  function hashManagementOpponentSeed(value) {
    let hash = 0;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getManagementOpponentTemplatePool(grade, excludedTemplateIds = []) {
    const excluded = new Set((excludedTemplateIds || []).filter(Boolean));
    const gradePool = wrestlerPool.filter((wrestler) => wrestler?.grade === grade && !excluded.has(wrestler.id));
    if (gradePool.length) {
      return gradePool;
    }
    const fallbackPool = wrestlerPool.filter((wrestler) => !excluded.has(wrestler.id));
    return fallbackPool.length ? fallbackPool : wrestlerPool.slice();
  }

  function pickManagementOpponentTemplate(slotKey, grade, excludedTemplateIds = []) {
    const pool = getManagementOpponentTemplatePool(grade, excludedTemplateIds);
    if (!pool.length) {
      return null;
    }
    return pool[hashManagementOpponentSeed(`${slotKey}:${grade}:${gameState.week}`) % pool.length];
  }

  function createGuestOpponentForSlot(slotIndex) {
    const managementMap = ensureManagementMapState();
    const slotKey = `slot_${slotIndex + 1}`;
    const existingId = managementMap.sideGuests?.[slotKey];
    if (existingId && guestPool[existingId]) {
      return guestPool[existingId];
    }
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    const baseTotal = Math.max(150, Number(currentOpponent?.total || (170 + (gameState.week * 8))));
    const total = clamp(Math.round(baseTotal * (0.72 + (slotIndex * 0.08))), 140, 760);
    const grade = getManagedGuestGrade(total);
    const existingTemplateIds = Object.entries(managementMap.sideGuests || {})
      .filter(([key]) => key !== slotKey)
      .map(([, guestId]) => guestPool[guestId]?.templateId)
      .filter(Boolean);
    if (currentOpponent?.templateId) {
      existingTemplateIds.push(currentOpponent.templateId);
    }
    const template = pickManagementOpponentTemplate(`weekly_side_${slotKey}`, grade, existingTemplateIds);
    const style = template?.style || ["powerhouse", "technician", "showman"][(slotIndex + gameState.week) % 3];
    const guestId = `guest_w${gameState.week}_s${slotIndex + 1}`;
    const opponent = createWrestler({
      id: guestId,
      templateId: template?.id || guestId,
      name: template?.name || `Guest ${slotIndex + 1}`,
      nickname: template?.nickname || "주간 도전자",
      grade,
      style,
      alignment: "heel",
      age: 26 + slotIndex,
      condition: 100,
      salary: 0,
      contractWeeks: 999,
      stats: buildManagedGuestStats(total, style),
      spriteSheet: template?.spriteSheet || null,
      battleSpriteSheet: template?.battleSpriteSheet || null,
      spriteFrames: Number.isFinite(template?.spriteFrames) ? template.spriteFrames : 1,
      battleSpriteFrames: Number.isFinite(template?.battleSpriteFrames) ? template.battleSpriteFrames : 1,
      portraitMode: typeof template?.portraitMode === "boolean" ? template.portraitMode : true,
      spriteColor: template?.spriteColor || getGradeColor(grade),
      finisher: template?.finisher || "Road House Slam",
      status: "idle"
    });
    opponent.isGuest = true;
    opponent.grade = grade;
    opponent.total = total;
    guestPool[guestId] = opponent;
    managementMap.sideGuests[slotKey] = guestId;
    return opponent;
  }

  function createDisplayOpponentFromCircuit(opponent) {
    if (!opponent) {
      return null;
    }
    return createWrestler({
      id: opponent.id,
      templateId: opponent.templateId || opponent.id,
      name: opponent.name,
      nickname: opponent.nickname,
      grade: opponent.grade,
      stats: structuredClone(opponent.stats),
      style: opponent.style,
      alignment: "heel",
      age: 28 + Number(opponent.circuitIndex || 0),
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
      status: "idle"
    });
  }

  function getManagedOpponentForSlot(slotType, slotIndex = null) {
    if (slotType === "mainEventer") {
      return createDisplayOpponentFromCircuit(circuitApi.getCurrentCircuitOpponent?.() || null);
    }
    if (slotType === "sideFighters") {
      return createGuestOpponentForSlot(slotIndex);
    }
    return null;
  }

  function getManagedMatchWinRate(slotType, wrestler, opponent) {
    if (!wrestler || !opponent) {
      return null;
    }
    if (slotType === "mainEventer") {
      const mainOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
      return mainOpponent ? Number(circuitApi.estimateWinRate?.(wrestler, mainOpponent) || 0) : null;
    }
    const wrestlerPower = getWrestlerPower(wrestler);
    const opponentPower = getWrestlerPower(opponent);
    return clamp(Math.round(50 + ((wrestlerPower - opponentPower) * 1.1)), 5, 95);
  }

  function createManagedOpponentCardHtml(opponent, options = {}) {
    if (!opponent) {
      return `
        <article class="management-opponent-card empty">
          <div class="management-opponent-top">
            <div class="management-opponent-stage">${options.label || "상대"}</div>
          </div>
          <div class="management-opponent-empty">상대 정보 없음</div>
        </article>
      `;
    }
    const wrestlerId = getSlotWrestlerId(options.slotType, options.slotIndex);
    const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
    const winRate = getManagedMatchWinRate(options.slotType, wrestler, opponent);
    const genderLabel = getWrestlerGender(opponent) === "female" ? "여성전" : "";
    return `
      <article class="management-opponent-card ${options.slotType === "mainEventer" ? "main" : ""}">
        <div class="management-opponent-top">
          <div class="management-opponent-stage">${options.label || "상대"}</div>
          <div class="management-opponent-grade">${opponent.grade}급${genderLabel ? ` · ${genderLabel}` : ""}</div>
        </div>
        <div class="management-opponent-core">
          <div class="management-opponent-visual">
            <div class="sprite-box" style="${getWrestlerVisualStyle(opponent, "width:58px;height:58px;")}"></div>
          </div>
          <div class="management-opponent-copy">
            <div class="management-opponent-name">${opponent.name}</div>
            <div class="management-opponent-meta">${opponent.nickname || getStyleMeta(opponent.style).label}</div>
            <div class="management-opponent-power">PWR ${formatAverage(getWrestlerPower(opponent))}${winRate != null ? ` · 예상 ${winRate}%` : ""}</div>
          </div>
        </div>
      </article>
    `;
  }

  function createManagementBookingRowHtml(slotType, slotIndex, options = {}) {
    const opponent = getManagedOpponentForSlot(slotType, slotIndex);
    const incidentNote = isWeeklyIncidentSlot(slotType, slotIndex)
      ? `돌발 배정 · ${getWeeklyIncidentState().wrestlerName || "선수"} 고정`
      : "";
    return `
      <article class="management-match-row ${slotType === "mainEventer" ? "main" : ""}">
        <div class="management-match-stage">
          <div class="management-match-stage-label">${options.stageLabel || "라운드"}</div>
          <div class="management-match-stage-note">${[options.stageNote || "", incidentNote].filter(Boolean).join(" · ")}</div>
        </div>
        <div class="management-match-player">
          ${createSlotHtml(slotType, slotIndex, { slotLabel: options.slotLabel, ruleText: options.ruleText })}
        </div>
        <div class="management-match-divider">VS</div>
        <div class="management-match-opponent">
          ${createManagedOpponentCardHtml(opponent, { label: options.opponentLabel, slotType, slotIndex })}
        </div>
      </article>
    `;
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
      const guest = createGuestOpponentForSlot(index);
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
    syncManagementConfirmationState();
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
    removeWrestlerFromAssignments(wrestlerId, {
      preserveRefs: [getSlotRef(slotType, slotIndex)],
      onlyConflictsWith: slotType
    });
    const existingOccupant = getSlotWrestlerId(slotType, slotIndex);
    if (existingOccupant && existingOccupant !== wrestlerId) {
      removeWrestlerFromAssignments(existingOccupant, {
        preserveRefs: [],
        onlyConflictsWith: slotType
      });
    }
    setSlotWrestlerId(slotType, slotIndex, wrestlerId);
    ensureManagementMapState().forfeitMain = false;
    syncManagementMapToWeeklySchedule();
    return true;
  }

  function removeSlotAssignment(slotType, slotIndex = null) {
    if (isWeeklyIncidentSlot(slotType, slotIndex)) {
      window.alert(getWeeklyIncidentLockReason(slotType, slotIndex));
      return;
    }
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

  function getWeeklyMatchAssignmentIssues(assignments = getMapAssignments(), managementMap = ensureManagementMapState()) {
    const issues = [];
    if (!assignments.mainEventer && !managementMap.forfeitMain) {
      issues.push("메인 이벤터 슬롯이 비어 있습니다.");
    }
    assignments.sideFighters.forEach((wrestlerId, index) => {
      if (!wrestlerId) {
        issues.push(`사이드 경기 ${index + 1} 슬롯이 비어 있습니다.`);
        return;
      }
      const validation = isValidManagementAssignment(wrestlerId, "sideFighters", index);
      if (!validation.ok) {
        issues.push(`사이드 경기 ${index + 1}: ${validation.reason}`);
      }
    });
    if (assignments.mainEventer) {
      const validation = isValidManagementAssignment(assignments.mainEventer, "mainEventer", null);
      if (!validation.ok) {
        issues.push(`메인 경기: ${validation.reason}`);
      }
    }
    return issues;
  }

  function isCurrentWeekConfirmed() {
    return ensureManagementMapState().confirmedWeek === gameState.week;
  }

  function confirmWeeklyAssignments() {
    ensureManagementMapState();
    const warnings = autoClearInvalidAssignments();
    const issues = getWeeklyMatchAssignmentIssues(gameState.managementMap.assignments, gameState.managementMap);
    if (issues.length) {
      window.alert(issues[0]);
      return;
    }
    syncManagementConfirmationState();
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
    const franchise = getFranchiseSlotEffect(assignments);
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
    getTrainingAssignmentsSummary(assignments).forEach((entry) => {
      const wrestler = findWrestlerById(entry.wrestlerId);
      if (!wrestler) {
        return;
      }
      const nextCondition = clamp((wrestler.condition || 0) - entry.effect.conditionCost + 15, 0, 100);
      lines.push(`${wrestler.name}: ${entry.effect.label} · ${entry.effect.bonusText} · 다음 주 약 ${nextCondition}%`);
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
    if (franchise) {
      lines.push(`${franchise.wrestler.name}: 간판 수익 +${formatNumber(franchise.income)}G`);
      if (franchise.specialEffect) {
        lines.push(`${franchise.specialEffect.label}: 로스터 전체 ${franchise.specialEffect.bonusText}`);
      }
    }
    return lines.slice(0, 6);
  }

  function applyManagementMapBonusesToSummary() {
    if (!pendingWeeklySummary) {
      return;
    }
    const assignments = getMapAssignments();
    const franchise = getFranchiseSlotEffect(assignments);
    const incomeBonus = franchise?.income || 0;
    pendingWeeklySummary.totalIncome += incomeBonus;
    if (incomeBonus > 0) {
      pendingWeeklySummary.bonusLines.push(`프랜차이즈 수익 +${formatNumber(incomeBonus)} G`);
      if (franchise.specialEffect) {
        pendingWeeklySummary.bonusLines.push(`${franchise.wrestler.name} 간판 효과: ${franchise.specialEffect.label} · ${franchise.specialEffect.bonusText}`);
      }
    }
    gameState.gold += incomeBonus;
  }

  function applyManagementWeekAdvanceEffects(previousAssignments) {
    const notes = [];
    const restRecovery = getRestLevelData().recovery;
    const treatmentMeta = getTreatmentLevelData();
    const conditionBaseRecovery = circuitApi.getWeeklyConditionRecoveryAmount?.() || 15;

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

    getTrainingAssignmentsSummary(previousAssignments).forEach((entry) => {
      const wrestler = findWrestlerById(entry.wrestlerId);
      if (!wrestler) {
        return;
      }
      wrestler.condition = clamp((wrestler.condition || 0) - entry.effect.conditionCost, 0, 100);
      notes.push(`${wrestler.name}이 ${entry.effect.label} 버프를 유지하고 컨디션 -${entry.effect.conditionCost}%를 소모했습니다.`);
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
    return [];
  }

  function capturePreviousAssignments() {
    return structuredClone(getMapAssignments());
  }

  const baseStartWeeklyMatches = startWeeklyMatches;
  startWeeklyMatches = function () {
    ensureManagementMapState();
    autoClearInvalidAssignments();
    const issues = getWeeklyMatchAssignmentIssues(gameState.managementMap.assignments, gameState.managementMap);
    if (issues.length) {
      window.alert(issues[0]);
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
    const franchiseIncome = getFranchiseSlotEffect(assignments)?.income || 0;
    const trainingConditionCost = getTrainingAssignmentsSummary(assignments)
      .reduce((sum, entry) => sum + entry.effect.conditionCost, 0);
    const expectedIncome = baseMainIncome + sideIncome + franchiseIncome;
    const conditionCost = (assignments.mainEventer ? 25 : 0)
      + (sideCount * 15)
      + trainingConditionCost;
    const hypeChange = (assignments.mainEventer ? 8 : 0)
      + (sideCount * 2)
      + (assignments.franchiseStars.filter(Boolean).length * 4)
      + (getTrainingAssignmentsSummary(assignments).length)
      - (ensureManagementMapState().forfeitMain ? 5 : 0);

    return {
      mainWinRate,
      expectedIncome,
      conditionCost,
      hypeChange
    };
  }

  function getManagementUpgradeImagePath(action) {
    const fileName = MANAGEMENT_UPGRADE_ART[action];
    return fileName ? encodeURI(`data/images/SHOW LOGISTICS/${fileName}.png`) : "";
  }

  function syncManagementConfirmationState() {
    const managementMap = ensureManagementMapState();
    managementMap.confirmedWeek = getWeeklyMatchAssignmentIssues(managementMap.assignments, managementMap).length === 0
      ? gameState.week
      : 0;
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
    const isDragged = dragState.wrestlerId === wrestler.id && dragState.active;
    const gradeClass = String(wrestler.grade || "C").trim().toLowerCase();
    const powerValue = formatAverage(getWrestlerPower(wrestler));
    const numericPower = Number(getWrestlerPower(wrestler)) || 0;
    const powerClass = numericPower <= 50
      ? "is-low"
      : numericPower <= 80
        ? "is-mid"
        : numericPower <= 90
          ? "is-high"
          : "is-elite";
    return `
      <article class="management-roster-card grade-${gradeClass} ${isDragged ? "dragging-source" : ""}" data-wrestler-id="${wrestler.id}" data-assigned="false">
        <div class="management-roster-grade">
          ${getUiIconImgHtml(getGradeIconPath(wrestler.grade), "management-roster-grade-icon", wrestler.grade)}
        </div>
        <div class="management-roster-visual">
          <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:72px;height:72px;background-position:center 18%;")}"></div>
        </div>
        <div class="management-roster-name">${wrestler.name}</div>
        <div class="management-roster-power ${powerClass}">${powerValue}</div>
        ${renderManagementConditionHtml(wrestler)}
        <div class="management-roster-actions">
          <button class="management-mini-button" data-action="open-wrestler-detail" data-wrestler-id="${wrestler.id}">상세</button>
        </div>
      </article>
    `;
  }

  function getManagementRosterSortKey() {
    return ensureManagementMapState().rosterSort || "grade";
  }

  function getSortedManagementRoster() {
    const gradeRank = { LEGEND: 5, S: 4, A: 3, B: 2, C: 1 };
    const sortKey = getManagementRosterSortKey();
    const roster = Array.isArray(gameState.roster) ? gameState.roster.slice() : [];
    roster.sort((left, right) => {
      if (sortKey === "condition") {
        const conditionGap = (Number(right?.condition || 0) - Number(left?.condition || 0));
        if (conditionGap !== 0) return conditionGap;
      } else if (sortKey === "power") {
        const powerGap = getWrestlerPower(right) - getWrestlerPower(left);
        if (powerGap !== 0) return powerGap;
      } else {
        const gradeGap = (gradeRank[right?.grade] || 0) - (gradeRank[left?.grade] || 0);
        if (gradeGap !== 0) return gradeGap;
      }
      const secondaryGradeGap = (gradeRank[right?.grade] || 0) - (gradeRank[left?.grade] || 0);
      if (secondaryGradeGap !== 0) return secondaryGradeGap;
      const secondaryPowerGap = getWrestlerPower(right) - getWrestlerPower(left);
      if (secondaryPowerGap !== 0) return secondaryPowerGap;
      const secondaryConditionGap = Number(right?.condition || 0) - Number(left?.condition || 0);
      if (secondaryConditionGap !== 0) return secondaryConditionGap;
      return String(left?.name || "").localeCompare(String(right?.name || ""), "ko");
    });
    return roster;
  }

  function getSlotWarningClass(slotType, slotIndex) {
    const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
    if (!wrestlerId) {
      return "";
    }
    const validation = isValidManagementAssignment(wrestlerId, slotType, slotIndex);
    return validation.ok ? "" : "management-slot-warning";
  }

  function createFranchiseSlotHtml(slotIndex = 0) {
    const slotType = "franchiseStars";
    const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
    const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
    const ref = getSlotRef(slotType, slotIndex);
    if (!wrestler) {
      return `
        <div class="management-slot management-franchise-slot ${getSlotWarningClass(slotType, slotIndex)}" data-slot-type="${slotType}" data-slot-index="${slotIndex}" data-slot-ref="${ref}">
          <div class="management-franchise-photo empty"></div>
          <div class="management-franchise-copy">
            <div class="management-franchise-name">프랜차이즈 스타</div>
            <div class="management-franchise-effect">드래그해서 배치</div>
          </div>
        </div>
      `;
    }
    const effect = getFranchiseSlotEffect({ franchiseStars: [wrestler.id] });
    return `
      <div class="management-slot management-franchise-slot filled ${getSlotWarningClass(slotType, slotIndex)}" data-slot-type="${slotType}" data-slot-index="${slotIndex}" data-slot-ref="${ref}">
        <button class="management-slot-remove" data-action="remove-management-slot" data-slot-type="${slotType}" data-slot-index="${slotIndex}">×</button>
        <div class="management-franchise-photo">
          <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:100%;height:100%;background-position:center 12%;")}"></div>
        </div>
        <div class="management-franchise-copy">
          <div class="management-franchise-name">${wrestler.name}</div>
          <div class="management-franchise-effect">${getFranchiseEffectSummary(effect)}</div>
        </div>
      </div>
    `;
  }

  function createSlotHtml(slotType, slotIndex = null, options = {}) {
    if (slotType === "franchiseStars") {
      return createFranchiseSlotHtml(slotIndex ?? 0);
    }
    const wrestlerId = getSlotWrestlerId(slotType, slotIndex);
    const slotLabel = options.slotLabel || getAssignmentLabel(slotType);
    const wrestler = wrestlerId ? findWrestlerById(wrestlerId) : null;
    const ref = getSlotRef(slotType, slotIndex);
    const trainingEffect = isTrainingSlotType(slotType) ? getTrainingSlotEffect(slotType, slotIndex) : null;
    const franchiseEffect = slotType === "franchiseStars" && wrestler ? getFranchiseGradeEffect(wrestler.grade) : null;
    const isLockedByIncident = isWeeklyIncidentSlot(slotType, slotIndex);
    const lockedBadge = isLockedByIncident ? `<div class="management-slot-lock">고정</div>` : "";
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
        <div class="management-slot ${getSlotWarningClass(slotType, slotIndex)} ${isLockedByIncident ? "management-slot-locked" : ""}" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}" data-slot-ref="${ref}">
          ${lockedBadge}
          <div class="management-slot-icon">${SLOT_ICONS[slotType]}</div>
          <div class="management-slot-title">${slotLabel}</div>
          <div class="management-slot-rule">${isLockedByIncident ? getWeeklyIncidentLockReason(slotType, slotIndex) : (options.ruleText || "드래그해서 배치")}</div>
        </div>
      `;
    }
    const tags = getWrestlerRoleTags(wrestler.id).map((label) => `<span class="management-slot-tag">${label}</span>`).join("");
    const effectMeta = trainingEffect?.bonusText
      || (franchiseEffect ? getFranchiseEffectSummary(franchiseEffect) : "");
    return `
      <div class="management-slot filled ${getSlotWarningClass(slotType, slotIndex)} ${isLockedByIncident ? "management-slot-locked" : ""}" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}" data-slot-ref="${ref}">
        ${isLockedByIncident
          ? lockedBadge
          : `<button class="management-slot-remove" data-action="remove-management-slot" data-slot-type="${slotType}" data-slot-index="${slotIndex ?? ""}">×</button>`}
        <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:50px;height:50px;")}"></div>
        <div class="management-slot-title">${slotLabel}</div>
        <div class="management-slot-name">${wrestler.name}</div>
        ${formatConditionBadge(wrestler)}
        <div class="management-slot-meta">${isLockedByIncident ? "돌발 이벤트 고정 출전" : (effectMeta || "")}</div>
        <div class="management-slot-tags">${tags}</div>
      </div>
    `;
  }

  function renderManagementMapMainContent() {
    cleanupDragState();
    ensureManagementMapState();
    ensureWeeklyIncidentForCurrentWeek({ announce: true });
    syncManagementMapToWeeklySchedule();
    const caps = getSlotCapacities();
    const currentOpponent = circuitApi.getCurrentCircuitOpponent?.() || null;
    const managementMap = ensureManagementMapState();
    const assignments = managementMap.assignments || getMapAssignments();
    const franchiseSlot = getFranchiseSlotEffect();
    const franchiseSummary = franchiseSlot
      ? getFranchiseEffectSummary(franchiseSlot)
      : "프랜차이즈 1명";
    const trainingSlotHtml = Array.from({ length: caps.training }, (_, index) => {
      const blueprint = getTrainingSlotBlueprint("training", index);
      return createSlotHtml("training", index, {
        slotLabel: blueprint?.label || `훈련 ${index + 1}`,
        ruleText: blueprint ? `${formatStatBonusText(blueprint.statBonuses)} · 경기 중복 가능` : "훈련 배치"
      });
    }).join("");
    const specialTrainingHtml = caps.specialTraining
      ? createSlotHtml("specialTraining", 0, {
        slotLabel: getTrainingSlotBlueprint("specialTraining", 0)?.label || "특훈",
        ruleText: `${formatStatBonusText(getTrainingSlotBlueprint("specialTraining", 0)?.statBonuses || {})} · 경기 중복 가능`
      })
      : `<div class="management-slot"><div class="management-slot-icon">${SLOT_ICONS.specialTraining}</div><div class="management-slot-title">스타 클래스</div><div class="management-slot-rule">체육관 3레벨 + 3000G 해금</div></div>`;
    const weeklyIssues = getWeeklyMatchAssignmentIssues(assignments, managementMap);
    const canStartWeek = weeklyIssues.length === 0;
    const startIssueText = weeklyIssues[0] || "";
    const rosterSort = getManagementRosterSortKey();
    const rosterCards = getSortedManagementRoster().map((wrestler) => getManagementRosterCardHtml(wrestler)).join("");
    const bookingRows = [
      createManagementBookingRowHtml("mainEventer", null, {
        stageLabel: "메인 이벤트",
        stageNote: currentOpponent ? `${currentOpponent.circuitLabel || "서킷"} 메인 매치` : "최종 클리어",
        slotLabel: "메인",
        ruleText: "컨디션 50% 이상",
        opponentLabel: currentOpponent?.name || "메인 상대"
      }),
      ...Array.from({ length: caps.sideFighters }, (_, index) => createManagementBookingRowHtml("sideFighters", index, {
        stageLabel: `라운드 ${index + 1}`,
        stageNote: "사이드 매치",
        slotLabel: `라운드 ${index + 1}`,
        ruleText: "컨디션 30% 이상",
        opponentLabel: `상대 ${index + 1}`
      }))
    ].join("");
    mainDynamicContentEl.innerHTML = `
      <div class="management-map-shell">
        <section class="management-booking-board">
          <div class="management-bottom-header">
            <div>
              <div class="management-bottom-title">이번 주 카드 배치</div>
              <div class="management-bottom-subtitle">메인 이벤트와 각 라운드를 한 줄씩 보고, 내 카드를 드래그해서 바로 배치합니다.</div>
            </div>
            <div class="management-booking-actions">
              ${startIssueText ? `<div class="management-start-issue">${startIssueText}</div>` : ""}
              <button class="management-weekly-button primary management-start-button ${canStartWeek ? "" : "is-blocked"}" data-action="start-managed-week" ${canStartWeek ? "" : 'aria-disabled="true"'}>경기 시작</button>
            </div>
          </div>
          <div class="management-match-list">
            ${bookingRows}
          </div>
        </section>
        <div class="management-map-top">
          <section class="management-zone brand">
            ${createZoneHeaderHtml("⭐ BRAND", "간판 구역", "프랜차이즈 스타 한 명으로 주간 고정 수익과 경기 버프를 만듭니다.", franchiseSummary)}
            <div class="management-zone-grid">
              ${createSlotHtml("franchiseStars", 0)}
            </div>
          </section>
          <section class="management-zone training">
            ${createZoneHeaderHtml("🏋 TRAINING", "훈련 구역", "주간 버프 슬롯입니다. 영구 성장 대신 이번 주 전투 보너스만 적용됩니다.", `훈련 ${caps.training} / 특훈 ${caps.specialTraining} / 코치 ${caps.coach}`)}
            <div class="management-zone-grid">
              <div class="management-slot-group">
                <div class="management-slot-group-label">주간 버프 슬롯</div>
                <div class="management-slot-strip">
                  ${trainingSlotHtml}
                  ${specialTrainingHtml}
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
            ${createZoneHeaderHtml("✚ RECOVERY", "회복 구역", "휴식과 집중 치료는 경기/훈련과 겹칠 수 없습니다.", `휴식 ${caps.rest} / 치료 ${caps.treatment}`)}
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
              <div class="management-bottom-subtitle">드래그로 배치하세요. 훈련은 경기/프랜차이즈와 중복 가능하지만, 훈련끼리와 회복 슬롯은 서로 겹치지 않습니다.</div>
            </div>
            <label class="management-sort-control">
              <span>정렬</span>
              <select data-action="management-sort-roster">
                <option value="grade" ${rosterSort === "grade" ? "selected" : ""}>등급순</option>
                <option value="condition" ${rosterSort === "condition" ? "selected" : ""}>컨디션순</option>
                <option value="power" ${rosterSort === "power" ? "selected" : ""}>능력치순</option>
              </select>
            </label>
          </div>
          <div class="management-roster-strip">
            ${rosterCards || '<div class="placeholder-box">보유 선수가 없습니다.</div>'}
          </div>
        </section>
      </div>
      <div class="management-preview" id="managementMapPreview"></div>
    `;
  }

  function getManagementUpgradeEffectText(action) {
    const managementMap = ensureManagementMapState();
    if (action === "upgrade-side-slots") {
      const next = SIDE_SLOT_LEVELS[managementMap.upgrades.sideFightLevel + 1];
      return next ? `사이드 슬롯 ${next.slots}칸` : "최대 확장";
    }
    if (action === "upgrade-rest-slots") {
      const next = REST_LEVELS[managementMap.upgrades.restLevel + 1];
      return next ? `휴식 ${next.slots}칸 · 회복 +${next.recovery}%` : "최대 확장";
    }
    if (action === "upgrade-treatment-slots") {
      const next = TREATMENT_LEVELS[managementMap.upgrades.treatmentLevel + 1];
      return next ? `치료 ${next.slots}칸 · 회복 -${next.healWeeks}주` : "최대 확장";
    }
    if (action === "unlock-special-training") {
      return managementMap.upgrades.specialTrainingUnlocked ? "스타성 +6 · 인기도 +6" : "특훈 1칸 해금";
    }
    if (action === "unlock-coach-slot") {
      return managementMap.upgrades.coachUnlocked ? "코치 슬롯 사용 가능" : "코치 1칸 해금";
    }
    return "";
  }

  function createUpgradeRow(title, costLabel, action, disabled = false) {
    const artPath = getManagementUpgradeImagePath(action);
    const effectText = getManagementUpgradeEffectText(action);
    return `
      <button class="management-upgrade-row ${disabled ? "is-disabled" : ""}" data-action="${action}" ${disabled ? "disabled" : ""}>
        <div class="management-upgrade-art"${artPath ? ` style="background-image:url('${artPath}');"` : ""}></div>
        <div class="management-upgrade-label">${title}</div>
        <div class="management-upgrade-cost">${costLabel}</div>
        <div class="management-upgrade-effect">${effectText}</div>
      </button>
    `;
  }

  function getManagementUpgradeConfirmData(action) {
    const managementMap = ensureManagementMapState();
    if (action === "upgrade-side-slots") {
      const current = SIDE_SLOT_LEVELS[managementMap.upgrades.sideFightLevel];
      const next = SIDE_SLOT_LEVELS[managementMap.upgrades.sideFightLevel + 1];
      if (!next) {
        return null;
      }
      return {
        title: "사이드 확대",
        cost: next.cost,
        currentText: `사이드 슬롯 ${current.slots}칸`,
        nextText: `사이드 슬롯 ${next.slots}칸`
      };
    }
    if (action === "upgrade-rest-slots") {
      const current = REST_LEVELS[managementMap.upgrades.restLevel];
      const next = REST_LEVELS[managementMap.upgrades.restLevel + 1];
      if (!next) {
        return null;
      }
      return {
        title: "숙소",
        cost: next.cost,
        currentText: `휴식 ${current.slots}칸 · 회복 +${current.recovery}%`,
        nextText: `휴식 ${next.slots}칸 · 회복 +${next.recovery}%`
      };
    }
    if (action === "upgrade-treatment-slots") {
      const current = TREATMENT_LEVELS[managementMap.upgrades.treatmentLevel];
      const next = TREATMENT_LEVELS[managementMap.upgrades.treatmentLevel + 1];
      if (!next) {
        return null;
      }
      return {
        title: "의무실",
        cost: next.cost,
        currentText: `치료 ${current.slots}칸 · 회복 -${current.healWeeks}주`,
        nextText: `치료 ${next.slots}칸 · 회복 -${next.healWeeks}주`
      };
    }
    if (action === "unlock-special-training") {
      if (managementMap.upgrades.specialTrainingUnlocked) {
        return null;
      }
      return {
        title: "스타 클래스",
        cost: 3000,
        currentText: "특훈 슬롯 없음",
        nextText: "특훈 1칸 해금 · 스타성 +6 / 인기도 +6"
      };
    }
    if (action === "unlock-coach-slot") {
      if (managementMap.upgrades.coachUnlocked) {
        return null;
      }
      return {
        title: "코치",
        cost: 2500,
        currentText: "코치 슬롯 없음",
        nextText: "코치 1칸 해금"
      };
    }
    return null;
  }

  function renderManagementSidePanel() {
    ensureManagementMapState();
    const sideFightLevel = ensureManagementMapState().upgrades.sideFightLevel;
    const restLevel = ensureManagementMapState().upgrades.restLevel;
    const treatmentLevel = ensureManagementMapState().upgrades.treatmentLevel;
    const nextSideUpgrade = SIDE_SLOT_LEVELS[sideFightLevel + 1] || null;
    const nextRestUpgrade = REST_LEVELS[restLevel + 1] || null;
    const nextTreatmentUpgrade = TREATMENT_LEVELS[treatmentLevel + 1] || null;
    sideListEl.innerHTML = `
      <div class="management-side-stack compact">
        <section class="management-side-card management-upgrade-panel">
          <div class="management-side-title">업그레이드</div>
          <div class="management-upgrade-list management-upgrade-gallery">
            ${createUpgradeRow(
              "사이드 확대",
              nextSideUpgrade ? `${formatNumber(nextSideUpgrade.cost)}G` : "MAX",
              "upgrade-side-slots",
              !nextSideUpgrade
            )}
            ${createUpgradeRow(
              "숙소",
              nextRestUpgrade ? `${formatNumber(nextRestUpgrade.cost)}G` : "MAX",
              "upgrade-rest-slots",
              !nextRestUpgrade
            )}
            ${createUpgradeRow(
              "의무실",
              nextTreatmentUpgrade ? `${formatNumber(nextTreatmentUpgrade.cost)}G` : "MAX",
              "upgrade-treatment-slots",
              !nextTreatmentUpgrade
            )}
            ${createUpgradeRow(
              "스타 클래스",
              ensureManagementMapState().upgrades.specialTrainingUnlocked ? "해금 완료" : `${formatNumber(3000)}G`,
              "unlock-special-training",
              ensureManagementMapState().upgrades.specialTrainingUnlocked
            )}
            ${createUpgradeRow(
              "코치",
              ensureManagementMapState().upgrades.coachUnlocked ? "해금 완료" : `${formatNumber(2500)}G`,
              "unlock-coach-slot",
              ensureManagementMapState().upgrades.coachUnlocked
            )}
          </div>
        </section>
      </div>
    `;
  }

  function handleUpgradeAction(action) {
    const managementMap = ensureManagementMapState();
    const confirmData = getManagementUpgradeConfirmData(action);
    if (!confirmData) {
      return;
    }
    const confirmText = [
      `${confirmData.title} 업그레이드`,
      "",
      `비용: ${formatNumber(confirmData.cost)}G 차감`,
      `현재: ${confirmData.currentText}`,
      `변경: ${confirmData.nextText}`,
      "",
      "진행할까요?"
    ].join("\n");
    if (action === "upgrade-side-slots") {
      const nextLevel = managementMap.upgrades.sideFightLevel + 1;
      const next = SIDE_SLOT_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      if (!window.confirm(confirmText)) return;
      gameState.gold -= next.cost;
      managementMap.upgrades.sideFightLevel = nextLevel;
    } else if (action === "upgrade-rest-slots") {
      const nextLevel = managementMap.upgrades.restLevel + 1;
      const next = REST_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      if (!window.confirm(confirmText)) return;
      gameState.gold -= next.cost;
      managementMap.upgrades.restLevel = nextLevel;
    } else if (action === "upgrade-treatment-slots") {
      const nextLevel = managementMap.upgrades.treatmentLevel + 1;
      const next = TREATMENT_LEVELS[nextLevel];
      if (!next) return;
      if (gameState.gold < next.cost) return window.alert("골드가 부족합니다.");
      if (!window.confirm(confirmText)) return;
      gameState.gold -= next.cost;
      managementMap.upgrades.treatmentLevel = nextLevel;
    } else if (action === "unlock-special-training") {
      if ((gameState.facilities?.gym?.level || 1) < 3) return window.alert("체육관 레벨 3 이상이 필요합니다.");
      if (managementMap.upgrades.specialTrainingUnlocked) return;
      if (gameState.gold < 3000) return window.alert("골드가 부족합니다.");
      if (!window.confirm(confirmText)) return;
      gameState.gold -= 3000;
      managementMap.upgrades.specialTrainingUnlocked = true;
    } else if (action === "unlock-coach-slot") {
      if (managementMap.upgrades.coachUnlocked) return;
      if (gameState.gold < 2500) return window.alert("골드가 부족합니다.");
      if (!window.confirm(confirmText)) return;
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
    if (rosterIcon) rosterIcon.textContent = "👥";
    if (rosterLabel) rosterLabel.textContent = "로스터";

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
      <div class="management-drag-ghost-visual">
        <div class="sprite-box" style="${getWrestlerVisualStyle(wrestler, "width:48px;height:48px;")}"></div>
      </div>
      <div class="management-roster-name">${wrestler.name}</div>
      <div class="management-roster-meta">${wrestler.grade}급 · ${getStyleMeta(wrestler.style).label}<br>PWR ${formatAverage(getWrestlerPower(wrestler))}</div>
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
    document.querySelectorAll(".management-drag-ghost").forEach((ghost) => ghost.remove());
    if (dragState.sourceCard) dragState.sourceCard.classList.remove("dragging-source");
    clearSlotTargetState();
    hideSlotPreview();
    dragState.wrestlerId = "";
    dragState.pointerId = null;
    dragState.pointerType = "";
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
    dragState.pointerType = event.pointerType || "mouse";
    dragState.sourceCard = card;
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
        if (event.pointerType === "mouse") return;
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
      card.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        if (event.target.closest("button")) return;
        beginDrag(card, wrestlerId, {
          preventDefault: () => event.preventDefault(),
          clientX: event.clientX,
          clientY: event.clientY,
          pointerId: null,
          pointerType: "mouse"
        });
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
    if (!dragState.active) return;
    if (dragState.pointerType === "mouse") return;
    if (dragState.pointerId !== event.pointerId) return;
    moveGhostCard(event);
    updateDragTarget(event);
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragState.active || dragState.pointerType !== "mouse") return;
    moveGhostCard(event);
    updateDragTarget(event);
  });

  window.addEventListener("pointerup", (event) => {
    if (dragState.touchPending && dragState.touchTimer) {
      clearTimeout(dragState.touchTimer);
      dragState.touchTimer = null;
      dragState.touchPending = false;
    }
    if (!dragState.active) return;
    if (dragState.pointerType === "mouse") return;
    if (dragState.pointerId !== event.pointerId) return;
    if (dragState.targetSlot) {
      const slotType = dragState.targetSlot.dataset.slotType;
      const slotIndex = dragState.targetSlot.dataset.slotIndex === "" || dragState.targetSlot.dataset.slotIndex == null ? null : Number(dragState.targetSlot.dataset.slotIndex);
      assignWrestlerToSlot(dragState.wrestlerId, slotType, slotIndex);
      cleanupDragState();
      renderActiveTab();
      saveGameState();
      return;
    }
    cleanupDragState();
  });

  window.addEventListener("mouseup", () => {
    if (!dragState.active || dragState.pointerType !== "mouse") return;
    if (dragState.targetSlot) {
      const slotType = dragState.targetSlot.dataset.slotType;
      const slotIndex = dragState.targetSlot.dataset.slotIndex === "" || dragState.targetSlot.dataset.slotIndex == null ? null : Number(dragState.targetSlot.dataset.slotIndex);
      assignWrestlerToSlot(dragState.wrestlerId, slotType, slotIndex);
      cleanupDragState();
      renderActiveTab();
      saveGameState();
      return;
    }
    cleanupDragState();
  });

  window.addEventListener("pointercancel", (event) => {
    if (!dragState.active) return;
    if (dragState.pointerType === "mouse") return;
    if (dragState.pointerId !== event.pointerId) return;
    cleanupDragState();
  });
  window.addEventListener("blur", cleanupDragState);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cleanupDragState();
    }
  });

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
    mainDynamicContentEl.querySelector('[data-action="management-sort-roster"]')?.addEventListener("change", (event) => {
      const nextValue = String(event.target.value || "grade");
      ensureManagementMapState().rosterSort = ["grade", "condition", "power"].includes(nextValue) ? nextValue : "grade";
      renderActiveTab();
      saveGameState();
    });
    mainDynamicContentEl.querySelector('[data-action="start-managed-week"]')?.addEventListener("click", startWeeklyMatches);
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

  TAB_CONTENT.roster.mainTitle = "👥 로스터";
  TAB_CONTENT.roster.mainSubtitle = () => `Week ${gameState.week} · 로스터 편성`;
  TAB_CONTENT.roster.sideTitle = "로스터";
  TAB_CONTENT.roster.sideSubtitle = "";
  TAB_CONTENT.roster.mainInfo = [];
  TAB_CONTENT.cards.mainTitle = () => `⚔️ Week ${gameState.week} 주간 운영`;
  TAB_CONTENT.cards.mainSubtitle = () => `${circuitApi.getCurrentCircuitOpponent?.()?.name || "서킷 완료"} · 운영 편성`;
  TAB_CONTENT.cards.sideTitle = "주간 실행";
  TAB_CONTENT.cards.sideSubtitle = "업그레이드를 관리합니다.";
  TAB_CONTENT.cards.mainInfo = [
    { label: "현재 랭킹", value: () => `${circuitApi.getCircuitProgressState?.().currentRank || 1}위` },
    { label: "메인 승률", value: () => {
      const opponent = circuitApi.getCurrentCircuitOpponent?.();
      const wrestler = findWrestlerById(getMapAssignments().mainEventer);
      return opponent && wrestler ? `${circuitApi.estimateWinRate?.(wrestler, opponent) || 0}%` : "미배치";
    } },
    { label: "훈련 배치", value: () => `${getTrainingAssignmentsSummary().length}명` }
  ];
  TAB_CONTENT.cards.mainTitle = TAB_CONTENT.roster.mainTitle;
  TAB_CONTENT.cards.mainSubtitle = TAB_CONTENT.roster.mainSubtitle;
  TAB_CONTENT.cards.sideTitle = TAB_CONTENT.roster.sideTitle;
  TAB_CONTENT.cards.sideSubtitle = TAB_CONTENT.roster.sideSubtitle;
  TAB_CONTENT.cards.mainInfo = TAB_CONTENT.roster.mainInfo;
  window.__RING_DYNASTY_MANAGEMENT_BUFFS__ = {
    getBattleReadyStats: getManagementBattleReadyStats,
    getBattleBonusesForWrestler: getManagementBattleBonusesForWrestler,
    getTrainingAssignmentsSummary,
    getFranchiseSlotEffect
  };
}
