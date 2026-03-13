# ARCHITECTURE — JewelForge AI

## Overview

```
User Photo
    │
    ▼
┌───────────────┐   POST /analyze (multipart image)   ┌──────────────────────┐
│  React        │ ────────────────────────────────────▶│  FastAPI Backend     │
│  UploadScreen │◀────────────────────────────────────│  /analyze            │
└───────────────┘   Blueprint JSON                     │  Claude Vision API   │
                                                        └──────────────────────┘
         │ Blueprint state
         ▼
┌───────────────┐   POST /generate (blueprint JSON)   ┌──────────────────────┐
│  Blueprint    │ ────────────────────────────────────▶│  FastAPI Backend     │
│  Screen       │◀────────────────────────────────────│  /generate           │
└───────────────┘   { glb_url }                        │  CadQuery/Blender   │
                                                        └──────────────────────┘
         │ modelUrl
         ▼
┌──────────────────────────────────────────────────────┐
│  ConfiguratorScreen (Three.js / @react-three/fiber)  │
│  • useGLTF loads GLB from glb_url                    │
│  • Center + Bounds auto-frames model                 │
│  • OrbitControls — orbit, zoom                       │
│  • Material selector swaps metal/stone textures      │
│  • Budget bar updates live                           │
└──────────────────────────────────────────────────────┘
```

---

## Pipeline Steps

### 1. Image Upload (`UploadScreen`)

- User drags or picks a jewelry photograph (JPEG / PNG / WEBP, up to 10 MB).
- The file is stored in React state as a `File` object and an `ObjectURL` preview is shown.

### 2. Blueprint Extraction (`POST /analyze`)

**Frontend** POSTs the file as `multipart/form-data` to the backend `/analyze` endpoint.

**Backend** (`backend/main.py`):
1. Validates the MIME type (`image/*`).
2. Reads the raw bytes and base64-encodes them.
3. Calls **Claude Vision** (`claude-opus-4-5` or later) with the structured prompt
   in `CLAUDE_VISION_PROMPT` (defined in `backend/main.py`).
4. Parses the JSON response into a `Blueprint` Pydantic model.
   - If Claude returns malformed JSON, a `json.JSONDecodeError` is caught and
     re-raised as HTTP 502.
   - If the parsed JSON doesn't match the `Blueprint` schema, Pydantic raises a
     `ValidationError` which should be caught and returned as HTTP 422.
5. Returns `AnalyzeResponse` → frontend shows `BlueprintScreen`.

> **Prompt template** (key section):
> ```
> Analyze the jewelry photograph and extract:
>   metal, center_stone, setting, band_width_mm, shank_style,
>   estimated_carat, notes
> Return ONLY valid JSON with those keys.
> ```

### 3. 3D Model Generation (`POST /generate`)

**Frontend** POSTs the `Blueprint` JSON to `/generate`.

**Backend** (`backend/main.py`):
1. Receives `GenerateRequest` (blueprint + output_format).
2. Spawns `blender/generate_ring.py` as a subprocess with the blueprint JSON.
3. The generator (`blender/generate_ring.py`):
   - Parses blueprint parameters (inner diameter, band width, shank style, etc.).
   - Uses **CadQuery** to build a parametric ring (torus band + stone seat).
   - Exports to GLB (via STEP → trimesh) or STL.
   - *(Blender headless alternative is included as commented code.)*
4. Saves the file to `MODELS_DIR` and returns `{ glb_url: "/models/ring_generated.glb" }`.

### 4. Interactive 3D Viewer (`ConfiguratorScreen`)

- `App.jsx` renders a full-screen `<Canvas>` (Three.js) behind all UI panels.
- When `modelUrl` is set, `useGLTF(url)` suspends until the GLB is fetched.
- The loaded scene is wrapped in `<Center>` + `<Bounds fit>` to auto-frame it.
- `Suspense` fallback shows the decorative torus knot while loading.
- On load error, a status banner guides the user to place `public/ring.glb`.
- `OrbitControls` provides orbit / zoom.
- Material selectors (left panel) and budget bar (right panel) remain unchanged.

### 5. Export

- The **Export GLB / STL** button (right panel) will trigger a browser download
  of the model file.  Wire to `window.location.href = modelUrl` or a fetch + Blob.

---

## Technology Choices

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + Vite | Fast HMR, tree-shaking, JSX |
| 3D rendering | Three.js + @react-three/fiber + @react-three/drei | Declarative scene graph, rich helpers (useGLTF, Center, Bounds, OrbitControls) |
| Styling | Tailwind CSS | Utility-first, glassmorphism via backdrop-blur utilities |
| Backend | FastAPI (Python) | Async, automatic OpenAPI docs, excellent Pydantic integration |
| AI vision | Anthropic Claude Vision | High-quality multimodal extraction; structured JSON output |
| CAD / geometry | CadQuery | Pure-Python parametric CAD; easy subprocess integration |
| Blender (alt) | Blender headless | Production-quality mesh; slower but richer geometry |

---

## Swapping the Local GLB

For local development without a running backend:

1. Place any GLB ring model at `public/ring.glb`.
2. The app loads `/ring.glb` by default (see `handleGenerate3D` in `src/App.jsx`).
3. When the real backend is live, `handleGenerate3D` should `fetch("/generate", ...)`
   and call `setModelUrl(data.glb_url)` with the response.

A generator command to produce a demo `ring.glb`:

```bash
pip install cadquery trimesh[easy]
python blender/generate_ring.py \
  --blueprint '{"metal":"18k Yellow Gold","center_stone":"1.5ct Diamond","setting":"Pavé"}' \
  --output public/ring.glb \
  --format glb
```

---

## Local Development

```bash
# Frontend
npm install
npm run dev          # http://localhost:5173

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Configure Vite to proxy `/analyze` and `/generate` to the backend:

```js
// vite.config.js
export default {
  server: {
    proxy: {
      "/analyze": "http://localhost:8000",
      "/generate": "http://localhost:8000",
      "/models":   "http://localhost:8000",
    },
  },
};
```
