(function () {
  if (typeof THREE === "undefined") {
    console.error(
      "[MakerGalaxy] THREE is not defined. Make sure three.min.js is loaded before maker-galaxy-scene.js."
    );
    return;
  }

  function getCssNumber(varName, fallback) {
    const styles = getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(varName).trim();
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function createMakerGalaxyScene(options) {
    const heroSection = options.heroSection;
    const canvas = options.canvas;
    const titleEl = options.titleEl;
    const taglineEl = options.taglineEl;
    const heroTitle = options.title || "Maker Galaxy";
    const heroTagline =
      options.tagline || "Where makers, tools, and ideas orbit together.";

    if (!heroSection || !canvas) {
      console.warn("[MakerGalaxy] Missing hero section or canvas.");
      return null;
    }

    if (titleEl) {
      titleEl.textContent = heroTitle;
    }
    if (taglineEl) {
      taglineEl.textContent = heroTagline;
    }

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    const initialPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(initialPixelRatio);
    renderer.setClearColor(0x000000, 0);

    let galaxyRotationSpeedBase = getCssNumber("--mg-galaxy-rotation-speed", 0.05);
    const auroraSpeedBase = getCssNumber("--mg-aurora-speed", 0.7);
    const starfieldDensityMul = getCssNumber("--mg-starfield-density", 1);
    const hoverScaleTarget = getCssNumber("--mg-hover-scale", 1.65);

    const galaxyConfig = {
      radiusOuter: 260,
      starCountBase: 3200,
      armCount: 4,
      spiralTightness: 0.3,
      spiralStartRadius: 40,
      thetaMax: 9.0,
      scatterRadius: 25,
      thicknessCore: 30,
      coreFraction: 0.16,
      densityScale: 1.0,
      twinkleSpeed: 0.75,
    };

    const auroraConfig = {
      opacityScale: 0.3,
      amplitudeScale: 1.0,
    };

    const defaultCameraPose = {
      x: 0,
      y: -120,
      z: 340,
      targetY: 15,
    };
    let motionPaused = false;
    let cameraLookTargetY = 15;

    const camera = new THREE.PerspectiveCamera(
      60,
      heroSection.clientWidth / heroSection.clientHeight,
      0.1,
      2000
    );
    camera.position.set(
      defaultCameraPose.x,
      defaultCameraPose.y,
      defaultCameraPose.z
    );
    camera.lookAt(0, defaultCameraPose.targetY, 0);

    function resizeRendererToDisplaySize() {
      const width = heroSection.clientWidth;
      const height = heroSection.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;

      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      return needResize;
    }

    resizeRendererToDisplaySize();

    const hemiLight = new THREE.HemisphereLight(0x8899ff, 0x080310, 0.4);
    scene.add(hemiLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 700);
    pointLight.position.set(0, 80, 160);
    scene.add(pointLight);

    function createBackgroundStarfield() {
      const starCount = Math.floor(1100 * starfieldDensityMul);
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const color = new THREE.Color();

      for (let i = 0; i < starCount; i += 1) {
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
          color.setHSL(0.76 + Math.random() * 0.06, 0.65, 0.65);
        } else if (bucket < 0.8) {
          color.setHSL(0.6 + Math.random() * 0.06, 0.6, 0.7);
        } else if (bucket < 0.96) {
          color.setHSL(0.88 + Math.random() * 0.04, 0.7, 0.72);
        } else {
          color.setRGB(1.0, 0.93 + Math.random() * 0.05, 0.78 + Math.random() * 0.1);
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

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

    let galaxyDisc = null;
    let galaxyUniforms = null;
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
      const eMax = Math.exp(b * thetaMax) - 1.0;
      const minRadius = spiralStart;
      const maxRadius = radiusOuter;

      for (let i = 0; i < starCount; i += 1) {
        let x;
        let y;
        let z;
        let r;
        let t;

        if (Math.random() < coreFraction) {
          const u = Math.random();
          const rCore = Math.pow(u, 2.0) * (spiralStart * 1.1);
          const angleCore = Math.random() * Math.PI * 2;

          x = rCore * Math.cos(angleCore);
          z = rCore * Math.sin(angleCore);
          y = THREE.MathUtils.randFloatSpread(thicknessCore * 0.9);
          r = rCore;
        } else {
          const armIndex = Math.floor(Math.random() * armCount);
          const armOffset = (armIndex / armCount) * Math.PI * 2;
          const thetaBase = Math.random() * thetaMax;
          let theta = -(thetaBase + armOffset);
          const e = Math.exp(b * thetaBase) - 1.0;
          const spiralNorm = eMax > 0 ? e / eMax : 0.0;
          const rSpiral = minRadius + (maxRadius - minRadius) * spiralNorm;

          r = rSpiral + THREE.MathUtils.randFloatSpread(scatterRadius);
          theta += THREE.MathUtils.randFloatSpread(0.12);
          x = r * Math.cos(theta);
          z = r * Math.sin(theta);
        }

        t = Math.min(1, r / radiusOuter);
        const coreBias = Math.exp(-r * 0.006);
        const thickness = thicknessCore * coreBias + 6 + t * 10;
        y = y !== undefined ? y : THREE.MathUtils.randFloatSpread(thickness);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const bucket = Math.random();
        if (bucket < 0.45) {
          color.setHSL(0.76 + Math.random() * 0.05, 0.7, 0.65);
        } else if (bucket < 0.8) {
          color.setHSL(0.6 + Math.random() * 0.06, 0.65, 0.7);
        } else if (bucket < 0.95) {
          color.setHSL(0.88 + Math.random() * 0.04, 0.75, 0.75);
        } else {
          color.setRGB(1.0, 0.94 + Math.random() * 0.05, 0.8 + Math.random() * 0.15);
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

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
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

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
      if (!galaxyDisc) {
        return;
      }
      if (galaxyDisc.geometry) {
        galaxyDisc.geometry.dispose();
      }
      if (galaxyDisc.material) {
        galaxyDisc.material.dispose();
      }
      scene.remove(galaxyDisc);
      galaxyDisc = null;
      galaxyUniforms = null;
    }

    function rebuildGalaxyDisc() {
      disposeGalaxyDisc();
      heroStarMeshes.length = 0;
      createGalaxyDisc();
      createHeroStars();
    }

    createGalaxyDisc();

    function createTooltipElement() {
      const element = document.createElement("div");
      element.className = "mg-star-tooltip";
      element.style.display = "none";
      element.textContent = "";
      document.body.appendChild(element);
      return element;
    }

    function createHeroStars(count = 18) {
      if (!galaxyDisc) {
        return;
      }

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

      for (let i = 0; i < count; i += 1) {
        const u = Math.random();
        const rBias = Math.pow(u, 2.0);
        const r = radiusInner + rBias * (radiusOuter - radiusInner);
        const angle = Math.random() * Math.PI * 2 + (r / radiusOuter) * 4.0;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = (Math.random() - 0.5) * heightVariance;
        const mesh = new THREE.Mesh(geometry, material.clone());
        const baseScale = 0.9 + Math.random() * 0.4;

        mesh.position.set(x, y, z);
        mesh.scale.setScalar(baseScale);
        mesh.userData = {
          label:
            u < 0.3 ? "Core Maker Hub" : u < 0.6 ? "Tool Orbit" : "Project Node",
          baseScale,
          hoverScale: hoverScaleTarget,
        };

        heroStarMeshes.push(mesh);
        galaxyDisc.add(mesh);
      }
    }

    createHeroStars();

    const auroraUniforms = [];
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
        uBaseOpacity: { value: baseOpacity * auroraConfig.opacityScale },
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
      mesh.rotation.set(THREE.MathUtils.degToRad(tiltDeg), 0, 0);
      mesh.rotateY(THREE.MathUtils.degToRad(Math.random() * 360));

      scene.add(mesh);
      auroraUniforms.push(uniforms);
      auroraBaseOpacity.push(baseOpacity);
      auroraBaseAmplitude.push(amplitudeBase);
    }

    createAuroraRibbon(260, 220, 60, 0xb36bff, 0x35e0ff, 0.55, 1.0, 36.0);
    createAuroraRibbon(300, 260, 50, 0x4b1a7f, 0x35e0ff, 0.4, 0.65, 36.0);
    createAuroraRibbon(320, 280, 72, 0xffc857, 0xd68bff, 0.32, 1.3, 36.0);

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
      if (!hoveredHeroStar) {
        return;
      }

      const hoveredMesh = hoveredHeroStar;
      const data = hoveredMesh.userData;
      hoveredMesh.scale.setScalar(data.baseScale);
      hoveredMesh.material.emissiveIntensity = 1.6;
      hoveredHeroStar = null;
      heroStarTooltip.style.display = "none";
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

    function updateHeroStarHover() {
      if (!isPointerOverHero || !galaxyDisc) {
        return;
      }

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
      const hoverScale = data.hoverScale || hoverScaleTarget;

      hoveredHeroStar.scale.setScalar(hoverScale);
      hoveredHeroStar.material.emissiveIntensity = 2.6;
      heroStarTooltip.textContent = data.label || "Maker Node";
      heroStarTooltip.style.display = "block";
      positionTooltip(hoveredHeroStar);
    }

    const clock = new THREE.Clock();
    let baseSpeed = 1.0;
    let targetSpeed = 1.0;
    let isPageVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            targetSpeed = entry.intersectionRatio > 0.4 ? 1.0 : 0.15;
          }
        });
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

    let frameTimeSamples = [];
    let lowQualityMode = false;

    function recordFrameTime(deltaMs) {
      frameTimeSamples.push(deltaMs);
      if (frameTimeSamples.length > 120) {
        frameTimeSamples.shift();
      }
      if (frameTimeSamples.length === 120 && !lowQualityMode) {
        const avg =
          frameTimeSamples.reduce((sum, value) => sum + value, 0) /
          frameTimeSamples.length;
        if (avg > 40) {
          lowQualityMode = true;
          console.warn(
            "[MakerGalaxy] Low-quality mode could be enabled here (avg frameTime ~",
            avg.toFixed(1),
            "ms)."
          );
        }
      }
    }

    function setAuroraOpacityScale(value) {
      auroraConfig.opacityScale = value;
      auroraUniforms.forEach((uniforms, index) => {
        uniforms.uBaseOpacity.value = auroraBaseOpacity[index] * auroraConfig.opacityScale;
      });
    }

    function setAuroraAmplitudeScale(value) {
      auroraConfig.amplitudeScale = value;
      auroraUniforms.forEach((uniforms, index) => {
        uniforms.uAmplitude.value = auroraBaseAmplitude[index] * auroraConfig.amplitudeScale;
      });
    }

    function getCameraPose() {
      return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        targetY: cameraLookTargetY,
      };
    }

    function setCameraPose(pose) {
      if (Number.isFinite(pose.x)) {
        camera.position.x = pose.x;
      }
      if (Number.isFinite(pose.y)) {
        camera.position.y = pose.y;
      }
      if (Number.isFinite(pose.z)) {
        camera.position.z = pose.z;
      }
      if (Number.isFinite(pose.targetY)) {
        cameraLookTargetY = pose.targetY;
      }
    }

    function resetCameraPose() {
      setCameraPose(defaultCameraPose);
    }

    function isMotionPaused() {
      return motionPaused;
    }

    function setMotionPaused(value) {
      motionPaused = Boolean(value);
    }

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const deltaMs = delta * 1000;
      const lerpFactor = 0.05;
      baseSpeed = baseSpeed + (targetSpeed - baseSpeed) * lerpFactor;
      const visibilitySpeed = isPageVisible ? baseSpeed : baseSpeed * 0.3;
      const effectiveSpeed = motionPaused ? 0 : visibilitySpeed;

      resizeRendererToDisplaySize();

      const galaxyRotationDelta = galaxyRotationSpeedBase * delta * effectiveSpeed;
      if (galaxyDisc) {
        galaxyDisc.rotation.y -= galaxyRotationDelta;
      }
      backgroundStars.rotation.y -= galaxyRotationDelta * 0.25;

      if (galaxyUniforms) {
        galaxyUniforms.uTime.value += delta * galaxyConfig.twinkleSpeed * effectiveSpeed;
      }

      auroraUniforms.forEach((uniforms) => {
        uniforms.uTime.value += delta * uniforms.uSpeed.value * effectiveSpeed;
      });

      camera.lookAt(0, cameraLookTargetY, 0);
      updateHeroStarHover();
      renderer.render(scene, camera);
      recordFrameTime(deltaMs);
    }

    animate();

    return {
      camera,
      galaxyConfig,
      auroraConfig,
      defaultCameraPose: { ...defaultCameraPose },
      getRotationSpeed() {
        return galaxyRotationSpeedBase;
      },
      setRotationSpeed(value) {
        galaxyRotationSpeedBase = value;
      },
      getCameraLookTargetY() {
        return cameraLookTargetY;
      },
      setCameraLookTargetY(value) {
        cameraLookTargetY = value;
      },
      getCameraPose,
      setCameraPose,
      resetCameraPose,
      rebuildGalaxyDisc,
      isMotionPaused,
      setMotionPaused,
      setAuroraOpacityScale,
      setAuroraAmplitudeScale,
    };
  }

  window.MakerGalaxyScene = {
    createMakerGalaxyScene,
  };
})();
