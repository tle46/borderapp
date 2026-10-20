import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getSelectedDelay, displayName, formatMinutes, formatRelativeTime, STATUS_META } from '../utils/delay'

const MAP_API_KEY = import.meta.env.VITE_CARTO_API_KEY?.trim()
const TILE_URL = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${MAP_API_KEY ? `?key=${encodeURIComponent(MAP_API_KEY)}` : ''}`

const CENTER = [47.5, -96]
const DEFAULT_ZOOM = 4

export default function BorderMap({ borders, direction, travelType, focusId }) {
  const points = useMemo(
    () =>
      borders
        .filter((b) => b.coordinates?.latitude && b.coordinates?.longitude)
        .map((b) => ({
          border: b,
          lat: b.coordinates.latitude,
          lng: b.coordinates.longitude,
          delay: getSelectedDelay(b, direction, travelType),
        })),
    [borders, direction, travelType]
  )

  return (
    <div className="relative">
      <div className="h-[46vh] min-h-[280px] w-full overflow-hidden rounded-card border border-line shadow-card sm:h-[52vh]">
        <MapContainer
          center={CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={3}
          maxZoom={14}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={TILE_URL}
            subdomains={['a', 'b', 'c', 'd']}
          />

          {points.map(({ border, lat, lng, delay }) => {
            const meta = STATUS_META[delay.status]
            const isFocused = focusId === border.border_id
            return (
              <CircleMarker
                key={border.border_id}
                center={[lat, lng]}
                radius={isFocused ? 10 : 7}
                pathOptions={{
                  color: '#FFFFFF',
                  weight: 2,
                  fillColor: meta.dot,
                  fillOpacity: 0.92,
                }}
              >
                <Popup>
                  <div className="min-w-[200px] max-w-[240px] p-3.5 font-body">
                    <p className="pr-2 text-sm font-semibold leading-snug text-ink">
                      {displayName(border)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.dot }}
                      />
                      <span className="text-sm font-medium text-ink">
                        {formatMinutes(delay.minutes)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      Updated {formatRelativeTime(delay.updatedAt)}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      <Legend />
    </div>
  )
}

function Legend() {
  const items = [
    { key: 'low', label: 'Low' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'high', label: 'High' },
    { key: 'unknown', label: 'No data' },
  ]
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-xs text-ink-soft sm:text-sm">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: STATUS_META[item.key].dot }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
