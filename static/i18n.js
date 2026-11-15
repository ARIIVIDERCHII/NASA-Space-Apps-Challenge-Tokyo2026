
export const I18N = {
  ru: {
    page_title: 'NASA SEXTANT + xEMU AR • Система марсианской вылазки (Space Apps #11)',
    brand_sub: 'КРАТЕР ЕЗЕРО • КАНЬОН НЕРЕТВА (18.38°N, 77.58°E)',

    phase_orbital: 'ОРБИТА',
    phase_orbital_title: 'Переключить ракурс: 3D-орбита / строго сверху 90°',
    phase_drone: 'ДРОН INGENUITY',
    phase_drone_title: 'Камера разведывательного вертолёта Ingenuity (высота 18 м)',
    phase_visor: 'ВИЗОР СКАФАНДРА',
    phase_visor_title: 'Погружение камеры в шлем астронавта (1.8 м)',

    lighting_title: 'Режим солнечного освещения и ночного LIDAR-визора',
    sol_day: 'ДЕНЬ',
    sol_sunset: 'ЗАКАТ',
    sol_night: 'НОЧЬ / LIDAR',
    lang_title: 'Переключение языка интерфейса (RU / EN / JA)',

    btn_top_ai: 'ИИ АРИЯ',
    btn_top_ai_title: 'Открыть бортовой ИИ-ассистент скафандра ARIA-9 (вопросы и нештатные ситуации)',
    btn_top_compare: 'НАПРЯМИК vs A*',
    btn_top_compare_title: 'Показать/скрыть сравнение прямого пути через обрывы и умного маршрута SEXTANT A*',
    btn_emergency_normal: 'БУРЯ / РАДИАЦИЯ',
    btn_emergency_active: 'ОТБОЙ ТРЕВОГИ (ШТАТНЫЙ)',
    btn_start_eva: 'НАЧАТЬ ВЫХОД (EVA)',
    btn_return_hq: 'ВЕРНУТЬСЯ В ШТАБ',

    restore_left: 'ОТКРЫТЬ ПЛАНИРОВЩИК И СЛОИ',
    restore_right: 'ОТКРЫТЬ СРАВНЕНИЕ A* И ТЕЛЕМЕТРИЮ',
    btn_collapse: '— СВЕРНУТЬ',

    left_mod_tag: 'МОДУЛЬ 01 // НАВИГАЦИЯ',
    left_win_title_layers: 'ПЛАНИРОВЩИК SEXTANT A*',
    left_win_title_weights: 'ВЕСА БЕЗОПАСНОСТИ И ТОЧКИ',
    left_win_desc: 'Выберите спутниковый слой НАСА или добавьте путевую точку двойным кликом по 3D-карте.',
    tab_layers: 'Слои и Маршрут',
    tab_weights_prefix: 'Веса A* и Точки',
    sec_nasa_layers: 'СПУТНИКОВЫЕ СЛОИ НАСА (MRO / ODYSSEY)',
    layer_truecolor: 'Рельеф Neon-Mars',
    layer_slope: 'Уклоны и обрывы',
    layer_sand: 'Зыбучий песок',
    layer_minerals: 'Спектры минералов',
    layer_comm: 'Радиовидимость базы',
    layer_hints: {
      truecolor: 'Высотная 3D-сетка каньона Неретва с живой генерацией внешней территории.',
      slope: 'Анализ уклонов HiRISE: зелёный (<9°) безопасен, алый (>19°) — обрыв и риск падения.',
      sand: 'Тепловая инерция THEMIS: оранжевые зоны — рыхлые дюны, повышающие пульс и расход O₂.',
      minerals: 'Спектрометр MRO CRISM: циановые и изумрудные зоны — гидротермальные глины и опал SiO₂.',
      comm: 'Радиовидимость (LOS) 15-метровой мачты базы «Олимп-1»: циан — прямой сигнал UHF.'
    },
    sec_preset: 'СЦЕНАРИЙ ЭКСПЕДИЦИИ',
    drone_card_title: '◈ ДРОН INGENUITY // РЕТРАНСЛЯТОР UHF',
    drone_status_on: 'Высота 18 м впереди • Усиление сигнала +14 dB',
    drone_status_off: 'Ретранслятор отключён • Только прямая радиовидимость базы',
    btn_on: 'ВКЛ',
    btn_off: 'ВЫКЛ',
    btn_recalc: '▸ ПЕРЕСЧИТАТЬ МАРШРУТ A*',
    btn_reset: 'СБРОС',

    sec_weights: 'ВЕСА БЕЗОПАСНОСТИ АЛГОРИТМА SEXTANT A*',
    weight_slope: 'Обход крутых склонов (>15°)',
    weight_sand: 'Обход вязкого песка (THEMIS)',
    weight_comm: 'Удержание радиосвязи с базой',
    sec_waypoints: 'ПУТЕВЫЕ ТОЧКИ (ДВОЙНОЙ КЛИК ПО КАРТЕ)',
    btn_clear_last_wp: '− УДАЛИТЬ ПОСЛЕДНЮЮ ТОЧКУ',
    wp_delete_title: 'Удалить точку',

    route_tag_normal: 'ШТАТНЫЙ SEXTANT A*',
    route_tag_emerg: '[!] АВАРИЙНЫЙ В УКРЫТИЕ',
    right_win_title_telemetry: 'ТЕЛЕМЕТРИЯ И СРАВНЕНИЕ A*',
    right_win_title_crism: 'СПЕКТРЫ MRO CRISM / PIXL',
    right_win_desc: 'Наглядное сравнение опасного прямого пути через обрывы и умного маршрута SEXTANT A*.',
    tab_telemetry: 'Напрямик vs A*',
    tab_crism_prefix: 'Спектры CRISM',

    kpi_dist: 'ДИСТАНЦИЯ A*',
    kpi_time: 'ВРЕМЯ В ПУТИ',
    kpi_climb: 'НАБОР ВЫСОТЫ',
    kpi_max_hr: 'ПИКОВЫЙ ПУЛЬС',
    kpi_o2: 'ОСТАТОК O₂',
    kpi_comm: 'СВЯЗЬ С БАЗОЙ',
    unit_m: 'м',
    unit_min: 'мин',
    unit_lpm: 'л/мин',
    unit_usvh: 'мкЗв/ч',
    unit_watt: 'Вт',
    unit_ms: 'м/с',

    cmp_title: '◈ СРАВНЕНИЕ: НАПРЯМИК vs SEXTANT A*',
    cmp_line_on: '3D ЛИНИЯ: ВКЛ',
    cmp_line_off: '3D ЛИНИЯ: ВЫКЛ',
    cmp_col_metric: 'ПАРАМЕТР ВЫЛАЗКИ',
    cmp_col_naive: 'НАПРЯМИК',
    cmp_col_smart: 'SEXTANT A*',
    cmp_row_o2: 'Остаток кислорода O₂',
    cmp_row_cliffs: 'Опасные обрывы (>19°)',
    cmp_row_hr: 'Макс. уклон / Пик ЧСС',
    cmp_cliffs_count: (n) => `${n} обрывов`,
    cmp_cliffs_bypassed: (n) => `${n} (обойдены)`,
    cmp_verdict: (o2Saved, cliffs, maxSlope) =>
      `Выгода SEXTANT A*: сэкономлено +${o2Saved}% запаса O₂, обойдены ${cliffs} крутых обрывов (до ${maxSlope}°) и зыбучие пески.`,

    chart_title: '◈ ПРОФИЛЬ ВЫСОТ И ПУЛЬСА (КЛИК — ПЕРЕМОТКА)',
    chart_legend_naive: 'Напрямик',
    sec_boulders: 'НАУЧНЫЕ ВАЛУНЫ И ОБНАЖЕНИЯ CRISM / PIXL',
    btn_route_to_boulder: '⌖ ВКЛЮЧИТЬ ЭТОТ ВАЛУН В МАРШРУТ A*',
    sec_warnings: 'АНАЛИЗ РИСКОВ ВДОЛЬ ТРАССЫ',
    warn_safe: '[OK] Маршрут безопасен: критических уклонов и песчаных ловушек нет.',
    boulder_biosig_label: 'Биосигнатура',
    boulder_um: 'мкм',

    orbital_bottom_hint: '<b style="color:var(--cyan);">[NAV]</b> ЛКМ: вращение • ПКМ: сдвиг • Колесо: зум • <strong>Двойной клик по рельефу</strong>: новая точка маршрута',

    hud_heading_prefix: 'КУРС',
    hud_next_wp_prefix: 'ДО ЦЕЛИ',
    emerg_banner_title: '[!] MASTER ALARM: СОЛНЕЧНАЯ ВСПЫШКА SPE X9.4 И ПЫЛЕВАЯ БУРЯ!',
    emerg_banner_sub_default: 'СЛЕДУЙТЕ ПО КРАСНЫМ ШЕВРОНАМ В УКРЫТИЕ!',
    emerg_banner_sub_active: (name, dist) => `АВАРИЙНЫЙ МАРШРУТ В УКРЫТИЕ: ${name.toUpperCase()} (${dist} М)`,

    bio_header: '◈ БИОМЕТРИЯ СКАФАНДРА xEMU',
    bio_hr_label: 'ПУЛЬС АСТРОНАВТА',
    bio_coolant: '▸ ОХЛАЖДЕНИЕ LCVG',
    bio_o2_rate: '▸ РАСХОД КИСЛОРОДА O₂',
    bio_o2_rem: '▸ ЗАПАС БАЛЛОНА O₂',
    tc_slope: 'УКЛОН РЕЛЬЕФА',
    tc_sand: 'ВЯЗКОСТЬ ПЕСКА',
    tc_metabolic: 'МЕТАБОЛИЗМ / ШАГ',
    tc_rad: 'РАДИАЦИЯ',
    slope_sub_word: 'Склон',
    sand_dune: 'Зыбучая дюна!',
    sand_loam: 'Супесь',
    sand_basalt: 'Базальт',

    reticle_ready: 'CRISM/PIXL СКАНЕР ГОТОВ (НАВЕДИТЕ ПРИЦЕЛ НА ВАЛУН)',
    reticle_locked: (name, dist) => `ЗАХВАТ ЦЕЛИ: ${name.toUpperCase()} (${dist} М)`,
    crism_formula_prefix: 'Формула',
    crism_biosig_label: '◈ ИНДЕКС БИОСИГНАТУРЫ:',
    crism_biosig_high: 'ВЫСОЧАЙШИЙ',
    crism_biosig_med: 'СРЕДНИЙ',
    btn_collect_sample: '⌖ ДОБАВИТЬ ЦЕЛЬ В ОТЧЁТ МИССИИ',

    radar_header: '◈ РАДАР 20М И СВЯЗЬ LOS',
    radar_base: 'БАЗА «ОЛИМП-1»:',
    radar_uhf: 'СИГНАЛ UHF:',
    radar_drone: 'ДРОН INGENUITY:',
    radar_max_slope: 'МАКС. УКЛОН (20М):',
    los_vortex: 'ПОМЕХИ ВИХРЯ!',
    los_shadow: (m) => `ТЕНЬ РЕЛЬЕФА (${m}м)`,
    drone_relay_on: 'РЕТРАНСЛЯТОР +14 dB',
    drone_relay_off: 'РЕТРАНСЛЯТОР ВЫКЛ',
    radar_slope_danger: 'ОПАСНЫЙ УКЛОН!',
    radar_slope_norm: 'Норма',

    btn_pause: '❚❚ ПАУЗА',
    btn_walk: '▸ ИДТИ',
    btn_step_prev: '◂ ШАГ',
    btn_step_next: 'ШАГ ▸',
    btn_aim_rock: 'ПРИЦЕЛ НА ВАЛУН',
    btn_flashlight: 'ФОНАРЬ',
    btn_drone_cam: 'КАМЕРА ДРОНА',
    btn_reset_look: '⌖ ПО КУРСУ',
    btn_to_hq: '▴ В ШТАБ',
    step_counter: (cur, total) => `ШАГ ${cur} / ${total}`,

    pin_turn_emerg: (label) => `[!] АВАРИЙНЫЙ ВЫХОД: ${label}`,
    pin_turn_norm: (label) => `⌖ ПОВОРОТ: ${label}`,
    pin_turn_sub: (dist, step) => `Дистанция: ${dist} м • Шаг ${step}`,
    pin_naive_title: (slope) => `▲ НАПРЯМИК: ОБРЫВ ${slope}°`,
    pin_naive_sub: (o2) => `Перерасход O₂ +${o2}% • Обойдено SEXTANT A*`,
    pin_drone_title: '◈ ДРОН INGENUITY',
    pin_drone_sub: 'Высота 18м • Ретранслятор UHF',
    pin_base_title: '◈ БАЗА «ОЛИМП-1» (HAB)',
    pin_base_sub: 'Мачта связи 15м',
    pin_shelter_sub: (pct) => `Защита от радиации ${pct}%`,
    pin_boulder_sub: (pct) => `Биосигнатура: ${pct}%`,

    ai_mini_label: 'ARIA-9 // ИИ:',
    ai_mini_ticker_default: 'Все системы скафандра xEMU в норме. Готова ответить на любой вопрос или перехватить управление при ЧП.',
    btn_open_ai_chat: '◈ СПРОСИТЬ ИИ',
    btn_trigger_anomaly: '▲ ВЫЗВАТЬ ЧП',
    ai_badge_nominal: 'ARIA-9 // БОРТОВОЙ НЕЙРО-ИИ xEMU [NOMINAL]',
    ai_badge_alert: '[!] ARIA-9 // ПЕРЕХВАТ УПРАВЛЕНИЯ: НЕШТАТНОЕ ЧП!',
    ai_chip_hr: (hr) => `ЧСС: ${hr} BPM`,
    ai_chip_status_alert: '[!] СТАТУС: ЧП АКТИВНО',
    ai_chip_status_warn: (slope, sand) => `▲ УКЛОН ${slope}° / ПЕСОК ${sand}%`,
    ai_chip_status_nom: 'СТАТУС: NOMINAL',

    ai_init_cat: '// КАНАЛ ТАКТИЧЕСКОЙ ПОДДЕРЖКИ АСТРОНАВТА',
    ai_init_title: 'БОРТОВОЙ ИИ ARIA-9 НА СВЯЗИ',
    ai_init_text: 'Я непрерывно анализирую биометрию скафандра PLSS, уклоны HiRISE, пески THEMIS и спектры минералов CRISM. Задайте мне любой вопрос или протестируйте реакцию на нештатные аварии во время вылазки.',
    ai_sec_ask: 'ЗАДАТЬ ЛЮБОЙ ВОПРОС БОРТОВОМУ ИИ',
    ai_input_placeholder: 'Спросите что угодно: сколько кислорода, что впереди, какие камни рядом, как спастись...',
    btn_ai_send: 'ОТПРАВИТЬ',

    ai_q_suit: '▸ Статус скафандра и O₂',
    ai_q_ahead: '▸ Что впереди по курсу?',
    ai_q_minerals: '▸ Ближайшие минералы',
    ai_q_compare: '▸ Выгода пути A*',
    ai_q_shelter: '▸ Ближайшее укрытие',
    ai_q_weather: '▸ Сводка среды Марса',

    ai_sec_anomalies: '◈ СИМУЛЯТОР ВНЕШТАТНЫХ СИТУАЦИЙ (КОГДА ЧТО-ТО ИДЁТ НЕ ПО ПЛАНУ)',
    anom_1_title: '[01] Обвал породы на тропе',
    anom_1_sub: 'Завал пути впереди + авто-обход A*',
    anom_2_title: '[02] Сбой охлаждения и утечка O₂',
    anom_2_sub: 'Скачок ЧСС до 162 BPM + резервный контур',
    anom_3_title: '[03] Пылевой вихрь (Потеря связи)',
    anom_3_sub: '3D-торнадо + перехват через дрон Ingenuity',
    anom_4_title: '[04] Солнечная вспышка SPE X9.4',
    anom_4_sub: 'Критическая радиация + эвакуация в укрытие',

    toast_drone_cam: '[INGENUITY] Камера дрона (ЛКМ: вращение 360° • Колесо: зум)',
    toast_visor_cam: '[xEMU HUD] Вид от 1-го лица из шлема (ЛКМ: свободный осмотр 360°)',
    toast_naive_on: '◈ На 3D-карте показан опасный прямой путь «Напрямик» (красный пунктир)',
    toast_naive_off: '◈ Линия прямого пути «Напрямик» скрыта',
    toast_sol_day: '[SOL] Режим освещения: Марсианский день (Sol Nominal)',
    toast_sol_sunset: '[SOL] Режим освещения: Сумеречный закат в кратере Езеро',
    toast_sol_night: '[LIDAR] Ночной режим: включён LIDAR-визор и нашлемный прожектор',
    toast_emerg_route: (name) => `[!] АВАРИЙНЫЙ ПРОТОКОЛ: Маршрут в «${name}» построен!`,
    toast_wp_added: (label) => `⌖ Добавлена точка маршрута: ${label}`,
    toast_route_recalc: '▸ Маршрут SEXTANT A* пересчитан',
    toast_wp_removed: (label) => `− Удалена точка: ${label}`,
    toast_min_wp: '[INFO] Для маршрута нужны минимум 2 точки (Старт и Финиш)',
    toast_preset_reset: '◈ Маршрут сброшен к исходному пресету',
    toast_relay_on: '[INGENUITY] Ретранслятор включён (+14 dB UHF)',
    toast_relay_off: '[INGENUITY] Ретранслятор отключён',
    toast_orbit_top: '[ОРБИТА] Ракурс камеры: Строго сверху (90°)',
    toast_orbit_3d: '[ОРБИТА] Ракурс камеры: Наклонная 3D-орбита',
    toast_torch_on: '[LIDAR] Нашлемный прожектор ВКЛЮЧЁН',
    toast_torch_off: '[LIDAR] Нашлемный прожектор ВЫКЛЮЧЕН',
    toast_sample_saved: (name) => `⌖ Научная цель «${name}» зафиксирована в отчёте миссии!`,
    toast_lang_switched: '◈ Язык интерфейса: Русский (RU)'
  },

  en: {
    page_title: 'NASA SEXTANT + xEMU AR • Mars EVA Navigation System (Space Apps #11)',
    brand_sub: 'JEZERO CRATER • NERETVA VALLIS (18.38°N, 77.58°E)',

    phase_orbital: 'ORBIT',
    phase_orbital_title: 'Toggle camera view: 3D Orbit / Strict 90° Top-Down',
    phase_drone: 'INGENUITY DRONE',
    phase_drone_title: 'Ingenuity scout helicopter camera (18 m altitude)',
    phase_visor: 'SUIT VISOR',
    phase_visor_title: 'First-person helmet visor camera dive (1.8 m)',

    lighting_title: 'Solar illumination & night LIDAR visor mode',
    sol_day: 'DAY',
    sol_sunset: 'SUNSET',
    sol_night: 'NIGHT / LIDAR',
    lang_title: 'Switch telemetry interface language (RU / EN / JA)',

    btn_top_ai: 'AI ARIA',
    btn_top_ai_title: 'Open xEMU onboard AI copilot ARIA-9 (Q&A & anomaly simulator)',
    btn_top_compare: 'DIRECT vs A*',
    btn_top_compare_title: 'Show/hide comparison between hazardous direct path and smart SEXTANT A* route',
    btn_emergency_normal: 'STORM / RADIATION',
    btn_emergency_active: 'CLEAR ALARM (NOMINAL)',
    btn_start_eva: 'START EVA',
    btn_return_hq: 'RETURN TO ORBIT',

    restore_left: 'OPEN PLANNER & LAYERS',
    restore_right: 'OPEN A* COMPARISON & TELEMETRY',
    btn_collapse: '— MINIMIZE',

    left_mod_tag: 'MODULE 01 // NAVIGATION',
    left_win_title_layers: 'SEXTANT A* ROUTE PLANNER',
    left_win_title_weights: 'SAFETY WEIGHTS & WAYPOINTS',
    left_win_desc: 'Select a NASA orbital data layer or double-click on the 3D terrain to add a waypoint.',
    tab_layers: 'Layers & Route',
    tab_weights_prefix: 'A* Weights & Pts',
    sec_nasa_layers: 'NASA ORBITAL LAYERS (MRO / ODYSSEY)',
    layer_truecolor: 'Neon-Mars Elevation',
    layer_slope: 'Slopes & Cliffs',
    layer_sand: 'Loose Sand Traps',
    layer_minerals: 'Hydrated Minerals',
    layer_comm: 'Base Radio LOS',
    layer_hints: {
      truecolor: 'MOLA 3D elevation mesh of Neretva Vallis with real-time procedural outer terrain.',
      slope: 'HiRISE slope hazard map: green (<9°) safe grade, crimson (>19°) steep cliff hazard.',
      sand: 'THEMIS thermal inertia: orange zones mark high-slip sand dunes that spike HR & O₂ burn.',
      minerals: 'MRO CRISM spectrometer: cyan & emerald zones reveal hydrothermal clays and opaline SiO₂.',
      comm: 'Line-of-Sight (LOS) to Olympus-1 Base 15m mast: cyan indicates direct UHF coverage.'
    },
    sec_preset: 'EXPEDITION SCENARIO',
    drone_card_title: '◈ INGENUITY DRONE // UHF RELAY',
    drone_status_on: '18 m altitude ahead • Signal gain +14 dB',
    drone_status_off: 'Relay disabled • Direct base line-of-sight only',
    btn_on: 'ON',
    btn_off: 'OFF',
    btn_recalc: '▸ RECALCULATE A* ROUTE',
    btn_reset: 'RESET',

    sec_weights: 'SEXTANT A* SAFETY COST WEIGHTS',
    weight_slope: 'Avoid steep slopes (>15°)',
    weight_sand: 'Avoid loose sand (THEMIS)',
    weight_comm: 'Maintain base UHF comm link',
    sec_waypoints: 'WAYPOINTS (DOUBLE-CLICK ON 3D MAP)',
    btn_clear_last_wp: '− REMOVE LAST WAYPOINT',
    wp_delete_title: 'Remove waypoint',

    route_tag_normal: 'NOMINAL SEXTANT A*',
    route_tag_emerg: '[!] EMERGENCY SHELTER EGRESS',
    right_win_title_telemetry: 'TELEMETRY & A* COMPARISON',
    right_win_title_crism: 'MRO CRISM / PIXL SPECTRA',
    right_win_desc: 'Side-by-side comparison between a hazardous direct path over cliffs and the smart SEXTANT A* route.',
    tab_telemetry: 'Direct vs A*',
    tab_crism_prefix: 'CRISM Spectra',

    kpi_dist: 'A* DISTANCE',
    kpi_time: 'EST. EVA TIME',
    kpi_climb: 'TOTAL CLIMB',
    kpi_max_hr: 'PEAK HEART RATE',
    kpi_o2: 'FINAL O₂ RESERVE',
    kpi_comm: 'BASE COMM LOS',
    unit_m: 'm',
    unit_min: 'min',
    unit_lpm: 'L/min',
    unit_usvh: 'µSv/h',
    unit_watt: 'W',
    unit_ms: 'm/s',

    cmp_title: '◈ COMPARISON: DIRECT vs SEXTANT A*',
    cmp_line_on: '3D LINE: ON',
    cmp_line_off: '3D LINE: OFF',
    cmp_col_metric: 'EVA METRIC',
    cmp_col_naive: 'DIRECT',
    cmp_col_smart: 'SEXTANT A*',
    cmp_row_o2: 'Remaining O₂ Reserve',
    cmp_row_cliffs: 'Steep Cliff Hazards (>19°)',
    cmp_row_hr: 'Max Slope / Peak HR',
    cmp_cliffs_count: (n) => `${n} cliffs`,
    cmp_cliffs_bypassed: (n) => `${n} (bypassed)`,
    cmp_verdict: (o2Saved, cliffs, maxSlope) =>
      `SEXTANT A* Advantage: saved +${o2Saved}% O₂ reserve, bypassed ${cliffs} steep cliffs (up to ${maxSlope}°) and sand traps.`,

    chart_title: '◈ ELEVATION & HR PROFILE (CLICK TO SCRUB)',
    chart_legend_naive: 'Direct',
    sec_boulders: 'CRISM / PIXL SCIENCE BOULDERS & OUTCROPS',
    btn_route_to_boulder: '⌖ ADD THIS BOULDER TO A* ROUTE',
    sec_warnings: 'TRAVERSE HAZARD LOG',
    warn_safe: '[OK] Route is clear: no critical cliff slopes or deep sand traps detected.',
    boulder_biosig_label: 'Biosignature',
    boulder_um: 'µm',

    orbital_bottom_hint: '<b style="color:var(--cyan);">[NAV]</b> LMB: Rotate • RMB: Pan • Scroll: Zoom • <strong>Double-click terrain</strong>: Add waypoint',

    hud_heading_prefix: 'HDG',
    hud_next_wp_prefix: 'TO WP',
    emerg_banner_title: '[!] MASTER ALARM: SOLAR PARTICLE EVENT SPE X9.4 & DUST STORM!',
    emerg_banner_sub_default: 'FOLLOW RED CHEVRONS TO NEAREST RADIATION SHELTER!',
    emerg_banner_sub_active: (name, dist) => `EMERGENCY EGRESS TO SHELTER: ${name.toUpperCase()} (${dist} M)`,

    bio_header: '◈ xEMU SUIT BIOMETRICS',
    bio_hr_label: 'ASTRONAUT HEART RATE',
    bio_coolant: '▸ LCVG COOLANT LOOP',
    bio_o2_rate: '▸ O₂ CONSUMPTION RATE',
    bio_o2_rem: '▸ PRIMARY O₂ TANK',
    tc_slope: 'TERRAIN GRADE',
    tc_sand: 'SAND SLIP INDEX',
    tc_metabolic: 'METABOLIC / PACE',
    tc_rad: 'RADIATION DOSE',
    slope_sub_word: 'Slope',
    sand_dune: 'Sand Trap!',
    sand_loam: 'Silty Sand',
    sand_basalt: 'Basalt',

    reticle_ready: 'CRISM/PIXL SCANNER READY (AIM RETICLE AT BOULDER)',
    reticle_locked: (name, dist) => `TARGET LOCK: ${name.toUpperCase()} (${dist} M)`,
    crism_formula_prefix: 'Formula',
    crism_biosig_label: '◈ BIOSIGNATURE INDEX:',
    crism_biosig_high: 'HIGHEST',
    crism_biosig_med: 'MODERATE',
    btn_collect_sample: '⌖ LOG TARGET IN MISSION REPORT',

    radar_header: '◈ 20M HAZARD RADAR & LOS',
    radar_base: 'OLYMPUS-1 BASE:',
    radar_uhf: 'UHF SIGNAL:',
    radar_drone: 'INGENUITY DRONE:',
    radar_max_slope: 'MAX SLOPE (20M):',
    los_vortex: 'VORTEX INTERFERENCE!',
    los_shadow: (m) => `TERRAIN SHADOW (${m}m)`,
    drone_relay_on: 'UHF RELAY +14 dB',
    drone_relay_off: 'RELAY OFFLINE',
    radar_slope_danger: 'STEEP CLIFF!',
    radar_slope_norm: 'Nominal',

    btn_pause: '❚❚ PAUSE',
    btn_walk: '▸ WALK',
    btn_step_prev: '◂ STEP',
    btn_step_next: 'STEP ▸',
    btn_aim_rock: 'AIM AT BOULDER',
    btn_flashlight: 'TORCH',
    btn_drone_cam: 'DRONE CAM',
    btn_reset_look: '⌖ CENTER VIEW',
    btn_to_hq: '▴ TO ORBIT',
    step_counter: (cur, total) => `STEP ${cur} / ${total}`,

    pin_turn_emerg: (label) => `[!] EMERGENCY EGRESS: ${label}`,
    pin_turn_norm: (label) => `⌖ WAYPOINT: ${label}`,
    pin_turn_sub: (dist, step) => `Distance: ${dist} m • Step ${step}`,
    pin_naive_title: (slope) => `▲ DIRECT PATH: CLIFF ${slope}°`,
    pin_naive_sub: (o2) => `Extra O₂ burn +${o2}% • Bypassed by SEXTANT A*`,
    pin_drone_title: '◈ INGENUITY DRONE',
    pin_drone_sub: 'Alt 18m • UHF Relay Active',
    pin_base_title: '◈ OLYMPUS-1 BASE (HAB)',
    pin_base_sub: '15m High-Gain Comm Mast',
    pin_shelter_sub: (pct) => `Radiation shielding ${pct}%`,
    pin_boulder_sub: (pct) => `Biosignature: ${pct}%`,

    ai_mini_label: 'ARIA-9 // AI:',
    ai_mini_ticker_default: 'All xEMU suit systems nominal. Ready to answer any question or execute autonomous emergency protocols.',
    btn_open_ai_chat: '◈ ASK AI',
    btn_trigger_anomaly: '▲ TRIGGER ANOMALY',
    ai_badge_nominal: 'ARIA-9 // xEMU ONBOARD NEURAL AI [NOMINAL]',
    ai_badge_alert: '[!] ARIA-9 // OVERRIDE ACTIVE: EMERGENCY ANOMALY!',
    ai_chip_hr: (hr) => `HR: ${hr} BPM`,
    ai_chip_status_alert: '[!] STATUS: ANOMALY ACTIVE',
    ai_chip_status_warn: (slope, sand) => `▲ SLOPE ${slope}° / SAND ${sand}%`,
    ai_chip_status_nom: 'STATUS: NOMINAL',

    ai_init_cat: '// ASTRONAUT TACTICAL SUPPORT CHANNEL',
    ai_init_title: 'ONBOARD AI ARIA-9 ONLINE',
    ai_init_text: 'I continuously monitor PLSS suit biometrics, HiRISE slopes, THEMIS sand traps, and CRISM mineral spectra. Ask me any question or test autonomous emergency response protocols during the EVA.',
    ai_sec_ask: 'ASK ONBOARD AI COPILOT ANY QUESTION',
    ai_input_placeholder: 'Ask anything: O2 reserve, terrain ahead, nearby CRISM minerals, nearest shelter...',
    btn_ai_send: 'SEND',

    ai_q_suit: '▸ Suit & O₂ Status',
    ai_q_ahead: '▸ What is ahead on route?',
    ai_q_minerals: '▸ Nearby CRISM Minerals',
    ai_q_compare: '▸ Why SEXTANT A* route?',
    ai_q_shelter: '▸ Nearest Radiation Shelter',
    ai_q_weather: '▸ Jezero Weather & Dose',

    ai_sec_anomalies: '◈ OFF-NOMINAL ANOMALY SIMULATOR (WHEN THINGS GO WRONG)',
    anom_1_title: '[01] Canyon Rim Rockfall',
    anom_1_sub: 'Path blocked ahead + auto A* detour',
    anom_2_title: '[02] LCVG Coolant & O₂ Fault',
    anom_2_sub: 'HR spike to 162 BPM + backup pump loop',
    anom_3_title: '[03] Dust Devil (Comm Loss)',
    anom_3_sub: '3D vortex + Ingenuity drone relay switch',
    anom_4_title: '[04] Solar Flare SPE X9.4',
    anom_4_sub: 'Critical radiation + shelter evacuation',

    toast_drone_cam: '[INGENUITY] Drone camera active (LMB: 360° orbit • Scroll: zoom)',
    toast_visor_cam: '[xEMU HUD] First-person helmet visor (LMB: 360° free look)',
    toast_naive_on: '◈ Hazardous direct path shown on 3D map (red dashed line)',
    toast_naive_off: '◈ Direct path comparison line hidden',
    toast_sol_day: '[SOL] Illumination mode: Martian Day (Sol Nominal)',
    toast_sol_sunset: '[SOL] Illumination mode: Jezero Crater Twilight Sunset',
    toast_sol_night: '[LIDAR] Night mode: LIDAR terrain mesh & helmet torch enabled',
    toast_emerg_route: (name) => `[!] EMERGENCY PROTOCOL: Egress route to "${name}" plotted!`,
    toast_wp_added: (label) => `⌖ Waypoint added: ${label}`,
    toast_route_recalc: '▸ SEXTANT A* route recalculated',
    toast_wp_removed: (label) => `− Waypoint removed: ${label}`,
    toast_min_wp: '[INFO] At least 2 waypoints are required (Start & Finish)',
    toast_preset_reset: '◈ Route reset to mission preset',
    toast_relay_on: '[INGENUITY] UHF Relay enabled (+14 dB gain)',
    toast_relay_off: '[INGENUITY] UHF Relay disabled',
    toast_orbit_top: '[ORBIT] Camera view: Strict Top-Down (90°)',
    toast_orbit_3d: '[ORBIT] Camera view: Oblique 3D Orbit',
    toast_torch_on: '[LIDAR] Helmet spotlight ENABLED',
    toast_torch_off: '[LIDAR] Helmet spotlight DISABLED',
    toast_sample_saved: (name) => `⌖ Science target "${name}" logged in mission report!`,
    toast_lang_switched: '◈ Interface language: English (EN)'
  },

  ja: {
    page_title: 'NASA SEXTANT + xEMU AR • 火星船外活動ナビゲーション (Space Apps #11)',
    brand_sub: 'ジェゼロ・クレーター • ネレトヴァ渓谷 (18.38°N, 77.58°E)',

    phase_orbital: '軌道視点',
    phase_orbital_title: 'カメラ視点切替：3D軌道 / 垂直90°トップダウン',
    phase_drone: 'インジェニュイティ機',
    phase_drone_title: '偵察ヘリ「インジェニュイティ」カメラ（高度18m）',
    phase_visor: '宇宙服バイザー',
    phase_visor_title: '宇宙飛行士ヘルメット1人称視点（高度1.8m）',

    lighting_title: '日照モードおよび夜間LIDARバイザー切替',
    sol_day: '昼 (SOL)',
    sol_sunset: '夕暮れ',
    sol_night: '夜間 / LIDAR',
    lang_title: 'テレメトリ表示言語の切替 (RU / EN / JA)',

    btn_top_ai: 'AI アリア',
    btn_top_ai_title: '船外活動服AIコパイロット「ARIA-9」を開く（質問・緊急異常事態）',
    btn_top_compare: '直線 vs A*',
    btn_top_compare_title: '危険な直線経路とSEXTANT A*最適ルートの比較表示を切替',
    btn_emergency_normal: '砂嵐 / 放射線警報',
    btn_emergency_active: '警報解除（通常復帰）',
    btn_start_eva: '船外活動開始 (EVA)',
    btn_return_hq: '軌道司令部へ戻る',

    restore_left: 'プランナーとレイヤーを開く',
    restore_right: 'A*比較とテレメトリを開く',
    btn_collapse: '— 最小化',

    left_mod_tag: 'モジュール 01 // 航法システム',
    left_win_title_layers: 'SEXTANT A* ルートプランナー',
    left_win_title_weights: '安全重み付けと経路点',
    left_win_desc: 'NASA衛星データレイヤーを選択するか、3D地形をダブルクリックして経路点を追加します。',
    tab_layers: 'レイヤーと経路',
    tab_weights_prefix: 'A*重みと地点',
    sec_nasa_layers: 'NASA 衛星観測レイヤー (MRO / ODYSSEY)',
    layer_truecolor: 'Neon-Mars 3D標高',
    layer_slope: '傾斜角・断崖リスク',
    layer_sand: '流砂・砂丘トラップ',
    layer_minerals: '含水鉱物スペクトル',
    layer_comm: '基地UHF見通し通信',
    layer_hints: {
      truecolor: 'ネレトヴァ渓谷のMOLA 3D標高メッシュと外部地形のリアルタイム波動生成。',
      slope: 'HiRISE傾斜解析：緑（9°未満）は安全、赤（19°超）は滑落危険のある急崖。',
      sand: 'THEMIS熱慣性：オレンジ色は心拍数とO₂消費を急増させる軟弱砂丘地帯。',
      minerals: 'MRO CRISM分光計：シアンと緑の領域は熱水性粘土鉱物およびオパール質シリカ(SiO₂)。',
      comm: 'オリンポス1基地（15mアンテナ塔）とのUHF見通し通信圏：シアンは直接通信可能域。'
    },
    sec_preset: '探査ミッション・シナリオ',
    drone_card_title: '◈ インジェニュイティ // UHF中継機',
    drone_status_on: '前方高度18m飛行中 • 信号利得 +14 dB',
    drone_status_off: '中継オフ • 基地との直接見通し通信のみ',
    btn_on: 'ON',
    btn_off: 'OFF',
    btn_recalc: '▸ A*ルートを再計算',
    btn_reset: 'リセット',

    sec_weights: 'SEXTANT A* 安全コスト重み設定',
    weight_slope: '急傾斜の回避 (>15°)',
    weight_sand: '軟弱砂丘の回避 (THEMIS)',
    weight_comm: '基地とのUHF通信維持',
    sec_waypoints: '経路点（3Dマップをダブルクリックで追加）',
    btn_clear_last_wp: '− 最後の経路点を削除',
    wp_delete_title: '経路点を削除',

    route_tag_normal: '通常航法 SEXTANT A*',
    route_tag_emerg: '[!] 緊急シェルター退避',
    right_win_title_telemetry: 'テレメトリとA*経路比較',
    right_win_title_crism: 'MRO CRISM / PIXL 分光解析',
    right_win_desc: '断崖を横切る危険な直線ルートと、SEXTANT A*による安全な迂回ルートの比較解析。',
    tab_telemetry: '直線 vs A*',
    tab_crism_prefix: 'CRISM分光',

    kpi_dist: 'A* 総移動距離',
    kpi_time: '予測移動時間',
    kpi_climb: '累積獲得標高',
    kpi_max_hr: '最大心拍数',
    kpi_o2: '最終O₂残量',
    kpi_comm: '基地通信カバー率',
    unit_m: 'm',
    unit_min: '分',
    unit_lpm: 'L/分',
    unit_usvh: 'µSv/h',
    unit_watt: 'W',
    unit_ms: 'm/s',

    cmp_title: '◈ 比較：直線ルート vs SEXTANT A*',
    cmp_line_on: '3D線: ON',
    cmp_line_off: '3D線: OFF',
    cmp_col_metric: '評価項目',
    cmp_col_naive: '直線経路',
    cmp_col_smart: 'SEXTANT A*',
    cmp_row_o2: '最終酸素残量 (O₂)',
    cmp_row_cliffs: '危険な急崖 (>19°)',
    cmp_row_hr: '最大傾斜 / ピーク心拍',
    cmp_cliffs_count: (n) => `断崖 ${n}箇所`,
    cmp_cliffs_bypassed: (n) => `${n} (全て回避)`,
    cmp_verdict: (o2Saved, cliffs, maxSlope) =>
      `SEXTANT A* の優位性：酸素残量を +${o2Saved}% 節約し、${cliffs}箇所の急崖（最大${maxSlope}°）と流砂を安全に回避。`,

    chart_title: '◈ 標高・心拍プロファイル（クリックで移動）',
    chart_legend_naive: '直線',
    sec_boulders: 'CRISM / PIXL 科学探査ターゲット岩塊',
    btn_route_to_boulder: '⌖ この岩塊をA*ルートに追加',
    sec_warnings: 'ルート上の危険箇所ログ',
    warn_safe: '[OK] ルート安全確認：危険な急斜面や流砂トラップはありません。',
    boulder_biosig_label: '生命兆候指数',
    boulder_um: 'µm',

    orbital_bottom_hint: '<b style="color:var(--cyan);">[NAV]</b> 左ドラッグ: 回転 • 右ドラッグ: 移動 • ホイール: ズーム • <strong>地形をダブルクリック</strong>: 経路点を追加',

    hud_heading_prefix: '方位',
    hud_next_wp_prefix: '目標まで',
    emerg_banner_title: '[!] マスター警報：太陽フレアSPE X9.4および大規模砂嵐発生！',
    emerg_banner_sub_default: '赤色シェブロン誘導に従い最寄りのシェルターへ退避せよ！',
    emerg_banner_sub_active: (name, dist) => `緊急退避ルート作動：${name}（残り ${dist} M）`,

    bio_header: '◈ xEMU 宇宙服バイオメトリクス',
    bio_hr_label: '宇宙飛行士 心拍数',
    bio_coolant: '▸ LCVG 冷却水温度',
    bio_o2_rate: '▸ 酸素消費速度 (O₂)',
    bio_o2_rem: '▸ 主酸素タンク残量',
    tc_slope: '地形傾斜角',
    tc_sand: '砂地スリップ率',
    tc_metabolic: '代謝負荷 / 歩行速度',
    tc_rad: '放射線量率',
    slope_sub_word: '斜面',
    sand_dune: '流砂トラップ！',
    sand_loam: '砂質レゴリス',
    sand_basalt: '玄武岩盤',

    reticle_ready: 'CRISM/PIXL スキャナー待機中（岩塊に照準を合わせてください）',
    reticle_locked: (name, dist) => `目標ロック：${name} (${dist} M)`,
    crism_formula_prefix: '化学式',
    crism_biosig_label: '◈ バイオシグネチャー指数:',
    crism_biosig_high: '極めて高い',
    crism_biosig_med: '中程度',
    btn_collect_sample: '⌖ ミッション報告書にサンプル登録',

    radar_header: '◈ 20m警戒レーダー＆見通し通信',
    radar_base: 'オリンポス1基地:',
    radar_uhf: 'UHF 信号強度:',
    radar_drone: 'インジェニュイティ:',
    radar_max_slope: '最大傾斜 (半径20m):',
    los_vortex: '砂塵渦による通信障害！',
    los_shadow: (m) => `地形遮蔽 (${m}m)`,
    drone_relay_on: 'UHF中継 +14 dB',
    drone_relay_off: '中継オフ',
    radar_slope_danger: '危険な急斜面！',
    radar_slope_norm: '正常範囲',

    btn_pause: '❚❚ 一時停止',
    btn_walk: '▸ 歩行再開',
    btn_step_prev: '◂ 前へ',
    btn_step_next: '次へ ▸',
    btn_aim_rock: '最寄り岩塊を照準',
    btn_flashlight: 'ライト',
    btn_drone_cam: 'ドローン視点',
    btn_reset_look: '⌖ 正面を向く',
    btn_to_hq: '▴ 軌道へ戻る',
    step_counter: (cur, total) => `ステップ ${cur} / ${total}`,

    pin_turn_emerg: (label) => `[!] 緊急退避目標: ${label}`,
    pin_turn_norm: (label) => `⌖ 次の経路点: ${label}`,
    pin_turn_sub: (dist, step) => `距離: ${dist} m • ステップ ${step}`,
    pin_naive_title: (slope) => `▲ 直線経路: 断崖 ${slope}°`,
    pin_naive_sub: (o2) => `O₂過剰消費 +${o2}% • SEXTANT A*により回避済`,
    pin_drone_title: '◈ インジェニュイティ機',
    pin_drone_sub: '高度18m • UHF中継リンク稼働中',
    pin_base_title: '◈ オリンポス1基地 (HAB)',
    pin_base_sub: '15m 高利得通信マスト',
    pin_shelter_sub: (pct) => `放射線遮蔽率 ${pct}%`,
    pin_boulder_sub: (pct) => `生命兆候指数: ${pct}%`,

    ai_mini_label: 'ARIA-9 // AI:',
    ai_mini_ticker_default: 'xEMU宇宙服の全システム正常。あらゆる質問への回答および緊急時の自律回避プロトコル実行が可能です。',
    btn_open_ai_chat: '◈ AIに質問',
    btn_trigger_anomaly: '▲ 異常事態テスト',
    ai_badge_nominal: 'ARIA-9 // xEMU搭載ニューラルAI [NOMINAL]',
    ai_badge_alert: '[!] ARIA-9 // 緊急オーバーライド：異常事態発生！',
    ai_chip_hr: (hr) => `心拍: ${hr} BPM`,
    ai_chip_status_alert: '[!] 状態: 緊急事態発生中',
    ai_chip_status_warn: (slope, sand) => `▲ 傾斜 ${slope}° / 砂地 ${sand}%`,
    ai_chip_status_nom: '状態: NOMINAL',

    ai_init_cat: '// 宇宙飛行士 戦術支援チャンネル',
    ai_init_title: '搭載AI「ARIA-9」オンライン',
    ai_init_text: 'PLSS生命維持装置の生体データ、HiRISE傾斜、THEMIS流砂、CRISM鉱物スペクトルを常時解析しています。自由な質問の入力や、船外活動中の突発的な異常事態シミュレーションが可能です。',
    ai_sec_ask: '搭載AIコパイロットに自由に質問する',
    ai_input_placeholder: '何でも質問してください：酸素残量、前方の地形、近くのCRISM鉱物、最寄りシェルターなど...',
    btn_ai_send: '送信',

    ai_q_suit: '▸ 宇宙服と酸素残量',
    ai_q_ahead: '▸ 前方のルート状況は？',
    ai_q_minerals: '▸ 近くのCRISM鉱物',
    ai_q_compare: '▸ A*ルートの優位性',
    ai_q_shelter: '▸ 最寄りの避難シェルター',
    ai_q_weather: '▸ ジェゼロ気象・放射線',

    ai_sec_anomalies: '◈ 緊急異常事態シミュレーター（想定外のトラブル発生時）',
    anom_1_title: '[01] 渓谷縁の落石・崩落',
    anom_1_sub: '前方ルート閉塞 + A*自律迂回ルート生成',
    anom_2_title: '[02] LCVG冷却不全・O₂漏洩',
    anom_2_sub: '心拍162 BPM急上昇 + 予備ポンプ起動',
    anom_3_title: '[03] 巨大塵旋風（通信途絶）',
    anom_3_sub: '3Dダストデビル + ドローンUHF中継切替',
    anom_4_title: '[04] 太陽フレア SPE X9.4',
    anom_4_sub: '致死的放射線急増 + 溶岩洞シェルター退避',

    toast_drone_cam: '[INGENUITY] ドローン視点（左ドラッグ：360°回転 • ホイール：ズーム）',
    toast_visor_cam: '[xEMU HUD] ヘルメット1人称視点（左ドラッグ：360°自由見回し）',
    toast_naive_on: '◈ 3Dマップ上に危険な「直線ルート」（赤破線）を表示しました',
    toast_naive_off: '◈ 「直線ルート」の比較ラインを非表示にしました',
    toast_sol_day: '[SOL] 日照モード：火星昼間（Sol Nominal）',
    toast_sol_sunset: '[SOL] 日照モード：ジェゼロ・クレーターの薄明（夕暮れ）',
    toast_sol_night: '[LIDAR] 夜間モード：LIDAR地形メッシュとヘルメットライトを起動',
    toast_emerg_route: (name) => `[!] 緊急退避プロトコル：「${name}」への最短ルートを生成しました！`,
    toast_wp_added: (label) => `⌖ 経路点を追加しました: ${label}`,
    toast_route_recalc: '▸ SEXTANT A* ルートを再計算しました',
    toast_wp_removed: (label) => `− 経路点を削除しました: ${label}`,
    toast_min_wp: '[INFO] ルート計算には最低2つの地点（出発・到着）が必要です',
    toast_preset_reset: '◈ ルートを初期プリセットにリセットしました',
    toast_relay_on: '[INGENUITY] UHF中継リンク起動 (+14 dB)',
    toast_relay_off: '[INGENUITY] UHF中継リンク停止',
    toast_orbit_top: '[ORBIT] カメラ視点：垂直トップダウン (90°)',
    toast_orbit_3d: '[ORBIT] カメラ視点：3D斜め軌道視点',
    toast_torch_on: '[LIDAR] ヘルメットライト ON',
    toast_torch_off: '[LIDAR] ヘルメットライト OFF',
    toast_sample_saved: (name) => `⌖ 科学ターゲット「${name}」をミッション報告書に記録しました！`,
    toast_lang_switched: '◈ 表示言語：日本語 (JA)'
  }
};

