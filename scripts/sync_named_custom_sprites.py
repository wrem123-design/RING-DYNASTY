from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path
from typing import Any


SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from import_sprite_atlas import (  # noqa: E402
    ROOT,
    get_existing_wrestler_ids,
    load_registry,
    path_to_project_string,
    write_manifest,
    write_registry,
)


def normalize_label(value: str) -> str:
    normalized = value.strip().lower()
    normalized = re.sub(r"\.[^.]+$", "", normalized)
    normalized = re.sub(r"[\s_\-\.]+", "", normalized)
    normalized = normalized.replace("&", "and")
    return normalized


NAME_ALIASES: dict[str, dict[str, str]] = {
    normalize_label("Alexa Bliss"): {"id": "alexa_bliss", "name": "Alexa Bliss"},
    normalize_label("AJ 스타일"): {"id": "aj_styles", "name": "AJ Styles"},
    normalize_label("Asuka"): {"id": "asuka", "name": "Asuka"},
    normalize_label("Bayley"): {"id": "bayley", "name": "Bayley"},
    normalize_label("Becky Lynch"): {"id": "becky_lynch", "name": "Becky Lynch"},
    normalize_label("Bianca Belair"): {"id": "bianca_belair", "name": "Bianca Belair"},
    normalize_label("Bryan Danielson"): {"id": "bryan_danielson", "name": "Bryan Danielson"},
    normalize_label("Charlotte Flair"): {"id": "charlotte_flair", "name": "Charlotte Flair"},
    normalize_label("CM Punk"): {"id": "cm_punk", "name": "CM Punk"},
    normalize_label("Cody Rhodes"): {"id": "cody_rhodes", "name": "Cody Rhodes"},
    normalize_label("Dean Ambrose"): {"id": "dean_ambrose", "name": "Dean Ambrose"},
    normalize_label("Daniel Bryan"): {"id": "bryan_danielson", "name": "Bryan Danielson"},
    normalize_label("Drew McIntyre"): {"id": "drew_mcintyre", "name": "Drew McIntyre"},
    normalize_label("edge"): {"id": "edge", "name": "Edge"},
    normalize_label("Finn Balor"): {"id": "finn_balor", "name": "Finn Balor"},
    normalize_label("HHH"): {"id": "tripleh", "name": "Triple H"},
    normalize_label("IYO SKY"): {"id": "iyo_sky", "name": "IYO SKY"},
    normalize_label("Iyo Sky"): {"id": "iyo_sky", "name": "IYO SKY"},
    normalize_label("Jade Cargill"): {"id": "jade_cargill", "name": "Jade Cargill"},
    normalize_label("jade cargill"): {"id": "jade_cargill", "name": "Jade Cargill"},
    normalize_label("Jeff Hardy"): {"id": "jeff_hardy", "name": "Jeff Hardy"},
    normalize_label("Jey Uso"): {"id": "jey_uso", "name": "Jey Uso"},
    normalize_label("LA Knight"): {"id": "la_knight", "name": "LA Knight"},
    normalize_label("LA 나이트"): {"id": "la_knight", "name": "LA Knight"},
    normalize_label("Liv Morgan"): {"id": "liv_morgan", "name": "Liv Morgan"},
    normalize_label("Mick Foley"): {"id": "mick_foley", "name": "Mick Foley"},
    normalize_label("ryback"): {"id": "ryback", "name": "Ryback"},
    normalize_label("Sami Zayn"): {"id": "sami_zayn", "name": "Sami Zayn"},
    normalize_label("Sheamus"): {"id": "sheamus", "name": "Sheamus"},
    normalize_label("Tyler Bate"): {"id": "tyler_bate", "name": "Tyler Bate"},
    normalize_label("cm 펑크"): {"id": "cm_punk", "name": "CM Punk"},
    normalize_label("CM 펑크"): {"id": "cm_punk", "name": "CM Punk"},
    normalize_label("군터"): {"id": "gunther", "name": "Gunther"},
    normalize_label("다니엘 브라이언"): {"id": "bryan_danielson", "name": "Bryan Danielson"},
    normalize_label("더락"): {"id": "the_rock", "name": "The Rock"},
    normalize_label("딘 앰브로스"): {"id": "dean_ambrose", "name": "Dean Ambrose"},
    normalize_label("드류맥킨타이어"): {"id": "drew_mcintyre", "name": "Drew McIntyre"},
    normalize_label("랜디오튼"): {"id": "randy_orton", "name": "Randy Orton"},
    normalize_label("레이미스테리오"): {"id": "rey_mysterio", "name": "Rey Mysterio"},
    normalize_label("리브모건"): {"id": "liv_morgan", "name": "Liv Morgan"},
    normalize_label("로만레인즈"): {"id": "roman_reigns", "name": "Roman Reigns"},
    normalize_label("리아리플리"): {"id": "rhea_ripley", "name": "Rhea Ripley"},
    normalize_label("릭플레어"): {"id": "ric_flair", "name": "Ric Flair"},
    normalize_label("마초맨랜디세비지"): {"id": "randy_savage", "name": "Randy Savage"},
    normalize_label("맨카인드"): {"id": "mankind", "name": "Mankind"},
    normalize_label("믹폴리"): {"id": "mick_foley", "name": "Mick Foley"},
    normalize_label("바티스타"): {"id": "batista", "name": "Batista"},
    normalize_label("베일리"): {"id": "bayley", "name": "Bayley"},
    normalize_label("베키린치"): {"id": "becky_lynch", "name": "Becky Lynch"},
    normalize_label("부커T"): {"id": "booker_t", "name": "Booker T"},
    normalize_label("브록레스너"): {"id": "brock_lesnar", "name": "Brock Lesnar"},
    normalize_label("브론브레이커"): {"id": "bron_breakker", "name": "Bron Breakker"},
    normalize_label("빅쇼"): {"id": "big_show", "name": "Big Show"},
    normalize_label("샬럿플레어"): {"id": "charlotte_flair", "name": "Charlotte Flair"},
    normalize_label("세미제인"): {"id": "sami_zayn", "name": "Sami Zayn"},
    normalize_label("골드버그"): {"id": "goldberg", "name": "Goldberg"},
    normalize_label("세스롤린스"): {"id": "seth_rollins", "name": "Seth Rollins"},
    normalize_label("스캇홀"): {"id": "scott_hall", "name": "Scott Hall"},
    normalize_label("스톤콜드스티브오스틴"): {"id": "stone_cold_steve_austin", "name": "Stone Cold Steve Austin"},
    normalize_label("스팅"): {"id": "sting", "name": "Sting"},
    normalize_label("쉐이머스"): {"id": "sheamus", "name": "Sheamus"},
    normalize_label("아스카"): {"id": "asuka", "name": "Asuka"},
    normalize_label("언더테이커"): {"id": "the_undertaker", "name": "The Undertaker"},
    normalize_label("워리어"): {"id": "ultimate_warrior", "name": "Ultimate Warrior"},
    normalize_label("존시나"): {"id": "john_cena", "name": "John Cena"},
    normalize_label("제이드 카길"): {"id": "jade_cargill", "name": "Jade Cargill"},
    normalize_label("제이우소"): {"id": "jey_uso", "name": "Jey Uso"},
    normalize_label("제프하디"): {"id": "jeff_hardy", "name": "Jeff Hardy"},
    normalize_label("코디로즈"): {"id": "cody_rhodes", "name": "Cody Rhodes"},
    normalize_label("캐빈내쉬"): {"id": "kevin_nash", "name": "Kevin Nash"},
    normalize_label("커트앵글"): {"id": "kurt_angle", "name": "Kurt Angle"},
    normalize_label("케인"): {"id": "kane", "name": "Kane"},
    normalize_label("케인오웬스"): {"id": "kevin_owens", "name": "Kevin Owens"},
    normalize_label("크리스 제리코"): {"id": "chris_jericho", "name": "Chris Jericho"},
    normalize_label("펀밸러"): {"id": "finn_balor", "name": "Finn Balor"},
    normalize_label("핀밸러"): {"id": "finn_balor", "name": "Finn Balor"},
    normalize_label("헐크호간"): {"id": "hulk_hogan", "name": "Hulk Hogan"},
}

