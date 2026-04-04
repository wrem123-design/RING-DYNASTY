from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

from PIL import Image


SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from import_sprite_atlas import (  # noqa: E402
    DEFAULT_MERGE_GAP,
    DEFAULT_MIN_ALPHA,
    DEFAULT_MIN_PIXELS,
    DEFAULT_PADDING,
    ROOT,
    build_override_entry,
    build_template_entry,
    detect_sprite_boxes,
    ensure_dir,
    get_existing_wrestler_ids,
    load_registry,
    path_to_project_string,
    trim_image,
    write_manifest,
    write_registry,
)
from sync_named_custom_sprites import ID_TO_NAME, NAME_ALIASES, normalize_label  # noqa: E402


COMMON_ASSIGNMENTS: dict[str, dict[str, str]] = {
    normalize_label("공용1"): {"id": "akira_tozawa", "name": "Akira Tozawa"},
    normalize_label("공용2"): {"id": "andre_chase", "name": "Andre Chase"},
    normalize_label("공용3"): {"id": "brooks_jensen", "name": "Brooks Jensen"},
    normalize_label("공용4"): {"id": "charlie_dempsey", "name": "Charlie Dempsey"},
    normalize_label("공용5"): {"id": "dexter_lumis", "name": "Dexter Lumis"},
    normalize_label("공용6"): {"id": "dijak", "name": "Dijak"},
    normalize_label("공용7"): {"id": "grayson_waller", "name": "Grayson Waller"},
    normalize_label("공용8"): {"id": "johnny_gargano", "name": "Johnny Gargano"},
}


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "_", value.strip().lower())
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return cleaned or "slot"


