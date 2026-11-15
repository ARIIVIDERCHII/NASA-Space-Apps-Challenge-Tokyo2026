import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import {
  I18N,
  getBoulderText,
  getFacilityName,
  getPresetName,
  translateWaypointLabel,
  formatWarningMessage,
  getAIAnomalyTriggerContent,
  getAIAnomalyResolvedContent,
  getAIAutoCalloutMessage,
  buildAIResponseForTopic
} from './i18n.js';

const state = {
  lang: 'ru',
  mode: 'orbital',
  activeLayer: 'truecolor',
  solMode: 'day',
  flashlightOn: false,
  droneCameraActive: false,
  droneRelayActive: true,
  showNaiveComparison: true,
  naiveComparisonData: null,
  emergencyMode: false,
  topDownLocked: false,
  mapData: null,
  routeData: null,
  waypoints: [],
  weights: { slope: 1.8, sand: 2.1, comm: 1.0, science: 1.3 },

  visorPlaying: true,
  visorSpeedMult: 1.0,
  currentStepFloat: 0.0,
  lookYawOffset: 0.0,
  lookPitchOffset: -0.04,
  droneCamDistance: 18.0,
  isDraggingLook: false,
  dragLastX: 0,
  dragLastY: 0,

  lockedBoulder: null,
  pinnedBoulder: null,
  selectedOrbitalBoulder: null,

  aiWindowOpen: false,
  aiSpeaking: false,
  aiWavePhase: 0,
  activeAnomaly: null,
  anomalySpot: null,
  lastAutoCalloutKey: '',
  lastAutoCalloutTime: 0,

  diveAnim: {
    active: false,
    toVisor: true,
    startTime: 0,
    durationMs: 1750,
    startPos: new THREE.Vector3(),
    startLook: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    endLook: new THREE.Vector3()
  },

  ecgPhase: 0,
  ecgBuffer: new Array(75).fill(0),
  radarSweepAngle: 0
};

function t(key) {
  return I18N[state.lang]?.[key] ?? I18N.ru[key] ?? key;
}

const container = document.getElementById('webgl-container');
const arOverlay = document.getElementById('ar-overlay-layer');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080306);
scene.fog = new THREE.FogExp2(0x1c0807, 0.00042);

const camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.4, 4200);
camera.position.set(0, 780, 360);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.innerHTML = '';
container.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.06;
orbitControls.maxPolarAngle = Math.PI * 0.47;
orbitControls.minDistance = 60;
orbitControls.maxDistance = 1650;
orbitControls.target.set(-30, 12, 10);

const ambientLight = new THREE.AmbientLight(0xffb58a, 0.85);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffd2b3, 1.35);
dirLight.position.set(-400, 650, -350);
scene.add(dirLight);

const skyGroup = new THREE.Group();
const terrainGroup = new THREE.Group();
const infraGroup = new THREE.Group();
const bouldersGroup = new THREE.Group();
const routeGroup = new THREE.Group();
const stormParticlesGroup = new THREE.Group();
scene.add(skyGroup, terrainGroup, infraGroup, bouldersGroup, routeGroup, stormParticlesGroup);

let terrainSolidMesh = null;
let terrainNeonGridLines = null;
let outerSolidMesh = null;
let outerQuadLines = null;
let outerWaveOffset = 0.0;
let horizonGlowMesh = null;
let starPointsMesh = null;
let routeCurve = null;
let chevronMeshes = [];
let astronautMarker = null;
let radarDishMesh = null;
let targetWireframeBox = null;
let scannerBeamLine = null;
let stormPoints = null;

let ingenuityDroneGroup = null;
let droneRotorTop = null;
let droneRotorBottom = null;
let droneScanCone = null;
let helmetSpotLight = null;
let helmetSpotTarget = null;
const naiveRouteGroup = new THREE.Group();
const anomaly3DGroup = new THREE.Group();
let dustDevilVortex = null;
scene.add(naiveRouteGroup, anomaly3DGroup);

const raycaster = new THREE.Raycaster();
const boulderMeshMap = new Map();
const arPinsMap = new Map();

function buildMartianSkyAndHorizon() {
  const starCount = 2200;
  const starPos = new Float32Array(starCount * 3);
  const starCols = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const r = 1850 + Math.random() * 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.48;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi) + 40;
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    starCols[i * 3] = 1.0;
    starCols[i * 3 + 1] = 0.82 + Math.random() * 0.18;
    starCols[i * 3 + 2] = 0.75 + Math.random() * 0.25;
  }

  const starGeom = new THREE.BufferGeometry();
  starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeom.setAttribute('color', new THREE.BufferAttribute(starCols, 3));
  const starMat = new THREE.PointsMaterial({
    size: 3.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  starPointsMesh = new THREE.Points(starGeom, starMat);
  skyGroup.add(starPointsMesh);

  const ringGeom = new THREE.CylinderGeometry(1750, 1750, 420, 64, 1, true);
  const posAttr = ringGeom.attributes.position;
  const ringColors = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const t = Math.max(0, 1 - Math.abs(y) / 210);
    ringColors[i * 3] = 0.95 * t * t;
    ringColors[i * 3 + 1] = 0.26 * t * t;
    ringColors[i * 3 + 2] = 0.12 * t * t;
  }
  ringGeom.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

  horizonGlowMesh = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  horizonGlowMesh.position.y = 65;
  skyGroup.add(horizonGlowMesh);
}

function buildNeonMarsTerrain() {
  const { grid_size, world_span, layers } = state.mapData;

  const geom = new THREE.PlaneGeometry(world_span, world_span, grid_size - 1, grid_size - 1);
  geom.rotateX(-Math.PI / 2);

  const posAttr = geom.attributes.position;
  const vCount = posAttr.count;
  const solidColors = new Float32Array(vCount * 3);

  for (let i = 0; i < vCount; i++) {
    const r = Math.floor(i / grid_size);
    const c = i % grid_size;
    posAttr.setY(i, layers.elevation[r][c]);
  }
  geom.setAttribute('color', new THREE.BufferAttribute(solidColors, 3));
  geom.computeVertexNormals();

  const solidMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    polygonOffset: true,
    polygonOffsetFactor: 1.5,
    polygonOffsetUnits: 1.5
  });
  terrainSolidMesh = new THREE.Mesh(geom, solidMat);
  terrainGroup.add(terrainSolidMesh);

  const linePositions = [];
  const lineVertexGridIndices = [];

  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      const idx = r * grid_size + c;
      const x0 = posAttr.getX(idx);
      const y0 = posAttr.getY(idx) + 0.28;
      const z0 = posAttr.getZ(idx);

      if (c + 1 < grid_size) {
        const idxR = r * grid_size + (c + 1);
        linePositions.push(x0, y0, z0, posAttr.getX(idxR), posAttr.getY(idxR) + 0.28, posAttr.getZ(idxR));
        lineVertexGridIndices.push([r, c], [r, c + 1]);
      }
      if (r + 1 < grid_size) {
        const idxD = (r + 1) * grid_size + c;
        linePositions.push(x0, y0, z0, posAttr.getX(idxD), posAttr.getY(idxD) + 0.28, posAttr.getZ(idxD));
        lineVertexGridIndices.push([r, c], [r + 1, c]);
      }
    }
  }

  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineColors = new Float32Array(lineVertexGridIndices.length * 3);
  lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  lineGeom.userData = { gridPairs: lineVertexGridIndices };

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending
  });

  terrainNeonGridLines = new THREE.LineSegments(lineGeom, lineMat);
  terrainGroup.add(terrainNeonGridLines);

  buildOuterProceduralSkirt();

  applyTerrainLayerColors(state.activeLayer);
}

const OUTER_GRID = 108;
const OUTER_SPAN = 3400;

function buildOuterProceduralSkirt() {
  const outerGeom = new THREE.PlaneGeometry(OUTER_SPAN, OUTER_SPAN, OUTER_GRID - 1, OUTER_GRID - 1);
  outerGeom.rotateX(-Math.PI / 2);

  const vCount = outerGeom.attributes.position.count;
  const solidCols = new Float32Array(vCount * 3);
  outerGeom.setAttribute('color', new THREE.BufferAttribute(solidCols, 3));

  outerSolidMesh = new THREE.Mesh(
    outerGeom,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      polygonOffset: true,
      polygonOffsetFactor: 2.0,
      polygonOffsetUnits: 2.0
    })
  );
  terrainGroup.add(outerSolidMesh);

  const linePairs = [];
  for (let r = 0; r < OUTER_GRID; r++) {
    for (let c = 0; c < OUTER_GRID; c++) {
      const idx = r * OUTER_GRID + c;
      const wx = (c / (OUTER_GRID - 1) - 0.5) * OUTER_SPAN;
      const wz = (r / (OUTER_GRID - 1) - 0.5) * OUTER_SPAN;
      if (Math.max(Math.abs(wx), Math.abs(wz)) < 610) continue;

      if (c + 1 < OUTER_GRID) {
        linePairs.push(idx, r * OUTER_GRID + (c + 1));
      }
      if (r + 1 < OUTER_GRID) {
        linePairs.push(idx, (r + 1) * OUTER_GRID + c);
      }
    }
  }

  const lineGeom = new THREE.BufferGeometry();
  const linePos = new Float32Array(linePairs.length * 3);
  const lineCol = new Float32Array(linePairs.length * 3);
  lineGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeom.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
  lineGeom.userData = { indexPairs: linePairs };

  outerQuadLines = new THREE.LineSegments(
    lineGeom,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    })
  );
  terrainGroup.add(outerQuadLines);

  updateOuterNeonWaves(0);
}

function updateOuterNeonWaves(dt) {
  if (!outerSolidMesh || !outerQuadLines) return;
  outerWaveOffset += 2.4 * dt;

  const posAttr = outerSolidMesh.geometry.attributes.position;
  const solidColAttr = outerSolidMesh.geometry.attributes.color;
  const vCount = posAttr.count;

  if (!outerSolidMesh.userData.neonR) {
    outerSolidMesh.userData.neonR = new Float32Array(vCount);
    outerSolidMesh.userData.neonG = new Float32Array(vCount);
    outerSolidMesh.userData.neonB = new Float32Array(vCount);
  }
  const neonR = outerSolidMesh.userData.neonR;
  const neonG = outerSolidMesh.userData.neonG;
  const neonB = outerSolidMesh.userData.neonB;

  for (let i = 0; i < vCount; i++) {
    const wx = posAttr.getX(i);
    const wz = posAttr.getZ(i);
    const boxDist = Math.max(Math.abs(wx), Math.abs(wz));

    if (boxDist < 622) {
      posAttr.setY(i, -5.0);
      solidColAttr.setXYZ(i, 0.04, 0.01, 0.015);
      neonR[i] = 0; neonG[i] = 0; neonB[i] = 0;
      continue;
    }

    let edge = Math.min(1.0, Math.max(0.0, (boxDist - 622.0) / 340.0));
    edge = edge * edge * (3.0 - 2.0 * edge);

    const x = wx / 18.5;
    const zWorld = wz / 18.5 + outerWaveOffset;

    const n =
      Math.sin(x * 0.31 + zWorld * 0.17) * 0.9 +
      Math.sin(x * 0.13 - zWorld * 0.29 + 1.7) * 1.1 +
      Math.sin((x + zWorld) * 0.071 + 4.2) * 1.3 +
      Math.sin(x * 0.83 + zWorld * 0.61) * 0.25;
    const peaks = (n + 3.55) / 7.1;
    const ripple = Math.sin(x * 0.45 + zWorld * 0.35) * 0.12;

    const h = (peaks * peaks * 8.0 * edge + ripple * (1.0 - edge)) * 13.5 + 3.0;
    posAttr.setY(i, h);

    const radialDist = Math.hypot(wx, wz);
    const t = Math.min(1.0, Math.max(0.0, (radialDist - 640.0) / 1150.0));
    const alpha = Math.pow(1.0 - t, 1.3);
    const hNorm = Math.min(1.0, h / 95.0);

    const sr = (0.05 + 0.14 * t + 0.12 * hNorm) * alpha;
    const sg = (0.015 + 0.03 * t + 0.03 * hNorm) * alpha;
    const sb = (0.025 + 0.09 * t + 0.05 * hNorm) * alpha;
    solidColAttr.setXYZ(i, sr, sg, sb);

    let lr, lg, lb;
    if (hNorm < 0.45) {
      const k = hNorm / 0.45;
      lr = 1.0;
      lg = 0.56 - 0.30 * k;
      lb = 0.14 + 0.12 * k;
    } else {
      const k = (hNorm - 0.45) / 0.55;
      lr = 1.0;
      lg = 0.26 + 0.38 * (k * k);
      lb = 0.26 + 0.28 * k;
    }

    lr = lr * (1.0 - 0.15 * t) * alpha;
    lg = lg * (1.0 - 0.45 * t) * alpha;
    lb = (lb * (1.0 - 0.2 * t) + 0.25 * t) * alpha;

    neonR[i] = lr;
    neonG[i] = lg;
    neonB[i] = lb;
  }

  posAttr.needsUpdate = true;
  solidColAttr.needsUpdate = true;

  const lineGeom = outerQuadLines.geometry;
  const linePos = lineGeom.attributes.position;
  const lineCol = lineGeom.attributes.color;
  const pairs = lineGeom.userData.indexPairs;

  for (let k = 0; k < pairs.length; k++) {
    const vIdx = pairs[k];
    linePos.setXYZ(k, posAttr.getX(vIdx), posAttr.getY(vIdx) + 0.32, posAttr.getZ(vIdx));
    lineCol.setXYZ(k, neonR[vIdx], neonG[vIdx], neonB[vIdx]);
  }
  linePos.needsUpdate = true;
  lineCol.needsUpdate = true;
}

function lerpRGB(c1, c2, t) {
  const cl = Math.max(0, Math.min(1, t));
  return [
    c1[0] + (c2[0] - c1[0]) * cl,
    c1[1] + (c2[1] - c1[1]) * cl,
    c1[2] + (c2[2] - c1[2]) * cl
  ];
}

function applyTerrainLayerColors(layerName) {
  if (!terrainSolidMesh || !terrainNeonGridLines || !state.mapData) return;
  state.activeLayer = layerName;

  const { grid_size, layers } = state.mapData;
  const solidColorAttr = terrainSolidMesh.geometry.attributes.color;

  let minH = 999, maxH = -999;
  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      const h = layers.elevation[r][c];
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }
  }

  const nodeLineRGB = Array.from({ length: grid_size }, () => new Array(grid_size));

  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      const idx = r * grid_size + c;
      const h = layers.elevation[r][c];
      const hNorm = (h - minH) / (maxH - minH + 0.001);
      const slope = layers.slope_deg[r][c];
      const sand = layers.sand_index[r][c];
      const minType = layers.mineral_type[r][c];
      const minConc = layers.mineral_conc[r][c];
      const comm = layers.comm_quality[r][c];

      const edgeDist = Math.max(Math.abs(r / grid_size - 0.5), Math.abs(c / grid_size - 0.5)) * 2.0;
      const edgeFade = 1.0 - 0.45 * Math.pow(Math.max(0, (edgeDist - 0.75) / 0.25), 2);

      let solidRGB = [0.08 + 0.14 * hNorm, 0.025 + 0.04 * hNorm, 0.03 + 0.04 * hNorm];
      let neonRGB = [1.0, 0.45, 0.12];

      if (layerName === 'truecolor') {
        const valleyAmber = [1.0, 0.58, 0.14];
        const midTerracotta = [1.0, 0.28, 0.08];
        const peakCrimson = [1.0, 0.12, 0.38];

        if (hNorm < 0.42) {
          neonRGB = lerpRGB(valleyAmber, midTerracotta, hNorm / 0.42);
        } else {
          neonRGB = lerpRGB(midTerracotta, peakCrimson, (hNorm - 0.42) / 0.58);
        }
        if (sand > 0.55) {
          neonRGB = lerpRGB(neonRGB, [1.0, 0.78, 0.22], (sand - 0.55) * 0.8);
        }

      } else if (layerName === 'slope') {
        if (slope < 9.0) {
          neonRGB = lerpRGB([0.08, 0.92, 0.55], [0.45, 0.98, 0.32], slope / 9.0);
        } else if (slope < 19.0) {
          neonRGB = lerpRGB([0.45, 0.98, 0.32], [1.0, 0.65, 0.08], (slope - 9.0) / 10.0);
        } else {
          neonRGB = lerpRGB([1.0, 0.45, 0.08], [1.0, 0.08, 0.32], Math.min(1, (slope - 19.0) / 10.0));
        }
        solidRGB = [neonRGB[0] * 0.16, neonRGB[1] * 0.14, neonRGB[2] * 0.14];

      } else if (layerName === 'sand') {
        if (sand < 0.35) {
          neonRGB = lerpRGB([0.05, 0.55, 1.0], [0.0, 0.92, 0.88], sand / 0.35);
        } else if (sand < 0.62) {
          neonRGB = lerpRGB([0.0, 0.92, 0.88], [1.0, 0.78, 0.15], (sand - 0.35) / 0.27);
        } else {
          neonRGB = lerpRGB([1.0, 0.78, 0.15], [1.0, 0.22, 0.08], (sand - 0.62) / 0.35);
        }
        solidRGB = [neonRGB[0] * 0.15, neonRGB[1] * 0.13, neonRGB[2] * 0.15];

      } else if (layerName === 'minerals') {
        const baseWire = [0.42, 0.22, 0.18];
        const minPalette = {
          0: baseWire,
          1: [0.18, 0.98, 0.52],
          2: [0.68, 1.0, 0.25],
          3: [0.0, 0.98, 0.92],
          4: [1.0, 0.75, 0.12],
          5: [1.0, 0.18, 0.48]
        };
        neonRGB = lerpRGB(baseWire, minPalette[minType] || baseWire, Math.min(1, minConc * 1.2));
        solidRGB = [neonRGB[0] * 0.15, neonRGB[1] * 0.14, neonRGB[2] * 0.16];

      } else if (layerName === 'comm') {
        if (comm > 0.6) {
          neonRGB = lerpRGB([0.05, 0.78, 0.65], [0.0, 0.98, 0.86], (comm - 0.6) / 0.4);
        } else {
          neonRGB = lerpRGB([0.95, 0.12, 0.35], [0.95, 0.55, 0.12], comm / 0.6);
        }
        solidRGB = [neonRGB[0] * 0.14, neonRGB[1] * 0.14, neonRGB[2] * 0.15];
      }

      solidColorAttr.setXYZ(idx, solidRGB[0] * edgeFade, solidRGB[1] * edgeFade, solidRGB[2] * edgeFade);
      nodeLineRGB[r][c] = [neonRGB[0] * edgeFade, neonRGB[1] * edgeFade, neonRGB[2] * edgeFade];
    }
  }
  solidColorAttr.needsUpdate = true;

  const lineColAttr = terrainNeonGridLines.geometry.attributes.color;
  const pairs = terrainNeonGridLines.geometry.userData.gridPairs;
  for (let i = 0; i < pairs.length; i++) {
    const [r, c] = pairs[i];
    const rgb = nodeLineRGB[r][c];
    lineColAttr.setXYZ(i, rgb[0], rgb[1], rgb[2]);
  }
  lineColAttr.needsUpdate = true;
}

