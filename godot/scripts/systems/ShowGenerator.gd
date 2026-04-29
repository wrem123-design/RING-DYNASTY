class_name ShowGenerator
extends RefCounted

static func generate(state: RDGameState) -> Dictionary:
	var is_ppv := state.is_ppv_week()
	var show_name := "RING DYNASTY MANIA" if state.week % 16 == 0 else "PREMIUM LIVE EVENT" if is_ppv else "MONDAY NIGHT RAW"
	var top_rivalry := RivalryManager.hottest(state)
	var rivalry_pair := _rivalry_wrestlers(state, top_rivalry)
	var title_key := ChampionshipManager.title_for_rivalry(state, top_rivalry)
	var segments: Array = []

	segments.append(_promo_segment(state, rivalry_pair, top_rivalry, is_ppv))
	segments.append(_match_segment(state, "showcase_match", "Showcase Match", _pick_pair(state, rivalry_pair), false, ""))
	if is_ppv:
		segments.append(_contract_segment(state, rivalry_pair, top_rivalry))
		segments.append(_match_segment(state, "special_attraction", "Special Attraction", _pick_pair(state, rivalry_pair), false, ""))
		segments.append(_main_event_segment(state, rivalry_pair, top_rivalry, true, title_key))
	else:
		segments.append(_incident_segment(state, rivalry_pair, top_rivalry))
		segments.append(_match_segment(state, "contender_match", "Contender Match", _pick_pair(state, rivalry_pair), false, ""))
		segments.append(_main_event_segment(state, rivalry_pair, top_rivalry, false, title_key))

	return {
		"week": state.week,
		"name": show_name,
		"is_ppv": is_ppv,
		"current_index": 0,
		"segments": segments,
		"used_choices": []
	}

static func _rivalry_wrestlers(state: RDGameState, rivalry: Dictionary) -> Array:
	if state.roster.size() < 2:
		return [{}, {}]
	if rivalry.is_empty():
		return [state.roster[0], state.roster[1]]
	var left := state.get_wrestler(rivalry.get("a", ""))
	var right := state.get_wrestler(rivalry.get("b", ""))
	if left.is_empty() or right.is_empty():
		return [state.roster[0], state.roster[1]]
	return [left, right]

static func _pick_pair(state: RDGameState, excluded_pair: Array) -> Array:
	var excluded_ids: Array = []
	for wrestler in excluded_pair:
		excluded_ids.append(wrestler.get("id", ""))
	var pool := state.get_roster_without(excluded_ids)
	if pool.size() < 2:
		pool = state.roster.duplicate(true)
	pool.shuffle()
	return [pool[0], pool[1]]

static func _promo_segment(state: RDGameState, pair: Array, rivalry: Dictionary, is_ppv: bool) -> Dictionary:
	return {
		"id": "opening_%d" % state.week,
		"type": "opening_promo",
		"title": "Opening Promo: %s calls out %s" % [pair[1].get("name", "Star"), pair[0].get("name", "Champion")],
		"participants": [pair[0].get("id", ""), pair[1].get("id", "")],
		"rivalry_id": rivalry.get("id", ""),
		"expected_reaction": 84 if is_ppv else 74,
		"risk": 22,
		"choices": [
			{"id": "let_them_talk", "label": "Give them the mic", "effect": "heat", "heat": 8, "reaction": 4, "risk": 4},
			{"id": "announce_stip", "label": "Announce stipulation", "effect": "stipulation", "heat": 12, "reaction": 8, "risk": 9},
			{"id": "cut_short", "label": "Cut to the match", "effect": "control", "heat": -2, "reaction": -3, "risk": -8}
		]
	}

static func _incident_segment(state: RDGameState, pair: Array, rivalry: Dictionary) -> Dictionary:
	var type_name := ["backstage", "interference"].pick_random()
	return {
		"id": "incident_%d" % state.week,
		"type": type_name,
		"title": "Backstage tension spills into the show" if type_name == "backstage" else "Run-in changes the momentum",
		"participants": [pair[0].get("id", ""), pair[1].get("id", "")],
		"rivalry_id": rivalry.get("id", ""),
		"expected_reaction": 69,
		"risk": 48,
		"choices": [
			{"id": "let_chaos_breathe", "label": "Let chaos breathe", "effect": "chaos", "heat": 14, "reaction": 10, "risk": 12},
			{"id": "send_security", "label": "Send security", "effect": "security", "heat": -4, "reaction": -4, "risk": -20},
			{"id": "book_rematch", "label": "Book rematch hook", "effect": "hook", "heat": 7, "reaction": 3, "risk": -5}
		]
	}

static func _contract_segment(state: RDGameState, pair: Array, rivalry: Dictionary) -> Dictionary:
	return {
		"id": "contract_%d" % state.week,
		"type": "contract_signing",
		"title": "Final Contract Signing",
		"participants": [pair[0].get("id", ""), pair[1].get("id", "")],
		"rivalry_id": rivalry.get("id", ""),
		"expected_reaction": 82,
		"risk": 35,
		"choices": [
			{"id": "no_contact", "label": "No-contact clause", "effect": "control", "heat": -3, "reaction": 0, "risk": -18},
			{"id": "table_flip", "label": "Allow table chaos", "effect": "heat", "heat": 15, "reaction": 11, "risk": 16},
			{"id": "add_stakes", "label": "Add loser penalty", "effect": "stakes", "heat": 10, "reaction": 8, "risk": 7}
		]
	}

static func _match_segment(state: RDGameState, id: String, title: String, pair: Array, is_title: bool, title_key: String) -> Dictionary:
	return {
		"id": "%s_%d" % [id, state.week],
		"type": "match",
		"title": title,
		"participants": [pair[0].get("id", ""), pair[1].get("id", "")],
		"rivalry_id": "",
		"expected_reaction": 64,
		"risk": 24,
		"title_match": is_title,
		"title_key": title_key,
		"choices": [
			{"id": "clean_finish", "label": "Clean finish", "effect": "clean", "heat": 0, "reaction": 2, "risk": -5},
			{"id": "protect_loser", "label": "Protect the loser", "effect": "protect", "heat": 4, "reaction": 3, "risk": 2},
			{"id": "upset", "label": "Book an upset", "effect": "upset", "heat": 7, "reaction": 7, "risk": 10}
		]
	}

static func _main_event_segment(state: RDGameState, pair: Array, rivalry: Dictionary, ppv_resolution: bool, title_key: String) -> Dictionary:
	return {
		"id": "main_event_%d" % state.week,
		"type": "main_event",
		"title": "PPV Title Resolution" if ppv_resolution else "Main Event Face-Off",
		"participants": [pair[0].get("id", ""), pair[1].get("id", "")],
		"rivalry_id": rivalry.get("id", ""),
		"expected_reaction": 91 if ppv_resolution else 78,
		"risk": 36 if ppv_resolution else 30,
		"ppv_resolution": ppv_resolution,
		"title_match": ppv_resolution or rivalry.get("type", "") == "title",
		"title_key": title_key,
		"choices": [
			{"id": "big_finish", "label": "Big-match finish", "effect": "finish", "heat": 6, "reaction": 9, "risk": 5},
			{"id": "controversy", "label": "Controversial ending", "effect": "controversy", "heat": 13, "reaction": 7, "risk": 13},
			{"id": "decisive_end", "label": "Decisive closure", "effect": "closure", "heat": -18, "reaction": 10, "risk": -4}
		]
	}
