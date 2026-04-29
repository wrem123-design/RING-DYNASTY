class_name MissionManager
extends RefCounted

static func current_objectives(state: RDGameState) -> Array:
	var objectives: Array = []
	objectives.append({
		"id": "raise_hype",
		"label": "이번 달 PPV 전까지 Hype 75 달성",
		"progress": state.hype,
		"target": 75,
		"complete": state.hype >= 75
	})
	objectives.append({
		"id": "grow_roster",
		"label": "로스터 14명 확보",
		"progress": state.roster.size(),
		"target": 14,
		"complete": state.roster.size() >= 14
	})
	var hot_count := 0
	for rivalry in state.rivalries:
		if int(rivalry.get("heat", 0)) >= 70:
			hot_count += 1
	objectives.append({
		"id": "hot_rivalry",
		"label": "Heat 70 이상 라이벌리 1개 유지",
		"progress": hot_count,
		"target": 1,
		"complete": hot_count >= 1
	})
	return objectives

static func objective_summary(state: RDGameState) -> String:
	var lines: Array = []
	for objective in current_objectives(state):
		var mark := "DONE" if bool(objective.get("complete", false)) else "TODO"
		lines.append("%s - %s (%d/%d)" % [
			mark,
			objective.get("label", ""),
			int(objective.get("progress", 0)),
			int(objective.get("target", 1))
		])
	return "\n".join(lines)