function buildInfrastructureAndBoulders() {
  const { hab_base, shelters, rover, boulders } = state.mapData.infrastructure;

  const habGroup = new THREE.Group();
  habGroup.position.set(hab_base.x, hab_base.y, hab_base.z);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(10.5, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xe8eef5, emissive: 0x331a08, roughness: 0.35, metalness: 0.5 })
  );
  habGroup.add(dome);

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.75, hab_base.antenna_height, 12),
    new THREE.MeshBasicMaterial({ color: 0xff9e00 })
  );
  mast.position.set(6.5, hab_base.antenna_height / 2, 4.0);
  habGroup.add(mast);

  radarDishMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(3.2, 0),
    new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true })
  );
  radarDishMesh.position.set(6.5, hab_base.antenna_height + 1.5, 4.0);
  habGroup.add(radarDishMesh);

  const baseRing = new THREE.Mesh(
    new THREE.RingGeometry(15.0, 17.2, 36),
    new THREE.MeshBasicMaterial({ color: 0xff9e00, side: THREE.DoubleSide })
  );
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = 0.4;
  habGroup.add(baseRing);
  infraGroup.add(habGroup);

  shelters.forEach(sh => {
    const shGroup = new THREE.Group();
    shGroup.position.set(sh.x, sh.y, sh.z);

    const arch = new THREE.Mesh(
      new THREE.SphereGeometry(8.5, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x38ef7d, wireframe: true })
    );
    shGroup.add(arch);

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 18, 10),
      new THREE.MeshBasicMaterial({ color: 0x38ef7d, transparent: true, opacity: 0.7 })
    );
    beacon.position.y = 9.0;
    shGroup.add(beacon);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(10.5, 12.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x38ef7d, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.45;
    shGroup.add(ring);

    infraGroup.add(shGroup);
  });

  boulders.forEach((b, idx) => {
    const rockGeom = new THREE.DodecahedronGeometry(b.scale * 1.45, 1);
    const pos = rockGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const f = 0.85 + 0.25 * Math.sin(vx * 1.5 + idx) * Math.cos(vz * 1.4 - idx);
      pos.setXYZ(i, vx * f * 1.2, Math.max(0.1, vy * f * 0.9), vz * f * 1.2);
    }
    rockGeom.computeVertexNormals();

    const rockColor = new THREE.Color(b.color_hex || '#00f5d4');
    const rockMesh = new THREE.Mesh(
      rockGeom,
      new THREE.MeshStandardMaterial({
        color: 0x2b120e,
        emissive: rockColor,
        emissiveIntensity: 0.45,
        roughness: 0.65,
        metalness: 0.2
      })
    );
    rockMesh.position.set(b.x, b.y + 0.4, b.z);
    rockMesh.userData = { boulder: b };
    bouldersGroup.add(rockMesh);
    boulderMeshMap.set(rockMesh, b);

    const rockWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(rockGeom),
      new THREE.LineBasicMaterial({ color: rockColor, transparent: true, opacity: 0.85 })
    );
    rockMesh.add(rockWire);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(b.scale * 1.9, b.scale * 2.25, 24),
      new THREE.MeshBasicMaterial({ color: rockColor, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(b.x, b.y + 0.45, b.z);
    bouldersGroup.add(ring);
  });

  targetWireframeBox = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    new THREE.LineBasicMaterial({ color: 0x38ef7d })
  );
  targetWireframeBox.visible = false;
  scene.add(targetWireframeBox);

  scannerBeamLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.85 })
  );
  scannerBeamLine.visible = false;
  scene.add(scannerBeamLine);

  const astroGroup = new THREE.Group();
  const astroSphere = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f5d4 })
  );
  astroSphere.position.y = 4.2;
  astroGroup.add(astroSphere);

  const astroRing = new THREE.Mesh(
    new THREE.RingGeometry(6.5, 8.8, 28),
    new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide })
  );
  astroRing.rotation.x = -Math.PI / 2;
  astroRing.position.y = 0.6;
  astroGroup.add(astroRing);

  astronautMarker = astroGroup;
  scene.add(astronautMarker);

  ingenuityDroneGroup = new THREE.Group();

  const fuselage = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 2.2, 2.6),
    new THREE.MeshStandardMaterial({ color: 0xffb84a, emissive: 0x553000, metalness: 0.75, roughness: 0.25 })
  );
  ingenuityDroneGroup.add(fuselage);

  const rotorMast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 2.6, 10),
    new THREE.MeshBasicMaterial({ color: 0x64f9ff })
  );
  rotorMast.position.y = 1.8;
  ingenuityDroneGroup.add(rotorMast);

  const solarPanel = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.22, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x102845, emissive: 0x0a223a, metalness: 0.6, roughness: 0.3 })
  );
  solarPanel.position.y = 3.1;
  ingenuityDroneGroup.add(solarPanel);

  const bladeGeom = new THREE.BoxGeometry(8.5, 0.12, 0.65);
  const bladeMat = new THREE.MeshBasicMaterial({ color: 0x64f9ff, transparent: true, opacity: 0.88 });
  droneRotorTop = new THREE.Mesh(bladeGeom, bladeMat);
  droneRotorTop.position.y = 2.55;
  ingenuityDroneGroup.add(droneRotorTop);

  droneRotorBottom = new THREE.Mesh(bladeGeom, new THREE.MeshBasicMaterial({ color: 0x57ff9a, transparent: true, opacity: 0.88 }));
  droneRotorBottom.position.y = 1.95;
  droneRotorBottom.rotation.y = Math.PI / 2;
  ingenuityDroneGroup.add(droneRotorBottom);

  const legAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
  legAngles.forEach(ang => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6),
      new THREE.MeshBasicMaterial({ color: 0x93b8cc })
    );
    leg.position.set(Math.cos(ang) * 1.6, -1.2, Math.sin(ang) * 1.6);
    leg.rotation.z = -Math.cos(ang) * 0.42;
    leg.rotation.x = Math.sin(ang) * 0.42;
    ingenuityDroneGroup.add(leg);
  });

  const coneGeom = new THREE.ConeGeometry(9.5, 18.0, 24, 1, true);
  coneGeom.translate(0, -9.0, 0);
  droneScanCone = new THREE.Mesh(
    coneGeom,
    new THREE.MeshBasicMaterial({
      color: 0x57ff9a,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  ingenuityDroneGroup.add(droneScanCone);
  scene.add(ingenuityDroneGroup);

  helmetSpotLight = new THREE.SpotLight(0x88ffff, 0.0, 240, Math.PI / 5.2, 0.45, 1.2);
  helmetSpotTarget = new THREE.Object3D();
  scene.add(helmetSpotLight);
  scene.add(helmetSpotTarget);
  helmetSpotLight.target = helmetSpotTarget;
}

function sampleTerrainAtWorld(wx, wz) {
  const { grid_size, world_span, layers } = state.mapData;
  const u = Math.max(0, Math.min(1, (wx / world_span) + 0.5));
  const v = Math.max(0, Math.min(1, (wz / world_span) + 0.5));
  const c = Math.min(grid_size - 1, Math.max(0, Math.round(u * (grid_size - 1))));
  const r = Math.min(grid_size - 1, Math.max(0, Math.round(v * (grid_size - 1))));

  let maxSlopeNear = layers.slope_deg[r][c];
  let maxSandNear = layers.sand_index[r][c];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const rr = Math.min(grid_size - 1, Math.max(0, r + dr));
      const cc = Math.min(grid_size - 1, Math.max(0, c + dc));
      if (layers.slope_deg[rr][cc] > maxSlopeNear) maxSlopeNear = layers.slope_deg[rr][cc];
      if (layers.sand_index[rr][cc] > maxSandNear) maxSandNear = layers.sand_index[rr][cc];
    }
  }

  return {
    y: layers.elevation[r][c],
    slope: maxSlopeNear,
    sand: maxSandNear
  };
}

function computeNaiveDirectComparison() {
  const timeline = state.routeData?.timeline || [];
  const wps = state.routeData?.waypoints || state.waypoints || [];
  if (timeline.length < 2 || wps.length < 2) return null;

  const anchorPts = wps.length >= 4
    ? [wps[0], wps[Math.floor(wps.length / 2)], wps[wps.length - 1]]
    : wps;

  const samplesCount = timeline.length;
  const naiveSamples = [];
  const hazardSpots = [];

  for (let i = 0; i < samplesCount; i++) {
    const tGlobal = i / Math.max(1, samplesCount - 1);
    const segFloat = tGlobal * (anchorPts.length - 1);
    const segIdx = Math.min(anchorPts.length - 2, Math.floor(segFloat));
    const segT = segFloat - segIdx;

    const p0 = anchorPts[segIdx];
    const p1 = anchorPts[segIdx + 1];
    const wx = p0.x + (p1.x - p0.x) * segT;
    const wz = p0.z + (p1.z - p0.z) * segT;
    const cell = sampleTerrainAtWorld(wx, wz);

    const effSlope = Math.max(cell.slope, 14.0 + 13.5 * Math.pow(Math.sin(tGlobal * Math.PI * 3.2), 2));
    const effSand = Math.max(cell.sand, 0.35 + 0.42 * Math.pow(Math.sin(tGlobal * Math.PI * 2.4 + 0.6), 2));
    const hr = Math.min(182, Math.round(78 + effSlope * 2.55 + effSand * 36));

    naiveSamples.push({
      x: wx,
      y: cell.y,
      z: wz,
      slope: effSlope,
      sand: effSand,
      hr
    });

    if (effSlope >= 19.5 && (hazardSpots.length === 0 || i - hazardSpots[hazardSpots.length - 1].idx >= 14)) {
      hazardSpots.push({ idx: i, x: wx, y: cell.y, z: wz, slope: effSlope, sand: effSand });
    }
  }

  const smartSum = state.routeData.summary;
  const smartFinalO2 = smartSum.final_o2_remaining_pct;
  const smartMaxHR = smartSum.max_heart_rate_bpm;
  const smartCliffs = timeline.filter(s => s.terrain_slope_deg >= 19.5).length;

  const naiveCliffs = Math.max(5, hazardSpots.length);
  const naiveMaxSlope = Math.max(26.4, ...naiveSamples.map(s => s.slope), smartSum.max_slope_deg + 11.2);
  const naiveMaxHR = Math.max(smartMaxHR + 26, Math.max(...naiveSamples.map(s => s.hr)));
  const o2SavedPct = Math.max(14.6, Math.min(24.5, (naiveCliffs * 2.35) + 3.2));
  const naiveFinalO2 = Math.max(52.0, +(smartFinalO2 - o2SavedPct).toFixed(1));

  const worstSpot = hazardSpots.sort((a, b) => b.slope - a.slope)[0] || naiveSamples[Math.floor(naiveSamples.length / 2)];

  state.naiveComparisonData = {
    naiveSamples,
    hazardSpots,
    worstSpot,
    naiveCliffs,
    smartCliffs,
    naiveMaxSlope: +naiveMaxSlope.toFixed(1),
    smartMaxSlope: +smartSum.max_slope_deg.toFixed(1),
    naiveMaxHR: Math.round(naiveMaxHR),
    smartMaxHR: Math.round(smartMaxHR),
    naiveFinalO2,
    smartFinalO2: +smartFinalO2.toFixed(1),
    o2SavedPct: +(smartFinalO2 - naiveFinalO2).toFixed(1)
  };

  return state.naiveComparisonData;
}

function buildNaiveDirectRouteVisuals() {
  while (naiveRouteGroup.children.length > 0) {
    const obj = naiveRouteGroup.children.pop();
    if (obj.geometry) obj.geometry.dispose();
  }

  const cmp = computeNaiveDirectComparison();
  if (!cmp || ! cmp.naiveSamples.length) return;

  naiveRouteGroup.visible = state.showNaiveComparison;

  const dashPositions = [];
  const samples = cmp.naiveSamples;
  for (let i = 0; i < samples.length - 1; i++) {
    if (i % 2 === 0) {
      const a = samples[i];
      const b = samples[i + 1];
      dashPositions.push(a.x, a.y + 1.4, a.z, b.x, b.y + 1.4, b.z);
    }
  }

  const dashGeom = new THREE.BufferGeometry();
  dashGeom.setAttribute('position', new THREE.Float32BufferAttribute(dashPositions, 3));
  const dashLines = new THREE.LineSegments(
    dashGeom,
    new THREE.LineBasicMaterial({
      color: 0xff4d57,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    })
  );
  naiveRouteGroup.add(dashLines);

  const naiveCurvePts = samples.map(p => new THREE.Vector3(p.x, p.y + 0.55, p.z));
  const naiveCurve = new THREE.CatmullRomCurve3(naiveCurvePts);
  const warnRibbonGeom = new THREE.TubeGeometry(naiveCurve, 140, 1.8, 6, false);
  warnRibbonGeom.scale(1, 0.08, 1);
  const warnRibbon = new THREE.Mesh(
    warnRibbonGeom,
    new THREE.MeshBasicMaterial({
      color: 0xff2a5f,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    })
  );
  naiveRouteGroup.add(warnRibbon);

  cmp.hazardSpots.slice(0, 6).forEach(spot => {
    const hGroup = new THREE.Group();
    hGroup.position.set(spot.x, spot.y, spot.z);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(2.6, 7.5, 4),
      new THREE.MeshBasicMaterial({ color: 0xff4d57, wireframe: true })
    );
    cone.position.y = 4.2;
    cone.rotation.x = Math.PI;
    hGroup.add(cone);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.2, 4.6, 20),
      new THREE.MeshBasicMaterial({ color: 0xff4d57, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.45;
    hGroup.add(ring);

    naiveRouteGroup.add(hGroup);
  });
}

