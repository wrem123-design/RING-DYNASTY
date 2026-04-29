class_name MatchSimulator
extends RefCounted

static func simulate(left: Dictionary, right: Dictionary, options: Dictionary = {}) -> Dictionary:
	var left_score := _power_score(left, right) + randi_range(-9, 9)
	var right_score := _power_score(right, left) + randi_range(-9, 9)
	left_score += int(options.get("left_bonus", 0))
	right_score += int(options.get("right_bonus", 0))

	var winner := left if left_score >= right_score else right
	var loser := right if winner == left else left
	var diff: int = absi(left_score - right_score)
	var finish := "FINISHER_PIN" if diff >= 13 else "CLOSE_PIN" if diff >= 5 else "FLASH_ROLLUP"
	var highlight := "%s survived the momentum swing and finished with %s." % [winner.get("name", "Winner"), winner.get("finisher", "a signature move")]
	if diff < 5:
		highlight = "%s stole a razor-close win after a chaotic final exchange." % winner.get("name", "Winner")
	return {
		"winner_id": winner.get("id", ""),
		"loser_id": loser.get("id", ""),
		"finish": finish,
		"quality": clampi(int((left_score + right_score) / 2), 35, 100),
		"highlight": highlight,
		"left_score": left_score,
		"right_score": right_score
	}

static func _power_score(wrestler: Dictionary, opponent: Dictionary) -> int:
	var stats: Dictionary = wrestler.get("stats", {})
	var score := int(stats.get("power", 50) * 0.24)
	score += int(stats.get("stamina", 50) * 0.19)
	score += int(stats.get("technique", 50) * 0.24)
	score += int(stats.get("charisma", 50) * 0.17)
	score += int(stats.get("fame", 50) * 0.16)
	score += int((int(wrestler.get("condition", 100)) - 70) / 3.0)
	score += _style_bonus(String(wrestler.get("style", "")), String(opponent.get("style", "")))
	return score

static func _style_bonus(style: String, opponent_style: String) -> int:
	if style == "powerhouse" and opponent_style == "showman":
		return 7
	if style == "technician" and opponent_style == "powerhouse":
		return 7
	if style == "showman" and opponent_style == "technician":
		return 7
	return 0
