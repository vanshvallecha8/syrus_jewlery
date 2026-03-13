/**
 * StatBadge — small pill that displays a label / value pair.
 *
 * Props:
 *  - label: string
 *  - value: string | number
 */
export default function StatBadge({ label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5">
      <span className="text-sand/50 text-xs">{label}</span>
      <span className="text-gold font-semibold text-sm">{value}</span>
    </div>
  );
}