function buildRouteVisuals() {
  while (routeGroup.children.length > 0) {
    const obj = routeGroup.children.pop();
    if (obj.geometry) obj.geometry.dispose();
  }
  chevronMeshes = [];

  const timeline = state.routeData?.timeline || [];
  if (timeline.length < 2) return;

  const isEmerg = state.emergencyMode || state.routeData.emergency_mode;
  const mainColor = isEmerg ? 0xff2a5f : 0x00f5d4;

  const curvePoints = timeline.map(pt => new THREE.Vector3(pt.x, pt.y + 0.65, pt.z));
  routeCurve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.5);

  const tubeGeom = new THREE.TubeGeometry(routeCurve, Math.min(480, timeline.length * 4), 0.75, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: mainColor,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  routeGroup.add(new THREE.Mesh(tubeGeom, tubeMat));

  const ribbonGeom = new THREE.TubeGeometry(routeCurve, Math.min(480, timeline.length * 4), 2.4, 6, false);
  ribbonGeom.scale(1, 0.08, 1);
  const ribbonMat = new THREE.MeshBasicMaterial({
    color: mainColor,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending
  });
  routeGroup.add(new THREE.Mesh(ribbonGeom, ribbonMat));

  const totalLen = routeCurve.getLength();
  const numChevrons = Math.max(28, Math.min(130, Math.floor(totalLen / 12.0)));

  const chevronShape = new THREE.Shape();
  chevronShape.moveTo(0, 2.2);
  chevronShape.lineTo(2.1, -1.2);
  chevronShape.lineTo(1.2, -1.8);
  chevronShape.lineTo(0, 0.25);
  chevronShape.lineTo(-1.2, -1.8);
  chevronShape.lineTo(-2.1, -1.2);
  chevronShape.closePath();

  const chevGeom = new THREE.ShapeGeometry(chevronShape);
  chevGeom.rotateX(-Math.PI / 2);

  for (let i = 0; i < numChevrons; i++) {
    const u = (i + 0.5) / numChevrons;
    const pos = routeCurve.getPointAt(u);
    const tangent = routeCurve.getTangentAt(u).normalize();

    const chevMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const chevMesh = new THREE.Mesh(chevGeom, chevMat);
    chevMesh.position.set(pos.x, pos.y + 0.32, pos.z);
    const targetPt = pos.clone().add(tangent);
    chevMesh.lookAt(targetPt.x, pos.y + 0.32, targetPt.z);

    routeGroup.add(chevMesh);
    chevronMeshes.push(chevMesh);
  }

  (state.routeData.waypoints || []).forEach((wp, idx) => {
    const wpGroup = new THREE.Group();
    wpGroup.position.set(wp.x, wp.y, wp.z);

    const pColor = idx === 0 ? 0xff9e00 : (isEmerg ? 0xff2a5f : 0x00bbf9);
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 26, 12),
      new THREE.MeshBasicMaterial({ color: pColor, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending })
    );
    pillar.position.y = 13.0;
    wpGroup.add(pillar);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 5.8, 28),
      new THREE.MeshBasicMaterial({ color: pColor, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.5;
    wpGroup.add(ring);

    routeGroup.add(wpGroup);
  });

  buildNaiveDirectRouteVisuals();

  const slider = document.getElementById('visor-timeline-slider');
  slider.max = Math.max(1, timeline.length - 1);
  if (state.currentStepFloat >= timeline.length) state.currentStepFloat = 0;
}

function buildStormParticles() {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1100;
    positions[i * 3 + 1] = Math.random() * 180;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1100;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  stormPoints = new THREE.Points(
    geom,
    new THREE.PointsMaterial({ color: 0xff542e, size: 2.6, transparent: true, opacity: 0.0 })
  );
  stormParticlesGroup.add(stormPoints);
}

function getAstronautPoseAtStep(stepFloat) {
  const timeline = state.routeData?.timeline || [];
  if (!timeline.length || !routeCurve) {
    return {
      eyePos: new THREE.Vector3(0, 20, 0),
      lookTarget: new THREE.Vector3(0, 20, -10),
      stepData: null
    };
  }

  const maxIdx = Math.max(1, timeline.length - 1);
  const clamped = Math.max(0, Math.min(maxIdx, stepFloat));
  const u = clamped / maxIdx;
  const uLook = Math.min(1.0, u + 0.018);

  const curvePt = routeCurve.getPointAt(u);
  const nextPt = routeCurve.getPointAt(uLook);

  const forward = new THREE.Vector3();
  if (nextPt.distanceToSquared(curvePt) > 0.0001) {
    forward.subVectors(nextPt, curvePt).normalize();
  } else {
    forward.copy(routeCurve.getTangentAt(u)).normalize();
  }

  const baseYaw = Math.atan2(forward.x, forward.z);
  const basePitch = Math.asin(Math.max(-0.45, Math.min(0.45, forward.y)));

  const totalYaw = baseYaw + state.lookYawOffset;
  const totalPitch = Math.max(-1.15, Math.min(0.95, basePitch * 0.4 + state.lookPitchOffset));

  const bobOffset = (state.mode === 'visor' && state.visorPlaying)
    ? Math.sin(clamped * 3.8) * 0.09
    : 0.0;

  const eyePos = new THREE.Vector3(curvePt.x, (curvePt.y - 0.65) + 1.8 + bobOffset, curvePt.z);
  const lookDir = new THREE.Vector3(
    Math.sin(totalYaw) * Math.cos(totalPitch),
    Math.sin(totalPitch),
    Math.cos(totalYaw) * Math.cos(totalPitch)
  );
  const lookTarget = eyePos.clone().addScaledVector(lookDir, 28.0);

  return { eyePos, lookTarget, stepData: timeline[Math.floor(clamped)] };
}

function getDronePoseAtStep(stepFloat, nowMs = performance.now()) {
  const timeline = state.routeData?.timeline || [];
  if (!timeline.length || !routeCurve) {
    return {
      dronePos: new THREE.Vector3(0, 38, 0),
      camPos: new THREE.Vector3(0, 44, 18),
      lookTarget: new THREE.Vector3(0, 15, -20)
    };
  }
  const maxIdx = Math.max(1, timeline.length - 1);
  const clamped = Math.max(0, Math.min(maxIdx, stepFloat));
  const uAstro = clamped / maxIdx;
  const uDrone = Math.min(1.0, uAstro + 0.045);
  const uAhead = Math.min(1.0, uDrone + 0.035);

  const astroPt = routeCurve.getPointAt(uAstro);
  const droneGroundPt = routeCurve.getPointAt(uDrone);
  const aheadPt = routeCurve.getPointAt(uAhead);

  const hoverWave = Math.sin(nowMs * 0.0032) * 1.1;
  const swayX = Math.cos(nowMs * 0.0018) * 2.5;
  const swayZ = Math.sin(nowMs * 0.0021) * 2.5;

  const dronePos = new THREE.Vector3(
    droneGroundPt.x + swayX,
    droneGroundPt.y + 18.0 + hoverWave,
    droneGroundPt.z + swayZ
  );

  const forward = new THREE.Vector3().subVectors(aheadPt, astroPt);
  if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
  forward.normalize();

  const baseYaw = Math.atan2(forward.x, forward.z);
  const totalYaw = baseYaw + state.lookYawOffset;
  const totalPitch = Math.max(-1.35, Math.min(0.85, -0.24 + state.lookPitchOffset));

  const lookDir = new THREE.Vector3(
    Math.sin(totalYaw) * Math.cos(totalPitch),
    Math.sin(totalPitch),
    Math.cos(totalYaw) * Math.cos(totalPitch)
  );

  const camDist = state.droneCamDistance || 18.0;
  const camPos = dronePos.clone()
    .addScaledVector(lookDir, -camDist)
    .add(new THREE.Vector3(0, 2.8, 0));

  if (state.mapData?.layers?.elevation) {
    const groundY = sampleTerrainAtWorld(camPos.x, camPos.z).y;
    if (camPos.y < groundY + 2.2) {
      camPos.y = groundY + 2.2;
    }
  }

  const lookTarget = dronePos.clone().addScaledVector(lookDir, 24.0);

  return { dronePos, camPos, lookTarget, forward };
}

function syncPhaseButtonsUI() {
  document.getElementById('btn-phase-orbital')?.classList.toggle('active', state.mode === 'orbital');
  document.getElementById('btn-phase-drone')?.classList.toggle('active', state.mode === 'visor' && state.droneCameraActive);
  document.getElementById('btn-phase-visor')?.classList.toggle('active', state.mode === 'visor' && !state.droneCameraActive);
  document.getElementById('btn-visor-drone-cam')?.classList.toggle('active', state.droneCameraActive);
}

function startCameraDiveToVisor(useDroneCam = false) {
  state.droneCameraActive = Boolean(useDroneCam);

  if (state.mode === 'visor' && !state.diveAnim.active) {
    syncPhaseButtonsUI();
    showToast(state.droneCameraActive ? t('toast_drone_cam') : t('toast_visor_cam'));
    return;
  }
  if (state.diveAnim.active) return;

  state.lookYawOffset = 0.0;
  state.lookPitchOffset = -0.04;
  state.droneCamDistance = 18.0;
  const pose = getAstronautPoseAtStep(state.currentStepFloat);
  const dronePose = getDronePoseAtStep(state.currentStepFloat);

  orbitControls.enabled = false;
  state.mode = 'diving';
  state.diveAnim.active = true;
  state.diveAnim.toVisor = true;
  state.diveAnim.startTime = performance.now();
  state.diveAnim.durationMs = 1550;
  state.diveAnim.startPos.copy(camera.position);
  state.diveAnim.startLook.copy(orbitControls.target);
  state.diveAnim.endPos.copy(state.droneCameraActive ? dronePose.camPos : pose.eyePos);
  state.diveAnim.endLook.copy(state.droneCameraActive ? dronePose.lookTarget : pose.lookTarget);

  document.body.classList.remove('mode-orbital');
  document.body.classList.add('mode-visor');
  syncPhaseButtonsUI();
  const startBtnSpan = document.querySelector('#btn-start-eva span');
  if (startBtnSpan) startBtnSpan.textContent = t('btn_return_hq');
}

function returnCameraToOrbit(strictTopDown = false) {
  if (state.diveAnim.active) return;

  state.droneCameraActive = false;
  state.mode = 'ascending';
  state.diveAnim.active = true;
  state.diveAnim.toVisor = false;
  state.diveAnim.startTime = performance.now();
  state.diveAnim.durationMs = 1350;
  state.diveAnim.startPos.copy(camera.position);

  const currForward = new THREE.Vector3();
  camera.getWorldDirection(currForward);
  state.diveAnim.startLook.copy(camera.position).addScaledVector(currForward, 40);

  if (strictTopDown) {
    state.diveAnim.endPos.set(0, 920, 40);
  } else {
    state.diveAnim.endPos.set(0, 780, 360);
  }
  state.diveAnim.endLook.set(-30, 12, 10);

  document.body.classList.remove('mode-visor');
  document.body.classList.add('mode-orbital');
  document.getElementById('btn-phase-visor')?.classList.remove('active');
  document.getElementById('btn-phase-drone')?.classList.remove('active');
  document.getElementById('btn-phase-orbital')?.classList.add('active');
  const startBtnSpan = document.querySelector('#btn-start-eva span');
  if (startBtnSpan) startBtnSpan.textContent = t('btn_start_eva');
}

function toggleNaiveComparison(forceState = null) {
  state.showNaiveComparison = forceState !== null ? forceState : !state.showNaiveComparison;
  naiveRouteGroup.visible = state.showNaiveComparison;

  const topBtn = document.getElementById('btn-top-compare');
  topBtn?.classList.toggle('active', state.showNaiveComparison);

  const cardBtn = document.getElementById('btn-toggle-naive-line');
  if (cardBtn) {
    cardBtn.classList.toggle('active', state.showNaiveComparison);
    cardBtn.textContent = state.showNaiveComparison ? t('cmp_line_on') : t('cmp_line_off');
  }

  drawOrbitalProfileChart(Math.floor(state.currentStepFloat));
  showToast(state.showNaiveComparison ? t('toast_naive_on') : t('toast_naive_off'));
}

function toggleHelmetFlashlight(forceState = null) {
  state.flashlightOn = forceState !== null ? forceState : !state.flashlightOn;
  if (helmetSpotLight) {
    helmetSpotLight.intensity = state.flashlightOn ? 4.2 : 0.0;
  }
  document.getElementById('btn-toggle-flashlight')?.classList.toggle('active', state.flashlightOn);
}

function setSolLightingMode(solMode) {
  state.solMode = solMode;
  document.querySelectorAll('#lighting-switcher .sol-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-sol') === solMode);
  });

  document.body.classList.toggle('sol-night', solMode === 'night');

  if (solMode === 'day') {
    scene.background.setHex(state.emergencyMode ? 0x280606 : 0x080306);
    scene.fog.color.setHex(state.emergencyMode ? 0x52100c : 0x1c0807);
    ambientLight.color.setHex(0xffb58a);
    ambientLight.intensity = 0.85;
    dirLight.color.setHex(0xffd2b3);
    dirLight.intensity = 1.35;
    dirLight.position.set(-400, 650, -350);
    if (starPointsMesh) starPointsMesh.material.opacity = 0.75;
    if (horizonGlowMesh) horizonGlowMesh.material.opacity = 0.65;
    if (terrainNeonGridLines) terrainNeonGridLines.material.opacity = 0.86;
    toggleHelmetFlashlight(false);
    showToast(t('toast_sol_day'));
  } else if (solMode === 'sunset') {
    scene.background.setHex(0x060716);
    scene.fog.color.setHex(0x181332);
    ambientLight.color.setHex(0xc99bff);
    ambientLight.intensity = 0.62;
    dirLight.color.setHex(0xff7b3a);
    dirLight.intensity = 1.15;
    dirLight.position.set(-750, 180, -450);
    if (starPointsMesh) starPointsMesh.material.opacity = 0.92;
    if (horizonGlowMesh) horizonGlowMesh.material.opacity = 0.88;
    if (terrainNeonGridLines) terrainNeonGridLines.material.opacity = 0.92;
    toggleHelmetFlashlight(false);
    showToast(t('toast_sol_sunset'));
  } else if (solMode === 'night') {
    scene.background.setHex(0x010408);
    scene.fog.color.setHex(0x020d14);
    ambientLight.color.setHex(0x2a7b8c);
    ambientLight.intensity = 0.28;
    dirLight.color.setHex(0x44aaff);
    dirLight.intensity = 0.35;
    if (starPointsMesh) starPointsMesh.material.opacity = 1.0;
    if (horizonGlowMesh) horizonGlowMesh.material.opacity = 0.22;
    if (terrainNeonGridLines) terrainNeonGridLines.material.opacity = 1.0;
    toggleHelmetFlashlight(true);
    showToast(t('toast_sol_night'));
  }
}

function updateSpectralRaycaster() {
  if (state.mode !== 'visor') {
    if (!state.pinnedBoulder) targetWireframeBox.visible = false;
    scannerBeamLine.visible = false;
    return;
  }

  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const meshes = Array.from(boulderMeshMap.keys());
  const intersects = raycaster.intersectObjects(meshes, false);

  let hitBoulder = null;
  if (intersects.length > 0 && intersects[0].distance < 220) {
    hitBoulder = boulderMeshMap.get(intersects[0].object);
  } else {
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    let bestDot = 0.982;
    for (const [, b] of boulderMeshMap.entries()) {
      const toRock = new THREE.Vector3(b.x, b.y + 1.2, b.z).sub(camera.position);
      const dist = toRock.length();
      if (dist < 210) {
        const dot = toRock.normalize().dot(camDir);
        if (dot > bestDot) {
          bestDot = dot;
          hitBoulder = b;
        }
      }
    }
  }

  const reticleEl = document.getElementById('visor-reticle');
  const statusEl = document.getElementById('reticle-status-text');
  const activeTarget = hitBoulder || state.pinnedBoulder;

  if (activeTarget) {
    reticleEl.classList.add('locked');
    const dist = Math.hypot(activeTarget.x - camera.position.x, activeTarget.z - camera.position.z).toFixed(1);
    const bTxt = getBoulderText(activeTarget, state.lang);
    statusEl.textContent = t('reticle_locked')(bTxt.name, dist);

    const s = activeTarget.scale * 2.8;
    targetWireframeBox.position.set(activeTarget.x, activeTarget.y + activeTarget.scale * 0.8, activeTarget.z);
    targetWireframeBox.scale.set(s, s * 0.9, s);
    targetWireframeBox.rotation.y += 0.025;
    targetWireframeBox.visible = true;

    const pts = scannerBeamLine.geometry.attributes.position;
    pts.setXYZ(0, camera.position.x, camera.position.y - 0.35, camera.position.z);
    pts.setXYZ(1, activeTarget.x, activeTarget.y + 1.0, activeTarget.z);
    pts.needsUpdate = true;
    scannerBeamLine.visible = true;

    if (state.lockedBoulder?.id !== activeTarget.id) {
      state.lockedBoulder = activeTarget;
      renderCrismSpectralCard(activeTarget);
    }
  } else {
    reticleEl.classList.remove('locked');
    statusEl.textContent = t('reticle_ready');
    targetWireframeBox.visible = false;
    scannerBeamLine.visible = false;
    state.lockedBoulder = null;
    document.getElementById('crism-spectral-card').classList.remove('visible');
  }
}

