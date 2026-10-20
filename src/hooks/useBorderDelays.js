import { useEffect, useRef, useState } from 'react'

const API_URL = import.meta.env.VITE_BORDER_DELAYS_API_URL?.trim()
const configuredPollSeconds = Number(import.meta.env.VITE_POLL_INTERVAL_SECONDS)
const POLL_INTERVAL_MS = Number.isInteger(configuredPollSeconds) && configuredPollSeconds >= 10 && configuredPollSeconds <= 86400
  ? configuredPollSeconds * 1000
  : 60_000

export function useBorderDelays() {
  const [borders, setBorders] = useState([])
  const [source, setSource] = useState('loading') // 'loading' | 'live' | 'stale' | 'unavailable'
  const [lastFetched, setLastFetched] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const hasLoadedOnce = useRef(false)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      if (!hasLoadedOnce.current) setLoading(true)
      try {
        const res = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`API responded with ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        setBorders(Array.isArray(json.borders) ? json.borders : [])
        setSource('live')
        setError(null)
        setLastFetched(new Date())
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return
        // Preserve only previously fetched live data and label it as stale.
        setSource((prev) => (prev === 'live' || prev === 'stale' ? 'stale' : 'unavailable'))
        setError(err.message || 'Could not reach the border delay API')
      } finally {
        if (!cancelled) {
          setLoading(false)
          hasLoadedOnce.current = true
        }
      }
    }

    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  return { borders, source, lastFetched, error, loading }
}
