# Phantom by ART

Premium scroll landing for **Phantom** wireless earbuds — Midnight & Aura colorways, liquid-glass UI, cinematic GSAP motion. Craft bar matched to Diet Soda (display type, frosted nav, glass cards, radial theme wash).

## Live

https://ars218.github.io/phantom/

## Stack

- `index.html` + `styles.css` + `styles-craft.css` + `app.js` (split for GitHub Pages)
- GSAP 3 + ScrollTrigger (CDN)
- **Google [`model-viewer`](https://modelviewer.dev/)** hero — real GLB earbuds + charging case at `models/earbuds_case.glb`
- Theme via `data-theme` + CSS variables (`midnight` | `aura`) with 1.2s radial gradient morph; model tint via materials API (fallback: CSS `hue-rotate` / saturate)
- Fonts: Syne (display) · Manrope (UI) · Inter (body)

## 3D model credit

Earbuds / case GLB from **[Noah Kennedy — Kennedy_Noah_earbuds](https://github.com/noahk3409/Kennedy_Noah_earbuds)** (MIT). See `models/LICENSE-model.txt`.

## Scene order

Hero → Colorways → Sound → Fit & case → Features → CTA

## Local

```bash
cd /workspace/phantom
python3 -m http.server 46901 --bind 127.0.0.1
# → http://127.0.0.1:46901/
```

Ensure `models/earbuds_case.glb` returns HTTP 200 (model-viewer needs same-origin relative path).

## GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch **main** / folder **/ (root)**. Commit the binary `models/earbuds_case.glb` so Pages can serve it.


**3D model:** hosted via jsDelivr from the MIT-licensed `earbuds_case.glb` (Noah Kennedy / Kennedy_Noah_earbuds). Local copy kept under `models/` for offline preview.