export const BOULDER_I18N = {
  ROCK_CHEAVA_FALLS: {
    ru: {
      name: 'Обнажение «Cheyava Falls» (Леопардовый аргиллит)',
      mineral_class: 'Опаловый кремнезём + Фосфаты железа (Вивианит)',
      description: 'Приоритетная цель миссии! Пятнистая осадочная порода в русле Неретва с реакционными фронтами восстановления железа в присутствии древней органики.'
    },
    en: {
      name: 'Cheyava Falls Outcrop (Leopard-Spot Mudstone)',
      mineral_class: 'Opaline Silica + Iron Phosphates (Vivianite)',
      description: 'Top-priority science target! Spotted sedimentary rock in Neretva Vallis featuring iron-reduction reaction fronts associated with ancient organic matter.'
    },
    ja: {
      name: 'チェヤヴァ・フォールズ露頭（ヒョウ柄泥岩）',
      mineral_class: 'オパール質シリカ + リン酸鉄（藍鉄鉱 / ヴィヴィアナイト）',
      description: '最重要科学ターゲット！ネレトヴァ渓谷の斑状堆積岩で、太古の有機物反応に伴う鉄還元フロントとバイオシグネチャーを保持。'
    }
  },
  ROCK_LEFROY_BAY: {
    ru: {
      name: 'Валун «Lefroy Bay» (Гидратированный опал)',
      mineral_class: 'Аморфный гидратированный кремнезём (Opal-A)',
      description: 'Крупный обломок опалового кремнезёма у изгиба каньона. Идеально консервирует микрофоссилии древнего озера Езеро.'
    },
    en: {
      name: 'Lefroy Bay Boulder (Hydrated Opal-A)',
      mineral_class: 'Amorphous Hydrated Silica (Opal-A)',
      description: 'Large opaline silica block near the canyon bend. Exceptional preservation matrix for ancient Lake Jezero microfossils.'
    },
    ja: {
      name: 'レフロイ・ベイ岩塊（含水オパール）',
      mineral_class: '非晶質含水シリカ (Opal-A)',
      description: '渓谷屈曲部に位置するオパール質シリカの巨礫。太古のジェゼロ湖の微化石を極めて良好に保存する地質マトリックス。'
    }
  },
  ROCK_WILDCAT_RIDGE: {
    ru: {
      name: 'Плита «Wildcat Ridge» (Сульфатный аргиллит)',
      mineral_class: 'Филлосиликаты + Сульфаты Mg/Fe',
      description: 'Тонкослоистый озёрный алевролит подножия уступа Дельты. Сформировался в спокойной водной среде древнего бассейна.'
    },
    en: {
      name: 'Wildcat Ridge Slab (Sulfate Mudstone)',
      mineral_class: 'Phyllosilicates + Mg/Fe Sulfates',
      description: 'Fine-layered lacustrine siltstone at the base of the Delta scarp, deposited in calm habitable waters of the ancient basin.'
    },
    ja: {
      name: 'ワイルドキャット・リッジ岩盤（硫酸塩泥岩）',
      mineral_class: 'フィロケイ酸塩（粘土鉱物）+ Mg/Fe硫酸塩',
      description: 'デルタ崖下に広がる細層理の湖成シルト岩。穏やかな古代湖の居住可能環境で堆積した地層。'
    }
  },
  ROCK_CASTELL_HENLLYS: {
    ru: {
      name: 'Глыба «Castell Henllys» (Береговой карбонат)',
      mineral_class: 'Оливин-магнезитовый карбонат (Marginal Unit)',
      description: 'Прибрежный карбонатный комплекс на высоте палео-пляжа кратера Езеро.'
    },
    en: {
      name: 'Castell Henllys Block (Shoreline Carbonate)',
      mineral_class: 'Olivine-Magnesite Carbonate (Marginal Unit)',
      description: 'Shoreline carbonate deposit along the ancient paleobeach elevation of Jezero Crater.'
    },
    ja: {
      name: 'カステル・ヘンリス岩塊（湖岸炭酸塩岩）',
      mineral_class: 'カンラン石・マグネサイト炭酸塩 (Marginal Unit)',
      description: 'ジェゼロ・クレーターの古代湖岸線（パレオビーチ）標高に分布する炭酸塩複合体。'
    }
  },
  ROCK_SKINNER_RIDGE: {
    ru: {
      name: 'Уступ «Skinner Ridge» (Конгломерат Дельты)',
      mineral_class: 'Полимиктовый речной песчаник и сульфаты',
      description: 'Крупнозернистый песчаник речного потока с окатанной галькой привносных пород.'
    },
    en: {
      name: 'Skinner Ridge Ledge (Delta Conglomerate)',
      mineral_class: 'Polymictic Fluvial Sandstone & Sulfates',
      description: 'Coarse-grained fluvial sandstone containing rounded pebbles transported from upstream highlands.'
    },
    ja: {
      name: 'スキナー・リッジ段丘（デルタ礫岩）',
      mineral_class: '多源的河川砂岩および硫酸塩',
      description: '上流の高地から運ばれた円磨礫を含む粗粒の河川成砂岩。'
    }
  },
  ROCK_KODIAK_STRATA: {
    ru: {
      name: 'Монолит «Kodiak Base» (Клиноформы паводка)',
      mineral_class: 'Железистый смектит (Нонтронит) + Сульфаты',
      description: 'Обнажение косослоистых отложений древней дельты на склоне останца Кодиак.'
    },
    en: {
      name: 'Kodiak Base Monolith (Flood Clinoforms)',
      mineral_class: 'Fe-Smectite (Nontronite) + Sulfates',
      description: 'Cross-bedded ancient delta foreset strata exposed along the flank of Kodiak butte.'
    },
    ja: {
      name: 'コディアック基底モノリス（洪水クリノフォーム）',
      mineral_class: '鉄スメクタイト（ノントロナイト）+ 硫酸塩',
      description: 'コディアック残丘の斜面に露出する、古代デルタの前置層（斜交層理）。'
    }
  },
  ROCK_BRIGHT_ANGEL: {
    ru: {
      name: 'Терраса «Bright Angel» (Ангидрит и Кремнезём)',
      mineral_class: 'Сульфат кальция (Бассанит) и аморфный кремнезём',
      description: 'Аномально светлое обнажение на северном борту русла Неретва с высокой концентрацией гидратированных фаз.'
    },
    en: {
      name: 'Bright Angel Terrace (Anhydrite & Silica)',
      mineral_class: 'Calcium Sulfate (Bassanite) & Amorphous Silica',
      description: 'High-albedo light-toned outcrop on the northern wall of Neretva Vallis rich in hydrated mineral phases.'
    },
    ja: {
      name: 'ブライト・エンジェル段丘（硬石膏・シリカ）',
      mineral_class: '硫酸カルシウム（バサナイト）および非晶質シリカ',
      description: 'ネレトヴァ渓谷北壁に位置する高アルベドの明色露頭。高濃度の含水鉱物相を含む。'
    }
  },
  ROCK_OTIS_PEAK: {
    ru: {
      name: 'Шпиль «Otis Peak» (Хромитовый серпентинит)',
      mineral_class: 'Серпентин + Магнетит (Источник H₂)',
      description: 'Порода со следами древней серпентинизации — геохимической реакции, выделявшей водород.'
    },
    en: {
      name: 'Otis Peak Spire (Chromite Serpentinite)',
      mineral_class: 'Serpentine + Magnetite (Ancient H₂ Source)',
      description: 'Ultramafic rock bearing traces of ancient serpentinization—a geochemical reaction that released dissolved H₂ energy for microbes.'
    },
    ja: {
      name: 'オーティス・ピーク尖峰（クロム蛇紋岩）',
      mineral_class: '蛇紋石 + 磁鉄鉱（古代水素 H₂ 供給源）',
      description: '微生物のエネルギー源となる水素(H₂)を発生させた古代の蛇紋岩化作用の痕跡を残す岩石。'
    }
  }
};

