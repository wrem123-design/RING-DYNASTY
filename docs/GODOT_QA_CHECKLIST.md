# Godot QA Checklist

Use this when Godot 4.x is available locally.

## First Launch

- Open `godot/project.godot`.
- Run `res://scenes/main/Main.tscn`.
- Confirm the GM War Room appears with the generated arena background.
- Confirm the top navigation buttons fit on the target resolution.
- Confirm background fade transitions play when switching screens.
- Confirm main content pulses subtly after major screen changes.

## Core Flow

- Start a show.
- Resolve all five segments.
- Confirm choices change crowd reaction, risk, and rivalry heat.
- Confirm show result appears.
- Confirm week advances after results.
- Run until week 4 and confirm PPV naming/flow appears.

## Systems

- Open Roster and confirm all starter wrestlers render.
- Open Recruit and roll each pack type.
- Confirm gold decreases after a recruit roll.
- Confirm new recruits appear in the roster list.
- Confirm Recruit displays large pool counts from generated roster seed.
- Confirm recruit reveal background appears after a roll.
- Open Facilities and buy an upgrade.
- Confirm gold decreases and facility summary changes.
- Open Titles and confirm current champions render.
- Open Divisions and confirm rankings render.
- Create a title rivalry from the Divisions screen.
- Run a title/PPV match and confirm the champion can change.
- Open Missions and confirm progress updates.
- Open Legacy and confirm achievement progress appears.
- Open Shop and confirm Legacy Point purchases show.
- After completing a show, confirm First Bell unlocks.
- After completing a show, confirm Missions displays the latest media report.
- Confirm show result includes media headlines and a backstage event.
- Confirm normal show results use the match highlight background.
- Confirm PPV results use the PPV fallout background.
- Save, restart the scene, then Load.

## Visual/Audio

- Confirm generated backgrounds load.
- Confirm copied wrestler portraits load.
- Confirm `godot/data/generated_roster_seed.json` exists for future full roster import.
- Confirm `godot/data/generated_roster_seed.json` contains 196 entries.
- Confirm basic/critical/finisher SFX play during segment resolution.

## Mobile/Responsive

- Test 1600x900 desktop.
- Test 1280x720 desktop.
- Test a narrow/mobile-like width.
- Confirm nav still fits or remains usable.
- Confirm touch/mouse input activates nav and choice buttons.

## Save Migration

- Save a game.
- Reload it.
- Confirm `save_version` migrates to version 2.
- Confirm facilities, title history, legacy, and last show result remain intact.

## Known Current Risks

- UI is still built mostly in `Main.gd`; later split into scenes.
- No local Godot runtime validation has happened in this environment.
- Full original browser data import is not complete.
- No mobile layout QA yet.
