# JewelForge AI (PS-01 Syrus 2026 Hackathon)

Luxury 2D→3D jewelry configurator frontend (React 18 + Vite) with Three.js/@react-three/fiber/@react-three/drei and TailwindCSS. Dark cinematic theme inspired by ring3d.vercel.app.

## Project Flow
1) Upload: user drops a jewelry photo.
2) Analyze: backend (Claude Vision) extracts blueprint metadata.
3) Generate: backend returns a GLB of the piece.
4) Configure: live 3D customization of metal, stone, cut; estimated budget preview.
5) Export: user downloads final GLB/STL.

## Tech Stack
- React 18 (Vite)
- Three.js + @react-three/fiber + @react-three/drei
- Tailwind CSS (glassmorphism utilities)
- Fonts: Tenor Sans (headings) + Jost (body)

## Local Development
```bash
# 1) Install dependencies
npm install

# 2) Start dev server (Vite default)
npm run dev
# Vite prints the local and network URLs (default http://localhost:5173)

# 3) Lint (if eslint configured)
npm run lint
```

## Build
```bash
npm run build
# Outputs production bundle to dist/
```

## Project Structure (current)
- src/App.jsx — screen state router and shared Canvas backdrop
- src/screens/ — Upload, Blueprint, Configurator screens
- src/components/ — UI primitives (glass panels, dropzone, selectors)
- src/styles/index.css — Tailwind imports + global glass theme
- tailwind.config.cjs — theme tokens (colors, fonts, shadows, animations)
- postcss.config.cjs — Tailwind + autoprefixer

## Notes
- 3D canvas uses a placeholder torus knot until backend GLB is provided.
- Handlers `handleAnalyze` and `handleGenerate3D` are stubbed for backend wiring.
- Strict dark palette: background #080810, gold accent #C9973A.