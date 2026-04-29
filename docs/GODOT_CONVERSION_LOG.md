# Godot Conversion Log

## 2026-04-29

### Conversion Started

Created the first Godot 4 prototype under `godot/`.

The initial target is not full feature parity with the browser version. It is a playable vertical slice focused on the weakest current area: weekly show progression.

### Implemented In Prototype

- Godot project file and main scene
- Programmatic show-flow UI
- Fixed 10-wrestler starter roster JSON
- Existing wrestler portrait assets copied into the Godot project
- Existing show/cutscene assets copied into the Godot project
- New generated arena-control background for the GM show screen
- New generated contract-signing background for PPV/rivalry presentation
- Weekly show generation
- Five-segment show format
- GM choices per segment
- Match simulation with style advantage, condition, stats, and random momentum
- Rivalry heat/freshness changes
- Show result calculation
- Next-week hook generation
- PPV week branch every 4 weeks

### Generated Image Assets

Generated with the built-in image generation tool using original fictional sports-entertainment prompts. The prompts intentionally avoided real WWE logos, real branding, readable text, and recognizable new wrestler likenesses.

Workspace assets:

- `godot/assets/images/show/gm_control_arena_generated.png`
- `godot/assets/images/show/contract_signing_generated.png`

### Existing Assets Reused

Copied from the browser project:

- `ring_dynasty_logo.png`
- `raw_arena_stage.png`
- `backstage_confrontation_v2.png`
- `contract_signing_silhouette_v2.png`
- `run_in_entrance_v2.png`
- selected wrestler portrait sprites
- selected sound effects

### Current Limitations

- Godot executable is not currently available on PATH, so the project has not been launched from this environment yet.
- UI is built in `Main.gd` for speed; later passes should split it into reusable scenes.
- Save/load is not implemented yet.
- Audio is copied but not wired into the show flow yet.
- The roster is a fixed prototype roster, not yet imported from the full browser data model.
- The match presentation is still result/log driven rather than animated combat.

### Next Recommended Step

Open `godot/project.godot` in Godot 4.x, run the main scene, then fix any engine-reported GDScript syntax issues. After the scene launches, the next development pass should split the UI into:

- `ShowFlow.tscn`
- `SegmentView.tscn`
- `WrestlerCard.tscn`
- `RivalryPanel.tscn`
- `ShowResult.tscn`

Then add save/load and audio feedback.

## 2026-04-29 Continued

### Broader Conversion Pass

Expanded the prototype from a show-flow vertical slice into a wider game shell.

Added:

- Save/load system using `user://ring_dynasty_save.json`
- Recruitment pool JSON
- Recruitment manager with standard, premium, and legend packs
- Duplicate recruit conversion into fame
- Debut rivalry creation chance when a new recruit joins
- Mission/objective manager
- Main UI navigation for War Room, Roster, Recruit, Missions, Save, and Load
- Full roster text view
- Recruitment screen with pack buttons
- Mission screen with live objective progress

New files:

- `godot/data/recruit_pool.json`
- `godot/scripts/core/SaveManager.gd`
- `godot/scripts/systems/RecruitmentManager.gd`
- `godot/scripts/systems/MissionManager.gd`

New copied wrestler assets:

- Charlotte Flair
- CM Punk
- Cody Rhodes
- Drew McIntyre
- Finn Balor
- Gunther
- IYO SKY
- Jade Cargill
- Kevin Owens
- The Rock

### Current Content Coverage

- Show progression: first playable version
- Roster: readable and runtime-updated
- Recruitment/gacha: first playable version
- Missions: first readable version
- Economy: gold/fame/hype and show income/recruit costs
- Save/load: first implementation
- Facilities: first implementation
- Championship booking: partial data only
- Full browser data import: not implemented yet
- Godot editor runtime verification: still pending because Godot executable is not available on PATH

### Facilities Pass

Added the first operations/facility layer.

New file:

- `godot/scripts/systems/FacilityManager.gd`

Facility types:

- Arena: increases show income
- Training Center: improves condition recovery after show segments
- Medical Room: reduces segment risk
- Production Truck: improves crowd reaction

The facilities screen is now available from the main UI navigation. Facility levels are included in save/load.

### Championship Pass

Added the first championship layer.

New file:

- `godot/scripts/systems/ChampionshipManager.gd`

Implemented:

- World Championship and Women's Championship definitions
- Championship summary screen in the main UI
- PPV/title main events attach a title key from the hottest rivalry
- Title-match winners now retain or capture the championship
- Championship holders are included in save/load
- Title history records initial champions and title changes
- Division rankings and top-contender title rivalry creation

Remaining:

- Manual challenger assignment
- Secondary/tag championships

### Visual Polish Pass

Generated three additional screen backgrounds with the built-in image generation tool. Existing assets were preserved and reused; new assets only add extra visual variety.

New generated workspace assets:

- `godot/assets/images/show/roster_office_generated.png`
- `godot/assets/images/show/recruitment_room_generated.png`
- `godot/assets/images/show/championship_hall_generated.png`
- `godot/assets/images/show/facility_ops_generated.png`
- `godot/assets/images/show/mission_command_generated.png`

These are wired into:

- Roster screen
- Recruit screen
- Titles and Divisions screens
- Facilities screen
- Missions/media report screen

### Division Pass

New file:

- `godot/scripts/systems/DivisionManager.gd`

Implemented:

- World and Women's division ranking summaries
- Ranking score based on popularity, wins/losses, morale, fame, and champion status
- Top contender detection
- UI button to create title rivalries from current rankings

### News And Event Pass

New file:

- `godot/scripts/systems/NewsManager.gd`

Implemented:

- Show media report generation after each completed show
- Backstage random event after each show
- Event effects on gold and hype
- Mission screen now displays latest media report
- Show result screen now includes headlines and backstage event fallout

### Data Pipeline Pass

Added a helper script to preserve and reuse the existing wrestler image library instead of replacing it.

New file:

- `scripts/export_godot_roster_seed.py`

Generated:

- `godot/data/generated_roster_seed.json`

The generated seed currently contains 193 wrestler entries derived from existing `data/images/wrestlers/custom/manifest_sprites/*.png` files. It is not yet wired as the active roster source, but it gives the Godot conversion a path toward broad roster import while preserving existing images.

### Full Image Pool Pass

Copied the existing custom wrestler sprite library into the Godot project instead of replacing it.

Godot wrestler image folder:

- `godot/assets/images/wrestlers`

Current count:

- 196 PNG wrestler images

Recruitment now combines:

- curated `godot/data/recruit_pool.json`
- generated `godot/data/generated_roster_seed.json`

The Recruit screen now displays total/owned/available pool counts and grade distribution.

### Reveal And Result Visual Pass

Generated and wired additional spectacle backgrounds:

- `godot/assets/images/show/recruit_pack_reveal_generated.png`
- `godot/assets/images/show/match_highlight_generated.png`
- `godot/assets/images/show/ppv_fallout_generated.png`

Used by:

- recruit result reveal
- normal show result screen
- PPV result/fallout screen

### Legacy And Shop Pass

Generated and wired additional long-term progression backgrounds:

- `godot/assets/images/show/legacy_hall_generated.png`
- `godot/assets/images/show/premium_shop_generated.png`

New file:

- `godot/scripts/systems/LegacyManager.gd`

Implemented:

- Legacy Points
- Achievement definitions and unlock evaluation
- Achievement rewards from show completion, hype, roster size, title changes, facility upgrades, and PPV quality
- One-time premium shop purchases
- Legacy and Shop navigation screens
- Save/load support for legacy state

Legacy currently evaluates after:

- show completion
- recruitment
- facility upgrade
- title change

### Finalization And Refactor Pass

Added the first scene-component split so `Main.gd` no longer constructs every repeated UI widget by hand.

New UI scenes:

- `godot/scenes/ui/NavButton.tscn`
- `godot/scenes/ui/WrestlerPortrait.tscn`
- `godot/scenes/ui/ChoiceButton.tscn`
- `godot/scenes/ui/SidebarPanel.tscn`

Added animation and mobile support:

- background fade tween on screen changes
- content pulse tween on major screen refreshes
- mouse-to-touch emulation
- handheld landscape orientation
- narrower nav buttons for smaller widths

Added balance and migration support:

- `godot/data/balance.json`
- `godot/scripts/systems/BalanceManager.gd`
- save version migration to version 2

Refined roster seed generation:

- `scripts/export_godot_roster_seed.py` now improves known names, grades, styles, and alignments.
- `godot/data/generated_roster_seed.json` now contains 196 entries.
