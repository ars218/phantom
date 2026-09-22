# Phantom by ART

Premium scroll landing for **Phantom** wireless earbuds — Midnight & Aura colorways, liquid-glass UI, cinematic GSAP motion. Craft bar matched to Diet Soda (display type, frosted nav, glass cards, radial theme wash).

## Live

https://ars218.github.io/phantom/

## Stack

- `index.html` + `styles.css` + `app.js` (split for GitHub Pages)
- GSAP 3 + ScrollTrigger (CDN)
- Custom SVG/CSS product (2D-first specular case + buds) — no 3D / GLB assets
- Theme via `data-theme` + CSS variables (`midnight` | `aura`) with 1.2s radial gradient morph
- Fonts: Syne (display) · Manrope (UI) · Inter (body)

## Scene order

Hero → Colorways → Sound → Fit & case → Features → CTA

## Local

```bash
python3 -m http.server 8765
# → http://127.0.0.1:8765/
```

## GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch **main** / folder **/ (root)**.
