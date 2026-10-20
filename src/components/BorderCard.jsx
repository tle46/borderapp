import { Pin } from 'lucide-react'
import {
  getSelectedDelay,
  displayName,
  displaySubtitle,
  formatMinutes,
  formatUpdatedTime,
  STATUS_META,
} from '../utils/delay'

export default function BorderCard({ border, direction, travelType, isPinned, onTogglePin }) {
  const delay = getSelectedDelay(border, direction, travelType)
  const meta = STATUS_META[delay.status]
  const subtitle = displaySubtitle(border)

  return (
    <li
      className="flex items-stretch gap-3 rounded-card border border-line bg-paper-raised p-4 shadow-card"
      style={{ borderLeft: `4px solid ${meta.dot}` }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[0.95rem] font-semibold leading-snug text-ink sm:text-base">
            {displayName(border)}
          </h3>
        </div>
        {/* {subtitle && (
          <p className="mt-0.5 truncate text-xs text-ink-soft sm:text-sm">{subtitle}</p>
        )} */}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold sm:text-sm"
            style={{ backgroundColor: meta.bg, color: meta.text }}
          >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
            {formatMinutes(delay.minutes)}
          </span>
          {delay.lanes !== null && (
            <span className="text-xs text-ink-soft sm:text-sm">
              {delay.lanes} lane{delay.lanes === 1 ? '' : 's'} open
            </span>
          )}
          <p className="ml-auto text-xs text-ink-soft">
            Updated {formatUpdatedTime(delay.updatedAt)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onTogglePin(border.border_id)}
        aria-pressed={isPinned}
        aria-label={isPinned ? `Unpin ${displayName(border)}` : `Pin ${displayName(border)} to top`}
        className={`flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full border transition-colors ${
          isPinned
            ? 'border-brand bg-brand text-white'
            : 'border-line bg-paper-sunken text-ink-soft hover:text-ink'
        }`}
      >
        <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} />
      </button>
    </li>
  )
}
