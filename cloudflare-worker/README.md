# LopegaWorks private portfolio analytics (setup guide)

This adds a custom event tracker to the existing GitHub Pages portfolio. It tracks page views, experience-card openings, and the Processing of Trades work-file link. It does not display a counter to visitors. It deliberately does not store raw IP addresses, cookies, or full referrer URLs.

## Important files changed

- `js/analytics.js`: browser-side tracking and persistent developer mode.
- `js/app.js`: sends an `experience_open` event when an experience card opens.
- `index.html`: loads `js/analytics.js` before the application.
- `cloudflare-worker/`: Worker, D1 schema, and private dashboard.

## A. Create the D1 database

1. Open the Cloudflare dashboard and select **Workers & Pages → D1 SQL Database** (wording may vary).
2. Create a database named `lopegaworks-analytics`.
3. Open its SQL console and run the contents of `schema.sql`.
4. Copy the database ID into `wrangler.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

## B. Deploy the Worker

1. Create a Worker named `lopegaworks-portfolio-analytics`.
2. Deploy the code from `src/index.js` and add a D1 binding named exactly `DB` pointing to the database created above.
3. Add the custom domain `stats.lopegaworks.com` to this Worker. If Cloudflare asks to create DNS, allow it to do so. Keep your existing `portfolio.lopegaworks.com` GitHub Pages setup unchanged.
4. Confirm `https://stats.lopegaworks.com/track` returns `Not found` for a normal GET request. That is expected; tracking uses POST.

If you use Wrangler locally, from this directory run `npx wrangler deploy` after setting the database ID and binding. You do not need to change the GitHub Pages build workflow for the Worker.

## C. Protect the private dashboard (do not skip)

The Worker deliberately leaves `/track` public so visitors can submit events. Protect the dashboard and its data API with Cloudflare Access:

1. In Cloudflare Zero Trust, create an Access application for the self-hosted application hostname `stats.lopegaworks.com`.
2. Add protected paths `/dashboard*` and `/api/*` (or use separate path applications/policies that cover both).
3. Create an **Allow** policy restricted to your own login email or identity provider. Do not make these paths public.
4. Test in a private/incognito window: `/dashboard` and `/api/summary` must require authentication, while `/track` remains available for requests from the portfolio.

Do not consider the dashboard private merely because its URL is obscure. The Access policy is required before using it with real traffic.

## D. Point the portfolio tracker at the Worker

`js/analytics.js` is configured for:

`https://stats.lopegaworks.com/track`

If you choose a different Worker hostname, update `window.PORTFOLIO_TRACKING_ENDPOINT` in that file. The Worker only accepts events whose `Origin` is exactly `https://portfolio.lopegaworks.com`; update `ALLOWED_ORIGIN` in `src/index.js` if your public portfolio origin changes.

Commit and push the updated portfolio files to GitHub Pages. The Worker is deployed separately.

## E. Developer mode

- Visit `https://portfolio.lopegaworks.com/?dev=true` once in your normal browser to enable developer mode.
- The preference is saved in that browser's local storage. Later visits to the site won't send custom analytics events from that browser.
- Visit `https://portfolio.lopegaworks.com/?dev=false` to disable developer mode.
- Developer mode only excludes this custom tracker. Cloudflare's own edge/proxy analytics may still observe requests, and another browser/device won't inherit the preference.

## F. Test

1. Open the portfolio in a browser with developer mode disabled and open the homepage.
2. Open each experience card and click the Alfamart `Read work file` link.
3. Visit `https://stats.lopegaworks.com/dashboard`, authenticate through Access, and check the counts.
4. Enable developer mode using `?dev=true`, repeat the same actions, and confirm the custom counts do not increase.
5. Use a private browser window with developer mode disabled to test normal visitor behavior.

## Data and limitations

- `page_view` counts page loads, not guaranteed unique humans.
- `experience_open` records an experience card's company identifier.
- `work_file_open` records the click on the Processing of Trades link, not proof the new tab fully loaded or the file was read.
- Referrers are reduced to hostnames; browsers often omit them.
- Browser events can be blocked, duplicated, or spoofed. Treat the numbers as directional evidence, not verified recruiter activity.
- Origin validation is a useful basic filter, not authentication; non-browser clients can forge Origin headers. Consider Cloudflare rate limiting or Turnstile if abuse becomes an issue.
- Do not collect sensitive details in event names or payloads.
