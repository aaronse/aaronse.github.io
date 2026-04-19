// maker-galaxy.js
//
// Maker Galaxy landing hero (non-React).
// - Three.js galaxy with Milky-Way-ish spiral arms
// - Twinkling disc stars
// - Aurora ribbons
// - Hoverable hero stars
// - Dev panel (Ctrl+.) with live sliders for camera & galaxy params

(function () {
  if (typeof THREE === "undefined") {
    console.error(
      "[MakerGalaxy] THREE is not defined. Make sure three.min.js is loaded before maker-galaxy.js."
    );
    return;
  }

  // ---- Configurable text ---------------------------------------------------

  const HERO_TITLE = "Maker Galaxy";
  const HERO_TAGLINE = "Where makers, tools, and ideas orbit together.";

  // ---- DOM references ------------------------------------------------------

  const heroSection = document.getElementById("mg-hero");
  const canvas = document.getElementById("mg-galaxy-canvas");
  const titleEl = document.getElementById("mg-title");
  const taglineEl = document.getElementById("mg-tagline");

  if (!heroSection || !canvas) {
    console.warn("[MakerGalaxy] Missing hero section or canvas.");
    return;
  }

  if (titleEl) titleEl.textContent = HERO_TITLE;
  if (taglineEl) taglineEl.textContent = HERO_TAGLINE;

  // ---- Scene setup ---------------------------------------------------------

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  const initialPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(initialPixelRatio);
  renderer.setClearColor(0x000000, 0);

  function getCssNumber(varName, fallback) {
    const styles = getComputedStyle(document.documentElement);
    const val = styles.getPropertyValue(varName).trim();
    const num = parseFloat(val);
    return Number.isFinite(num) ? num : fallback;
  }

  function getCssLength(varName, fallback) {
    if (!document.body) {
      return fallback;
    }

    const probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style.width = `var(${varName})`;
    document.body.appendChild(probe);
    const resolvedWidth = probe.getBoundingClientRect().width;
    probe.remove();
    return Number.isFinite(resolvedWidth) && resolvedWidth > 0
      ? resolvedWidth
      : fallback;
  }

  // These are "let" so the dev panel can tweak them
  let galaxyRotationSpeedBase = getCssNumber(
    "--mg-galaxy-rotation-speed",
    0.05
  );
  const auroraSpeedBase = getCssNumber("--mg-aurora-speed", 0.7);
  const starfieldDensityMul = getCssNumber("--mg-starfield-density", 1);
  const hoverScaleTarget = getCssNumber("--mg-hover-scale", 1.65);

  // Galaxy structure config (tweakable via dev panel)
  const galaxyConfig = {
    radiusOuter: 260,
    starCountBase: 3200,
    armCount: 4,
    spiralTightness: 0.3,    // how tightly the arms curl
    spiralStartRadius: 40,    // where arms visibly start from center
    thetaMax: 9.0,            // angular length of arms
    scatterRadius: 25,
    thicknessCore: 30,
    coreFraction: 0.16,       // fraction of stars in central bulge
    densityScale: 1.0,
    twinkleSpeed: 0.75,
  };

  // Aurora configuration (global)
  const auroraConfig = {
    opacityScale: 0.3,        // <1.0 to dial default opacity down
    amplitudeScale: 1.0,      // 1.0 = as authored, >1 = wavier
  };

  // Camera & target (tweakable)
  let cameraLookTargetY = 15;

  const camera = new THREE.PerspectiveCamera(
    60,
    heroSection.clientWidth / heroSection.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, -120, 340);
  camera.lookAt(0, cameraLookTargetY, 0);

  function resizeRendererToDisplaySize() {
    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;
    const needResize =
      canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    return needResize;
  }

  resizeRendererToDisplaySize();

  // ---- Lights --------------------------------------------------------------

  const hemiLight = new THREE.HemisphereLight(0x8899ff, 0x080310, 0.4);
  scene.add(hemiLight);

  const pointLight = new THREE.PointLight(0xffffff, 2.0, 700);
  pointLight.position.set(0, 80, 160);
  scene.add(pointLight);

  // ---- Background starfield -----------------------------------------------

  function createBackgroundStarfield() {
    const starCount = Math.floor(1100 * starfieldDensityMul);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const color = new THREE.Color();

    for (let i = 0; i < starCount; i++) {
      const radius = 900;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * (0.83 + Math.random() * 0.17);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const bucket = Math.random();
      if (bucket < 0.5) {
        // violet / purple
        color.setHSL(0.76 + Math.random() * 0.06, 0.65, 0.65);
      } else if (bucket < 0.8) {
        // blue / cyan
        color.setHSL(0.6 + Math.random() * 0.06, 0.6, 0.7);
      } else if (bucket < 0.96) {
        // pink / magenta
        color.setHSL(0.88 + Math.random() * 0.04, 0.7, 0.72);
      } else {
        // rare warm star
        color.setRGB(
          1.0,
          0.93 + Math.random() * 0.05,
          0.78 + Math.random() * 0.1
        );
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 1.3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return points;
  }

  const backgroundStars = createBackgroundStarfield();

  // ---- Galaxy disc (twinkling shader points) ------------------------------

  let galaxyDisc = null;
  let galaxyUniforms = null;

  const heroStars = [];
  const heroStarMeshes = [];
  const heroStarTooltip = createTooltipElement();
  let hoveredHeroStar = null;

  function createGalaxyDisc() {
    const radiusOuter = galaxyConfig.radiusOuter;
    const baseCount = galaxyConfig.starCountBase;
    const starCount = Math.floor(
      baseCount * starfieldDensityMul * galaxyConfig.densityScale
    );

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const phases = new Float32Array(starCount);

    const color = new THREE.Color();
    const armCount = Math.max(1, Math.round(galaxyConfig.armCount));
    const b = galaxyConfig.spiralTightness;
    const scatterRadius = galaxyConfig.scatterRadius;
    const thicknessCore = galaxyConfig.thicknessCore;
    const spiralStart = galaxyConfig.spiralStartRadius;
    const thetaMax = galaxyConfig.thetaMax;
    const coreFraction = galaxyConfig.coreFraction;

    // Precompute normalization for log spiral
    const eMax = Math.exp(b * thetaMax) - 1.0;
    const minRadius = spiralStart;
    const maxRadius = radiusOuter;

    for (let i = 0; i < starCount; i++) {
      let x, y, z, r, t;

      if (Math.random() < coreFraction) {
        // --- Central bulge star ---------------------------------------------
        // Strongly biased toward the very center
        const u = Math.random();
        const rCore =
          Math.pow(u, 2.0) * (spiralStart * 1.1); // most near 0
        const angleCore = Math.random() * Math.PI * 2;

        x = rCore * Math.cos(angleCore);
        z = rCore * Math.sin(angleCore);

        const thickness = thicknessCore * 0.9;
        y = THREE.MathUtils.randFloatSpread(thickness);
        r = rCore;
      } else {
        // --- Spiral arm star -----------------------------------------------
        const armIndex = Math.floor(Math.random() * armCount);
        const armOffset = (armIndex / armCount) * Math.PI * 2;

        // θ along the arm from 0 .. thetaMax
        const u = Math.random();           // 0..1
        const thetaBase = u * thetaMax;
        let theta = -(thetaBase + armOffset);

        // Normalized log spiral 0 → 1
        const e = Math.exp(b * thetaBase) - 1.0;
        const spiralNorm = eMax > 0 ? e / eMax : 0.0;

        // Radius from spiralStart .. radiusOuter
        const rSpiral = minRadius + (maxRadius - minRadius) * spiralNorm;

        r = rSpiral + THREE.MathUtils.randFloatSpread(scatterRadius);
        theta += THREE.MathUtils.randFloatSpread(0.12);

        x = r * Math.cos(theta);
        z = r * Math.sin(theta);
      }

      // Thickness: thicker near core, thinner outward
      t = Math.min(1, r / radiusOuter);
      const coreBias = Math.exp(-r * 0.006);
      const thickness =
        thicknessCore * coreBias + 6 + t * 10;
      y = (y !== undefined)
        ? y
        : THREE.MathUtils.randFloatSpread(thickness);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color palette: purple / pink / blue with slight radial variation
      const bucket = Math.random();
      if (bucket < 0.45) {
        color.setHSL(0.76 + Math.random() * 0.05, 0.7, 0.65);
      } else if (bucket < 0.8) {
        color.setHSL(0.6 + Math.random() * 0.06, 0.65, 0.7);
      } else if (bucket < 0.95) {
        color.setHSL(0.88 + Math.random() * 0.04, 0.75, 0.75);
      } else {
        color.setRGB(
          1.0,
          0.94 + Math.random() * 0.05,
          0.8 + Math.random() * 0.15
        );
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Star size (bigger toward core)
      let baseSize;
      const sizeBucket = Math.random();
      if (sizeBucket < 0.65) {
        baseSize = 2.0 + Math.random() * 2.0;
      } else if (sizeBucket < 0.9) {
        baseSize = 4.5 + Math.random() * 3.0;
      } else {
        baseSize = 7.0 + Math.random() * 6.0;
      }
      baseSize *= 1.0 + (1.0 - t) * 0.6;

      sizes[i] = baseSize;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(sizes, 1)
    );
    geometry.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(phases, 1)
    );

    galaxyUniforms = {
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: galaxyUniforms,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        varying vec3 vColor;
        varying float vAlphaFactor;
        uniform float uTime;

        void main() {
          vColor = color;

          float twinkle = 0.35 + 0.65 * abs(sin(uTime + aPhase));
          vAlphaFactor = twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float size = aSize * twinkle * (300.0 / -mvPosition.z);

          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlphaFactor;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          float alpha = smoothstep(0.6, 0.0, dist) * vAlphaFactor;
          if (alpha < 0.01) discard;

          vec3 col = vColor * (0.6 + 0.8 * vAlphaFactor);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    galaxyDisc = new THREE.Points(geometry, material);
    galaxyDisc.rotation.x = THREE.MathUtils.degToRad(70);
    scene.add(galaxyDisc);
  }

  function disposeGalaxyDisc() {
    if (!galaxyDisc) return;
    if (galaxyDisc.geometry) galaxyDisc.geometry.dispose();
    if (galaxyDisc.material) galaxyDisc.material.dispose();
    scene.remove(galaxyDisc);
    galaxyDisc = null;
    galaxyUniforms = null;
  }

  function rebuildGalaxyDisc() {
    disposeGalaxyDisc();
    heroStars.length = 0;
    heroStarMeshes.length = 0;
    createGalaxyDisc();
    createHeroStars(); // repopulate hero stars on the new disc
  }

  createGalaxyDisc();

  // ---- Hero star meshes (hoverable) ----------------------------------------

  function createTooltipElement() {
    const el = document.createElement("div");
    el.className = "mg-star-tooltip";
    el.style.display = "none";
    el.textContent = "";
    document.body.appendChild(el);
    return el;
  }

  function createHeroStars(count = 18) {
    if (!galaxyDisc) return;

    const geometry = new THREE.SphereGeometry(2.5, 12, 12);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xfff4d0),
      emissive: new THREE.Color(0xfff0b0),
      emissiveIntensity: 1.6,
      roughness: 0.25,
      metalness: 0.25,
    });

    const radiusInner = 70;
    const radiusOuter = galaxyConfig.radiusOuter;
    const heightVariance = 16;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const rBias = Math.pow(u, 2.0);
      const r =
        radiusInner +
        rBias * (radiusOuter - radiusInner);
      const angle =
        Math.random() * Math.PI * 2 + (r / radiusOuter) * 4.0;
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      const y = (Math.random() - 0.5) * heightVariance;

      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(x, y, z);
      const baseScale = 0.9 + Math.random() * 0.4;
      mesh.scale.setScalar(baseScale);
      mesh.userData = {
        label:
          u < 0.3
            ? "Core Maker Hub"
            : u < 0.6
            ? "Tool Orbit"
            : "Project Node",
        baseScale,
        hoverScale: hoverScaleTarget,
      };

      heroStars.push(mesh);
      heroStarMeshes.push(mesh);
      galaxyDisc.add(mesh);
    }
  }

  createHeroStars();

  // ---- Aurora ribbons ------------------------------------------------------

  const auroraUniforms = [];
  const auroraMeshes = [];
  const auroraBaseOpacity = [];
  const auroraBaseAmplitude = [];

  function createAuroraRibbon(
    radius,
    height,
    tiltDeg,
    color1Hex,
    color2Hex,
    baseOpacity,
    speedMul,
    amplitudeBase
  ) {
    const width = radius * 2.2;
    const geom = new THREE.PlaneGeometry(width, height, 80, 24);

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: auroraSpeedBase * speedMul },
      uAmplitude: { value: amplitudeBase },
      uBaseOpacity: {
        value: baseOpacity * auroraConfig.opacityScale,
      },
      uColor1: { value: new THREE.Color(color1Hex) },
      uColor2: { value: new THREE.Color(color2Hex) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime;
        uniform float uAmplitude;
        uniform float uSpeed;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 transformed = position;

          float wave1 = sin(transformed.x * 0.018 + uTime * uSpeed) * uAmplitude;
          float wave2 = cos(transformed.x * 0.032 - uTime * uSpeed * 0.7) * (uAmplitude * 0.6);
          float combined = mix(wave1, wave2, 0.5);

          transformed.z += combined * uv.y;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uBaseOpacity;
        varying vec2 vUv;

        void main() {
          float band = smoothstep(0.08, 0.4, vUv.y) * (1.0 - smoothstep(0.6, 0.92, vUv.y));
          float xCenter = 0.5;
          float xFalloff = smoothstep(0.0, 0.4, 1.0 - abs(vUv.x - xCenter) * 2.0);
          float intensity = band * xFalloff;

          vec3 color = mix(uColor1, uColor2, vUv.x);
          float alpha = intensity * uBaseOpacity;
          if (alpha < 0.01) discard;

          gl_FragColor = vec4(color * (0.4 + intensity * 1.2), alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(geom, material);

    mesh.position.set(0, 40, 0);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(tiltDeg),
      0,
      0
    );
    mesh.rotateY(THREE.MathUtils.degToRad(Math.random() * 360));

    scene.add(mesh);

    auroraUniforms.push(uniforms);
    auroraMeshes.push(mesh);
    auroraBaseOpacity.push(baseOpacity);
    auroraBaseAmplitude.push(amplitudeBase);
  }

  createAuroraRibbon(
    260,
    220,
    60,
    0xb36bff,
    0x35e0ff,
    0.55,
    1.0,
    36.0
  );
  createAuroraRibbon(
    300,
    260,
    50,
    0x4b1a7f,
    0x35e0ff,
    0.4,
    0.65,
    36.0
  );
  createAuroraRibbon(
    320,
    280,
    72,
    0xffc857,
    0xd68bff,
    0.32,
    1.3,
    36.0
  );

  // ---- Interaction: raycasting for hero stars ------------------------------

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-10, -10);
  let isPointerOverHero = false;

  function updateMouseFromEvent(event) {
    const rect = heroSection.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;
  }

  heroSection.addEventListener("pointerenter", () => {
    isPointerOverHero = true;
  });

  heroSection.addEventListener("pointerleave", () => {
    isPointerOverHero = false;
    mouse.set(-10, -10);
    clearHeroStarHover();
  });

  heroSection.addEventListener("pointermove", (event) => {
    updateMouseFromEvent(event);
  });

  function clearHeroStarHover() {
    if (hoveredHeroStar) {
      const m = hoveredHeroStar;
      const data = m.userData;
      m.scale.setScalar(data.baseScale);
      m.material.emissiveIntensity = 1.6;
      hoveredHeroStar = null;
      heroStarTooltip.style.display = "none";
    }
  }

  function updateHeroStarHover() {
    if (!isPointerOverHero || !galaxyDisc) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(heroStarMeshes, true);

    if (!intersects.length) {
      clearHeroStarHover();
      return;
    }

    const nearest = intersects[0].object;
    if (nearest === hoveredHeroStar) {
      positionTooltip(nearest);
      return;
    }

    clearHeroStarHover();
    hoveredHeroStar = nearest;

    const data = hoveredHeroStar.userData || {};
    const baseScale = data.baseScale || 1.0;
    const hoverScale = data.hoverScale || hoverScaleTarget;

    hoveredHeroStar.scale.setScalar(hoverScale);
    hoveredHeroStar.material.emissiveIntensity = 2.6;

    heroStarTooltip.textContent = data.label || "Maker Node";
    heroStarTooltip.style.display = "block";
    positionTooltip(hoveredHeroStar);
  }

  function positionTooltip(mesh) {
    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;

    const vector = mesh.position.clone();
    mesh.updateWorldMatrix(true, false);
    vector.applyMatrix4(mesh.matrixWorld);

    vector.project(camera);
    const rect = heroSection.getBoundingClientRect();
    const screenX = (vector.x * 0.5 + 0.5) * width + rect.left;
    const screenY = (-vector.y * 0.5 + 0.5) * height + rect.top;

    heroStarTooltip.style.left = `${screenX}px`;
    heroStarTooltip.style.top = `${screenY}px`;
  }

  // ---- Motion control: scroll + visibility ---------------------------------

  const clock = new THREE.Clock();
  let baseSpeed = 1.0;
  let targetSpeed = 1.0;
  let isPageVisible = true;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.target === heroSection) {
          const ratio = entry.intersectionRatio;
          targetSpeed = ratio > 0.4 ? 1.0 : 0.15;
        }
      }
    },
    {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    }
  );
  observer.observe(heroSection);

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    targetSpeed = isPageVisible ? 1.0 : 0.0;
  });

  // Simple perf probe (hook for future fallback modes)
  let frameTimeSamples = [];
  let lowQualityMode = false;

  function recordFrameTime(deltaMs) {
    frameTimeSamples.push(deltaMs);
    if (frameTimeSamples.length > 120) frameTimeSamples.shift();
    if (frameTimeSamples.length === 120 && !lowQualityMode) {
      const avg =
        frameTimeSamples.reduce((a, b) => a + b, 0) /
        frameTimeSamples.length;
      if (avg > 40) {
        lowQualityMode = true;
        console.warn(
          "[MakerGalaxy] Low-quality mode could be enabled here (avg frameTime ~",
          avg.toFixed(1),
          "ms)."
        );
        // Example knobs:
        // renderer.setPixelRatio(1);
        // auroraMeshes.forEach(m => (m.visible = false));
      }
    }
  }

  // ---- Dev panel (Ctrl+.) --------------------------------------------------

  const DEV_PANEL_CONFIG = {
    initialTop: getCssLength("--mg-dev-panel-top", 12),
    initialLeft: getCssLength("--mg-dev-panel-left", 12),
    initialWidth: getCssLength("--mg-dev-panel-width", 320),
    initialHeightFraction: getCssNumber("--mg-dev-panel-height-fraction", 0.72),
    initialHeightMax: getCssLength("--mg-dev-panel-height-max", 640),
    minWidth: getCssLength("--mg-dev-panel-min-width", 280),
    minHeight: getCssLength("--mg-dev-panel-min-height", 280),
    collapsedHeight: getCssLength("--mg-dev-panel-chrome-height", 42),
    openOnLoad: true,
    edgeResizeThreshold: getCssLength("--mg-dev-panel-edge-hit", 18),
    touchAffordanceVisibleMs: getCssNumber(
      "--mg-dev-panel-touch-affordance-ms",
      1400
    ),
    viewportMargin: getCssLength("--mg-dev-panel-viewport-margin", 8),
  };

  const DEV_PANEL_ACTIONS = {
    toggleCollapse: "toggle-collapse",
    resetLayout: "reset-layout",
    closePanel: "close-panel",
  };

  const DEV_PANEL_ICONS = {
    collapse: `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 10l4-4 4 4" />
      </svg>
    `,
    reset: `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M5 2.5H2.5V5" />
        <path d="M11 2.5h2.5V5" />
        <path d="M13.5 11v2.5H11" />
        <path d="M5 13.5H2.5V11" />
        <path d="M2.5 5.5V2.5h3" />
        <path d="M10.5 2.5h3v3" />
        <path d="M13.5 10.5v3h-3" />
        <path d="M5.5 13.5h-3v-3" />
      </svg>
    `,
    close: `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 4l8 8" />
        <path d="M12 4l-8 8" />
      </svg>
    `,
  };

  const DEV_PANEL_CURSOR_CLASSNAMES = [
    "resize-n",
    "resize-s",
    "resize-e",
    "resize-w",
    "resize-ne",
    "resize-nw",
    "resize-se",
    "resize-sw",
  ];

  const DEV_PANEL_EDGE_CURSORS = {
    n: "resize-n",
    s: "resize-s",
    e: "resize-e",
    w: "resize-w",
    ne: "resize-ne",
    nw: "resize-nw",
    se: "resize-se",
    sw: "resize-sw",
  };

  const DEV_PANEL_RESIZE_EDGES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  const initialPanelHeight = Math.min(
    Math.round(window.innerHeight * DEV_PANEL_CONFIG.initialHeightFraction),
    DEV_PANEL_CONFIG.initialHeightMax
  );

  const DEV_PANEL_CONTROL_GROUPS = [
    [
      {
        id: "mg-rot-speed",
        label: "Rotation Speed",
        min: 0,
        max: 0.6,
        step: 0.01,
        format: (value) => value.toFixed(2),
        getValue: () => galaxyRotationSpeedBase,
        onChange: (value) => {
          galaxyRotationSpeedBase = value;
        },
      },
      {
        id: "mg-cam-x",
        label: "Camera X",
        min: -400,
        max: 400,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => camera.position.x,
        onChange: (value) => {
          camera.position.x = value;
        },
      },
      {
        id: "mg-cam-y",
        label: "Camera Y",
        min: -400,
        max: 400,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => camera.position.y,
        onChange: (value) => {
          camera.position.y = value;
        },
      },
      {
        id: "mg-cam-z",
        label: "Camera Z",
        min: 150,
        max: 900,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => camera.position.z,
        onChange: (value) => {
          camera.position.z = value;
        },
      },
      {
        id: "mg-cam-target-y",
        label: "Camera Target Y",
        min: -100,
        max: 200,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => cameraLookTargetY,
        onChange: (value) => {
          cameraLookTargetY = value;
        },
      },
    ],
    [
      {
        id: "mg-arm-count",
        label: "Arms",
        min: 2,
        max: 6,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => galaxyConfig.armCount,
        onChange: (value) => {
          galaxyConfig.armCount = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-spiral",
        label: "Spiral Tightness",
        min: 0.1,
        max: 0.4,
        step: 0.01,
        format: (value) => value.toFixed(2),
        getValue: () => galaxyConfig.spiralTightness,
        onChange: (value) => {
          galaxyConfig.spiralTightness = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-radius",
        label: "Disc Radius",
        min: 150,
        max: 340,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => galaxyConfig.radiusOuter,
        onChange: (value) => {
          galaxyConfig.radiusOuter = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-thickness",
        label: "Core Thickness",
        min: 10,
        max: 60,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => galaxyConfig.thicknessCore,
        onChange: (value) => {
          galaxyConfig.thicknessCore = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-density",
        label: "Disc Star Density",
        min: 0.5,
        max: 2.5,
        step: 0.1,
        format: (value) => value.toFixed(2),
        getValue: () => galaxyConfig.densityScale,
        onChange: (value) => {
          galaxyConfig.densityScale = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-spiral-start",
        label: "Spiral Start Radius",
        min: 0,
        max: 120,
        step: 1,
        format: (value) => value.toFixed(0),
        getValue: () => galaxyConfig.spiralStartRadius,
        onChange: (value) => {
          galaxyConfig.spiralStartRadius = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-theta-max",
        label: "Arm Length (Theta)",
        min: 4,
        max: 12,
        step: 0.2,
        format: (value) => value.toFixed(1),
        getValue: () => galaxyConfig.thetaMax,
        onChange: (value) => {
          galaxyConfig.thetaMax = value;
          rebuildGalaxyDisc();
        },
      },
      {
        id: "mg-core-frac",
        label: "Core Fraction",
        min: 0,
        max: 0.5,
        step: 0.02,
        format: (value) => value.toFixed(2),
        getValue: () => galaxyConfig.coreFraction,
        onChange: (value) => {
          galaxyConfig.coreFraction = value;
          rebuildGalaxyDisc();
        },
      },
    ],
    [
      {
        id: "mg-twinkle",
        label: "Twinkle Speed",
        min: 0,
        max: 4,
        step: 0.05,
        format: (value) => value.toFixed(2),
        getValue: () => galaxyConfig.twinkleSpeed,
        onChange: (value) => {
          galaxyConfig.twinkleSpeed = value;
        },
      },
      {
        id: "mg-aurora-opacity",
        label: "Aurora Opacity",
        min: 0,
        max: 1.2,
        step: 0.05,
        format: (value) => value.toFixed(2),
        getValue: () => auroraConfig.opacityScale,
        onChange: (value) => {
          auroraConfig.opacityScale = value;
          auroraUniforms.forEach((uniforms, index) => {
            uniforms.uBaseOpacity.value =
              auroraBaseOpacity[index] * auroraConfig.opacityScale;
          });
        },
      },
      {
        id: "mg-aurora-amp",
        label: "Aurora Amplitude",
        min: 0,
        max: 2,
        step: 0.05,
        format: (value) => value.toFixed(2),
        getValue: () => auroraConfig.amplitudeScale,
        onChange: (value) => {
          auroraConfig.amplitudeScale = value;
          auroraUniforms.forEach((uniforms, index) => {
            uniforms.uAmplitude.value =
              auroraBaseAmplitude[index] * auroraConfig.amplitudeScale;
          });
        },
      },
    ],
  ];

  function createDevPanelActionButton(action, label, iconMarkup) {
    return `
      <button
        type="button"
        class="mg-dev-action"
        data-dev-panel-action="${action}"
        aria-label="${label}"
        title="${label}"
      >
        ${iconMarkup}
      </button>
    `;
  }

  function createDevPanelControlMarkup(control) {
    return `
        <div class="mg-dev-row">
          <label for="${control.id}">${control.label}</label>
          <div class="mg-dev-control">
            <input type="range" id="${control.id}" min="${control.min}" max="${control.max}" step="${control.step}">
            <span class="mg-dev-value" id="${control.id}-val"></span>
          </div>
        </div>
    `;
  }

  function createDevPanelBodyMarkup() {
    return DEV_PANEL_CONTROL_GROUPS.map((group, index) => {
      const groupMarkup = group.map(createDevPanelControlMarkup).join("");
      return index === 0 ? groupMarkup : `<hr />${groupMarkup}`;
    }).join("");
  }

  function createDevPanelResizeHandleMarkup(edge) {
    return `
    <div class="mg-dev-resize-handle mg-dev-resize-handle-${edge}" data-dev-panel-edge="${edge}"></div>`;
  }

  const devPanel = document.createElement("div");
  devPanel.id = "mg-dev-panel";
  devPanel.innerHTML = `
    <div class="mg-dev-surface">
      <div class="mg-dev-chrome">
        <div class="mg-dev-header">
          <span class="mg-dev-title">Dev Panel</span>
          <span class="mg-dev-hint">(Ctrl+.)</span>
        </div>
        <div class="mg-dev-window-controls">
          ${createDevPanelActionButton(
            DEV_PANEL_ACTIONS.toggleCollapse,
            "Collapse panel",
            DEV_PANEL_ICONS.collapse
          )}
          ${createDevPanelActionButton(
            DEV_PANEL_ACTIONS.resetLayout,
            "Reset panel position and size",
            DEV_PANEL_ICONS.reset
          )}
          ${createDevPanelActionButton(
            DEV_PANEL_ACTIONS.closePanel,
            "Close panel",
            DEV_PANEL_ICONS.close
          )}
        </div>
      </div>

      <div class="mg-dev-body">
        ${createDevPanelBodyMarkup()}
      </div>
    </div>

    ${DEV_PANEL_RESIZE_EDGES.map(createDevPanelResizeHandleMarkup).join("")}
  `;
  document.body.appendChild(devPanel);

  const devPanelChrome = devPanel.querySelector(".mg-dev-chrome");
  const devPanelCollapseButton = devPanel.querySelector(
    `[data-dev-panel-action="${DEV_PANEL_ACTIONS.toggleCollapse}"]`
  );
  const devPanelResizeHandles = devPanel.querySelectorAll("[data-dev-panel-edge]");
  const devPanelActionButtons = devPanel.querySelectorAll("[data-dev-panel-action]");
  const devPanelState = {
    drag: null,
    resize: null,
    hoverEdge: "",
    expandedHeight: initialPanelHeight,
    affordanceTimer: null,
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isDevPanelOpen() {
    return devPanel.classList.contains("open");
  }

  function isDevPanelCollapsed() {
    return devPanel.classList.contains("is-collapsed");
  }

  function updateCollapseButtonUi() {
    if (!devPanelCollapseButton) return;
    const collapsed = isDevPanelCollapsed();
    devPanelCollapseButton.classList.toggle("is-collapsed", collapsed);
    const label = collapsed ? "Expand panel" : "Collapse panel";
    devPanelCollapseButton.setAttribute("aria-label", label);
    devPanelCollapseButton.setAttribute("title", label);
  }

  function clearResizeAffordanceTimer() {
    if (devPanelState.affordanceTimer) {
      window.clearTimeout(devPanelState.affordanceTimer);
      devPanelState.affordanceTimer = null;
    }
  }

  function clearDevPanelLayoutStyles() {
    devPanel.style.top = "";
    devPanel.style.left = "";
    devPanel.style.width = "";
    devPanel.style.height = "";
    devPanel.style.minHeight = "";
  }

  function resetDevPanelTransientState() {
    clearResizeAffordanceTimer();
    devPanel.classList.remove("show-resize-affordance");
    devPanelState.hoverEdge = "";
    stopDevPanelInteraction();
  }

  function showResizeAffordanceTemporarily(durationMs) {
    if (isDevPanelCollapsed()) {
      return;
    }

    devPanel.classList.add("show-resize-affordance");
    clearResizeAffordanceTimer();
    devPanelState.affordanceTimer = window.setTimeout(() => {
      devPanel.classList.remove("show-resize-affordance");
      devPanelState.affordanceTimer = null;
    }, durationMs);
  }

  function setDevPanelOpen(isOpen) {
    if (!isOpen) {
      resetDevPanelTransientState();
    }

    devPanel.classList.toggle("open", isOpen);
    if (isOpen) {
      clampDevPanelToViewport();
    }

    updateCollapseButtonUi();
  }

  function setDevPanelCollapsed(collapsed) {
    if (collapsed === isDevPanelCollapsed()) {
      updateCollapseButtonUi();
      return;
    }

    if (collapsed) {
      devPanelState.expandedHeight = devPanel.offsetHeight;
      devPanel.classList.add("is-collapsed");
      devPanel.style.minHeight = `${DEV_PANEL_CONFIG.collapsedHeight}px`;
      devPanel.style.height = `${DEV_PANEL_CONFIG.collapsedHeight}px`;
    } else {
      devPanel.classList.remove("is-collapsed");
      devPanel.style.minHeight = `${DEV_PANEL_CONFIG.minHeight}px`;
      devPanel.style.height = `${Math.round(
        Math.max(devPanelState.expandedHeight, DEV_PANEL_CONFIG.minHeight)
      )}px`;
      clampDevPanelToViewport();
    }

    updateCollapseButtonUi();
  }

  function resetDevPanelLayout() {
    resetDevPanelTransientState();
    devPanel.classList.remove("is-collapsed");
    clearDevPanelLayoutStyles();
    devPanelState.expandedHeight = initialPanelHeight;
    setDevPanelOpen(true);
  }

  if (DEV_PANEL_CONFIG.openOnLoad) {
    setDevPanelOpen(true);
  } else {
    updateCollapseButtonUi();
  }

  function getViewportBounds() {
    const margin = DEV_PANEL_CONFIG.viewportMargin;
    return {
      minLeft: margin,
      minTop: margin,
      maxRight: window.innerWidth - margin,
      maxBottom: window.innerHeight - margin,
    };
  }

  function removeDevPanelCursorClasses() {
    DEV_PANEL_CURSOR_CLASSNAMES.forEach((className) => {
      devPanel.classList.remove(className);
    });
  }

  function applyDevPanelCursor(edge) {
    removeDevPanelCursorClasses();
    const className = DEV_PANEL_EDGE_CURSORS[edge];
    if (className) {
      devPanel.classList.add(className);
    }
  }

  function measureDevPanelRect() {
    return devPanel.getBoundingClientRect();
  }

  function getResizeHandleEdge(target) {
    const handle = target.closest("[data-dev-panel-edge]");
    return handle ? handle.dataset.devPanelEdge || "" : "";
  }

  function getResizeEdgeFromEvent(event) {
    if (isDevPanelCollapsed()) {
      return "";
    }

    const handleEdge = getResizeHandleEdge(event.target);
    if (handleEdge) {
      return handleEdge;
    }

    const rect = measureDevPanelRect();
    const threshold = DEV_PANEL_CONFIG.edgeResizeThreshold;
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const nearLeft = offsetX >= 0 && offsetX <= threshold;
    const nearRight = offsetX >= rect.width - threshold && offsetX <= rect.width;
    const nearTop = offsetY >= 0 && offsetY <= threshold;
    const nearBottom = offsetY >= rect.height - threshold && offsetY <= rect.height;

    let edge = "";
    if (nearTop) edge += "n";
    else if (nearBottom) edge += "s";

    if (nearLeft) edge += "w";
    else if (nearRight) edge += "e";

    return edge;
  }

  function clampDevPanelToViewport() {
    if (!isDevPanelOpen()) {
      return;
    }

    const bounds = getViewportBounds();
    const minHeight = isDevPanelCollapsed()
      ? DEV_PANEL_CONFIG.collapsedHeight
      : DEV_PANEL_CONFIG.minHeight;
    const maxWidth = Math.max(
      DEV_PANEL_CONFIG.minWidth,
      bounds.maxRight - bounds.minLeft
    );
    const maxHeight = Math.max(
      minHeight,
      bounds.maxBottom - bounds.minTop
    );
    const width = clamp(
      devPanel.offsetWidth,
      DEV_PANEL_CONFIG.minWidth,
      maxWidth
    );
    const height = clamp(
      devPanel.offsetHeight,
      minHeight,
      maxHeight
    );
    const left = clamp(
      devPanel.offsetLeft,
      bounds.minLeft,
      bounds.maxRight - width
    );
    const top = clamp(
      devPanel.offsetTop,
      bounds.minTop,
      bounds.maxBottom - height
    );

    devPanel.style.width = `${Math.round(width)}px`;
    devPanel.style.height = `${Math.round(height)}px`;
    devPanel.style.left = `${Math.round(left)}px`;
    devPanel.style.top = `${Math.round(top)}px`;
  }

  function stopDevPanelInteraction() {
    devPanelState.drag = null;
    devPanelState.resize = null;
    devPanel.classList.remove("is-dragging", "is-resizing");
    applyDevPanelCursor(devPanelState.hoverEdge);
  }

  function startDevPanelDrag(event) {
    devPanelState.drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: devPanel.offsetLeft,
      startTop: devPanel.offsetTop,
      width: devPanel.offsetWidth,
      height: devPanel.offsetHeight,
    };
    devPanel.classList.add("is-dragging");
  }

  function startDevPanelResize(event, edge) {
    devPanelState.resize = {
      pointerId: event.pointerId,
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: devPanel.offsetLeft,
      startTop: devPanel.offsetTop,
      startWidth: devPanel.offsetWidth,
      startHeight: devPanel.offsetHeight,
    };
    devPanel.classList.add("is-resizing");
    applyDevPanelCursor(edge);
  }

  function updateDevPanelDrag(event) {
    if (!devPanelState.drag || devPanelState.drag.pointerId !== event.pointerId) {
      return;
    }

    const bounds = getViewportBounds();
    const nextLeft = clamp(
      devPanelState.drag.startLeft + (event.clientX - devPanelState.drag.startX),
      bounds.minLeft,
      bounds.maxRight - devPanelState.drag.width
    );
    const nextTop = clamp(
      devPanelState.drag.startTop + (event.clientY - devPanelState.drag.startY),
      bounds.minTop,
      bounds.maxBottom - devPanelState.drag.height
    );

    devPanel.style.left = `${Math.round(nextLeft)}px`;
    devPanel.style.top = `${Math.round(nextTop)}px`;
  }

  function updateDevPanelResize(event) {
    if (!devPanelState.resize || devPanelState.resize.pointerId !== event.pointerId) {
      return;
    }

    const resize = devPanelState.resize;
    const bounds = getViewportBounds();
    const maxWidth = Math.max(
      DEV_PANEL_CONFIG.minWidth,
      bounds.maxRight - bounds.minLeft
    );
    const maxHeight = Math.max(
      DEV_PANEL_CONFIG.minHeight,
      bounds.maxBottom - bounds.minTop
    );

    let nextLeft = resize.startLeft;
    let nextTop = resize.startTop;
    let nextWidth = resize.startWidth;
    let nextHeight = resize.startHeight;

    const deltaX = event.clientX - resize.startX;
    const deltaY = event.clientY - resize.startY;

    if (resize.edge.includes("e")) {
      nextWidth = clamp(
        resize.startWidth + deltaX,
        DEV_PANEL_CONFIG.minWidth,
        bounds.maxRight - resize.startLeft
      );
    }

    if (resize.edge.includes("s")) {
      nextHeight = clamp(
        resize.startHeight + deltaY,
        DEV_PANEL_CONFIG.minHeight,
        bounds.maxBottom - resize.startTop
      );
    }

    if (resize.edge.includes("w")) {
      const maxLeft = resize.startLeft + resize.startWidth - DEV_PANEL_CONFIG.minWidth;
      nextLeft = clamp(event.clientX, bounds.minLeft, maxLeft);
      nextWidth = clamp(
        resize.startWidth + (resize.startLeft - nextLeft),
        DEV_PANEL_CONFIG.minWidth,
        maxWidth
      );
      nextLeft = resize.startLeft + resize.startWidth - nextWidth;
    }

    if (resize.edge.includes("n")) {
      const maxTop = resize.startTop + resize.startHeight - DEV_PANEL_CONFIG.minHeight;
      nextTop = clamp(event.clientY, bounds.minTop, maxTop);
      nextHeight = clamp(
        resize.startHeight + (resize.startTop - nextTop),
        DEV_PANEL_CONFIG.minHeight,
        maxHeight
      );
      nextTop = resize.startTop + resize.startHeight - nextHeight;
    }

    devPanel.style.left = `${Math.round(nextLeft)}px`;
    devPanel.style.top = `${Math.round(nextTop)}px`;
    devPanel.style.width = `${Math.round(nextWidth)}px`;
    devPanel.style.height = `${Math.round(nextHeight)}px`;
  }

  devPanel.addEventListener("pointermove", (event) => {
    if (devPanelState.drag || devPanelState.resize) return;
    if (isDevPanelCollapsed()) {
      devPanelState.hoverEdge = "";
      removeDevPanelCursorClasses();
      return;
    }
    const edge = getResizeEdgeFromEvent(event);
    devPanelState.hoverEdge = edge;
    applyDevPanelCursor(edge);
  });

  devPanel.addEventListener("pointerdown", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") {
      showResizeAffordanceTemporarily(
        DEV_PANEL_CONFIG.touchAffordanceVisibleMs
      );
    }
  });

  devPanel.addEventListener("pointerleave", () => {
    if (devPanelState.drag || devPanelState.resize) return;
    devPanelState.hoverEdge = "";
    removeDevPanelCursorClasses();
  });

  devPanel.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (isDevPanelCollapsed()) return;
    const edge = getResizeEdgeFromEvent(event);
    if (!edge) return;
    event.preventDefault();
    startDevPanelResize(event, edge);
  });

  devPanelResizeHandles.forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (isDevPanelCollapsed()) return;
      const edge = handle.dataset.devPanelEdge || "";
      if (!edge) return;
      event.preventDefault();
      event.stopPropagation();
      startDevPanelResize(event, edge);
    });
  });

  if (devPanelChrome) {
    devPanelChrome.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (event.target.closest("[data-dev-panel-action]")) return;
      if (getResizeEdgeFromEvent(event)) return;
      event.preventDefault();
      startDevPanelDrag(event);
    });
  }

  devPanelActionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const action = button.dataset.devPanelAction;
      if (action === DEV_PANEL_ACTIONS.toggleCollapse) {
        setDevPanelCollapsed(!isDevPanelCollapsed());
      } else if (action === DEV_PANEL_ACTIONS.resetLayout) {
        resetDevPanelLayout();
      } else if (action === DEV_PANEL_ACTIONS.closePanel) {
        setDevPanelOpen(false);
      }
    });
  });

  window.addEventListener("pointermove", (event) => {
    updateDevPanelDrag(event);
    updateDevPanelResize(event);
  });

  window.addEventListener("pointerup", stopDevPanelInteraction);
  window.addEventListener("pointercancel", stopDevPanelInteraction);
  window.addEventListener("resize", clampDevPanelToViewport);

  clampDevPanelToViewport();

  function bindSlider(id, valId, initial, formatFn, onChange) {
    const slider = document.getElementById(id);
    const label = document.getElementById(valId);
    if (!slider || !label) return;
    slider.value = String(initial);
    label.textContent = formatFn(initial);
    slider.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      label.textContent = formatFn(v);
      onChange(v);
    });
  }

  function bindDevPanelControl(control) {
    bindSlider(
      control.id,
      `${control.id}-val`,
      control.getValue(),
      control.format,
      control.onChange
    );
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (e.key === "." || e.code === "Period")) {
      setDevPanelOpen(!isDevPanelOpen());
    }
  });

  DEV_PANEL_CONTROL_GROUPS.forEach((group) => {
    group.forEach(bindDevPanelControl);
  });

  // ---- Animation loop ------------------------------------------------------

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const deltaMs = delta * 1000;

    const lerpFactor = 0.05;
    baseSpeed = baseSpeed + (targetSpeed - baseSpeed) * lerpFactor;
    const effectiveSpeed = isPageVisible ? baseSpeed : baseSpeed * 0.3;

    resizeRendererToDisplaySize();

    // Clockwise rotation (negative around Y)
    const galaxyRotationDelta =
      galaxyRotationSpeedBase * delta * effectiveSpeed;
    if (galaxyDisc) {
      galaxyDisc.rotation.y -= galaxyRotationDelta;
    }
    backgroundStars.rotation.y -= galaxyRotationDelta * 0.25;

    // Twinkle time
    if (galaxyUniforms) {
      galaxyUniforms.uTime.value +=
        delta * galaxyConfig.twinkleSpeed * effectiveSpeed;
    }

    // Aurora animation
    auroraUniforms.forEach((u) => {
      u.uTime.value += delta * u.uSpeed.value * effectiveSpeed;
    });

    // Camera look target (including dev panel tweaks)
    camera.lookAt(0, cameraLookTargetY, 0);

    updateHeroStarHover();
    renderer.render(scene, camera);
    recordFrameTime(deltaMs);
  }

  animate();
})();
