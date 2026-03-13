/**
 * MaterialSelector — labelled list of radio-style option buttons.
 *
 * Props:
 *  - label: string  (section heading)
 *  - options: Array<{ value: string; label: string }>
 *  - value: currently selected value
 *  - onChange(value): called with the newly selected value
 */
export default function MaterialSelector({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sand/50 text-xs uppercase tracking-wider">{label}</span>
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150
              ${value === opt.value
                ? "bg-gold/20 border border-gold/60 text-gold"
                : "bg-white/5 border border-white/10 text-sand/70 hover:border-gold/40 hover:text-sand"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
