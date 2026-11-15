import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from backend.mars_physics import MarsEnvironmentEngine

app = FastAPI(
    title="NASA SEXTANT + AR HUD: End-to-End Mars EVA System",
    description="Многослойное 3D-представление кратера Езеро и тактический AR-визор астронавта (Challenge #11: Карта Марса)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mars_engine = MarsEnvironmentEngine()
cached_map_payload = mars_engine.get_map_payload()
default_preset = mars_engine.mission_presets[0]
default_route = mars_engine.compute_route_timeline(
    waypoints=default_preset["waypoints"],
    weights=default_preset["weights"],
    emergency_mode=False
)

class WaypointInput(BaseModel):
    x: float
    z: float
    label: Optional[str] = "Точка маршрута"

class RouteRequest(BaseModel):
    waypoints: List[WaypointInput]
    weights: Optional[Dict[str, float]] = Field(
        default_factory=lambda: {"slope": 1.5, "sand": 1.7, "comm": 1.0, "science": 1.0}
    )
    emergency_mode: bool = False
    initial_o2_pct: float = 98.0

class EmergencyRequest(BaseModel):
    current_x: float
    current_z: float
    current_o2_pct: float = 84.0

@app.get("/api/init")
def get_initial_system_state() -> Dict[str, Any]:
    return {
        "map": cached_map_payload,
        "initial_route": default_route
    }

@app.post("/api/route")
def calculate_eva_route(req: RouteRequest) -> Dict[str, Any]:
    wps = [{"x": w.x, "z": w.z, "label": w.label or f"Точка {i}"} for i, w in enumerate(req.waypoints)]
    return mars_engine.compute_route_timeline(
        waypoints=wps,
        weights=req.weights,
        emergency_mode=req.emergency_mode,
        initial_o2_pct=req.initial_o2_pct
    )

@app.post("/api/emergency-route")
def calculate_emergency_route(req: EmergencyRequest) -> Dict[str, Any]:
    return mars_engine.compute_emergency_egress(
        current_x=req.current_x,
        current_z=req.current_z,
        current_o2_pct=req.current_o2_pct
    )

@app.get("/api/probe")
def probe_surface_point(x: float = Query(...), z: float = Query(...)) -> Dict[str, Any]:
    r, c = mars_engine.world_to_grid(x, z)
    elev = mars_engine.sample_elevation_bilinear(x, z)
    comm = mars_engine.check_comm_los(x, z, elev)
    return {
        "x": round(x, 2),
        "z": round(z, 2),
        "y": round(elev, 2),
        "mola_elevation_m": round(-2545.0 + elev, 1),
        "slope_deg": round(float(mars_engine.slope_deg[r, c]), 1),
        "sand_index": round(float(mars_engine.sand_index[r, c]), 3),
        "thermal_inertia_tiu": round(float(mars_engine.thermal_inertia[r, c]), 0),
        "mineral_code": int(mars_engine.mineral_type[r, c]),
        "mineral_conc": round(float(mars_engine.mineral_conc[r, c]), 2),
        "comm": comm
    }

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index() -> FileResponse:
    return FileResponse(os.path.join(static_dir, "index.html"))