ID_TO_NAME: dict[str, str] = {}
for meta in NAME_ALIASES.values():
    if meta["id"] not in ID_TO_NAME:
        ID_TO_NAME[meta["id"]] = meta["name"]


def resolve_alias(stem: str, template_ids: set[str]) -> dict[str, str] | None:
    alias = NAME_ALIASES.get(normalize_label(stem))
    if alias:
        return alias
    candidate_id = re.sub(r"[^a-z0-9_]+", "", stem.strip().lower()).strip("_")
    if not candidate_id:
        return None
    if candidate_id in ID_TO_NAME:
        return {"id": candidate_id, "name": ID_TO_NAME[candidate_id]}
    if candidate_id in template_ids:
        template_name = candidate_id.replace("_", " ").title()
        return {"id": candidate_id, "name": template_name}
    return None


def ensure_template(
    templates: dict[str, dict[str, Any]],
    wrestler_id: str,
    display_name: str,
    sprite_path: str,
    existing_ids: set[str],
) -> None:
    if wrestler_id in existing_ids and wrestler_id not in templates:
        return
    current = templates.get(wrestler_id, {})
    templates[wrestler_id] = {
        **current,
        "id": wrestler_id,
        "name": current.get("name") or display_name,
        "spriteSheet": sprite_path,
        "portraitMode": True,
        "spriteFrames": 1,
    }


