extends Control

const BG_ARENA := "res://assets/images/show/gm_control_arena_generated.png"
const BG_RAW := "res://assets/images/show/raw_arena_stage.png"
const BG_BACKSTAGE := "res://assets/images/show/backstage_confrontation.png"
const BG_CONTRACT := "res://assets/images/show/contract_signing_generated.png"
const BG_RUN_IN := "res://assets/images/show/run_in_entrance.png"
const BG_ROSTER := "res://assets/images/show/roster_office_generated.png"
const BG_RECRUIT := "res://assets/images/show/recruitment_room_generated.png"
const BG_TITLES := "res://assets/images/show/championship_hall_generated.png"
const BG_FACILITY := "res://assets/images/show/facility_ops_generated.png"
const BG_MISSIONS := "res://assets/images/show/mission_command_generated.png"
const BG_RECRUIT_REVEAL := "res://assets/images/show/recruit_pack_reveal_generated.png"
const BG_MATCH_RESULT := "res://assets/images/show/match_highlight_generated.png"
const BG_PPV_RESULT := "res://assets/images/show/ppv_fallout_generated.png"
const BG_LEGACY := "res://assets/images/show/legacy_hall_generated.png"
const BG_SHOP := "res://assets/images/show/premium_shop_generated.png"
const LOGO := "res://assets/images/ui/ring_dynasty_logo.png"
const SFX_BASIC := "res://assets/sounds/basic.mp3"
const SFX_CRITICAL := "res://assets/sounds/critical.mp3"
const SFX_FINISHER := "res://assets/sounds/finisher.mp3"
const SCENE_NAV_BUTTON := preload("res://scenes/ui/NavButton.tscn")
const SCENE_PORTRAIT := preload("res://scenes/ui/WrestlerPortrait.tscn")
const SCENE_CHOICE_BUTTON := preload("res://scenes/ui/ChoiceButton.tscn")
const SCENE_SIDEBAR := preload("res://scenes/ui/SidebarPanel.tscn")

var state := RDGameState.new()
var show: Dictionary = {}
var segment_results: Array = []
var selected_choice: Dictionary = {}
var current_screen := "dashboard"

var background: TextureRect
var headline: Label
var subline: Label
var stats_line: Label
var phase_line: Label
var segment_title: Label
var segment_body: RichTextLabel
var choice_box: HBoxContainer
var action_button: Button
var roster_box: VBoxContainer
var rivalry_box: VBoxContainer
var portrait_left: TextureRect
var portrait_right: TextureRect
var result_log: RichTextLabel
var sfx_player: AudioStreamPlayer
var shade_overlay: ColorRect

func _ready() -> void:
	randomize()
	state.load_defaults()
	_build_ui()
	_show_dashboard()

