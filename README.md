# Border Wait Times

A single-page app showing live wait times for every US–Canada land border
crossing: an interactive map up top, and a filterable, pinnable list below.

## Getting started

```bash
npm install
# Copy .env.example to .env; start the backend on port 8000.
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Connecting to the live data feed

Set `VITE_BORDER_DELAYS_API_URL` to the complete API endpoint, including
`/borderdelays`. For local development, use this in your ignored `.env` file:

```dotenv
VITE_BORDER_DELAYS_API_URL=/api/borderdelays
```

The app polls every 60 seconds by default, expecting the response shape:

```json
{
  "count": 33,
  "borders": [
    {
      "border_id": 1,
      "name": "Peace Bridge",
      "us_port_name": "Buffalo/Niagara Falls",
      "us_crossing_name": "Peace Bridge",
      "can_port_name": "Fort Erie, ON/Buffalo, NY",
      "can_crossing_name": "Fort Erie (Peace Bridge)",
      "coordinates": { "latitude": 42.906961, "longitude": -78.905958 },
      "delay": {
        "uscan_passenger_delay": 3,
        "uscan_commercial_delay": 2,
        "canus_passenger_delay": 15,
        "canus_commercial_delay": 11,
        "uscan_updated": "2026-09-16T05:10:00+00:00",
        "canus_updated": "2026-09-16T05:00:39.690000+00:00"
      }
    }
  ]
}
```

If the API is unreachable, the app shows an unavailable message and no invented
wait times. If a connection fails after live data has loaded, the last received
values remain visible with an outdated-data warning. It retries every 60 seconds
and returns to Live status when the API responds. No sample dataset is bundled.

## Deployment configuration

Deploy this repository to Cloudflare Pages with:

- Root directory: `border-wait-times` if your repository contains both projects; otherwise leave it at the frontend repository root.
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Runtime environment variable: `BACKEND_ORIGIN=http://77.112.68.23/border` (backend base URL, including its path prefix, without the endpoint).
- Set `BACKEND_ORIGIN` for both Production and Preview environments as needed, then redeploy.
- Keep `VITE_BORDER_DELAYS_API_URL=/api/borderdelays` in the build environment. Remove any earlier direct HTTP API URL override and rebuild. Keep the EC2 backend's `ROOT_PATH=/border` for its Caddy route.

Use Git integration or Wrangler deployment from the frontend project root so the `functions` directory is deployed alongside `dist`. Uploading only static files through dashboard drag-and-drop does not deploy Pages Functions.

The frontend requests `/api/borderdelays` over HTTPS. The catch-all function in `functions/api/[[path]].js` replaces `/api` with the configured backend path prefix, preserving query strings, methods, bodies, response statuses, and headers. With the EC2 base URL above, `/api/health` forwards to `/border/health` and `/api/borderdelays` forwards to `/border/borderdelays`. A base URL with no prefix remains supported. Same-backend redirects within the prefix are rewritten to Pages `/api` URLs. The server-to-server EC2 connection remains HTTP; the browser connection uses HTTPS.

`public/_routes.json` limits Function execution to API requests; static assets are served directly by Pages. `BACKEND_ORIGIN` is server-side configuration and must not have a `VITE_` prefix. The backend must be reachable by Cloudflare; localhost addresses only work for local development. The proxy does not make the backend private or add authentication. Requests are not cached by this proxy.

For local development and `npm run preview`, Vite proxies `/api` to `http://127.0.0.1:8000`. Override this with `BACKEND_ORIGIN` in your local `.env` if necessary. Update any existing local `VITE_BORDER_DELAYS_API_URL` value to `/api/borderdelays`. Leave backend `ROOT_PATH` unset for direct local backend access; set it to `/api` when checking documentation through the proxy.

Set `VITE_POLL_INTERVAL_SECONDS` to adjust the refresh frequency (an integer
from 10 to 86400 seconds). Missing or invalid values fall back to 60 seconds.

Build command: `npm ci && npm run build`. Publish directory: `dist`.
Vite embeds these values at build time; rebuild after changing them. Hosting
build environment variables override the env files. `.env.production` overrides
the local `.env` API URL during production builds. All `VITE_` variables are public
in the browser; keep API secrets in the backend.

## Map API key

Set `VITE_CARTO_API_KEY` in your local `.env` and your hosting provider's build
environment. Request a key at https://www.carto.com/basemaps/apikey/.
The existing key has been moved out of source into the ignored local `.env`;
production requires its own configured value. Rebuild after changing the key.
This browser map key is visible in tile requests even when configured through
environment variables. Configure restrictions in the CARTO dashboard and keep
OpenStreetMap/CARTO attribution visible.

## How wait-time color is decided

Thresholds live in `src/utils/delay.js`:

- **Low** (green): under 10 minutes
- **Moderate** (amber): 10–29 minutes
- **High** (red): 30+ minutes
- **No data** (gray): the field is null — the crossing doesn't report that
  lane/direction combination

Adjust `THRESHOLDS` in that file to change the cutoffs.

## Project structure

```
src/
  components/
    Header.jsx       – title + connection status badge
    BorderMap.jsx     – Leaflet map, colored markers, legend, popups
    FilterBar.jsx     – traveler/commercial + direction segmented controls
    BorderCard.jsx    – single crossing card with pin toggle
    BorderList.jsx    – sorts + renders cards (pinned first, worst delay next)
  hooks/
    useBorderDelays.js – polling fetch + connection status
  utils/
    delay.js          – status thresholds, field mapping, formatting
```

## Notes

- Pinned crossings persist in `localStorage`, so they survive a refresh.
- The map uses CARTO's light basemap tiles (free, attributed in the map's
  bottom-right corner) to keep the background quiet behind the status dots.
- Built with React + Vite + Tailwind CSS, `react-leaflet` for the map, and
  `lucide-react` for icons.

