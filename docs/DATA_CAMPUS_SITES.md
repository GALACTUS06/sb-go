# Campus Sites Data Catalog

Machine template: [`../data/campusSites.template.json`](../data/campusSites.template.json)

## 1. Field dictionary

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable kebab-case id |
| `name` | string | yes | Player-facing name |
| `zone` | `A\|B\|C\|D\|E` | yes | Ship zone |
| `category` | enum | yes | See types |
| `enabled` | boolean | yes | If false, hidden from map |
| `lat` / `lng` | number | yes | WGS84; fill `0` only as placeholder |
| `radiusM` | number | yes | Geofence radius meters |
| `mapX` / `mapY` | number | yes | 0..1 on `campus.webp` |
| `blurb` | string | yes | One modern sentence |
| `facts` | string[] | yes | 1–3 verified bullets |
| `recommendedOrder` | number | no | Soft guidance sort |
| `unlocksBuilding` | `melville\|wang` | no | Shows enter CTA after claim |
| `isBuildingEntrance` | boolean | no | Counts as entrance geofence |
| `entranceFor` | `melville\|wang` | no | Which branch entrance |
| `sources` | string[] | no | Citation URLs |
| `notes` | string | no | Internal editor notes |
| `placeholder` | boolean | no | True until field-surveyed |

**Rule:** `placeholder: true` sites must ship with `enabled: false` until lat/lng surveyed.

## 2. ID conventions

- Buildings: `frey-hall`, `staller-center`, `wang-center`
- Landmarks: `zebra-path`, `wolfie-statue`
- Entrances (if split): `melville-entrance`

## 3. Zone A — Academic Mall Core (P0)

Fill coordinates in the field. Copy below is starter-accurate historically; verify before enabling.

| id | name | category | unlock / entrance | Starter facts (verify) | recommendedOrder |
|----|------|----------|-------------------|------------------------|------------------|
| `humanities` | Humanities Building | academic | — | Among the first academic buildings when West Campus opened (1962); early classes concentrated here. | 1 |
| `memorial-arch` | 9/11 Memorial Arch | landmark | — | Memorial Arch near Humanities honors Stony Brook alumni lost on Sept 11, 2001. | 2 |
| `frey-hall` | Frey Hall | academic | — | Occupies the transformed original Chemistry Building from the 1962 campus opening; renamed for Robert Frey. | 3 |
| `academic-mall-fountain` | Academic Mall Fountain | landmark | — | Part of the late-1990s/2000 “heart of campus” mall redesign with water and gathering space. | 4 |
| `student-activities-center` | Student Activities Center (SAC) | life | — | Hub for student life, dining, and events on the academic core. | 5 |
| `stony-brook-union` | Stony Brook Union | life | — | Historic student life building; pedestrian bridge lore ties Union–Library history. | 6 |
| `staller-center` | Staller Center for the Arts | arts | — | Fine arts complex opened in phases in the 1970s; renamed Staller Center (1988) after a major gift. | 7 |
| `wang-center` | Charles B. Wang Center | arts | `unlocksBuilding: wang`, entrance | Opened 2002 as an Asian cultural center after a landmark gift; designed with garden, water, and tower motifs. | 8 |
| `melville-library` | Frank Melville Jr. Memorial Library | academic | `unlocksBuilding: melville`, entrance | Main library; named for Frank Melville Jr.; original 1963 modular library later expanded with wrapping wings. | 9 |
| `zebra-path` | Zebra Path | landmark | — | Student-designed public-art walkway (Kim Hardiman, 1981) linking mall and northern campus. | 10 |
| `psychology-a` | Psychology A / cluster | academic | — | Academic cluster on the mall — confirm exact public label on-site. | 11 |
| `harriman-hall` | Harriman Hall | academic | — | Academic building on the core; confirm naming plaque on-site. | 12 |
| `earth-space-sciences` | Earth & Space Sciences | academic | — | Science quad landmark; branch libraries historically lived in science buildings. | 13 |
| `physics-building` | Physics Building | academic | — | Core sciences; campus science identity. | 14 |
| `mathematics-tower` | Mathematics Tower | academic | — | Math complex; survey exact pin. | 15 |
| `chemistry-building` | Chemistry Building | academic | — | Distinct from Frey after Chemistry moved; verify current public name/signage. | 16 |
| `light-engineering` | Light Engineering | academic | — | Engineering quad. | 17 |
| `heavy-engineering` | Heavy Engineering | academic | — | Engineering quad. | 18 |
| `computer-science` | Computer Science | academic | — | Engineering/CS area pin. | 19 |
| `javits-lecture-center` | Jacob K. Javits Lecture Center | academic | — | Large lecture hub; high freshman traffic. | 20 |
| `life-sciences` | Life Sciences Building | academic | — | Biology/life sciences complex. | 21 |
| `student-union-starbucks-node` | Library / Staller corridor node | life | — | Optional dense-path node between Staller and Library for orientation (enable only if not redundant). | 22 |

