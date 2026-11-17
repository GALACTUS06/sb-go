"""Download CC Wikimedia photos of real SBU buildings into public/maps/places/real/."""
from __future__ import annotations

import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "maps" / "places" / "real"
OUT.mkdir(parents=True, exist_ok=True)

UA = "SB-GO-campus-arg/0.1 (educational; contact: local-dev)"

# Direct upload.wikimedia.org URLs (CC-licensed campus photos)
FILES: dict[str, str] = {
    # Wang Center exteriors / building
    "wang-exterior-1.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/8c/01052013CharlesBWangCenterStonyBrookU.jpg",
    "wang-exterior-2.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/2e/SBUwangcenter.jpg",
    "wang-exterior-3.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wang_Center.jpg",
    "wang-exterior-4.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/7a/%E7%9F%B3%E6%BA%AA%E5%A4%A7%E5%AD%A6%E7%8E%8B%E5%98%89%E5%BB%89%E4%B8%AD%E5%BF%83.jpg",
    # Melville Library
    "melville-exterior-1.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Melville_Library%2C_Stony_Brook_University.jpg",
    "melville-exterior-2.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/4a/MelvilleLibraryStonyBrookUniversity.jpg",
    "melville-exterior-3.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Melville_Library.jpg",
    "melville-interior-1.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Melville_Library_interior%2C_Stony_Brook_University.jpg",
    "melville-atrium.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/8f/SBU_Melville_Atrium.jpg",
}


def fetch(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    print(f"OK {dest.name:28} {len(data):8} bytes")


def main() -> None:
    for name, url in FILES.items():
        dest = OUT / name
        try:
            fetch(url, dest)
        except Exception as e:
            print(f"FAIL {name}: {e}")
            # try commons thumb as fallback for large files
            if "Melville_Library%2C" in url:
                alt = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Melville_Library%2C_Stony_Brook_University.jpg/1280px-Melville_Library%2C_Stony_Brook_University.jpg"
                try:
                    fetch(alt, dest)
                except Exception as e2:
                    print(f"FAIL2 {name}: {e2}")


if __name__ == "__main__":
    main()
