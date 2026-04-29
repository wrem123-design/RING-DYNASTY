class_name ChampionshipManager
extends RefCounted

static func definitions() -> Dictionary:
	return {
		"world": {"label": "World Championship", "prestige": 100},
		"womens": {"label": "Women's Championship", "prestige": 92}
	}

static func champion_name(state: RDGameState, title_key: String) -> String:
	var champion := state.get_wrestler(String(state.champions.get(title_key, "")))
	return champion.get("name", "Vacant")

static func title_for_rivalry(state: RDGameState, rivalry: Dictionary) -> String:
	var a := String(rivalry.get("a", ""))
	var b := String(rivalry.get("b", ""))
	for title_key in definitions().keys():
		var holder := String(state.champions.get(title_key, ""))
		if holder == a or holder == b:
			return title_key
	return "world"

static func title_summary(state: RDGameState) -> String:
	var lines: Array = []
	for title_key in definitions().keys():
		var definition: Dictionary = definitions()[title_key]
		var champion := state.get_wrestler(String(state.champions.get(title_key, "")))
		lines.append("%s\nChampion: %s\nPrestige: %d" % [
			definition.get("label", title_key),
			champion.get("name", "Vacant"),
			int(definition.get("prestige", 80))
		])
	return "\n\n".join(lines)

static func is_champion(state: RDGameState, wrestler_id: String) -> bool:
	for key in state.champions.keys():
		if String(state.champions.get(key, "")) == wrestler_id:
			return true
	return false

static func apply_match_result(state: RDGameState, segment: Dictionary, result: Dictionary) -> String:
	if not bool(segment.get("title_match", false)):
		return ""
	var title_key := String(segment.get("title_key", "world"))
	if not definitions().has(title_key):
		title_key = "world"
	var winner_id := String(result.get("winner_id", ""))
	if winner_id == "":
		return ""
	var title_name := String(definitions()[title_key].get("label", "title"))
	if String(state.champions.get(title_key, "")) == winner_id:
		return "%s retained the %s." % [state.get_wrestler(winner_id).get("name", "Champion"), title_name]
	state.champions[title_key] = winner_id
	state.title_history.append({
		"week": state.week,
		"title": title_key,
		"champion_id": winner_id,
		"note": "%s captured the %s." % [state.get_wrestler(winner_id).get("name", "New Champion"), title_name]
	})
	state.title_history = state.title_history.slice(maxi(0, state.title_history.size() - 20))
	LegacyManager.evaluate(state)
	return "%s captured the %s." % [state.get_wrestler(winner_id).get("name", "New Champion"), title_name]

static func history_summary(state: RDGameState) -> String:
	if state.title_history.is_empty():
		return "No title history yet."
	var lines: Array = []
	var start := maxi(0, state.title_history.size() - 8)
	for entry in state.title_history.slice(start):
		var champion := state.get_wrestler(String(entry.get("champion_id", "")))
		var definition: Dictionary = definitions().get(String(entry.get("title", "")), {})
		lines.append("Week %d - %s: %s\n%s" % [
			int(entry.get("week", 0)),
			definition.get("label", entry.get("title", "Title")),
			champion.get("name", "Unknown"),
			entry.get("note", "")
		])
	return "\n\n".join(lines)
