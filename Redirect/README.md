# LopegaWorks Animated Redirect — Proof of Concept

A no-sound, responsive landing page made with vanilla HTML, CSS, and JavaScript.
No React, build tools, backend, or animation libraries are required.

## Preview locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For the safest design preview, open `config.js` and set `autoRedirect: false`.
   If your browser restricts local file behavior, run a local static server or upload
   the folder to a static host.

## Configure the redirect
Edit `config.js`:
- `destination`: target URL.
- `redirectDelaySeconds`: countdown duration.
- `autoRedirect`: set to `true` for a real redirect, `false` for a visual preview.
- `destinationLabel`: label shown in the destination card.

The default destination is `https://portfolio.lopegaworks.com`.

## Files
- `index.html` — page structure
- `styles.css` — layout, portal, glow, energy ribbons, particles, responsive styling
- `script.js` — dialogue phases, countdown, interactions, and redirect
- `config.js` — simple settings
- `assets/assistant-scene.png` — supplied reference artwork

## Important limitations
- This is a visual navigation page, not bot protection and not the Anubis security system.
- The supplied illustration is a single flattened image. The page animates the illustration
  as a whole and adds effects around it; it cannot independently blink or move her eyes,
  hair, hands, or head. That would require separate character layers or a rigged model.
- To route arbitrary unknown subdomains here, DNS and hosting must be configured to accept
  wildcard hostnames. A page alone cannot catch hostnames that do not resolve.
- The page intentionally contains no audio.
