from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MIN_ALPHA = 8
DEFAULT_MIN_PIXELS = 8
DEFAULT_MERGE_GAP = 24
DEFAULT_PADDING = 8
DEFAULT_REGISTRY_PATH = ROOT / "data" / "custom" / "custom_sprite_registry.json"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def resolve_path(raw_path: str | None) -> Path | None:
    if not raw_path:
        return None
    path = Path(raw_path)
    if path.is_absolute():
        return path
    return ROOT / path


def path_to_project_string(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT.resolve()).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "_", value.strip().lower())
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return cleaned or "sprite"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def load_registry(path: Path) -> dict[str, Any]:
    if not path.exists():
      return {"sprites": {}, "templates": {}, "sets": {}}
    raw = load_json(path)
    sprites = raw.get("sprites") if isinstance(raw.get("sprites"), dict) else {}
    templates_raw = raw.get("templates")
    if isinstance(templates_raw, list):
        templates = {
            entry["id"]: entry
            for entry in templates_raw
            if isinstance(entry, dict) and isinstance(entry.get("id"), str) and entry["id"]
        }
    elif isinstance(templates_raw, dict):
        templates = {
            key: value
            for key, value in templates_raw.items()
            if isinstance(key, str) and key and isinstance(value, dict)
        }
    else:
        templates = {}
    sets = raw.get("sets") if isinstance(raw.get("sets"), dict) else {}
    return {"sprites": sprites, "templates": templates, "sets": sets}


def write_registry(path: Path, registry: dict[str, Any]) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(registry, ensure_ascii=False, indent=2), encoding="utf-8")


def get_existing_wrestler_ids() -> set[str]:
    wrestler_dir = ROOT / "data" / "images" / "wrestlers"
    return {item.stem for item in wrestler_dir.glob("*.*") if item.is_file()}


def detect_sprite_boxes(
    image: Image.Image,
    min_alpha: int,
    min_pixels_per_column: int,
    merge_gap: int,
    padding: int,
) -> list[dict[str, int]]:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    width, height = rgba.size
    alpha_pixels = alpha.load()

    active_columns: list[int] = []
    for x in range(width):
        count = 0
        for y in range(height):
            if alpha_pixels[x, y] >= min_alpha:
                count += 1
        if count >= min_pixels_per_column:
            active_columns.append(x)

    if not active_columns:
        return []

    groups: list[tuple[int, int]] = []
    start = active_columns[0]
    previous = active_columns[0]
    for x in active_columns[1:]:
        if x - previous <= merge_gap:
            previous = x
            continue
        groups.append((start, previous))
        start = x
        previous = x
    groups.append((start, previous))

    boxes: list[dict[str, int]] = []
    for x0, x1 in groups:
        left = max(0, x0 - padding)
        right = min(width - 1, x1 + padding)
        top = height - 1
        bottom = 0
        found = False
        for x in range(left, right + 1):
            for y in range(height):
                if alpha_pixels[x, y] >= min_alpha:
                    top = min(top, y)
                    bottom = max(bottom, y)
                    found = True
        if not found:
            continue
        top = max(0, top - padding)
        bottom = min(height - 1, bottom + padding)
        boxes.append(
            {
                "x": left,
                "y": top,
                "width": (right - left) + 1,
                "height": (bottom - top) + 1,
            }
        )

    boxes.sort(key=lambda item: item["x"])
    return boxes


def normalize_box(raw_box: dict[str, Any]) -> dict[str, int]:
    return {
        "x": max(0, int(raw_box["x"])),
        "y": max(0, int(raw_box["y"])),
        "width": max(1, int(raw_box["width"])),
        "height": max(1, int(raw_box["height"])),
    }


def trim_image(image: Image.Image) -> tuple[Image.Image, dict[str, int]]:
    bbox = image.getbbox()
    if not bbox:
        return image, {"x": 0, "y": 0, "width": image.width, "height": image.height}
    left, top, right, bottom = bbox
    cropped = image.crop(bbox)
    return cropped, {"x": left, "y": top, "width": right - left, "height": bottom - top}


def build_override_entry(
    wrestler_id: str,
    sprite_path: str,
    slot: dict[str, Any],
    source_box: dict[str, int],
) -> dict[str, Any]:
    entry: dict[str, Any] = {
        "spriteSheet": sprite_path,
        "portraitMode": bool(slot.get("portrait_mode", True)),
        "spriteFrames": max(1, int(slot.get("sprite_frames", 1))),
        "sourceBox": source_box,
    }
    if isinstance(slot.get("battle_sprite_sheet"), str) and slot["battle_sprite_sheet"].strip():
        entry["battleSpriteSheet"] = slot["battle_sprite_sheet"].strip()
    if isinstance(slot.get("sprite_color"), str) and slot["sprite_color"].strip():
        entry["spriteColor"] = slot["sprite_color"].strip()
    return entry