def remap_sprite_id(
    registry: dict[str, Any],
    existing_ids: set[str],
    old_id: str,
    new_id: str,
    display_name: str,
    sprite_path: str,
) -> None:
    sprites = registry.setdefault("sprites", {})
    templates = registry.setdefault("templates", {})
    sets = registry.setdefault("sets", {})
    old_entry = sprites.pop(old_id, {})
    sprites[new_id] = {
        **old_entry,
        "spriteSheet": sprite_path,
        "portraitMode": True,
        "spriteFrames": 1,
    }
    templates.pop(old_id, None)
    ensure_template(templates, new_id, display_name, sprite_path, existing_ids)
    for set_info in sets.values():
        wrestler_ids = set_info.get("wrestler_ids")
        if not isinstance(wrestler_ids, list):
            continue
        set_info["wrestler_ids"] = [new_id if value == old_id else value for value in wrestler_ids]


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalize manually named custom sprite files and sync them into the custom sprite registry.")
    parser.add_argument("--source-dir", required=True, help="Folder containing manually named sprite PNGs")
    parser.add_argument("--set-name", required=True, help="Registry set name")
    parser.add_argument("--registry-path", default="data/custom/custom_sprite_registry.json", help="Registry JSON path")
    parser.add_argument("--manifest-path", default="data/custom/custom_sprite_manifest.js", help="Manifest JS path")
    parser.add_argument("--replace-sprite-id", nargs=4, action="append", metavar=("OLD_ID", "NEW_ID", "DISPLAY_NAME", "SPRITE_PATH"))
    args = parser.parse_args()

    source_dir = Path(args.source_dir)
    if not source_dir.is_absolute():
        source_dir = ROOT / source_dir
    if not source_dir.exists():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    registry_path = Path(args.registry_path)
    if not registry_path.is_absolute():
        registry_path = ROOT / registry_path
    manifest_path = Path(args.manifest_path)
    if not manifest_path.is_absolute():
        manifest_path = ROOT / manifest_path

    registry = load_registry(registry_path)
    sprites = registry.setdefault("sprites", {})
    templates = registry.setdefault("templates", {})
    sets = registry.setdefault("sets", {})
    existing_ids = get_existing_wrestler_ids()
    template_ids = set(templates.keys())

    if args.replace_sprite_id:
        for old_id, new_id, display_name, sprite_raw_path in args.replace_sprite_id:
            sprite_path = Path(sprite_raw_path)
            if not sprite_path.is_absolute():
                sprite_path = ROOT / sprite_path
            remap_sprite_id(
                registry=registry,
                existing_ids=existing_ids,
                old_id=old_id,
                new_id=new_id,
                display_name=display_name,
                sprite_path=path_to_project_string(sprite_path),
            )

    resolved_ids: list[str] = []
    for file_path in sorted(source_dir.iterdir()):
        if not file_path.is_file():
            continue
        alias = resolve_alias(file_path.stem, template_ids)
        if not alias:
            continue
        wrestler_id = alias["id"]
        display_name = alias["name"]
        target_path = file_path.with_name(f"{wrestler_id}{file_path.suffix.lower()}")
        if target_path != file_path:
            if target_path.exists():
                target_path.unlink()
            shutil.move(str(file_path), str(target_path))
        sprite_path = path_to_project_string(target_path)
        current_sprite = {
            key: value
            for key, value in (sprites.get(wrestler_id, {}) or {}).items()
            if key != "sourceBox"
        }
        sprites[wrestler_id] = {
            **current_sprite,
            "spriteSheet": sprite_path,
            "portraitMode": True,
            "spriteFrames": 1,
        }
        ensure_template(templates, wrestler_id, display_name, sprite_path, existing_ids)
        template_ids = set(templates.keys())
        if wrestler_id not in resolved_ids:
            resolved_ids.append(wrestler_id)

    sets[args.set_name] = {
        "source_dir": path_to_project_string(source_dir),
        "wrestler_ids": resolved_ids,
    }

    write_registry(registry_path, registry)
    write_manifest(
        manifest_path=manifest_path,
        sprite_overrides=sprites,
        custom_templates=list(templates.values()),
    )

    print(f"synced={len(resolved_ids)}")
    print(f"source_dir={source_dir}")
    print(f"set_name={args.set_name}")


if __name__ == "__main__":
    main()