export const FACILITY_I18N = {
  HAB_BASE: {
    ru: 'База «Олимп-1» (Ares-IV Hab)',
    en: 'Olympus-1 Base (Ares-IV Hab)',
    ja: 'オリンポス1基地 (Ares-IV Hab)'
  },
  SHELTER_1: {
    ru: 'Укрытие «Гефест» (Лавовая трубка)',
    en: 'Hephaestus Shelter (Lava Tube)',
    ja: 'ヘファイストス避難所（溶岩洞）'
  },
  SHELTER_2: {
    ru: 'Укрытие «Аврора» (Бункер Дельты)',
    en: 'Aurora Shelter (Delta Regolith Bunker)',
    ja: 'オーロラ避難所（デルタ防護バンカー）'
  },
  SHELTER_3: {
    ru: 'Укрытие «Кодиак-Юг» (Скальный грот)',
    en: 'Kodiak-South Shelter (Cliff Alcove)',
    ja: 'コディアック南避難所（岩陰シェルター）'
  }
};

export const PRESET_I18N = {
  MISSION_SERPENTINE_CANYON: {
    ru: 'EVA-01: Извилистый каньон Неретва и биосигнатуры «Cheyava Falls»',
    en: 'EVA-01: Serpentine Neretva Vallis & Cheyava Falls Biosignatures',
    ja: 'EVA-01: ネレトヴァ渓谷蛇行ルート＆チェヤヴァ・フォールズ生命探査'
  },
  MISSION_EAST_WEST_ZIGZAG: {
    ru: 'EVA-02: Большая петля через останец Кодиак к шпилю «Otis Peak»',
    en: 'EVA-02: Grand Loop via Kodiak Butte to Otis Peak Spire',
    ja: 'EVA-02: コディアック残丘経由オーティス・ピーク大周回ルート'
  },
  MISSION_EXTREME_SLALOM: {
    ru: 'EVA-03: Геологический слалом между кратерами и дюнами THEMIS',
    en: 'EVA-03: Geological Slalom Across Craters & THEMIS Sand Dunes',
    ja: 'EVA-03: クレーター群・THEMIS砂丘回避スラローム探査'
  }
};