func _build_ui() -> void:
	sfx_player = AudioStreamPlayer.new()
	add_child(sfx_player)

	background = TextureRect.new()
	background.set_anchors_preset(Control.PRESET_FULL_RECT)
	background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	background.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	add_child(background)

	shade_overlay = ColorRect.new()
	shade_overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade_overlay.color = Color(0.02, 0.018, 0.018, 0.70)
	add_child(shade_overlay)

	var root := MarginContainer.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.add_theme_constant_override("margin_left", 34)
	root.add_theme_constant_override("margin_right", 34)
	root.add_theme_constant_override("margin_top", 28)
	root.add_theme_constant_override("margin_bottom", 28)
	add_child(root)

	var vertical := VBoxContainer.new()
	vertical.add_theme_constant_override("separation", 18)
	root.add_child(vertical)

	var top := HBoxContainer.new()
	top.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_theme_constant_override("separation", 18)
	vertical.add_child(top)

	var logo := TextureRect.new()
	logo.custom_minimum_size = Vector2(180, 86)
	logo.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	logo.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CONTAINED
	logo.texture = load(LOGO)
	top.add_child(logo)

	var title_stack := VBoxContainer.new()
	title_stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(title_stack)

	headline = Label.new()
	headline.text = "RING DYNASTY"
	headline.add_theme_font_size_override("font_size", 42)
	headline.add_theme_color_override("font_color", Color(1.0, 0.86, 0.46))
	title_stack.add_child(headline)

	subline = Label.new()
	subline.text = "Godot show-flow prototype"
	subline.add_theme_font_size_override("font_size", 18)
	subline.add_theme_color_override("font_color", Color(0.86, 0.88, 0.92))
	title_stack.add_child(subline)

	stats_line = Label.new()
	stats_line.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	stats_line.add_theme_font_size_override("font_size", 18)
	stats_line.add_theme_color_override("font_color", Color(0.94, 0.96, 1.0))
	top.add_child(stats_line)

	var nav := HBoxContainer.new()
	nav.add_theme_constant_override("separation", 10)
	nav.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	vertical.add_child(nav)
	nav.add_child(_nav_button("War Room", _show_dashboard))
	nav.add_child(_nav_button("Roster", _show_roster_screen))
	nav.add_child(_nav_button("Recruit", _show_recruit_screen))
	nav.add_child(_nav_button("Facilities", _show_facility_screen))
	nav.add_child(_nav_button("Titles", _show_titles_screen))
	nav.add_child(_nav_button("Divisions", _show_division_screen))
	nav.add_child(_nav_button("Missions", _show_mission_screen))
	nav.add_child(_nav_button("Legacy", _show_legacy_screen))
	nav.add_child(_nav_button("Shop", _show_shop_screen))
	nav.add_child(_nav_button("Save", _save_game))
	nav.add_child(_nav_button("Load", _load_game))

	var content := HBoxContainer.new()
	content.size_flags_vertical = Control.SIZE_EXPAND_FILL
	content.add_theme_constant_override("separation", 18)
	vertical.add_child(content)

	var main_panel := PanelContainer.new()
	main_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	main_panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	main_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.04, 0.035, 0.038, 0.88), Color(0.95, 0.72, 0.25, 0.62)))
	content.add_child(main_panel)

	var main_margin := MarginContainer.new()
	main_margin.add_theme_constant_override("margin_left", 24)
	main_margin.add_theme_constant_override("margin_right", 24)
	main_margin.add_theme_constant_override("margin_top", 22)
	main_margin.add_theme_constant_override("margin_bottom", 22)
	main_panel.add_child(main_margin)

	var main_stack := VBoxContainer.new()
	main_stack.add_theme_constant_override("separation", 16)
	main_margin.add_child(main_stack)

	phase_line = Label.new()
	phase_line.add_theme_font_size_override("font_size", 17)
	phase_line.add_theme_color_override("font_color", Color(0.88, 0.65, 0.32))
	main_stack.add_child(phase_line)

	segment_title = Label.new()
	segment_title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	segment_title.add_theme_font_size_override("font_size", 32)
	segment_title.add_theme_color_override("font_color", Color.WHITE)
	main_stack.add_child(segment_title)

	var stage_row := HBoxContainer.new()
	stage_row.size_flags_vertical = Control.SIZE_EXPAND_FILL
	stage_row.add_theme_constant_override("separation", 14)
	main_stack.add_child(stage_row)

	portrait_left = _portrait()
	stage_row.add_child(portrait_left)

	segment_body = RichTextLabel.new()
	segment_body.bbcode_enabled = true
	segment_body.fit_content = false
	segment_body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	segment_body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	segment_body.add_theme_font_size_override("normal_font_size", 19)
	stage_row.add_child(segment_body)

	portrait_right = _portrait()
	stage_row.add_child(portrait_right)

	choice_box = HBoxContainer.new()
	choice_box.add_theme_constant_override("separation", 10)
	main_stack.add_child(choice_box)

	action_button = Button.new()
	action_button.custom_minimum_size = Vector2(260, 52)
	action_button.add_theme_font_size_override("font_size", 18)
	action_button.pressed.connect(_on_action_pressed)
	main_stack.add_child(action_button)

	result_log = RichTextLabel.new()
	result_log.bbcode_enabled = true
	result_log.custom_minimum_size = Vector2(0, 150)
	result_log.add_theme_font_size_override("normal_font_size", 16)
	main_stack.add_child(result_log)

	var side := VBoxContainer.new()
	side.custom_minimum_size = Vector2(360, 0)
	side.add_theme_constant_override("separation", 14)
	content.add_child(side)

	roster_box = _side_section(side, "Roster")
	rivalry_box = _side_section(side, "Rivalries")

func _nav_button(text: String, callback: Callable) -> Button:
	var button := SCENE_NAV_BUTTON.instantiate() as Button
	button.text = text
	button.add_theme_font_size_override("font_size", 14)
	button.pressed.connect(callback)
	return button

func _side_section(parent: VBoxContainer, title: String) -> VBoxContainer:
	var panel := SCENE_SIDEBAR.instantiate() as PanelContainer
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.025, 0.028, 0.035, 0.82), Color(0.35, 0.41, 0.55, 0.55)))
	parent.add_child(panel)
	var box := panel.get_node("Margin/Box") as VBoxContainer
	var label := panel.get_node("Margin/Box/Header") as Label
	label.text = title
	return box