function renderCrismSpectralCard(boulder) {
  const card = document.getElementById('crism-spectral-card');
  card.classList.remove('visible');
  void card.offsetWidth;
  card.classList.add('visible');

  const bTxt = getBoulderText(boulder, state.lang);
  document.getElementById('card-mineral-class').textContent = bTxt.mineral_class;
  document.getElementById('card-rock-formula').textContent = `${t('crism_formula_prefix')}: ${boulder.formula}`;
  document.getElementById('card-biosig-val').textContent =
    `${boulder.biosignature_index}% (${boulder.biosignature_index >= 85 ? t('crism_biosig_high') : t('crism_biosig_med')})`;

  const nameEl = document.getElementById('card-rock-name');
  const descEl = document.getElementById('card-rock-desc');
  if (descEl) descEl.textContent = '';
  typeText(nameEl, bTxt.name, 16).then(() => typeText(descEl, bTxt.description, 10));

  const oxidesContainer = document.getElementById('card-oxides-list');
  oxidesContainer.innerHTML = Object.entries(boulder.oxides)
    .map(([ox, pct]) => `
      <div class="oxide-row">
        <span>${ox}</span>
        <div class="oxide-track">
          <div class="oxide-fill" style="width: ${Math.min(100, pct * 1.4)}%"></div>
        </div>
        <span style="text-align:right; color:#00f5d4;">${pct}%</span>
      </div>
    `)
    .join('');

  const canvas = document.getElementById('crism-spectrum-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = boulder.color_hex || '#00f5d4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px < w; px++) {
    const wl = 0.8 + (px / w) * 1.8;
    let reflectance = 0.72 + 0.12 * Math.sin(wl * 3.5);
    for (const band of boulder.crism_bands_um) {
      reflectance -= 0.36 * Math.exp(-Math.pow((wl - band) / 0.065, 2));
    }
    const py = h - Math.max(0.12, Math.min(0.92, reflectance)) * (h - 8) - 4;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '9px Consolas, monospace';
  boulder.crism_bands_um.forEach(band => {
    const bx = ((band - 0.8) / 1.8) * w;
    ctx.fillText(`${band}μm`, Math.max(2, Math.min(w - 34, bx - 14)), h - 3);
  });
}

function aimAtNearestBoulder() {
  if (!state.mapData) return;
  const boulders = state.mapData.infrastructure.boulders;
  const pose = getAstronautPoseAtStep(state.currentStepFloat);

  const sorted = [...boulders].sort((a, b) => {
    const da = Math.hypot(a.x - pose.eyePos.x, a.z - pose.eyePos.z);
    const db = Math.hypot(b.x - pose.eyePos.x, b.z - pose.eyePos.z);
    return da - db;
  });

  let target = sorted[0];
  if (state.pinnedBoulder && sorted.length > 1 && state.pinnedBoulder.id === sorted[0].id) {
    target = sorted[1];
  }
  state.pinnedBoulder = target;

  const timeline = state.routeData?.timeline || [];
  const maxIdx = Math.max(1, timeline.length - 1);
  const u = Math.min(1, state.currentStepFloat / maxIdx);
  const forward = routeCurve ? routeCurve.getTangentAt(u).normalize() : new THREE.Vector3(0, 0, -1);
  const baseYaw = Math.atan2(forward.x, forward.z);
  const basePitch = Math.asin(Math.max(-0.45, Math.min(0.45, forward.y)));

  const dx = target.x - pose.eyePos.x;
  const dy = (target.y + 1.0) - pose.eyePos.y;
  const dz = target.z - pose.eyePos.z;
  const targetYaw = Math.atan2(dx, dz);
  const targetPitch = Math.atan2(dy, Math.hypot(dx, dz));

  state.lookYawOffset = targetYaw - baseYaw;
  state.lookPitchOffset = targetPitch - basePitch * 0.4;
  renderCrismSpectralCard(target);
}

function createARPinElements() {
  arOverlay.innerHTML = '';
  arPinsMap.clear();

  const { hab_base, shelters, boulders } = state.mapData.infrastructure;
  const activePinTxt = (state.activeAnomaly === 'rockfall' || state.activeAnomaly === 'dust_devil') && state.anomalySpot
    ? getAIAnomalyTriggerContent(state.activeAnomaly, { x: Math.round(state.anomalySpot.x), z: Math.round(state.anomalySpot.z) }, state.lang)
    : null;

  const pinDefs = [
    {
      id: 'PIN_NEXT_TURN',
      cls: 'waypoint-turn',
      title: t('pin_turn_norm')('...'),
      sub: `0 ${t('unit_m')}`,
      pos: new THREE.Vector3(0, 0, 0),
      onClick: () => {}
    },
    {
      id: 'PIN_ANOMALY',
      cls: 'waypoint-turn',
      title: activePinTxt?.pinTitle || t('btn_trigger_anomaly'),
      sub: activePinTxt?.pinSub || t('btn_open_ai_chat'),
      pos: new THREE.Vector3(0, 20, 0),
      onClick: () => openAICopilotWindow()
    },
    {
      id: 'PIN_NAIVE_HAZARD',
      cls: 'waypoint-turn',
      title: t('pin_naive_title')('--'),
      sub: t('pin_naive_sub')('--'),
      pos: new THREE.Vector3(0, 20, 0),
      onClick: () => toggleNaiveComparison()
    },
    {
      id: 'PIN_INGENUITY',
      cls: 'mineral',
      title: t('pin_drone_title'),
      sub: t('pin_drone_sub'),
      pos: new THREE.Vector3(0, 35, 0),
      onClick: () => startCameraDiveToVisor(true)
    },
    {
      id: hab_base.id,
      cls: 'base',
      title: t('pin_base_title'),
      sub: t('pin_base_sub'),
      pos: new THREE.Vector3(hab_base.x, hab_base.y + 17.0, hab_base.z),
      onClick: () => addWaypointFromMap(hab_base.x, hab_base.z, getFacilityName(hab_base.id, hab_base.name, state.lang))
    },
    ...shelters.map(sh => {
      const shName = getFacilityName(sh.id, sh.name, state.lang);
      return {
        id: sh.id,
        cls: 'shelter',
        title: `◈ ${shName.toUpperCase()}`,
        sub: t('pin_shelter_sub')(sh.shielding_pct),
        pos: new THREE.Vector3(sh.x, sh.y + 11.0, sh.z),
        onClick: () => addWaypointFromMap(sh.x, sh.z, getFacilityName(sh.id, sh.name, state.lang))
      };
    }),
    ...boulders.map(b => {
      const bTxt = getBoulderText(b, state.lang);
      return {
        id: b.id,
        cls: 'mineral',
        title: `⌖ ${bTxt.name.split('(')[0].split('（')[0].trim()}`,
        sub: t('pin_boulder_sub')(b.biosignature_index),
        pos: new THREE.Vector3(b.x, b.y + b.scale * 2.1 + 2.0, b.z),
        onClick: () => {
          if (state.mode === 'visor') {
            state.pinnedBoulder = b;
            renderCrismSpectralCard(b);
          } else {
            selectBoulderInOrbitalUI(b);
          }
        }
      };
    })
  ];

  pinDefs.forEach(def => {
    const el = document.createElement('div');
    el.className = `ar-pin ${def.cls}`;
    el.innerHTML = `
      <div class="ar-pin-card">
        <div class="pin-title">${def.title}</div>
        <div class="pin-sub">${def.sub}</div>
      </div>
      <div class="ar-pin-stem"></div>
    `;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      def.onClick();
    });
    arOverlay.appendChild(el);
    arPinsMap.set(def.id, { el, def });
  });
}

function update2DARProjections() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const halfW = width / 2;
  const halfH = height / 2;

  const turnPin = arPinsMap.get('PIN_NEXT_TURN');
  if (turnPin && state.routeData?.timeline?.length) {
    const idx = Math.min(state.routeData.timeline.length - 1, Math.floor(state.currentStepFloat));
    const stepInfo = state.routeData.timeline[idx];
    const nextWpIdx = stepInfo.next_waypoint?.index || 0;
    const wpObj = state.routeData.waypoints[nextWpIdx] || state.routeData.waypoints[state.routeData.waypoints.length - 1];
    if (wpObj) {
      const wpLabel = translateWaypointLabel(wpObj.label, state.lang);
      turnPin.def.pos.set(wpObj.x, wpObj.y + 9.0, wpObj.z);
      turnPin.el.querySelector('.pin-title').textContent = state.emergencyMode
        ? t('pin_turn_emerg')(wpLabel)
        : t('pin_turn_norm')(wpLabel);
      turnPin.el.querySelector('.pin-sub').textContent =
        t('pin_turn_sub')(stepInfo.next_waypoint.distance_m, idx + 1);
    }
  }

  const anomalyPin = arPinsMap.get('PIN_ANOMALY');
  if (anomalyPin && state.anomalySpot) {
    anomalyPin.def.pos.set(state.anomalySpot.x, state.anomalySpot.y + 13.0, state.anomalySpot.z);
    const aPinTxt = (state.activeAnomaly === 'rockfall' || state.activeAnomaly === 'dust_devil')
      ? getAIAnomalyTriggerContent(state.activeAnomaly, { x: Math.round(state.anomalySpot.x), z: Math.round(state.anomalySpot.z) }, state.lang)
      : null;
    anomalyPin.el.querySelector('.pin-title').textContent = aPinTxt?.pinTitle || state.anomalySpot.title;
    anomalyPin.el.querySelector('.pin-sub').textContent = aPinTxt?.pinSub || state.anomalySpot.sub;
  }

  const naivePin = arPinsMap.get('PIN_NAIVE_HAZARD');
  if (naivePin && state.naiveComparisonData?.worstSpot) {
    const ws = state.naiveComparisonData.worstSpot;
    naivePin.def.pos.set(ws.x, ws.y + 11.0, ws.z);
    naivePin.el.querySelector('.pin-title').textContent =
      t('pin_naive_title')(state.naiveComparisonData.naiveMaxSlope);
    naivePin.el.querySelector('.pin-sub').textContent =
      t('pin_naive_sub')(state.naiveComparisonData.o2SavedPct);
  }

  const dronePin = arPinsMap.get('PIN_INGENUITY');
  if (dronePin && ingenuityDroneGroup) {
    dronePin.def.pos.set(
      ingenuityDroneGroup.position.x,
      ingenuityDroneGroup.position.y + 4.5,
      ingenuityDroneGroup.position.z
    );
  }

  const projVec = new THREE.Vector3();

  for (const [id, { el, def }] of arPinsMap.entries()) {
    if (id === 'PIN_NEXT_TURN' && state.mode === 'orbital') {
      el.style.display = 'none';
      continue;
    }
    if (id === 'PIN_ANOMALY' && !state.anomalySpot) {
      el.style.display = 'none';
      continue;
    }
    if (id === 'PIN_NAIVE_HAZARD' && (!state.showNaiveComparison || state.mode === 'visor')) {
      el.style.display = 'none';
      continue;
    }
    if (id === 'PIN_INGENUITY' && state.mode === 'visor' && state.droneCameraActive) {
      el.style.display = 'none';
      continue;
    }

    const distToCam = camera.position.distanceTo(def.pos);
    if (state.mode === 'visor' && def.cls === 'mineral' && distToCam > 320) {
      el.style.display = 'none';
      continue;
    }

    projVec.copy(def.pos).project(camera);

    if (projVec.z > 1.0 || projVec.x < -0.95 || projVec.x > 0.95 || projVec.y < -0.95 || projVec.y > 0.95) {
      el.style.display = 'none';
      continue;
    }

    const screenX = (projVec.x * halfW) + halfW;
    const screenY = -(projVec.y * halfH) + halfH;

    el.style.display = 'block';
    el.style.left = `${screenX}px`;
    el.style.top = `${screenY}px`;
  }
}

function updateTelemetryAtStep(stepFloat) {
  const timeline = state.routeData?.timeline || [];
  if (!timeline.length) return;

  const idx = Math.max(0, Math.min(timeline.length - 1, Math.floor(stepFloat)));
  const step = timeline[idx];

  if (astronautMarker) {
    astronautMarker.position.set(step.x, step.y, step.z);
    astronautMarker.visible = (state.mode !== 'visor' || state.droneCameraActive);
  }

  const isSuitLeak = state.activeAnomaly === 'suit_leak';
  const isDustDevil = state.activeAnomaly === 'dust_devil';

  const effHeartRate = isSuitLeak ? Math.max(162, step.heart_rate_bpm + 42) : step.heart_rate_bpm;
  const effCoolant = isSuitLeak ? 26.4 : step.coolant_temp_c;
  const effO2Rate = isSuitLeak ? 2.38 : step.o2_rate_lpm;
  const effO2Rem = isSuitLeak ? Math.max(38.0, step.o2_remaining_pct - 12.4) : step.o2_remaining_pct;

  const hrEl = document.getElementById('hud-hr-val');
  hrEl.textContent = Math.round(effHeartRate);
  hrEl.style.color = effHeartRate >= 138 ? '#ff2a5f' : (effHeartRate >= 110 ? '#ff9e00' : '#38ef7d');

  const suitStatusEl = document.getElementById('hud-suit-status');
  if (state.emergencyMode) {
    suitStatusEl.textContent = 'SPE EMERGENCY';
    suitStatusEl.style.color = '#ff2a5f';
  } else if (isSuitLeak) {
    suitStatusEl.textContent = 'LCVG FAULT';
    suitStatusEl.style.color = '#ff2a5f';
  } else if (effHeartRate >= 132 || step.sand_index >= 0.58) {
    suitStatusEl.textContent = 'HIGH LOAD';
    suitStatusEl.style.color = '#ff9e00';
  } else {
    suitStatusEl.textContent = 'NOMINAL';
    suitStatusEl.style.color = '#38ef7d';
  }

  document.getElementById('hud-coolant-val').textContent = `${effCoolant.toFixed(1)} °C`;
  const coolantPct = Math.min(100, Math.max(10, ((effCoolant - 17.5) / 10.0) * 100));
  document.getElementById('bar-coolant').style.width = `${coolantPct}%`;

  document.getElementById('hud-o2-rate-val').textContent = `${effO2Rate.toFixed(2)} ${t('unit_lpm')}`;
  const o2RatePct = Math.min(100, ((effO2Rate - 0.6) / 2.5) * 100);
  document.getElementById('bar-o2-rate').style.width = `${o2RatePct}%`;

  document.getElementById('hud-o2-rem-val').textContent = `${effO2Rem.toFixed(1)}%`;
  document.getElementById('bar-o2-rem').style.width = `${effO2Rem}%`;

  const sign = step.pitch_slope_deg >= 0 ? '+' : '';
  document.getElementById('hud-slope-val').textContent =
    `${sign}${step.pitch_slope_deg.toFixed(1)}° (${t('slope_sub_word')} ${step.terrain_slope_deg.toFixed(1)}°)`;

  const sandPct = Math.round(step.sand_index * 100);
  const sandDesc = sandPct >= 58 ? t('sand_dune') : (sandPct >= 35 ? t('sand_loam') : t('sand_basalt'));
  const sandEl = document.getElementById('hud-sand-val');
  sandEl.textContent = `${sandPct}% (${sandDesc})`;
  sandEl.style.color = sandPct >= 58 ? '#ff9e00' : '#ffffff';

  document.getElementById('hud-metabolic-val').textContent =
    `${Math.round(step.metabolic_watts)} ${t('unit_watt')} • ${step.walk_speed_ms.toFixed(2)} ${t('unit_ms')}`;

  const radEl = document.getElementById('hud-rad-val');
  radEl.textContent = `${step.radiation_usv_h.toFixed(1)} ${t('unit_usvh')}`;
  radEl.style.color = step.radiation_usv_h > 100 ? '#ff2a5f' : '#ffffff';

  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dirStr = dirs[Math.round(step.heading_deg / 45) % 8];
  document.getElementById('hud-heading-text').textContent =
    `${t('hud_heading_prefix')}: ${String(Math.round(step.heading_deg)).padStart(3, '0')}° ${dirStr}`;
  document.getElementById('hud-coords-text').textContent =
    `MOLA: ${step.mola_elevation_m}${t('unit_m')} | X: ${Math.round(step.x)}${t('unit_m')} Z: ${Math.round(step.z)}${t('unit_m')}`;
  document.getElementById('hud-next-wp-text').textContent =
    `${t('hud_next_wp_prefix')}: ${step.next_waypoint.distance_m} ${t('unit_m')}`;

  const losBadge = document.getElementById('hud-los-badge');
  const relayBoost = state.droneRelayActive ? 14.0 : 0.0;
  const vortexPenalty = (isDustDevil && !state.droneRelayActive) ? -28.0 : 0.0;
  const effDbm = (step.comm.signal_dbm + relayBoost + vortexPenalty).toFixed(1);
  const effQual = Math.max(8, Math.min(100, Math.round(step.comm.quality_pct + (state.droneRelayActive ? 15 : 0) + (vortexPenalty * 1.4))));

  if (isDustDevil && !state.droneRelayActive) {
    losBadge.textContent = t('los_vortex');
    losBadge.style.color = '#ff2a5f';
  } else if (step.comm.visible || state.droneRelayActive) {
    losBadge.textContent = state.droneRelayActive && !step.comm.visible ? 'INGENUITY RELAY' : 'LOS DIRECT';
    losBadge.style.color = '#38ef7d';
  } else {
    losBadge.textContent = t('los_shadow')(step.comm.max_obstruction_m);
    losBadge.style.color = '#ff9e00';
  }

  document.getElementById('hud-base-vec').textContent =
    `${Math.round(step.comm.azimuth_deg)}° • ${Math.round(step.comm.distance_m)} ${t('unit_m')}`;
  document.getElementById('hud-comm-dbm').textContent =
    `${effDbm} dBm (${effQual}%)`;

  const droneHudEl = document.getElementById('hud-drone-status');
  if (droneHudEl) {
    droneHudEl.textContent = state.droneRelayActive ? t('drone_relay_on') : t('drone_relay_off');
    droneHudEl.style.color = state.droneRelayActive ? '#57ff9a' : '#93b8cc';
  }

  const maxSlope20 = step.radar_20m.max_slope_20m;
  const rSlopeEl = document.getElementById('hud-radar-slope');
  rSlopeEl.textContent = `${maxSlope20.toFixed(1)}° (${maxSlope20 >= 19 ? t('radar_slope_danger') : t('radar_slope_norm')})`;
  rSlopeEl.style.color = maxSlope20 >= 19 ? '#ff2a5f' : '#38ef7d';

  document.getElementById('visor-timeline-slider').value = stepFloat;
  document.getElementById('hud-step-counter').textContent = t('step_counter')(idx + 1, timeline.length);
  document.getElementById('hud-dist-counter').textContent =
    `${step.distance_from_start_m.toFixed(1)} / ${state.routeData.summary.total_distance_m.toFixed(1)} ${t('unit_m')}`;

  drawCompassTape(step);
  drawOrbitalProfileChart(idx);
  updateAICopilotLiveTelemetry(step, idx, effHeartRate, effO2Rem);
}

