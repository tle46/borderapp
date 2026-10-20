import { useMemo } from 'react'
import BorderCard from './BorderCard.jsx'
import { getSelectedDelay } from '../utils/delay'

export default function BorderList({ borders, direction, travelType, pinnedIds, onTogglePin }) {
  const sorted = useMemo(() => {
    const withDelay = borders.map((b) => ({
      border: b,
      minutes: getSelectedDelay(b, direction, travelType).minutes,
      pinned: pinnedIds.has(b.border_id),
    }))

    // return withDelay.sort((a, b) => {
    //   if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    //   // Worst delays first; unknown (null) sinks to the bottom.
    //   if (a.minutes === null && b.minutes === null) return 0
    //   if (a.minutes === null) return 1
    //   if (b.minutes === null) return -1
    //   return b.minutes - a.minutes
    // })

    return withDelay.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    })
  }, [borders, direction, travelType, pinnedIds])

  if (sorted.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-line px-4 py-8 text-center text-sm text-ink-soft">
        No crossings to show right now.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map(({ border }) => (
        <BorderCard
          key={border.border_id}
          border={border}
          direction={direction}
          travelType={travelType}
          isPinned={pinnedIds.has(border.border_id)}
          onTogglePin={onTogglePin}
        />
      ))}
    </ul>
  )
}
