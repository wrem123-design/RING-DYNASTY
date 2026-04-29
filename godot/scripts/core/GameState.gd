class_name RDGameState
extends RefCounted

var week: int = 1
var gold: int = 25000
var fame: int = 12
var hype: int = 54
var roster: Array = []
var rivalries: Array = []
var champions: Dictionary = {
	"world": "roman_reigns",
	"womens": "rhea_ripley"
}
var title_history: Array = []
var facilities: Dictionary = {}
var legacy: Dictionary = {}
var current_show: Dictionary = {}
var last_show_result: Dictionary = {}
var save_version: int = 2

func load_defaults() -> void:
	roster = _load_wrestlers()
	gold = int(BalanceManager.value("starting_gold", gold))
	fame = int(BalanceManager.value("starting_fame", fame))
	hype = int(BalanceManager.value("starting_hype", hype))
	facilities = {
		"arena": 1,
		"training_center": 1,
		"medical": 1,
		"production": 1
	}
	legacy = {
		"points": 0,
		"unlocked": [],
		"shop_purchases": [],
		"best_rating": "C"
	}
	title_history = [
		{"week": 1, "title": "world", "champion_id": "roman_reigns", "note": "Initial World Champion"},
		{"week": 1, "title": "womens", "champion_id": "rhea_ripley", "note": "Initial Women's Champion"}
	]
	rivalries = [
		{
			"id": "rivalry_roman_seth",
			"a": "roman_reigns",
			"b": "seth_rollins",
			"type": "title",
			"heat": 62,
			"freshness": 86,
			"stage": 1,
			"history": ["Seth demanded one more shot at the world title."]
		},
		{
			"id": "rivalry_rhea_becky",
			"a": "rhea_ripley",
			"b": "becky_lynch",
			"type": "grudge",
			"heat": 55,
			"freshness": 90,
			"stage": 1,
			"history": ["A backstage staredown turned into a pull-apart."]
		}
	]

func is_ppv_week() -> bool:
	return week % 4 == 0

func weeks_until_ppv() -> int:
	if is_ppv_week():
		return 0
	return 4 - (week % 4)

func get_wrestler(id: String) -> Dictionary:
	for wrestler in roster:
		if wrestler.get("id", "") == id:
			return wrestler
	return {}

func get_roster_without(ids: Array) -> Array:
	var result: Array = []
	for wrestler in roster:
		if not ids.has(wrestler.get("id", "")):
			result.append(wrestler)
	return result

func apply_wrestler_delta(id: String, condition_delta: int, morale_delta: int, pop_delta: int) -> void:
	for wrestler in roster:
		if wrestler.get("id", "") != id:
			continue
		wrestler["condition"] = clampi(int(wrestler.get("condition", 100)) + condition_delta, 0, 100)
		wrestler["morale"] = clampi(int(wrestler.get("morale", 70)) + morale_delta, 0, 100)
		wrestler["pop"] = clampi(int(wrestler.get("pop", 60)) + pop_delta, 0, 100)
		return

func _load_wrestlers() -> Array:
	var file := FileAccess.open("res://data/wrestlers.json", FileAccess.READ)
	if file == null:
		push_error("Missing wrestlers.json")
		return []
	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_ARRAY:
		push_error("Invalid wrestlers.json")
		return []
	for wrestler in parsed:
		wrestler["condition"] = 100
		wrestler["morale"] = 72
		wrestler["pop"] = int(wrestler.get("stats", {}).get("fame", 70))
		wrestler["wins"] = 0
		wrestler["losses"] = 0
	return parsed