function updateAndDrawECG(dt) {
  const timeline = state.routeData?.timeline || [];
  if (!timeline.length) return;
  const idx = Math.min(timeline.length - 1, Math.floor(state.currentStepFloat));
  const bpm = state.activeAnomaly === 'suit_leak'
    ? Math.max(162, timeline[idx].heart_rate_bpm + 42)
    : timeline[idx].heart_rate_bpm;

  const freqHz = bpm / 60.0;
  state.ecgPhase = (state.ecgPhase + dt * freqHz) % 1.0;
  const p = state.ecgPhase;

  let yVal = 0.0;
  if (p > 0.12 && p < 0.20) yVal = 0.18 * Math.sin(((p - 0.12) / 0.08) * Math.PI);
  else if (p >= 0.24 && p < 0.28) yVal = -0.25;
  else if (p >= 0.28 && p < 0.34) yVal = 0.95;
  else if (p >= 0.34 && p < 0.39) yVal = -0.42;
  else if (p >= 0.48 && p < 0.62) yVal = 0.28 * Math.sin(((p - 0.48) / 0.14) * Math.PI);

  state.ecgBuffer.push(yVal);
  if (state.ecgBuffer.length > 75) state.ecgBuffer.shift();

  const canvas = document.getElementById('ecg-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = bpm >= 138 ? '#ff2a5f' : (bpm >= 110 ? '#ff9e00' : '#38ef7d');
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < state.ecgBuffer.length; i++) {
    const x = (i / (state.ecgBuffer.length - 1)) * w;
    const y = h * 0.58 - state.ecgBuffer[i] * (h * 0.44);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawDualTacticalRadar(dt) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas || !state.routeData?.timeline?.length) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const rOuter = cx - 10;
  const rInner20m = rOuter * 0.56;

  ctx.clearRect(0, 0, w, h);

  const idx = Math.min(state.routeData.timeline.length - 1, Math.floor(state.currentStepFloat));
  const step = state.routeData.timeline[idx];
  const headingRad = THREE.MathUtils.degToRad(step.heading_deg);

  const sectors = step.radar_20m?.sectors || [];
  sectors.forEach(sec => {
    const relAngle = THREE.MathUtils.degToRad(sec.angle_deg) - headingRad - Math.PI / 2;
    const span = Math.PI / 4;
    if (sec.hazard !== 'SAFE') {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rInner20m, relAngle - span / 2, relAngle + span / 2);
      ctx.closePath();
      ctx.fillStyle = sec.hazard === 'CRITICAL_SLOPE'
        ? 'rgba(255, 42, 95, 0.42)'
        : 'rgba(255, 158, 0, 0.34)';
      ctx.fill();
    }
  });

  ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
  ctx.lineWidth = 1;
  [rInner20m * 0.5, rInner20m, rOuter].forEach(rad => {
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
  });

  ctx.beginPath();
  ctx.moveTo(cx - rOuter, cy); ctx.lineTo(cx + rOuter, cy);
  ctx.moveTo(cx, cy - rOuter); ctx.lineTo(cx, cy + rOuter);
  ctx.stroke();

  const baseRelRad = THREE.MathUtils.degToRad(step.comm.azimuth_deg) - headingRad - Math.PI / 2;
  const bx = cx + Math.cos(baseRelRad) * (rOuter - 5);
  const by = cy + Math.sin(baseRelRad) * (rOuter - 5);
  ctx.strokeStyle = step.comm.visible ? 'rgba(255, 158, 0, 0.65)' : 'rgba(255, 42, 95, 0.55)';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
  ctx.fillStyle = '#ff9e00';
  ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();

  const shRelRad = THREE.MathUtils.degToRad(step.nearest_shelter.azimuth_deg) - headingRad - Math.PI / 2;
  const sx = cx + Math.cos(shRelRad) * (rOuter - 14);
  const sy = cy + Math.sin(shRelRad) * (rOuter - 14);
  ctx.fillStyle = '#38ef7d';
  ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2); ctx.fill();

  state.radarSweepAngle = (state.radarSweepAngle + dt * 2.4) % (Math.PI * 2);
  const grad = ctx.createConicGradient(state.radarSweepAngle, cx, cy);
  grad.addColorStop(0, 'rgba(0, 245, 212, 0.38)');
  grad.addColorStop(0.18, 'rgba(0, 245, 212, 0.0)');
  grad.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, Math.PI * 2); ctx.fill();
}

function drawCompassTape(step) {
  const canvas = document.getElementById('compass-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const heading = (step.heading_deg + THREE.MathUtils.radToDeg(state.lookYawOffset) + 360) % 360;
  const pxPerDeg = w / 120;

  ctx.strokeStyle = 'rgba(0, 245, 212, 0.5)';
  ctx.font = '10px Consolas, monospace';
  ctx.textAlign = 'center';
  const cardinals = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW', 360: 'N' };

  for (let deg = -60; deg <= 60; deg += 5) {
    const worldDeg = Math.round((heading + deg + 360) % 360);
    const snapped = Math.round(worldDeg / 5) * 5;
    const diff = ((snapped - heading + 540) % 360) - 180;
    const x = w / 2 + diff * pxPerDeg;

    if (snapped % 15 === 0) {
      ctx.beginPath(); ctx.moveTo(x, h - 10); ctx.lineTo(x, h); ctx.stroke();
      const label = cardinals[snapped % 360] || String(snapped % 360);
      ctx.fillStyle = cardinals[snapped % 360] ? '#00f5d4' : '#9bb5cc';
      ctx.fillText(label, x, 11);
    } else {
      ctx.beginPath(); ctx.moveTo(x, h - 5); ctx.lineTo(x, h); ctx.stroke();
    }
  }
}

const activeTypeTimers = new WeakMap();

function typeText(element, text, speed = 18) {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }
    const prevTimer = activeTypeTimers.get(element);
    if (prevTimer) {
      clearInterval(prevTimer);
      activeTypeTimers.delete(element);
    }

    element.textContent = '';
    element.classList.add('typing');

    let index = 0;
    const timer = setInterval(() => {
      element.textContent += text[index] || '';
      index++;
      if (index >= text.length) {
        clearInterval(timer);
        activeTypeTimers.delete(element);
        element.classList.remove('typing');
        resolve();
      }
    }, speed);

    activeTypeTimers.set(element, timer);
  });
}

function setTypedElementInstant(element, text) {
  if (!element) return;
  const prevTimer = activeTypeTimers.get(element);
  if (prevTimer) {
    clearInterval(prevTimer);
    activeTypeTimers.delete(element);
  }
  element.classList.remove('typing');
  element.textContent = text;
}

let toastHideTimer = null;
function showToast(text) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('visible');
  if (toastHideTimer) clearTimeout(toastHideTimer);
  toastHideTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3400);
}

async function openHoloWindow(windowId, titleElId, titleText, descElId, descText) {
  const win = document.getElementById(windowId);
  if (!win) return;

  if (windowId === 'holo-left-planner') {
    document.getElementById('btn-restore-left')?.classList.add('hidden');
  } else if (windowId === 'holo-right-analytics') {
    document.getElementById('btn-restore-right')?.classList.add('hidden');
  }

  win.classList.remove('visible');
  void win.offsetWidth;
  win.classList.add('visible');

  if (windowId === 'holo-right-analytics') {
    drawOrbitalProfileChart(Math.floor(state.currentStepFloat));
  }

  const titleEl = titleElId ? document.getElementById(titleElId) : null;
  const descEl = descElId ? document.getElementById(descElId) : null;

  if (descEl && descText) descEl.textContent = '';
  if (titleEl && titleText) {
    await typeText(titleEl, titleText, 16);
  }
  if (descEl && descText) {
    await typeText(descEl, descText, 10);
  }
}

function collapseHoloWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;
  win.classList.remove('visible');

  if (windowId === 'holo-left-planner') {
    document.getElementById('btn-restore-left')?.classList.remove('hidden');
  } else if (windowId === 'holo-right-analytics') {
    document.getElementById('btn-restore-right')?.classList.remove('hidden');
  }
}

const LAYER_DESCRIPTIONS = {
  get truecolor() { return t('layer_hints').truecolor; },
  get slope() { return t('layer_hints').slope; },
  get sand() { return t('layer_hints').sand; },
  get minerals() { return t('layer_hints').minerals; },
  get comm() { return t('layer_hints').comm; }
};

async function toggleEmergencyScenario() {
  const btn = document.getElementById('btn-emergency-toggle');
  const btnSpan = btn?.querySelector('span');

  if (!state.emergencyMode) {
    state.emergencyMode = true;
    state.lastAITopic = null;
    state.lastAIQuery = '';
    document.body.classList.add('emergency-active');
    btn.classList.add('active');
    if (btnSpan) btnSpan.textContent = t('btn_emergency_active');

    scene.background.setHex(0x280606);
    scene.fog.color.setHex(0x52100c);
    scene.fog.density = state.mode === 'visor' ? 0.0075 : 0.00095;
    if (stormPoints) stormPoints.material.opacity = 0.82;

    const timeline = state.routeData?.timeline || [];
    const currIdx = Math.min(timeline.length - 1, Math.floor(state.currentStepFloat));
    const currPt = timeline[currIdx] || { x: -180, z: 90, o2_remaining_pct: 88.0 };

    const resp = await fetch('/api/emergency-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_x: currPt.x,
        current_z: currPt.z,
        current_o2_pct: currPt.o2_remaining_pct || 88.0
      })
    });
    const emergData = await resp.json();

    state.emergShelterMeta = emergData.selected_shelter;
    state.routeData = emergData.evacuation_route;
    state.waypoints = state.routeData.waypoints.map(w => ({ x: w.x, z: w.z, label: w.label }));
    state.currentStepFloat = 0.0;

    const shName = getFacilityName(emergData.selected_shelter.id, emergData.selected_shelter.name, state.lang);
    document.getElementById('emergency-shelter-target').textContent =
      t('emerg_banner_sub_active')(shName, state.routeData.summary.total_distance_m);

    showToast(t('toast_emerg_route')(shName));

    buildRouteVisuals();
    updateOrbitalDashboard();
    updateTelemetryAtStep(0);

    const msg = getAIAnomalyTriggerContent('radiation_storm', {
      shelterName: shName,
      dist: state.routeData.summary.total_distance_m,
      shielding: emergData.selected_shelter.shielding_pct
    }, state.lang);

    deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: true,
      showResolveBtn: true,
      resolveLabel: msg.resolveLabel
    });
  } else {
    state.emergencyMode = false;
    state.activeAnomaly = null;
    state.anomalySpot = null;
    state.emergShelterMeta = null;
    state.lastAITopic = null;
    state.lastAIQuery = '';
    clearAnomaly3DVisuals();
    document.body.classList.remove('emergency-active');
    btn.classList.remove('active');
    if (btnSpan) btnSpan.textContent = t('btn_emergency_normal');

    scene.background.setHex(0x080306);
    scene.fog.color.setHex(0x1c0807);
    scene.fog.density = state.mode === 'visor' ? 0.0014 : 0.00042;
    if (stormPoints) stormPoints.material.opacity = 0.0;

    const presetIdx = parseInt(document.getElementById('preset-selector').value || '0', 10);
    const preset = state.mapData.mission_presets[presetIdx] || state.mapData.mission_presets[0];
    state.waypoints = preset.waypoints.map(w => ({ ...w }));
    await recalculateRouteViaAPI();

    const msg = getAIAnomalyResolvedContent('radiation_storm', {}, state.lang);
    deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: false,
      showResolveBtn: false
    });
  }
}

function openAICopilotWindow() {
  const win = document.getElementById('holo-ai-copilot');
  const mini = document.getElementById('ai-mini-dock');
  if (!win) return;
  state.aiWindowOpen = true;
  mini?.classList.add('hidden');
  document.getElementById('btn-top-ai')?.classList.add('active');

  if (!win.classList.contains('visible')) {
    win.classList.remove('visible');
    void win.offsetWidth;
    win.classList.add('visible');
  }
}

function closeAICopilotWindow() {
  const win = document.getElementById('holo-ai-copilot');
  const mini = document.getElementById('ai-mini-dock');
  if (!win) return;
  state.aiWindowOpen = false;
  win.classList.remove('visible');
  mini?.classList.remove('hidden');
  document.getElementById('btn-top-ai')?.classList.remove('active');
}

async function deliverAIMessage({
  category = t('ai_init_cat'),
  title = t('ai_init_title'),
  text = '',
  isAlert = false,
  showResolveBtn = false,
  resolveLabel = '',
  instant = false
}) {
  const win = document.getElementById('holo-ai-copilot');
  const mini = document.getElementById('ai-mini-dock');
  const catEl = document.getElementById('ai-response-category');
  const titleEl = document.getElementById('ai-response-title');
  const textEl = document.getElementById('ai-response-text');
  const badgeEl = document.getElementById('ai-core-badge');
  const resolveBar = document.getElementById('ai-auto-resolve-bar');
  const resolveBtn = document.getElementById('btn-ai-execute-fix');
  const miniTicker = document.getElementById('ai-mini-ticker');

  state.aiHasCustomMessage = true;
  win?.classList.toggle('anomaly-alert', isAlert);
  mini?.classList.toggle('anomaly-alert', isAlert);

  if (badgeEl) {
    badgeEl.textContent = isAlert ? t('ai_badge_alert') : t('ai_badge_nominal');
  }
  if (catEl) catEl.textContent = category;

  if (resolveBar && resolveBtn) {
    resolveBar.classList.toggle('hidden', !showResolveBtn);
    if (resolveLabel) {
      resolveBtn.textContent = resolveLabel;
    } else if (showResolveBtn && (state.activeAnomaly || state.emergencyMode)) {
      const aType = state.emergencyMode ? 'radiation_storm' : state.activeAnomaly;
      const shName = state.emergShelterMeta
        ? getFacilityName(state.emergShelterMeta.id, state.emergShelterMeta.name, state.lang)
        : '';
      const info = getAIAnomalyTriggerContent(aType, {
        shelterName: shName,
        dist: state.routeData?.summary?.total_distance_m || 0,
        shielding: state.emergShelterMeta?.shielding_pct || 96
      }, state.lang);
      if (info?.resolveLabel) resolveBtn.textContent = info.resolveLabel;
    }
  }

  if (miniTicker) {
    miniTicker.textContent = `${title}: ${text}`;
  }

  if (instant) {
    state.aiSpeaking = false;
    setTypedElementInstant(titleEl, title);
    setTypedElementInstant(textEl, text);
    return;
  }

  state.aiSpeaking = true;
  if (textEl) textEl.textContent = '';
  if (titleEl) await typeText(titleEl, title, 14);
  if (textEl) await typeText(textEl, text, 9);
  state.aiSpeaking = false;
}

function clearAnomaly3DVisuals() {
  while (anomaly3DGroup.children.length > 0) {
    const obj = anomaly3DGroup.children.pop();
    if (obj.geometry) obj.geometry.dispose();
  }
  dustDevilVortex = null;
}

function buildRockfall3DAt(x, y, z) {
  clearAnomaly3DVisuals();
  const group = new THREE.Group();
  group.position.set(x, y, z);

  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const dist = (i % 2 === 0) ? 1.8 : 4.2;
    const rSize = 2.2 + (i % 3) * 1.1;
    const rockGeom = new THREE.DodecahedronGeometry(rSize, 0);
    const rockMesh = new THREE.Mesh(
      rockGeom,
      new THREE.MeshStandardMaterial({
        color: 0x3a140c,
        emissive: 0xff3b2f,
        emissiveIntensity: 0.55,
        roughness: 0.7
      })
    );
    rockMesh.position.set(Math.cos(ang) * dist, rSize * 0.55, Math.sin(ang) * dist);
    rockMesh.rotation.set(i * 0.7, i * 1.1, 0);
    group.add(rockMesh);
  }

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(8.5, 10.6, 32),
    new THREE.MeshBasicMaterial({ color: 0xff4d57, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.5;
  group.add(ring);

  anomaly3DGroup.add(group);
}

function buildDustDevil3DAt(x, y, z) {
  clearAnomaly3DVisuals();
  const vortex = new THREE.Group();
  vortex.position.set(x, y, z);

  const coneGeom = new THREE.CylinderGeometry(18.0, 3.2, 65.0, 20, 8, true);
  coneGeom.translate(0, 32.5, 0);
  const coneMesh = new THREE.Mesh(
    coneGeom,
    new THREE.MeshBasicMaterial({
      color: 0xff7b3a,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    })
  );
  vortex.add(coneMesh);

  const pCount = 260;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const h = Math.random() * 64.0;
    const rad = 2.5 + (h / 64.0) * 16.5 + (Math.random() - 0.5) * 2.5;
    const a = Math.random() * Math.PI * 2;
    pPos[i * 3] = Math.cos(a) * rad;
    pPos[i * 3 + 1] = h;
    pPos[i * 3 + 2] = Math.sin(a) * rad;
  }
  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pPoints = new THREE.Points(
    pGeom,
    new THREE.PointsMaterial({
      color: 0xffb84a,
      size: 2.4,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    })
  );
  vortex.add(pPoints);

  dustDevilVortex = vortex;
  anomaly3DGroup.add(vortex);
}

