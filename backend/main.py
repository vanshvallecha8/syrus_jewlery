"""
JewelForge AI — FastAPI Backend
================================
Endpoints
---------
POST /analyze   — Accepts a jewelry photo, calls Claude Vision, returns blueprint JSON.
POST /generate  — Accepts blueprint JSON, runs parametric 3D generator, returns GLB URL.

Environment variables (never commit real values):
    ANTHROPIC_API_KEY   — Anthropic API key for Claude Vision.
    MODELS_DIR          — Absolute path where generated GLB files are written (default: ./models).
    FRONTEND_ORIGIN     — Allowed CORS origin (default: http://localhost:5173).
"""

import os
import time
import logging
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .models import (
    AnalyzeResponse,
    Blueprint,
    GenerateRequest,
    GenerateResponse,
)

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jewelforge")

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="JewelForge AI API",
    description="2D → 3D jewelry generation pipeline",
    version="0.1.0",
)

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated GLB files as static assets at /models/<filename>
MODELS_DIR = Path(os.getenv("MODELS_DIR", "./models"))
MODELS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/models", StaticFiles(directory=str(MODELS_DIR)), name="models")


# ── Claude Vision prompt template ─────────────────────────────────────────────
CLAUDE_VISION_PROMPT = """
You are an expert jewelry designer and gemologist.
Analyze the jewelry photograph provided and extract the following design blueprint.
Return ONLY valid JSON with the exact keys listed — no markdown, no explanation.

Required JSON shape:
{
  "metal": "<string — e.g. 18k Yellow Gold>",
  "center_stone": "<string — e.g. 1.5ct Round Brilliant Diamond>",
  "setting": "<string — e.g. Cathedral Pavé>",
  "band_width_mm": <float or null>,
  "shank_style": "<string or null — e.g. Tapered, Straight, Split>",
  "estimated_carat": <float or null>,
  "notes": "<string or null — any additional observations>"
}
""".strip()


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/analyze", response_model=AnalyzeResponse, summary="Extract design blueprint from image")
async def analyze(image: UploadFile = File(..., description="JPEG/PNG jewelry photo")):
    """
    Accepts a jewelry photo, sends it to Claude Vision with a structured prompt,
    and returns the extracted design blueprint.

    Implementation notes (fill in when integrating):
    1. Read image bytes: `data = await image.read()`
    2. Base64-encode for the Anthropic messages API.
    3. Call `anthropic.messages.create(...)` with `CLAUDE_VISION_PROMPT`.
    4. Parse the JSON response and validate against `Blueprint`.
    """
    logger.info("analyze: received file=%s content_type=%s", image.filename, image.content_type)

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG/PNG/WEBP)")

    # TODO: integrate Anthropic Claude Vision
    # import anthropic, base64, json
    # api_key = os.environ["ANTHROPIC_API_KEY"]
    # client = anthropic.Anthropic(api_key=api_key)
    # data = await image.read()
    # b64 = base64.standard_b64encode(data).decode()
    # message = client.messages.create(
    #     model="claude-opus-4-5",
    #     max_tokens=512,
    #     messages=[{
    #         "role": "user",
    #         "content": [
    #             {"type": "image", "source": {"type": "base64",
    #              "media_type": image.content_type, "data": b64}},
    #             {"type": "text", "text": CLAUDE_VISION_PROMPT},
    #         ],
    #     }],
    # )
    # raw = message.content[0].text
    # blueprint_data = json.loads(raw)
    # blueprint = Blueprint(**blueprint_data)

    # Placeholder response — replace with real Claude Vision output above
    blueprint = Blueprint(
        metal="18k Yellow Gold",
        center_stone="1.5ct Round Brilliant Diamond",
        setting="Cathedral Pavé",
        band_width_mm=2.0,
        shank_style="Tapered",
        estimated_carat=1.5,
        notes="Placeholder — replace with real Claude Vision extraction",
    )

    return AnalyzeResponse(
        blueprint=blueprint,
        confidence=0.92,
        raw_prompt_response="<placeholder: real response goes here>",
    )


@app.post("/generate", response_model=GenerateResponse, summary="Generate 3D model from blueprint")
async def generate(request: GenerateRequest):
    """
    Accepts a design blueprint, runs the parametric Blender/CadQuery script,
    and returns the URL of the generated GLB or STL file.

    Implementation notes (fill in when integrating):
    1. Serialize `request.blueprint` to JSON.
    2. Invoke the generator script:
       `subprocess.run(["python", "blender/generate_ring.py", "--blueprint", json_str,
                         "--output", str(output_path), "--format", request.output_format])`
    3. Wait for completion, handle non-zero exit codes.
    4. Return the relative URL so the frontend can fetch it.
    """
    start = time.perf_counter()
    logger.info("generate: blueprint=%s format=%s", request.blueprint.model_dump(), request.output_format)

    ext = request.output_format.lower()
    output_filename = f"ring_generated.{ext}"
    output_path = MODELS_DIR / output_filename

    # TODO: call the generator script
    # import subprocess, json
    # blueprint_json = request.blueprint.model_dump_json()
    # result = subprocess.run(
    #     ["python", "blender/generate_ring.py",
    #      "--blueprint", blueprint_json,
    #      "--output", str(output_path),
    #      "--format", ext],
    #     capture_output=True, text=True, timeout=120,
    # )
    # if result.returncode != 0:
    #     logger.error("Generator failed: %s", result.stderr)
    #     raise HTTPException(status_code=500, detail="3D generation failed")

    # Placeholder: return the local ring.glb served by the frontend's Vite dev server
    glb_url = f"/models/{output_filename}"

    elapsed = time.perf_counter() - start
    return GenerateResponse(
        glb_url=glb_url,
        format=ext,
        generation_time_s=round(elapsed, 3),
    )
