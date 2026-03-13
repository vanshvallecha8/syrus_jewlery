# JewelForge AI (PS-01 Syrus 2026 Hackathon)

Luxury **2D → 3D Jewelry Configurator** — upload a jewelry photo, let AI extract a design blueprint, generate an interactive 3D model, customise metal/stone/cut in real-time, and export as GLB/STL.

Dark cinematic theme inspired by [ring3d.vercel.app](https://ring3d.vercel.app).

---

## Project Flow

```
Photo → /analyze (Claude Vision) → Blueprint → /generate (CadQuery/Blender) → GLB → 3D Viewer
```

1. **Upload** — drag-and-drop a jewelry photo.
2. **Analyze** — backend calls Claude Vision; extracts metal, stone, setting, etc.
3. **Generate** — backend runs parametric CAD script; returns GLB URL.
4. **Configure** — live 3D customisation (metal, stone, cut) with estimated budget preview.
5. **Export** — download final GLB or STL.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a full pipeline breakdown and technology choices.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite) |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Styling | Tailwind CSS (glassmorphism) |
| Fonts | Tenor Sans (headings) + Jost (body) |
| Backend | FastAPI + Python |
| AI vision | Anthropic Claude Vision (`claude-opus-4-5`) |
| CAD | CadQuery (parametric) + trimesh (GLB export) |
| Alt CAD | Blender headless (see `blender/generate_ring.py`) |

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+ (for backend and generator)

### Frontend only (demo with local GLB)

```bash
# 1) Clone
git clone https://github.com/vanshvallecha8/syrus_jewlery.git
cd syrus_jewlery

# 2) Install dependencies
npm install

# 3) (Optional) Generate a demo GLB for the configurator
pip install cadquery trimesh[easy]
python blender/generate_ring.py \
  --blueprint '{"metal":"18k Yellow Gold","center_stone":"1.5ct Diamond","setting":"Pavé"}' \
  --output public/ring.glb \
  --format glb

# 4) Start the Vite dev server
npm run dev
# Opens at http://localhost:5173
```

> **Without `public/ring.glb`** the configurator falls back to a decorative torus knot and shows a "Could not load model" hint in the toolbar.

### Full stack (frontend + backend)

```bash
# Terminal 1 — Frontend
npm install
npm run dev

# Terminal 2 — Backend
cd backend
pip install -r requirements.txt
# Set your Anthropic key (never commit this!)
export ANTHROPIC_API_KEY=sk-ant-...
uvicorn main:app --reload --port 8000
```

Add a Vite proxy so API calls are forwarded to the backend without CORS issues:

```js
// vite.config.js  (already present — add the proxy block)
export default {
  plugins: [react()],
  server: {
    proxy: {
      "/analyze":  "http://localhost:8000",
      "/generate": "http://localhost:8000",
      "/models":   "http://localhost:8000",
    },
  },
};
```

### Build for production

```bash
npm run build
# Outputs production bundle to dist/
```

---

## Project Structure

```
syrus_jewlery/
├── public/
│   ├── ring.glb          ← place your demo model here (see MODELS.md)
│   └── MODELS.md         ← instructions for swapping the model
├── src/
│   ├── App.jsx           ← screen router + full-screen Canvas (GLB loader)
│   ├── screens/
│   │   ├── UploadScreen.jsx
│   │   ├── BlueprintScreen.jsx
│   │   └── ConfiguratorScreen.jsx
│   ├── components/
│   │   ├── GlassPanel.jsx
│   │   ├── Dropzone.jsx
│   │   ├── StatBadge.jsx
│   │   └── MaterialSelector.jsx
│   └── styles/index.css  ← Tailwind + glass theme tokens
├── backend/
│   ├── main.py           ← FastAPI app (/analyze, /generate)
│   ├── models.py         ← Pydantic request/response schemas
│   └── requirements.txt
├── blender/
│   └── generate_ring.py  ← parametric ring generator (CadQuery + Blender stub)
├── ARCHITECTURE.md       ← full pipeline description
├── tailwind.config.cjs
└── vite.config.js
```

---

## Notes

- The 3D canvas shows a **decorative gold torus knot** on the Upload and Blueprint screens; it switches to the real GLB on the Configurator screen.
- `handleAnalyze` and `handleGenerate3D` in `App.jsx` are stubbed — replace the `// TODO` comments with real `fetch()` calls once the backend is running.
- Dark palette: background `#080810`, gold accent `#C9973A`.
- No API keys are committed; set `ANTHROPIC_API_KEY` via environment variable.
