from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPRITE_DIR = ROOT / "data" / "images" / "wrestlers" / "custom" / "manifest_sprites"
OUT_PATH = ROOT / "godot" / "data" / "generated_roster_seed.json"


STYLE_CYCLE = ["powerhouse", "technician", "showman"]
ALIGNMENT_CYCLE = ["face", "heel", "neutral"]

FEMALE_IDS = {
    "alba_fyre", "alexa_bliss", "asuka", "ava", "b_fab", "bayley", "becky_lynch",
    "bianca_belair", "brie_bella", "candice_lerae", "charlotte_flair",
    "chelsea_green", "dakota_kai", "dana_brooke", "daphanie_lashaunn", "giulia",
    "iyo_sky", "ivy_nile", "jacy_jayne", "jade_cargill", "kairi_sane", "kaitlyn",
    "kylie_rae", "lash_legend", "liv_morgan", "lyra_valkyria", "mariah_may",
    "maxxine_dupri", "mia_yim", "michin", "naomi", "natalya_neidhart", "nia_jax",
    "nikki_bella", "nikki_cross", "piper_niven", "raquel_rodriguez", "rhea_ripley",
    "ronda_rousey", "roxanne_perez", "saraya_bevis", "scarlett_bordeaux",
    "sonya_deville", "stephanie_mcmahon", "stephanie_vaquer", "tenille_dashwood",
    "tiffany_stratton", "zelina_vega",
}

KNOWN_META = {
    "aj_styles": ("S", "technician", "face"),
    "asuka": ("S", "technician", "heel"),
    "batista": ("LEGEND", "powerhouse", "face"),
    "becky_lynch": ("S", "showman", "face"),
    "bianca_belair": ("S", "powerhouse", "face"),
    "charlotte_flair": ("LEGEND", "technician", "heel"),
    "cm_punk": ("S", "showman", "face"),
    "cody_rhodes": ("S", "showman", "face"),
    "gunther": ("S", "powerhouse", "heel"),
    "john_cena": ("LEGEND", "showman", "face"),
    "rhea_ripley": ("S", "powerhouse", "heel"),
    "roman_reigns": ("LEGEND", "powerhouse", "heel"),
    "seth_rollins": ("S", "showman", "face"),
    "the_rock": ("LEGEND", "showman", "face"),
    "the_undertaker": ("LEGEND", "powerhouse", "face"),
    "stone_cold_steve_austin": ("LEGEND", "showman", "face"),
    "ric_flair": ("LEGEND", "showman", "heel"),
    "hulk_hogan": ("LEGEND", "powerhouse", "face"),
    "shawn_michaels": ("LEGEND", "showman", "face"),
}

TECHNICIANS = {"bret_hart", "kurt_angle", "bryan_danielson", "chad_gable", "pete_dunne", "ilja_dragunov"}
POWERHOUSES = {"brock_lesnar", "braun_strowman", "omos", "yokozuna", "goldberg", "drew_mcintyre", "sheamus", "oba_femi"}
SHOWMEN = {"la_knight", "the_miz", "logan_paul", "chris_jericho", "sami_zayn", "r_truth"}
HEELS = {"gunther", "roman_reigns", "rhea_ripley", "dominick_mysterio", "dominik_mysterio", "karrion_kross", "solo_sikoa", "logan_paul"}


def titleize(stem: str) -> str:
    cleaned = re.sub(r"^cm_", "", stem)
    cleaned = re.sub(r"_\d+$", "", cleaned)
    special = {
        "aj": "AJ", "cm": "CM", "iyo": "IYO", "xpac": "X-Pac", "r": "R",
        "tna": "TNA", "ecw": "ECW", "wcw": "WCW", "nxt": "NXT",
    }
    parts = []
    for part in re.split(r"[_\-\s]+", cleaned):
        if not part:
            continue
        parts.append(special.get(part.lower(), part.capitalize()))
    return " ".join(parts)


def grade_for_index(index: int) -> str:
    if index % 41 == 0:
        return "LEGEND"
    if index % 7 == 0:
        return "S"
    if index % 3 == 0:
        return "A"
    return "B"


def infer_meta(stem: str, index: int) -> tuple[str, str, str]:
    base_id = re.sub(r"^cm_", "", stem)
    base_id = re.sub(r"_\d+$", "", base_id)
    if base_id in KNOWN_META:
        return KNOWN_META[base_id]
    if stem.startswith("retro_legends_pack") or any(token in base_id for token in ["undertaker", "flair", "hogan", "savage", "warrior", "austin", "rock"]):
        grade = "LEGEND"
    else:
        grade = grade_for_index(index)
    if base_id in TECHNICIANS or any(token in base_id for token in ["hart", "angle", "gable", "dunne", "dragon", "sky"]):
        style = "technician"
    elif base_id in POWERHOUSES or any(token in base_id for token in ["giant", "beast", "crusher", "tank", "bron", "oba"]):
        style = "powerhouse"
    elif base_id in SHOWMEN or any(token in base_id for token in ["knight", "miz", "truth", "jericho", "paul"]):
        style = "showman"
    else:
        style = STYLE_CYCLE[index % len(STYLE_CYCLE)]
    if base_id in HEELS or any(token in base_id for token in ["kross", "sikoa", "priest", "balor", "dominik"]):
        alignment = "heel"
    elif base_id in FEMALE_IDS:
        alignment = "face" if index % 2 == 0 else "heel"
    else:
        alignment = ALIGNMENT_CYCLE[index % len(ALIGNMENT_CYCLE)]
    return grade, style, alignment


def stats_for(index: int, style: str) -> dict[str, int]:
    base = 62 + (index % 18)
    stats = {
        "power": base,
        "stamina": base + 4,
        "technique": base + 2,
        "charisma": base + 3,
        "fame": base + 5,
    }
    if style == "powerhouse":
        stats["power"] += 14
        stats["stamina"] += 7
    elif style == "technician":
        stats["technique"] += 14
        stats["stamina"] += 5
    else:
        stats["charisma"] += 14
        stats["fame"] += 7
    return {key: min(99, value) for key, value in stats.items()}


def main() -> None:
    wrestlers = []
    for index, path in enumerate(sorted(SPRITE_DIR.glob("*.png"))):
        stem = path.stem
        grade, style, alignment = infer_meta(stem, index)
        wrestlers.append(
            {
                "id": stem,
                "name": titleize(stem),
                "nickname": "Legacy Star" if grade == "LEGEND" else "Main Roster Prospect",
                "grade": grade,
                "style": style,
                "alignment": alignment,
                "finisher": "Signature Finish",
                "portrait": f"res://assets/images/wrestlers/{path.name}",
                "source_portrait": str(path.relative_to(ROOT)).replace("\\", "/"),
                "stats": stats_for(index, style),
            }
        )
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(wrestlers, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(wrestlers)} wrestlers to {OUT_PATH}")


if __name__ == "__main__":
    main()
