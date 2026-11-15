(function () {
  "use strict";

  const DATA = window.PRESENTATION_DATA;
  if (!DATA || !Array.isArray(DATA.slides)) return;

  const STORAGE_KEY_LANG = "sextant_pres_lang";
  const TOTAL_SLIDES = DATA.slides.length;

  let currentLang = detectInitialLang();
  let currentIndex = detectInitialSlide();

  const el = {
    frame: document.getElementById("slide-frame"),
    counter: document.getElementById("slide-counter"),
    timing: document.getElementById("slide-timing"),
    progressBar: document.getElementById("progress-bar"),
    progressFill: document.getElementById("progress-fill"),
    dots: document.getElementById("slide-dots"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnLangEn: document.getElementById("btn-lang-en"),
    btnLangJa: document.getElementById("btn-lang-ja"),
    btnNotes: document.getElementById("btn-notes"),
    btnCloseNotes: document.getElementById("btn-close-notes"),
    notesDrawer: document.getElementById("notes-drawer"),
    notesBody: document.getElementById("notes-body"),
    notesBadge: document.getElementById("notes-slide-badge"),
    btnOverview: document.getElementById("btn-overview"),
    overviewModal: document.getElementById("overview-modal"),
    overviewGrid: document.getElementById("overview-grid"),
    btnCloseOverview: document.getElementById("btn-close-overview"),
    btnFullscreen: document.getElementById("btn-fullscreen"),
    btnPrint: document.getElementById("btn-print"),
    printDeck: document.getElementById("print-deck"),
    bgCanvas: document.getElementById("bg-mars-waves")
  };

  function detectInitialLang() {
    try {
      const qs = new URLSearchParams(window.location.search);
      const qLang = qs.get("lang");
      if (qLang === "en" || qLang === "ja") return qLang;
      const saved = window.localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === "en" || saved === "ja") return saved;
    } catch (_) {
    }
    return "en";
  }

  function detectInitialSlide() {
    const hash = window.location.hash || "";
    const match = hash.match(/slide-(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10) - 1;
      if (!Number.isNaN(n) && n >= 0 && n < TOTAL_SLIDES) return n;
    }
    return 0;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function setLanguage(lang) {
    if (lang !== "en" && lang !== "ja") return;
    currentLang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (_) {}

    document.documentElement.lang = lang;
    const ui = DATA.ui[lang];
    document.title = ui.docTitle;

    document.querySelectorAll("[data-ui]").forEach((node) => {
      const key = node.getAttribute("data-ui");
      if (ui[key]) node.textContent = ui[key];
    });

    el.btnLangEn.classList.toggle("active", lang === "en");
    el.btnLangEn.setAttribute("aria-pressed", String(lang === "en"));
    el.btnLangJa.classList.toggle("active", lang === "ja");
    el.btnLangJa.setAttribute("aria-pressed", String(lang === "ja"));

    updateFullscreenLabel();
    buildDots();
    renderSlide(false);
    renderOverviewGrid();
  }

  function goToSlide(index, animate = true) {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    if (clamped === currentIndex && el.frame.children.length > 0) return;
    currentIndex = clamped;
    try {
      history.replaceState(null, "", "#slide-" + (currentIndex + 1));
    } catch (_) {
      window.location.hash = "slide-" + (currentIndex + 1);
    }
    renderSlide(animate);
    updateOverviewHighlight();
  }

  function buildDots() {
    el.dots.innerHTML = "";
    DATA.slides.forEach((slide, idx) => {
      const copy = slide[currentLang];
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slide-dot" + (idx === currentIndex ? " active" : "");
      dot.title = `${pad2(idx + 1)}. ${copy.shortTitle || slide.badge}`;
      dot.setAttribute("aria-label", `Slide ${idx + 1}: ${copy.shortTitle || ""}`);
      dot.addEventListener("click", () => goToSlide(idx, true));
      el.dots.appendChild(dot);
    });
  }

  function updateChrome() {
    const slide = DATA.slides[currentIndex];
    const numStr = `${pad2(currentIndex + 1)} / ${pad2(TOTAL_SLIDES)}`;
    el.counter.textContent = numStr;
    el.timing.textContent = slide.timing;

    const pct = ((currentIndex + 1) / TOTAL_SLIDES) * 100;
    el.progressFill.style.width = `${pct}%`;
    el.progressBar.setAttribute("aria-valuemax", String(TOTAL_SLIDES));
    el.progressBar.setAttribute("aria-valuenow", String(currentIndex + 1));

    el.btnPrev.disabled = currentIndex === 0;
    el.btnNext.disabled = currentIndex === TOTAL_SLIDES - 1;

    Array.from(el.dots.children).forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });

    const copy = slide[currentLang];
    el.notesBadge.textContent = `${pad2(currentIndex + 1)} · ${slide.timing}`;
    el.notesBody.innerHTML = (copy.notes || [])
      .map((line, i) => `<p><strong>#${i + 1}</strong> ${esc(line)}</p>`)
      .join("");
  }

  function renderSlide(animate = true) {
    const slide = DATA.slides[currentIndex];
    el.frame.innerHTML = buildSlideMarkup(slide, currentLang);
    el.frame.scrollTop = 0;

    if (animate) {
      el.frame.classList.remove("slide-enter");
      void el.frame.offsetWidth;
      el.frame.classList.add("slide-enter");
    }

    updateChrome();
  }

  function renderSlideHeader(slide, c) {
    return `
      <header class="slide-head">
        <div class="slide-head-left">
          <span class="slide-kicker">${esc(c.kicker)}</span>
          <h1 class="slide-title">${esc(c.title)}</h1>
          <p class="slide-subtitle">${esc(c.subtitle)}</p>
        </div>
        <span class="slide-badge-pill">${esc(c.badgePill || slide.badge)}</span>
      </header>
    `;
  }

  function buildSlideMarkup(slide, lang) {
    const c = slide[lang];
    switch (slide.layout) {
      case "hero":
        return renderHeroSlide(c);
      case "problem":
        return renderProblemSlide(slide, c);
      case "nasa-sources":
        return renderNasaSourcesSlide(slide, c);
      case "arch":
        return renderArchSlide(slide, c);
      case "layers":
        return renderLayersSlide(slide, c);
      case "compare":
        return renderCompareSlide(slide, c, lang);
      case "visor":
        return renderVisorSlide(slide, c, lang);
      case "drone":
        return renderDroneSlide(slide, c, lang);
      case "science":
        return renderScienceSlide(slide, c, lang);
      case "ai":
        return renderAiSlide(slide, c);
      case "roadmap":
        return renderRoadmapSlide(slide, c);
      default:
        return `<p>Unknown slide layout</p>`;
    }
  }

  function renderHeroSlide(c) {
    return `
      <div class="hero-layout">
        <div class="hero-main">
          <div>
            <div class="hero-eyebrow">${esc(c.eyebrow)}</div>
            <h1 class="hero-title">${esc(c.title)}</h1>
            <p class="hero-lead">${esc(c.lead)}</p>
            <div class="hero-telemetry-strip">
              ${c.telemetry
                .map(
                  (t) => `
                <div class="telemetry-pill">
                  <span>${esc(t.label)}</span>
                  <strong>${esc(t.value)}</strong>
                </div>`
                )
                .join("")}
            </div>
          </div>

          <div class="hero-emblem-box">
            <svg viewBox="0 0 320 320" width="275" height="275" role="img" aria-label="Jezero Orbital Emblem">
              <defs>
                <radialGradient id="marsGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#64f9ff" stop-opacity="0.22" />
                  <stop offset="60%" stop-color="#ffb84a" stop-opacity="0.1" />
                  <stop offset="100%" stop-color="#05080f" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle cx="160" cy="160" r="142" fill="url(#marsGlow)" />
              <circle cx="160" cy="160" r="126" fill="none" stroke="rgba(100,249,255,0.22)" stroke-width="1.2" stroke-dasharray="5 5" />
              <circle cx="160" cy="160" r="96" fill="none" stroke="rgba(100,249,255,0.34)" stroke-width="1.4" />
              <circle cx="160" cy="160" r="56" fill="none" stroke="rgba(255,184,74,0.42)" stroke-width="1.4" />
              <!-- Contour topographic rings -->
              <path d="M90 172 Q128 118 178 134 T238 158 Q205 206 144 200 T90 172 Z" fill="rgba(100,249,255,0.08)" stroke="#64f9ff" stroke-width="1.5" />
              <path d="M114 166 Q142 134 176 146 T214 162 Q190 186 148 182 T114 166 Z" fill="rgba(255,184,74,0.12)" stroke="#ffb84a" stroke-width="1.3" />
              <!-- Serpentine A* path highlight -->
              <path d="M84 218 C118 202, 122 162, 152 152 C178 144, 198 118, 226 102" fill="none" stroke="#57ff9a" stroke-width="2.6" stroke-linecap="round" />
              <circle cx="84" cy="218" r="5" fill="#64f9ff" />
              <circle cx="152" cy="152" r="4.5" fill="#ffb84a" />
              <circle cx="226" cy="102" r="5.5" fill="#57ff9a" />
              <!-- Crosshairs -->
              <line x1="160" y1="22" x2="160" y2="54" stroke="#64f9ff" stroke-width="1.4" />
              <line x1="160" y1="266" x2="160" y2="298" stroke="#64f9ff" stroke-width="1.4" />
              <line x1="22" y1="160" x2="54" y2="160" stroke="#64f9ff" stroke-width="1.4" />
              <line x1="266" y1="160" x2="298" y2="160" stroke="#64f9ff" stroke-width="1.4" />
              <text x="160" y="290" text-anchor="middle" fill="#93b8cc" font-family="monospace" font-size="11">JEZERO // 1280×1280m + 3400m</text>
            </svg>
          </div>
        </div>

        <div class="hero-pillars">
          ${c.pillars
            .map(
              (p) => `
            <div class="pillar-card">
              <span class="pillar-idx">${esc(p.idx)}</span>
              <div>
                <h4>${esc(p.title)}</h4>
                <p>${esc(p.desc)}</p>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderProblemSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="split-grid">
        <div class="col-stack">
          <div class="col-heading" style="color: var(--red)">● ${esc(c.leftHeading)}</div>
          ${c.hazards
            .map(
              (h) => `
            <div class="hazard-row">
              <div class="hazard-metric">${esc(h.metric)}</div>
              <div>
                <h4>${esc(h.title)}</h4>
                <p>${esc(h.desc)}</p>
              </div>
            </div>`
            )
            .join("")}
        </div>

        <div class="col-stack">
          <div class="col-heading" style="color: var(--cyan)">● ${esc(c.rightHeading)}</div>
          <div class="loop-card">
            ${c.loopSteps
              .map(
                (s) => `
              <div class="loop-step">
                <span class="loop-num">${esc(s.num)}</span>
                <div>
                  <h4>${esc(s.title)}</h4>
                  <p>${esc(s.desc)}</p>
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderNasaSourcesSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="nasa-grid">
        ${c.sources
          .map(
            (s) => `
          <div class="nasa-source-card">
            <div class="nasa-source-top">
              <span class="nasa-badge">${esc(s.badge)}</span>
              <span class="nasa-mission-tag">${esc(s.mission)}</span>
            </div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.desc)}</p>
            <div class="nasa-usage-line">→ ${esc(s.usage)}</div>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  function renderArchSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="arch-layout">
        <div class="arch-pipeline">
          ${c.nodes
            .map(
              (n) => `
            <div class="arch-node">
              <span class="arch-step-tag">${esc(n.tag)}</span>
              <h3>${esc(n.title)}</h3>
              <ul class="arch-list">
                ${n.items.map((item) => `<li>${esc(item)}</li>`).join("")}
              </ul>
              <div class="arch-tech-foot">${esc(n.foot)}</div>
            </div>`
            )
            .join("")}
        </div>

        <div class="endpoint-strip">
          ${c.endpoints
            .map(
              (ep) => `
            <div class="endpoint-pill">
              <code>${esc(ep.cmd)}</code>
              <span>${esc(ep.desc)}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderLayersSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="layers-grid">
        <div class="layer-cards">
          ${c.layers
            .map(
              (l) => `
            <div class="layer-item">
              <div class="layer-swatch" style="color:${esc(l.color)}; background:${esc(l.bg)}; border:1px solid ${esc(l.color)}55;">
                ${esc(l.code)}
              </div>
              <div>
                <h4>${esc(l.title)}</h4>
                <p>${esc(l.desc)}</p>
              </div>
            </div>`
            )
            .join("")}
        </div>

        <div class="astar-panel">
          <div class="card">
            <span class="card-label">${esc(c.solverLabel)}</span>
            <h3>${esc(c.solverTitle)}</h3>
            <pre class="formula-box">${esc(c.formula)}</pre>
            <ul class="arch-list">
              ${c.solverFeatures.map((f) => `<li>${esc(f)}</li>`).join("")}
            </ul>
          </div>

          <div class="card card-amber">
            <span class="card-label">EVA MISSION PRESETS (JEZERO)</span>
            <div class="preset-chips">
              ${c.presets
                .map(
                  (p) => `
                <div class="preset-chip">
                  <code>${esc(p.id)}</code>
                  <span>${esc(p.name)}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCompareSlide(slide, c, lang) {
    const labelElev = lang === "ja" ? "標高 / 崖 (MOLA)" : "Elevation / Cliff Grade";
    const labelHr = lang === "ja" ? "心拍負荷 (BPM)" : "Crew HR Load (BPM)";

    return `
      ${renderSlideHeader(slide, c)}
      <div class="compare-layout">
        <div class="chart-card">
          <div>
            <span class="card-label">${esc(c.chartTitle)}</span>
            <div class="chart-legend" style="margin-top:6px;">
              <span><i class="legend-dot" style="background:var(--red);"></i>${esc(c.legendDirect)}</span>
              <span><i class="legend-dot" style="background:var(--cyan);"></i>${esc(c.legendAstar)}</span>
            </div>
          </div>

          <svg viewBox="0 0 560 270" width="100%" height="235" role="img" aria-label="Elevation and Heart Rate comparison profile">
            <!-- Grid lines -->
            <line x1="48" y1="30" x2="540" y2="30" stroke="rgba(147,184,204,0.14)" />
            <line x1="48" y1="80" x2="540" y2="80" stroke="rgba(147,184,204,0.14)" />
            <line x1="48" y1="130" x2="540" y2="130" stroke="rgba(147,184,204,0.22)" />
            <line x1="48" y1="185" x2="540" y2="185" stroke="rgba(147,184,204,0.14)" />
            <line x1="48" y1="235" x2="540" y2="235" stroke="rgba(147,184,204,0.25)" />

            <!-- Top Plot: Elevation / Cliff Spikes -->
            <text x="52" y="22" fill="#93b8cc" font-family="monospace" font-size="11">${esc(labelElev)}</text>
            <!-- Red Direct Steep Climb hitting cliff ridge -->
            <path d="M52 118 L128 110 L176 42 L222 106 L296 36 L345 104 L424 48 L480 96 L536 90"
                  fill="none" stroke="#ff4d57" stroke-width="2.4" stroke-dasharray="6 4" />
            <!-- Cliff markers -->
            <circle cx="176" cy="42" r="5" fill="#ff4d57" />
            <circle cx="296" cy="36" r="5" fill="#ff4d57" />
            <circle cx="424" cy="48" r="5" fill="#ff4d57" />
            <text x="296" y="24" text-anchor="middle" fill="#ff4d57" font-family="monospace" font-size="10">&gt;19.5° CLIFF</text>

            <!-- Cyan SEXTANT Smooth Contour Curve -->
            <path d="M52 118 C120 112, 180 95, 250 96 C320 97, 390 86, 460 88 L536 90"
                  fill="none" stroke="#64f9ff" stroke-width="3" />

            <!-- Bottom Plot: Heart Rate BPM (70 - 176) -->
            <text x="52" y="152" fill="#93b8cc" font-family="monospace" font-size="11">${esc(labelHr)}</text>
            <text x="42" y="168" text-anchor="end" fill="#ff4d57" font-family="monospace" font-size="9.5">176</text>
            <text x="42" y="232" text-anchor="end" fill="#57ff9a" font-family="monospace" font-size="9.5">70</text>

            <!-- Direct HR Spike Curve -->
            <path d="M52 225 L125 212 L176 164 L224 200 L296 158 L350 202 L424 166 L488 198 L536 196"
                  fill="none" stroke="#ffb84a" stroke-width="2.2" stroke-dasharray="5 3" />
            <!-- SEXTANT Stable HR Curve -->
            <path d="M52 225 C120 218, 195 206, 280 204 C370 202, 455 198, 536 196"
                  fill="none" stroke="#57ff9a" stroke-width="3" />
          </svg>

          <div class="card card-green" style="padding:10px 12px;">
            <p style="font-size:12px; color:var(--text-main);">${esc(c.chartCallout)}</p>
          </div>
        </div>

        <div class="compare-table">
          <div class="cmp-row cmp-row-head">
            <span>${esc(c.colHeadMetric)}</span>
            <span style="color:var(--red);">${esc(c.colHeadDirect)}</span>
            <span style="color:var(--green);">${esc(c.colHeadAstar)}</span>
          </div>
          ${c.metrics
            .map(
              (m) => `
            <div class="cmp-row">
              <div class="cmp-metric-name">${esc(m.name)}</div>
              <div class="cmp-val-bad">${esc(m.bad)}</div>
              <div class="cmp-val-good">${esc(m.good)}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderVisorSlide(slide, c, lang) {
    const compassLabel = lang === "ja" ? "N · NE · 048° · E · SE" : "N · NE · 048° · E · SE";
    const modeLabel = lang === "ja" ? "DAY / SUNSET / NIGHT LIDAR" : "DAY / SUNSET / NIGHT LIDAR";
    const radarLabel = lang === "ja" ? "20m 8方位レーダー" : "20m SECTOR RADAR";

    return `
      ${renderSlideHeader(slide, c)}
      <div class="visor-layout">
        <div class="visor-mockup">
          <span class="card-label">${esc(c.hudTitle)}</span>

          <svg viewBox="0 0 540 280" width="100%" height="232" role="img" aria-label="xEMU Helmet AR Visor HUD Diagram">
            <!-- Visor outer curvature -->
            <rect x="14" y="14" width="512" height="252" rx="34" fill="rgba(6,13,26,0.75)" stroke="rgba(100,249,255,0.4)" stroke-width="1.6" />
            <!-- Top compass tape -->
            <rect x="145" y="26" width="250" height="24" rx="8" fill="rgba(10,24,44,0.9)" stroke="rgba(100,249,255,0.35)" />
            <text x="270" y="42" text-anchor="middle" fill="#64f9ff" font-family="monospace" font-size="11">${esc(compassLabel)}</text>

            <!-- Center CRISM Reticle -->
            <circle cx="270" cy="142" r="38" fill="none" stroke="rgba(100,249,255,0.5)" stroke-width="1.2" stroke-dasharray="6 4" />
            <circle cx="270" cy="142" r="5" fill="none" stroke="#57ff9a" stroke-width="1.6" />
            <line x1="224" y1="142" x2="254" y2="142" stroke="#64f9ff" stroke-width="1.4" />
            <line x1="286" y1="142" x2="316" y2="142" stroke="#64f9ff" stroke-width="1.4" />
            <line x1="270" y1="96" x2="270" y2="126" stroke="#64f9ff" stroke-width="1.4" />
            <line x1="270" y1="158" x2="270" y2="188" stroke="#64f9ff" stroke-width="1.4" />
            <text x="270" y="198" text-anchor="middle" fill="#57ff9a" font-family="monospace" font-size="10">220m RAYCAST LOCK</text>

            <!-- Left PLSS + ECG Block -->
            <rect x="30" y="72" width="136" height="140" rx="12" fill="rgba(8,18,34,0.86)" stroke="rgba(87,255,154,0.38)" />
            <text x="42" y="92" fill="#57ff9a" font-family="monospace" font-size="10">PLSS // ECG</text>
            <text x="42" y="114" fill="#f0f9ff" font-family="monospace" font-size="14" font-weight="bold">114 BPM</text>
            <!-- ECG waveform -->
            <path d="M40 140 L62 140 L70 124 L78 156 L86 114 L94 146 L104 140 L154 140" fill="none" stroke="#57ff9a" stroke-width="2" />
            <text x="42" y="176" fill="#64f9ff" font-family="monospace" font-size="10.5">O₂: 482 / 580 L</text>
            <text x="42" y="196" fill="#ffb84a" font-family="monospace" font-size="10.5">LCVG: 20.4 °C</text>

            <!-- Right 20m Dual 8-Sector Radar -->
            <rect x="374" y="72" width="136" height="140" rx="12" fill="rgba(8,18,34,0.86)" stroke="rgba(100,249,255,0.38)" />
            <text x="442" y="90" text-anchor="middle" fill="#64f9ff" font-family="monospace" font-size="9.5">${esc(radarLabel)}</text>
            <circle cx="442" cy="148" r="46" fill="rgba(100,249,255,0.06)" stroke="rgba(100,249,255,0.4)" />
            <circle cx="442" cy="148" r="24" fill="none" stroke="rgba(100,249,255,0.32)" stroke-dasharray="3 3" />
            <line x1="396" y1="148" x2="488" y2="148" stroke="rgba(100,249,255,0.22)" />
            <line x1="442" y1="102" x2="442" y2="194" stroke="rgba(100,249,255,0.22)" />
            <line x1="409" y1="115" x2="475" y2="181" stroke="rgba(100,249,255,0.16)" />
            <line x1="475" y1="115" x2="409" y2="181" stroke="rgba(100,249,255,0.16)" />
            <!-- Sector alerts -->
            <path d="M442 148 L466 112 A46 46 0 0 1 486 135 Z" fill="rgba(255,77,87,0.42)" />
            <circle cx="442" cy="148" r="4" fill="#64f9ff" />

            <!-- Bottom mode ribbon -->
            <text x="270" y="246" text-anchor="middle" fill="#ffb84a" font-family="monospace" font-size="10.5">${esc(modeLabel)}</text>
          </svg>

          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${c.hudAnnotations
              .map(
                (a) =>
                  `<span class="slide-timing-pill" style="color:var(--cyan); border-color:rgba(100,249,255,0.32);">${esc(a)}</span>`
              )
              .join("")}
          </div>
        </div>

        <div class="visor-spec-col">
          <div class="kpi-grid-2x2">
            ${c.kpis
              .map(
                (k) => `
              <div class="kpi-mini">
                <span>${esc(k.label)}</span>
                <strong>${esc(k.val)}</strong>
                <small>${esc(k.note)}</small>
              </div>`
              )
              .join("")}
          </div>

          <div class="card card-amber" style="flex:1;">
            <span class="card-label">OPTICAL VISIBILITY</span>
            <h3>${esc(c.lightingTitle)}</h3>
            <p>${esc(c.lightingDesc)}</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderDroneSlide(slide, c, lang) {
    const droneLbl = lang === "ja" ? "UHF +14 dB 中継 / LIDAR 走査" : "UHF +14 dB RELAY / LIDAR CONE";
    const aheadLbl = lang === "ja" ? "宇宙飛行士の前方 18 m" : "18 m AHEAD OF CREW";

    return `
      ${renderSlideHeader(slide, c)}
      <div class="drone-layout">
        <div class="drone-visual-card">
          <span class="card-label">${esc(aheadLbl)}</span>
          <svg viewBox="0 0 380 285" width="100%" height="238" role="img" aria-label="Ingenuity Coaxial Scout Drone and LIDAR Cone">
            <defs>
              <linearGradient id="lidarBeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#64f9ff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#64f9ff" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <!-- Ascending UHF relay waves -->
            <path d="M148 54 Q190 26 232 54" fill="none" stroke="#ffb84a" stroke-width="2" opacity="0.8" />
            <path d="M126 38 Q190 2 254 38" fill="none" stroke="#ffb84a" stroke-width="1.6" stroke-dasharray="5 4" opacity="0.55" />
            <text x="190" y="20" text-anchor="middle" fill="#ffb84a" font-family="monospace" font-size="11">+14 dB UHF LINK</text>

            <!-- Downward LIDAR Scan Cone -->
            <polygon points="190,115 95,256 285,256" fill="url(#lidarBeam)" />
            <line x1="190" y1="115" x2="95" y2="256" stroke="#64f9ff" stroke-width="1.2" stroke-dasharray="4 4" />
            <line x1="190" y1="115" x2="285" y2="256" stroke="#64f9ff" stroke-width="1.2" stroke-dasharray="4 4" />
            <ellipse cx="190" cy="256" rx="95" ry="15" fill="rgba(100,249,255,0.12)" stroke="#64f9ff" stroke-width="1.3" />

            <!-- Coaxial Dual Rotors -->
            <ellipse cx="190" cy="70" rx="86" ry="7" fill="rgba(100,249,255,0.22)" stroke="#64f9ff" stroke-width="1.8" />
            <ellipse cx="190" cy="82" rx="78" ry="6" fill="rgba(0,245,212,0.16)" stroke="#00f5d4" stroke-width="1.5" />
            <!-- Mast & Solar Panel -->
            <rect x="164" y="54" width="52" height="7" rx="2" fill="#23486e" stroke="#64f9ff" stroke-width="1" />
            <line x1="190" y1="61" x2="190" y2="96" stroke="#f0f9ff" stroke-width="3" />
            <!-- Fuselage Cube -->
            <rect x="172" y="96" width="36" height="24" rx="5" fill="#d9a154" stroke="#f0f9ff" stroke-width="1.2" />
            <circle cx="190" cy="108" r="5" fill="#64f9ff" />
            <!-- 4 Landing Legs -->
            <line x1="175" y1="118" x2="152" y2="146" stroke="#93b8cc" stroke-width="2" />
            <line x1="205" y1="118" x2="228" y2="146" stroke="#93b8cc" stroke-width="2" />
          </svg>
          <span class="mono-stat" style="font-size:12px;">${esc(droneLbl)}</span>
        </div>

        <div class="drone-cards-grid">
          ${c.droneSpecs
            .map(
              (s) => `
            <div class="card">
              <span class="card-label">${esc(s.tag)}</span>
              <h3 class="mono-stat" style="font-size:20px;">${esc(s.val)}</h3>
              <p>${esc(s.desc)}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderScienceSlide(slide, c, lang) {
    const spectrumTitle = lang === "ja" ? "Cheyava Falls NIR 吸収帯 (1.41 · 1.91 · 2.21 · 2.32 µm)" : "Cheyava Falls NIR Bands (1.41 · 1.91 · 2.21 · 2.32 µm)";
    const oxides = [
      { sym: "SiO₂", w: "58.4%", label: "58.4%" },
      { sym: "FeO", w: "14.2%", label: "14.2%" },
      { sym: "MgO", w: "8.6%", label: "8.6%" },
      { sym: "H₂O/CO₂", w: "6.4%", label: "6.4%" },
      { sym: "Al₂O₃", w: "6.1%", label: "6.1%" },
      { sym: "CaO", w: "3.9%", label: "3.9%" },
      { sym: "SO₃", w: "2.4%", label: "2.4%" }
    ];

    return `
      ${renderSlideHeader(slide, c)}
      <div class="science-layout">
        <div class="outcrops-ledger">
          <div class="col-heading" style="color:var(--green);">● ${esc(c.tableHeading)}</div>
          ${c.outcrops
            .map(
              (o) => `
            <div class="outcrop-row">
              <span class="outcrop-name">${esc(o.name)}</span>
              <span class="outcrop-mineral">${esc(o.mineral)}</span>
              <span class="outcrop-score">${esc(o.score)}</span>
            </div>`
            )
            .join("")}
        </div>

        <div class="col-stack">
          <div class="card card-green">
            <span class="card-label">${esc(c.lockLabel)}</span>
            <h3>${esc(c.lockTitle)}</h3>
            <p>${esc(c.lockDesc)}</p>
          </div>

          <div class="card">
            <span class="card-label">7 OXIDE GEOCHEMICAL BANDS</span>
            <div class="oxide-bars">
              ${oxides
                .map(
                  (ox) => `
                <div class="oxide-row">
                  <span style="color:var(--cyan);">${esc(ox.sym)}</span>
                  <div class="oxide-track"><div class="oxide-fill" style="width:${ox.w};"></div></div>
                  <span style="color:var(--text-muted); text-align:right;">${esc(ox.label)}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>

          <div class="card">
            <span class="card-label">${esc(spectrumTitle)}</span>
            <svg viewBox="0 0 360 72" width="100%" height="58" role="img" aria-label="0.8 to 2.6 micrometer NIR curve">
              <path d="M12 22 C44 16, 72 18, 96 42 C112 58, 126 24, 165 20 C192 18, 206 54, 224 52 C244 50, 260 22, 286 24 C306 26, 316 44, 348 26"
                    fill="none" stroke="#57ff9a" stroke-width="2.4" />
              <text x="108" y="67" fill="#64f9ff" font-family="monospace" font-size="9">1.41µm</text>
              <text x="205" y="67" fill="#64f9ff" font-family="monospace" font-size="9">1.91µm</text>
              <text x="292" y="67" fill="#ffb84a" font-family="monospace" font-size="9">2.21–2.32µm</text>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  function renderAiSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="ai-layout">
        <div class="ai-banner">
          <div>
            <span class="card-label" style="display:block; margin-bottom:3px;">${esc(c.bannerLeftTitle)}</span>
            <p style="font-size:12.3px; color:var(--text-muted); line-height:1.42;">${esc(c.bannerLeftDesc)}</p>
          </div>
          <div>
            <span class="card-label" style="color:var(--amber); display:block; margin-bottom:3px;">${esc(c.bannerRightTitle)}</span>
            <p style="font-size:12.3px; color:var(--text-muted); line-height:1.42;">${esc(c.bannerRightDesc)}</p>
          </div>
        </div>

        <div class="anomaly-grid">
          ${c.anomalies
            .map(
              (a) => `
            <div class="anomaly-card ${a.critical ? "critical" : ""}">
              <div class="anomaly-head">
                <span class="anomaly-code">${esc(a.code)}</span>
              </div>
              <div>
                <h3 style="font-size:15.5px; color:var(--text-main); margin-bottom:3px;">${esc(a.title)}</h3>
                <p style="font-size:12px; color:var(--text-muted); font-family:var(--font-mono);">${esc(a.telemetry)}</p>
              </div>
              <div class="anomaly-action">${esc(a.action)}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderRoadmapSlide(slide, c) {
    return `
      ${renderSlideHeader(slide, c)}
      <div class="roadmap-layout">
        <div class="stack-badges">
          ${c.stackCards
            .map(
              (s) => `
            <div class="kpi-mini">
              <span>${esc(s.label)}</span>
              <strong>${esc(s.val)}</strong>
              <small>${esc(s.note)}</small>
            </div>`
            )
            .join("")}
        </div>

        <div class="horizon-grid">
          ${c.horizons
            .map(
              (h, idx) => `
            <div class="card ${idx === 1 ? "card-amber" : idx === 2 ? "card-green" : ""}">
              <span class="card-label">${esc(h.phase)}</span>
              <h3>${esc(h.title)}</h3>
              <p>${esc(h.desc)}</p>
            </div>`
            )
            .join("")}
        </div>

        <div class="cta-banner">
          <div>
            <h3 style="font-size:17px; color:var(--text-main); margin-bottom:3px;">${esc(c.ctaTitle)}</h3>
            <p style="font-size:12.5px; color:var(--text-muted);">${esc(c.ctaSub)}</p>
          </div>
          <a class="cta-url" href="http://127.0.0.1:8000" target="_blank" rel="noopener noreferrer">
            ${esc(c.ctaButton)}
          </a>
        </div>
      </div>
    `;
  }

  function toggleNotes(forceState) {
    const show = typeof forceState === "boolean" ? forceState : el.notesDrawer.classList.contains("hidden");
    el.notesDrawer.classList.toggle("hidden", !show);
    el.btnNotes.classList.toggle("active", show);
  }

  function toggleOverview(forceState) {
    const show = typeof forceState === "boolean" ? forceState : el.overviewModal.classList.contains("hidden");
    el.overviewModal.classList.toggle("hidden", !show);
    el.btnOverview.classList.toggle("active", show);
    if (show) renderOverviewGrid();
  }

  function renderOverviewGrid() {
    el.overviewGrid.innerHTML = DATA.slides
      .map((slide, idx) => {
        const c = slide[currentLang];
        return `
        <button type="button" class="overview-card ${idx === currentIndex ? "active" : ""}" data-idx="${idx}">
          <span class="overview-num">${pad2(idx + 1)} · ${esc(slide.timing)}</span>
          <strong>${esc(c.shortTitle || slide.badge)}</strong>
          <span>${esc(slide.badge)}</span>
        </button>`;
      })
      .join("");

    el.overviewGrid.querySelectorAll(".overview-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        toggleOverview(false);
        goToSlide(idx, true);
      });
    });
  }

  function updateOverviewHighlight() {
    if (el.overviewModal.classList.contains("hidden")) return;
    el.overviewGrid.querySelectorAll(".overview-card").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === currentIndex);
    });
  }

  function populatePrintDeck() {
    el.printDeck.innerHTML = DATA.slides
      .map(
        (slide) => `
      <section class="print-slide">
        ${buildSlideMarkup(slide, currentLang)}
      </section>`
      )
      .join("");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function updateFullscreenLabel() {
    const ui = DATA.ui[currentLang];
    const span = el.btnFullscreen.querySelector("[data-ui]");
    if (span) {
      span.textContent = document.fullscreenElement ? ui.btnExitFullscreen : ui.btnFullscreen;
    }
  }

  function initNeonWavesBackdrop() {
    const canvas = el.bgCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    let w = 0;
    let h = 0;
    let phase = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(w * 0.5, h * 0.85, 20, w * 0.5, h * 0.85, w * 0.65);
      grad.addColorStop(0, "rgba(255, 184, 74, 0.14)");
      grad.addColorStop(0.5, "rgba(100, 249, 255, 0.06)");
      grad.addColorStop(1, "rgba(5, 8, 15, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const rows = 9;
      const baseTop = h * 0.62;
      for (let r = 0; r < rows; r++) {
        const ratio = r / (rows - 1);
        const yBase = baseTop + ratio * (h * 0.36);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 26) {
          const ridge =
            Math.sin(x * 0.0055 + phase + r * 0.55) * 14 +
            Math.cos(x * 0.011 - phase * 0.7 + r) * 6;
          const y = yBase + ridge * (0.45 + ratio * 0.6);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          r % 3 === 0
            ? `rgba(255, 184, 74, ${(0.09 + ratio * 0.15).toFixed(3)})`
            : `rgba(100, 249, 255, ${(0.08 + ratio * 0.16).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      if (!reduceMotion) {
        phase += 0.012;
        window.requestAnimationFrame(drawFrame);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    drawFrame();
  }

  function bindEvents() {
    el.btnPrev.addEventListener("click", () => goToSlide(currentIndex - 1));
    el.btnNext.addEventListener("click", () => goToSlide(currentIndex + 1));

    el.btnLangEn.addEventListener("click", () => setLanguage("en"));
    el.btnLangJa.addEventListener("click", () => setLanguage("ja"));

    el.btnNotes.addEventListener("click", () => toggleNotes());
    el.btnCloseNotes.addEventListener("click", () => toggleNotes(false));

    el.btnOverview.addEventListener("click", () => toggleOverview());
    el.btnCloseOverview.addEventListener("click", () => toggleOverview(false));
    el.overviewModal.addEventListener("click", (ev) => {
      if (ev.target === el.overviewModal) toggleOverview(false);
    });

    el.btnFullscreen.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenLabel);

    el.btnPrint.addEventListener("click", () => {
      populatePrintDeck();
      window.print();
    });
    window.addEventListener("beforeprint", populatePrintDeck);

    window.addEventListener("keydown", (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const key = ev.key;

      if (key === "Escape") {
        if (!el.overviewModal.classList.contains("hidden")) toggleOverview(false);
        else if (!el.notesDrawer.classList.contains("hidden")) toggleNotes(false);
        return;
      }

      if (key === "ArrowRight" || key === "PageDown" || key === " ") {
        ev.preventDefault();
        goToSlide(currentIndex + 1);
      } else if (key === "ArrowLeft" || key === "PageUp") {
        ev.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (key === "Home") {
        ev.preventDefault();
        goToSlide(0);
      } else if (key === "End") {
        ev.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
      } else if (key === "n" || key === "N") {
        toggleNotes();
      } else if (key === "g" || key === "G") {
        toggleOverview();
      } else if (key === "l" || key === "L") {
        setLanguage(currentLang === "en" ? "ja" : "en");
      } else if (key === "f" || key === "F") {
        toggleFullscreen();
      } else if (key === "p" || key === "P") {
        populatePrintDeck();
        window.print();
      }
    });

    let touchStartX = null;
    el.frame.addEventListener("touchstart", (ev) => {
      if (ev.touches.length === 1) touchStartX = ev.touches[0].clientX;
    }, { passive: true });
    el.frame.addEventListener("touchend", (ev) => {
      if (touchStartX === null || ev.changedTouches.length !== 1) return;
      const dx = ev.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 55) {
        goToSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });
  }

  initNeonWavesBackdrop();
  bindEvents();
  setLanguage(currentLang);
})();
