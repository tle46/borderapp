// Thresholds (minutes) that decide a crossing's status color.
// Tune these here if the definition of "moderate" or "high" ever changes.
export const THRESHOLDS = {
  moderate: 10, // >= this many minutes is moderate
  high: 30, // >= this many minutes is high
}

export const STATUS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  UNKNOWN: 'unknown',
}

export const STATUS_META = {
  [STATUS.LOW]: { label: 'Low', dot: '#3C8A5B', bg: '#E4F1E7', text: '#245B3C' },
  [STATUS.MODERATE]: { label: 'Moderate', dot: '#C98A1B', bg: '#FBF0DA', text: '#7A5411' },
  [STATUS.HIGH]: { label: 'High', dot: '#C24A3D', bg: '#FBE7E3', text: '#7E2E24' },
  [STATUS.UNKNOWN]: { label: 'No data', dot: '#8B857A', bg: '#EAE6DA', text: '#5B564F' },
}

export function getStatus(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return STATUS.UNKNOWN
  if (minutes >= THRESHOLDS.high) return STATUS.HIGH
  if (minutes >= THRESHOLDS.moderate) return STATUS.MODERATE
  return STATUS.LOW
}

// direction: 'us-to-can' | 'can-to-us'
// travelType: 'traveler' | 'commercial'
const FIELD_MAP = {
  'us-to-can': {
    traveler: { delay: 'uscan_passenger_delay', lanes: 'uscan_passenger_lanes', updated: 'uscan_updated' },
    commercial: { delay: 'uscan_commercial_delay', lanes: 'uscan_commercial_lanes', updated: 'uscan_updated' },
  },
  'can-to-us': {
    traveler: { delay: 'canus_passenger_delay', lanes: 'canus_passenger_lanes', updated: 'canus_updated' },
    commercial: { delay: 'canus_commercial_delay', lanes: 'canus_commercial_lanes', updated: 'canus_updated' },
  },
}

export function getSelectedDelay(border, direction, travelType) {
  const fields = FIELD_MAP[direction][travelType]
  const d = border.delay || {}
  return {
    minutes: d[fields.delay] ?? null,
    lanes: d[fields.lanes] ?? null,
    updatedAt: d[fields.updated] ?? null,
    status: getStatus(d[fields.delay] ?? null),
  }
}

export function formatMinutes(minutes) {
  if (minutes === null || minutes === undefined) return 'No data'
  return `${minutes} min`
}

export function formatRelativeTime(isoString) {
  if (!isoString) return 'N/A'
  const then = new Date(isoString).getTime()
  if (Number.isNaN(then)) return 'N/A'
  const now = Date.now()
  const diffMs = now - then
  const diffMin = Math.round(diffMs / 60000)

  if (diffMin < 1) return 'Just now'
  if (diffMin === 1) return '1 minute ago'
  if (diffMin < 60) return `${diffMin} minutes ago`

  const diffHr = Math.round(diffMin / 60)
  if (diffHr === 1) return '1 hour ago'
  if (diffHr < 24) return `${diffHr} hours ago`

  const diffDay = Math.round(diffHr / 24)
  if (diffDay === 1) return '1 day ago'
  return `${diffDay} days ago`
}

// Prefer the crossing's own name; fall back to the two port names joined.
export function displayName(border) {
  if (border.name && border.name.trim()) return border.name.trim()
  const us = border.us_port_name?.trim()
  const can = border.can_port_name?.trim()
  return [us, can].filter(Boolean).join(' / ') || 'Unnamed crossing'
}

export function displaySubtitle(border) {
  const parts = [border.us_crossing_name, border.can_crossing_name].filter(
    (p) => p && p.trim()
  )
  if (parts.length) return parts.join(' · ')
  return [border.us_port_name, border.can_port_name].filter(Boolean).join(' · ')
}
