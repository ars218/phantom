# Phantom by ART

Scroll landing for **Phantom** wireless earbuds — Midnight & Aura colorways, liquid-glass UI, GSAP ScrollTrigger.

## Live

https://ars218.github.io/phantom/

## Enable GitHub Pages (required once)

If the live URL 404s, enable Pages:

1. Open https://github.com/ars218/phantom/settings/pages
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)** → **Save**
4. Wait 1–2 minutes, then hard-refresh the live URL (CDN cache can lag)

## Stack

- `index.html` + `styles.css` + `app.js` (split for GitHub Pages)
- GSAP 3 + ScrollTrigger (CDN)
- SVG product (2D-first) — no 3D assets
- Theme via `data-theme` + CSS variables (`midnight` | `aura`)

## Scene order

Hero → Colorways → Sound → Fit & case → Features → CTA

## Local

```bash
npx serve .
```
