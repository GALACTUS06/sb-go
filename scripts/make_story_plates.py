from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

out = Path(__file__).resolve().parents[1] / "public" / "maps" / "places"
out.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    names = ["arialbd.ttf", "arial.ttf"] if bold else ["arial.ttf", "calibri.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def plate(
    filename: str,
    bg: tuple[int, int, int],
    accent: tuple[int, int, int],
    year: str,
    title: str,
    subtitle: str,
    body: list[str],
    footer: str = "SB GO · Stony Brook archive plate",
) -> None:
    im = Image.new("RGB", (900, 1200), bg)
    d = ImageDraw.Draw(im)
    d.rectangle([36, 36, 864, 1164], outline=accent, width=4)
    d.rectangle([52, 52, 848, 1148], outline=(255, 255, 255), width=1)
    d.rectangle([70, 80, 260, 150], fill=accent)
    d.text((88, 95), year, font=font(36, True), fill=(255, 255, 255))

    title_fill = (20, 20, 20) if sum(bg) > 300 else (245, 245, 245)
    body_fill = (35, 35, 35) if sum(bg) > 300 else (230, 230, 230)

    y = 180
    for line in wrap(d, title, font(46, True), 740):
        d.text((70, y), line, font=font(46, True), fill=title_fill)
        y += 56
    d.text((70, y + 8), subtitle, font=font(24), fill=accent)
    y += 66
    d.line([(70, y), (830, y)], fill=accent, width=2)
    y += 28
    for para in body:
        for line in wrap(d, para, font(27), 760):
            d.text((70, y), line, font=font(27), fill=body_fill)
            y += 34
        y += 16
    d.rectangle([70, 1080, 830, 1125], fill=accent)
    d.text((90, 1090), footer, font=font(22), fill=(255, 255, 255))
    path = out / filename
    im.save(path, quality=93)
    print("ok", filename, path.stat().st_size)


plate(
    "melville-building.jpg",
    (232, 220, 200),
    (153, 0, 0),
    "1963",
    "Frank Melville Jr. Memorial Library",
    "West Campus · knowledge core",
    [
        "The original modular library opened in July 1963 with seats for about 700 students—designed by Damaz, Pokorny & Weigel to grow with a young university.",
        "It was named for Frank Melville Jr., father of Ward Melville, whose land gift made the Stony Brook campus possible.",
    ],
)

plate(
    "melville-open-stacks.jpg",
    (245, 236, 220),
    (110, 70, 40),
    "1963",
    "Open Stacks",
    "Walk the shelves, not a closed vault",
    [
        "From day one the campus library was planned as an open-stack research space—carrels, study rooms, and books you could browse yourself.",
        "That choice still shapes how students hunt, linger, and learn here.",
    ],
)

plate(
    "melville-ward-name.jpg",
    (250, 245, 235),
    (153, 0, 0),
    "1964",
    "Why Melville?",
    "A family name on the campus spine",
    [
        "Frank Melville Jr. co-founded the Melville Shoe Company (later Thom McAn and more). The family summered on Long Island and built Sunwood in the Three Village area.",
        "In 1964 the library began to be called the Frank Melville Jr. Memorial Library—honoring Ward Melville's father while Ward's land gift anchored the university itself.",
    ],
)

plate(
    "melville-wings.jpg",
    (236, 230, 218),
    (90, 70, 50),
    "1971",
    "Wings Around the Core",
    "Modular design meets a growing campus",
    [
        "Architect Ervin Galantay wrapped four five-story wings around the original 1963 module, blending old and new without erasing the first footprint.",
        "After the expansion, the Frank Melville Jr. Memorial Library name was fixed as collections and enrollment surged.",
    ],
)

plate(
    "melville-bridge.jpg",
    (220, 210, 195),
    (70, 60, 50),
    "1977",
    "Bridge to Nowhere",
    "A campus joke that became a connection",
    [
        "In 1967 work began on a huge pedestrian bridge meant to link Fine Arts, the Student Union, and the Library.",
        "Students called it the Bridge to Nowhere until 1977, when it finally connected—about 30 feet wide and 475 feet long.",
    ],
)

