# Custom Sprite Atlas Import

1. Put the atlas image anywhere on disk.
2. Copy or edit a config JSON in `data/custom/`.
3. Update `atlas_path` and the `slots` order from left to right.
4. Run:

```powershell
python scripts/import_sprite_atlas.py --config data/custom/retro_legends_pack_01.json
```

The script will:
- detect each sprite region
- crop every wrestler into `data/images/wrestlers/custom/manifest_sprites
- merge every pack into `data/custom/custom_sprite_registry.json`
- rewrite `data/custom/custom_sprite_manifest.js`
- create a report JSON with the detected coordinates

If `wrestler_id` does not already exist in the game, the manifest also registers a custom wrestler template for that id.
