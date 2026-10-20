# Convert — MDD (Master Design Document)

## 1. Overview

**App name:** Convert
**Type:** Single-page web app / Progressive Web App (PWA)
**Built with:** Claude Code in VS Code
**Hosted on:** GitHub Pages (committed and pushed to a GitHub repo)
**Purpose:** A tiny, cute, pink unit converter that does two things and does them well:

1. Kilograms (kg) to Pounds (lb)
2. Celsius (°C) to Fahrenheit (°F)

Users can open it in any browser or add it to their phone's home screen and use it like an app.

## 2. Goals

- Extremely simple: one screen, two converters, no menus, no accounts, no settings.
- Instant results as the user types (no "Convert" button required).
- Cute, soft, pink look and feel that is friendly and fun.
- Works offline once installed or visited (PWA).
- Mobile-first, but looks good on desktop too.

## 3. Non-Goals

- No other unit types (no length, volume, etc.)
- No backend, database, login, ads, or analytics
- No build tools or frameworks required

## 4. Tech Stack

- Plain **HTML + CSS + vanilla JavaScript** (no frameworks, no npm, no build step)
- **PWA:** `manifest.json` + `service-worker.js`
- **Hosting:** GitHub Pages, served from the `main` branch root

## 5. File Structure

```
convert/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── service-worker.js
├── MDD.md                 (this file)
├── README.md
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    └── apple-touch-icon.png   (180x180)
```

**Important for GitHub Pages:** the site is served from a subpath (`https://username.github.io/repo-name/`). Use **relative paths** everywhere (`./style.css`, `./icons/icon-192.png`, `start_url: "./"`, `scope: "./"`). Never use paths starting with `/`.

## 6. Screen Design

One screen, centered card layout, stacked vertically on mobile.

```
┌──────────────────────────────┐
│        🌸 Convert 🌸          │   <- cute title
│   tiny converter, big love   │   <- optional small tagline
│                              │
│  ┌────────────────────────┐  │
│  │  ⚖️ Kilograms → Pounds  │  │   Card 1
│  │  [ 0        ] kg       │  │
│  │        ↓               │  │
│  │  [ 0        ] lb       │  │   (result, read-only)
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  🌡️ Celsius → Fahrenheit │  │   Card 2
│  │  [ 0        ] °C       │  │
│  │        ↓               │  │
│  │  [ 32       ] °F       │  │   (result, read-only)
│  └────────────────────────┘  │
│                              │
│        made with 💗          │   footer
└──────────────────────────────┘
```

### Behavior

- Each card has one **input** field and one **result** display.
- Result updates live on every keystroke (`input` event).
- Input uses `inputmode="decimal"` so mobile shows the number keypad. Allow negative numbers (needed for Celsius) and decimals.
- If the input is empty or invalid, the result shows a placeholder dash ("—").
- Results rounded to **2 decimal places**, trailing zeros trimmed (e.g. `2.20`, not `2.2046226`).
- Optional (nice touch): a small **swap button (⇅)** on each card to reverse direction (lb → kg, °F → °C). Keep it simple; if it complicates the UI, leave it out.
- Optional: tapping the result copies it to the clipboard with a tiny "Copied! 💗" toast.

## 7. Conversion Formulas

| Conversion | Formula |
|---|---|
| kg → lb | `lb = kg × 2.2046226218` |
| lb → kg | `kg = lb ÷ 2.2046226218` |
| °C → °F | `°F = (°C × 9/5) + 32` |
| °F → °C | `°C = (°F − 32) × 5/9` |

Sanity checks to verify:
- 1 kg = 2.2 lb
- 0 °C = 32 °F
- 100 °C = 212 °F
- −40 °C = −40 °F
- 37 °C = 98.6 °F

## 8. Theme and Style: Pink and Cute

### Color palette

| Role | Color |
|---|---|
| Page background | `#FFE4EF` (soft blush pink), optionally a gentle gradient to `#FFD1E3` |
| Card background | `#FFFFFF` with slight transparency, or `#FFF5F9` |
| Primary accent | `#FF6FA8` (bubblegum pink) |
| Deep accent / text | `#B03A6B` (raspberry) |
| Soft border | `#FFB6D3` |
| Input focus glow | `rgba(255, 111, 168, 0.35)` |

### Style notes

