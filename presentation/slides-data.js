window.PRESENTATION_DATA = {
  ui: {
    en: {
      docTitle: "NASA SEXTANT 3D & xEMU AR HUD — Bilingual Presentation",
      brandKicker: "NASA SPACE APPS // CHALLENGE #11",
      brandTitle: "SEXTANT 3D & xEMU AR HUD",
      btnNotes: "Notes",
      btnOverview: "Grid",
      btnPrint: "PDF",
      btnVoice: "Voice EN",
      btnVoiceStop: "Mute EN",
      btnAutoTour: "Auto",
      btnFullscreen: "Fullscreen",
      btnExitFullscreen: "Exit Fullscreen",
      btnPrev: "Prev",
      btnNext: "Next",
      notesHeading: "Speaker Script Cue (6-Min Keynote)",
      overviewTitle: "Slide Deck Overview — 11 Slides",
      shortcutHint: "← → Navigate · V Voice EN · A Auto · N Notes · G Grid · F Fullscreen"
    },
    ja: {
      docTitle: "NASA SEXTANT 3D & xEMU AR HUD — プレゼンテーション",
      brandKicker: "NASA SPACE APPS // チャレンジ #11",
      brandTitle: "SEXTANT 3D & xEMU AR HUD",
      btnNotes: "発表メモ",
      btnOverview: "一覧",
      btnPrint: "PDF出力",
      btnVoice: "英語音声",
      btnVoiceStop: "音声停止",
      btnAutoTour: "自動",
      btnFullscreen: "全画面",
      btnExitFullscreen: "全画面解除",
      btnPrev: "前へ",
      btnNext: "次へ",
      notesHeading: "スピーカー台本メモ（6分間プレゼン）",
      overviewTitle: "スライド一覧 — 全11枚",
      shortcutHint: "← → 移動 · V 英語音声 · A 自動 · N メモ · G 一覧 · F 全画面"
    }
  },

  slides: [
    {
      id: "hero",
      layout: "hero",
      timing: "0:00 – 0:30",
      badge: "JEZERO CRATER",
      en: {
        shortTitle: "Mission Overview",
        eyebrow: "MARS EVA DIGITAL TWIN // NERETVA VALLIS SECTOR",
        title: "NASA SEXTANT 3D & xEMU AR HUD",
        lead: "An integrated 3D mission planner, autonomous Ingenuity scout drone wingman, and helmet Augmented Reality HUD with ARIA-9 AI survival copilot for Martian surface EVAs.",
        telemetry: [
          { label: "LANDING SITE", value: "18.38°N, 77.58°E" },
          { label: "MOLA BASELINE", value: "-2545.0 m" },
          { label: "PLSS O₂ TANK", value: "580 L MAX" },
          { label: "RENDER ENGINE", value: "60 FPS WebGL" }
        ],
        pillars: [
          {
            idx: "01",
            title: "Orbital SEXTANT A*",
            desc: "Multi-layer 3D contour routing across MOLA, HiRISE, THEMIS sand traps, CRISM minerals & UHF LOS."
          },
          {
            idx: "02",
            title: "xEMU Visor & Drone",
            desc: "1.8 m helmet dive HUD, live ECG/PLSS telemetry, 20 m sector radar, plus 18 m ahead Ingenuity scout."
          },
          {
            idx: "03",
            title: "ARIA-9 AI Copilot",
            desc: "Proactive hazard briefings, 180 m lookahead, and instant autonomous recovery across 4 anomaly scenarios."
          }
        ],
        notes: [
          "Hook: When an astronaut steps onto Mars in Jezero Crater, Earth Mission Control is minutes away by light-speed lag. Every degree of slope and every liter of oxygen can decide survival.",
          "Introduce the platform: SEXTANT 3D & xEMU AR HUD unifies orbital route science, a forward scout drone, and a suit helmet AI copilot in one browser-native simulator."
        ]
      },
      ja: {
        shortTitle: "ミッション概要",
        eyebrow: "火星EVAデジタルツイン // ネレトヴァ峡谷セクター",
        title: "NASA SEXTANT 3D & xEMU AR HUD",
        lead: "火星ジェゼロ・クレーターでの船外活動（EVA）を支える、3D軌道経路計画・小型偵察ドローン「Ingenuity」連携・次世代宇宙服ヘルメットAR HUD・AI副操縦士ARIA-9の統合システム。",
        telemetry: [
          { label: "着陸目標座標", value: "18.38°N, 77.58°E" },
          { label: "MOLA 基準標高", value: "-2545.0 m" },
          { label: "PLSS 酸素容量", value: "最大 580 L" },
          { label: "描画エンジン", value: "60 FPS WebGL" }
        ],
        pillars: [
          {
            idx: "01",
            title: "軌道 SEXTANT A*",
            desc: "MOLA・HiRISE・THEMIS軟弱砂地・CRISM鉱物・UHF見通し通信を統合した地形追従3D最適経路探索。"
          },
          {
            idx: "02",
            title: "xEMU バイザー & ドローン",
            desc: "地上1.8m視点HUD、リアルタイム心電図/生命維持、20m方位レーダー、18m先行偵察ドローン。"
          },
          {
            idx: "03",
            title: "AI副操縦士 ARIA-9",
            desc: "180m先までの危険先読み、対話型テレメトリ解析、4種類の緊急事態における自動回避プロトコル。"
          }
        ],
        notes: [
          "導入：火星でのEVAでは地球との通信遅延によりリアルタイム指令が不可能です。わずかな急斜面や砂トラップが生命維持装置（PLSS）の酸素を大きく奪います。",
          "本プロジェクトは、軌道データによる安全ルート設計からヘルメット内のAR誘導、緊急時の自動退避までを一気通貫で解決します。"
        ]
      }
    },

    {
      id: "problem",
      layout: "problem",
      timing: "0:30 – 1:00",
      badge: "OPERATIONAL GAP",
      en: {
        shortTitle: "Challenge & Solution",
        kicker: "02 // MISSION CHALLENGE & PARADIGM SHIFT",
        title: "Why Fragmented 2D Maps Fail on Mars EVAs",
        subtitle: "Astronauts face brutal physics constraints and communication isolation inside crater canyons.",
        badgePill: "AUTONOMOUS SURVIVAL LOOP",
        leftHeading: "FOUR LETHAL MARS EVA RISKS",
        hazards: [
          {
            metric: "COMM LAG",
            title: "No Real-Time Earth Control",
            desc: "One-way radio delay prevents CapCom from warning a suited crew member before a sudden terrain hazard."
          },
          {
            metric: "580 L O₂",
            title: "Strict PLSS Metabolic Budget",
            desc: "Climbing >19° slopes spikes heart rate up to 176 BPM and burns up to 3.25 L/min of suit oxygen."
          },
          {
            metric: "SLIP / CLIFF",
            title: "HiRISE Cliffs & THEMIS Regolith",
            desc: "High-albedo, low-thermal-inertia sand traps cause wheel/boot sinkage while basalt escarpments threaten falls."
          },
          {
            metric: "SHADOW",
            title: "UHF Canyon Blackouts",
            desc: "High crater ridges diffract and block line-of-sight RF telemetry back to the 15 m Olympus-1 hab antenna."
          }
        ],
        rightHeading: "OUR END-TO-END DIGITAL TWIN SOLUTION",
        loopSteps: [
          {
            num: "STEP 1",
            title: "Contour-Following Orbital Planning",
            desc: "Fuses 5 NASA orbital layers into one weighted A* solver to lock in safe, oxygen-optimal science traverses before airlock depress."
          },
          {
            num: "STEP 2",
            title: "Ingenuity Scout & Visor Dive",
            desc: "Switches seamlessly from orbit to 1.8 m helmet perspective with an airborne coaxial drone scouting 18 m ahead and bridging UHF shadows."
          },
          {
            num: "STEP 3",
            title: "ARIA-9 AI Autonomous Mitigation",
            desc: "Monitors telemetry continuously, detects rockfalls, LCVG leaks, dust devils, or SPE radiation storms, and computes instant recovery routes."
          }
        ],
        notes: [
          "Highlight the 4 physics constraints: delayed Earth link, strict 580 L oxygen ceiling, steep >19° cliffs & THEMIS sand traps, and UHF radio dead zones.",
          "Show how our app connects orbital planning -> drone scouting -> helmet AR + ARIA-9 AI in one continuous operational loop."
        ]
      },
      ja: {
        shortTitle: "課題と解決策",
        kicker: "02 // ミッション課題と設計アプローチ",
        title: "従来の2D地図が火星船外活動で限界を迎える理由",
        subtitle: "通信遅延・酸素上限・急峻な地形が重なる環境では、計画と現地誘導の分断が致命的になります。",
        badgePill: "自律生存ループ",
        leftHeading: "火星EVAにおける4大リスク",
        hazards: [
          {
            metric: "通信遅延",
            title: "地球からのリアルタイム支援不可",
            desc: "片道数分〜20分超の電波遅延により、眼前の崖や砂嵐に対して地球の管制官が即座に警告できません。"
          },
          {
            metric: "580 L O₂",
            title: "厳格なPLSS酸素・代謝上限",
            desc: "19°超の急登は心拍数を最大176 BPMへ押し上げ、酸素消費を最大3.25 L/minまで急増させます。"
          },
          {
            metric: "崖・軟弱砂",
            title: "HiRISE急崖とTHEMIS砂トラップ",
            desc: "熱慣性の低い細粒レゴリスは歩行効率を奪い、玄武岩の崖は滑落リスクをもたらします。"
          },
          {
            metric: "通信遮断",
            title: "峡谷陰でのUHF見通し損失",
            desc: "クレーター縁や尾根が基地局アンテナ（高さ15m）からのUHF電波を回折減衰・遮断します。"
          }
        ],
        rightHeading: "一気通貫型デジタルツインによる解決",
        loopSteps: [
          {
            num: "STAGE 1",
            title: "等高線追従SEXTANT A*軌道計画",
            desc: "5層のNASA探査データ（MOLA・HiRISE・THEMIS・CRISM・UHF）を統合し、最小酸素消費かつ安全な科学探査ルートを事前算出。"
          },
          {
            num: "STAGE 2",
            title: "先行ドローン偵察 & ヘルメットAR没入",
            desc: "軌道視点から地上1.8mバイザーHUDへシームレス移行。18m前方を飛ぶドローンが地形走査と通信中継を担当。"
          },
          {
            num: "STAGE 3",
            title: "AI副操縦士ARIA-9による緊急自律対応",
            desc: "落石・冷却系リーク・ダストデビル・太陽陽子嵐に対し、即座に回避ルートや最寄りシェルター退避を自動計算。"
          }
        ],
        notes: [
          "従来の地上システムでは、軌道解析ソフトと宇宙服ディスプレイ、緊急時プロトコルが別々でした。",
          "本システムは、出撃前の最適化からヘルメット内のAR誘導・AI生存支援までを単一リアルタイム空間へ統合しています。"
        ]
      }
    },

    {
      id: "nasa-sources",
      layout: "nasa-sources",
      timing: "1:00 – 1:40",
      badge: "NASA DATA PROVENANCE",
      en: {
        shortTitle: "NASA Datasets",
        kicker: "03 // NASA DATASETS, MISSIONS & ENGINEERING STANDARDS USED",
        title: "Grounded in Six Real NASA Planetary Datasets & EVA Models",
        subtitle: "Every coordinate, mineral target, metabolic curve, and flight layer derives directly from published NASA Mars missions and Space Apps Challenge #11 specs.",
        badgePill: "VERIFIED SCIENCE BASIS",
        sources: [
          {
            badge: "MGS MOLA DEM",
            mission: "Mars Global Surveyor",
            title: "Jezero Geodesy & Gravity Datum",
            desc: "Landing coordinates 18.38°N, 77.58°E (Western Delta, Neretva Vallis, Séítah, Kodiak), MOLA datum -2545.0 m, and gravity g = 3.721 m/s².",
            usage: "3D terrain elevation mesh & slope gradients"
          },
          {
            badge: "MRO HiRISE",
            mission: "Mars Reconnaissance Orbiter",
            title: "High-Res Terrain & Slope Hazards",
            desc: "High-resolution 0°–40° surface slope masks identifying safe <9° corridors, >19° hazard cones, and >21° forbidden A* cliff faces.",
            usage: "Safety masks & contour-following A* cost"
          },
          {
            badge: "ODYSSEY THEMIS",
            mission: "2001 Mars Odyssey",
            title: "Thermal Inertia (TIU) & Sand Traps",
            desc: "Thermal Emission Imaging System dust inertia maps locating unconsolidated Aeolian sand deposits that degrade boot traction.",
            usage: "Regolith slip index & exertion penalty"
          },
          {
            badge: "CRISM + PIXL/SHERLOC",
            mission: "MRO & Perseverance Rover",
            title: "5 Mineral Classes & 8 Jezero Outcrops",
            desc: "0.8–2.6 µm NIR bands, 7 oxides (SiO₂, FeO, MgO, Al₂O₃, CaO, SO₃, H₂O/CO₂) modeled on Cheyava Falls, Bright Angel, Lefroy Bay, Wildcat Ridge & 4 more.",
            usage: "Spectral science rewards & 220 m AR lock"
          },
          {
            badge: "SEXTANT + xEMU / PLSS",
            mission: "NASA EVA Physiology",
            title: "Metabolic Cost & Suit Visor HUD",
            desc: "NASA SEXTANT + Pandolf metabolic model (175–960 W), ECG (70–176 BPM), LCVG coolant temp (18.0–27.8 °C), 580 L O₂ reserve & 1.8 m visor HUD.",
            usage: "Step-by-step O₂ timeline & helmet telemetry"
          },
          {
            badge: "INGENUITY + UHF + SPE",
            mission: "Mars Helicopter & Deep Space",
            title: "Drone Relay, Fresnel LOS & Radiation",
            desc: "Ingenuity coaxial wingman (18 m recon, +14 dB relay), FSPL + Fresnel ridge diffraction (15 m mast), and SPE solar flare shelter shielding.",
            usage: "UHF shadow map & 92%–99.8% shelter egress"
          }
        ],
        notes: [
          "Explicitly answer how NASA data powers this project: we combined MOLA (-2545 m datum, g = 3.721 m/s²), HiRISE slopes, Odyssey THEMIS thermal inertia, and MRO CRISM + Perseverance PIXL/SHERLOC chemistry across 8 named Jezero outcrops.",
          "Engineering models also come directly from NASA: SEXTANT + Pandolf human metabolic equations for xEMU PLSS oxygen burn, Ingenuity coaxial flight dynamics, Fresnel canyon UHF loss, and SPE radiation sheltering."
        ]
      },
      ja: {
        shortTitle: "使用NASAデータ",
        kicker: "03 // 活用したNASA探査データ・ミッション・工学標準",
        title: "6つの実在NASA惑星科学データ＆宇宙服工学モデルに基づく設計",
        subtitle: "NASA Space Apps Challenge #11 に沿い、ジェゼロ・クレーターの実在座標・探査機データ・人間工学数式を統合しています。",
        badgePill: "NASA実データ準拠",
        sources: [
          {
            badge: "MGS MOLA DEM",
            mission: "マーズ・グローバル・サーベイヤー",
            title: "ジェゼロ測地・標高基準 & 重力定数",
            desc: "着陸域 18.38°N, 77.58°E（西部三角州・ネレトヴァ峡谷・セイタ・コディアック）、基準標高 -2545.0 m、火星重力 g = 3.721 m/s²。",
            usage: "3D標高グリッド生成と物理傾斜ベース"
          },
          {
            badge: "MRO HiRISE",
            mission: "マーズ・リコネッサンス・オービター",
            title: "高解像度 傾斜角・急崖ハザード",
            desc: "0°–40°の路面勾配モデルにより、安全帯（<9°）・赤色崖警告（>=19.5°）・通常A*進入禁止斜度（>21°）を厳密判定。",
            usage: "ハザードマップ可視化 & A*経路制約"
          },
          {
            badge: "ODYSSEY THEMIS",
            mission: "2001 マーズ・オデッセイ",
            title: "熱慣性（TIU）＆ 風成砂トラップ",
            desc: "熱放射撮像システム（THEMIS）の熱慣性指標をもとに、歩行スリップや足取られを引き起こす細粒砂地帯をモデル化。",
            usage: "砂滑り指数と代謝ペナルティ計算"
          },
          {
            badge: "CRISM + PIXL/SHERLOC",
            mission: "MRO & Perseverance ローバー",
            title: "5鉱物クラス & 8箇所の実在露頭",
            desc: "0.8–2.6 µm近赤外吸収帯と7酸化物組成を用い、Cheyava Falls・Bright Angel・Lefroy Bay・Wildcat Ridge等8地点を再現。",
            usage: "科学報酬重み付け & 220m分光AR捕捉"
          },
          {
            badge: "SEXTANT + xEMU / PLSS",
            mission: "NASA EVA 生体工学モデル",
            title: "代謝負荷モデル & 宇宙服AR設計",
            desc: "NASA SEXTANT / Pandolf代謝式（175–960 W）、心拍70–176 BPM、LCVG水冷（18.0–27.8 °C）、580 L O₂容量、地上1.8 m視点HUD。",
            usage: "酸素消費予測とバイザーHUDテレメトリ"
          },
          {
            badge: "INGENUITY + UHF + SPE",
            mission: "火星ヘリコプター & 宇宙天気",
            title: "ドローン中継・フレネル回折・放射線防護",
            desc: "Ingenuity自律偵察機（前方18m・+14 dB中継）、15m基地アンテナのFSPL＋フレネル回折、太陽陽子嵐（SPE X9.4）遮蔽モデル。",
            usage: "通信死角マップと92%–99.8%避難誘導"
          }
        ],
        notes: [
          "審査員に最も伝わるNASA根拠スライドです。MOLA（-2545 m・重力3.721 m/s²）、HiRISE傾斜、Odyssey THEMIS熱慣性、CRISM + Perseverance（Cheyava Falls等の8露頭とPIXL酸化物）を明確に挙げます。",
          "さらに経路探索・生体計算はNASA SEXTANTとPandolf式、xEMU PLSS仕様、Ingenuityヘリコプター、フレネル電波回折、SPE放射線遮蔽データに基づいています。"
        ]
      }
    },

    {
      id: "architecture",
      layout: "arch",
      timing: "1:40 – 2:10",
      badge: "SYSTEM STACK",
      en: {
        shortTitle: "Architecture",
        kicker: "04 // SYSTEM ARCHITECTURE & DATAFLOW",
        title: "FastAPI Physics Engine + 60 FPS WebGL Visor Client",
        subtitle: "Zero black-box mocks: real discrete grid pathfinding, PLSS metabolic thermodynamics, and diffraction radio math.",
        badgePill: "FULL-STACK REAL-TIME",
        nodes: [
          {
            tag: "LAYER 01 // PLANETARY MODELS",
            title: "Jezero Physical Grid",
            items: [
              "128 × 128 high-res nodes (10 m/cell = 1280 × 1280 m)",
              "MOLA base -2545.0 m & Neretva channel relief",
              "THEMIS Thermal Inertia sand slip fields",
              "8 CRISM/PIXL outcrops + 3 hardened shelters"
            ],
            foot: "backend/mars_physics.py"
          },
          {
            tag: "LAYER 02 // PYTHON SOLVERS",
            title: "A* & PLSS Physiology",
            items: [
              "Contour-following SEXTANT A* with uphill/cliff penalties",
              "Metabolic model (175–960 W), ECG HR (70–176 BPM)",
              "LCVG coolant loop & 580 L O₂ consumption curve",
              "FSPL + terrain diffraction UHF link check (15 m mast)"
            ],
            foot: "FastAPI 2.0 + NumPy"
          },
          {
            tag: "LAYER 03 // AR & 3D GRAPHICS",
            title: "Three.js Neon-Mars 3D",
            items: [
              "3400 m outer procedural Neon Waves terrain (60 FPS)",
              "CatmullRomCurve3 animated chevron traverse ribbon",
              "Dual 20 m 8-sector radar + synthesized Canvas ECG",
              "220 m CRISM spectral raycaster & LIDAR lighting mode"
            ],
            foot: "Vanilla ES6 JS + Three.js"
          },
          {
            tag: "LAYER 04 // AUTONOMY",
            title: "Ingenuity & ARIA-9 AI",
            items: [
              "18 m forward coaxial drone with +14 dB UHF relay",
              "180 m terrain lookahead & proactive hazard warnings",
              "Contextual Q&A across 7 tactical mission domains",
              "Instant anomaly recovery & shortest-time egress"
            ],
            foot: "EN / JA / RU Localized"
          }
        ],
        endpoints: [
          { cmd: "GET /api/init", desc: "Initializes terrain elevation, 5 overlay textures, shelters, presets & rock catalog" },
          { cmd: "POST /api/route", desc: "Computes weighted A* path + full step-by-step PLSS metabolic & O₂ timeline" },
          { cmd: "POST /api/emergency-route", desc: "Calculates fastest egress paths to Olympus-1 Base & 3 radiation shelters" },
          { cmd: "GET /api/probe", desc: "Returns orbital probe metadata (18.38°N, 77.58°E) & live rock mineral chemistry" }
        ],
        notes: [
          "Walk through the architecture left to right: planetary physics arrays on the server side feed exact A* and PLSS calculations over 4 clean FastAPI endpoints.",
          "The client renders the 1280 m detailed sector embedded in a 3400 m Neon Waves Mars horizon at 60 FPS."
        ]
      },
      ja: {
        shortTitle: "システム構成",
        kicker: "04 // システムアーキテクチャとデータフロー",
        title: "FastAPI物理演算コア + 60 FPS WebGL宇宙服HUDクライアント",
        subtitle: "単なる静的デモではなく、離散グリッド経路探索・代謝熱力学・電波回折損失をサーバー側で厳密計算。",
        badgePill: "リアルタイム統合基盤",
        nodes: [
          {
            tag: "01 // 惑星物理モデル",
            title: "ジェゼロ地形グリッド",
            items: [
              "128 × 128 高解像ノード（10 m刻み / 1280 × 1280 m）",
              "MOLA基準標高 -2545.0 m & ネレトヴァ流路起伏",
              "THEMIS熱慣性（TIU）に基づく砂滑り係数マップ",
              "8箇所のCRISM露頭岩体 & 3箇所の退避シェルター"
            ],
            foot: "backend/mars_physics.py"
          },
          {
            tag: "02 // PYTHON 物理ソルバー",
            title: "A*探索 & PLSS生体力学",
            items: [
              "等高線追従SEXTANT A*（急勾配・崖ペナルティ実装）",
              "代謝負荷（175–960 W）＆ 心拍数モデル（70–176 BPM）",
              "LCVG水冷ループ温度 & 580 L 酸素残量タイムライン",
              "自由空間損失＋地形回折によるUHF通信品質計算"
            ],
            foot: "FastAPI 2.0 + NumPy"
          },
          {
            tag: "03 // 3D描画・AR HUD",
            title: "Three.js ネオン火星空間",
            items: [
              "外周3400 mプロシージャルNeon Waves地形（60 FPS）",
              "CatmullRomCurve3 立体アニメ誘導シェブロン",
              "20 m 8方位危険レーダー ＆ Canvas心電図波形描画",
              "220 m レイキャスト分光スキャナ & 夜間LIDARモード"
            ],
            foot: "Vanilla ES6 JS + Three.js"
          },
          {
            tag: "04 // 自律支援エンジン",
            title: "Ingenuity & ARIA-9 AI",
            items: [
              "18 m前方偵察ドローン（二重反転ローター & +14 dB中継）",
              "進行方向180 m先の地形・砂・通信陰を先読み警告",
              "7つの戦術トピックに対応した即応Q&Aチャット",
              "4種の緊急事態での迂回ルート / 避難所即時誘導"
            ],
            foot: "英語・日本語・ロシア語対応"
          }
        ],
        endpoints: [
          { cmd: "GET /api/init", desc: "地形配列・5種類のNASAマップ・シェルター・岩体・ミッション初期データを配信" },
          { cmd: "POST /api/route", desc: "指定重み係数からA*経路と各地点での酸素・代謝・心拍推移を算出" },
          { cmd: "POST /api/emergency-route", desc: "放射線嵐などの緊急時に基地および3つの退避シェルターへの最短脱出路を計算" },
          { cmd: "GET /api/probe", desc: "探査地点（18.38°N, 77.58°E）上の地質データ・酸化物スペクトルを取得" }
        ],
        notes: [
          "バックエンドはPython / FastAPI + NumPyで128×128の火星地形・A*探索・PLSS消費計算を実行し、4つのREST APIでフロントエンドへ供給します。",
          "フロントエンドは重いフレームワークを使わずThree.jsとCanvas 2Dで軽快な60 FPSの描画を実現しています。"
        ]
      }
    },

    {
      id: "layers",
      layout: "layers",
      timing: "2:10 – 2:45",
      badge: "PHASE 1 // PLAN",
      en: {
        shortTitle: "5 Layers & A*",
        kicker: "05 // PHASE 1 — ORBITAL PLANNING & CONTOUR SEXTANT A*",
        title: "Five NASA Orbital Layers Driving Terrain-Aware Routing",
        subtitle: "Mission planners tune safety weights visually, double-click new waypoints in 3D, or launch 3 scientific presets.",
        badgePill: "NASA LAYER FUSION",
        layers: [
          {
            code: "MOLA 3D",
            color: "#64f9ff",
            bg: "rgba(100,249,255,0.14)",
            title: "Neon-Mars Altimetry & Crater Relief",
            desc: "Elevations centered around -2545.0 m across crater walls, deltas, and incised alluvial terraces."
          },
          {
            code: "HiRISE",
            color: "#ff4d57",
            bg: "rgba(255,77,87,0.14)",
            title: "Slope Stability & Cliff Mask (<9° Safe, >19° Cliff)",
            desc: "Highlights steep ridge hazards in crimson; normal A* actively forbids >21° faces unless emergency egress is forced."
          },
          {
            code: "THEMIS",
            color: "#ffb84a",
            bg: "rgba(255,184,74,0.14)",
            title: "Thermal Inertia (TIU) & Regolith Sand Slip",
            desc: "Maps unconsolidated Aeolian dust pockets where astronaut metabolic burn spikes and traction drops."
          },
          {
            code: "CRISM",
            color: "#57ff9a",
            bg: "rgba(87,255,154,0.14)",
            title: "5 Biosignature-Bearing Mineral Classes",
            desc: "Phyllosilicates (Clays), Carbonates, Hydrated Opaline Silica (SiO₂), Sulfates, and Hematite targets."
          },
          {
            code: "UHF LOS",
            color: "#b88cff",
            bg: "rgba(184,140,255,0.14)",
            title: "Line-of-Sight from 15 m Olympus-1 Antenna",
            desc: "Models Free-Space Path Loss plus ridge diffraction attenuation across canyon topography."
          }
        ],
        solverLabel: "CONTOUR-FOLLOWING SEXTANT A* SOLVER",
        solverTitle: "Weighted Multi-Objective Cost Function",
        formula: "Cost(u→v) = StepDist + w_slope·Climb & Cliff(>21°)\n          + w_sand·SlipIndex + w_comm·LOSLoss\n          - MineralScienceBonus",
        solverFeatures: [
          "2-pass path smoothing + CatmullRomCurve3 animated chevron ribbon",
          "Interactive double-click anywhere on the 3D terrain to insert waypoints",
          "Real-time tuning sliders: Slope Avoid, Sand Avoid, Comm Priority"
        ],
        presets: [
          { id: "EVA-01", name: "Neretva Delta Biosignature Traverse" },
          { id: "EVA-02", name: "Kodiak Terrace & Bright Angel Loop" },
          { id: "EVA-03", name: "Séítah Ridge & Canyon Relay" }
        ],
        notes: [
          "Explain the 5 distinct orbital science overlays a planner toggles in Phase 1 before launch.",
          "Emphasize how SEXTANT A* blends physical slope, sand trap penalty, UHF line-of-sight, and mineral rewards, smoothed with CatmullRomCurve3."
        ]
      },
      ja: {
        shortTitle: "5層マップ & A*",
        kicker: "05 // PHASE 1 — 軌道ミッション計画 & 等高線追従A*",
        title: "5種類のNASA探査データ層を統合した地形認識ルーティング",
        subtitle: "滑落・砂地・通信の重みスライダーをリアルタイム調整でき、3D地形上のダブルクリックで任意の中継点を追加可能。",
        badgePill: "5層データ融合",
        layers: [
          {
            code: "MOLA 3D",
            color: "#64f9ff",
            bg: "rgba(100,249,255,0.14)",
            title: "ネオン火星 標高・クレーター起伏モデル",
            desc: "基準標高 -2545.0 m を軸に、三角州や河谷段丘の立体構造を高精細メッシュで可視化。"
          },
          {
            code: "HiRISE",
            color: "#ff4d57",
            bg: "rgba(255,77,87,0.14)",
            title: "傾斜角・崖ハザード (<9° 安全 / >19° 危険崖)",
            desc: "急斜面を赤色で警告。通常探索では21°超の崖面を回避するよう強力にペナルティを課します。"
          },
          {
            code: "THEMIS",
            color: "#ffb84a",
            bg: "rgba(255,184,74,0.14)",
            title: "熱慣性（TIU）＆ 軟弱砂地スリップ指数",
            desc: "歩行効率を低下させ酸素消費を激増させる細粒砂の堆積エリアを特定。"
          },
          {
            code: "CRISM",
            color: "#57ff9a",
            bg: "rgba(87,255,154,0.14)",
            title: "生命痕跡有望な5種類の鉱物クラス分布",
            desc: "層状珪酸塩（粘土）・炭酸塩・含水オパール質シリカ（SiO₂）・硫酸塩・赤鉄鉱をマッピング。"
          },
          {
            code: "UHF LOS",
            color: "#b88cff",
            bg: "rgba(184,140,255,0.14)",
            title: "高さ15m Olympus-1基地からのUHF見通し通信",
            desc: "自由空間伝搬損失と地形稜線による電波回折減衰をグリッド単位で事前計算。"
          }
        ],
        solverLabel: "CONTOUR-FOLLOWING SEXTANT A*",
        solverTitle: "多目的コスト評価関数",
        formula: "Cost(u→v) = 移動距離 + w_slope·登坂&崖(>21°)\n          + w_sand·砂滑り損失 + w_comm·通信遮断\n          - 有望鉱物サイエンス報酬",
        solverFeatures: [
          "2パス経路平滑化 ＋ CatmullRomCurve3 立体アニメ誘導リボン",
          "3D地形上の任意の場所をダブルクリックして新規ウェイポイントを追加",
          "3つの事前プリセット（EVA-01〜03）とリアルタイム最適化スライダー"
        ],
        presets: [
          { id: "EVA-01", name: "ネレトヴァ・デルタ生命痕跡調査ルート" },
          { id: "EVA-02", name: "コディアック段丘・ブライトエンジェル巡回" },
          { id: "EVA-03", name: "セイタ尾根＆峡谷リレー縦走" }
        ],
        notes: [
          "計画フェーズでは、MOLA・HiRISE・THEMIS・CRISM・UHFの5層をワンクリックで切り替え、地形リスクを直感的に把握できます。",
          "さらに『登り・砂・通信』の優先度スライダーを動かすと、A*が即座に等高線に沿った安全な蛇行ルートを再計算します。"
        ]
      }
    },

    {
      id: "comparison",
      layout: "compare",
      timing: "2:45 – 3:15",
      badge: "SAFETY GAIN",
      en: {
        shortTitle: "Direct vs A*",
        kicker: "06 // QUANTITATIVE PROOF — DIRECT LINE VS SEXTANT A*",
        title: "Why Longest-Slope Detours Save Oxygen & Crew Lives",
        subtitle: "Side-by-side terrain telemetry proves why cutting straight across Jezero escarpments triggers physiological overload.",
        badgePill: "SAFETY COMPARISON HUD",
        chartTitle: "Elevation & Physiological Load Along Traverse",
        legendDirect: "Naive Direct Path (Red Dashed — Cliff Traps)",
        legendAstar: "SEXTANT A* Contour Route (Cyan — Stable HR)",
        colHeadMetric: "Telemetry Metric",
        colHeadDirect: "Naive Direct",
        colHeadAstar: "SEXTANT A*",
        metrics: [
          {
            name: "Steep Cliff Exposure (>19°)",
            bad: "3–7 Critical Faces",
            good: "0 Cliffs Avoided"
          },
          {
            name: "Peak Grade & Suit HR",
            bad: ">26° · up to 176 BPM",
            good: "<12° · ~108–124 BPM"
          },
          {
            name: "PLSS O₂ Consumption Spike",
            bad: "Up to 3.25 L/min",
            good: "Contour-Capped Saving"
          },
          {
            name: "3D Hazard Pinning",
            bad: "Red Hazard Cones + Worst Pin",
            good: "Verified Smooth Spline"
          }
        ],
        chartCallout: "Winding slightly longer along gentle contours avoids quadratic metabolic climb penalties and cliff falls.",
        notes: [
          "Use the Direct vs A* mode in the live app as proof: a straight line looks shorter in 2D, yet drops astronauts onto >=19.5° crimson cliff cones.",
          "Our dual chart displays Elevation and Heart Rate side-by-side so anyone immediately sees why SEXTANT A* finishes with safer pulse and higher O₂ margin."
        ]
      },
      ja: {
        shortTitle: "直線 vs A*比較",
        kicker: "06 // 定量的比較 — 直線ルート VS SEXTANT A*",
        title: "「最短直線」より「等高線迂回」が酸素と命を守る理由",
        subtitle: "アプリ内蔵の比較パネルは、3D空間に崖ハザードコーンを可視化し、標高・心拍数プロファイルで安全性を証明します。",
        badgePill: "ルート比較解析",
        chartTitle: "ルート全体の標高起伏 ＆ 宇宙飛行士心拍数プロファイル",
        legendDirect: "単純直線ルート（赤破線 — 急崖・高負荷）",
        legendAstar: "SEXTANT A* 最適化（シアン — 等高線安定）",
        colHeadMetric: "評価指標",
        colHeadDirect: "単純直線ルート",
        colHeadAstar: "SEXTANT A*",
        metrics: [
          {
            name: "危険急崖の通過数 (>19°)",
            bad: "複数の19.5°超危険コーン",
            good: "0箇所（完全回避）"
          },
          {
            name: "最大傾斜角 & 心拍数",
            bad: "26°超 · 最大 176 BPM",
            good: "緩勾配維持 · 安定心拍"
          },
          {
            name: "PLSS 酸素消費負荷",
            bad: "最大 3.25 L/min へ急増",
            good: "消費抑制・余剰酸素確保"
          },
          {
            name: "AR危険ピン表示",
            bad: "最悪地点を3D赤コーン警告",
            good: "全区間安全スプライン"
          }
        ],
        chartCallout: "水平距離がわずかに伸びても、急登を避けて等高線に沿うことで代謝消費と滑落リスクを劇的に削減します。",
        notes: [
          "デモでも一目で伝わる重要機能です。直線ルートをONにすると赤い破線と>=19.5°の赤い危険コーンが出現し、どの地点が一番危険かARピンで示されます。",
          "右側のテーブルとグラフによって、なぜA*の蛇行ルートの方が最終酸素残量が多く安全な心拍数を保てるのかを数値で示せます。"
        ]
      }
    },

    {
      id: "visor",
      layout: "visor",
      timing: "3:15 – 3:45",
      badge: "PHASE 2 // VISOR",
      en: {
        shortTitle: "xEMU Visor HUD",
        kicker: "07 // PHASE 2 — FIRST-PERSON xEMU VISOR AR & PLSS",
        title: "Immersive 1.8 m Helmet Dive & Biometric Situational HUD",
        subtitle: "Zero clutter on the visor center — orbital terrain transforms smoothly into an astronaut eye-level AR display.",
        badgePill: "1.8 m EYE-HEIGHT AR",
        hudTitle: "LIVE VISOR TELEMETRY ARCHITECTURE",
        hudAnnotations: [
          "360° Dynamic Compass Tape",
          "220 m Spectral Targeting Reticle",
          "Live Canvas ECG (70–176 BPM)",
          "Dual 20 m 8-Sector Hazard Radar"
        ],
        kpis: [
          { label: "METABOLIC LOAD", val: "175–960 W", note: "Slopes & sand dynamically drive heat load" },
          { label: "LCVG COOLANT", val: "18.0–27.8 °C", note: "Liquid Cooling & Ventilation Garment temp" },
          { label: "O₂ BURN RATE", val: "0.75–3.25 L/m", note: "Draws down 580 L PLSS high-pressure tank" },
          { label: "20 m RADAR", val: "8 Sectors (45°)", note: "Inner 10 m & outer 20 m cliff/sand alerts" }
        ],
        lightingTitle: "Three Mars Solar & LIDAR Illumination Modes",
        lightingDesc: "Instant switching between crisp Day sunlit canyon, low-angle Martian amber Sunset, and high-contrast Night / LIDAR wireframe mode powered by a suit helmet SpotLight.",
        notes: [
          "When 'Start EVA' is pressed, the camera dives from orbit straight into the 1.8 m helmet visor with full mouse/drag 360° look.",
          "Point out the real-time Canvas ECG trace, LCVG water temperature, and the dual 10 m / 20 m 8-sector tactical radar pointing toward Olympus-1 Base and nearest shelter."
        ]
      },
      ja: {
        shortTitle: "宇宙服AR HUD",
        kicker: "07 // PHASE 2 — xEMU宇宙服バイザーAR ＆ PLSS生命維持",
        title: "地上1.8 m 一人称ヘルメット視点への没入と生体監視HUD",
        subtitle: "軌道計画からシームレスに地上視点へ降下。視界を妨げない周辺レイアウトで生体・航法・危険レーダーをリアルタイム表示。",
        badgePill: "1.8 m 宇宙服視点",
        hudTitle: "バイザーAR 統合テレメトリ構成",
        hudAnnotations: [
          "360° 追従方位コンパス",
          "220 m 分光スキャン照準レティクル",
          "Canvas合成リアルタイム心電図",
          "20 m 8方位(45°刻み)危険レーダー"
        ],
        kpis: [
          { label: "代謝負荷", val: "175–960 W", note: "勾配・砂抵抗に応じ消費エネルギーが変動" },
          { label: "LCVG 冷却水温", val: "18.0–27.8 °C", note: "液体冷却下着(LCVG)の熱バランス監視" },
          { label: "O₂ 消費流量", val: "0.75–3.25 L/m", note: "総量 580 L タンクからの精密消費計算" },
          { label: "近接20mレーダー", val: "8セクター (45°)", note: "半径10m・20mの崖/砂地と基地方向を表示" }
        ],
        lightingTitle: "3種類の火星太陽光 ＆ 夜間LIDARモード",
        lightingDesc: "「昼（Day）」「夕暮れ（Sunset）」「夜 / LIDAR（Night）」をワンクリック切替。夜間は宇宙服スポットライトと地形ワイヤーフレームで暗闇でも安全歩行。",
        notes: [
          "「EVA開始」を押すと、カメラが軌道から高さ1.8 mのヘルメット内部へ一気に降下し、360度自由に見回せます。",
          "リアルタイム合成されるECG心電図波形、冷却水温、そして基地・シェルター方位も示す8セクター20mレーダーが特徴です。"
        ]
      }
    },

    {
      id: "drone",
      layout: "drone",
      timing: "3:45 – 4:15",
      badge: "SCOUT WINGMAN",
      en: {
        shortTitle: "Ingenuity Drone",
        kicker: "08 // AUTONOMOUS WINGMAN — INGENUITY SCOUT DRONE",
        title: "Forward Airborne LIDAR Recon & UHF Canyon Relay",
        subtitle: "Modeled after NASA Ingenuity, an autonomous coaxial scout flies 18 m ahead of the astronaut throughout the EVA.",
        badgePill: "+14 dB LINK BOOST",
        droneSpecs: [
          { tag: "FORWARD VECTOR", val: "18 m Ahead", desc: "Leads along the smoothed spline with realistic fuselage tilt" },
          { tag: "ROTOR DYNAMICS", val: "Dual Coaxial", desc: "Counter-rotating blades sweeping a downward volumetric LIDAR scan cone" },
          { tag: "ORBITABLE CAMERA", val: "360° + Zoom", desc: "Dedicated 3rd-person Drone View lets the crew inspect ridges around the astronaut" },
          { tag: "RF RELAY BRIDGE", val: "+14 dB / +15%", desc: "Elevates signal geometry above canyon walls to eliminate UHF communication dead zones" }
        ],
        notes: [
          "Explain how the Ingenuity drone solves two critical Mars problems simultaneously: forward tactical recon 18 m ahead and radio relay elevation above deep crater walls.",
          "Mention that users can switch directly to 'Drone View' and freely rotate 360° or zoom with the scroll wheel to verify terrain clearance."
        ]
      },
      ja: {
        shortTitle: "偵察ドローン",
        kicker: "08 // 自律随伴ウィングマン — 偵察ドローン INGENUITY",
        title: "18 m前方LIDAR地形走査 ＆ 峡谷UHF通信中継",
        subtitle: "NASA Ingenuityをベースに、宇宙飛行士の前方18 mを自律飛行する二重反転ローター式スカウト機を3D空間に統合。",
        badgePill: "+14 dB 電波増幅",
        droneSpecs: [
          { tag: "先行追従距離", val: "前方 18 m", desc: "飛行姿勢の傾きを伴いながら進行ルートの先を滑らかに誘導" },
          { tag: "ローター＆走査", val: "二重反転ローター", desc: "真下へLIDARレーザー走査コーンを照射し局所起伏を監視" },
          { tag: "独立オービットカメラ", val: "360°回転・ズーム", desc: "「ドローン視点」切替で宇宙飛行士周辺の地形を俯瞰確認可能" },
          { tag: "UHF電波リレー", val: "+14 dB / +15%向上", desc: "クレーター陰での電波遮断時に上空から基地局との通信を中継" }
        ],
        notes: [
          "Ingenuityドローンは見た目だけの演出ではなく、前方18 mの先行偵察と峡谷陰での+14 dB通信リレーという2つの実用的役割を担います。",
          "ユーザーからのフィードバックを反映し、ドローンカメラ視点ではマウスドラッグでの360度自由回転とホイールズームに対応しています。"
        ]
      }
    },

    {
      id: "science",
      layout: "science",
      timing: "4:15 – 4:45",
      badge: "ASTROBIOLOGY",
      en: {
        shortTitle: "CRISM Science",
        kicker: "09 // IN-SITU ASTROBIOLOGY — CRISM / PIXL SPECTROMETER",
        title: "220 m Raycast Target Lock Across 8 Jezero Outcrops",
        subtitle: "Turn your helmet reticle toward Martian boulders (or click Auto-Aim) to inspect chemical oxides and IR spectra.",
        badgePill: "8 ANALOG TARGETS",
        tableHeading: "CATALOGED JEZERO OUTCROPS (BIOSIGNATURE INDEX)",
        lockLabel: "SPECIMEN TELEMETRY // TARGET LOCKED",
        lockTitle: "Cheyava Falls — Bio-Signature 96%",
        lockDesc: "220 m THREE.Raycaster intersection triggers green wireframe lock, scanner beam, 7-oxide breakdown, and 0.8–2.6 µm NIR curve.",
        outcrops: [
          { name: "Cheyava Falls", mineral: "Leopard-spot Mudstone + FePO₄", score: "96%" },
          { name: "Bright Angel", mineral: "Neretva Phyllosilicate Clay", score: "93%" },
          { name: "Lefroy Bay", mineral: "Hydrated Opaline Silica (SiO₂)", score: "91%" },
          { name: "Wildcat Ridge", mineral: "Organic-Bearing Sulfate Mudstone", score: "88%" },
          { name: "Otis Peak", mineral: "Mg-Fe Carbonate Matrix", score: "84%" },
          { name: "Castell Henllys", mineral: "Hydrated Mg-Sulfate + Clays", score: "82%" },
          { name: "Kodiak Base", mineral: "Gilbert-Delta Cross-Bedded Basalt", score: "79%" },
          { name: "Skinner Ridge", mineral: "Layered Sandstone / Olivine", score: "76%" }
        ],
        notes: [
          "Science payoff: Mars EVAs exist to discover biosignatures. Simply aim your visor reticle within 220 m of any boulder (or hit 'Scan Nearest') to fire the CRISM/PIXL beam.",
          "Show the 8 authentic Jezero outcrops—from Cheyava Falls at 96% to Skinner Ridge at 76%—complete with 7 geochemical oxide percentages and an IR absorption curve (0.8–2.6 µm)."
        ]
      },
      ja: {
        shortTitle: "CRISM 分光分析",
        kicker: "09 // 現地宇宙生物学 — CRISM / PIXL 分光スキャナ",
        title: "最大220 mレイキャスト照準による8箇所のジェゼロ露頭岩体解析",
        subtitle: "バイザー中央の照準を岩に向けるか「最寄りスキャン」を押すと、レーザー照射と共に酸化物組成と近赤外スペクトルを取得。",
        badgePill: "8種の実在モデル露頭",
        tableHeading: "解析対象ジェゼロ露頭カタログ（生命痕跡スコア）",
        lockLabel: "ターゲット捕捉 // 分光テレメトリ",
        lockTitle: "Cheyava Falls — 生命痕跡有望度 96%",
        lockDesc: "220 m以内の岩体をTHREE.Raycasterでロックし、緑色の解析ビーム照射・7成分酸化物グラフ・0.8–2.6 µm反射スペクトルを表示。",
        outcrops: [
          { name: "Cheyava Falls", mineral: "斑点状泥岩 + リン酸鉄 (FePO₄)", score: "96%" },
          { name: "Bright Angel", mineral: "ネレトヴァ 層状珪酸塩粘土", score: "93%" },
          { name: "Lefroy Bay", mineral: "含水オパール質シリカ (SiO₂)", score: "91%" },
          { name: "Wildcat Ridge", mineral: "有機物含有 硫酸塩泥岩", score: "88%" },
          { name: "Otis Peak", mineral: "Mg-Fe 炭酸塩マトリックス", score: "84%" },
          { name: "Castell Henllys", mineral: "含水Mg硫酸塩 ＋ 粘土", score: "82%" },
          { name: "Kodiak Base", mineral: "ギルバートデルタ斜交葉理玄武岩", score: "79%" },
          { name: "Skinner Ridge", mineral: "層状砂岩 / かんらん石", score: "76%" }
        ],
        notes: [
          "EVAの最終目的は生命痕跡の手がかりとなる岩石の発見です。バイザー照準を220 m以内の岩に向けると、3Dグリーンレーザーとワイヤーフレーム捕捉が作動します。",
          "実際のPerseverance探査地点（Cheyava Falls 96%やBright Angel 93%など全8種）の7大酸化物比率と0.8–2.6 µm近赤外吸収曲線を確認できます。"
        ]
      }
    },

    {
      id: "ai",
      layout: "ai",
      timing: "4:45 – 5:25",
      badge: "AI SURVIVAL",
      en: {
        shortTitle: "ARIA-9 & Crises",
        kicker: "10 // PROACTIVE SURVIVAL AI — ARIA-9 COPILOT & ANOMALIES",
        title: "Real-Time Hazard Lookahead & 4 Autonomous Crisis Protocols",
        subtitle: "ARIA-9 runs silently via a non-intrusive visual Mini-Dock + neural waveform (voice disabled cleanly) with interactive Q&A.",
        badgePill: "4 LIVE ANOMALY ENGINES",
        bannerLeftTitle: "ARIA-9 Autonomous Copilot Intelligence",
        bannerLeftDesc: "Continuously scans 180 m ahead along the traverse for THEMIS sand traps, >16° slopes, and UHF signal drops—issuing concise visor alerts automatically.",
        bannerRightTitle: "Interactive Mission Assistant",
        bannerRightDesc: "Answers tactical crew questions across 7 domains (Oxygen, Slope, Sand, Comms, Cooling, Drone, Science) or returns an instant full suit + terrain status report.",
        anomalies: [
          {
            code: "[01] ROCKFALL EVENT",
            critical: false,
            title: "Basalt Debris Blocking Trail",
            telemetry: "Spawns physical 3D boulders directly across active path",
            action: "AI Response: Auto-inserts a 42 m lateral bypass waypoint & runs immediate SEXTANT A* replan."
          },
          {
            code: "[02] SUIT LCVG & O₂ LEAK",
            critical: true,
            title: "Micro-Puncture & Thermal Spike",
            telemetry: "LCVG spikes to 26.4 °C · HR 162 BPM · O₂ bleed 2.38 L/min",
            action: "AI Response: Seals primary loop, triggers purge & switches suit to Backup Cooling Loop B."
          },
          {
            code: "[03] 65 m DUST DEVIL",
            critical: false,
            title: "Whirling Vortex & RF Fade",
            telemetry: "65 m particle funnel engulfs sector · UHF drops -28 dB",
            action: "AI Response: Boosts Ingenuity +14 dB airborne relay & illuminates helmet LIDAR spotlight."
          },
          {
            code: "[04] SPE X9.4 SOLAR STORM",
            critical: true,
            title: "Lethal Solar Particle Surge",
            telemetry: "Crimson radiation fog · Fastest-time A* shelter egress",
            action: "Egress Targets: Hephaestus Lava Tube (99.4%), Aurora Bunker (96.8%), Kodiak-South (92.0%), Olympus-1 (99.8%)."
          }
        ],
        notes: [
          "ARIA-9 is the heart of crew survivability: notice the compact Mini-Dock with live neural oscilloscope waves and zero annoying audio clutter.",
          "Describe all 4 playable emergency buttons: [01] Rockfall 42m detour, [02] LCVG leak (26.4 °C / 162 BPM / Loop B), [03] 65 m Dust Devil (-28 dB -> Drone Relay + LIDAR), and [04] SPE X9.4 Storm routing to 4 real hardened shelters."
        ]
      },
      ja: {
        shortTitle: "AI ARIA-9 ＆ 緊急対応",
        kicker: "10 // 自律生存AI — ARIA-9 副操縦士 ＆ 4大異常事態プロトコル",
        title: "進行方向180 mの先読み監視と4つの自動危機回避プロトコル",
        subtitle: "不要な音声読み上げを排し、波形オシロスコープ付きのスマートMini-Dockと7分野対話チャットで冷静・正確に飛行士を支援。",
        badgePill: "4種の緊急事態エンジン",
        bannerLeftTitle: "ARIA-9 先読み自律監視",
        bannerLeftDesc: "移動ルート前方180 m以内の軟弱砂地・16°超傾斜・UHF電波低下を常に先行スキャンし、到着前にコンパクトな警告カードを発出。",
        bannerRightTitle: "対話型戦術AIチャット",
        bannerRightDesc: "酸素・傾斜・砂地・通信・冷却・ドローン・科学の7トピック、および総合ステータス照会に対して現在の実数値を踏まえて即答。",
        anomalies: [
          {
            code: "[01] 落石・岩盤崩落",
            critical: false,
            title: "進行ルート上への3D玄武岩崩落",
            telemetry: "進行線上の真正面に物理的3D落石ブロックが出現",
            action: "AI自動対処: 42 m横方向への迂回ポイントを自動挿入し、A*経路を即座に再計算。"
          },
          {
            code: "[02] LCVG冷却異常 & 酸素漏れ",
            critical: true,
            title: "微細損傷による熱上昇・リーク",
            telemetry: "LCVG 26.4 °C · 心拍 162 BPM · O₂消費 2.38 L/min",
            action: "AI自動対処: 損傷系を緊急遮断パージし、予備冷却ループBへの切替・安静指示を実行。"
          },
          {
            code: "[03] 65 m ダストデビル旋風",
            critical: false,
            title: "巨大塵旋風と電波急減衰",
            telemetry: "高さ65 mの3D砂嵐渦が発生 · UHF信号 -28 dB 低下",
            action: "AI自動対処: ドローンの+14 dB通信リレーを最大化＋ヘルメットLIDAR照射を自動点灯。"
          },
          {
            code: "[04] SPE X9.4 太陽陽子嵐",
            critical: true,
            title: "致死性放射線ストーム緊急退避",
            telemetry: "深紅の放射線霧発生 · 最短時間A*緊急脱出モード起動",
            action: "4大退避拠点: ヘファイストス溶岩洞 (99.4%) / オーロラ地下壕 (96.8%) / コディアック南 (92.0%) / 基地 (99.8%)"
          }
        ],
        notes: [
          "ARIA-9は発話音声をオフにし、視覚的に洗練されたMini-Dockと対話ウィンドウで宇宙飛行士の集中力を守ります。",
          "プレゼン実演では上部の緊急シミュレーションボタンを押すだけで、42m落石回避やダストデビル中のドローン通信復旧、SPE嵐時の溶岩洞避難をライブで見せられます。"
        ]
      }
    },

    {
      id: "roadmap",
      layout: "roadmap",
      timing: "5:25 – 6:00",
      badge: "IMPACT & FUTURE",
      en: {
        shortTitle: "Impact & Roadmap",
        kicker: "11 // TECH READINESS, MULTILINGUAL CREWS & FUTURE HORIZON",
        title: "Mission-Ready Engineering Built for International Space Crews",
        subtitle: "Lightweight, offline-capable architecture designed to scale from Space Apps prototype to real EVA training hardware.",
        badgePill: "RU / EN / 日本語 LIVE",
        stackCards: [
          { label: "BACKEND", val: "Python / FastAPI", note: "NumPy terrain & PLSS thermodynamic kernel" },
          { label: "3D ENGINE", val: "Three.js WebGL", note: "60 FPS Neon Waves, zero heavyweight frameworks" },
          { label: "CREW I18N", val: "RU · EN · 日本語", note: "201 localized telemetry & AI strings in app" },
          { label: "ZERO BLOAT", val: "4 Clean Endpoints", note: "Fast startup & clean SVG aerospace HUD icons" }
        ],
        horizons: [
          {
            phase: "NOW // CHALLENGE #11",
            title: "Full Digital Twin Simulator",
            desc: "Orbital 5-layer planning, Direct vs A* analytics, xEMU AR HUD, Ingenuity drone relay, 8 CRISM rocks, and ARIA-9 crisis engine."
          },
          {
            phase: "NEXT // ARTEMIS & HMD",
            title: "WebXR Optical Visor Projection",
            desc: "Stream live telemetry directly into mixed-reality EVA training headsets and analog desert field suits (MDR / analog habitats)."
          },
          {
            phase: "HORIZON // FLIGHT OPS",
            title: "Real MRO GeoTIFF & JAXA/NASA Sync",
            desc: "Ingest full HiRISE / CTX GeoTIFF elevation tiles plus live suit CAN-bus / ROS2 sensor feeds for Artemis Moon-to-Mars crews."
          }
        ],
        ctaTitle: "Ready for Live Demonstration in Jezero Crater",
        ctaSub: "Open the running mission console or toggle EN / 日本語 anywhere across the simulator and this deck.",
        ctaButton: "LAUNCH LIVE SIMULATOR →",
        notes: [
          "Summarize the project strength: zero bloated dependencies, complete RU/EN/Japanese localization across both the simulator and this presentation, and scientifically grounded physics.",
          "Close strong on the 6:00 mark: NASA SEXTANT 3D & xEMU AR HUD turns raw orbital maps into real-time survival intelligence for Moon-to-Mars explorers. Thank you—questions?"
        ]
      },
      ja: {
        shortTitle: "技術基盤と展望",
        kicker: "11 // 技術成熟度・多言語クルー対応・今後のロードマップ",
        title: "国際宇宙クルーを支える拡張性とミッション即応設計",
        subtitle: "軽量な技術スタックと日英露3言語対応により、ハッカソン試作から実機トレーニング・次世代宇宙探査へ直結する構造。",
        badgePill: "日・英・露 3言語対応",
        stackCards: [
          { label: "バックエンド", val: "Python / FastAPI", note: "NumPy地形演算 ＆ PLSS生体力学コア" },
          { label: "3Dエンジン", val: "Three.js WebGL", note: "軽量バニラJS＋60 FPS ネオン火星空間" },
          { label: "多言語対応", val: "日本語 · EN · RU", note: "本体UI 201項目・AI応答すべてを即時切替" },
          { label: "設計美学", val: "4 REST API", note: "専用SVG航空宇宙アイコン＆低遅延応答" }
        ],
        horizons: [
          {
            phase: "NOW // ハッカソン完成域",
            title: "完全統合型 EVAデジタルツイン",
            desc: "5層軌道計画・直線vsA*比較・宇宙服AR HUD・Ingenuity中継・8露頭分光・ARIA-9緊急自動対応まで実装完了。"
          },
          {
            phase: "NEXT // 訓練実機連携",
            title: "WebXR MRゴーグル＆地上模擬実験",
            desc: "砂漠アナログ基地やMRヘッドセットへHUDをそのまま投影し、宇宙飛行士の訓練用シミュレータとして実地検証。"
          },
          {
            phase: "HORIZON // 月・火星本番探査",
            title: "実GeoTIFF標高データ ＆ Artemis/MMX接続",
            desc: "実測MRO HiRISE GeoTIFFの自動取込と宇宙服センサバス（ROS2等）連携により実運用のEVA安全支援基盤へ進化。"
          }
        ],
        ctaTitle: "ジェゼロ・クレーター リアルタイムデモ待機中",
        ctaSub: "シミュレーション本体（EN / 日本語 / RU切替可）にて、A*経路探索・ドローン追跡・緊急嵐シミュレーションをご体験いただけます。",
        ctaButton: "実機シミュレータを開く →",
        notes: [
          "クロージング（残り35秒）：軽量なPython+Three.js構成で実現した高い応答性、そしてNASA/JAXA国際クルーを見据えた英語・日本語・ロシア語完全対応を強調します。",
          "結び：軌道データと人間の判断、そしてAIをひとつに結ぶNASA SEXTANT 3D & xEMU AR HUDで、より安全な月・火星探査を実現します。ご清聴ありがとうございました。"
        ]
      }
    }
  ]
};