export function getBoulderText(boulder, lang = 'ru') {
  if (!boulder) return { name: '', mineral_class: '', description: '' };
  const entry = BOULDER_I18N[boulder.id]?.[lang];
  if (entry) return entry;
  return {
    name: boulder.name,
    mineral_class: boulder.mineral_class,
    description: boulder.description
  };
}

export function getFacilityName(id, fallbackName, lang = 'ru') {
  return FACILITY_I18N[id]?.[lang] || fallbackName;
}

export function getPresetName(id, fallbackName, lang = 'ru') {
  return PRESET_I18N[id]?.[lang] || fallbackName;
}

const WP_EXACT_MAP = {
  'Старт: База «Олимп-1»': {
    ru: 'Старт: База «Олимп-1»',
    en: 'Start: Olympus-1 Base',
    ja: '出発: オリンポス1基地'
  },
  'Точка 1: Западный обход «Castell Henllys»': {
    ru: 'Точка 1: Западный обход «Castell Henllys»',
    en: 'WP 1: Castell Henllys West Bypass',
    ja: '地点1: カステル・ヘンリス西迂回路'
  },
  'Точка 2: Лавовая трубка «Гефест»': {
    ru: 'Точка 2: Лавовая трубка «Гефест»',
    en: 'WP 2: Hephaestus Lava Tube',
    ja: '地点2: ヘファイストス溶岩洞'
  },
  'Точка 3: Опаловый меандр «Lefroy Bay»': {
    ru: 'Точка 3: Опаловый меандр «Lefroy Bay»',
    en: 'WP 3: Lefroy Bay Opal Meander',
    ja: '地点3: レフロイ・ベイ蛇行部'
  },
  'Точка 4: Биосигнатура «Cheyava Falls»': {
    ru: 'Точка 4: Биосигнатура «Cheyava Falls»',
    en: 'WP 4: Cheyava Falls Biosignature',
    ja: '地点4: チェヤヴァ・フォールズ露頭'
  },
  'Точка 5: Сульфатная терраса «Wildcat Ridge»': {
    ru: 'Точка 5: Сульфатная терраса «Wildcat Ridge»',
    en: 'WP 5: Wildcat Ridge Sulfate Terrace',
    ja: '地点5: ワイルドキャット・リッジ段丘'
  },
  'Финиш: Бункер Дельты «Аврора»': {
    ru: 'Финиш: Бункер Дельты «Аврора»',
    en: 'Finish: Aurora Delta Bunker',
    ja: '到着: オーロラ・デルタバンカー'
  },
  'Точка 1: Южный проход каньона': {
    ru: 'Точка 1: Южный проход каньона',
    en: 'WP 1: Southern Canyon Pass',
    ja: '地点1: 渓谷南パス'
  },
  'Точка 2: Монолит «Kodiak Base»': {
    ru: 'Точка 2: Монолит «Kodiak Base»',
    en: 'WP 2: Kodiak Base Monolith',
    ja: '地点2: コディアック基底モノリス'
  },
  'Точка 3: Перевал «Skinner Ridge»': {
    ru: 'Точка 3: Перевал «Skinner Ridge»',
    en: 'WP 3: Skinner Ridge Pass',
    ja: '地点3: スキナー・リッジ峠'
  },
  'Точка 4: Серпентинит «Otis Peak»': {
    ru: 'Точка 4: Серпентинит «Otis Peak»',
    en: 'WP 4: Otis Peak Serpentinite',
    ja: '地点4: オーティス・ピーク蛇紋岩'
  },
  'Финиш: Терраса «Bright Angel»': {
    ru: 'Финиш: Терраса «Bright Angel»',
    en: 'Finish: Bright Angel Terrace',
    ja: '到着: ブライト・エンジェル段丘'
  },
  'Точка 1: Укрытие «Гефест»': {
    ru: 'Точка 1: Укрытие «Гефест»',
    en: 'WP 1: Hephaestus Shelter',
    ja: '地点1: ヘファイストス避難所'
  },
  'Точка 2: Скальный грот «Кодиак-Юг»': {
    ru: 'Точка 2: Скальный грот «Кодиак-Юг»',
    en: 'WP 2: Kodiak-South Cliff Alcove',
    ja: '地点2: コディアック南岩陰シェルター'
  },
  'Точка 3: Уступ «Skinner Ridge»': {
    ru: 'Точка 3: Уступ «Skinner Ridge»',
    en: 'WP 3: Skinner Ridge Ledge',
    ja: '地点3: スキナー・リッジ段丘'
  },
  'Точка 4: Обнажение «Cheyava Falls»': {
    ru: 'Точка 4: Обнажение «Cheyava Falls»',
    en: 'WP 4: Cheyava Falls Outcrop',
    ja: '地点4: チェヤヴァ・フォールズ露頭'
  },
  'Финиш: Бункер «Аврора»': {
    ru: 'Финиш: Бункер «Аврора»',
    en: 'Finish: Aurora Bunker',
    ja: '到着: オーロラ避難バンカー'
  },
  'Точка тревоги (Скафандр)': {
    ru: 'Точка тревоги (Скафандр)',
    en: 'Alert Origin (Astronaut Suit)',
    ja: '警報発生地点（宇宙服現在地）'
  },
  'Обход обвала (ИИ)': {
    ru: 'Обход обвала (ИИ)',
    en: 'Rockfall Bypass (AI)',
    ja: '落石回避ポイント (AI)'
  }
};