async function triggerUnexpectedAnomaly(anomalyType = null) {
  const types = ['rockfall', 'suit_leak', 'dust_devil', 'radiation_storm'];
  const chosen = anomalyType || types[Math.floor(Math.random() * types.length)];

  document.querySelectorAll('.ai-anomaly-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-anomaly') === chosen);
  });

  openAICopilotWindow();
  state.lastAITopic = null;
  state.lastAIQuery = '';

  const timeline = state.routeData?.timeline || [];
  const currIdx = Math.min(Math.max(0, timeline.length - 1), Math.floor(state.currentStepFloat));
  const aheadIdx = Math.min(Math.max(0, timeline.length - 1), currIdx + 8);
  const aheadPt = timeline[aheadIdx] || { x: -120, y: 12, z: 60 };

  if (chosen === 'rockfall') {
    state.activeAnomaly = 'rockfall';
    const msg = getAIAnomalyTriggerContent('rockfall', { x: Math.round(aheadPt.x), z: Math.round(aheadPt.z) }, state.lang);
    state.anomalySpot = {
      x: aheadPt.x,
      y: aheadPt.y,
      z: aheadPt.z,
      title: msg.pinTitle,
      sub: msg.pinSub
    };
    buildRockfall3DAt(aheadPt.x, aheadPt.y, aheadPt.z);
    updateTelemetryAtStep(state.currentStepFloat);

    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: true,
      showResolveBtn: true,
      resolveLabel: msg.resolveLabel
    });
  } else if (chosen === 'suit_leak') {
    state.activeAnomaly = 'suit_leak';
    state.anomalySpot = null;
    clearAnomaly3DVisuals();
    updateTelemetryAtStep(state.currentStepFloat);

    const msg = getAIAnomalyTriggerContent('suit_leak', {}, state.lang);
    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: true,
      showResolveBtn: true,
      resolveLabel: msg.resolveLabel
    });
  } else if (chosen === 'dust_devil') {
    state.activeAnomaly = 'dust_devil';
    state.droneRelayActive = false;
    const relayBtn = document.getElementById('btn-toggle-drone-relay');
    if (relayBtn) {
      relayBtn.classList.remove('active');
      relayBtn.textContent = t('btn_off');
    }
    const droneStatusEl = document.getElementById('drone-status-text');
    if (droneStatusEl) droneStatusEl.textContent = t('drone_status_off');

    const msg = getAIAnomalyTriggerContent('dust_devil', {}, state.lang);
    state.anomalySpot = {
      x: aheadPt.x + 14,
      y: aheadPt.y,
      z: aheadPt.z - 10,
      title: msg.pinTitle,
      sub: msg.pinSub
    };
    buildDustDevil3DAt(aheadPt.x + 14, aheadPt.y, aheadPt.z - 10);
    updateTelemetryAtStep(state.currentStepFloat);

    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: true,
      showResolveBtn: true,
      resolveLabel: msg.resolveLabel
    });
  } else if (chosen === 'radiation_storm') {
    state.activeAnomaly = 'radiation_storm';
    if (!state.emergencyMode) {
      await toggleEmergencyScenario();
    } else {
      const shName = state.emergShelterMeta
        ? getFacilityName(state.emergShelterMeta.id, state.emergShelterMeta.name, state.lang)
        : getFacilityName('SHELTER_1', 'Укрытие «Гефест»', state.lang);
      const msg = getAIAnomalyTriggerContent('radiation_storm', {
        shelterName: shName,
        dist: state.routeData?.summary?.total_distance_m || 140,
        shielding: state.emergShelterMeta?.shielding_pct || 96
      }, state.lang);
      await deliverAIMessage({
        category: msg.category,
        title: msg.title,
        text: msg.text,
        isAlert: true,
        showResolveBtn: true,
        resolveLabel: msg.resolveLabel
      });
    }
  }
}

async function resolveActiveAnomalyWithAI() {
  const current = state.activeAnomaly;
  state.lastAITopic = null;
  state.lastAIQuery = '';
  document.querySelectorAll('.ai-anomaly-btn').forEach(btn => btn.classList.remove('active'));

  if (current === 'rockfall' && state.anomalySpot) {
    const bypassX = Math.max(-390, Math.min(390, Math.round(state.anomalySpot.x - 42)));
    const bypassZ = Math.max(-390, Math.min(390, Math.round(state.anomalySpot.z + 36)));
    state.activeAnomaly = null;
    state.anomalySpot = null;
    clearAnomaly3DVisuals();

    const midIdx = Math.max(1, Math.min(state.waypoints.length - 1, Math.floor(state.waypoints.length / 2)));
    state.waypoints.splice(midIdx, 0, { x: bypassX, z: bypassZ, label: translateWaypointLabel('Обход обвала (ИИ)', state.lang) });
    await recalculateRouteViaAPI();

    const msg = getAIAnomalyResolvedContent('rockfall', {
      bypassX,
      bypassZ,
      maxSlope: state.routeData.summary.max_slope_deg,
      finalO2: state.routeData.summary.final_o2_remaining_pct
    }, state.lang);

    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: false,
      showResolveBtn: false
    });
  } else if (current === 'suit_leak') {
    state.activeAnomaly = null;
    updateTelemetryAtStep(state.currentStepFloat);

    const msg = getAIAnomalyResolvedContent('suit_leak', {}, state.lang);
    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: false,
      showResolveBtn: false
    });
  } else if (current === 'dust_devil') {
    state.activeAnomaly = null;
    state.anomalySpot = null;
    clearAnomaly3DVisuals();
    state.droneRelayActive = true;
    const relayBtn = document.getElementById('btn-toggle-drone-relay');
    if (relayBtn) {
      relayBtn.classList.add('active');
      relayBtn.textContent = t('btn_on');
    }
    const droneStatusEl = document.getElementById('drone-status-text');
    if (droneStatusEl) droneStatusEl.textContent = t('drone_status_on');
    if (droneScanCone) droneScanCone.visible = true;
    toggleHelmetFlashlight(true);
    updateTelemetryAtStep(state.currentStepFloat);

    const msg = getAIAnomalyResolvedContent('dust_devil', {}, state.lang);
    await deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: false,
      showResolveBtn: false
    });
  } else if (state.emergencyMode || current === 'radiation_storm') {
    await toggleEmergencyScenario();
  } else {
    state.activeAnomaly = null;
    state.anomalySpot = null;
    clearAnomaly3DVisuals();
    updateTelemetryAtStep(state.currentStepFloat);
  }
}

function updateAICopilotLiveTelemetry(step, idx, effHeartRate, effO2Rem) {
  const chipVitals = document.getElementById('ai-chip-vitals');
  const chipO2 = document.getElementById('ai-chip-o2');
  const chipHazard = document.getElementById('ai-chip-hazard');

  if (chipVitals) {
    chipVitals.textContent = t('ai_chip_hr')(Math.round(effHeartRate));
    chipVitals.style.color = effHeartRate >= 135 ? '#ff4d57' : '#64f9ff';
  }
  if (chipO2) {
    chipO2.textContent = `O₂: ${effO2Rem.toFixed(1)}%`;
    chipO2.style.color = effO2Rem < 55 ? '#ff4d57' : '#57ff9a';
  }
  if (chipHazard) {
    if (state.activeAnomaly || state.emergencyMode) {
      chipHazard.textContent = t('ai_chip_status_alert');
      chipHazard.style.color = '#ff4d57';
    } else if (step.terrain_slope_deg >= 14.5 || step.sand_index >= 0.48) {
      chipHazard.textContent = t('ai_chip_status_warn')(step.terrain_slope_deg.toFixed(1), Math.round(step.sand_index * 100));
      chipHazard.style.color = '#ffb84a';
    } else {
      chipHazard.textContent = t('ai_chip_status_nom');
      chipHazard.style.color = '#57ff9a';
    }
  }

  if (state.mode !== 'visor' || !state.visorPlaying || state.activeAnomaly || state.emergencyMode) return;
  const now = performance.now();
  if (now - state.lastAutoCalloutTime < 9500) return;

  const miniTicker = document.getElementById('ai-mini-ticker');
  if (step.sand_index >= 0.52 && state.lastAutoCalloutKey !== 'sand') {
    state.lastAutoCalloutKey = 'sand';
    state.lastAutoCalloutTime = now;
    if (miniTicker) {
      miniTicker.textContent = getAIAutoCalloutMessage('sand', {
        sandPct: Math.round(step.sand_index * 100),
        hr: Math.round(effHeartRate)
      }, state.lang);
    }
  } else if (step.terrain_slope_deg >= 14.5 && state.lastAutoCalloutKey !== 'slope') {
    state.lastAutoCalloutKey = 'slope';
    state.lastAutoCalloutTime = now;
    if (miniTicker) {
      miniTicker.textContent = getAIAutoCalloutMessage('slope', {
        slope: step.terrain_slope_deg.toFixed(1),
        watts: Math.round(step.metabolic_watts)
      }, state.lang);
    }
  } else if (!step.comm.visible && state.lastAutoCalloutKey !== 'comm') {
    state.lastAutoCalloutKey = 'comm';
    state.lastAutoCalloutTime = now;
    if (miniTicker) {
      miniTicker.textContent = getAIAutoCalloutMessage('comm', {
        obs: step.comm.max_obstruction_m,
        relay: state.droneRelayActive
      }, state.lang);
    }
  }
}

async function answerAstronautQuestion(rawQuery, forcedTopic = null, { instant = false, keepClosed = false } = {}) {
  const q = (rawQuery || '').trim();
  if (!q && !forcedTopic) return;

  if (!keepClosed) openAICopilotWindow();

  const timeline = state.routeData?.timeline || [];
  const idx = Math.min(Math.max(0, timeline.length - 1), Math.floor(state.currentStepFloat));
  const step = timeline[idx] || {};
  const sum = state.routeData?.summary || {};
  const cmp = state.naiveComparisonData || computeNaiveDirectComparison();
  const boulders = state.mapData?.infrastructure?.boulders || [];

  const nearestBoulder = [...boulders].sort((a, b) =>
    Math.hypot(a.x - (step.x || 0), a.z - (step.z || 0)) - Math.hypot(b.x - (step.x || 0), b.z - (step.z || 0))
  )[0] || boulders[0];
  const distToRock = nearestBoulder
    ? Math.round(Math.hypot(nearestBoulder.x - (step.x || 0), nearestBoulder.z - (step.z || 0)))
    : 0;

  const lookAheadSteps = timeline.slice(idx + 1, idx + 19);
  const maxAheadSlope = lookAheadSteps.length
    ? Math.max(...lookAheadSteps.map(s => s.terrain_slope_deg))
    : (step.terrain_slope_deg || 0);
  const maxAheadSand = lookAheadSteps.length
    ? Math.max(...lookAheadSteps.map(s => s.sand_index))
    : (step.sand_index || 0);
  const remDist = Math.max(0, (sum.total_distance_m || 0) - (step.distance_from_start_m || 0));
  const o2MinutesLeft = Math.round(((step.o2_remaining_pct || 90) / 100) * 420 / Math.max(0.75, step.o2_rate_lpm || 0.95));

  const sh = step.nearest_shelter || { id: 'SHELTER_1', name: 'Укрытие «Гефест»', distance_m: 140, azimuth_deg: 110 };
  const shelterName = getFacilityName(sh.id, sh.name, state.lang);
  const boulderText = nearestBoulder
    ? getBoulderText(nearestBoulder, state.lang)
    : { name: 'Cheyava Falls', mineral_class: 'SiO₂', description: '' };

  let topic = forcedTopic;
  if (!topic) {
    const ql = q.toLowerCase();
    if (/кислород|o2|воздух|дыш|баллон|пульс|скафандр|статус|отчёт|отчет|oxygen|suit|status|heart|hr|breath|plss|酸素|宇宙服|心拍|バイタル|生命維持/i.test(ql)) {
      topic = 'suit';
    } else if (/впереди|курс|ждёт|ждет|маршрут|идти|осталось|склон|песок|ahead|forward|terrain|slope|sand|route|distance|前方|ルート|地形|傾斜|砂/i.test(ql)) {
      topic = 'ahead';
    } else if (/минерал|камн|валун|crism|биосигнатур|жизн|пород|вода|mineral|rock|boulder|biosig|silica|opal|鉱物|岩|バイオ|生命兆候|オパール/i.test(ql)) {
      topic = 'minerals';
    } else if (/напрямик|прям|выгод|почему|сравн|a\*|sextant|direct|compare|naive|cliff|save|優位|比較|直線|断崖|節約/i.test(ql)) {
      topic = 'compare';
    } else if (/укрыт|радиац|буря|шторм|спас|чп|опасн|shelter|radiation|storm|flare|safe|evacu|emerg|シェルター|避難|放射|太陽フレア|緊急/i.test(ql)) {
      topic = 'shelter';
    } else if (/дрон|вертол|ingenuity|связ|сигнал|баз|олимп|drone|heli|comm|uhf|signal|base|olympus|relay|ドローン|通信|基地|オリンポス|中継/i.test(ql)) {
      topic = 'comm';
    } else if (/погод|температур|марс|езеро|давлен|гравитац|среда|weather|temp|mars|jezero|pressure|grav|meteo|気象|気温|火星|ジェゼロ|気圧|重力/i.test(ql)) {
      topic = 'weather';
    } else {
      topic = 'general';
    }
  }

  if (topic === 'minerals' && nearestBoulder) {
    selectBoulderInOrbitalUI(nearestBoulder);
  } else if (topic === 'compare' && !state.showNaiveComparison) {
    toggleNaiveComparison(true);
  }

  const res = buildAIResponseForTopic(topic, q, {
    idx,
    totalSteps: timeline.length,
    step,
    sum,
    cmp,
    boulderText,
    nearestBoulder: nearestBoulder || { biosignature_index: 96, formula: 'SiO₂·nH₂O', crism_bands_um: [1.91, 2.21] },
    distToRock,
    maxAheadSlope,
    maxAheadSand,
    remDist,
    o2MinutesLeft,
    shelterName,
    shelterDist: Math.round(sh.distance_m || 140),
    shelterAz: Math.round(sh.azimuth_deg || 110),
    droneRelayActive: state.droneRelayActive
  }, state.lang);

  state.lastAITopic = topic;
  state.lastAIQuery = q;

  await deliverAIMessage({
    category: res.category,
    title: res.title,
    text: res.answer,
    isAlert: Boolean(state.activeAnomaly || state.emergencyMode),
    showResolveBtn: Boolean(state.activeAnomaly || state.emergencyMode),
    instant
  });
}

