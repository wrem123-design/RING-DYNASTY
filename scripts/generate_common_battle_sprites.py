from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "images" / "wrestlers" / "common"
FRAME_SIZE = 48
FRAME_COUNT = 12


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def rgba(hex_color: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


STYLE_PALETTES: Dict[str, Dict[str, str]] = {
    "powerhouse": {
        "body": "#c0392b",
        "accent": "#f39c12",
        "skin": "#f2c6a0",
        "outline": "#1b1f2a",
    },
    "technician": {
        "body": "#2980b9",
        "accent": "#2ecc71",
        "skin": "#f2c6a0",
        "outline": "#1b1f2a",
    },
    "showman": {
        "body": "#8e44ad",
        "accent": "#f1c40f",
        "skin": "#f4c2c2",
        "outline": "#1b1f2a",
    },
}


def rect(draw: ImageDraw.ImageDraw, xy, fill, outline=None):
    draw.rectangle(xy, fill=fill, outline=outline)


def draw_head(draw: ImageDraw.ImageDraw, cx: int, cy: int, palette: Dict[str, str]) -> None:
    draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=rgba(palette["skin"]), outline=rgba(palette["outline"]))
    draw.rectangle((cx - 5, cy - 8, cx + 5, cy - 3), fill=rgba(palette["outline"]))


