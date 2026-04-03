from __future__ import annotations

from pathlib import Path
from typing import Iterable, Tuple
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IMG_ROOT = ROOT / "data" / "images"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates += [
            Path("C:/Windows/Fonts/arialbd.ttf"),
            Path("C:/Windows/Fonts/malgunbd.ttf"),
            Path("C:/Windows/Fonts/segoeuib.ttf"),
        ]
    candidates += [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
    ]
    for font_path in candidates:
        if font_path.exists():
            try:
                return ImageFont.truetype(str(font_path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


FONT_XL = load_font(78, bold=True)
FONT_LG = load_font(54, bold=True)
FONT_MD = load_font(34, bold=True)
FONT_SM = load_font(24, bold=True)
FONT_XS = load_font(18, bold=False)


def rgba(hex_color: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def save(img: Image.Image, relative_path: str) -> None:
    out = ROOT / relative_path
    ensure_dir(out.parent)
    img.save(out)


def add_noise_dots(draw: ImageDraw.ImageDraw, width: int, height: int, colors: Iterable[str], count: int, alpha: int = 90) -> None:
    palette = list(colors)
    for _ in range(count):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        size = random.randint(1, 4)
        draw.ellipse((x, y, x + size, y + size), fill=rgba(random.choice(palette), alpha))


def make_gradient_bg(width: int, height: int, top: str, bottom: str) -> Image.Image:
    img = Image.new("RGBA", (width, height), rgba("#000000", 0))
    draw = ImageDraw.Draw(img)
    top_rgb = rgba(top)
    bottom_rgb = rgba(bottom)
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(int(top_rgb[i] * (1 - t) + bottom_rgb[i] * t) for i in range(3)) + (255,)
        draw.line((0, y, width, y), fill=color)
    return img


def draw_centered_text(draw: ImageDraw.ImageDraw, box: Tuple[int, int, int, int], text: str, font, fill, stroke=None, stroke_width: int = 0) -> None:
    x0, y0, x1, y1 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=font, align="center", spacing=6, stroke_width=stroke_width)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = x0 + ((x1 - x0) - tw) / 2
    y = y0 + ((y1 - y0) - th) / 2
    draw.multiline_text((x, y), text, font=font, fill=fill, align="center", spacing=6, stroke_fill=stroke, stroke_width=stroke_width)


def draw_frame(draw: ImageDraw.ImageDraw, box, color: str, width: int = 8, radius: int = 24, inner_alpha: int = 0) -> None:
    draw.rounded_rectangle(box, radius=radius, outline=rgba(color), width=width, fill=rgba("#ffffff", inner_alpha))


def generate_logo() -> None:
    img = make_gradient_bg(1400, 500, "#0d1329", "#2a173a")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for i in range(18):
        alpha = 18 if i % 2 == 0 else 10
        draw.rectangle((i * 90 - 300, 0, i * 90 - 240, 500), fill=rgba("#ffffff", alpha))
    overlay = overlay.rotate(12, resample=Image.Resampling.BICUBIC)
    img.alpha_composite(overlay)
    draw = ImageDraw.Draw(img)
    draw_frame(draw, (26, 26, 1374, 474), "#e74c3c", width=6, radius=30)
    draw_centered_text(draw, (0, 70, 1400, 270), "RING\nDYNASTY", FONT_XL, rgba("#f6f7fb"), stroke=rgba("#b42020"), stroke_width=4)
    draw_centered_text(draw, (0, 310, 1400, 430), "BUILD THE SHOW. RULE THE RING.", FONT_SM, rgba("#f1c40f"))
    save(img, "data/images/ui/logo/ring_dynasty_logo.png")


def generate_show_logo(name: str, subtitle: str, primary: str, secondary: str, path: str) -> None:
    img = make_gradient_bg(1200, 420, primary, secondary)
    draw = ImageDraw.Draw(img)
    for i in range(0, 1200, 80):
        draw.polygon([(i, 0), (i + 50, 0), (i - 30, 420), (i - 80, 420)], fill=rgba("#ffffff", 12))
    draw_frame(draw, (20, 20, 1180, 400), "#f6f7fb", width=4, radius=32)
    draw_centered_text(draw, (40, 70, 1160, 250), name, FONT_LG, rgba("#ffffff"), stroke=rgba("#101522"), stroke_width=3)
    draw_centered_text(draw, (40, 280, 1160, 360), subtitle, FONT_SM, rgba("#ffe28a"))
    save(img, path)


def generate_vs_overlay() -> None:
    img = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1280, 720), fill=rgba("#04070c", 85))
    draw.polygon([(0, 0), (540, 0), (420, 720), (0, 720)], fill=rgba("#3498db", 70))
    draw.polygon([(740, 0), (1280, 0), (1280, 720), (860, 720)], fill=rgba("#e74c3c", 70))
    draw.line((635, 60, 635, 660), fill=rgba("#ffffff", 80), width=3)
    draw.line((645, 60, 645, 660), fill=rgba("#f1c40f", 120), width=6)
    draw_centered_text(draw, (430, 240, 850, 480), "VS", FONT_XL, rgba("#ffffff"), stroke=rgba("#b42020"), stroke_width=4)
    for y in range(100, 620, 70):
        draw.rounded_rectangle((70, y, 270, y + 22), radius=11, fill=rgba("#ffffff", 20))
        draw.rounded_rectangle((1010, y, 1210, y + 22), radius=11, fill=rgba("#ffffff", 20))
    save(img, "data/images/ui/panels/vs_overlay.png")