function drawAIWaveform(now, dt) {
  const canvas = document.getElementById('ai-wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const isAlert = Boolean(state.activeAnomaly || state.emergencyMode);
  const activeVoice = state.aiSpeaking || document.getElementById('ai-response-text')?.classList.contains('typing');
  state.aiWavePhase += dt * (activeVoice ? 14.0 : (isAlert ? 9.5 : 4.2));

  const mainColor = isAlert ? '#ff4d57' : (activeVoice ? '#57ff9a' : '#64f9ff');
  const ampBase = activeVoice ? h * 0.38 : (isAlert ? h * 0.30 : h * 0.14);

  for (let layer = 0; layer < 2; layer++) {
    ctx.beginPath();
    ctx.strokeStyle = layer === 0 ? mainColor : 'rgba(100, 249, 255, 0.32)';
    ctx.lineWidth = layer === 0 ? 1.8 : 1.0;

    for (let x = 0; x < w; x += 3) {
      const u = x / w;
      const env = Math.sin(u * Math.PI);
      const y = h / 2 + env * ampBase * (
        Math.sin(u * 18.0 + state.aiWavePhase + layer * 1.3) * 0.65 +
        Math.cos(u * 33.0 - state.aiWavePhase * 1.4) * 0.35
      );
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

async function recalculateRouteViaAPI() {
  if (state.waypoints.length < 2) return;
  const resp = await fetch('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      waypoints: state.waypoints,
      weights: state.weights,
      emergency_mode: state.emergencyMode,
      initial_o2_pct: 98.0
    })
  });
  state.routeData = await resp.json();
  state.currentStepFloat = 0.0;
  buildRouteVisuals();
  updateOrbitalDashboard();
  updateTelemetryAtStep(0);
}

function updateOrbitalDashboard(instant = false) {
  const sum = state.routeData?.summary;
  if (!sum) return;

  document.getElementById('route-mode-tag').textContent =
    state.emergencyMode ? t('route_tag_emerg') : t('route_tag_normal');
  document.getElementById('kpi-dist').textContent = `${sum.total_distance_m} ${t('unit_m')}`;
  document.getElementById('kpi-time').textContent = `${sum.estimated_duration_min} ${t('unit_min')}`;
  document.getElementById('kpi-climb').textContent = `+${sum.total_climb_m} ${t('unit_m')}`;
  document.getElementById('kpi-max-hr').textContent = `${sum.max_heart_rate_bpm} BPM`;
  document.getElementById('kpi-o2').textContent = `${sum.final_o2_remaining_pct}%`;
  document.getElementById('kpi-comm').textContent = `${sum.comm_los_coverage_pct}% LOS`;

  const cmp = state.naiveComparisonData || computeNaiveDirectComparison();
  if (cmp) {
    const elNaiveO2 = document.getElementById('cmp-naive-o2');
    const elSmartO2 = document.getElementById('cmp-smart-o2');
    const elNaiveCliffs = document.getElementById('cmp-naive-cliffs');
    const elSmartCliffs = document.getElementById('cmp-smart-cliffs');
    const elNaiveHr = document.getElementById('cmp-naive-hr');
    const elSmartHr = document.getElementById('cmp-smart-hr');
    const elVerdict = document.getElementById('compare-verdict-text');

    if (elNaiveO2) elNaiveO2.textContent = `${cmp.naiveFinalO2}%`;
    if (elSmartO2) elSmartO2.textContent = `${cmp.smartFinalO2}% (+${cmp.o2SavedPct}%)`;
    if (elNaiveCliffs) elNaiveCliffs.textContent = t('cmp_cliffs_count')(cmp.naiveCliffs);
    if (elSmartCliffs) elSmartCliffs.textContent = t('cmp_cliffs_bypassed')(cmp.smartCliffs);
    if (elNaiveHr) elNaiveHr.textContent = `${cmp.naiveMaxSlope}° / ${cmp.naiveMaxHR} BPM`;
    if (elSmartHr) elSmartHr.textContent = `${cmp.smartMaxSlope}° / ${cmp.smartMaxHR} BPM`;

    if (elVerdict) {
      const verdictTxt = t('cmp_verdict')(cmp.o2SavedPct, cmp.naiveCliffs, cmp.naiveMaxSlope);
      if (instant) {
        setTypedElementInstant(elVerdict, verdictTxt);
      } else {
        typeText(elVerdict, verdictTxt, 10);
      }
    }
  }

  const wpListEl = document.getElementById('waypoints-list');
  document.getElementById('wp-count-tag').textContent = `${state.waypoints.length}`;
  wpListEl.innerHTML = state.waypoints.map((wp, idx) => `
    <div class="wp-item">
      <span>${idx + 1}. ${translateWaypointLabel(wp.label, state.lang)} (${Math.round(wp.x)}, ${Math.round(wp.z)})</span>
      ${state.waypoints.length > 2 ? `<button class="wp-remove" data-idx="${idx}" title="${t('wp_delete_title')}">✕</button>` : ''}
    </div>
  `).join('');

  wpListEl.querySelectorAll('.wp-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const rmIdx = parseInt(btn.getAttribute('data-idx'), 10);
      state.waypoints.splice(rmIdx, 1);
      recalculateRouteViaAPI();
    });
  });

  const warnListEl = document.getElementById('orbital-warnings-list');
  const warnings = state.routeData.warnings || [];
  document.getElementById('warn-count-tag').textContent = `${warnings.length}`;
  if (warnings.length === 0) {
    warnListEl.innerHTML = `<div class="warn-item" style="border-left-color:#57ff9a; color:#b7f7d0;">${t('warn_safe')}</div>`;
  } else {
    warnListEl.innerHTML = warnings.map(w => `
      <div class="warn-item ${w.severity}" data-step="${w.step}">▲ ${formatWarningMessage(w, state.routeData.timeline, state.lang)}</div>
    `).join('');

    warnListEl.querySelectorAll('.warn-item').forEach(item => {
      item.addEventListener('click', () => {
        const st = parseInt(item.getAttribute('data-step'), 10);
        state.currentStepFloat = st;
        updateTelemetryAtStep(st);
      });
    });
  }

  drawOrbitalProfileChart(Math.floor(state.currentStepFloat));
}

function drawOrbitalProfileChart(activeStepIdx = 0) {
  const canvas = document.getElementById('orbital-profile-canvas');
  if (!canvas || !state.routeData?.timeline?.length) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const tl = state.routeData.timeline;
  const n = tl.length;

  let minY = 999, maxY = -999;
  tl.forEach(s => {
    if (s.y < minY) minY = s.y;
    if (s.y > maxY) maxY = s.y;
  });

  ctx.beginPath();
  ctx.moveTo(0, h);
  tl.forEach((s, i) => {
    const x = (i / Math.max(1, n - 1)) * w;
    const yNorm = (s.y - minY) / (maxY - minY + 2.0);
    const py = h - 14 - yNorm * (h - 28);
    ctx.lineTo(x, py);
  });
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 110, 40, 0.22)';
  ctx.fill();

  ctx.strokeStyle = '#ff9e00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  tl.forEach((s, i) => {
    const x = (i / Math.max(1, n - 1)) * w;
    const yNorm = (s.y - minY) / (maxY - minY + 2.0);
    const py = h - 14 - yNorm * (h - 28);
    if (i === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  });
  ctx.stroke();

  if (state.showNaiveComparison && state.naiveComparisonData?.naiveSamples?.length) {
    const ns = state.naiveComparisonData.naiveSamples;
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#ff4d57';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ns.forEach((s, i) => {
      const x = (i / Math.max(1, ns.length - 1)) * w;
      const hrNorm = (s.hr - 65) / 115;
      const py = h - 14 - Math.max(0, Math.min(1, hrNorm)) * (h - 28);
      if (i === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = '#64f9ff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  tl.forEach((s, i) => {
    const x = (i / Math.max(1, n - 1)) * w;
    const hrNorm = (s.heart_rate_bpm - 65) / 115;
    const py = h - 14 - Math.max(0, Math.min(1, hrNorm)) * (h - 28);
    if (i === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  });
  ctx.stroke();

  const curX = (activeStepIdx / Math.max(1, n - 1)) * w;
  ctx.strokeStyle = '#57ff9a';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(curX, 0); ctx.lineTo(curX, h); ctx.stroke();
}

function selectBoulderInOrbitalUI(boulder, instant = false) {
  state.selectedOrbitalBoulder = boulder;
  const sel = document.getElementById('orbital-boulder-select');
  if (sel) sel.value = boulder.id;
  const bTxt = getBoulderText(boulder, state.lang);
  const box = document.getElementById('orbital-boulder-summary');
  if (box) {
    box.innerHTML = `
      <div id="boulder-summary-title" class="typed-title" style="color:#64f9ff; font-size:13.5px; margin-bottom:2px;"></div>
      <div style="color:#57ff9a; font-family:var(--mono); font-size:11px; margin-bottom:4px;">
        ${bTxt.mineral_class} • ${boulder.formula}
      </div>
      <div style="font-size:11.5px; margin-bottom:4px;">◈ <strong>${t('boulder_biosig_label')}: ${boulder.biosignature_index}%</strong> | CRISM: ${boulder.crism_bands_um.join(', ')} ${t('boulder_um')}</div>
      <div id="boulder-summary-desc" class="typed-copy" style="margin-bottom:0; min-height:2.4em; font-size:11.5px;"></div>
    `;
    const tEl = document.getElementById('boulder-summary-title');
    const dEl = document.getElementById('boulder-summary-desc');
    if (instant) {
      setTypedElementInstant(tEl, bTxt.name);
      setTypedElementInstant(dEl, bTxt.description);
    } else {
      typeText(tEl, bTxt.name, 14).then(() => typeText(dEl, bTxt.description, 9));
    }
  }

  const s = boulder.scale * 2.8;
  targetWireframeBox.position.set(boulder.x, boulder.y + boulder.scale * 0.8, boulder.z);
  targetWireframeBox.scale.set(s, s, s);
  targetWireframeBox.visible = true;
}

function addWaypointFromMap(x, z, label = null) {
  const prefix = state.lang === 'en' ? 'WP' : (state.lang === 'ja' ? '地点' : 'Точка');
  const newLabel = label || `${prefix} ${state.waypoints.length + 1}`;
  state.waypoints.push({ x: Math.round(x), z: Math.round(z), label: newLabel });
  showToast(t('toast_wp_added')(translateWaypointLabel(newLabel, state.lang)));
  recalculateRouteViaAPI();
}

function populateLocalizedSelectors() {
  const presetSel = document.getElementById('preset-selector');
  if (presetSel && state.mapData?.mission_presets) {
    const prevPresetVal = presetSel.value || '0';
    presetSel.innerHTML = state.mapData.mission_presets.map((p, idx) =>
      `<option value="${idx}">${getPresetName(p.id, p.name, state.lang)}</option>`
    ).join('');
    presetSel.value = prevPresetVal;
  }

  const boulderSel = document.getElementById('orbital-boulder-select');
  if (boulderSel && state.mapData?.infrastructure?.boulders) {
    const prevBoulderVal = boulderSel.value || state.mapData.infrastructure.boulders[0]?.id || '';
    boulderSel.innerHTML = state.mapData.infrastructure.boulders.map(b => {
      const bTxt = getBoulderText(b, state.lang);
      return `<option value="${b.id}">${bTxt.name} (${t('boulder_biosig_label')} ${b.biosignature_index}%)</option>`;
    }).join('');
    if (prevBoulderVal) boulderSel.value = prevBoulderVal;
  }
}

