# Convert 🌸

A tiny, cute, pink converter: kilograms → pounds and Celsius → Fahrenheit. Live results as you type, works offline.

**Live:** `https://<username>.github.io/convert/` (update after deploying)

## Install on your phone
- **iPhone:** open in Safari → Share → **Add to Home Screen**
- **Android:** open in Chrome → menu → **Install app** / **Add to Home screen**

## Development
Plain HTML/CSS/JS, no build step. Serve the folder (e.g. `python3 -m http.server`) and open it. After changing files, bump `CACHE` in `service-worker.js` so users get the update.