export function translateWaypointLabel(rawLabel, lang = 'ru') {
  if (!rawLabel) return '';
  if (WP_EXACT_MAP[rawLabel]?.[lang]) {
    return WP_EXACT_MAP[rawLabel][lang];
  }
  const mCustom = rawLabel.match(/^(?:Точка|WP|地点)\s*(\d+)$/i);
  if (mCustom) {
    const num = mCustom[1];
    if (lang === 'en') return `WP ${num}`;
    if (lang === 'ja') return `地点 ${num}`;
    return `Точка ${num}`;
  }
  if (rawLabel.startsWith('Укрытие: ')) {
    const rest = rawLabel.replace('Укрытие: ', '');
    for (const fId of Object.keys(FACILITY_I18N)) {
      if (rest.includes(FACILITY_I18N[fId].ru.split('(')[0].trim())) {
        const trName = FACILITY_I18N[fId][lang];
        return lang === 'en' ? `Shelter: ${trName}` : (lang === 'ja' ? `避難先: ${trName}` : `Укрытие: ${trName}`);
      }
    }
  }
  return rawLabel;
}

export function formatWarningMessage(w, timeline, lang = 'ru') {
  if (!w) return '';
  const st = timeline?.[w.step];
  if (!st || lang === 'ru') return w.message;

  const dist = Math.round(st.distance_from_start_m || 0);
  if (w.type === 'SLOPE_HAZARD') {
    if (lang === 'en') {
      return `Step ${w.step} (${dist} m): Steep slope ${st.terrain_slope_deg.toFixed(1)}° — HR rises to ${Math.round(st.heart_rate_bpm)} BPM`;
    }
    return `ステップ ${w.step} (${dist} m): 急傾斜 ${st.terrain_slope_deg.toFixed(1)}° — 心拍上昇 ${Math.round(st.heart_rate_bpm)} BPM`;
  }
  if (w.type === 'SAND_SLIP') {
    const sandPct = Math.round((st.sand_index || 0) * 100);
    if (lang === 'en') {
      return `Step ${w.step} (${dist} m): THEMIS sand dune (${sandPct}%) — O₂ burn ${st.o2_rate_lpm.toFixed(2)} L/min`;
    }
    return `ステップ ${w.step} (${dist} m): THEMIS流砂地帯 (${sandPct}%) — O₂消費 ${st.o2_rate_lpm.toFixed(2)} L/分`;
  }
  if (w.type === 'COMM_SHADOW') {
    const obs = st.comm?.max_obstruction_m || 0;
    if (lang === 'en') {
      return `Step ${w.step} (${dist} m): Radio shadow zone (terrain obstruction ${obs} m)`;
    }
    return `ステップ ${w.step} (${dist} m): 通信遮蔽エリア（地形遮蔽 ${obs} m）`;
  }
  return w.message;
}

