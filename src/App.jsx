import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import BorderMap from './components/BorderMap.jsx'
import FilterBar from './components/FilterBar.jsx'
import BorderList from './components/BorderList.jsx'
import { useBorderDelays } from './hooks/useBorderDelays.js'

const PIN_STORAGE_KEY = 'border-wait-times:pinned'

function loadPinnedIds() {
  try {
    const raw = localStorage.getItem(PIN_STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

export default function App() {
  const { borders, source, error, loading } = useBorderDelays()
  const [travelType, setTravelType] = useState('traveler')
  const [direction, setDirection] = useState('us-to-can')
  const [pinnedIds, setPinnedIds] = useState(loadPinnedIds)

  useEffect(() => {
    try {
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify([...pinnedIds]))
    } catch {
      // Storage can fail in private browsing; pinning still works for the session.
    }
  }, [pinnedIds])

  const togglePin = useCallback((id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-paper pb-16">
      <Header source={source} />

      <main className="mx-auto max-w-5xl px-4 pt-4 sm:px-6 sm:pt-6">
        <BorderMap borders={borders} direction={direction} travelType={travelType} />

        {error && (
          <p className="mt-3 rounded-card border border-status-moderate/30 bg-status-moderateBg px-3.5 py-2.5 text-xs text-status-moderate sm:text-sm">
            {source === 'stale' ? 'Connection lost. Showing the last received wait times; they may be outdated. Retrying automatically.' : 'Wait times are unavailable. Unable to connect to the live feed. Retrying automatically.'}
          </p>
        )}

        <section className="mt-6">
          <FilterBar
            travelType={travelType}
            setTravelType={setTravelType}
            direction={direction}
            setDirection={setDirection}
          />
        </section>

        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-soft">
              All crossings ({borders.length})
            </h2>
          </div>
          {loading ? (
            <p role="status" className="py-8 text-center text-sm text-ink-soft">Loading live wait times…</p>
          ) : (
          <BorderList
            borders={borders}
            direction={direction}
            travelType={travelType}
            pinnedIds={pinnedIds}
            onTogglePin={togglePin}
          />
          )}
        </section>
      </main>
    </div>
  )
}
