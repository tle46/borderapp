# Border Wait Times

A single-page app showing live wait times for every US–Canada land border
crossing: an interactive map up top, and a filterable, pinnable list below.

## Getting started

```bash
npm install
# Copy .env.example to .env and set your local API URL.
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
VITE_BORDER_DELAYS_API_URL=http://localhost:8000/borderdelays
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

The committed `.env.production` uses `/borderdelays` on the same origin as the
website. Configure your host to route that path to the backend. If your API runs
on another domain, set this environment variable in your hosting provider before
building:

```dotenv
VITE_BORDER_DELAYS_API_URL=https://your-api.example.com/borderdelays
```

Use your actual HTTPS backend address. Its CORS configuration must allow your
frontend origin when using a separate domain. Do not deploy a localhost API URL:
that points to each visitor's computer.

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