export function getAIAnomalyTriggerContent(type, ctx, lang = 'ru') {
  const { x, z, shelterName, dist, shielding } = ctx;

  if (type === 'rockfall') {
    if (lang === 'en') {
      return {
        pinTitle: '[!] ROCKFALL ON ROUTE!',
        pinSub: 'Path blocked • Click for AI A* detour',
        category: '// ROUTE ANOMALY: SEISMIC SENSOR ALERT',
        title: 'CANYON RIM ROCKFALL DIRECTLY AHEAD!',
        text: `Warning, Astronaut! A basaltic rockslide has occurred at coordinates (X: ${x}m, Z: ${z}m). Continuing along the original trajectory is unsafe due to sharp debris and >25° slope. Click the AI protocol button below to automatically insert a bypass waypoint and recalculate a safe SEXTANT A* detour!`,
        resolveLabel: '▸ AI PROTOCOL: PLOT SAFE ROCKFALL DETOUR (A*)'
      };
    }
    if (lang === 'ja') {
      return {
        pinTitle: '[!] ルート上で落石・崩落発生！',
        pinSub: '進路閉塞 • クリックでAI自律迂回',
        category: '// ルート異常事態：地震計センサー警報',
        title: '進行方向の渓谷縁で大規模な落石が発生！',
        text: `警告、宇宙飛行士！座標 (X: ${x}m, Z: ${z}m) の地点で玄武岩の崖崩れが発生しました。鋭利な岩片と25°超の急傾斜のため直進は危険です。下のAIプロトコルボタンを押してください。安全迂回ポイントを自動設定し、SEXTANT A*ルートを再構築します！`,
        resolveLabel: '▸ AIプロトコル実行：落石エリアのA*安全迂回ルートを生成'
      };
    }
    return {
      pinTitle: '[!] ОБВАЛ ПОРОДЫ НА ТРОПЕ!',
      pinSub: 'Трасса заблокирована • Нажмите для авто-обхода A*',
      category: '// ЧП НА МАРШРУТЕ: СЕЙСМИЧЕСКИЙ ДАТЧИК',
      title: 'ОБВАЛ КРОМКИ КАНЬОНА ПРЯМО ПО КУРСУ!',
      text: `Внимание, космонавт! В точке (X: ${x}м, Z: ${z}м) сошёл каменный оползень. Идти по старой траектории нельзя — острые обломки базальта и уклон >25°. Нажмите кнопку протокола ниже: я автоматически добавлю точку обхода и перестрою безопасный путь SEXTANT A*!`,
      resolveLabel: '▸ ПРОТОКОЛ ИИ: ПОСТРОИТЬ БЕЗОПАСНЫЙ ОБХОД ОБВАЛА (A*)'
    };
  }

  if (type === 'suit_leak') {
    if (lang === 'en') {
      return {
        category: '// PLSS SUIT FAULT: LCVG COOLING LOOP',
        title: 'LCVG COOLANT SPIKE & ELEVATED O₂ BURN!',
        text: 'Critical anomaly! Dust micro-clogging in the suit sublimator has raised LCVG water temperature to 26.4 °C, spiking your heart rate to 162 BPM and O₂ consumption to 2.38 L/min. Activate the AI protocol immediately to purge the sublimator valve and engage Backup Pump B!',
        resolveLabel: '▸ AI PROTOCOL: ENGAGE BACKUP LCVG LOOP & STABILIZE O₂'
      };
    }
    if (lang === 'ja') {
      return {
        category: '// PLSS宇宙服故障警報：LCVG冷却ループ異常',
        title: '冷却水温度上昇および酸素消費量の急増！',
        text: '緊急事態発生！昇華器の微細ダスト詰まりによりLCVG冷却水温が 26.4 °C に上昇し、心拍数が 162 BPM、O₂消費速度が 2.38 L/分に急増しています。直ちにAIプロトコルを起動し、昇華器バルブの窒素パージと予備ポンプBへの切替を実行してください！',
        resolveLabel: '▸ AIプロトコル実行：予備LCVG冷却系へ切替＆酸素消費を安定化'
      };
    }
    return {
      category: '// АВАРИЯ СКАФАНДРА PLSS: КОНТУР LCVG',
      title: 'СБОЙ ОХЛАЖДЕНИЯ LCVG И ПЕРЕРАСХОД КИСЛОРОДА!',
      text: 'Критический скачок! Пылевая микрозакупорка сублиматора скафандра: температура воды в контуре охлаждения выросла до 26.4 °C, ваш пульс подскочил до 162 BPM, а расход O₂ вырос до 2.38 л/мин. Немедленно активируйте протокол ИИ для продувки клапана и включения резервного насоса B!',
      resolveLabel: '▸ ПРОТОКОЛ ИИ: ВКЛЮЧИТЬ РЕЗЕРВНЫЙ КОНТУР LCVG И СТАБИЛИЗИРОВАТЬ O₂'
    };
  }

  if (type === 'dust_devil') {
    if (lang === 'en') {
      return {
        pinTitle: '[!] DUST DEVIL VORTEX',
        pinSub: '-28 dB UHF interference • Drone relay required',
        category: '// ATMOSPHERIC ANOMALY: UHF COMM LOSS',
        title: 'ELECTROSTATIC DUST DEVIL ON TRAJECTORY!',
        text: 'A 65-meter Martian dust devil (wind 28 m/s) has formed nearby. Triboelectric dust static has degraded direct UHF link to Olympus-1 Base by -28 dB and reduced visibility. Click the AI protocol button to reroute communications through the Ingenuity helicopter relay (+14 dB) and enable the LIDAR spotlight!',
        resolveLabel: '▸ AI PROTOCOL: BOOST COMM VIA INGENUITY DRONE & ENABLE LIDAR'
      };
    }
    if (lang === 'ja') {
      return {
        pinTitle: '[!] 巨大塵旋風（ダストデビル）',
        pinSub: 'UHF電波減衰 -28 dB • ドローン中継が必要',
        category: '// 大気異常事態：UHF通信リンク減衰',
        title: '進路上に帯電ダストデビル（塵旋風）が発生！',
        text: '高度65mの火星塵旋風（風速28 m/s）が接近中です。砂塵の摩擦帯電によりオリンポス1基地との直接UHF信号が 28 dB 低下し、視界も悪化しています。AIプロトコルを実行し、インジェニュイティ中継機（+14 dB）への通信切替とLIDARライト照射を行ってください！',
        resolveLabel: '▸ AIプロトコル実行：インジェニュイティUHF中継＆LIDAR照射を起動'
      };
    }
    return {
      pinTitle: '[!] ПЫЛЕВОЙ ВИХРЬ (DUST DEVIL)',
      pinSub: 'Радиопомехи -28 dB • Требуется ретранслятор дрона',
      category: '// АТМОСФЕРНАЯ АНОМАЛИЯ: ПОТЕРЯ СВЯЗИ UHF',
      title: 'ЭЛЕКТРОСТАТИЧЕСКИЙ ПЫЛЕВОЙ ВИХРЬ НА ТРАССЕ!',
      text: 'Рядом с вами сформировался 65-метровый марсианский торнадо (Dust Devil, ветер 28 м/с). Из-за трения пыли прямой сигнал с базой «Олимп-1» упал на 28 дБ, видимость снижена. Нажмите кнопку протокола ИИ — я переведу связь на ретранслятор вертолёта Ingenuity (+14 dB) и включу LIDAR-прожектор!',
      resolveLabel: '▸ ПРОТОКОЛ ИИ: УСИЛИТЬ СВЯЗЬ ЧЕРЕЗ ДРОН INGENUITY И ВКЛЮЧИТЬ LIDAR'
    };
  }

  if (lang === 'en') {
    return {
      category: '// SPE X9.4 RADIATION STORM PROTOCOL',
      title: `AI EMERGENCY OVERRIDE: EGRESS TO ${String(shelterName || 'SHELTER').toUpperCase()}`,
      text: `Coronal solar proton event detected (1850 µSv/h). Nominal mission aborted! I have replotted the SEXTANT A* route to the nearest shielded lava tube "${shelterName}" (${dist} m, shielding ${shielding}%). Follow the crimson holographic chevrons immediately!`,
      resolveLabel: '▸ CLEAR RADIATION ALARM (RESUME NOMINAL MISSION)'
    };
  }
  if (lang === 'ja') {
    return {
      category: '// 太陽フレア SPE X9.4 緊急退避プロトコル',
      title: `AI緊急オーバーライド：${shelterName} へ即時退避`,
      text: `高エネルギー太陽陽子イベント（1850 µSv/h）を検知。通常探査を中断します！最寄りの防護シェルター「${shelterName}」（距離 ${dist} m、遮蔽率 ${shielding}%）へのSEXTANT A*最短退避ルートを構築しました。赤色シェブロンに従って移動してください！`,
      resolveLabel: '▸ 放射線警報を解除（通常探査ルートへ復帰）'
    };
  }
  return {
    category: '// ПРОТОКОЛ SPE X9.4: ЭКСТРЕННАЯ ЭВАКУАЦИЯ',
    title: `АВАРИЙНЫЙ ПЕРЕХВАТ ИИ: МАРШРУТ В ${String(shelterName || '').toUpperCase()}`,
    text: `Зафиксирован корональный выброс солнечных протонов (1850 мкЗв/ч). Штатная миссия прервана! Я перестроила трассу SEXTANT A* до ближайшего лавового укрытия «${shelterName}» (${dist} м, защита ${shielding}%). Следуйте по алым шевронам!`,
    resolveLabel: '▸ ОТБОЙ РАДИАЦИОННОЙ ТРЕВОГИ (ВЕРНУТЬСЯ К МИССИИ)'
  };
}