def draw_torso(draw: ImageDraw.ImageDraw, cx: int, top: int, style: str, palette: Dict[str, str]) -> None:
    width = 12 if style == "powerhouse" else 10 if style == "technician" else 11
    rect(draw, (cx - width // 2, top, cx + width // 2, top + 12), rgba(palette["body"]), rgba(palette["outline"]))
    rect(draw, (cx - 2, top + 4, cx + 2, top + 8), rgba(palette["accent"]))


def draw_limbs(draw: ImageDraw.ImageDraw, cx: int, top: int, left_arm, right_arm, left_leg, right_leg, palette: Dict[str, str]) -> None:
    rect(draw, left_arm, rgba(palette["skin"]), rgba(palette["outline"]))
    rect(draw, right_arm, rgba(palette["skin"]), rgba(palette["outline"]))
    rect(draw, left_leg, rgba("#2d3436"), rgba(palette["outline"]))
    rect(draw, right_leg, rgba("#2d3436"), rgba(palette["outline"]))


def draw_idle_or_walk(draw: ImageDraw.ImageDraw, frame: int, style: str, palette: Dict[str, str]) -> None:
    cx = FRAME_SIZE // 2
    draw_head(draw, cx, 10, palette)
    draw_torso(draw, cx, 16, style, palette)
    walk_phase = frame % 4
    left_leg_shift = [-1, 0, 1, 0][walk_phase]
    right_leg_shift = [1, 0, -1, 0][walk_phase]
    left_arm_shift = [1, 0, -1, 0][walk_phase]
    right_arm_shift = [-1, 0, 1, 0][walk_phase]
    draw_limbs(
        draw,
        cx,
        16,
        (cx - 10 + left_arm_shift, 18, cx - 6 + left_arm_shift, 29),
        (cx + 6 + right_arm_shift, 18, cx + 10 + right_arm_shift, 29),
        (cx - 6 + left_leg_shift, 29, cx - 2 + left_leg_shift, 43),
        (cx + 2 + right_leg_shift, 29, cx + 6 + right_leg_shift, 43),
        palette,
    )


def draw_attack(draw: ImageDraw.ImageDraw, frame: int, style: str, palette: Dict[str, str]) -> None:
    cx = FRAME_SIZE // 2
    draw_head(draw, cx, 10, palette)
    draw_torso(draw, cx, 16, style, palette)
    phase = frame - 4
    reach = [4, 8, 5][phase]
    lift = [0, -1, 0][phase]
    draw_limbs(
        draw,
        cx,
        16,
        (cx - 10, 18, cx - 6, 29),
        (cx + 5, 17 + lift, cx + 5 + reach, 22 + lift),
        (cx - 6, 29, cx - 2, 42),
        (cx + 2, 28, cx + 6, 41),
        palette,
    )


def draw_finisher(draw: ImageDraw.ImageDraw, frame: int, style: str, palette: Dict[str, str]) -> None:
    cx = FRAME_SIZE // 2
    phase = frame - 7
    head_y = [11, 9, 10][phase]
    draw_head(draw, cx, head_y, palette)
    draw_torso(draw, cx, 17 if phase == 1 else 16, style, palette)
    left_arm = [(cx - 11, 20, cx - 7, 28), (cx - 12, 16, cx - 8, 24), (cx - 11, 17, cx - 7, 25)][phase]
    right_arm = [(cx + 7, 17, cx + 16, 22), (cx + 7, 14, cx + 17, 19), (cx + 7, 16, cx + 15, 22)][phase]
    left_leg = [(cx - 6, 29, cx - 2, 42), (cx - 7, 30, cx - 3, 43), (cx - 6, 29, cx - 2, 43)][phase]
    right_leg = [(cx + 2, 28, cx + 6, 39), (cx + 3, 27, cx + 7, 38), (cx + 2, 29, cx + 6, 41)][phase]
    draw_limbs(draw, cx, 16, left_arm, right_arm, left_leg, right_leg, palette)
    rect(draw, (cx + 16, 15, cx + 22, 17), rgba(palette["accent"]))


def draw_victory(draw: ImageDraw.ImageDraw, style: str, palette: Dict[str, str]) -> None:
    cx = FRAME_SIZE // 2
    draw_head(draw, cx, 9, palette)
    draw_torso(draw, cx, 15, style, palette)
    draw_limbs(
        draw,
        cx,
        15,
        (cx - 12, 10, cx - 8, 20),
        (cx + 8, 10, cx + 12, 20),
        (cx - 6, 29, cx - 2, 43),
        (cx + 2, 29, cx + 6, 43),
        palette,
    )
    rect(draw, (cx - 2, 4, cx + 2, 8), rgba(palette["accent"]))


def draw_down(draw: ImageDraw.ImageDraw, style: str, palette: Dict[str, str]) -> None:
    cy = 31
    rect(draw, (10, cy - 3, 27, cy + 5), rgba(palette["body"]), rgba(palette["outline"]))
    draw.ellipse((28, cy - 5, 38, cy + 5), fill=rgba(palette["skin"]), outline=rgba(palette["outline"]))
    rect(draw, (7, cy - 1, 12, cy + 3), rgba(palette["skin"]), rgba(palette["outline"]))
    rect(draw, (37, cy - 1, 43, cy + 3), rgba(palette["skin"]), rgba(palette["outline"]))
    rect(draw, (14, cy + 5, 18, cy + 12), rgba("#2d3436"), rgba(palette["outline"]))
    rect(draw, (22, cy + 5, 26, cy + 12), rgba("#2d3436"), rgba(palette["outline"]))


def create_sheet(style: str) -> Image.Image:
    palette = STYLE_PALETTES[style]
    img = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))
    for frame in range(FRAME_COUNT):
        frame_img = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame_img)
        if frame <= 3:
            draw_idle_or_walk(draw, frame, style, palette)
        elif frame <= 6:
            draw_attack(draw, frame, style, palette)
        elif frame <= 9:
            draw_finisher(draw, frame, style, palette)
        elif frame == 10:
            draw_victory(draw, style, palette)
        else:
            draw_down(draw, style, palette)
        img.alpha_composite(frame_img, (frame * FRAME_SIZE, 0))
    return img


def main() -> None:
    ensure_dir(OUT_DIR)
    for style in STYLE_PALETTES:
      create_sheet(style).save(OUT_DIR / f"{style}_sheet.png")


if __name__ == "__main__":
    main()