def generate_gacha_card_back() -> None:
    img = make_gradient_bg(768, 1152, "#081321", "#1d1240")
    draw = ImageDraw.Draw(img)
    draw_frame(draw, (18, 18, 750, 1134), "#9b59b6", width=8, radius=36)
    for i in range(12):
        margin = 44 + i * 18
        draw.rounded_rectangle((margin, margin, 768 - margin, 1152 - margin), radius=30, outline=rgba("#ffffff", 10), width=2)
    draw_centered_text(draw, (120, 220, 648, 520), "RING\nDYNASTY", FONT_LG, rgba("#ffffff"), stroke=rgba("#243b7a"), stroke_width=3)
    draw_centered_text(draw, (120, 650, 648, 900), "GACHA\nCARD", FONT_MD, rgba("#f1c40f"))
    add_noise_dots(draw, 768, 1152, ["#f1c40f", "#9b59b6", "#3498db"], 180, 80)
    save(img, "data/images/ui/panels/gacha_card_back.png")


def generate_panel_frame(path: str, size: Tuple[int, int], primary: str, secondary: str, title: str | None = None) -> None:
    width, height = size
    img = make_gradient_bg(width, height, primary, secondary)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, width, height), fill=rgba("#02040a", 60))
    draw_frame(draw, (18, 18, width - 18, height - 18), "#ecf0f1", width=3, radius=26)
    draw_frame(draw, (36, 36, width - 36, height - 36), "#f1c40f", width=2, radius=22)
    for i in range(0, width, 72):
        draw.line((i, 0, i - 140, height), fill=rgba("#ffffff", 10), width=10)
    if title:
        draw_centered_text(draw, (40, 40, width - 40, 180), title, FONT_MD, rgba("#ffffff"))
    save(img, path)


def generate_badge(path: str, bg: str, fg: str, symbol: str, subtitle: str) -> None:
    img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse((12, 12, 244, 244), fill=rgba(bg), outline=rgba("#ffffff", 80), width=6)
    draw.ellipse((30, 30, 226, 226), outline=rgba(fg, 180), width=4)
    draw_centered_text(draw, (40, 36, 216, 170), symbol, FONT_LG, rgba(fg))
    draw_centered_text(draw, (30, 168, 226, 230), subtitle, FONT_XS, rgba("#ffffff"))
    save(img, path)