export function getAIAnomalyResolvedContent(type, ctx, lang = 'ru') {
  const { bypassX, bypassZ, maxSlope, finalO2 } = ctx;

  if (type === 'rockfall') {
    if (lang === 'en') {
      return {
        category: '// AI PROTOCOL EXECUTED: SEXTANT A* AUTO-DETOUR',
        title: 'ROCKFALL SAFELY BYPASSED VIA CONTOUR ARC',
        text: `I inserted a bypass waypoint at (${bypassX}m, ${bypassZ}m) and recalculated the SEXTANT A* path around the rockslide. Maximum slope on the new segment does not exceed ${maxSlope}°, and final O₂ reserve is ${finalO2}%. You are clear to proceed!`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// AIプロトコル完了：SEXTANT A* 自律迂回ナビゲーション',
        title: '落石エリアを安全アーク経路で迂回完了',
        text: `補正経路点 (${bypassX}m, ${bypassZ}m) を追加し、崩落箇所を迂回するSEXTANT A*ルートを再計算しました。新ルートの最大傾斜は ${maxSlope}° 以下に抑えられ、最終O₂残量は ${finalO2}% です。安全に前進を継続できます！`
      };
    }
    return {
      category: '// ПРОТОКОЛ ИИ ВЫПОЛНЕН: АВТО-НАВИГАЦИЯ SEXTANT A*',
      title: 'ОБВАЛ УСПЕШНО ОБОЙДЁН ПО БЕЗОПАСНОЙ ДУГЕ',
      text: `Я внесла корректирующую точку (${bypassX}м, ${bypassZ}м) и пересчитала маршрут SEXTANT A* в обход каменного завала. Максимальный уклон на новом участке не превышает ${maxSlope}°, запас O₂ в конце миссии составит ${finalO2}%. Можете безопасно продолжать движение!`
    };
  }

  if (type === 'suit_leak') {
    if (lang === 'en') {
      return {
        category: '// AI PROTOCOL EXECUTED: xEMU PLSS STABILIZED',
        title: 'BACKUP LCVG LOOP ACTIVE • BIOMETRICS NOMINAL',
        text: 'Sublimator valve purged with nitrogen pulse and cooling switched to Backup Loop B. Water temperature dropped from 26.4 °C to nominal 18.6 °C, astronaut heart rate stabilized, and O₂ consumption returned to normal (0.92 L/min).'
      };
    }
    if (lang === 'ja') {
      return {
        category: '// AIプロトコル完了：xEMU PLSS生命維持系安定化',
        title: '予備LCVGループ稼働 • 生体バイタル正常復帰',
        text: '昇華器バルブを窒素パルスでパージし、冷却系を予備ループBへ切り替えました。水温は 26.4 °C から正常値 18.6 °C に低下し、心拍数および酸素消費量（0.92 L/分）も正常範囲に回復しました。'
      };
    }
    return {
      category: '// ПРОТОКОЛ ИИ ВЫПОЛНЕН: СИСТЕМА PLSS xEMU',
      title: 'РЕЗЕРВНЫЙ КОНТУР LCVG АКТИВИРОВАН • БИОМЕТРИЯ В НОРМЕ',
      text: 'Пылевой клапан сублиматора успешно продут азотным импульсом, охлаждение переведено на резервный контур B. Температура воды снизилась с 26.4 °C до штатных 18.6 °C, пульс космонавта стабилизирован, расход кислорода вернулся к норме (0.92 л/мин).'
    };
  }

  if (type === 'dust_devil') {
    if (lang === 'en') {
      return {
        category: '// AI PROTOCOL EXECUTED: INGENUITY RELAY + LIDAR',
        title: 'UHF LINK RESTORED (+14 dB) • VORTEX CLEARED',
        text: 'Ingenuity helicopter climbed above the dust front and locked the UHF relay channel (+14 dB) with Olympus-1 Base. Helmet LIDAR spotlight is active to penetrate the dust haze. Telemetry link is 100% stable!'
      };
    }
    if (lang === 'ja') {
      return {
        category: '// AIプロトコル完了：インジェニュイティ中継＋LIDAR起動',
        title: 'UHF通信回復 (+14 dB) • 塵旋風エリア通過',
        text: 'インジェニュイティ機が砂塵フロント上空へ上昇し、オリンポス1基地とのUHF中継チャンネル（+14 dB）を確立しました。ヘルメットLIDARライトも点灯し、テレメトリ通信は100%安定しています！'
      };
    }
    return {
      category: '// ПРОТОКОЛ ИИ ВЫПОЛНЕН: ДРОН INGENUITY + LIDAR',
      title: 'СВЯЗЬ ВОССТАНОВЛЕНА (+14 dB) • ВИХРЬ ПРОЙДЕН',
      text: 'Вертолёт Ingenuity поднялся над пылевым фронтом и замкнул ретрансляционный канал UHF (+14 dB) с базой «Олимп-1». На шлеме включён нашлемный прожектор для пробития пылевой завесы. Телеметрия передаётся без потерь!'
    };
  }

  if (lang === 'en') {
    return {
      category: '// NOMINAL MISSION MODE RESTORED',
      title: 'RADIATION DOSE NOMINAL (24.8 µSv/h)',
      text: 'Solar particle storm has subsided. I have restored the primary SEXTANT A* exploration route across Jezero Crater. All xEMU suit systems are operating nominally.'
    };
  }
  if (lang === 'ja') {
    return {
      category: '// 通常ミッションモード復帰',
      title: '放射線レベル正常化 (24.8 µSv/h)',
      text: '太陽嵐が収束しました。ジェゼロ・クレーターのSEXTANT A*通常探査ルートを復元しました。xEMU宇宙服の全システムは正常に稼働しています。'
    };
  }
  return {
    category: '// ШТАТНЫЙ РЕЖИМ ВОССТАНОВЛЕН',
    title: 'РАДИАЦИОННЫЙ ФОН В НОРМЕ (24.8 мкЗв/ч)',
    text: 'Солнечный шторм завершился. Я восстановила основной исследовательский маршрут SEXTANT A* по кратеру Езеро. Все системы скафандра xEMU работают штатно.'
  };
}

export function getAIAutoCalloutMessage(kind, ctx, lang = 'ru') {
  const { sandPct, hr, slope, watts, obs, relay } = ctx;
  if (kind === 'sand') {
    if (lang === 'en') {
      return `[THEMIS] ARIA-9: Warning—THEMIS sand slip rose to ${sandPct}%. HR ${hr} BPM—stay on the SEXTANT A* chevrons!`;
    }
    if (lang === 'ja') {
      return `[THEMIS] ARIA-9: 警告 — 砂地スリップ率が ${sandPct}% に上昇（心拍 ${hr} BPM）。SEXTANT A* の誘導シェブロンに沿って歩行してください！`;
    }
    return `[THEMIS] ARIA-9: Внимание: вязкость песка THEMIS выросла до ${sandPct}%. Пульс ${hr} BPM — держитесь голографических шевронов SEXTANT A*!`;
  }
  if (kind === 'slope') {
    if (lang === 'en') {
      return `[HiRISE] ARIA-9: Terrain grade ${slope}°, metabolic load ${watts} W. A* route contours safely around the cliff.`;
    }
    if (lang === 'ja') {
      return `[HiRISE] ARIA-9: 傾斜警告 — 勾配 ${slope}°、代謝負荷 ${watts} W。A*アルゴリズムにより右側の断崖を迂回中です。`;
    }
    return `[HiRISE] ARIA-9: Предупреждение рельефа: подъём ${slope}°, нагрузка ${watts} Вт. Алгоритм A* обходит обрыв справа.`;
  }
  if (kind === 'comm') {
    if (lang === 'en') {
      return relay
        ? `[UHF LOS] ARIA-9: Direct base signal blocked by ridge (${obs}m); link maintained via Ingenuity drone relay (+14 dB).`
        : `[UHF LOS] ARIA-9: Canyon radio shadow (${obs}m)! Recommend enabling the Ingenuity drone relay.`;
    }
    if (lang === 'ja') {
      return relay
        ? `[UHF LOS] ARIA-9: 基地との直接波が岩壁（${obs}m）で遮蔽されましたが、インジェニュイティ中継（+14 dB）で通信維持中です。`
        : `[UHF LOS] ARIA-9: 警告 — 渓谷の通信遮蔽域（${obs}m）です！インジェニュイティ中継機の起動を推奨します。`;
    }
    return relay
      ? `[UHF LOS] ARIA-9: Прямой сигнал базы перекрыт скалой (${obs}м), связь удерживается через дрон Ingenuity (+14 dB).`
      : `[UHF LOS] ARIA-9: Внимание: радиотень каньона (${obs}м)! Рекомендую включить ретранслятор дрона Ingenuity.`;
  }
  return '';
}

