# Phantom by ART

Scroll landing for **Phantom** wireless earbuds — Midnight & Aura colorways, liquid-glass UI, GSAP ScrollTrigger.

## Live

https://ars218.github.io/phantom/

## Stack

- `index.html` + `styles.css` + `app.js` (split for GitHub Pages)
- GSAP 3 + ScrollTrigger (CDN)
- SVG product (2D-first) — no 3D assets
- Theme via `data-theme` + CSS variables (`midnight` | `aura`)

## Scene order

Hero → Colorways → Sound → Fit & case → Features → CTA

## Local

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch **main** / folder **/ (root)**.

If the live URL 404s after the first push, enable Pages as above and wait 1–2 minutes for CDN cache.
