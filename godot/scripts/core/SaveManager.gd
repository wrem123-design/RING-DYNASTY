class_name SaveManager
extends RefCounted

const SAVE_PATH := "user://ring_dynasty_save.json"
const CURRENT_VERSION := 2

static func save_state(state: RDGameState) -> bool:
	var payload := {
		"save_version": CURRENT_VERSION,
		"week": state.week,
		"gold": state.gold,
		"fame": state.fame,
		"hype": state.hype,
		"roster": state.roster,
		"rivalries": state.rivalries,
		"champions": state.champions,
		"title_history": state.title_history,
		"facilities": state.facilities,
		"legacy": state.legacy,
		"last_show_result": state.last_show_result
	}
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(payload, "\t"))
	return true

static func load_state(state: RDGameState) -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return false
	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return false
	state.week = int(parsed.get("week", state.week))
	state.save_version = int(parsed.get("save_version", 0))
	state.gold = int(parsed.get("gold", state.gold))
	state.fame = int(parsed.get("fame", state.fame))
	state.hype = int(parsed.get("hype", state.hype))
	state.roster = parsed.get("roster", state.roster)
	state.rivalries = parsed.get("rivalries", state.rivalries)
	state.champions = parsed.get("champions", state.champions)
	if not state.champions.has("world"):
		state.champions["world"] = "roman_reigns"
	if not state.champions.has("womens"):
		state.champions["womens"] = "rhea_ripley"
	state.title_history = parsed.get("title_history", state.title_history)
	state.facilities = parsed.get("facilities", state.facilities)
	state.legacy = parsed.get("legacy", state.legacy)
	state.last_show_result = parsed.get("last_show_result", {})
	_migrate(state)
	state.current_show = {}
	return true

static func _migrate(state: RDGameState) -> void:
	if state.save_version < 1:
		FacilityManager.ensure_defaults(state)
	if state.save_version < 2:
		LegacyManager.ensure_defaults(state)
		if state.title_history.is_empty():
			state.title_history = [
				{"week": 1, "title": "world", "champion_id": state.champions.get("world", "roman_reigns"), "note": "Migrated World Champion"},
				{"week": 1, "title": "womens", "champion_id": state.champions.get("womens", "rhea_ripley"), "note": "Migrated Women's Champion"}
			]
	state.save_version = CURRENT_VERSION
