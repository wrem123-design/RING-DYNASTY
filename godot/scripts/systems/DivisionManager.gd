class_name DivisionManager
extends RefCounted

const WOMENS_IDS := {
	"asuka": true,
	"bayley": true,
	"becky_lynch": true,
	"bianca_belair": true,
	"rhea_ripley": true,
	"charlotte_flair": true,
	"iyo_sky": true,
	"jade_cargill": true
}

static func division_for_wrestler(wrestler: Dictionary) -> String:
	if bool(WOMENS_IDS.get(String(wrestler.get("id", "")), false)):
		return "womens"
	return "world"

static func rankings(state: RDGameState, division_key: String) -> Array:
	var rows: Array = []
	for wrestler in state.roster:
		if division_for_wrestler(wrestler) != division_key:
			continue
		var stats: Dictionary = wrestler.get("stats", {})
		var score := int(wrestler.get("pop", 60))
		score += int(wrestler.get("wins", 0)) * 8
		score -= int(wrestler.get("losses", 0)) * 4
		score += int(wrestler.get("morale", 70)) / 5
		score += int(stats.get("fame", 60)) / 4
		if ChampionshipManager.is_champion(state, wrestler.get("id", "")):
			score += 20
		rows.append({"wrestler": wrestler, "score": score})
	rows.sort_custom(func(a: Dictionary, b: Dictionary) -> bool:
		return int(a.get("score", 0)) > int(b.get("score", 0))
	)
	return rows

static func top_contender(state: RDGameState, division_key: String) -> Dictionary:
	var champion_id := String(state.champions.get(division_key, ""))
	for row in rankings(state, division_key):
		var wrestler: Dictionary = row.get("wrestler", {})
		if wrestler.get("id", "") != champion_id:
			return wrestler
	return {}

static func create_title_rivalry(state: RDGameState, division_key: String) -> Dictionary:
	var champion := state.get_wrestler(String(state.champions.get(division_key, "")))
	var contender := top_contender(state, division_key)
	if champion.is_empty() or contender.is_empty():
		return {"ok": false, "message": "No valid champion or contender."}
	var rivalry := RivalryManager.create_if_needed(
		state,
		champion.get("id", ""),
		contender.get("id", ""),
		"title",
		35,
		"%s was named top contender for %s." % [contender.get("name", "A challenger"), ChampionshipManager.definitions().get(division_key, {}).get("label", "a title")]
	)
	return {
		"ok": true,
		"message": "%s vs %s is now a title rivalry." % [champion.get("name", "Champion"), contender.get("name", "Contender")],
		"rivalry": rivalry
	}

static func ranking_summary(state: RDGameState, division_key: String) -> String:
	var definition: Dictionary = ChampionshipManager.definitions().get(division_key, {})
	var lines: Array = ["[b]%s Rankings[/b]" % definition.get("label", division_key)]
	var rank := 1
	for row in rankings(state, division_key).slice(0, 8):
		var wrestler: Dictionary = row.get("wrestler", {})
		var champion_mark := " (C)" if String(state.champions.get(division_key, "")) == String(wrestler.get("id", "")) else ""
		lines.append("%d. %s%s - score %d / %d-%d / POP %d" % [
			rank,
			wrestler.get("name", "Unknown"),
			champion_mark,
			int(row.get("score", 0)),
			int(wrestler.get("wins", 0)),
			int(wrestler.get("losses", 0)),
			int(wrestler.get("pop", 0))
		])
		rank += 1
	return "\n".join(lines)