export function buildAIResponseForTopic(topic, rawQuery, ctx, lang = 'ru') {
  const {
    idx, totalSteps, step, sum, cmp, boulderText, nearestBoulder,
    distToRock, maxAheadSlope, maxAheadSand, remDist, o2MinutesLeft,
    shelterName, shelterDist, shelterAz, droneRelayActive
  } = ctx;

  if (topic === 'suit') {
    if (lang === 'en') {
      return {
        category: '// PLSS BIOMETRICS & LIFE SUPPORT',
        title: `O₂ RESERVE ${(step.o2_remaining_pct || 95).toFixed(1)}% (~${o2MinutesLeft} MIN REMAINING)`,
        answer: `Current xEMU suit telemetry at step ${idx + 1}/${totalSteps}: heart rate ${Math.round(step.heart_rate_bpm || 78)} BPM, metabolic load ${Math.round(step.metabolic_watts || 240)} W, LCVG coolant temperature ${(step.coolant_temp_c || 18.5).toFixed(1)} °C, O₂ burn rate ${(step.o2_rate_lpm || 0.9).toFixed(2)} L/min. Projected O₂ reserve at route completion is ${sum.final_o2_remaining_pct}% (well above NASA's 30% safety threshold).`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// PLSS 生体テレメトリ＆生命維持システム',
        title: `酸素残量 ${(step.o2_remaining_pct || 95).toFixed(1)}%（残り約 ${o2MinutesLeft} 分稼働可能）`,
        answer: `ステップ ${idx + 1}/${totalSteps} におけるxEMU宇宙服ステータス：心拍数 ${Math.round(step.heart_rate_bpm || 78)} BPM、代謝負荷 ${Math.round(step.metabolic_watts || 240)} W、LCVG冷却水温 ${(step.coolant_temp_c || 18.5).toFixed(1)} °C、現在のO₂消費速度 ${(step.o2_rate_lpm || 0.9).toFixed(2)} L/分。ミッション完了時の予測酸素残量は ${sum.final_o2_remaining_pct}% です（NASA安全基準30%以上を十分に確保）。`
      };
    }
    return {
      category: '// БИОМЕТРИЯ И ЖИЗНЕОБЕСПЕЧЕНИЕ PLSS',
      title: `ЗАПАС КИСЛОРОДА ${(step.o2_remaining_pct || 95).toFixed(1)}% (РЕЗЕРВ ~${o2MinutesLeft} МИН)`,
      answer: `Текущие показатели скафандра xEMU на шаге ${idx + 1}/${totalSteps}: пульс ${Math.round(step.heart_rate_bpm || 78)} BPM, метаболическая нагрузка ${Math.round(step.metabolic_watts || 240)} Вт, температура воды охлаждения LCVG ${(step.coolant_temp_c || 18.5).toFixed(1)} °C. Текущий расход O₂ составляет ${(step.o2_rate_lpm || 0.9).toFixed(2)} л/мин. К финишу маршрута у вас останется ${sum.final_o2_remaining_pct}% кислорода (безопасный резерв НАСА — не менее 30%).`
    };
  }

  if (topic === 'ahead') {
    if (lang === 'en') {
      return {
        category: '// 180-METER FORWARD TERRAIN FORECAST',
        title: `${remDist.toFixed(0)} M TO FINISH • NEXT WAYPOINT IN ${step.next_waypoint?.distance_m || 0} M`,
        answer: `Scanning HiRISE & THEMIS layers ahead (heading ${Math.round(step.heading_deg || 45)}°): over the next 180 meters, maximum terrain slope is ${maxAheadSlope.toFixed(1)}° and sand slip index reaches ${Math.round(maxAheadSand * 100)}%. ${maxAheadSlope >= 15 ? 'Caution: steep canyon wall ahead—SEXTANT A* smoothly contours along a safe bench.' : 'The sector ahead is gentle and safe for walking at ' + (step.walk_speed_ms || 1.4).toFixed(2) + ' m/s.'}`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// 前方180m 地形・リスク予測スキャン',
        title: `ゴールまで残り ${remDist.toFixed(0)} M • 次の経路点まで ${step.next_waypoint?.distance_m || 0} M`,
        answer: `進路方位 ${Math.round(step.heading_deg || 45)}° の前方180m区間をHiRISE・THEMISデータで解析中：最大傾斜角は ${maxAheadSlope.toFixed(1)}°、砂地スリップ率は最大 ${Math.round(maxAheadSand * 100)}% です。${maxAheadSlope >= 15 ? '注意：前方に急斜面がありますが、SEXTANT A*が安全なテラス状の等高線に沿って迂回誘導します。' : '前方区間は平坦で安定しており、歩行速度 ' + (step.walk_speed_ms || 1.4).toFixed(2) + ' m/s で安全に前進可能です。'}`
      };
    }
    return {
      category: '// ПРОГНОЗ ТРАССЫ НА 180 МЕТРОВ ВПЕРЁД',
      title: `ДО ФИНИША ОСТАЛОСЬ ${remDist.toFixed(0)} М • СЛЕД. ПОВОРОТ ЧЕРЕЗ ${step.next_waypoint?.distance_m || 0} М`,
      answer: `Сканирую рельеф HiRISE и THEMIS впереди по курсу (${Math.round(step.heading_deg || 45)}°): на ближайших 180 метрах максимальный уклон составит ${maxAheadSlope.toFixed(1)}°, вязкость песка — до ${Math.round(maxAheadSand * 100)}%. ${maxAheadSlope >= 15 ? 'Внимание: впереди крутой склон каньона, алгоритм SEXTANT A* плавно огибает его по безопасной полке.' : 'Участок впереди ровный и полностью безопасный для ходьбы со скоростью ' + (step.walk_speed_ms || 1.4).toFixed(2) + ' м/с.'}`
    };
  }

  if (topic === 'minerals') {
    if (lang === 'en') {
      return {
        category: '// MRO CRISM / PIXL SPECTROMETRY',
        title: `NEAREST TARGET: ${boulderText.name.toUpperCase()} (${distToRock} M)`,
        answer: `Closest geological outcrop is "${boulderText.name}" at ${distToRock} meters (${boulderText.mineral_class}, formula ${nearestBoulder.formula}). Biosignature potential index: ${nearestBoulder.biosignature_index}%! CRISM absorption bands: ${nearestBoulder.crism_bands_um.join(', ')} µm. ${boulderText.description} I have highlighted this boulder on the 3D map.`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// MRO CRISM / PIXL 鉱物分光解析',
        title: `最寄りターゲット：${boulderText.name}（距離 ${distToRock} M）`,
        answer: `現在地に最も近い地質露頭は ${distToRock}m 先の「${boulderText.name}」（${boulderText.mineral_class}、化学式 ${nearestBoulder.formula}）です。バイオシグネチャー（生命兆候）指数：${nearestBoulder.biosignature_index}%！CRISM吸収帯：${nearestBoulder.crism_bands_um.join(', ')} µm。${boulderText.description} 3Dマップ上でこの岩塊をハイライト表示しました。`
      };
    }
    return {
      category: '// СПЕКТРОМЕТРИЯ MRO CRISM / PIXL',
      title: `БЛИЖАЙШАЯ ЦЕЛЬ: ${boulderText.name.toUpperCase()} (${distToRock} М)`,
      answer: `Ближайшее к вам геологическое обнажение — «${boulderText.name}» в ${distToRock} метрах (${boulderText.mineral_class}, формула ${nearestBoulder.formula}). Индекс потенциальной биосигнатуры: ${nearestBoulder.biosignature_index}%! Линии поглощения CRISM: ${nearestBoulder.crism_bands_um.join(', ')} мкм. ${boulderText.description} Я выделила этот валун зелёной голографической рамкой на 3D-карте.`
    };
  }

  if (topic === 'compare') {
    if (lang === 'en') {
      return {
        category: '// SEXTANT A* NAVIGATION ANALYTICS',
        title: `+${cmp?.o2SavedPct || 16.5}% O₂ SAVED & ${cmp?.naiveCliffs || 6} CLIFFS BYPASSED`,
        answer: `Walking along the direct red dashed line crosses ${cmp?.naiveCliffs || 6} hazardous cliffs up to ${cmp?.naiveMaxSlope || 28.4}° and deep Séítah sand traps—spiking heart rate to ${cmp?.naiveMaxHR || 174} BPM and draining O₂ down to ${cmp?.naiveFinalO2 || 74.2}%. Our serpentine SEXTANT A* route contours around the mesas and saves +${cmp?.o2SavedPct || 16.5}% oxygen while keeping slopes below ${cmp?.smartMaxSlope || 14.2}°!`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// SEXTANT A* 航法最適化アナリティクス',
        title: `酸素 +${cmp?.o2SavedPct || 16.5}% 節約 ＆ ${cmp?.naiveCliffs || 6}箇所の断崖を完全回避`,
        answer: `赤破線の「直線ルート」を進むと、最大傾斜 ${cmp?.naiveMaxSlope || 28.4}° の危険な断崖 ${cmp?.naiveCliffs || 6}箇所とセイタ砂丘の流砂を横断することになり、心拍数は ${cmp?.naiveMaxHR || 174} BPM に達し、O₂残量は ${cmp?.naiveFinalO2 || 74.2}% まで低下します。SEXTANT A* の蛇行ルートは岩山を滑らかに迂回し、最大傾斜を ${cmp?.smartMaxSlope || 14.2}° に抑えて酸素を +${cmp?.o2SavedPct || 16.5}% 節約します！`
      };
    }
    return {
      category: '// АНАЛИТИКА НАВИГАЦИИ SEXTANT A*',
      title: `ЭКОНОМИЯ КИСЛОРОДА +${cmp?.o2SavedPct || 16.5}% И ОБХОД ${cmp?.naiveCliffs || 6} ОБРЫВОВ`,
      answer: `Если идти напрямик по красной пунктирной линии, вы попадёте на ${cmp?.naiveCliffs || 6} смертельно опасных обрывов с уклоном до ${cmp?.naiveMaxSlope || 28.4}° и вязкие пески Сейта: пульс взлетит до ${cmp?.naiveMaxHR || 174} BPM, а остаток O₂ упадёт до ${cmp?.naiveFinalO2 || 74.2}%. Наш извилистый маршрут SEXTANT A* огибает скалы и экономит вам +${cmp?.o2SavedPct || 16.5}% кислорода при безопасном уклоне до ${cmp?.smartMaxSlope || 14.2}°!`
    };
  }

  if (topic === 'shelter') {
    if (lang === 'en') {
      return {
        category: '// RADIATION SAFETY & SHELTER PROTOCOL',
        title: `NEAREST SHELTER: ${shelterName.toUpperCase()} (${shelterDist} M)`,
        answer: `From your current position, "${shelterName}" is ${shelterDist} meters away at azimuth ${shelterAz}°. At current pace, egress takes ${(shelterDist / 82).toFixed(1)} min. The shelter blocks up to 96% of SPE solar proton radiation. Current ambient dose rate: ${(step.radiation_usv_h || 25.4).toFixed(1)} µSv/h.`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// 放射線防護＆避難シェルタープロトコル',
        title: `最寄りシェルター：${shelterName}（距離 ${shelterDist} M）`,
        answer: `現在地から「${shelterName}」まで方位 ${shelterAz}°、距離 ${shelterDist} m です。現在の歩行速度で ${(shelterDist / 82).toFixed(1)} 分で到達可能です。このシェルターは太陽陽子イベント(SPE)の放射線を最大96%遮蔽します。現在の外部線量率：${(step.radiation_usv_h || 25.4).toFixed(1)} µSv/h。`
      };
    }
    return {
      category: '// ПРОТОКОЛ РАДИАЦИОННОЙ БЕЗОПАСНОСТИ',
      title: `БЛИЖАЙШЕЕ УКРЫТИЕ: ${shelterName.toUpperCase()} (${shelterDist} М)`,
      answer: `От вашей текущей позиции до лавового модуля «${shelterName}» ровно ${shelterDist} метров по азимуту ${shelterAz}°. При текущей скорости вы доберётесь туда за ${(shelterDist / 82).toFixed(1)} мин. Укрытие гасит до 94% протонной радиации солнечных вспышек SPE. Текущий фон снаружи: ${(step.radiation_usv_h || 25.4).toFixed(1)} мкЗв/ч.`
    };
  }

  if (topic === 'comm') {
    if (lang === 'en') {
      return {
        category: '// UHF TELECOMMUNICATIONS & INGENUITY DRONE',
        title: `OLYMPUS-1 BASE LINK: ${droneRelayActive ? 'UHF RELAY +14 dB ACTIVE' : 'DIRECT LOS CHANNEL'}`,
        answer: `Distance to Olympus-1 Base 15m mast is ${Math.round(step.comm?.distance_m || 240)} m (azimuth ${Math.round(step.comm?.azimuth_deg || 210)}°). UHF signal level: ${((step.comm?.signal_dbm || -62) + (droneRelayActive ? 14 : 0)).toFixed(1)} dBm. Scout helicopter Ingenuity flies 18 meters ahead, scanning terrain with LIDAR and bridging canyon radio shadows.`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// UHF通信リンク＆インジェニュイティ偵察機',
        title: `オリンポス1基地通信：${droneRelayActive ? 'UHF中継 +14 dB 稼働中' : '直接見通し通信 (LOS)'}`,
        answer: `オリンポス1基地の15m通信塔まで距離 ${Math.round(step.comm?.distance_m || 240)} m（方位 ${Math.round(step.comm?.azimuth_deg || 210)}°）、UHF信号強度は ${((step.comm?.signal_dbm || -62) + (droneRelayActive ? 14 : 0)).toFixed(1)} dBm です。偵察ヘリ「インジェニュイティ」が前方高度18mを先行飛行し、LIDARスキャンと渓谷の電波遮蔽中継を行っています。`
      };
    }
    return {
      category: '// ТЕЛЕКОММУНИКАЦИИ UHF И ДРОН INGENUITY',
      title: `СВЯЗЬ С БАЗОЙ «ОЛИМП-1»: ${droneRelayActive ? 'АКТИВЕН РЕТРАНСЛЯТОР +14 dB' : 'ПРЯМОЙ КАНАЛ LOS'}`,
      answer: `Дистанция до 15-метровой антенны базы «Олимп-1» — ${Math.round(step.comm?.distance_m || 240)} м (азимут ${Math.round(step.comm?.azimuth_deg || 210)}°). Уровень сигнала UHF: ${((step.comm?.signal_dbm || -62) + (droneRelayActive ? 14 : 0)).toFixed(1)} dBm. Разведывательный вертолёт Ingenuity летит впереди вас на высоте 18 метров, сканируя рельеф LIDAR-лучом и устраняя радиотени каньона.`
    };
  }

  if (topic === 'weather') {
    if (lang === 'en') {
      return {
        category: '// JEZERO CRATER METEOROLOGY (MEDA // PERSEVERANCE)',
        title: 'AMBIENT TEMP -58 °C • PRESSURE 7.4 mbar • GRAVITY 0.38g',
        answer: `You are in the ancient Neretva Vallis delta (Jezero Crater, 18.38°N, 77.58°E, MOLA elevation ${step.mola_elevation_m || -2532} m). Atmosphere: 95.3% CO₂, surface pressure 7.4 mbar, wind speed 6.2 m/s, dust optical depth τ = 0.45. 3.7 billion years ago, rivers flowed into a deep lake here—preserving ancient microbial biosignatures in clay and carbonate strata!`
      };
    }
    if (lang === 'ja') {
      return {
        category: '// ジェゼロ・クレーター気象テレメトリ (MEDA // PERSEVERANCE)',
        title: '外気温 -58 °C • 気圧 7.4 mbar • 重力 0.38g',
        answer: `現在地は古代ネレトヴァ渓谷デルタ（ジェゼロ・クレーター 18.38°N, 77.58°E、MOLA標高 ${step.mola_elevation_m || -2532} m）です。大気組成：CO₂ 95.3%、地表気圧 7.4 mbar、風速 6.2 m/s、ダスト光学的厚さ τ = 0.45。37億年前ここは河川が注ぐ深い湖であり、周囲の粘土鉱物や炭酸塩岩に太古の微生物の痕跡が保存されています！`
      };
    }
    return {
      category: '// МЕТЕОСВОДКА КРАТЕРА ЕЗЕРО (MEDA // PERSEVERANCE)',
      title: 'ТЕМПЕРАТУРА СРЕДЫ -58 °C • ДАВЛЕНИЕ 7.4 мбар • ГРАВИТАЦИЯ 0.38g',
      answer: `Вы находитесь в дельте древнего каньона Неретва (кратер Езеро, 18.38°N, 77.58°E, высота MOLA ${step.mola_elevation_m || -2532} м). Атмосфера: 95.3% CO₂, давление у поверхности 7.4 мбар, скорость ветра 6.2 м/с, оптическая толщина пыли τ = 0.45. 3.7 млрд лет назад здесь текли реки и существовало глубокое озеро, поэтому глины и карбонаты вокруг вас хранят следы древней микробной жизни!`
    };
  }

  const qShort = rawQuery.slice(0, 44).toUpperCase() + (rawQuery.length > 44 ? '...' : '');
  if (lang === 'en') {
    return {
      category: '// ARIA-9 GENERAL TACTICAL INTELLIGENCE',
      title: `QUERY: "${qShort}"`,
      answer: `Copy that, Astronaut! Situation report for your query ("${rawQuery}"): you are at step ${idx + 1} of ${totalSteps} (X: ${Math.round(step.x || 0)}m, Z: ${Math.round(step.z || 0)}m, MOLA ${step.mola_elevation_m || -2530}m). Heart rate ${Math.round(step.heart_rate_bpm || 78)} BPM, O₂ reserve ${(step.o2_remaining_pct || 95).toFixed(1)}% (~${o2MinutesLeft} min), ${remDist.toFixed(0)} m remaining to finish. Nearest CRISM target is "${boulderText.name}" (${distToRock} m, biosignature ${nearestBoulder?.biosignature_index || 96}%), nearest shelter in ${shelterDist} m. All systems under continuous monitoring!`
    };
  }
  if (lang === 'ja') {
    return {
      category: '// ARIA-9 統合戦術インテリジェンス応答',
      title: `質問解析：「${qShort}」`,
      answer: `了解しました、宇宙飛行士！「${rawQuery}」に関する状況報告：現在ステップ ${idx + 1}/${totalSteps}（座標 X: ${Math.round(step.x || 0)}m, Z: ${Math.round(step.z || 0)}m、MOLA標高 ${step.mola_elevation_m || -2530}m）。心拍数 ${Math.round(step.heart_rate_bpm || 78)} BPM、酸素残量 ${(step.o2_remaining_pct || 95).toFixed(1)}%（約 ${o2MinutesLeft} 分）、ゴールまで残り ${remDist.toFixed(0)} m。最寄りCRISM目標は「${boulderText.name}」（${distToRock} m、生命兆候 ${nearestBoulder?.biosignature_index || 96}%）、最寄りシェルターまで ${shelterDist} m です。全システムを常時監視しています！`
    };
  }
  return {
    category: '// УНИВЕРСАЛЬНЫЙ ИНТЕЛЛЕКТ ARIA-9: ОТВЕТ НА ЗАПРОС',
    title: `ЗАПРОС: «${qShort}»`,
    answer: `Принято, космонавт! Докладываю обстановку по вашему запросу («${rawQuery}»): вы на шаге ${idx + 1} из ${totalSteps} (координаты X: ${Math.round(step.x || 0)}м, Z: ${Math.round(step.z || 0)}м, высота MOLA ${step.mola_elevation_m || -2530}м). Пульс ${Math.round(step.heart_rate_bpm || 78)} BPM, запас кислорода ${(step.o2_remaining_pct || 95).toFixed(1)}% (хватит на ~${o2MinutesLeft} мин), до финиша ${remDist.toFixed(0)} м. Ближайшая научная цель CRISM — «${boulderText.name}» (${distToRock} м, биосигнатура ${nearestBoulder?.biosignature_index || 96}%), ближайшее укрытие — в ${shelterDist} м. Все системы под моим непрерывным контролем!`
  };
}
