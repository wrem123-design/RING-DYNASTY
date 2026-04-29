# RING DYNASTY Godot Prototype

This is the first Godot 4 conversion prototype for `RING-DYNASTY`.

## Current Focus

The prototype focuses on the weekly show-flow gameplay:

1. Start the weekly show.
2. Resolve five show segments.
3. Pick GM choices with tradeoffs.
4. Watch rivalry heat, crowd reaction, risk, wins/losses, hype, fame, and gold change.
5. Continue into the next week, with PPV logic every 4 weeks.

It now also includes first-pass versions of:

- Roster office
- Recruitment packs
- Large generated recruit pool from existing wrestler images
- Facility upgrades
- Missions/objectives
- Championship and division rankings
- Media reports and random backstage events
- Legacy achievements and premium shop boosts
- Save/load
- Save migration and external balance data
- Scene-based reusable UI components
- Screen transition animation

## How To Run

Open this folder in Godot 4.x:

```text
godot/project.godot
```

Run the main scene:

```text
res://scenes/main/Main.tscn
```

## Notes

- Godot was not available on PATH during creation, so the first engine launch still needs to happen in the editor.
- The UI is intentionally concentrated in `scripts/ui/Main.gd` for a fast vertical slice.
- The next pass should split the UI into reusable scenes.
- Generated backgrounds are stored inside `assets/images/show`.
- Existing wrestler images are preserved under `assets/images/wrestlers`.
- `data/generated_roster_seed.json` is generated from the existing browser game's custom wrestler image folder.
- Balance values live in `data/balance.json`.
- Reusable UI scenes live in `scenes/ui`.
