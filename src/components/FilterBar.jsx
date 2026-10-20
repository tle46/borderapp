function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-2 gap-1 rounded-pill border border-line bg-paper-sunken p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-pill px-3 py-2 text-sm font-medium transition-colors sm:text-[0.95rem] ${
              active
                ? 'bg-brand text-white shadow-card'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function FilterBar({ travelType, setTravelType, direction, setDirection }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Traveler type</span>
        <SegmentedControl
          ariaLabel="Traveler type"
          value={travelType}
          onChange={setTravelType}
          options={[
            { value: 'traveler', label: 'Traveler' },
            { value: 'commercial', label: 'Commercial' },
          ]}
        />
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Direction</span>
        <SegmentedControl
          ariaLabel="Crossing direction"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'us-to-can', label: 'US → CAN' },
            { value: 'can-to-us', label: 'CAN → US' },
          ]}
        />
      </div>
    </div>
  )
}
