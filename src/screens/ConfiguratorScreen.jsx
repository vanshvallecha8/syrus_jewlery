import MaterialSelector from "../components/MaterialSelector";

/**
 * ConfiguratorScreen — Step 3
 * Full-screen 3D canvas (rendered by App.jsx behind this overlay) with
 * floating glass panels for material customisation and budget display.
 *
 * Props:
 *  - modelUrl: string (GLB URL, may be null while placeholder is shown)
 *  - selectedOptions: { metal, stone, cut }
 *  - onChangeOptions(opts): merge-update selected options
 *  - estimatedBudget: number (USD)
 *  - onRestart(): return to UploadScreen
 */
export default function ConfiguratorScreen({
  selectedOptions,
  onChangeOptions,
  estimatedBudget,
  onRestart,
}) {
  const budgetMax = 5000;
  const budgetPct = Math.min((estimatedBudget / budgetMax) * 100, 100);

  return (
    <div className="min-h-screen relative fade-in">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
        <span className="font-heading text-xl text-sand tracking-widest">
          JewelForge <span className="text-gold">AI</span>
        </span>
        <button className="button-ghost text-sm px-4 py-2" onClick={onRestart}>
          ↩ New Design
        </button>
      </header>

      {/* ── Left panel — Material selectors ─────────────────────────── */}
      <aside className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-60">
        <div className="glass p-5 flex flex-col gap-5">
          <p className="panel-title">Customise</p>

          <MaterialSelector
            label="Metal"
            options={[
              { value: "18k_gold", label: "18k Yellow Gold" },
              { value: "18k_white_gold", label: "18k White Gold" },
              { value: "platinum", label: "Platinum" },
              { value: "rose_gold", label: "Rose Gold" },
            ]}
            value={selectedOptions.metal}
            onChange={(metal) => onChangeOptions({ ...selectedOptions, metal })}
          />

          <MaterialSelector
            label="Center Stone"
            options={[
              { value: "diamond_round", label: "Diamond — Round" },
              { value: "diamond_oval", label: "Diamond — Oval" },
              { value: "lab_diamond", label: "Lab Diamond" },
              { value: "sapphire", label: "Blue Sapphire" },
              { value: "emerald", label: "Emerald" },
            ]}
            value={selectedOptions.stone}
            onChange={(stone) => onChangeOptions({ ...selectedOptions, stone })}
          />

          <MaterialSelector
            label="Cut"
            options={[
              { value: "round", label: "Round Brilliant" },
              { value: "princess", label: "Princess" },
              { value: "cushion", label: "Cushion" },
              { value: "pear", label: "Pear" },
            ]}
            value={selectedOptions.cut}
            onChange={(cut) => onChangeOptions({ ...selectedOptions, cut })}
          />
        </div>
      </aside>

      {/* ── Right panel — Budget estimate ────────────────────────────── */}
      <aside className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-56">
        <div className="glass p-5 flex flex-col gap-4">
          <p className="panel-title">Estimated Budget</p>

          <div className="text-center">
            <span className="font-heading text-3xl text-gold">
              ${estimatedBudget.toLocaleString()}
            </span>
            <span className="text-sand/40 text-xs block mt-1">USD (indicative)</span>
          </div>

          {/* Budget bar */}
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-500"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <div className="flex justify-between text-sand/30 text-xs">
            <span>$0</span>
            <span>${(budgetMax / 1000).toFixed(0)}k</span>
          </div>

          {/* Export stub */}
          <button className="button-gold w-full text-sm mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export GLB / STL
          </button>
        </div>
      </aside>

      {/* Centre label (hint while placeholder is shown) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <p className="text-sand/30 text-xs tracking-widest uppercase">
          Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  );
}
