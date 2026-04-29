class_name RecruitmentManager
extends RefCounted

const RECRUIT_POOL_PATH := "res://data/recruit_pool.json"
const GENERATED_POOL_PATH := "res://data/generated_roster_seed.json"

static func recruit_cost(pack_type: String) -> int:
	match pack_type:
		"premium":
			return int(BalanceManager.value("recruit_costs.premium", 9000))
		"legend":
			return int(BalanceManager.value("recruit_costs.legend", 18000))
		_:
			return int(BalanceManager.value("recruit_costs.standard", 4000))

static func pool_stats(state: RDGameState) -> Dictionary:
	var pool := _available_pool(state)
	var owned := {}
	for wrestler in state.roster:
		owned[String(wrestler.get("id", ""))] = true
	var grade_counts := {}
	var owned_count := 0
	for recruit in pool:
		var grade := String(recruit.get("grade", "B"))
		grade_counts[grade] = int(grade_counts.get(grade, 0)) + 1
		if owned.has(String(recruit.get("id", ""))):
			owned_count += 1
	return {
		"total": pool.size(),
		"owned": owned_count,
		"available": maxi(0, pool.size() - owned_count),
		"grades": grade_counts
	}

static func roll_recruit(state: RDGameState, pack_type: String = "standard") -> Dictionary:
	var cost := recruit_cost(pack_type)
	if state.gold < cost:
		return {"ok": false, "message": "Not enough gold.", "cost": cost}
	var pool := _available_pool(state)
	if pool.is_empty():
		return {"ok": false, "message": "No available recruits remain.", "cost": cost}
	var recruit := _weighted_pick(pool, pack_type)
	state.gold -= cost
	var duplicate := not state.get_wrestler(recruit.get("id", "")).is_empty()
	if duplicate:
		state.fame += _duplicate_fame(recruit)
		return {
			"ok": true,
			"duplicate": true,
			"recruit": recruit,
			"cost": cost,
			"message": "%s duplicate converted into fame." % recruit.get("name", "Recruit")
		}
	recruit = recruit.duplicate(true)
	recruit["condition"] = 100
	recruit["morale"] = 72
	recruit["pop"] = int(recruit.get("stats", {}).get("fame", 70))
	recruit["wins"] = 0
	recruit["losses"] = 0
	state.roster.append(recruit)
	_maybe_create_debut_rivalry(state, recruit)
	LegacyManager.evaluate(state)
	return {
		"ok": true,
		"duplicate": false,
		"recruit": recruit,
		"cost": cost,
		"message": "%s joined the roster." % recruit.get("name", "Recruit")
	}

static func _available_pool(state: RDGameState) -> Array:
	var pool: Array = []
	pool.append_array(_load_pool(RECRUIT_POOL_PATH))
	pool.append_array(_load_pool(GENERATED_POOL_PATH))
	var seen := {}
	var unique: Array = []
	for recruit in pool:
		var id := String(recruit.get("id", ""))
		if id == "" or seen.has(id):
			continue
		}
		seen[id] = true
		unique.append(recruit)
	return unique

static func _load_pool(path: String) -> Array:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return []
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if typeof(parsed) == TYPE_ARRAY else []

static func _weighted_pick(pool: Array, pack_type: String) -> Dictionary:
	var weighted: Array = []
	for recruit in pool:
		var grade := String(recruit.get("grade", "C"))
		var weight := _grade_weight(grade, pack_type)
		for index in range(weight):
			weighted.append(recruit)
	return weighted.pick_random() if not weighted.is_empty() else pool.pick_random()

static func _grade_weight(grade: String, pack_type: String) -> int:
	var standard := {"A": 8, "S": 3, "LEGEND": 1}
	var premium := {"A": 6, "S": 5, "LEGEND": 2}
	var legend := {"A": 3, "S": 5, "LEGEND": 5}
	var table: Dictionary = legend if pack_type == "legend" else premium if pack_type == "premium" else standard
	return int(table.get(grade, 10))

static func _duplicate_fame(recruit: Dictionary) -> int:
	match String(recruit.get("grade", "C")):
		"LEGEND":
			return 8
		"S":
			return 5
		"A":
			return 3
		_:
			return 1

static func _maybe_create_debut_rivalry(state: RDGameState, recruit: Dictionary) -> void:
	if state.roster.size() < 2:
		return
	var opponent := state.roster[randi_range(0, state.roster.size() - 2)]
	if opponent.get("id", "") == recruit.get("id", ""):
		return
	if recruit.get("alignment", "") != opponent.get("alignment", ""):
		RivalryManager.create_if_needed(
			state,
			recruit.get("id", ""),
			opponent.get("id", ""),
			"debut",
			28,
			"%s debuted and immediately crossed paths with %s." % [recruit.get("name", "A recruit"), opponent.get("name", "a roster star")]
		)
