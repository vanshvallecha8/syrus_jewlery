# Public Assets — 3D Models

This folder is served verbatim by Vite at the root URL.

## Placing a local GLB for demo

1. Copy your ring GLB file to this directory and name it `ring.glb`:

   ```
   public/ring.glb
   ```

2. The frontend (`App.jsx`) loads `/ring.glb` by default when no backend URL is
   provided.  Once the backend integration is live, the URL returned by
   `POST /generate` overrides this default.

## Generating with the Blender stub

```bash
# Install CadQuery (Python 3.10+)
pip install cadquery trimesh[easy]

# Generate a demo ring and copy it here
python blender/generate_ring.py \
  --blueprint '{"metal":"18k Yellow Gold","center_stone":"1.5ct Diamond","setting":"Pavé"}' \
  --output public/ring.glb \
  --format glb
```

## CORS note

If the GLB is served from a different origin (e.g. a CDN), make sure the
server sends `Access-Control-Allow-Origin: *` so `useGLTF` can load it.
