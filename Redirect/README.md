# LopegaWorks Animated Redirect

A responsive, static redirect page built with HTML, CSS, and vanilla JavaScript. No frameworks or build step required.

## Files
- `index.html` — page structure and content.
- `styles.css` — layout, neon portal effects, starfield, floating character, responsive styles, and reduced-motion support.
- `script.js` — progress stages, countdown, pause/resume, and automatic redirect.
- `config.js` — destination, title, countdown, auto-redirect toggle, and character dialogue.
- `assets/anubis-guide.png` — character artwork used by the page.

## Change the destination
Edit `config.js`:
```js
destinationName: "LopegaWorks Portfolio",
destinationUrl: "https://portfolio.lopegaworks.com/",
countdownSeconds: 5,
autoRedirect: true
```
Use a full `https://` URL. Set `autoRedirect: false` if you want the visitor to click the button manually.

## Deploy to GitHub Pages / Cloudflare Pages
Upload the folder contents to the root of your target repository or site directory. Keep the `assets` folder and all filenames in their current locations. There is no build command.

## Animation notes
The character artwork itself is a single image, so CSS animates it as a whole (floating, slight sway, glow). The portal rings, gems, starfield, progress bar, speech bubble, and interface are animated independently. For separate eye blinking, hair motion, arm movement, or more advanced character animation, the character would need to be split into transparent layers or recreated as SVG/rigged artwork.


### Character animation notes (v2)
- Added timed eye-blink overlays, moving hair glints, and a pulsing magical aura with sparkles near the outstretched hand.
- The original character art is a single flattened PNG. These are lightweight CSS overlays; they do not physically rig or independently move the actual arm/hair. For true independent limb and hair motion, use separate transparent character layers or a rigged/SVG character.
- `index.html` and `styles.css` were changed for this update. Existing redirect logic and `config.js` are preserved.
