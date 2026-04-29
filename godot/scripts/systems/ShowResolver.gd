class_name ShowResolver
extends RefCounted

static func resolve_segment(state: RDGameState, segment: Dictionary, choice: Dictionary) -> Dictionary:
	var left := state.get_wrestler(segment.get("participants", ["", ""])[0])
	var right := state.get_wrestler(segment.get("participants", ["", ""])[1])
	var base_reaction := int(segment.get("expected_reaction", 50))
	var reaction_delta := int(choice.get("reaction", 0)) + randi_range(-5, 6)
	var crowd_reaction := clampi(base_reaction + reaction_delta + int(state.hype / 12) + FacilityManager.production_bonus(state), 0, 100)
	var risk := clampi(int(segment.get("risk", 0)) + int(choice.get("risk", 0)) - FacilityManager.medical_risk_reduction(state), 0, 100)
	var result := {
		"segment_id": segment.get("id", ""),
		"title": segment.get("title", ""),
		"type": segment.get("type", ""),
		"choice": choice.get("label", ""),
		"crowd_reaction": crowd_reaction,
		"risk": risk,
		"note": "",
		"winner_id": "",
		"loser_id": ""
	}

	var type_name := String(segment.get("type", ""))
	if type_name == "match" or type_name == "main_event":
		var options := {}
		if choice.get("effect", "") == "upset":
			options["right_bonus"] = 10
		var match_result := MatchSimulator.simulate(left, right, options)
		result.merge(match_result, true)
		result["note"] = match_result.get("highlight", "")
		_apply_match_result(state, match_result)
		var title_note := ChampionshipManager.apply_match_result(state, segment, result)
		if title_note != "":
			result["note"] = "%s %s" % [result["note"], title_note]
	else:
		result["note"] = _story_note(type_name, left, right, choice)

	var rivalry_id := String(segment.get("rivalry_id", ""))
	var used_rivalry_ids: Array = []
	if rivalry_id != "":
		used_rivalry_ids.append(rivalry_id)
		for rivalry in state.rivalries:
			if rivalry.get("id", "") == rivalry_id:
				RivalryManager.apply_heat(rivalry, int(choice.get("heat", 0)), result["note"])
				if bool(segment.get("ppv_resolution", false)) or choice.get("effect", "") == "closure":
					RivalryManager.apply_heat(rivalry, -35, "The feud reached a major turning point.")
				break

	for id in segment.get("participants", []):
		var fatigue := -6 if type_name in ["match", "main_event"] else -2
		state.apply_wrestler_delta(id, fatigue + FacilityManager.training_recovery(state), 2, int(crowd_reaction / 35))

	result["used_rivalries"] = used_rivalry_ids
	return result

static func finalize_show(state: RDGameState, show: Dictionary, segment_results: Array) -> Dictionary:
	var total := 0
	var used_rivalries: Array = []
	for result in segment_results:
		total += int(result.get("crowd_reaction", 0))
		for rivalry_id in result.get("used_rivalries", []):
			if not used_rivalries.has(rivalry_id):
				used_rivalries.append(rivalry_id)
	var average := int(total / maxi(1, segment_results.size()))
	var rating := "S" if average >= 92 else "A" if average >= 84 else "B+" if average >= 76 else "B" if average >= 68 else "C"
	var base_income := int(BalanceManager.value("show_income.ppv", 180)) if bool(show.get("is_ppv", false)) else int(BalanceManager.value("show_income.weekly", 90))
	var income := int(float(average * base_income) * FacilityManager.income_multiplier(state))
	var fame_gain := maxi(1, int(average / (9 if bool(show.get("is_ppv", false)) else 15)))
	state.gold += income
	state.fame += fame_gain
	state.hype = clampi(int(state.hype * 0.45 + average * 0.55), 0, 100)
	RivalryManager.cool_unused(state, used_rivalries)
	var hooks := _next_hooks(state, show, segment_results)
	var result := {
		"show_name": show.get("name", ""),
		"week": state.week,
		"rating": rating,
		"crowd_reaction": average,
		"income": income,
		"fame_gain": fame_gain,
		"hooks": hooks,
		"segments": segment_results
	}
	result["news"] = NewsManager.build_show_report(state, show, result)
	result["event"] = NewsManager.build_random_event(state)
	state.last_show_result = result
	LegacyManager.evaluate(state)
	state.current_show = {}
	state.week += 1
	return result

static func _apply_match_result(state: RDGameState, result: Dictionary) -> void:
	for wrestler in state.roster:
		if wrestler.get("id", "") == result.get("winner_id", ""):
			wrestler["wins"] = int(wrestler.get("wins", 0)) + 1
			wrestler["morale"] = clampi(int(wrestler.get("morale", 70)) + 4, 0, 100)
		if wrestler.get("id", "") == result.get("loser_id", ""):
			wrestler["losses"] = int(wrestler.get("losses", 0)) + 1
			wrestler["morale"] = clampi(int(wrestler.get("morale", 70)) - 3, 0, 100)

static func _story_note(type_name: String, left: Dictionary, right: Dictionary, choice: Dictionary) -> String:
	if type_name == "opening_promo":
		return "%s and %s turned the opening mic time into a must-see confrontation." % [left.get("name", "Star"), right.get("name", "Rival")]
	if type_name == "backstage":
		return "Cameras caught %s and %s in a heated backstage pull-apart." % [left.get("name", "Star"), right.get("name", "Rival")]
	if type_name == "interference":
		return "%s crossed the line and forced GM control into the story." % right.get("name", "A rival")
	if type_name == "contract_signing":
		return "The contract table did not survive, but the PPV match now feels unavoidable."
	return "The segment moved the show forward."

static func _next_hooks(state: RDGameState, show: Dictionary, segment_results: Array) -> Array:
	var hooks: Array = []
	for rivalry in state.rivalries:
		if int(rivalry.get("heat", 0)) >= 82:
			var a := state.get_wrestler(rivalry.get("a", ""))
			var b := state.get_wrestler(rivalry.get("b", ""))
			hooks.append("%s vs %s is hot enough for a PPV stipulation." % [a.get("name", "A"), b.get("name", "B")])
	for result in segment_results:
		if String(result.get("finish", "")) == "FLASH_ROLLUP":
			hooks.append("Fans are arguing about the flash finish from %s." % result.get("title", "the match"))
	if hooks.is_empty():
		hooks.append("The GM desk is scouting a fresh contender for next week.")
	return hooks.slice(0, 4)