func _portrait() -> TextureRect:
	return SCENE_PORTRAIT.instantiate() as TextureRect

func _panel_style(fill: Color, border: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(1)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	style.content_margin_left = 0
	style.content_margin_right = 0
	style.content_margin_top = 0
	style.content_margin_bottom = 0
	return style

func _show_dashboard() -> void:
	current_screen = "dashboard"
	_set_background(BG_ARENA)
	show = {}
	segment_results = []
	selected_choice = {}
	headline.text = "GM WAR ROOM"
	subline.text = "Book the week, feed the rivalry, land the PPV."
	phase_line.text = "WEEK %d / %s" % [state.week, "PPV NIGHT" if state.is_ppv_week() else "%d weeks until PPV" % state.weeks_until_ppv()]
	segment_title.text = "Tonight's production board"
	segment_body.text = _dashboard_text()
	portrait_left.texture = null
	portrait_right.texture = null
	action_button.text = "Start Tonight's Show"
	result_log.text = ""
	_clear_choices()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _dashboard_text() -> String:
	var hottest := RivalryManager.hottest(state)
	var rivalry_text := "No active rivalry."
	if not hottest.is_empty():
		var a := state.get_wrestler(hottest.get("a", ""))
		var b := state.get_wrestler(hottest.get("b", ""))
		rivalry_text = "%s vs %s / Heat %d / %s" % [
			a.get("name", "A"),
			b.get("name", "B"),
			int(hottest.get("heat", 0)),
			RivalryManager.stage_label(int(hottest.get("heat", 0)))
		]
	return "[b]Champions[/b]\nWorld: %s\nWomen's: %s\n\n[b]Hottest story[/b]\n%s\n\n[b]Objectives[/b]\n%s\n\n[b]Facility effects[/b]\nIncome x%.2f / Production +%d / Risk -%d / Recovery +%d" % [
		ChampionshipManager.champion_name(state, "world"),
		ChampionshipManager.champion_name(state, "womens"),
		rivalry_text,
		MissionManager.objective_summary(state),
		FacilityManager.income_multiplier(state),
		FacilityManager.production_bonus(state),
		FacilityManager.medical_risk_reduction(state),
		FacilityManager.training_recovery(state)
	]

func _show_roster_screen() -> void:
	current_screen = "roster"
	show = {}
	_set_background(BG_ROSTER)
	headline.text = "ROSTER OFFICE"
	subline.text = "Contract room, momentum board, and booking depth."
	phase_line.text = "Owned wrestlers %d / Champions: World %s, Women's %s" % [
		state.roster.size(),
		state.get_wrestler(String(state.champions.get("world", ""))).get("name", "Vacant"),
		state.get_wrestler(String(state.champions.get("womens", ""))).get("name", "Vacant")
	]
	segment_title.text = "Current roster"
	portrait_left.texture = null
	portrait_right.texture = null
	_clear_choices()
	action_button.text = "Back To War Room"
	segment_body.text = _full_roster_text()
	result_log.text = "[b]Mission snapshot[/b]\n%s" % MissionManager.objective_summary(state)
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _full_roster_text() -> String:
	var text := ""
	for wrestler in state.roster:
		var stats: Dictionary = wrestler.get("stats", {})
		text += "[b]%s %s[/b] - %s / %s / %s\n" % [
			wrestler.get("grade", "C"),
			wrestler.get("name", ""),
			wrestler.get("nickname", ""),
			wrestler.get("style", ""),
			wrestler.get("alignment", "")
		]
		text += "PWR %d  STA %d  TEC %d  MIC %d  FAME %d  CON %d  POP %d  Record %d-%d\n\n" % [
			int(stats.get("power", 0)),
			int(stats.get("stamina", 0)),
			int(stats.get("technique", 0)),
			int(stats.get("charisma", 0)),
			int(stats.get("fame", 0)),
			int(wrestler.get("condition", 100)),
			int(wrestler.get("pop", 60)),
			int(wrestler.get("wins", 0)),
			int(wrestler.get("losses", 0))
		]
	return text

func _show_recruit_screen() -> void:
	current_screen = "recruit"
	show = {}
	_set_background(BG_RECRUIT)
	headline.text = "RECRUITMENT"
	subline.text = "Turn gold into star power, depth, and fresh rivalries."
	phase_line.text = "Gold %dG / Standard 4000G / Premium 9000G / Legend 18000G" % state.gold
	segment_title.text = "Scout a new wrestler"
	segment_body.text = "[b]Pack odds direction[/b]\nStandard favors A-grade signings. Premium improves S-grade odds. Legend pack heavily raises LEGEND odds.\n\n[b]Pool[/b]\n%s\n\nNew face/heel contrast can automatically spark a debut rivalry." % _recruit_pool_summary()
	portrait_left.texture = null
	portrait_right.texture = null
	result_log.text = "[b]Recent recruitment[/b]\nNo roll yet this visit."
	action_button.text = "Back To War Room"
	_render_recruit_buttons()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _render_recruit_buttons() -> void:
	_clear_choices()
	var packs := [
		{"id": "standard", "label": "Standard Scout", "cost": RecruitmentManager.recruit_cost("standard")},
		{"id": "premium", "label": "Premium Scout", "cost": RecruitmentManager.recruit_cost("premium")},
		{"id": "legend", "label": "Legend Search", "cost": RecruitmentManager.recruit_cost("legend")}
	]
	for pack in packs:
		var button := SCENE_CHOICE_BUTTON.instantiate() as Button
		button.text = "%s\n%dG" % [pack.get("label", ""), int(pack.get("cost", 0))]
		button.add_theme_font_size_override("font_size", 16)
		button.pressed.connect(func() -> void:
			_roll_recruit(String(pack.get("id", "standard")))
		)
		choice_box.add_child(button)

func _recruit_pool_summary() -> String:
	var stats := RecruitmentManager.pool_stats(state)
	var grades: Dictionary = stats.get("grades", {})
	return "Total %d / Owned %d / Available %d\nLEGEND %d / S %d / A %d / B %d" % [
		int(stats.get("total", 0)),
		int(stats.get("owned", 0)),
		int(stats.get("available", 0)),
		int(grades.get("LEGEND", 0)),
		int(grades.get("S", 0)),
		int(grades.get("A", 0)),
		int(grades.get("B", 0))
	]

func _roll_recruit(pack_type: String) -> void:
	_set_background(BG_RECRUIT_REVEAL)
	var result := RecruitmentManager.roll_recruit(state, pack_type)
	var recruit: Dictionary = result.get("recruit", {})
	if bool(result.get("ok", false)) and not recruit.is_empty():
		portrait_left.texture = load(String(recruit.get("portrait", "")))
		portrait_right.texture = null
		segment_title.text = "%s %s" % [recruit.get("grade", ""), recruit.get("name", "Recruit")]
		segment_body.text = "[b]%s[/b]\n%s\n\nStyle: %s\nAlignment: %s\nFinisher: %s" % [
			recruit.get("nickname", ""),
			result.get("message", ""),
			recruit.get("style", ""),
			recruit.get("alignment", ""),
			recruit.get("finisher", "")
		]
	else:
		segment_body.text = "[b]Recruitment failed[/b]\n%s" % result.get("message", "Unknown issue.")
	result_log.text = "[b]Recruitment result[/b]\n%s\n\n[b]Mission snapshot[/b]\n%s" % [
		result.get("message", ""),
		MissionManager.objective_summary(state)
	]
	phase_line.text = "Gold %dG / Last pack cost %dG" % [state.gold, int(result.get("cost", 0))]
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_mission_screen() -> void:
	current_screen = "missions"
	show = {}
	_set_background(BG_MISSIONS)
	headline.text = "GM OBJECTIVES"
	subline.text = "Short-term direction for the conversion prototype."
	phase_line.text = "Week %d / Hype %d / Roster %d" % [state.week, state.hype, state.roster.size()]
	segment_title.text = "Active objectives"
	segment_body.text = "[b]Weekly and monthly goals[/b]\n%s\n\n%s" % [
		MissionManager.objective_summary(state),
		NewsManager.report_text(state)
	]
	portrait_left.texture = null
	portrait_right.texture = null
	_clear_choices()
	action_button.text = "Back To War Room"
	result_log.text = "[b]Why this matters[/b]\nObjectives create the bridge between show booking, recruitment, economy, and PPV preparation."
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_legacy_screen() -> void:
	current_screen = "legacy"
	show = {}
	LegacyManager.evaluate(state)
	_set_background(BG_LEGACY)
	headline.text = "LEGACY HALL"
	subline.text = "Track the dynasty beyond one show."
	phase_line.text = "Legacy Points %d / Achievements %d" % [
		int(state.legacy.get("points", 0)),
		Array(state.legacy.get("unlocked", [])).size()
	]
	segment_title.text = "Achievements"
	segment_body.text = "[b]Legacy progress[/b]\n%s" % LegacyManager.summary(state)
	portrait_left.texture = _champion_texture("world")
	portrait_right.texture = _champion_texture("womens")
	_clear_choices()
	action_button.text = "Back To War Room"
	result_log.text = "[b]Dynasty note[/b]\nLegacy Points are earned from meaningful milestones and spent in the premium shop."
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_shop_screen() -> void:
	current_screen = "shop"
	show = {}
	LegacyManager.evaluate(state)
	_set_background(BG_SHOP)
	headline.text = "PREMIUM SHOP"
	subline.text = "Spend Legacy Points on company-wide boosts."
	phase_line.text = "Legacy Points %d / Gold %dG / Hype %d" % [
		int(state.legacy.get("points", 0)),
		state.gold,
		state.hype
	]
	segment_title.text = "Legacy upgrades"
	segment_body.text = "[b]Available purchases[/b]\n%s" % LegacyManager.shop_summary(state)
	portrait_left.texture = null
	portrait_right.texture = null
	result_log.text = "[b]Shop note[/b]\nPurchases are one-time boosts that help the GM loop recover or accelerate."
	action_button.text = "Back To War Room"
	_render_shop_buttons()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _render_shop_buttons() -> void:
	_clear_choices()
	for item in LegacyManager.shop_items():
		var button := SCENE_CHOICE_BUTTON.instantiate() as Button
		button.text = "%s\n%d LP" % [item.get("label", ""), int(item.get("cost", 0))]
		button.add_theme_font_size_override("font_size", 15)
		button.pressed.connect(func() -> void:
			_buy_shop_item(String(item.get("id", "")))
		)
		choice_box.add_child(button)

func _buy_shop_item(item_id: String) -> void:
	var result := LegacyManager.buy_shop_item(state, item_id)
	result_log.text = "[b]Shop result[/b]\n%s" % result.get("message", "")
	segment_body.text = "[b]Available purchases[/b]\n%s" % LegacyManager.shop_summary(state)
	phase_line.text = "Legacy Points %d / Gold %dG / Hype %d" % [
		int(state.legacy.get("points", 0)),
		state.gold,
		state.hype
	]
	_render_shop_buttons()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_facility_screen() -> void:
	current_screen = "facilities"
	show = {}
	FacilityManager.ensure_defaults(state)
	_set_background(BG_FACILITY)
	headline.text = "FACILITIES"
	subline.text = "Upgrade the company behind the show."
	phase_line.text = "Income x%.2f / Production +%d / Risk -%d / Recovery +%d" % [
		FacilityManager.income_multiplier(state),
		FacilityManager.production_bonus(state),
		FacilityManager.medical_risk_reduction(state),
		FacilityManager.training_recovery(state)
	]
	segment_title.text = "Operations upgrades"
	segment_body.text = "[b]Facility board[/b]\n%s" % FacilityManager.summary(state)
	portrait_left.texture = null
	portrait_right.texture = null
	result_log.text = "[b]Operations note[/b]\nFacility effects now feed show income, crowd reaction, segment risk, and wrestler recovery."
	action_button.text = "Back To War Room"
	_render_facility_buttons()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_titles_screen() -> void:
	current_screen = "titles"
	show = {}
	_set_background(BG_TITLES)
	headline.text = "CHAMPIONSHIPS"
	subline.text = "Titles now resolve through PPV and title-match outcomes."
	phase_line.text = "World: %s / Women's: %s" % [
		ChampionshipManager.champion_name(state, "world"),
		ChampionshipManager.champion_name(state, "womens")
	]
	segment_title.text = "Title board"
	segment_body.text = "[b]Championship status[/b]\n%s\n\n[b]Recent history[/b]\n%s\n\n[b]Rule[/b]\nWhen a title-match segment resolves, the winner becomes champion unless the current champion retains." % [
		ChampionshipManager.title_summary(state),
		ChampionshipManager.history_summary(state)
	]
	portrait_left.texture = _champion_texture("world")
	portrait_right.texture = _champion_texture("womens")
	_clear_choices()
	action_button.text = "Back To War Room"
	result_log.text = "[b]Booking note[/b]\nPPV main events use the hottest rivalry and attach the title held by either rival."
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _show_division_screen() -> void:
	current_screen = "divisions"
	show = {}
	_set_background(BG_TITLES)
	headline.text = "DIVISIONS"
	subline.text = "Rankings turn roster performance into title pressure."
	phase_line.text = "Top contenders update from wins, losses, morale, popularity, and fame."
	segment_title.text = "Contender rankings"
	segment_body.text = "%s\n\n%s" % [
		DivisionManager.ranking_summary(state, "world"),
		DivisionManager.ranking_summary(state, "womens")
	]
	portrait_left.texture = _champion_texture("world")
	portrait_right.texture = _champion_texture("womens")
	result_log.text = "[b]Booking control[/b]\nCreate a title rivalry to aim the next shows toward a PPV payoff."
	action_button.text = "Back To War Room"
	_render_division_buttons()
	_refresh_sidebars()
	_refresh_stats()
	_pulse_control(segment_body)

func _render_division_buttons() -> void:
	_clear_choices()
	for key in ["world", "womens"]:
		var button := SCENE_CHOICE_BUTTON.instantiate() as Button
		var contender := DivisionManager.top_contender(state, key)
		button.text = "Create %s Rivalry\nTop: %s" % [
			ChampionshipManager.definitions().get(key, {}).get("label", key),
			contender.get("name", "None")
		]
		button.add_theme_font_size_override("font_size", 15)
		button.pressed.connect(func() -> void:
			_create_title_rivalry(String(key))
		)
		choice_box.add_child(button)

func _create_title_rivalry(key: String) -> void:
	var result := DivisionManager.create_title_rivalry(state, key)
	result_log.text = "[b]Division booking[/b]\n%s" % result.get("message", "")
	segment_body.text = "%s\n\n%s" % [
		DivisionManager.ranking_summary(state, "world"),
		DivisionManager.ranking_summary(state, "womens")
	]
	_refresh_sidebars()

func _champion_texture(title_key: String) -> Texture2D:
	var champion := state.get_wrestler(String(state.champions.get(title_key, "")))
	if champion.has("portrait"):
		return load(String(champion.get("portrait", "")))
	return null

func _render_facility_buttons() -> void:
	_clear_choices()
	for key in FacilityManager.definitions().keys():
		var definition: Dictionary = FacilityManager.definitions()[key]
		var level := int(state.facilities.get(key, 1))
		var button := SCENE_CHOICE_BUTTON.instantiate() as Button
		button.text = "%s Lv.%d\n%s" % [
			definition.get("label", key),
			level,
			"MAX" if level >= int(definition.get("max", 5)) else "%dG" % FacilityManager.upgrade_cost(state, key)
		]
		button.add_theme_font_size_override("font_size", 15)
		button.pressed.connect(func() -> void:
			_upgrade_facility(String(key))
		)
		choice_box.add_child(button)

func _upgrade_facility(key: String) -> void:
	var result := FacilityManager.upgrade(state, key)
	result_log.text = "[b]Facility result[/b]\n%s" % result.get("message", "")
	segment_body.text = "[b]Facility board[/b]\n%s" % FacilityManager.summary(state)
	phase_line.text = "Income x%.2f / Production +%d / Risk -%d / Recovery +%d" % [
		FacilityManager.income_multiplier(state),
		FacilityManager.production_bonus(state),
		FacilityManager.medical_risk_reduction(state),
		FacilityManager.training_recovery(state)
	]
	_render_facility_buttons()
	_refresh_stats()

func _save_game() -> void:
	var ok := SaveManager.save_state(state)
	result_log.text = "[b]Save[/b]\n%s" % ("Saved to user://ring_dynasty_save.json" if ok else "Save failed.")
	_refresh_stats()

func _load_game() -> void:
	var ok := SaveManager.load_state(state)
	if ok:
		show = {}
		segment_results = []
		selected_choice = {}
		_show_dashboard()
		result_log.text = "[b]Load[/b]\nLoaded user://ring_dynasty_save.json"
	else:
		result_log.text = "[b]Load[/b]\nNo save file found."
	_refresh_sidebars()
	_refresh_stats()

func _start_show() -> void:
	current_screen = "show"
	show = ShowGenerator.generate(state)
	state.current_show = show
	segment_results = []
	selected_choice = {}
	_render_current_segment()

func _render_current_segment() -> void:
	var index := int(show.get("current_index", 0))
	var segments: Array = show.get("segments", [])
	if index >= segments.size():
		_finalize_show()
		return
	var segment: Dictionary = segments[index]
	var participants: Array = segment.get("participants", [])
	var left := state.get_wrestler(participants[0])
	var right := state.get_wrestler(participants[1])
	_set_background(_background_for(segment))
	headline.text = String(show.get("name", "SHOW"))
	subline.text = "Segment %d of %d" % [index + 1, segments.size()]
	phase_line.text = "%s / Expected reaction %d / Risk %d" % [
		_type_label(String(segment.get("type", ""))),
		int(segment.get("expected_reaction", 0)),
		int(segment.get("risk", 0))
	]
	segment_title.text = String(segment.get("title", "Untitled segment"))
	segment_body.text = _segment_copy(segment, left, right)
	portrait_left.texture = load(String(left.get("portrait", ""))) if left.has("portrait") else null
	portrait_right.texture = load(String(right.get("portrait", ""))) if right.has("portrait") else null
	result_log.text = _results_text()
	_render_choices(segment)
	action_button.text = "Resolve Segment"
	_refresh_sidebars()
	_refresh_stats()

func _background_for(segment: Dictionary) -> String:
	match String(segment.get("type", "")):
		"backstage":
			return BG_BACKSTAGE
		"interference":
			return BG_RUN_IN
		"contract_signing":
			return BG_CONTRACT
		"main_event":
			return BG_RAW
		_:
			return BG_ARENA

func _type_label(type_name: String) -> String:
	match type_name:
		"opening_promo":
			return "OPENING PROMO"
		"backstage":
			return "BACKSTAGE INCIDENT"
		"interference":
			return "RUN-IN"
		"contract_signing":
			return "CONTRACT SIGNING"
		"main_event":
			return "MAIN EVENT"
		"match":
			return "MATCH"
		_:
			return type_name.to_upper()

func _segment_copy(segment: Dictionary, left: Dictionary, right: Dictionary) -> String:
	var rivalry := _segment_rivalry(segment)
	var rivalry_line := "No active rivalry attached."
	if not rivalry.is_empty():
		rivalry_line = "%s / Heat %d / Freshness %d" % [
			RivalryManager.stage_label(int(rivalry.get("heat", 0))),
			int(rivalry.get("heat", 0)),
			int(rivalry.get("freshness", 0))
		]
	var match_text := "[b]%s[/b] vs [b]%s[/b]" % [left.get("name", "TBA"), right.get("name", "TBA")]
	var stakes := "Title stakes active." if bool(segment.get("title_match", false)) else "Story momentum segment."
	return "%s\n\n%s\n%s\n\nPick how the GM desk handles this beat. Bigger heat usually means more risk, but safer control can cool the crowd." % [match_text, rivalry_line, stakes]

func _segment_rivalry(segment: Dictionary) -> Dictionary:
	var rivalry_id := String(segment.get("rivalry_id", ""))
	for rivalry in state.rivalries:
		if rivalry.get("id", "") == rivalry_id:
			return rivalry
	return {}

func _render_choices(segment: Dictionary) -> void:
	_clear_choices()
	var choices: Array = segment.get("choices", [])
	selected_choice = choices[0] if choices.size() else {}
	for choice in choices:
		var button := SCENE_CHOICE_BUTTON.instantiate() as Button
		button.custom_minimum_size = Vector2(0, 70)
		button.text = "%s\nHeat %+d / Reaction %+d / Risk %+d" % [
			choice.get("label", "Choice"),
			int(choice.get("heat", 0)),
			int(choice.get("reaction", 0)),
			int(choice.get("risk", 0))
		]
		button.add_theme_font_size_override("font_size", 15)
		button.pressed.connect(func() -> void:
			selected_choice = choice
			for child in choice_box.get_children():
				child.modulate = Color(1, 1, 1, 0.72)
			button.modulate = Color(1, 0.86, 0.45, 1)
		)
		choice_box.add_child(button)
	if choice_box.get_child_count() > 0:
		choice_box.get_child(0).modulate = Color(1, 0.86, 0.45, 1)

func _clear_choices() -> void:
	for child in choice_box.get_children():
		child.queue_free()

func _on_action_pressed() -> void:
	if current_screen in ["roster", "recruit", "missions", "facilities", "titles", "divisions", "legacy", "shop", "result"]:
		_show_dashboard()
		return
	if show.is_empty():
		_start_show()
		return
	if action_button.text == "Back To War Room":
		_show_dashboard()
		return
	var segments: Array = show.get("segments", [])
	var index := int(show.get("current_index", 0))
	if index >= segments.size():
		_finalize_show()
		return
	var result := ShowResolver.resolve_segment(state, segments[index], selected_choice)
	segment_results.append(result)
	_play_result_sound(result)
	show["current_index"] = index + 1
	if int(show["current_index"]) >= segments.size():
		_finalize_show()
	else:
		_render_current_segment()

func _finalize_show() -> void:
	var result := ShowResolver.finalize_show(state, show, segment_results)
	current_screen = "result"
	_set_background(BG_PPV_RESULT if bool(show.get("is_ppv", false)) else BG_MATCH_RESULT)
	headline.text = "%s RESULTS" % result.get("show_name", "SHOW")
	subline.text = "Week %d complete" % int(result.get("week", state.week - 1))
	phase_line.text = "Rating %s / Crowd %d / +%dG / Fame +%d" % [
		result.get("rating", "C"),
		int(result.get("crowd_reaction", 0)),
		int(result.get("income", 0)),
		int(result.get("fame_gain", 0))
	]
	segment_title.text = "The show is in the books"
	segment_body.text = _final_result_text(result)
	portrait_left.texture = null
	portrait_right.texture = null
	_clear_choices()
	action_button.text = "Back To War Room"
	result_log.text = _results_text()
	show = {}
	_refresh_sidebars()
	_refresh_stats()

func _final_result_text(result: Dictionary) -> String:
	var text := "[b]Next week hooks[/b]\n"
	for hook in result.get("hooks", []):
		text += "- %s\n" % hook
	text += "\n[b]Media report[/b]\n"
	for line in result.get("news", []):
		text += "- %s\n" % line
	var event: Dictionary = result.get("event", {})
	if not event.is_empty():
		text += "\n[b]Backstage event[/b]\n%s: %s\n" % [event.get("title", ""), event.get("body", "")]
	return text

func _results_text() -> String:
	if segment_results.is_empty():
		return "[b]Show log[/b]\nNo segment resolved yet."
	var text := "[b]Show log[/b]\n"
	for result in segment_results:
		text += "- %s: %s (%d)\n" % [
			result.get("title", "Segment"),
			result.get("note", "Resolved"),
			int(result.get("crowd_reaction", 0))
		]
	return text

func _refresh_stats() -> void:
	stats_line.text = "Week %d\nGold %dG\nFame %d / Hype %d" % [state.week, state.gold, state.fame, state.hype]

func _refresh_sidebars() -> void:
	_clear_sidebar(roster_box, 1)
	for wrestler in state.roster.slice(0, 10):
		var label := Label.new()
		label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		label.text = "%s  %s\n%s / CON %d / POP %d / %d-%d" % [
			wrestler.get("grade", "C"),
			wrestler.get("name", ""),
			wrestler.get("style", ""),
			int(wrestler.get("condition", 100)),
			int(wrestler.get("pop", 60)),
			int(wrestler.get("wins", 0)),
			int(wrestler.get("losses", 0))
		]
		label.add_theme_font_size_override("font_size", 14)
		label.add_theme_color_override("font_color", Color(0.92, 0.94, 0.97))
		roster_box.add_child(label)

	_clear_sidebar(rivalry_box, 1)
	for rivalry in state.rivalries:
		var a := state.get_wrestler(rivalry.get("a", ""))
		var b := state.get_wrestler(rivalry.get("b", ""))
		var label := Label.new()
		label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		label.text = "%s vs %s\n%s / Heat %d / Fresh %d" % [
			a.get("name", "A"),
			b.get("name", "B"),
			RivalryManager.stage_label(int(rivalry.get("heat", 0))),
			int(rivalry.get("heat", 0)),
			int(rivalry.get("freshness", 0))
		]
		label.add_theme_font_size_override("font_size", 14)
		label.add_theme_color_override("font_color", Color(0.95, 0.90, 0.80))
		rivalry_box.add_child(label)

func _clear_sidebar(box: VBoxContainer, keep_count: int) -> void:
	var children := box.get_children()
	for index in range(keep_count, children.size()):
		children[index].queue_free()

func _play_result_sound(result: Dictionary) -> void:
	var path := SFX_BASIC
	if String(result.get("finish", "")) == "FINISHER_PIN":
		path = SFX_FINISHER
	elif int(result.get("crowd_reaction", 0)) >= 84:
		path = SFX_CRITICAL
	sfx_player.stream = load(path)
	sfx_player.play()

func _set_background(path: String) -> void:
	background.texture = load(path)
	background.modulate = Color(1, 1, 1, 0.55)
	var tween := create_tween()
	tween.tween_property(background, "modulate", Color.WHITE, 0.22)
	if is_instance_valid(shade_overlay):
		shade_overlay.color = Color(0.02, 0.018, 0.018, 0.78)
		tween.parallel().tween_property(shade_overlay, "color", Color(0.02, 0.018, 0.018, 0.70), 0.22)

func _pulse_control(control: Control) -> void:
	control.scale = Vector2(0.985, 0.985)
	var tween := create_tween()
	tween.tween_property(control, "scale", Vector2.ONE, 0.16).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