- **Font:** rounded and friendly, such as `Nunito` or `Quicksand` (Google Fonts), with fallback `system-ui, sans-serif`. For full offline support, either self-host the font file in the repo or fall back to a rounded system font stack (`ui-rounded, "SF Pro Rounded", system-ui`). Prefer the self-hosted or system option so the PWA works offline.
- **Shapes:** very rounded corners (cards `24px`, inputs `16px`), soft pink drop shadows.
- **Decor:** small emoji or inline SVG touches (🌸 💗 ✨ 🎀). Keep it tasteful, not cluttered.
- **Inputs:** large, easy to tap (min height 56px), big font (1.5rem+), centered text.
- **Motion:** gentle only. Soft hover/focus transitions, a tiny "pop" when the result changes. Respect `prefers-reduced-motion`.
- **Layout:** max-width ~420px centered; comfortable padding; respects iPhone safe areas (`env(safe-area-inset-*)`).
- **Accessibility:** labels on all inputs, sufficient contrast for text (use raspberry `#B03A6B` or darker on light pink), visible focus states, `aria-live="polite"` on results.

## 9. PWA Requirements

### manifest.json

```json
{
  "name": "Convert",
  "short_name": "Convert",
  "description": "A cute little kg to lb and °C to °F converter.",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFE4EF",
  "theme_color": "#FF6FA8",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### index.html head requirements

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- `<meta name="theme-color" content="#FF6FA8">`
- `<link rel="manifest" href="manifest.json">`
- `<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-title" content="Convert">`
- Register the service worker in `app.js` with a relative path: `navigator.serviceWorker.register('./service-worker.js')`

### service-worker.js

- **Cache-first** strategy for the app shell (index.html, style.css, app.js, manifest.json, icons, font if self-hosted).
- Use a versioned cache name (e.g. `convert-v1`); on `activate`, delete old caches.
- Bump the version string whenever files change so users get updates.

### Icons

A cute pink icon: bubblegum pink rounded background with a white or cream design, such as a heart, or a simple "⇄" with a sparkle. Generate PNGs at 192, 512, maskable 512 (with safe padding), and 180 for Apple. Claude Code may create them as SVG and export to PNG, or generate them with a small script.

## 10. Build Instructions for Claude Code

1. Create the file structure above in the project folder.
2. Build `index.html` with the title, two converter cards, and footer.
3. Build `style.css` using the pink and cute theme in section 8.
4. Build `app.js` with live conversion logic, input validation, rounding, and service worker registration.
5. Create `manifest.json`, `service-worker.js`, and the icon set.
6. Write a short `README.md` (what the app is, the live URL, how to install to home screen).
7. Test locally (see section 12), then fix any issues.

## 11. Deployment: GitHub Pages

1. In VS Code, initialize git and commit: `git init`, `git add .`, `git commit -m "Initial Convert app"`.
2. Create a new GitHub repo (e.g. `convert`) and push to `main`.
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / root → Save**.
4. Wait a minute or two. The app will be live at `https://<username>.github.io/convert/`.
5. **Install on phone:**
   - iPhone: open in Safari → Share → **Add to Home Screen**
   - Android: open in Chrome → menu → **Install app** / **Add to Home screen**
6. For updates: edit, bump the cache version in `service-worker.js`, commit, and push.

## 12. Testing Checklist

- [ ] 1 kg shows 2.2 lb; 0 °C shows 32 °F; −40 °C shows −40 °F; 100 °C shows 212 °F
- [ ] Decimals work (e.g. 2.5 kg, 36.6 °C)
- [ ] Negative numbers work for Celsius
- [ ] Empty or invalid input shows "—", never "NaN"
- [ ] Number keypad appears on mobile
- [ ] Layout looks good at 360px wide, tablet, and desktop
- [ ] Lighthouse PWA check passes (installable, manifest and service worker detected)
- [ ] App loads offline after first visit
- [ ] Works on the GitHub Pages subpath (no broken links to icons, CSS, or JS)
- [ ] Add to Home Screen works on iOS and Android with the correct icon and name

## 13. Acceptance Criteria

The app is done when a user can open the link (or home screen icon), type a number into either card, instantly see the correct converted value on a cute pink screen, and use it again offline, with no instructions needed.

## 14. Future Ideas (not for v1)

- Reverse direction toggles (lb → kg, °F → °C)
- More cute conversions (cups ↔ mL, miles ↔ km)
- Dark pink "night mode"
- Confetti or sparkle animation on conversion
