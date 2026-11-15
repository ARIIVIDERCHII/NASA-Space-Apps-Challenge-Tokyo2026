import math
import heapq
from typing import List, Dict, Any, Tuple, Optional
import numpy as np

GRID_SIZE = 128
CELL_SIZE = 10.0
WORLD_SPAN = GRID_SIZE * CELL_SIZE
BASE_MOLA_ELEVATION = -2545.0
HELMET_HEIGHT_M = 1.8
HAB_ANTENNA_HEIGHT_M = 15.0

class MarsEnvironmentEngine:

    def __init__(self) -> None:
        self.grid_size = GRID_SIZE
        self.cell_size = CELL_SIZE
        self.world_span = WORLD_SPAN

        self.elevation = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.slope_deg = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.sand_index = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.thermal_inertia = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.mineral_type = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.int32)
        self.mineral_conc = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.comm_quality = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)
        self.radiation_exposure = np.zeros((GRID_SIZE, GRID_SIZE), dtype=np.float32)

        self.hab_base = {
            "id": "HAB_BASE",
            "name": "База «Олимп-1» (Ares-IV Hab & Comm Tower)",
            "type": "base",
            "x": -410.0,
            "z": 390.0,
            "antenna_height": HAB_ANTENNA_HEIGHT_M,
            "description": "Посадочный жилой модуль НАСА с 15-метровой высоконаправленной антенной связи, шлюзом и медицинским отсеком."
        }

        self.shelters = [
            {
                "id": "SHELTER_1",
                "name": "Укрытие «Гефест» (Лавовая трубка)",
                "type": "lava_tube",
                "x": -95.0,
                "z": 45.0,
                "shielding_pct": 99.4,
                "capacity": 6,
                "description": "Подземная базальтовая каверна с естественным сводом толщиной 8 м. Полная защита от солнечных вспышек (SPE)."
            },
            {
                "id": "SHELTER_2",
                "name": "Укрытие «Аврора» (Реголитовый бункер Дельты)",
                "type": "regolith_dome",
                "x": 310.0,
                "z": -310.0,
                "shielding_pct": 96.8,
                "capacity": 4,
                "description": "Аварийный герметичный купол со спечённым 1.5-метровым реголитовым экраном в северном секторе каньона."
            },
            {
                "id": "SHELTER_3",
                "name": "Укрытие «Кодиак-Юг» (Скальный грот)",
                "type": "cliff_alcove",
                "x": 260.0,
                "z": 240.0,
                "shielding_pct": 92.0,
                "capacity": 4,
                "description": "Укрепленная ниша под массивным осадочным козырьком останца Кодиак с автономным маяком."
            }
        ]

        self.rover = {
            "id": "ROVER_PERSEVERANCE",
            "name": "Ровер «Perseverance-II»",
            "type": "rover",
            "x": -250.0,
            "z": 260.0,
            "description": "Автономный марсоход сопровождения с рентгеновским спектрометром PIXL и сканером SHERLOC."
        }

        self._generate_terrain_and_layers()
        self._place_infrastructure_elevations()
        self._compute_global_comm_map()
        self.boulders = self._generate_mineral_boulders()
        self.mission_presets = self._build_mission_presets()

    def grid_to_world(self, r: float, c: float) -> Tuple[float, float]:
        x = (c / (self.grid_size - 1) - 0.5) * self.world_span
        z = (r / (self.grid_size - 1) - 0.5) * self.world_span
        return float(x), float(z)

    def world_to_grid(self, x: float, z: float) -> Tuple[int, int]:
        c = int(round(((x / self.world_span) + 0.5) * (self.grid_size - 1)))
        r = int(round(((z / self.world_span) + 0.5) * (self.grid_size - 1)))
        r = max(0, min(self.grid_size - 1, r))
        c = max(0, min(self.grid_size - 1, c))
        return r, c

    def sample_elevation_bilinear(self, x: float, z: float) -> float:
        cf = ((x / self.world_span) + 0.5) * (self.grid_size - 1)
        rf = ((z / self.world_span) + 0.5) * (self.grid_size - 1)
        cf = max(0.0, min(float(self.grid_size - 1.001), cf))
        rf = max(0.0, min(float(self.grid_size - 1.001), rf))

        c0 = int(math.floor(cf))
        r0 = int(math.floor(rf))
        c1 = min(self.grid_size - 1, c0 + 1)
        r1 = min(self.grid_size - 1, r0 + 1)

        dc = cf - c0
        dr = rf - r0

        h00 = float(self.elevation[r0, c0])
        h10 = float(self.elevation[r0, c1])
        h01 = float(self.elevation[r1, c0])
        h11 = float(self.elevation[r1, c1])

        h0 = h00 * (1.0 - dc) + h10 * dc
        h1 = h01 * (1.0 - dc) + h11 * dc
        return float(h0 * (1.0 - dr) + h1 * dr)

    def _generate_terrain_and_layers(self) -> None:
        xs = np.linspace(-640.0, 640.0, self.grid_size)
        zs = np.linspace(-640.0, 640.0, self.grid_size)
        X, Z = np.meshgrid(xs, zs)

        ux = X / 14.5
        uz = Z / 14.5

        canyon_axis_x = 140.0 * np.sin(Z / 210.0) - 85.0 * np.cos(Z / 135.0)
        dist_from_canyon = np.abs(X - canyon_axis_x) / 14.5

        edge = np.clip((dist_from_canyon - 4.2) / 18.0, 0.0, 1.0)
        edge = edge * edge * (3.0 - 2.0 * edge)

        n_waves = (
            np.sin(ux * 0.31 + uz * 0.17) * 0.9
            + np.sin(ux * 0.13 - uz * 0.29 + 1.7) * 1.1
            + np.sin((ux + uz) * 0.071 + 4.2) * 1.3
            + np.sin(ux * 0.83 + uz * 0.61) * 0.25
        )
        peaks = (n_waves + 3.55) / 7.1
        ripple = (
            np.sin(ux * 0.45 + uz * 0.35) * 0.22
            + np.cos(ux * 0.28 - uz * 0.39) * 0.18
        )

        neon_waves_height = (peaks * peaks * 68.0 * edge + ripple * 11.0 * (1.0 - 0.5 * edge))

        def steep_mesa(cx: float, cz: float, rx: float, rz: float, height: float) -> np.ndarray:
            d = np.sqrt(((X - cx) / rx) ** 2 + ((Z - cz) / rz) ** 2)
            return height / (1.0 + (d ** 5.5))

        obstacles = (
            steep_mesa(-240.0, 165.0, 82.0, 68.0, 46.0)
            + steep_mesa(-15.0, -35.0, 88.0, 72.0, 52.0)
            + steep_mesa(-185.0, -195.0, 95.0, 74.0, 49.0)
            + steep_mesa(165.0, -110.0, 85.0, 92.0, 50.0)
            + steep_mesa(115.0, 185.0, 78.0, 75.0, 44.0)
        )

        def crater(cx: float, cz: float, radius: float, depth: float, rim: float) -> np.ndarray:
            r_norm = np.sqrt((X - cx) ** 2 + (Z - cz) ** 2) / radius
            bowl = -depth * np.maximum(0.0, 1.0 - r_norm ** 2) * (r_norm < 1.0)
            rim_wall = rim * np.exp(-((r_norm - 1.04) ** 2) / (2.0 * 0.15 ** 2))
            return bowl + rim_wall

        craters = (
            crater(-115.0, 275.0, 68.0, 12.0, 14.0)
            + crater(75.0, 55.0, 72.0, 14.0, 16.0)
            + crater(-45.0, -245.0, 78.0, 15.0, 16.5)
            + crater(285.0, 45.0, 65.0, 11.0, 13.0)
        )

        raw_elev = 10.0 + neon_waves_height + obstacles + craters

        dist_hab = np.sqrt((X - self.hab_base["x"]) ** 2 + (Z - self.hab_base["z"]) ** 2)
        hab_flat = np.exp(-(dist_hab ** 2) / (2.0 * 75.0 ** 2))
        raw_elev = raw_elev * (1.0 - 0.82 * hab_flat) + 12.0 * (0.82 * hab_flat)

        self.elevation = (raw_elev - np.min(raw_elev) + 2.5).astype(np.float32)

        dz_dr, dz_dc = np.gradient(self.elevation, self.cell_size, self.cell_size)
        self.slope_deg = np.degrees(np.arctan(np.sqrt(dz_dr ** 2 + dz_dc ** 2))).astype(np.float32)

        sand_traps = (
            0.92 * np.exp(-(((X + 310.0) / 72.0) ** 2 + ((Z - 285.0) / 65.0) ** 2))
            + 0.90 * np.exp(-(((X + 135.0) / 78.0) ** 2 + ((Z - 85.0) / 68.0) ** 2))
            + 0.94 * np.exp(-(((X - 75.0) / 85.0) ** 2 + ((Z + 135.0) / 74.0) ** 2))
            + 0.88 * np.exp(-(((X - 210.0) / 78.0) ** 2 + ((Z + 245.0) / 68.0) ** 2))
            + 0.86 * np.exp(-(((X + 25.0) / 74.0) ** 2 + ((Z - 195.0) / 68.0) ** 2))
        )
        dune_waves = 0.22 * (0.5 + 0.5 * np.sin(ux * 0.65 + uz * 0.45))
        bedrock_clear = np.clip((self.slope_deg - 15.0) / 14.0, 0.0, 1.0)

        sand_raw = (sand_traps + dune_waves) * (1.0 - 0.78 * bedrock_clear) * (1.0 - 0.85 * hab_flat)
        self.sand_index = np.clip(sand_raw, 0.04, 0.96).astype(np.float32)
        self.thermal_inertia = (620.0 - 525.0 * self.sand_index + 30.0 * bedrock_clear).astype(np.float32)

        prob_clay = np.exp(-((dist_from_canyon / 4.2) ** 2)) * (0.6 + 0.4 * np.cos(uz * 0.3))
        prob_carbonate = np.exp(-(((dist_from_canyon - 5.5) / 2.5) ** 2))
        prob_silica = (
            1.18 * np.exp(-(((X + 75.0) / 68.0) ** 2 + ((Z + 115.0) / 65.0) ** 2))
            + 1.15 * np.exp(-(((X - 145.0) / 68.0) ** 2 + ((Z - 35.0) / 65.0) ** 2))
            + 1.12 * np.exp(-(((X + 195.0) / 68.0) ** 2 + ((Z - 45.0) / 65.0) ** 2))
        )
        prob_sulfate = 0.92 * np.clip((self.elevation - 28.0) / 35.0, 0.0, 1.0)
        prob_hematite = 0.95 * np.clip((self.slope_deg - 19.0) / 14.0, 0.0, 1.0)

        stack = np.stack([
            np.full_like(X, 0.33),
            prob_clay,
            prob_carbonate,
            prob_silica,
            prob_sulfate,
            prob_hematite
        ], axis=0)
        self.mineral_type = np.argmax(stack, axis=0).astype(np.int32)
        self.mineral_conc = np.clip(np.max(stack, axis=0), 0.18, 0.99).astype(np.float32)

        norm_el = (self.elevation - np.min(self.elevation)) / (np.max(self.elevation) - np.min(self.elevation) + 1e-5)
        self.radiation_exposure = np.clip(0.42 + 0.52 * norm_el - 0.22 * np.clip(self.slope_deg / 30.0, 0.0, 1.0), 0.15, 0.98).astype(np.float32)

    def _place_infrastructure_elevations(self) -> None:
        self.hab_base["y"] = round(self.sample_elevation_bilinear(self.hab_base["x"], self.hab_base["z"]), 2)
        self.hab_base["mola_z"] = round(BASE_MOLA_ELEVATION + self.hab_base["y"], 1)

        for sh in self.shelters:
            sh["y"] = round(self.sample_elevation_bilinear(sh["x"], sh["z"]), 2)
            sh["mola_z"] = round(BASE_MOLA_ELEVATION + sh["y"], 1)

        self.rover["y"] = round(self.sample_elevation_bilinear(self.rover["x"], self.rover["z"]), 2)

    def check_comm_los(self, x: float, z: float, target_y: Optional[float] = None) -> Dict[str, Any]:
        bx, bz = self.hab_base["x"], self.hab_base["z"]
        by = self.hab_base["y"] + HAB_ANTENNA_HEIGHT_M
        ay = (target_y if target_y is not None else self.sample_elevation_bilinear(x, z)) + HELMET_HEIGHT_M

        dx = bx - x
        dz = bz - z
        dist_2d = math.hypot(dx, dz)
        dist_3d = math.sqrt(dx * dx + dz * dz + (by - ay) ** 2)
        azimuth_deg = (math.degrees(math.atan2(dx, -dz)) + 360.0) % 360.0

        if dist_2d < 15.0:
            return {
                "visible": True,
                "signal_dbm": -42.0,
                "quality_pct": 100.0,
                "max_obstruction_m": 0.0,
                "distance_m": round(dist_2d, 1),
                "azimuth_deg": round(azimuth_deg, 1)
            }

        num_samples = max(12, int(dist_2d / 14.0))
        max_obstruction = -999.0
        for i in range(1, num_samples):
            t = i / num_samples
            sx = x + dx * t
            sz = z + dz * t
            ray_y = ay + (by - ay) * t
            terr_y = self.sample_elevation_bilinear(sx, sz)
            diff = terr_y - ray_y
            if diff > max_obstruction:
                max_obstruction = diff

        fspl_db = 28.0 + 20.0 * math.log10(max(10.0, dist_3d) / 10.0)
        if max_obstruction > 0.0:
            diffraction_loss_db = 14.0 + 3.8 * max_obstruction
            visible = False
        elif max_obstruction > -2.5:
            diffraction_loss_db = 3.2 * (max_obstruction + 2.5)
            visible = True
        else:
            diffraction_loss_db = 0.0
            visible = True

        signal_dbm = max(-112.0, min(-40.0, -38.0 - (fspl_db - 28.0) - diffraction_loss_db))
        quality_pct = float(np.clip((signal_dbm + 108.0) / 63.0 * 100.0, 4.0, 100.0))

        return {
            "visible": bool(visible),
            "signal_dbm": round(float(signal_dbm), 1),
            "quality_pct": round(quality_pct, 1),
            "max_obstruction_m": round(float(max(0.0, max_obstruction)), 2),
            "distance_m": round(float(dist_2d), 1),
            "azimuth_deg": round(float(azimuth_deg), 1)
        }

    def _compute_global_comm_map(self) -> None:
        for r in range(self.grid_size):
            for c in range(self.grid_size):
                x, z = self.grid_to_world(r, c)
                res = self.check_comm_los(x, z, float(self.elevation[r, c]))
                self.comm_quality[r, c] = res["quality_pct"] / 100.0

    def _generate_mineral_boulders(self) -> List[Dict[str, Any]]:
        raw_targets = [
            {
                "id": "ROCK_CHEAVA_FALLS",
                "name": "Обнажение «Cheyava Falls» (Леопардовый аргиллит)",
                "mineral_class": "Опаловый кремнезём + Фосфаты железа (Вивианит)",
                "mineral_code": 3,
                "formula": "SiO₂·nH₂O + Fe₃(PO₄)₂·8H₂O",
                "x": -80.0,
                "z": -120.0,
                "scale": 3.8,
                "biosignature_index": 96,
                "priority": "CRITICAL_SCIENCE",
                "color_hex": "#00f5d4",
                "crism_bands_um": [1.41, 1.91, 2.21, 2.32],
                "oxides": {"SiO₂": 58.4, "FeO": 14.2, "MgO": 8.6, "Al₂O₃": 6.1, "CaO": 3.9, "SO₃": 2.4, "H₂O/CO₂": 6.4},
                "description": "Приоритетная цель миссии! Пятнистая осадочная порода в русле Неретва с реакционными фронтами восстановления железа в присутствии древней органики."
            },
            {
                "id": "ROCK_LEFROY_BAY",
                "name": "Валун «Lefroy Bay» (Гидратированный опал)",
                "mineral_class": "Аморфный гидратированный кремнезём (Opal-A)",
                "mineral_code": 3,
                "formula": "SiO₂ · 1.5H₂O",
                "x": -215.0,
                "z": -35.0,
                "scale": 3.4,
                "biosignature_index": 91,
                "priority": "HIGH_SCIENCE",
                "color_hex": "#00e5ff",
                "crism_bands_um": [1.38, 1.92, 2.22],
                "oxides": {"SiO₂": 67.2, "FeO": 8.5, "MgO": 6.4, "Al₂O₃": 5.2, "CaO": 2.8, "SO₃": 1.8, "H₂O/CO₂": 8.1},
                "description": "Крупный обломок опалового кремнезёма у изгиба каньона. Идеально консервирует микрофоссилии древнего озера Езеро."
            },
            {
                "id": "ROCK_WILDCAT_RIDGE",
                "name": "Плита «Wildcat Ridge» (Сульфатный аргиллит)",
                "mineral_class": "Филлосиликаты + Сульфаты Mg/Fe",
                "mineral_code": 1,
                "formula": "(Na,Ca)₀.₃(Fe,Mg)₂Si₄O₁₀(OH)₂ + MgSO₄",
                "x": 95.0,
                "z": -215.0,
                "scale": 3.9,
                "biosignature_index": 88,
                "priority": "HIGH_SCIENCE",
                "color_hex": "#38ef7d",
                "crism_bands_um": [1.42, 1.93, 2.30],
                "oxides": {"SiO₂": 44.8, "FeO": 16.5, "MgO": 12.1, "Al₂O₃": 8.4, "CaO": 4.2, "SO₃": 8.9, "H₂O/CO₂": 5.1},
                "description": "Тонкослоистый озёрный алевролит подножия уступа Дельты. Сформировался в спокойной водной среде древнего бассейна."
            },
            {
                "id": "ROCK_CASTELL_HENLLYS",
                "name": "Глыба «Castell Henllys» (Береговой карбонат)",
                "mineral_class": "Оливин-магнезитовый карбонат (Marginal Unit)",
                "mineral_code": 2,
                "formula": "(Mg,Fe)CO₃ + (Mg,Fe)₂SiO₄",
                "x": -335.0,
                "z": 95.0,
                "scale": 3.5,
                "biosignature_index": 82,
                "priority": "HIGH_SCIENCE",
                "color_hex": "#a8ff78",
                "crism_bands_um": [1.05, 2.31, 2.51],
                "oxides": {"SiO₂": 38.6, "FeO": 18.4, "MgO": 22.7, "Al₂O₃": 3.9, "CaO": 5.1, "SO₃": 1.2, "H₂O/CO₂": 10.1},
                "description": "Прибрежный карбонатный комплекс на высоте палео-пляжа кратера Езеро."
            },
            {
                "id": "ROCK_SKINNER_RIDGE",
                "name": "Уступ «Skinner Ridge» (Конгломерат Дельты)",
                "mineral_class": "Полимиктовый речной песчаник и сульфаты",
                "mineral_code": 4,
                "formula": "CaSO₄·2H₂O + Fe₂O₃ + SiO₂",
                "x": 155.0,
                "z": -25.0,
                "scale": 4.0,
                "biosignature_index": 76,
                "priority": "MEDIUM_SCIENCE",
                "color_hex": "#ffd166",
                "crism_bands_um": [1.45, 1.75, 1.94, 2.42],
                "oxides": {"SiO₂": 47.1, "FeO": 15.8, "MgO": 10.3, "Al₂O₃": 9.2, "CaO": 7.4, "SO₃": 6.3, "H₂O/CO₂": 3.9},
                "description": "Крупнозернистый песчаник речного потока с окатанной галькой привносных пород."
            },
            {
                "id": "ROCK_KODIAK_STRATA",
                "name": "Монолит «Kodiak Base» (Клиноформы паводка)",
                "mineral_class": "Железистый смектит (Нонтронит) + Сульфаты",
                "mineral_code": 4,
                "formula": "Na₀.₃Fe₂(Si,Al)₄O₁₀(OH)₂·nH₂O",
                "x": 215.0,
                "z": 165.0,
                "scale": 4.2,
                "biosignature_index": 79,
                "priority": "HIGH_SCIENCE",
                "color_hex": "#ffb703",
                "crism_bands_um": [1.43, 1.91, 2.29],
                "oxides": {"SiO₂": 49.3, "FeO": 19.6, "MgO": 8.9, "Al₂O₃": 7.8, "CaO": 4.5, "SO₃": 5.4, "H₂O/CO₂": 4.5},
                "description": "Обнажение косослоистых отложений древней дельты на склоне останца Кодиак."
            },
            {
                "id": "ROCK_BRIGHT_ANGEL",
                "name": "Терраса «Bright Angel» (Ангидрит и Кремнезём)",
                "mineral_class": "Сульфат кальция (Бассанит) и аморфный кремнезём",
                "mineral_code": 3,
                "formula": "CaSO₄·0.5H₂O + SiO₂·nH₂O",
                "x": -35.0,
                "z": -340.0,
                "scale": 3.7,
                "biosignature_index": 93,
                "priority": "CRITICAL_SCIENCE",
                "color_hex": "#48bfe3",
                "crism_bands_um": [1.41, 1.92, 2.21, 2.48],
                "oxides": {"SiO₂": 52.6, "FeO": 7.4, "MgO": 6.8, "Al₂O₃": 5.5, "CaO": 11.2, "SO₃": 9.8, "H₂O/CO₂": 6.7},
                "description": "Аномально светлое обнажение на северном борту русла Неретва с высокой концентрацией гидратированных фаз."
            },
            {
                "id": "ROCK_OTIS_PEAK",
                "name": "Шпиль «Otis Peak» (Хромитовый серпентинит)",
                "mineral_class": "Серпентин + Магнетит (Источник H₂)",
                "mineral_code": 5,
                "formula": "(Mg,Fe)₃Si₂O₅(OH)₄ + Fe₃O₄",
                "x": 285.0,
                "z": -195.0,
                "scale": 3.8,
                "biosignature_index": 84,
                "priority": "HIGH_SCIENCE",
                "color_hex": "#f72585",
                "crism_bands_um": [1.39, 1.97, 2.32, 2.51],
                "oxides": {"SiO₂": 42.7, "FeO": 20.1, "MgO": 24.3, "Al₂O₃": 3.1, "CaO": 2.0, "SO₃": 1.1, "H₂O/CO₂": 6.7},
                "description": "Порода со следами древней серпентинизации — геохимической реакции, выделявшей водород."
            }
        ]

        for b in raw_targets:
            b["y"] = round(self.sample_elevation_bilinear(b["x"], b["z"]), 2)
            b["mola_z"] = round(BASE_MOLA_ELEVATION + b["y"], 1)

        return raw_targets

    def _build_mission_presets(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "MISSION_SERPENTINE_CANYON",
                "name": "EVA-01: Извилистый каньон Неретва и биосигнатуры «Cheyava Falls»",
                "subtitle": "Нелинейный S-образный маршрут в обход пика Санта-Крус, кратеров и дюн Сейта",
                "difficulty": "Средняя (Оптимальный баланс)",
                "waypoints": [
                    {"x": -410.0, "z": 390.0, "label": "Старт: База «Олимп-1»"},
                    {"x": -340.0, "z": 110.0, "label": "Точка 1: Западный обход «Castell Henllys»"},
                    {"x": -95.0, "z": 45.0, "label": "Точка 2: Лавовая трубка «Гефест»"},
                    {"x": -215.0, "z": -45.0, "label": "Точка 3: Опаловый меандр «Lefroy Bay»"},
                    {"x": -75.0, "z": -135.0, "label": "Точка 4: Биосигнатура «Cheyava Falls»"},
                    {"x": 95.0, "z": -215.0, "label": "Точка 5: Сульфатная терраса «Wildcat Ridge»"},
                    {"x": 310.0, "z": -310.0, "label": "Финиш: Бункер Дельты «Аврора»"}
                ],
                "weights": {"slope": 1.8, "sand": 2.1, "comm": 1.0, "science": 1.3}
            },
            {
                "id": "MISSION_EAST_WEST_ZIGZAG",
                "name": "EVA-02: Большая петля через останец Кодиак к шпилю «Otis Peak»",
                "subtitle": "Глубокий манёвр через восточное крыло каньона и возврат к северным террасам",
                "difficulty": "Высокая (Сложный рельеф)",
                "waypoints": [
                    {"x": -410.0, "z": 390.0, "label": "Старт: База «Олимп-1»"},
                    {"x": -35.0, "z": 195.0, "label": "Точка 1: Южный проход каньона"},
                    {"x": 235.0, "z": 185.0, "label": "Точка 2: Монолит «Kodiak Base»"},
                    {"x": 155.0, "z": -25.0, "label": "Точка 3: Перевал «Skinner Ridge»"},
                    {"x": 285.0, "z": -195.0, "label": "Точка 4: Серпентинит «Otis Peak»"},
                    {"x": -35.0, "z": -340.0, "label": "Финиш: Терраса «Bright Angel»"}
                ],
                "weights": {"slope": 1.7, "sand": 1.9, "comm": 1.1, "science": 1.2}
            },
            {
                "id": "MISSION_EXTREME_SLALOM",
                "name": "EVA-03: Геологический слалом между кратерами и дюнами THEMIS",
                "subtitle": "Максимальное огибание песчаных ловушек с заходом во все три укрытия",
                "difficulty": "Экстремальная (Высокая нагрузка PLSS)",
                "waypoints": [
                    {"x": -410.0, "z": 390.0, "label": "Старт: База «Олимп-1»"},
                    {"x": -95.0, "z": 45.0, "label": "Точка 1: Укрытие «Гефест»"},
                    {"x": 260.0, "z": 240.0, "label": "Точка 2: Скальный грот «Кодиак-Юг»"},
                    {"x": 155.0, "z": -25.0, "label": "Точка 3: Уступ «Skinner Ridge»"},
                    {"x": -80.0, "z": -120.0, "label": "Точка 4: Обнажение «Cheyava Falls»"},
                    {"x": 310.0, "z": -310.0, "label": "Финиш: Бункер «Аврора»"}
                ],
                "weights": {"slope": 1.6, "sand": 2.4, "comm": 1.0, "science": 1.2}
            }
        ]

    def get_map_payload(self) -> Dict[str, Any]:
        return {
            "grid_size": self.grid_size,
            "cell_size": self.cell_size,
            "world_span": self.world_span,
            "base_mola_elevation": BASE_MOLA_ELEVATION,
            "layers": {
                "elevation": np.round(self.elevation, 2).tolist(),
                "slope_deg": np.round(self.slope_deg, 1).tolist(),
                "sand_index": np.round(self.sand_index, 3).tolist(),
                "thermal_inertia": np.round(self.thermal_inertia, 0).tolist(),
                "mineral_type": self.mineral_type.tolist(),
                "mineral_conc": np.round(self.mineral_conc, 2).tolist(),
                "comm_quality": np.round(self.comm_quality, 2).tolist(),
                "radiation_exposure": np.round(self.radiation_exposure, 2).tolist(),
            },
            "infrastructure": {
                "hab_base": self.hab_base,
                "shelters": self.shelters,
                "rover": self.rover,
                "boulders": self.boulders
            },
            "mission_presets": self.mission_presets
        }

    def _astar_segment(
        self,
        start_rc: Tuple[int, int],
        goal_rc: Tuple[int, int],
        weights: Dict[str, float],
        emergency_mode: bool = False
    ) -> List[Tuple[int, int]]:
        sr, sc = start_rc
        gr, gc = goal_rc
        if (sr, sc) == (gr, gc):
            return [(sr, sc)]

        w_slope = float(weights.get("slope", 1.8))
        w_sand = float(weights.get("sand", 2.1))
        w_comm = float(weights.get("comm", 1.0))
        w_sci = float(weights.get("science", 1.1))

        max_safe_slope = 28.0 if emergency_mode else 21.0

        neighbors = [
            (-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
            (-1, -1, 1.4142), (-1, 1, 1.4142), (1, -1, 1.4142), (1, 1, 1.4142)
        ]

        open_heap: List[Tuple[float, int, int]] = []
        heapq.heappush(open_heap, (0.0, sr, sc))
        g_score = np.full((self.grid_size, self.grid_size), np.inf, dtype=np.float64)
        g_score[sr, sc] = 0.0
        came_from: Dict[Tuple[int, int], Tuple[int, int]] = {}
        visited = np.zeros((self.grid_size, self.grid_size), dtype=bool)

        while open_heap:
            _, r, c = heapq.heappop(open_heap)
            if visited[r, c]:
                continue
            visited[r, c] = True
            if (r, c) == (gr, gc):
                break

            h_curr = float(self.elevation[r, c])

            for dr, dc, dist_mult in neighbors:
                nr, nc = r + dr, c + dc
                if not (0 <= nr < self.grid_size and 0 <= nc < self.grid_size):
                    continue
                if visited[nr, nc]:
                    continue

                h_next = float(self.elevation[nr, nc])
                dh = h_next - h_curr
                horiz_dist = dist_mult * self.cell_size
                step_slope_deg = abs(math.degrees(math.atan2(dh, horiz_dist)))
                cell_slope_deg = float(self.slope_deg[nr, nc])
                effective_slope = max(step_slope_deg, cell_slope_deg)

                if effective_slope > max_safe_slope:
                    slope_penalty = 38.0 + ((effective_slope - max_safe_slope) ** 2) * 5.5
                else:
                    uphill_factor = 1.45 if dh > 0 else 0.90
                    slope_penalty = w_slope * uphill_factor * ((effective_slope / 7.5) ** 2.3)

                sand_val = float(self.sand_index[nr, nc])
                sand_penalty = w_sand * (4.2 * (sand_val ** 2.1))

                comm_val = float(self.comm_quality[nr, nc])
                comm_penalty = 0.0 if emergency_mode else w_comm * (1.8 * ((1.0 - comm_val) ** 2))

                has_mineral = 1.0 if int(self.mineral_type[nr, nc]) > 0 else 0.0
                sci_bonus = 0.0 if emergency_mode else min(0.38, 0.16 * w_sci * has_mineral * float(self.mineral_conc[nr, nc]))

                step_cost = dist_mult * (1.0 + slope_penalty + sand_penalty + comm_penalty - sci_bonus)
                step_cost = max(0.50 * dist_mult, step_cost)

                tentative_g = g_score[r, c] + step_cost
                if tentative_g < g_score[nr, nc]:
                    g_score[nr, nc] = tentative_g
                    came_from[(nr, nc)] = (r, c)
                    dx_rem = abs(nc - gc)
                    dz_rem = abs(nr - gr)
                    h_est = (max(dx_rem, dz_rem) + 0.4142 * min(dx_rem, dz_rem)) * 0.78
                    heapq.heappush(open_heap, (tentative_g + h_est, nr, nc))

        path: List[Tuple[int, int]] = []
        curr = (gr, gc)
        if curr not in came_from and curr != (sr, sc):
            steps = max(2, int(math.hypot(gr - sr, gc - sc)))
            for i in range(steps + 1):
                t = i / steps
                path.append((int(round(sr + (gr - sr) * t)), int(round(sc + (gc - sc) * t))))
            return path

        while curr != (sr, sc):
            path.append(curr)
            curr = came_from[curr]
        path.append((sr, sc))
        path.reverse()
        return path

    def _scan_local_hazards_20m(self, x: float, z: float) -> Dict[str, Any]:
        sector_angles = [0, 45, 90, 135, 180, 225, 270, 315]
        sector_hazards = []
        max_local_slope = 0.0
        max_local_sand = 0.0

        for ang_deg in sector_angles:
            ang_rad = math.radians(ang_deg)
            sin_a = math.sin(ang_rad)
            cos_a = -math.cos(ang_rad)

            sec_slope = 0.0
            sec_sand = 0.0
            for dist in (10.0, 20.0):
                sx = x + sin_a * dist
                sz = z + cos_a * dist
                r, c = self.world_to_grid(sx, sz)
                sec_slope = max(sec_slope, float(self.slope_deg[r, c]))
                sec_sand = max(sec_sand, float(self.sand_index[r, c]))

            max_local_slope = max(max_local_slope, sec_slope)
            max_local_sand = max(max_local_sand, sec_sand)

            hazard_type = "SAFE"
            if sec_slope >= 22.0:
                hazard_type = "CRITICAL_SLOPE"
            elif sec_slope >= 15.0:
                hazard_type = "WARN_SLOPE"
            elif sec_sand >= 0.62:
                hazard_type = "SAND_TRAP"

            sector_hazards.append({
                "angle_deg": ang_deg,
                "slope_deg": round(sec_slope, 1),
                "sand_index": round(sec_sand, 2),
                "hazard": hazard_type
            })

        return {
            "max_slope_20m": round(max_local_slope, 1),
            "max_sand_20m": round(max_local_sand, 2),
            "sectors": sector_hazards
        }

    def compute_route_timeline(
        self,
        waypoints: List[Dict[str, Any]],
        weights: Optional[Dict[str, float]] = None,
        emergency_mode: bool = False,
        initial_o2_pct: float = 98.0
    ) -> Dict[str, Any]:
        if weights is None:
            weights = {"slope": 1.8, "sand": 2.1, "comm": 1.0, "science": 1.2}
        if len(waypoints) < 2:
            waypoints = self.mission_presets[0]["waypoints"]

        full_grid_path: List[Tuple[int, int]] = []
        waypoint_step_indices: List[int] = [0]

        for idx in range(len(waypoints) - 1):
            p0 = waypoints[idx]
            p1 = waypoints[idx + 1]
            rc0 = self.world_to_grid(float(p0["x"]), float(p0["z"]))
            rc1 = self.world_to_grid(float(p1["x"]), float(p1["z"]))
            seg = self._astar_segment(rc0, rc1, weights, emergency_mode=emergency_mode)
            if idx == 0:
                full_grid_path.extend(seg)
            else:
                full_grid_path.extend(seg[1:])
            waypoint_step_indices.append(len(full_grid_path) - 1)

        raw_coords = [self.grid_to_world(r, c) for r, c in full_grid_path]
        wp_set = set(waypoint_step_indices)
        smoothed = list(raw_coords)
        for _ in range(2):
            next_pass: List[Tuple[float, float]] = []
            for i in range(len(smoothed)):
                if i in wp_set or i == 0 or i == len(smoothed) - 1:
                    next_pass.append(smoothed[i])
                else:
                    x0, z0 = smoothed[i - 1]
                    x1, z1 = smoothed[i]
                    x2, z2 = smoothed[i + 1]
                    next_pass.append((0.28 * x0 + 0.44 * x1 + 0.28 * x2, 0.28 * z0 + 0.44 * z1 + 0.28 * z2))
            smoothed = next_pass

        timeline: List[Dict[str, Any]] = []
        total_dist_m = 0.0
        total_time_s = 0.0
        total_climb_m = 0.0
        total_o2_liters = 0.0
        o2_tank_capacity_liters = 580.0
        remaining_o2_liters = o2_tank_capacity_liters * (initial_o2_pct / 100.0)

        curr_heart_rate = 74.0 if not emergency_mode else 110.0
        curr_coolant_temp = 18.4 if not emergency_mode else 20.5

        mineral_names = {
            0: "Базальтовый реголит",
            1: "Филлосиликаты (Смектитовая глина)",
            2: "Карбонаты (Оливин-магнезит)",
            3: "Гидратированный кремнезём (Опал — Биосигнатура!)",
            4: "Полигидратированные сульфаты",
            5: "Гематит / Оксиды железа"
        }

        warnings_log: List[Dict[str, Any]] = []

        for i, (wx, wz) in enumerate(smoothed):
            r, c = self.world_to_grid(wx, wz)
            wy = self.sample_elevation_bilinear(wx, wz)
            cell_slope = float(self.slope_deg[r, c])
            sand_val = float(self.sand_index[r, c])
            ti_val = float(self.thermal_inertia[r, c])
            min_code = int(self.mineral_type[r, c])
            min_conc = float(self.mineral_conc[r, c])
            rad_exp = float(self.radiation_exposure[r, c])

            if i == 0:
                step_dist_3d = 0.0
                dh = 0.0
                pitch_slope_deg = 0.0
                heading_deg = 0.0
            else:
                px, pz = smoothed[i - 1]
                py = timeline[i - 1]["y"]
                dx = wx - px
                dz = wz - pz
                dh = wy - py
                horiz_d = max(0.1, math.hypot(dx, dz))
                step_dist_3d = math.sqrt(horiz_d * horiz_d + dh * dh)
                pitch_slope_deg = math.degrees(math.atan2(dh, horiz_d))
                heading_deg = (math.degrees(math.atan2(dx, -dz)) + 360.0) % 360.0
                if dh > 0:
                    total_climb_m += dh

            total_dist_m += step_dist_3d

            slope_rad = math.radians(pitch_slope_deg)
            base_speed = 1.55 if not emergency_mode else 1.95
            speed_slope_factor = math.exp(-2.7 * abs(math.tan(slope_rad) + 0.03))
            speed_sand_factor = 1.0 - 0.52 * (sand_val ** 1.6)
            walk_speed_ms = max(0.40, base_speed * speed_slope_factor * speed_sand_factor)

            step_dt_s = (step_dist_3d / walk_speed_ms) if i > 0 else 0.0
            total_time_s += step_dt_s

            grade_pct = math.tan(slope_rad) * 100.0
            uphill_work = max(0.0, grade_pct) * 21.0 * walk_speed_ms
            downhill_braking = max(0.0, -grade_pct - 5.0) * 6.5 * walk_speed_ms
            sand_work = 385.0 * (sand_val ** 1.65) * walk_speed_ms
            terrain_slope_effort = 11.8 * max(0.0, cell_slope - 6.0)
            emergency_adrenaline = 110.0 if emergency_mode else 0.0

            metabolic_watts = float(np.clip(
                172.0 + 85.0 * (walk_speed_ms ** 1.5) + uphill_work + downhill_braking + sand_work + terrain_slope_effort + emergency_adrenaline,
                175.0, 960.0
            ))

            target_hr = float(np.clip(68.0 + (metabolic_watts - 175.0) * 0.148, 70.0, 176.0))
            alpha_hr = min(1.0, (step_dt_s / 9.5) if step_dt_s > 0 else 0.45)
            curr_heart_rate = curr_heart_rate + alpha_hr * (target_hr - curr_heart_rate)

            target_coolant = float(np.clip(17.9 + (metabolic_watts - 175.0) * 0.0138, 18.0, 27.8))
            alpha_temp = min(1.0, (step_dt_s / 13.0) if step_dt_s > 0 else 0.35)
            curr_coolant_temp = curr_coolant_temp + alpha_temp * (target_coolant - curr_coolant_temp)

            o2_rate_lpm = float(np.clip(0.74 + (metabolic_watts - 175.0) * 0.0032, 0.75, 3.25))
            step_o2_used = o2_rate_lpm * (step_dt_s / 60.0)
            total_o2_liters += step_o2_used
            remaining_o2_liters = max(5.0, remaining_o2_liters - step_o2_used)
            o2_remaining_pct = (remaining_o2_liters / o2_tank_capacity_liters) * 100.0

            comm_info = self.check_comm_los(wx, wz, wy)
            radar_20m = self._scan_local_hazards_20m(wx, wz)

            nearest_sh = min(
                self.shelters,
                key=lambda s: math.hypot(wx - s["x"], wz - s["z"])
            )
            shelter_dist_m = round(math.hypot(wx - nearest_sh["x"], wz - nearest_sh["z"]), 1)
            shelter_az_deg = round((math.degrees(math.atan2(nearest_sh["x"] - wx, -(nearest_sh["z"] - wz))) + 360.0) % 360.0, 1)

            next_wp_idx = len(waypoints) - 1
            for w_idx, step_idx in enumerate(waypoint_step_indices):
                if step_idx > i:
                    next_wp_idx = w_idx
                    break
            next_wp = waypoints[next_wp_idx]
            dist_to_next_wp = round(math.hypot(wx - float(next_wp["x"]), wz - float(next_wp["z"])), 1)

            rad_usv_h = (22.0 + 18.0 * rad_exp) if not emergency_mode else (780.0 + 680.0 * rad_exp)

            step_data = {
                "step": i,
                "x": round(wx, 2),
                "y": round(wy, 2),
                "z": round(wz, 2),
                "mola_elevation_m": round(BASE_MOLA_ELEVATION + wy, 1),
                "distance_from_start_m": round(total_dist_m, 1),
                "elapsed_time_s": round(total_time_s, 1),
                "heading_deg": round(heading_deg, 1),
                "pitch_slope_deg": round(pitch_slope_deg, 1),
                "terrain_slope_deg": round(cell_slope, 1),
                "sand_index": round(sand_val, 3),
                "thermal_inertia_tiu": round(ti_val, 0),
                "mineral_code": min_code,
                "mineral_name": mineral_names.get(min_code, "Базальт"),
                "mineral_conc": round(min_conc, 2),
                "walk_speed_ms": round(walk_speed_ms, 2),
                "metabolic_watts": round(metabolic_watts, 0),
                "heart_rate_bpm": round(curr_heart_rate, 0),
                "coolant_temp_c": round(curr_coolant_temp, 2),
                "o2_rate_lpm": round(o2_rate_lpm, 2),
                "o2_remaining_pct": round(o2_remaining_pct, 1),
                "radiation_usv_h": round(rad_usv_h, 1),
                "comm": comm_info,
                "radar_20m": radar_20m,
                "nearest_shelter": {
                    "id": nearest_sh["id"],
                    "name": nearest_sh["name"],
                    "distance_m": shelter_dist_m,
                    "azimuth_deg": shelter_az_deg
                },
                "next_waypoint": {
                    "index": next_wp_idx,
                    "label": next_wp.get("label", f"Точка {next_wp_idx}"),
                    "distance_m": dist_to_next_wp
                }
            }
            timeline.append(step_data)

            if i % 5 == 0:
                if cell_slope >= 18.0:
                    warnings_log.append({
                        "step": i,
                        "type": "SLOPE_HAZARD",
                        "severity": "HIGH" if cell_slope >= 23.0 else "MEDIUM",
                        "message": f"Шаг {i} ({round(total_dist_m)} м): Крутой уклон {round(cell_slope, 1)}° — рост ЧСС до {round(curr_heart_rate)} BPM"
                    })
                elif sand_val >= 0.58:
                    warnings_log.append({
                        "step": i,
                        "type": "SAND_SLIP",
                        "severity": "MEDIUM",
                        "message": f"Шаг {i} ({round(total_dist_m)} м): Зыбучая дюна THEMIS ({int(sand_val*100)}%) — расход O₂ {round(o2_rate_lpm, 2)} л/мин"
                    })
                elif not comm_info["visible"]:
                    warnings_log.append({
                        "step": i,
                        "type": "COMM_SHADOW",
                        "severity": "MEDIUM",
                        "message": f"Шаг {i} ({round(total_dist_m)} м): Зона радиотени (перекрытие рельефом {comm_info['max_obstruction_m']} м)"
                    })

        max_hr = max((s["heart_rate_bpm"] for s in timeline), default=75)
        max_slope = max((s["terrain_slope_deg"] for s in timeline), default=0.0)
        avg_comm = float(np.mean([s["comm"]["quality_pct"] for s in timeline])) if timeline else 100.0
        comm_los_pct = float(np.mean([100.0 if s["comm"]["visible"] else 0.0 for s in timeline])) if timeline else 100.0

        return {
            "emergency_mode": emergency_mode,
            "summary": {
                "total_distance_m": round(total_dist_m, 1),
                "estimated_duration_min": round(total_time_s / 60.0, 1),
                "total_climb_m": round(total_climb_m, 1),
                "total_o2_used_liters": round(total_o2_liters, 1),
                "final_o2_remaining_pct": timeline[-1]["o2_remaining_pct"] if timeline else initial_o2_pct,
                "max_heart_rate_bpm": int(max_hr),
                "max_slope_deg": round(max_slope, 1),
                "avg_comm_quality_pct": round(avg_comm, 1),
                "comm_los_coverage_pct": round(comm_los_pct, 1),
                "total_steps": len(timeline)
            },
            "waypoints": [
                {
                    **wp,
                    "y": round(self.sample_elevation_bilinear(float(wp["x"]), float(wp["z"])), 2),
                    "step_index": waypoint_step_indices[idx]
                }
                for idx, wp in enumerate(waypoints)
            ],
            "warnings": warnings_log[:12],
            "timeline": timeline
        }

    def compute_emergency_egress(
        self,
        current_x: float,
        current_z: float,
        current_o2_pct: float = 84.0
    ) -> Dict[str, Any]:
        candidates = [*self.shelters, {
            "id": self.hab_base["id"],
            "name": self.hab_base["name"],
            "type": "base_shelter",
            "x": self.hab_base["x"],
            "z": self.hab_base["z"],
            "y": self.hab_base["y"],
            "shielding_pct": 99.8,
            "description": self.hab_base["description"]
        }]

        best_route = None
        best_target = None
        best_time_min = 999999.0

        emergency_weights = {"slope": 1.4, "sand": 2.1, "comm": 0.0, "science": 0.0}

        for target in candidates:
            wps = [
                {"x": current_x, "z": current_z, "label": "Точка тревоги (Скафандр)"},
                {"x": target["x"], "z": target["z"], "label": f"Укрытие: {target['name']}"}
            ]
            route_res = self.compute_route_timeline(
                waypoints=wps,
                weights=emergency_weights,
                emergency_mode=True,
                initial_o2_pct=current_o2_pct
            )
            dur = route_res["summary"]["estimated_duration_min"]
            if dur < best_time_min:
                best_time_min = dur
                best_route = route_res
                best_target = target

        return {
            "alert_code": "SPE_CLASS_X9_DUST_STORM",
            "alert_title": "ВСПЫШКА РАДИАЦИИ (SPE X9.4) И ПЫЛЕВОЙ ФРОНТ",
            "selected_shelter": best_target,
            "evacuation_route": best_route
        }
