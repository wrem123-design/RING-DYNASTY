class_name FacilityManager
extends RefCounted

static func definitions() -> Dictionary:
	return {
		"arena": {
			"label": "Arena",
			"desc": "Increases show income and PPV gate.",
			"base_cost": 8000,
			"max": 5
		},
		"training_center": {
			"label": "Training Center",
			"desc": "Improves roster condition recovery after shows.",
			"base_cost": 6500,
			"max": 5
		},
		"medical": {
			"label": "Medical Room",
			"desc": "Reduces risk damage from chaotic segments.",
			"base_cost": 5500,
			"max": 5
		},
		"production": {
			"label": "Production Truck",
			"desc": "Improves crowd reaction from promos and spectacle.",
			"base_cost": 7000,
			"max": 5
		}
	}

static func ensure_defaults(state: RDGameState) -> void:
	if state.facilities.is_empty():
		state.facilities = {"arena": 1, "training_center": 1, "medical": 1, "production": 1}
	for key in definitions().keys():
		if not state.facilities.has(key):
			state.facilities[key] = 1

static func upgrade_cost(state: RDGameState, key: String) -> int:
	ensure_defaults(state)
	var definition: Dictionary = definitions().get(key, {})
	var level := int(state.facilities.get(key, 1))
	return int(definition.get("base_cost", 5000)) * level

static func can_upgrade(state: RDGameState, key: String) -> bool:
	ensure_defaults(state)
	var definition: Dictionary = definitions().get(key, {})
	var level := int(state.facilities.get(key, 1))
	return not definition.is_empty() and level < int(definition.get("max", 5)) and state.gold >= upgrade_cost(state, key)

static func upgrade(state: RDGameState, key: String) -> Dictionary:
	ensure_defaults(state)
	var definition: Dictionary = definitions().get(key, {})
	if definition.is_empty():
		return {"ok": false, "message": "Unknown facility."}
	var level := int(state.facilities.get(key, 1))
	if level >= int(definition.get("max", 5)):
		return {"ok": false, "message": "%s is already max level." % definition.get("label", key)}
	var cost := upgrade_cost(state, key)
	if state.gold < cost:
		return {"ok": false, "message": "Not enough gold for %s." % definition.get("label", key), "cost": cost}
	state.gold -= cost
	state.facilities[key] = level + 1
	LegacyManager.evaluate(state)
	return {
		"ok": true,
		"message": "%s upgraded to level %d." % [definition.get("label", key), level + 1],
		"cost": cost
	}

static func income_multiplier(state: RDGameState) -> float:
	ensure_defaults(state)
	return 1.0 + (float(int(state.facilities.get("arena", 1)) - 1) * 0.12)

static func production_bonus(state: RDGameState) -> int:
	ensure_defaults(state)
	return (int(state.facilities.get("production", 1)) - 1) * 3

static func medical_risk_reduction(state: RDGameState) -> int:
	ensure_defaults(state)
	return (int(state.facilities.get("medical", 1)) - 1) * 4

static func training_recovery(state: RDGameState) -> int:
	ensure_defaults(state)
	return (int(state.facilities.get("training_center", 1)) - 1) * 2

static func summary(state: RDGameState) -> String:
	ensure_defaults(state)
	var lines: Array = []
	for key in definitions().keys():
		var definition: Dictionary = definitions()[key]
		var level := int(state.facilities.get(key, 1))
		var max_level := int(definition.get("max", 5))
		var cost_text := "MAX" if level >= max_level else "%dG" % upgrade_cost(state, key)
		lines.append("%s Lv.%d/%d - next %s\n%s" % [
			definition.get("label", key),
			level,
			max_level,
			cost_text,
			definition.get("desc", "")
		])
	return "\n\n".join(lines)
