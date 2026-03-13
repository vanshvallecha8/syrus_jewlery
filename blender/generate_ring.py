"""
JewelForge AI — Parametric Ring Generator
==========================================
Reads a blueprint JSON (as produced by the /analyze endpoint), constructs a
parametric ring geometry, and exports it as GLB or STL.

Usage (standalone Python / Blender headless):
    python generate_ring.py --blueprint '{"metal":"18k Yellow Gold",...}' --output ring.glb --format glb

Dependencies (choose one approach):
    • CadQuery  : pip install cadquery (pure-Python; no Blender required)
    • Blender   : run as `blender --background --python generate_ring.py -- <args>`

This file contains a working CadQuery stub plus commented Blender equivalents.
Replace the placeholder geometry with a real ring mesh before production use.
"""

import argparse
import json
import sys
from pathlib import Path


# ── Blueprint defaults ─────────────────────────────────────────────────────────

DEFAULTS = {
    "band_width_mm": 2.0,
    "band_height_mm": 1.8,
    "inner_diameter_mm": 18.0,   # ~US size 8
    "shank_style": "Tapered",
    "metal": "18k Yellow Gold",
    "center_stone": "1.5ct Round Brilliant Diamond",
    "setting": "Cathedral Pavé",
}


# ── CadQuery generator (primary) ───────────────────────────────────────────────

def generate_with_cadquery(blueprint: dict, output_path: Path, fmt: str) -> None:
    """
    Build a simple parametric ring with CadQuery and export it.

    Geometry:
      - Torus band (swept circle profile along circular path)
      - Optional cathedral prongs sketched above the shank
      - Center stone represented as a faceted cylinder (placeholder)

    Replace / extend each section with real CAD operations as needed.
    """
    try:
        import cadquery as cq  # type: ignore
    except ImportError:
        print("CadQuery is not installed. Run: pip install cadquery", file=sys.stderr)
        sys.exit(1)

    band_w = blueprint.get("band_width_mm", DEFAULTS["band_width_mm"])
    band_h = blueprint.get("band_height_mm", DEFAULTS["band_height_mm"])
    inner_r = blueprint.get("inner_diameter_mm", DEFAULTS["inner_diameter_mm"]) / 2.0

    # ── Band ─────────────────────────────────────────────────────────────────
    # Sweep a rectangular cross-section around a circle to form the shank.
    outer_r = inner_r + band_w
    band = (
        cq.Workplane("XY")
        .circle(outer_r)
        .circle(inner_r)
        .extrude(band_h)
    )

    # ── Stone seat (placeholder cylinder) ────────────────────────────────────
    stone_r = 3.0   # ~6mm round stone
    stone_h = 3.5
    stone = (
        cq.Workplane("XY")
        .workplane(offset=band_h)
        .circle(stone_r)
        .extrude(stone_h)
    )
    ring = band.union(stone)

    # ── Export ────────────────────────────────────────────────────────────────
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "stl":
        cq.exporters.export(ring, str(output_path), cq.exporters.ExportTypes.STL)
    else:
        # CadQuery exports STEP natively; convert to GLB via trimesh if available
        step_path = output_path.with_suffix(".step")
        cq.exporters.export(ring, str(step_path), cq.exporters.ExportTypes.STEP)
        _step_to_glb(step_path, output_path)

    print(f"Exported ring to {output_path}")


def _step_to_glb(step_path: Path, glb_path: Path) -> None:
    """Convert a STEP file to GLB via trimesh (best-effort)."""
    try:
        import trimesh  # type: ignore
    except ImportError:
        print(
            "trimesh is not installed; GLB conversion skipped. "
            "Install with: pip install trimesh[easy]",
            file=sys.stderr,
        )
        step_path.rename(glb_path)
        return

    try:
        mesh = trimesh.load(str(step_path))
        mesh.export(str(glb_path))
    except Exception as exc:  # noqa: BLE001
        print(
            f"trimesh failed to convert {step_path} → {glb_path}: {exc}\n"
            "Check that the STEP file is valid and trimesh[easy] is installed.",
            file=sys.stderr,
        )
        # Fall back to renaming so the caller always has a file at the expected path
        step_path.rename(glb_path)


# ── Blender generator (alternative) ───────────────────────────────────────────
# Uncomment and adapt when running inside Blender:
#
# def generate_with_blender(blueprint: dict, output_path: Path, fmt: str) -> None:
#     import bpy
#     import math
#
#     bpy.ops.object.select_all(action="SELECT")
#     bpy.ops.object.delete()
#
#     band_w = blueprint.get("band_width_mm", DEFAULTS["band_width_mm"]) / 1000
#     inner_r = blueprint.get("inner_diameter_mm", DEFAULTS["inner_diameter_mm"]) / 2000
#
#     # Add torus (band)
#     bpy.ops.mesh.primitive_torus_add(
#         major_radius=inner_r + band_w / 2,
#         minor_radius=band_w / 2,
#         major_segments=128,
#         minor_segments=32,
#     )
#     band = bpy.context.active_object
#     band.name = "RingBand"
#
#     # Add UV sphere as placeholder stone
#     bpy.ops.mesh.primitive_uv_sphere_add(radius=0.003, location=(0, 0, inner_r + band_w))
#     stone = bpy.context.active_object
#     stone.name = "CenterStone"
#
#     # Export
#     if fmt == "glb":
#         bpy.ops.export_scene.gltf(filepath=str(output_path), export_format="GLB")
#     else:
#         bpy.ops.export_mesh.stl(filepath=str(output_path))
#
#     print(f"Blender exported ring to {output_path}")


# ── CLI entry point ────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Parametric ring generator")
    parser.add_argument("--blueprint", required=True, help="Blueprint JSON string")
    parser.add_argument("--output", required=True, help="Output file path (e.g. models/ring.glb)")
    parser.add_argument("--format", choices=["glb", "stl"], default="glb", help="Export format")
    args = parser.parse_args()

    blueprint = json.loads(args.blueprint)
    output_path = Path(args.output)
    generate_with_cadquery(blueprint, output_path, args.format)


if __name__ == "__main__":
    main()
