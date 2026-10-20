import { Radio, WifiOff } from 'lucide-react'

export default function Header({ source }) {
  const isLive = source === 'live'
  const status = {
    loading: ['Connecting', 'Connecting to the live delay feed'],
    live: ['Live', 'Connected to the live delay feed'],
    stale: ['Outdated', 'Connection lost; showing the last received wait times'],
    unavailable: ['Unavailable', 'The live delay feed is unreachable'],
  }[source]

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            Border Wait Times
          </h1>
          <p className="text-xs text-ink-soft sm:text-sm">US–Canada land crossings</p>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-medium sm:text-sm ${
            isLive
              ? 'border-status-low/30 bg-status-lowBg text-status-low'
              : 'border-line bg-paper-sunken text-ink-soft'
          }`}
          title={status[1]}
        >
          {isLive ? <Radio size={14} className="shrink-0" /> : <WifiOff size={14} className="shrink-0" />}
          <span>{status[0]}</span>
        </div>
      </div>
    </header>
  )
}