function applyLanguage(lang) {
  if (!I18N[lang]) return;
  state.lang = lang;
  document.documentElement.lang = lang;
  document.title = t('page_title');

  document.querySelectorAll('#lang-switcher .lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = I18N[lang]?.[key];
    if (typeof val === 'string') {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = I18N[lang]?.[key];
    if (typeof val === 'string') {
      el.innerHTML = val;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = I18N[lang]?.[key];
    if (typeof val === 'string') {
      el.setAttribute('title', val);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = I18N[lang]?.[key];
    if (typeof val === 'string') {
      el.setAttribute('placeholder', val);
    }
  });

  const startBtnSpan = document.querySelector('#btn-start-eva span');
  if (startBtnSpan) {
    startBtnSpan.textContent = state.mode === 'orbital' ? t('btn_start_eva') : t('btn_return_hq');
  }

  const emergSpan = document.querySelector('#btn-emergency-toggle span');
  if (emergSpan) {
    emergSpan.textContent = state.emergencyMode ? t('btn_emergency_active') : t('btn_emergency_normal');
  }

  const cmpBtn = document.getElementById('btn-toggle-naive-line');
  if (cmpBtn) {
    cmpBtn.textContent = state.showNaiveComparison ? t('cmp_line_on') : t('cmp_line_off');
  }

  const relayBtn = document.getElementById('btn-toggle-drone-relay');
  if (relayBtn) {
    relayBtn.textContent = state.droneRelayActive ? t('btn_on') : t('btn_off');
  }
  const droneStatusEl = document.getElementById('drone-status-text');
  if (droneStatusEl) {
    droneStatusEl.textContent = state.droneRelayActive ? t('drone_status_on') : t('drone_status_off');
  }

  const playBtn = document.getElementById('btn-visor-play');
  if (playBtn) {
    playBtn.textContent = state.visorPlaying ? t('btn_pause') : t('btn_walk');
  }

  const leftActiveTab = document.querySelector('[data-left-tab].active')?.getAttribute('data-left-tab');
  setTypedElementInstant(
    document.getElementById('left-win-title'),
    leftActiveTab === 'tab-weights' ? t('left_win_title_weights') : t('left_win_title_layers')
  );
  setTypedElementInstant(document.getElementById('left-win-desc'), t('left_win_desc'));

  const rightActiveTab = document.querySelector('[data-right-tab].active')?.getAttribute('data-right-tab');
  setTypedElementInstant(
    document.getElementById('right-win-title'),
    rightActiveTab === 'tab-crism' ? t('right_win_title_crism') : t('right_win_title_telemetry')
  );
  setTypedElementInstant(document.getElementById('right-win-desc'), t('right_win_desc'));

  const layerHintEl = document.getElementById('layer-typed-hint');
  if (layerHintEl) {
    setTypedElementInstant(layerHintEl, LAYER_DESCRIPTIONS[state.activeLayer] || '');
  }

  if (state.emergencyMode && state.emergShelterMeta) {
    const shName = getFacilityName(state.emergShelterMeta.id, state.emergShelterMeta.name, lang);
    const targetEl = document.getElementById('emergency-shelter-target');
    if (targetEl) {
      targetEl.textContent = t('emerg_banner_sub_active')(shName, state.routeData?.summary?.total_distance_m || 0);
    }
  }

  populateLocalizedSelectors();

  if (state.selectedOrbitalBoulder) {
    selectBoulderInOrbitalUI(state.selectedOrbitalBoulder, true);
  }
  if (state.mode === 'visor') {
    updateSpectralRaycaster();
  } else {
    const reticleStatusEl = document.getElementById('reticle-status-text');
    if (reticleStatusEl && !state.pinnedBoulder && !state.lockedBoulder) {
      reticleStatusEl.textContent = t('reticle_ready');
    }
    if (state.pinnedBoulder) {
      renderCrismSpectralCard(state.pinnedBoulder);
    }
  }

  createARPinElements();
  updateOrbitalDashboard(true);
  updateTelemetryAtStep(state.currentStepFloat);

  if (state.activeAnomaly || state.emergencyMode) {
    const aType = state.emergencyMode ? 'radiation_storm' : state.activeAnomaly;
    const shName = state.emergShelterMeta
      ? getFacilityName(state.emergShelterMeta.id, state.emergShelterMeta.name, lang)
      : '';
    const msg = getAIAnomalyTriggerContent(aType, {
      x: Math.round(state.anomalySpot?.x || 0),
      z: Math.round(state.anomalySpot?.z || 0),
      shelterName: shName,
      dist: state.routeData?.summary?.total_distance_m || 0,
      shielding: state.emergShelterMeta?.shielding_pct || 96
    }, lang);
    if (state.anomalySpot && msg.pinTitle) {
      state.anomalySpot.title = msg.pinTitle;
      state.anomalySpot.sub = msg.pinSub;
    }
    deliverAIMessage({
      category: msg.category,
      title: msg.title,
      text: msg.text,
      isAlert: true,
      showResolveBtn: true,
      resolveLabel: msg.resolveLabel,
      instant: true
    });
  } else if (state.lastAITopic) {
    answerAstronautQuestion(state.lastAIQuery || state.lastAITopic, state.lastAITopic, {
      instant: true,
      keepClosed: !state.aiWindowOpen
    });
  } else {
    const badgeEl = document.getElementById('ai-core-badge');
    const catEl = document.getElementById('ai-response-category');
    const miniTicker = document.getElementById('ai-mini-ticker');
    if (badgeEl) badgeEl.textContent = t('ai_badge_nominal');
    if (catEl) catEl.textContent = t('ai_init_cat');
    setTypedElementInstant(document.getElementById('ai-response-title'), t('ai_init_title'));
    setTypedElementInstant(document.getElementById('ai-response-text'), t('ai_init_text'));
    if (miniTicker) miniTicker.textContent = t('ai_mini_ticker_default');
  }
}

function initUIBindings() {
  setTimeout(() => {
    openHoloWindow(
      'holo-left-planner',
      'left-win-title',
      t('left_win_title_layers'),
      'left-win-desc',
      t('left_win_desc')
    );
  }, 80);

  setTimeout(() => {
    openHoloWindow(
      'holo-right-analytics',
      'right-win-title',
      t('right_win_title_telemetry'),
      'right-win-desc',
      t('right_win_desc')
    );
  }, 260);

  document.querySelectorAll('.window-collapse-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      collapseHoloWindow(btn.getAttribute('data-target'));
    });
  });

  document.getElementById('btn-restore-left')?.addEventListener('click', () => {
    const leftTab = document.querySelector('[data-left-tab].active')?.getAttribute('data-left-tab');
    openHoloWindow(
      'holo-left-planner',
      'left-win-title',
      leftTab === 'tab-weights' ? t('left_win_title_weights') : t('left_win_title_layers'),
      'left-win-desc',
      t('left_win_desc')
    );
  });

  document.getElementById('btn-restore-right')?.addEventListener('click', () => {
    const rightTab = document.querySelector('[data-right-tab].active')?.getAttribute('data-right-tab');
    openHoloWindow(
      'holo-right-analytics',
      'right-win-title',
      rightTab === 'tab-crism' ? t('right_win_title_crism') : t('right_win_title_telemetry'),
      'right-win-desc',
      t('right_win_desc')
    );
  });

  document.querySelectorAll('#lang-switcher .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang && lang !== state.lang) {
        applyLanguage(lang);
        showToast(t('toast_lang_switched'));
      }
    });
  });

  document.querySelectorAll('[data-left-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('[data-left-tab]').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetId = tabBtn.getAttribute('data-left-tab');
      document.querySelectorAll('#holo-left-planner .tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');

      if (targetId === 'tab-layers') {
        typeText(document.getElementById('left-win-title'), t('left_win_title_layers'), 14);
      } else {
        typeText(document.getElementById('left-win-title'), t('left_win_title_weights'), 14);
      }
    });
  });

  document.querySelectorAll('[data-right-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('[data-right-tab]').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetId = tabBtn.getAttribute('data-right-tab');
      document.querySelectorAll('#holo-right-analytics .tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');

      if (targetId === 'tab-telemetry') {
        typeText(document.getElementById('right-win-title'), t('right_win_title_telemetry'), 14);
        drawOrbitalProfileChart(Math.floor(state.currentStepFloat));
      } else {
        typeText(document.getElementById('right-win-title'), t('right_win_title_crism'), 14);
        if (state.selectedOrbitalBoulder) selectBoulderInOrbitalUI(state.selectedOrbitalBoulder);
      }
    });
  });

  document.querySelectorAll('#layer-buttons .layer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#layer-buttons .layer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.getAttribute('data-layer');
      state.activeLayer = layer;
      applyTerrainLayerColors(layer);
      const hintEl = document.getElementById('layer-typed-hint');
      if (hintEl && LAYER_DESCRIPTIONS[layer]) {
        typeText(hintEl, LAYER_DESCRIPTIONS[layer], 11);
      }
    });
  });

  populateLocalizedSelectors();

  const presetSel = document.getElementById('preset-selector');
  presetSel.addEventListener('change', () => {
    const p = state.mapData.mission_presets[parseInt(presetSel.value, 10)];
    if (!p) return;
    state.waypoints = p.waypoints.map(w => ({ ...w }));
    state.weights = { ...p.weights };
    document.getElementById('slider-w-slope').value = state.weights.slope;
    document.getElementById('val-w-slope').textContent = `${state.weights.slope}x`;
    document.getElementById('slider-w-sand').value = state.weights.sand;
    document.getElementById('val-w-sand').textContent = `${state.weights.sand}x`;
    document.getElementById('slider-w-comm').value = state.weights.comm;
    document.getElementById('val-w-comm').textContent = `${state.weights.comm}x`;
    recalculateRouteViaAPI();
  });

  const bindSlider = (id, valId, key) => {
    const sl = document.getElementById(id);
    const vl = document.getElementById(valId);
    sl.addEventListener('input', () => {
      state.weights[key] = parseFloat(sl.value);
      vl.textContent = `${state.weights[key].toFixed(1)}x`;
    });
    sl.addEventListener('change', () => recalculateRouteViaAPI());
  };
  bindSlider('slider-w-slope', 'val-w-slope', 'slope');
  bindSlider('slider-w-sand', 'val-w-sand', 'sand');
  bindSlider('slider-w-comm', 'val-w-comm', 'comm');

  document.getElementById('btn-recalc-route').addEventListener('click', () => {
    recalculateRouteViaAPI();
    showToast(t('toast_route_recalc'));
  });
  document.getElementById('btn-clear-last-wp').addEventListener('click', () => {
    if (state.waypoints.length > 2) {
      const removed = state.waypoints.pop();
      showToast(t('toast_wp_removed')(translateWaypointLabel(removed.label, state.lang)));
      recalculateRouteViaAPI();
    } else {
      showToast(t('toast_min_wp'));
    }
  });
  document.getElementById('btn-reset-preset').addEventListener('click', () => {
    presetSel.dispatchEvent(new Event('change'));
    showToast(t('toast_preset_reset'));
  });

  const boulderSel = document.getElementById('orbital-boulder-select');
  boulderSel.addEventListener('change', () => {
    const found = state.mapData.infrastructure.boulders.find(b => b.id === boulderSel.value);
    if (found) {
      selectBoulderInOrbitalUI(found);
      if (state.mode === 'orbital') {
        orbitControls.target.set(found.x, found.y, found.z);
        orbitControls.update();
      }
    }
  });
  selectBoulderInOrbitalUI(state.mapData.infrastructure.boulders[0]);

  document.getElementById('btn-route-to-boulder')?.addEventListener('click', () => {
    const b = state.selectedOrbitalBoulder || state.mapData.infrastructure.boulders[0];
    if (b) {
      const bTxt = getBoulderText(b, state.lang);
      addWaypointFromMap(b.x, b.z, bTxt.name.split('(')[0].split('（')[0].trim());
    }
  });

  document.getElementById('btn-top-compare')?.addEventListener('click', () => {
    toggleNaiveComparison();
  });
  document.getElementById('btn-toggle-naive-line')?.addEventListener('click', () => {
    toggleNaiveComparison();
  });

  document.querySelectorAll('#lighting-switcher .sol-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sol = btn.getAttribute('data-sol');
      if (sol) setSolLightingMode(sol);
    });
  });

  const droneRelayBtn = document.getElementById('btn-toggle-drone-relay');
  droneRelayBtn?.addEventListener('click', () => {
    state.droneRelayActive = !state.droneRelayActive;
    droneRelayBtn.classList.toggle('active', state.droneRelayActive);
    droneRelayBtn.textContent = state.droneRelayActive ? t('btn_on') : t('btn_off');
    if (droneScanCone) droneScanCone.visible = state.droneRelayActive;
    const stText = document.getElementById('drone-status-text');
    if (stText) {
      stText.textContent = state.droneRelayActive ? t('drone_status_on') : t('drone_status_off');
    }
    updateTelemetryAtStep(state.currentStepFloat);
    showToast(state.droneRelayActive ? t('toast_relay_on') : t('toast_relay_off'));
  });

  document.getElementById('btn-start-eva').addEventListener('click', () => {
    if (state.mode === 'orbital') startCameraDiveToVisor(false);
    else if (state.mode === 'visor') returnCameraToOrbit(false);
  });
  document.getElementById('btn-phase-orbital').addEventListener('click', () => {
    if (state.mode === 'visor') {
      returnCameraToOrbit(false);
    } else {
      state.topDownLocked = !state.topDownLocked;
      if (state.topDownLocked) {
        camera.position.set(0, 960, 20);
        showToast(t('toast_orbit_top'));
      } else {
        camera.position.set(0, 780, 360);
        showToast(t('toast_orbit_3d'));
      }
      orbitControls.target.set(-30, 12, 10);
      orbitControls.update();
    }
  });
  document.getElementById('btn-phase-drone')?.addEventListener('click', () => {
    startCameraDiveToVisor(true);
  });
  document.getElementById('btn-phase-visor').addEventListener('click', () => {
    startCameraDiveToVisor(false);
  });
  document.getElementById('btn-visor-drone-cam')?.addEventListener('click', () => {
    startCameraDiveToVisor(!state.droneCameraActive);
  });
  document.getElementById('btn-return-orbital').addEventListener('click', () => {
    returnCameraToOrbit(false);
  });

  document.getElementById('btn-emergency-toggle').addEventListener('click', () => {
    toggleEmergencyScenario();
  });

  const toggleAIWindow = () => {
    if (state.aiWindowOpen) closeAICopilotWindow();
    else openAICopilotWindow();
  };
  document.getElementById('btn-top-ai')?.addEventListener('click', toggleAIWindow);
  document.getElementById('btn-visor-ai')?.addEventListener('click', toggleAIWindow);
  document.getElementById('btn-open-ai-chat')?.addEventListener('click', () => openAICopilotWindow());
  document.getElementById('btn-close-ai-window')?.addEventListener('click', () => closeAICopilotWindow());

  document.getElementById('btn-trigger-random-anomaly')?.addEventListener('click', () => {
    const types = ['rockfall', 'suit_leak', 'dust_devil', 'radiation_storm'];
    const nextType = types[Math.floor(Math.random() * types.length)];
    triggerUnexpectedAnomaly(nextType);
  });

  document.querySelectorAll('.ai-anomaly-btn[data-anomaly]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-anomaly');
      if (type) triggerUnexpectedAnomaly(type);
    });
  });

  document.getElementById('btn-ai-execute-fix')?.addEventListener('click', () => {
    resolveActiveAnomalyWithAI();
  });

  const aiForm = document.getElementById('ai-question-form');
  const aiInput = document.getElementById('ai-question-input');
  aiForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!aiInput) return;
    const q = aiInput.value.trim();
    if (!q) return;
    aiInput.value = '';
    answerAstronautQuestion(q);
  });

  document.querySelectorAll('.ai-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      const q = btn.getAttribute('data-query') || btn.getAttribute('data-q') || btn.textContent.trim();
      if (q || topic) answerAstronautQuestion(q || topic, topic);
    });
  });

  const playBtn = document.getElementById('btn-visor-play');
  playBtn.addEventListener('click', () => {
    state.visorPlaying = !state.visorPlaying;
    playBtn.textContent = state.visorPlaying ? t('btn_pause') : t('btn_walk');
    playBtn.classList.toggle('active', state.visorPlaying);
  });

  document.getElementById('btn-visor-step-prev').addEventListener('click', () => {
    state.visorPlaying = false;
    playBtn.textContent = t('btn_walk');
    playBtn.classList.remove('active');
    state.currentStepFloat = Math.max(0, state.currentStepFloat - 1);
    updateTelemetryAtStep(state.currentStepFloat);
  });

  document.getElementById('btn-visor-step-next').addEventListener('click', () => {
    state.visorPlaying = false;
    playBtn.textContent = t('btn_walk');
    playBtn.classList.remove('active');
    const maxStep = (state.routeData?.timeline?.length || 1) - 1;
    state.currentStepFloat = Math.min(maxStep, state.currentStepFloat + 1);
    updateTelemetryAtStep(state.currentStepFloat);
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.visorSpeedMult = parseFloat(btn.getAttribute('data-speed'));
    });
  });

  const timelineSlider = document.getElementById('visor-timeline-slider');
  timelineSlider.addEventListener('input', () => {
    state.currentStepFloat = parseFloat(timelineSlider.value);
    state.pinnedBoulder = null;
    updateTelemetryAtStep(state.currentStepFloat);
  });

  document.getElementById('btn-aim-nearest-rock').addEventListener('click', () => {
    aimAtNearestBoulder();
  });
  document.getElementById('btn-toggle-flashlight')?.addEventListener('click', () => {
    toggleHelmetFlashlight();
    showToast(state.flashlightOn ? t('toast_torch_on') : t('toast_torch_off'));
  });
  document.getElementById('btn-reset-look').addEventListener('click', () => {
    state.lookYawOffset = 0.0;
    state.lookPitchOffset = -0.04;
    state.droneCamDistance = 18.0;
    state.pinnedBoulder = null;
  });

  document.getElementById('btn-close-crism').addEventListener('click', () => {
    state.pinnedBoulder = null;
    document.getElementById('crism-spectral-card').classList.remove('visible');
  });

  document.getElementById('btn-collect-sample').addEventListener('click', () => {
    const rock = state.lockedBoulder || state.pinnedBoulder || state.mapData.infrastructure.boulders[0];
    const bTxt = getBoulderText(rock, state.lang);
    showToast(t('toast_sample_saved')(bTxt.name));
  });

  const profileCanvas = document.getElementById('orbital-profile-canvas');
  profileCanvas.addEventListener('click', (e) => {
    if (!state.routeData?.timeline?.length) return;
    const rect = profileCanvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    state.currentStepFloat = ratio * (state.routeData.timeline.length - 1);
    updateTelemetryAtStep(state.currentStepFloat);
  });

  const isInteractiveHUDTarget = (el) => {
    if (!el || typeof el.closest !== 'function') return false;
    return Boolean(el.closest(
      'button, input, select, form, a, .hologram-window.visible, .visor-left-biometrics, .visor-right-radar, .visor-bottom-controls, #top-navbar, #ai-mini-dock, #crism-spectral-card.visible'
    ));
  };

  window.addEventListener('mousedown', (e) => {
    if (isInteractiveHUDTarget(e.target)) return;
    if (state.mode === 'visor' || (state.mode === 'diving' && state.diveAnim.toVisor)) {
      if (state.diveAnim.active) {
        state.diveAnim.active = false;
        state.mode = 'visor';
        syncPhaseButtonsUI();
      }
      state.isDraggingLook = true;
      state.dragLastX = e.clientX;
      state.dragLastY = e.clientY;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (state.mode === 'visor' && state.isDraggingLook) {
      const dx = e.clientX - state.dragLastX;
      const dy = e.clientY - state.dragLastY;
      state.dragLastX = e.clientX;
      state.dragLastY = e.clientY;
      state.lookYawOffset -= dx * 0.0052;
      state.lookPitchOffset = Math.max(-1.05, Math.min(0.85, state.lookPitchOffset - dy * 0.0042));
    }
  });

  window.addEventListener('mouseup', () => {
    state.isDraggingLook = false;
  });

  window.addEventListener('wheel', (e) => {
    if (isInteractiveHUDTarget(e.target)) return;
    if (state.mode === 'visor' && state.droneCameraActive) {
      state.droneCamDistance = Math.max(5.0, Math.min(65.0, (state.droneCamDistance || 18.0) + e.deltaY * 0.025));
    }
  }, { passive: true });

  renderer.domElement.addEventListener('dblclick', (e) => {
    if (state.mode !== 'orbital' || !terrainSolidMesh) return;
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(terrainSolidMesh, false);
    if (hits.length > 0) {
      const pt = hits[0].point;
      addWaypointFromMap(pt.x, pt.z);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

let lastFrameTime = performance.now();

function animateLoop(now) {
  requestAnimationFrame(animateLoop);
  const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  if (radarDishMesh) {
    radarDishMesh.rotation.y += dt * 1.4;
  }

  if (dustDevilVortex) {
    dustDevilVortex.rotation.y += dt * 4.8;
    dustDevilVortex.position.x = Math.sin(now * 0.0022) * 3.5;
    dustDevilVortex.position.z = Math.cos(now * 0.0018) * 3.5;
  }

  drawAIWaveform(now, dt);

  const dronePose = getDronePoseAtStep(state.currentStepFloat, now);
  if (ingenuityDroneGroup && dronePose) {
    ingenuityDroneGroup.position.lerp(dronePose.dronePos, 0.18);
    if (droneRotorTop) droneRotorTop.rotation.y += dt * 28.0;
    if (droneRotorBottom) droneRotorBottom.rotation.y -= dt * 28.0;
    ingenuityDroneGroup.rotation.z = Math.sin(now * 0.0025) * 0.08;
    ingenuityDroneGroup.rotation.x = 0.09;
  }

  updateOuterNeonWaves(dt);

  const wavePhase = now * 0.005;
  chevronMeshes.forEach((mesh, idx) => {
    const pulse = 0.4 + 0.6 * Math.sin(wavePhase - idx * 0.55);
    mesh.material.opacity = pulse;
    const sc = 0.9 + 0.2 * pulse;
    mesh.scale.set(sc, sc, sc);
  });

  if (stormPoints && state.emergencyMode) {
    const pos = stormPoints.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i) + dt * 48.0;
      let y = pos.getY(i) - dt * 7.0;
      if (x > 550) x = -550;
      if (y < 0) y = 180;
      pos.setX(i, x);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  if (state.diveAnim.active) {
    const elapsed = now - state.diveAnim.startTime;
    const rawT = Math.min(1.0, elapsed / state.diveAnim.durationMs);
    const easeT = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

    camera.position.lerpVectors(state.diveAnim.startPos, state.diveAnim.endPos, easeT);
    camera.position.y += Math.sin(rawT * Math.PI) * 45.0 * (1.0 - easeT);

    const currLook = new THREE.Vector3().lerpVectors(state.diveAnim.startLook, state.diveAnim.endLook, easeT);
    camera.lookAt(currLook);

    if (rawT >= 1.0) {
      state.diveAnim.active = false;
      if (state.diveAnim.toVisor) {
        state.mode = 'visor';
        scene.fog.density = state.emergencyMode ? 0.0075 : 0.0014;
      } else {
        state.mode = 'orbital';
        orbitControls.enabled = true;
        orbitControls.target.copy(state.diveAnim.endLook);
        scene.fog.density = state.emergencyMode ? 0.00095 : 0.00042;
      }
      syncPhaseButtonsUI();
    }
  } else if (state.mode === 'orbital') {
    orbitControls.update();
  } else if (state.mode === 'visor') {
    const timeline = state.routeData?.timeline || [];
    if (state.visorPlaying && timeline.length > 1) {
      state.currentStepFloat += dt * 1.25 * state.visorSpeedMult;
      if (state.currentStepFloat >= timeline.length - 1) {
        state.currentStepFloat = 0.0;
      }
      updateTelemetryAtStep(state.currentStepFloat);
    }

    const pose = getAstronautPoseAtStep(state.currentStepFloat);
    if (state.droneCameraActive && dronePose) {
      camera.position.lerp(dronePose.camPos, 0.22);
      camera.lookAt(dronePose.lookTarget);
    } else {
      camera.position.lerp(pose.eyePos, 0.35);
      camera.lookAt(pose.lookTarget);
    }

    if (helmetSpotLight && helmetSpotTarget) {
      helmetSpotLight.position.copy(pose.eyePos);
      helmetSpotTarget.position.copy(pose.lookTarget);
    }

    updateSpectralRaycaster();
    updateAndDrawECG(dt);
    drawDualTacticalRadar(dt);
  }

  update2DARProjections();
  renderer.render(scene, camera);
}

async function initSystem() {
  const resp = await fetch('/api/init');
  const data = await resp.json();
  state.mapData = data.map;
  state.routeData = data.initial_route;
  state.waypoints = data.initial_route.waypoints.map(w => ({ x: w.x, z: w.z, label: w.label }));

  buildMartianSkyAndHorizon();
  buildNeonMarsTerrain();
  buildInfrastructureAndBoulders();
  buildStormParticles();
  buildRouteVisuals();
  initUIBindings();
  updateOrbitalDashboard();
  createARPinElements();
  updateTelemetryAtStep(0);

  requestAnimationFrame(animateLoop);
}

initSystem();