## 4. Zone B — Landmarks & traditions (P0/P1)

| id | name | category | Starter facts |
|----|------|----------|---------------|
| `wolfie-statue` | Wolfie Statue | landmark | Bronze Seawolf gathering point; campus identity landmark. |
| `sbu-letters` | SBU Landmark Letters | landmark | Large letters near the Union area for photos and orientation. |
| `painted-boulders` | Glacial Boulders | landmark | Ice-age boulders unearthed in construction; campus org painting is a regulated tradition. |
| `bridge-to-nowhere-echo` | Bridge to Nowhere Echo | landmark | Historical pedestrian bridge lore (incomplete then completed, later demolished). Place near documented former alignment if known; else interpretive plaque-style node on mall with photo facts only. |
| `seawolves-spirit-spot` | Seawolves Spirit Spot | landmark | Optional flexible pin at a current spirit/photo location if Letters/Wolfie already cover identity. |

## 5. Zone C — Residential life (P1)

| id | name | category | Notes |
|----|------|----------|-------|
| `roth-quad` | Roth Quad | residential | Quad center pin |
| `tabler-quad` | Tabler Quad | residential | Circular path orientation |
| `h-quad` | H Quad / Mendelsohn area | residential | Survey official naming on arrival |
| `west-side-dining` | West Side Dining | life | Dining landmark for west residential |
| `yang-hall` | Yang Hall area | residential | Near west side cluster |
| `chavez-hall` | Chávez Hall | residential | Named residence; confirm location |
| `keller-hall` | Keller? / west halls | residential | Replace with verified hall ids on survey |
| `chapin-apartments` | Chapin Apartments | residential | Edge of main campus walk |

Enable only halls you can walk-test. Prefer fewer accurate pins over many wrong names.

## 6. Zone D — Athletics & nature edge (P2)

| id | name | category | Notes |
|----|------|----------|-------|
| `island-federal-arena` | Island Federal Credit Union Arena | athletics | Approach entrance pin |
| `kenneth-p-lavalle-stadium` | Kenneth P. LaValle Stadium | athletics | If within intended walk radius |
| `simons-bike-path-access` | Paul Simons Memorial Bike Path | nature | One representative access point |
| `ashley-schiff-preserve` | Ashley Schiff Preserve entrance | nature | Preserve named for Prof. Ashley Schiff |

## 7. Zone E — Admin / arrival (P2)

| id | name | category | Notes |
|----|------|----------|-------|
| `administration-building` | Administration Building | admin | Orientation to services |
| `visitors-parking-circle` | Main arrival / circle | admin | Pick the drop-off students actually use |
| `campus-basics-welcome` | West Campus Welcome Node | admin | Optional tutorial first claim |

## 8. JSON shape (single site)

```json
{
  "id": "melville-library",
  "name": "Frank Melville Jr. Memorial Library",
  "zone": "A",
  "category": "academic",
  "enabled": false,
  "placeholder": true,
  "lat": 0,
  "lng": 0,
  "radiusM": 55,
  "mapX": 0.5,
  "mapY": 0.5,
  "blurb": "Log the knowledge heart of West Campus.",
  "facts": [
    "The original library on this campus opened in 1963.",
    "It is named for Frank Melville Jr., father of campus benefactor Ward Melville.",
    "A major expansion wrapped new wings around the original modular structure."
  ],
  "recommendedOrder": 9,
  "unlocksBuilding": "melville",
  "isBuildingEntrance": true,
  "entranceFor": "melville",
  "sources": [
    "https://library.stonybrook.edu/special-collections/libspecial-home/archives/archives-libraryhistory/"
  ],
  "notes": "Survey at main public entrance used by students"
}
```

## 9. Enablement policy

1. Author row with `placeholder: true`, `enabled: false`
2. Survey lat/lng + mapX/mapY
3. Walk-test radius
4. Fact check against sources
5. Set `placeholder: false`, `enabled: true`
6. Deploy and re-test on cellular

## 10. Coverage targets

| Milestone | Target |
|-----------|--------|
| After Phase 3 | Zone A ≥ 12 enabled sites including Melville + Wang |
| After Phase 6a | Zone B ≥ 4 enabled |
| After Phase 6b | Zone C ≥ 4 enabled |
| Stretch | Zones D+E ≥ 1 each |

“Whole campus” means **systematic zone coverage**, not a fake claim that every door is a node.