plate(
    "melville-archives.jpg",
    (40, 36, 32),
    (200, 160, 100),
    "Today",
    "Special Collections & Archives",
    "Where campus memory is kept",
    [
        "University Archives holds the primary sources behind Stony Brook stories—photographs, bulletins, and institutional records.",
        "Scan this echo to remember that every rumor on campus has a folder somewhere.",
    ],
    footer="SB GO · memory vault",
)

plate(
    "melville-card-catalog.jpg",
    (55, 42, 32),
    (220, 190, 150),
    "1960s",
    "Card Catalog",
    "Discovery before search bars",
    [
        "Before databases, finding a book meant drawers, subject headings, and patience.",
        "In the 1963 library, the catalog was the campus search engine—wooden, stubborn, and shared.",
    ],
)

plate(
    "melville-modular.jpg",
    (235, 225, 210),
    (120, 80, 50),
    "1963",
    "Modular on Purpose",
    "Built to expand with enrollment",
    [
        "The first library was a modular machine: new sections could be added as programs multiplied.",
        "Planners already imagined a structure that could grow toward a million volumes for ten thousand students.",
    ],
)

plate(
    "wang-building.jpg",
    (20, 40, 60),
    (200, 60, 60),
    "2002",
    "Charles B. Wang Center",
    "Asian & Asian American cultural hub",
    [
        "Opened October 22, 2002 after Charles B. Wang's landmark gift—then the largest private donation in SUNY history.",
        "Architect P.H. Tuan shaped a 120,000 sq ft gathering place for exhibitions, performance, gardens, and dialogue across cultures.",
    ],
    footer="SB GO · Wang Center plate",
)

plate(
    "wang-gift.jpg",
    (245, 240, 235),
    (153, 0, 0),
    "$52M",
    "A Gift That Changed Campus",
    "Shanghai to Stony Brook",
    [
        'Wang, founder of CA Technologies, said he was "doubly blessed"—cherishing the land of his birth and the land that became home.',
        "The center was meant as a marketplace of cultural awakenings, not a sealed monument.",
    ],
)

plate(
    "wang-pagoda.jpg",
    (30, 35, 50),
    (220, 180, 100),
    "100 ft",
    "Octagonal Pagoda Tower",
    "A skyline you can read from afar",
    [
        "A roughly 100-foot octagonal pagoda abstraction crowns the building—an intentional silhouette tied to Chinese temple forms.",
        "Even before the facade appears, the tower announces: this place is different.",
    ],
)

plate(
    "wang-garden.jpg",
    (210, 225, 220),
    (40, 90, 80),
    "Garden",
    "Courts, Water & Bridges",
    "Temple-garden memory on Long Island",
    [
        "Glass walls frame outdoor gardens, water, and bridges so interior and sky stay in conversation.",
        "A Zen rock garden on the lower level uses three raised beds to evoke China, Korea, and Japan.",
    ],
)

plate(
    "wang-lantern.jpg",
    (25, 30, 45),
    (230, 200, 140),
    "Glass",
    "Lantern Light",
    "Craft as cultural memory",
    [
        "Shoji-like screens, red trellis entries, and lanterned glow turn modern materials into a cultural threshold.",
        "Hold this plate against what you see—light held in glass.",
    ],
)

plate(
    "wang-water.jpg",
    (160, 185, 195),
    (30, 70, 90),
    "Mirror",
    "Still Water",
    "Reflection as archive",
    [
        "Pools and planted courts slow the rush of Nicolls Road traffic into pause.",
        "In the memory layer, water doubles the campus—what you see twice, you remember once.",
    ],
)

plate(
    "wang-jasmine.jpg",
    (250, 245, 240),
    (180, 40, 40),
    "Daily",
    "Jasmine Crossroads",
    "Food, friends, foot traffic",
    [
        "The Jasmine food court and later Jasmine Market stitch everyday student life to the cultural mission upstairs.",
        "Culture here is not only exhibition—it is lunch, conversation, and return visits.",
    ],
)

print("plates", len(list(out.glob("*.jpg"))))
