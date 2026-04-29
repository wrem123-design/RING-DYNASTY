class_name RivalryManager
extends RefCounted

static func stage_label(heat: int) -> String:
	if heat >= 85:
		return "PPV 결착 직전"
	if heat >= 68:
		return "폭발 직전"
	if heat >= 45:
		return "갈등 심화"
	return "불씨"

static func find_between(state: RDGameState, a_id: String, b_id: String) -> Dictionary:
	for rivalry in state.rivalries:
		var a := String(rivalry.get("a", ""))
		var b := String(rivalry.get("b", ""))
		if (a == a_id and b == b_id) or (a == b_id and b == a_id):
			return rivalry
	return {}

static func hottest(state: RDGameState) -> Dictionary:
	var best: Dictionary = {}
	for rivalry in state.rivalries:
		if best.is_empty() or int(rivalry.get("heat", 0)) > int(best.get("heat", 0)):
			best = rivalry
	return best

static func apply_heat(rivalry: Dictionary, amount: int, note: String) -> void:
	if rivalry.is_empty():
		return
	rivalry["heat"] = clampi(int(rivalry.get("heat", 0)) + amount, 0, 100)
	rivalry["freshness"] = clampi(int(rivalry.get("freshness", 70)) + (6 if amount >= 0 else -10), 0, 100)
	rivalry["stage"] = 3 if int(rivalry["heat"]) >= 85 else 2 if int(rivalry["heat"]) >= 68 else 1
	var history: Array = rivalry.get("history", [])
	history.append(note)
	rivalry["history"] = history.slice(maxi(0, history.size() - 5))

static func cool_unused(state: RDGameState, used_ids: Array) -> void:
	for rivalry in state.rivalries:
		if used_ids.has(rivalry.get("id", "")):
			continue
		rivalry["freshness"] = clampi(int(rivalry.get("freshness", 70)) - 12, 0, 100)
		rivalry["heat"] = clampi(int(rivalry.get("heat", 0)) - 4, 0, 100)

static func create_if_needed(state: RDGameState, a_id: String, b_id: String, type_name: String, heat: int, note: String) -> Dictionary:
	var existing := find_between(state, a_id, b_id)
	if not existing.is_empty():
		apply_heat(existing, heat, note)
		return existing
	var rivalry := {
		"id": "rivalry_%s_%s_%d" % [a_id, b_id, state.week],
		"a": a_id,
		"b": b_id,
		"type": type_name,
		"heat": clampi(heat, 0, 100),
		"freshness": 100,
		"stage": 1,
		"history": [note]
	}
	state.rivalries.append(rivalry)
	return rivalry

