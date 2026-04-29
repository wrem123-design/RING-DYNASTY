class_name LegacyManager
extends RefCounted

static func ensure_defaults(state: RDGameState) -> void:
	if state.legacy.is_empty():
		state.legacy = {"points": 0, "unlocked": [], "shop_purchases": [], "best_rating": "C"}
	for key in ["points", "unlocked", "shop_purchases", "best_rating"]:
		if not state.legacy.has(key):
			if ["unlocked", "shop_purchases"].has(key):
				state.legacy[key] = []
			elif key == "points":
				state.legacy[key] = 0
			else:
				state.legacy[key] = "C"

static func achievement_defs() -> Array:
	return [
		{"id": "first_show", "label": "First Bell", "desc": "Complete your first show.", "points": 3},
		{"id": "hot_crowd", "label": "Hot Crowd", "desc": "Reach Hype 80.", "points": 5},
		{"id": "deep_roster", "label": "Deep Roster", "desc": "Own 20 wrestlers.", "points": 5},
		{"id": "title_change", "label": "New Champion", "desc": "Record a title change.", "points": 6},
		{"id": "premium_company", "label": "Premium Company", "desc": "Upgrade any facility to level 3.", "points": 5},
		{"id": "ppv_quality", "label": "PPV Classic", "desc": "Earn an A or S rated PPV.", "points": 8}
	]

static func evaluate(state: RDGameState) -> Array:
	ensure_defaults(state)
	var unlocked: Array = state.legacy.get("unlocked", [])
	var new_unlocks: Array = []
	for achievement in achievement_defs():
		var id := String(achievement.get("id", ""))
		if unlocked.has(id):
			continue
		if _is_complete(state, id):
			unlocked.append(id)
			new_unlocks.append(achievement)
			state.legacy["points"] = int(state.legacy.get("points", 0)) + int(achievement.get("points", 0))
	state.legacy["unlocked"] = unlocked
	return new_unlocks

static func _is_complete(state: RDGameState, id: String) -> bool:
	match id:
		"first_show":
			return not state.last_show_result.is_empty() or state.week > 1
		"hot_crowd":
			return state.hype >= 80
		"deep_roster":
			return state.roster.size() >= 20
		"title_change":
			return state.title_history.size() > 2
		"premium_company":
			for level in state.facilities.values():
				if int(level) >= 3:
					return true
			return false
		"ppv_quality":
			var show_name := String(state.last_show_result.get("show_name", ""))
			var is_ppv_result := show_name.find("PREMIUM") >= 0 or show_name.find("MANIA") >= 0
			return is_ppv_result and ["A", "S"].has(String(state.last_show_result.get("rating", "")))
		_:
			return false

static func summary(state: RDGameState) -> String:
	ensure_defaults(state)
	evaluate(state)
	var unlocked: Array = state.legacy.get("unlocked", [])
	var lines: Array = ["Legacy Points: %d" % int(state.legacy.get("points", 0))]
	for achievement in achievement_defs():
		var mark := "DONE" if unlocked.has(achievement.get("id", "")) else "LOCKED"
		lines.append("%s - %s: %s (+%d)" % [
			mark,
			achievement.get("label", ""),
			achievement.get("desc", ""),
			int(achievement.get("points", 0))
		])
	return "\n".join(lines)

static func shop_items() -> Array:
	return [
		{"id": "scout_discount", "label": "Scout Network", "desc": "Gain 3000G and improve recruitment runway.", "cost": 4},
		{"id": "pyro_package", "label": "Pyro Package", "desc": "Gain +8 Hype immediately.", "cost": 5},
		{"id": "medical_grant", "label": "Medical Grant", "desc": "Recover all roster condition by 8.", "cost": 6},
		{"id": "legacy_banner", "label": "Legacy Banner", "desc": "Gain +5 Fame.", "cost": 6}
	]

static func buy_shop_item(state: RDGameState, item_id: String) -> Dictionary:
	ensure_defaults(state)
	var purchases: Array = state.legacy.get("shop_purchases", [])
	if purchases.has(item_id):
		return {"ok": false, "message": "Already purchased."}
	for item in shop_items():
		if item.get("id", "") != item_id:
			continue
		var cost := int(item.get("cost", 0))
		if int(state.legacy.get("points", 0)) < cost:
			return {"ok": false, "message": "Not enough Legacy Points."}
		state.legacy["points"] = int(state.legacy.get("points", 0)) - cost
		purchases.append(item_id)
		state.legacy["shop_purchases"] = purchases
		_apply_shop_effect(state, item_id)
		return {"ok": true, "message": "%s purchased." % item.get("label", item_id)}
	return {"ok": false, "message": "Unknown shop item."}

static func _apply_shop_effect(state: RDGameState, item_id: String) -> void:
	match item_id:
		"scout_discount":
			state.gold += int(BalanceManager.value("legacy_shop.scout_discount_gold", 3000))
		"pyro_package":
			state.hype = clampi(state.hype + int(BalanceManager.value("legacy_shop.pyro_package_hype", 8)), 0, 100)
		"medical_grant":
			for wrestler in state.roster:
				wrestler["condition"] = clampi(int(wrestler.get("condition", 100)) + int(BalanceManager.value("legacy_shop.medical_grant_condition", 8)), 0, 100)
		"legacy_banner":
			state.fame += int(BalanceManager.value("legacy_shop.legacy_banner_fame", 5))

static func shop_summary(state: RDGameState) -> String:
	ensure_defaults(state)
	var purchases: Array = state.legacy.get("shop_purchases", [])
	var lines: Array = ["Legacy Points: %d" % int(state.legacy.get("points", 0))]
	for item in shop_items():
		var mark := "OWNED" if purchases.has(item.get("id", "")) else "BUY"
		lines.append("%s - %s (%d LP)\n%s" % [
			mark,
			item.get("label", ""),
			int(item.get("cost", 0)),
			item.get("desc", "")
		])
	return "\n\n".join(lines)