def build_template_entry(
    wrestler_id: str,
    sprite_path: str,
    slot: dict[str, Any],
) -> dict[str, Any]:
    entry: dict[str, Any] = {
        "id": wrestler_id,
        "name": slot.get("name") or wrestler_id.replace("_", " ").title(),
        "nickname": slot.get("nickname") or "",
        "spriteSheet": sprite_path,
        "portraitMode": bool(slot.get("portrait_mode", True)),
        "spriteFrames": max(1, int(slot.get("sprite_frames", 1))),
    }
    optional_keys = [
        "grade",
        "finisher",
        "alignment",
        "style",
        "potentialCapGrade",
    ]
    for key in optional_keys:
        value = slot.get(key)
        if isinstance(value, str) and value.strip():
            entry[key] = value.strip()
    optional_numeric_keys = [
        "age",
        "salary",
        "passiveHypeBonus",
        "popularity",
        "potentialStars",
    ]
    for key in optional_numeric_keys:
        value = slot.get(key)
        if isinstance(value, (int, float)):
            entry[key] = value
    if isinstance(slot.get("stats"), dict):
        entry["stats"] = slot["stats"]
    if isinstance(slot.get("battle_sprite_sheet"), str) and slot["battle_sprite_sheet"].strip():
        entry["battleSpriteSheet"] = slot["battle_sprite_sheet"].strip()
    if isinstance(slot.get("sprite_color"), str) and slot["sprite_color"].strip():
        entry["spriteColor"] = slot["sprite_color"].strip()
    return entry