def generate_button(path: str, size: Tuple[int, int], primary: str, secondary: str, label: str | None = None) -> None:
    img = make_gradient_bg(size[0], size[1], primary, secondary)
    draw = ImageDraw.Draw(img)
    draw_frame(draw, (4, 4, size[0] - 4, size[1] - 4), "#ffffff", width=2, radius=20)
    if label:
        draw_centered_text(draw, (0, 0, size[0], size[1]), label, FONT_SM, rgba("#ffffff"))
    save(img, path)


def generate_particle_star(path: str, color: str, radius: int = 64) -> None:
    size = radius * 2
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    points = []
    for i in range(10):
        angle = math.radians(-90 + i * 36)
        r = radius * (0.95 if i % 2 == 0 else 0.42)
        points.append((radius + math.cos(angle) * r, radius + math.sin(angle) * r))
    draw.polygon(points, fill=rgba(color, 230))
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    save(img, path)


def generate_particle_burst(path: str, colors: list[str], size: Tuple[int, int], count: int) -> None:
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size[0] // 2, size[1] // 2
    for idx in range(count):
        angle = math.radians((360 / count) * idx + random.randint(-6, 6))
        dist = random.randint(30, min(size) // 2 - 10)
        x = cx + math.cos(angle) * dist
        y = cy + math.sin(angle) * dist
        r = random.randint(4, 14)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=rgba(random.choice(colors), random.randint(140, 230)))
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    save(img, path)


