# Real maps & cost

## Do we need Google Maps API?

**No — not required.** SB GO uses:

| Layer | Source | Cost |
|-------|--------|------|
| Outdoor satellite | **Esri World Imagery** via Leaflet | **$0** (no API key) |
| Outdoor streets | **OpenStreetMap** via Leaflet | **$0** |
| Indoor Melville | Official SBU **Melville emergency floor-plan PDF** | **$0** (public university doc) |
| Indoor Wang | Official SBU **Wang gallery walking-map PDF** | **$0** |
| Print campus overview | [CampusMap.pdf](https://www.stonybrook.edu/sb/map/CampusMap.pdf) | Reference only |

## If you still want Google Maps

- Dynamic Maps currently includes a **monthly free usage cap** (on the order of **10,000 map loads** for Essentials Dynamic Maps — confirm on [Google’s pricing page](https://developers.google.com/maps/billing-and-pricing/pricing)).
- You must attach a **billing account** even to use the free cap.
- For a class ARG with dozens of testers, free cap is usually enough — but overage bills are real if the key leaks or traffic spikes.
- **Recommendation for this project:** stay on Leaflet + Esri/OSM unless you specifically need Google POIs / Street View.

## Official SBU map links

- Campus map index: https://www.stonybrook.edu/sb/map/campusindex1.html
- Campus PDF: https://www.stonybrook.edu/sb/map/CampusMap.pdf
- Melville emergency plan (includes floor plans): https://library.stonybrook.edu/wp-content/uploads/2014/09/Melville-Building-Emergency-plan-updated-3-15-16.pdf
- Wang gallery walking map: https://www.stonybrook.edu/commcms/healthieru/docs/SBM-WalkingMaps-2014-CBWangCenter.pdf

Local copies live in `public/maps/real/`.
