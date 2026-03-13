"""
Pydantic request/response schemas for JewelForge AI backend.
"""
from typing import Optional
from pydantic import BaseModel, Field


# ── /analyze ──────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    """Multipart image is received via UploadFile; this model covers JSON metadata."""
    filename: Optional[str] = Field(None, description="Original filename for logging")


class Blueprint(BaseModel):
    """Design blueprint extracted by Claude Vision from a jewelry photo."""
    metal: str = Field(..., description="Primary metal, e.g. '18k Yellow Gold'")
    center_stone: str = Field(..., description="Center stone, e.g. '1.5ct Round Brilliant Diamond'")
    setting: str = Field(..., description="Setting style, e.g. 'Cathedral Pavé'")
    band_width_mm: Optional[float] = Field(None, description="Estimated band width in mm")
    shank_style: Optional[str] = Field(None, description="Shank style, e.g. 'Tapered', 'Straight'")
    estimated_carat: Optional[float] = Field(None, description="Estimated total carat weight")
    notes: Optional[str] = Field(None, description="Any extra observations from the AI")


class AnalyzeResponse(BaseModel):
    blueprint: Blueprint
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence 0–1")
    raw_prompt_response: Optional[str] = Field(
        None, description="Raw text returned by Claude Vision (debug only)"
    )


# ── /generate ─────────────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    """Blueprint JSON forwarded from the frontend after the Analyze step."""
    blueprint: Blueprint
    output_format: str = Field("glb", pattern="^(glb|stl)$", description="Desired export format")


class GenerateResponse(BaseModel):
    glb_url: str = Field(..., description="Relative or absolute URL to the generated GLB/STL file")
    format: str = Field(..., description="Actual format of the generated file")
    generation_time_s: Optional[float] = Field(None, description="Server-side generation time in seconds")