def write_manifest(
    manifest_path: Path,
    sprite_overrides: dict[str, dict[str, Any]],
    custom_templates: list[dict[str, Any]],
) -> None:
    ensure_dir(manifest_path.parent)
    manifest_lines = [
        "window.CUSTOM_WRESTLER_SPRITES = Object.assign({}, window.CUSTOM_WRESTLER_SPRITES || {}, "
        + json.dumps(sprite_overrides, ensure_ascii=False, indent=2)
        + ");",
        "",
        "window.CUSTOM_WRESTLER_TEMPLATES = (function(existingTemplates) {",
        "  const merged = {};",
        "  (Array.isArray(existingTemplates) ? existingTemplates : []).forEach(function(entry) {",
        "    if (entry && typeof entry.id === 'string' && entry.id) {",
        "      merged[entry.id] = entry;",
        "    }",
        "  });",
        "  "
        + json.dumps(custom_templates, ensure_ascii=False, indent=2)
        + ".forEach(function(entry) {",
        "    if (entry && typeof entry.id === 'string' && entry.id) {",
        "      merged[entry.id] = Object.assign({}, merged[entry.id] || {}, entry);",
        "    }",
        "  });",
        "  return Object.keys(merged).map(function(key) { return merged[key]; });",
        "})(window.CUSTOM_WRESTLER_TEMPLATES);",
        "",
    ]
    manifest_path.write_text("\n".join(manifest_lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Crop a wrestler sprite atlas and generate the custom sprite manifest.")
    parser.add_argument("--config", required=True, help="JSON config path")
    args = parser.parse_args()

    config_path = resolve_path(args.config)
    if config_path is None or not config_path.exists():
        raise FileNotFoundError(f"Config not found: {args.config}")

    config = load_json(config_path)
    atlas_path = resolve_path(config.get("atlas_path"))
    if atlas_path is None or not atlas_path.exists():
        raise FileNotFoundError(f"Atlas not found: {config.get('atlas_path')}")

    output_dir = resolve_path(config.get("output_dir") or "data/images/wrestlers/custom/imported")
    manifest_path = resolve_path(config.get("manifest_path") or "data/custom/custom_sprite_manifest.js")
    registry_path = resolve_path(config.get("registry_path") or str(DEFAULT_REGISTRY_PATH))
    report_path = resolve_path(config.get("report_path") or "data/custom/last_sprite_import_report.json")
    if output_dir is None or manifest_path is None or registry_path is None or report_path is None:
        raise ValueError("Output, manifest, registry, and report paths must resolve correctly.")

    ensure_dir(output_dir)
    ensure_dir(report_path.parent)

    image = Image.open(atlas_path).convert("RGBA")
    detect_config = config.get("detect") if isinstance(config.get("detect"), dict) else {}
    detected_boxes = detect_sprite_boxes(
        image=image,
        min_alpha=int(detect_config.get("min_alpha", DEFAULT_MIN_ALPHA)),
        min_pixels_per_column=int(detect_config.get("min_pixels_per_column", DEFAULT_MIN_PIXELS)),
        merge_gap=int(detect_config.get("merge_gap", DEFAULT_MERGE_GAP)),
        padding=int(detect_config.get("padding", DEFAULT_PADDING)),
    )

    slots = config.get("slots") if isinstance(config.get("slots"), list) else []
    if not slots:
        raise ValueError("Config must contain a non-empty slots array.")

    all_slots_have_boxes = all(isinstance(slot, dict) and isinstance(slot.get("box"), dict) for slot in slots)
    if detected_boxes and len(detected_boxes) != len(slots) and not all_slots_have_boxes:
        raise ValueError(
            f"Detected {len(detected_boxes)} sprites but config contains {len(slots)} slots. "
            "Adjust the detect settings or provide manual box values."
        )

    existing_ids = get_existing_wrestler_ids()
    sprite_overrides: dict[str, dict[str, Any]] = {}
    custom_templates: list[dict[str, Any]] = []
    report_slots: list[dict[str, Any]] = []

    trim_enabled = bool(detect_config.get("trim", True))

    for index, slot in enumerate(slots):
        if not isinstance(slot, dict):
            raise ValueError(f"Slot {index + 1} must be an object.")
        wrestler_id = str(slot.get("wrestler_id") or slot.get("id") or "").strip()
        if not wrestler_id:
            raise ValueError(f"Slot {index + 1} is missing wrestler_id.")

        raw_box = slot.get("box") if isinstance(slot.get("box"), dict) else None
        source_box = normalize_box(raw_box) if raw_box else detected_boxes[index]
        x = source_box["x"]
        y = source_box["y"]
        width = source_box["width"]
        height = source_box["height"]
        cropped = image.crop((x, y, x + width, y + height))

        trim_offset = {"x": 0, "y": 0, "width": cropped.width, "height": cropped.height}
        if trim_enabled:
            cropped, trim_offset = trim_image(cropped)

        output_name = str(slot.get("output_name") or wrestler_id or f"slot_{index + 1}").strip()
        output_slug = slugify(output_name)
        output_file = output_dir / f"{output_slug}.png"
        cropped.save(output_file)
        sprite_path = path_to_project_string(output_file)

        sprite_overrides[wrestler_id] = build_override_entry(
            wrestler_id=wrestler_id,
            sprite_path=sprite_path,
            slot=slot,
            source_box=source_box,
        )

        should_register_template = bool(slot.get("register_template")) or wrestler_id not in existing_ids
        if should_register_template:
            custom_templates.append(build_template_entry(wrestler_id=wrestler_id, sprite_path=sprite_path, slot=slot))

        report_slots.append(
            {
                "order": index + 1,
                "wrestler_id": wrestler_id,
                "name": slot.get("name") or wrestler_id.replace("_", " ").title(),
                "sprite_path": sprite_path,
                "source_box": source_box,
                "trim_offset": trim_offset,
                "registered_template": should_register_template,
            }
        )

    registry = load_registry(registry_path)
    registry_sprites = registry.get("sprites") if isinstance(registry.get("sprites"), dict) else {}
    registry_templates = registry.get("templates") if isinstance(registry.get("templates"), dict) else {}
    registry_sets = registry.get("sets") if isinstance(registry.get("sets"), dict) else {}

    registry_sprites.update(sprite_overrides)
    for template in custom_templates:
        template_id = template.get("id")
        if isinstance(template_id, str) and template_id:
            registry_templates[template_id] = {
                **(registry_templates.get(template_id) or {}),
                **template,
            }
    registry_sets[str(config.get("set_name") or config_path.stem)] = {
        "atlas_path": str(atlas_path),
        "output_dir": path_to_project_string(output_dir),
        "report_path": path_to_project_string(report_path),
        "wrestler_ids": [slot["wrestler_id"] for slot in report_slots],
    }
    registry = {
        "sprites": registry_sprites,
        "templates": registry_templates,
        "sets": registry_sets,
    }

    write_registry(registry_path, registry)
    write_manifest(
        manifest_path=manifest_path,
        sprite_overrides=registry_sprites,
        custom_templates=list(registry_templates.values()),
    )

    report = {
        "set_name": config.get("set_name") or config_path.stem,
        "atlas_path": str(atlas_path),
        "atlas_size": {"width": image.width, "height": image.height},
        "output_dir": path_to_project_string(output_dir),
        "manifest_path": path_to_project_string(manifest_path),
        "registry_path": path_to_project_string(registry_path),
        "slots": report_slots,
    }
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Imported {len(report_slots)} sprites from {atlas_path}")
    print(f"Manifest: {manifest_path}")
    print(f"Registry: {registry_path}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
