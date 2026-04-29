class_name NewsManager
extends RefCounted

static func build_show_report(state: RDGameState, show: Dictionary, result: Dictionary) -> Array:
	var lines: Array = []
	var rating := String(result.get("rating", "C"))
	var crowd := int(result.get("crowd_reaction", 0))
	lines.append("%s closed with a %s rating and %d crowd reaction." % [result.get("show_name", "The show"), rating, crowd])
	for segment in result.get("segments", []).slice(0, 3):
		lines.append("%s: %s" % [segment.get("title", "Segment"), segment.get("note", "No note")])
	var hottest := RivalryManager.hottest(state)
	if not hottest.is_empty():
		var a := state.get_wrestler(hottest.get("a", ""))
		var b := state.get_wrestler(hottest.get("b", ""))
		lines.append("Fans are circling %s vs %s as the next major attraction." % [a.get("name", "A"), b.get("name", "B")])
	if bool(show.get("is_ppv", false)):
		lines.append("PPV fallout is expected to reshape next week's contender board.")
	return lines.slice(0, 6)

static func build_random_event(state: RDGameState) -> Dictionary:
	var templates := [
		{"type": "sponsor", "title": "Sponsor Buzz", "body": "A broadcast sponsor loved the show's closing angle.", "gold": 2400, "hype": 2},
		{"type": "viral", "title": "Viral Clip", "body": "A finisher clip is spreading across fan feeds.", "gold": 0, "hype": 6},
		{"type": "fatigue", "title": "Locker Room Fatigue", "body": "The roster needs a lighter production week soon.", "gold": 0, "hype": -2},
		{"type": "scout", "title": "Scout Tip", "body": "Agents found a promising free agent market window.", "gold": 0, "hype": 1}
	]
	var event: Dictionary = templates.pick_random().duplicate(true)
	state.gold += int(event.get("gold", 0))
	state.hype = clampi(state.hype + int(event.get("hype", 0)), 0, 100)
	return event

static func report_text(state: RDGameState) -> String:
	var result := state.last_show_result
	if result.is_empty():
		return "No media report yet. Run a show to generate headlines."
	var lines: Array = ["[b]Latest media report[/b]"]
	for line in result.get("news", []):
		lines.append("- %s" % line)
	var event: Dictionary = result.get("event", {})
	if not event.is_empty():
		lines.append("\n[b]Backstage event[/b]")
		lines.append("%s: %s" % [event.get("title", "Event"), event.get("body", "")])
	return "\n".join(lines)