def parse_labels_from_stem(stem: str) -> list[dict[str, Any]]:
    raw_parts: list[str] = []
    for part in [chunk.strip() for chunk in stem.split(",") if chunk.strip()]:
        common_tokens = re.findall(r"공용\s*\d+", part)
        if len(common_tokens) > 1 and not re.sub(r"공용\s*\d+", "", part).strip():
            raw_parts.extend(common_tokens)
            continue
        raw_parts.append(part)
    labels: list[dict[str, Any]] = []
    for index, raw_label in enumerate(raw_parts, start=1):
        duplicate_flag = bool(re.search(r"(중복|duplicate)", raw_label, re.IGNORECASE))
        cleaned = re.sub(r"\([^)]*(중복|duplicate)[^)]*\)", "", raw_label, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        labels.append(
            {
                "order": index,
                "raw_label": raw_label,
                "label": cleaned or raw_label.strip(),
                "duplicate_flag": duplicate_flag,
            }
        )
    return labels


def resolve_label(label: str, known_ids: set[str]) -> dict[str, str] | None:
    normalized = normalize_label(label)
    alias = COMMON_ASSIGNMENTS.get(normalized) or NAME_ALIASES.get(normalized)
    if alias:
        return alias
    candidate_id = re.sub(r"[^a-z0-9_]+", "", label.strip().lower().replace(" ", "_"))
    candidate_id = re.sub(r"_+", "_", candidate_id).strip("_")
    if not candidate_id:
        return None
    if candidate_id in ID_TO_NAME:
        return {"id": candidate_id, "name": ID_TO_NAME[candidate_id]}
    if candidate_id in known_ids:
        return {"id": candidate_id, "name": candidate_id.replace("_", " ").title()}
    return None


def crop_and_save(image: Image.Image, box: dict[str, int], target_path: Path) -> dict[str, int]:
    cropped = image.crop((box["x"], box["y"], box["x"] + box["width"], box["y"] + box["height"]))
    cropped, trim_offset = trim_image(cropped)
    ensure_dir(target_path.parent)
    cropped.save(target_path)
    return trim_offset


def main() -> None:
    parser = argparse.ArgumentParser(description="Import wrestler atlases whose filenames list the left-to-right wrestler order.")
    parser.add_argument("--source-dir", required=True, help="Directory containing atlas PNG files")
    parser.add_argument("--set-name", required=True, help="Registry set name")
    parser.add_argument("--output-dir", required=True, help="Directory for registered sprite outputs")
    parser.add_argument("--extras-dir", required=True, help="Directory for duplicate or unresolved crops")
    parser.add_argument("--report-path", required=True, help="Combined report JSON path")
    parser.add_argument("--registry-path", default="data/custom/custom_sprite_registry.json", help="Registry JSON path")
    parser.add_argument("--manifest-path", default="data/custom/custom_sprite_manifest.js", help="Manifest JS path")
    args = parser.parse_args()

    source_dir = Path(args.source_dir)
    if not source_dir.is_absolute():
        source_dir = ROOT / source_dir
    if not source_dir.exists():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    output_dir = Path(args.output_dir)
    if not output_dir.is_absolute():
        output_dir = ROOT / output_dir
    extras_dir = Path(args.extras_dir)
    if not extras_dir.is_absolute():
        extras_dir = ROOT / extras_dir
    report_path = Path(args.report_path)
    if not report_path.is_absolute():
        report_path = ROOT / report_path
    registry_path = Path(args.registry_path)
    if not registry_path.is_absolute():
        registry_path = ROOT / registry_path
    manifest_path = Path(args.manifest_path)
    if not manifest_path.is_absolute():
        manifest_path = ROOT / manifest_path

    ensure_dir(output_dir)
    ensure_dir(extras_dir)
    ensure_dir(report_path.parent)

    registry = load_registry(registry_path)
    sprites = registry.setdefault("sprites", {})
    templates = registry.setdefault("templates", {})
    sets = registry.setdefault("sets", {})

    existing_ids = get_existing_wrestler_ids()
    known_ids = set(existing_ids) | set(templates.keys()) | set(sprites.keys())
    registered_ids_in_batch: set[str] = set()
    registered_ids: list[str] = []
    extra_outputs: list[str] = []
    report_files: list[dict[str, Any]] = []

    for atlas_path in sorted(source_dir.glob("*.png")):
        image = Image.open(atlas_path).convert("RGBA")
        labels = parse_labels_from_stem(atlas_path.stem)
        boxes = detect_sprite_boxes(
            image=image,
            min_alpha=DEFAULT_MIN_ALPHA,
            min_pixels_per_column=DEFAULT_MIN_PIXELS,
            merge_gap=DEFAULT_MERGE_GAP,
            padding=DEFAULT_PADDING,
        )
        if len(labels) != len(boxes):
            raise ValueError(f"{atlas_path.name}: expected {len(labels)} labels but found {len(boxes)} detected sprites")

        file_slots: list[dict[str, Any]] = []
        for slot_meta, source_box in zip(labels, boxes):
            resolved = resolve_label(slot_meta["label"], known_ids)
            is_duplicate = slot_meta["duplicate_flag"]
            if resolved and resolved["id"] in registered_ids_in_batch:
                is_duplicate = True

            if not resolved or is_duplicate:
                suffix = "duplicate" if is_duplicate and resolved else "unresolved"
                resolved_id = resolved["id"] if resolved else f"slot_{slot_meta['order']}"
                extra_stem = f"{atlas_path.stem}_{resolved_id}_{slot_meta['order']}"
                extra_path = extras_dir / f"{slugify(extra_stem)}.png"
                trim_offset = crop_and_save(image, source_box, extra_path)
                extra_outputs.append(path_to_project_string(extra_path))
                file_slots.append(
                    {
                        **slot_meta,
                        "resolved_id": resolved["id"] if resolved else "",
                        "resolved_name": resolved["name"] if resolved else "",
                        "sprite_path": path_to_project_string(extra_path),
                        "source_box": source_box,
                        "trim_offset": trim_offset,
                        "registered": False,
                        "reason": suffix,
                    }
                )
                continue

            wrestler_id = resolved["id"]
            display_name = resolved["name"]
            output_path = output_dir / f"{wrestler_id}.png"
            trim_offset = crop_and_save(image, source_box, output_path)
            sprite_path = path_to_project_string(output_path)
            sprites[wrestler_id] = build_override_entry(
                wrestler_id=wrestler_id,
                sprite_path=sprite_path,
                slot={"portrait_mode": True, "sprite_frames": 1},
                source_box=source_box,
            )

            if wrestler_id not in existing_ids:
                templates[wrestler_id] = {
                    **(templates.get(wrestler_id) or {}),
                    **build_template_entry(
                        wrestler_id=wrestler_id,
                        sprite_path=sprite_path,
                        slot={"name": display_name, "portrait_mode": True, "sprite_frames": 1},
                    ),
                }

            registered_ids_in_batch.add(wrestler_id)
            known_ids.add(wrestler_id)
            if wrestler_id not in registered_ids:
                registered_ids.append(wrestler_id)
            file_slots.append(
                {
                    **slot_meta,
                    "resolved_id": wrestler_id,
                    "resolved_name": display_name,
                    "sprite_path": sprite_path,
                    "source_box": source_box,
                    "trim_offset": trim_offset,
                    "registered": True,
                    "reason": "registered",
                }
            )

        report_files.append(
            {
                "atlas_path": str(atlas_path),
                "atlas_size": {"width": image.width, "height": image.height},
                "slots": file_slots,
            }
        )

    sets[args.set_name] = {
        "source_dir": path_to_project_string(source_dir),
        "output_dir": path_to_project_string(output_dir),
        "extras_dir": path_to_project_string(extras_dir),
        "report_path": path_to_project_string(report_path),
        "wrestler_ids": registered_ids,
        "extra_outputs": extra_outputs,
    }
    registry = {
        "sprites": sprites,
        "templates": templates,
        "sets": sets,
    }

    write_registry(registry_path, registry)
    write_manifest(
        manifest_path=manifest_path,
        sprite_overrides=sprites,
        custom_templates=list(templates.values()),
    )

    report = {
        "set_name": args.set_name,
        "source_dir": str(source_dir),
        "output_dir": path_to_project_string(output_dir),
        "extras_dir": path_to_project_string(extras_dir),
        "registered_ids": registered_ids,
        "files": report_files,
    }
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"registered={len(registered_ids)}")
    print(f"extras={len(extra_outputs)}")
    print(f"set_name={args.set_name}")


if __name__ == "__main__":
    main()