def generate_confetti(path: str) -> None:
    img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    colors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#ecf0f1"]
    for _ in range(80):
        x = random.randint(0, 500)
        y = random.randint(0, 500)
        w = random.randint(8, 24)
        h = random.randint(4, 12)
        angle = random.randint(0, 180)
        rect = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
        ImageDraw.Draw(rect).rectangle((w // 2, h // 2, w + w // 2, h + h // 2), fill=rgba(random.choice(colors), 220))
        rect = rect.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        img.alpha_composite(rect, (x, y))
    save(img, path)


def generate_completed_stamp() -> None:
    img = Image.new("RGBA", (512, 256), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((18, 18, 494, 238), radius=28, outline=rgba("#2ecc71"), width=10)
    draw_centered_text(draw, (20, 30, 492, 230), "COMPLETED", FONT_LG, rgba("#2ecc71"))
    save(img, "data/images/ui/quest/completed_stamp.png")


def main() -> None:
    random.seed(42)

    ensure_dir(IMG_ROOT / "ui" / "logo")
    ensure_dir(IMG_ROOT / "ui" / "panels")
    ensure_dir(IMG_ROOT / "ui" / "badges")
    ensure_dir(IMG_ROOT / "ui" / "buttons")
    ensure_dir(IMG_ROOT / "ui" / "particles")
    ensure_dir(IMG_ROOT / "ui" / "quest")
    ensure_dir(IMG_ROOT / "ui" / "legacy")
    ensure_dir(IMG_ROOT / "ui" / "story")

    generate_logo()
    generate_show_logo("ROYAL DYNASTY", "THE ROAD TO GLORY", "#2b1745", "#7a0f1c", "data/images/shows/royal_dynasty.png")
    generate_show_logo("ELIMINATION NIGHT", "NO ESCAPE. NO MERCY.", "#13243d", "#3f1a6b", "data/images/shows/elimination_night.png")
    generate_show_logo("IRON CHAMPIONSHIP", "ONLY THE TOUGHEST SURVIVES", "#3d1c10", "#7a3e0f", "data/images/shows/iron_championship.png")
    generate_show_logo("RING DYNASTY MANIA", "THE GRAND STAGE OF THE YEAR", "#3a2610", "#8d1e10", "data/images/shows/ring_dynasty_mania.png")

    generate_vs_overlay()
    generate_gacha_card_back()
    generate_panel_frame("data/images/ui/panels/title_bg.png", (1280, 720), "#0e1733", "#3f1024", "RING DYNASTY")
    generate_panel_frame("data/images/ui/panels/ppv_gold_frame.png", (1280, 720), "#3f2a0a", "#7a1414", "PPV NIGHT")
    generate_panel_frame("data/images/ui/panels/weekly_report_frame.png", (1280, 720), "#0f1e39", "#182f56", "WEEKLY REPORT")
    generate_panel_frame("data/images/ui/panels/mission_board.png", (1280, 720), "#10263a", "#1d4b5a", "MISSIONS")
    generate_panel_frame("data/images/ui/panels/legacy_frame.png", (1280, 720), "#29113d", "#4b1f10", "LEGACY")
    generate_panel_frame("data/images/ui/panels/achievement_toast_bg.png", (960, 220), "#17341d", "#1f5130", "ACHIEVEMENT")

    generate_panel_frame("data/images/ui/story/rivalry_climax.png", (1280, 720), "#3a1010", "#581f1f", "RIVALRY CLIMAX")
    generate_panel_frame("data/images/ui/story/title_match_banner.png", (1280, 360), "#2f2209", "#6f3f11", "TITLE MATCH")
    generate_panel_frame("data/images/ui/story/ppv_night_banner.png", (1280, 360), "#23111f", "#7a1111", "TODAY IS PPV NIGHT!")

    generate_panel_frame("data/images/ui/quest/daily_quest_panel.png", (1024, 512), "#12324a", "#1c5875", "DAILY QUEST")
    generate_panel_frame("data/images/ui/quest/weekly_mission_panel.png", (1024, 512), "#3a2a0f", "#735011", "WEEKLY MISSION")
    generate_completed_stamp()

    generate_badge("data/images/ui/badges/face_badge.png", "#1d4ed8", "#dbeafe", "F", "FACE")
    generate_badge("data/images/ui/badges/heel_badge.png", "#b91c1c", "#fee2e2", "H", "HEEL")
    generate_badge("data/images/ui/badges/neutral_badge.png", "#4b5563", "#f3f4f6", "?", "NEUTRAL")
    generate_badge("data/images/ui/badges/powerhouse_badge.png", "#7c2d12", "#fde68a", "P", "POWER")
    generate_badge("data/images/ui/badges/technician_badge.png", "#0f766e", "#ccfbf1", "T", "TECH")
    generate_badge("data/images/ui/badges/showman_badge.png", "#6d28d9", "#f3e8ff", "S", "SHOW")
    generate_badge("data/images/ui/badges/favorite_star.png", "#f59e0b", "#fff7d6", "★", "FAVORITE")
    generate_badge("data/images/ui/badges/champion_crown.png", "#ca8a04", "#fff7d6", "♛", "CHAMP")
    generate_badge("data/images/ui/legacy/legacy_point.png", "#a855f7", "#faf5ff", "L", "LEGACY")

    generate_button("data/images/ui/buttons/primary_button.png", (420, 120), "#1d4ed8", "#2563eb")
    generate_button("data/images/ui/buttons/secondary_button.png", (420, 120), "#475569", "#64748b")
    generate_button("data/images/ui/buttons/danger_button.png", (420, 120), "#991b1b", "#dc2626")

    generate_particle_star("data/images/ui/particles/star_twinkle.png", "#f1c40f", 64)
    generate_particle_burst("data/images/ui/particles/gold_burst.png", ["#f1c40f", "#f39c12", "#fff4bf"], (512, 512), 32)
    generate_particle_burst("data/images/ui/particles/red_sparks.png", ["#e74c3c", "#ff8f84", "#f39c12"], (512, 512), 36)
    generate_particle_burst("data/images/ui/particles/smoke_puff.png", ["#94a3b8", "#cbd5e1", "#64748b"], (512, 512), 28)
    generate_confetti("data/images/ui/particles/confetti_strip.png")


if __name__ == "__main__":
    main()
