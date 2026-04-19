(function () {
  const floatingPanelApi = window.MakerGalaxyFloatingPanel;

  if (!floatingPanelApi) {
    console.error(
      "[MakerGalaxy] MakerGalaxyFloatingPanel is not available. Load floating-panel.js before maker-galaxy-panel.js."
    );
    return;
  }

  function createControlMarkup(control) {
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

  function createControlsContent(controlGroups) {
    const content = document.createElement("div");
    content.className = "mg-dev-controls";
    content.innerHTML = controlGroups
      .map((group, index) => {
        const groupMarkup = group.map(createControlMarkup).join("");
        return index === 0 ? groupMarkup : `<hr />${groupMarkup}`;
      })
      .join("");
    return content;
  }

  function bindSlider(id, initialValue, formatValue, onChange) {
    const slider = document.getElementById(id);
    const valueLabel = document.getElementById(`${id}-val`);
    if (!slider || !valueLabel) {
      return;
    }

    slider.value = String(initialValue);
    valueLabel.textContent = formatValue(initialValue);
    slider.addEventListener("input", (event) => {
      const nextValue = parseFloat(event.target.value);
      valueLabel.textContent = formatValue(nextValue);
      onChange(nextValue);
    });
  }

  function createControlGroups(sceneApi) {
    function rebuildGalaxyConfig(update) {
      return (value) => {
        update(value);
        sceneApi.rebuildGalaxyDisc();
      };
    }

    return [
      [
        {
          id: "mg-rot-speed",
          label: "Rotation Speed",
          min: 0,
          max: 0.6,
          step: 0.01,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.getRotationSpeed(),
          onChange: (value) => {
            sceneApi.setRotationSpeed(value);
          },
        },
        {
          id: "mg-cam-x",
          label: "Camera X",
          min: -400,
          max: 400,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.camera.position.x,
          onChange: (value) => {
            sceneApi.camera.position.x = value;
          },
        },
        {
          id: "mg-cam-y",
          label: "Camera Y",
          min: -400,
          max: 400,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.camera.position.y,
          onChange: (value) => {
            sceneApi.camera.position.y = value;
          },
        },
        {
          id: "mg-cam-z",
          label: "Camera Z",
          min: 150,
          max: 900,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.camera.position.z,
          onChange: (value) => {
            sceneApi.camera.position.z = value;
          },
        },
        {
          id: "mg-cam-target-y",
          label: "Camera Target Y",
          min: -100,
          max: 200,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.getCameraLookTargetY(),
          onChange: (value) => {
            sceneApi.setCameraLookTargetY(value);
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
          getValue: () => sceneApi.galaxyConfig.armCount,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.armCount = value;
          }),
        },
        {
          id: "mg-spiral",
          label: "Spiral Tightness",
          min: 0.1,
          max: 0.4,
          step: 0.01,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.galaxyConfig.spiralTightness,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.spiralTightness = value;
          }),
        },
        {
          id: "mg-radius",
          label: "Disc Radius",
          min: 150,
          max: 340,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.galaxyConfig.radiusOuter,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.radiusOuter = value;
          }),
        },
        {
          id: "mg-thickness",
          label: "Core Thickness",
          min: 10,
          max: 60,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.galaxyConfig.thicknessCore,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.thicknessCore = value;
          }),
        },
        {
          id: "mg-density",
          label: "Disc Star Density",
          min: 0.5,
          max: 2.5,
          step: 0.1,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.galaxyConfig.densityScale,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.densityScale = value;
          }),
        },
        {
          id: "mg-spiral-start",
          label: "Spiral Start Radius",
          min: 0,
          max: 120,
          step: 1,
          format: (value) => value.toFixed(0),
          getValue: () => sceneApi.galaxyConfig.spiralStartRadius,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.spiralStartRadius = value;
          }),
        },
        {
          id: "mg-theta-max",
          label: "Arm Length (Theta)",
          min: 4,
          max: 12,
          step: 0.2,
          format: (value) => value.toFixed(1),
          getValue: () => sceneApi.galaxyConfig.thetaMax,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.thetaMax = value;
          }),
        },
        {
          id: "mg-core-frac",
          label: "Core Fraction",
          min: 0,
          max: 0.5,
          step: 0.02,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.galaxyConfig.coreFraction,
          onChange: rebuildGalaxyConfig((value) => {
            sceneApi.galaxyConfig.coreFraction = value;
          }),
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
          getValue: () => sceneApi.galaxyConfig.twinkleSpeed,
          onChange: (value) => {
            sceneApi.galaxyConfig.twinkleSpeed = value;
          },
        },
        {
          id: "mg-aurora-opacity",
          label: "Aurora Opacity",
          min: 0,
          max: 1.2,
          step: 0.05,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.auroraConfig.opacityScale,
          onChange: (value) => {
            sceneApi.setAuroraOpacityScale(value);
          },
        },
        {
          id: "mg-aurora-amp",
          label: "Aurora Amplitude",
          min: 0,
          max: 2,
          step: 0.05,
          format: (value) => value.toFixed(2),
          getValue: () => sceneApi.auroraConfig.amplitudeScale,
          onChange: (value) => {
            sceneApi.setAuroraAmplitudeScale(value);
          },
        },
      ],
    ];
  }

  function createMakerGalaxyDevPanel(sceneApi) {
    const controlGroups = createControlGroups(sceneApi);
    const panel = floatingPanelApi.createFloatingPanel({
      id: "mg-galaxy-dev-panel",
      className: "mg-galaxy-dev-panel",
      title: "Dev Panel",
      hint: "(Ctrl+.)",
      content: createControlsContent(controlGroups),
      config: {
        initialTop: floatingPanelApi.readCssLength("--mg-panel-top", 12),
        initialLeft: floatingPanelApi.readCssLength("--mg-panel-left", 12),
        initialWidth: floatingPanelApi.readCssLength("--mg-panel-width", 320),
        initialHeight: Math.min(
          Math.round(window.innerHeight * floatingPanelApi.readCssNumber("--mg-panel-height-fraction", 0.72)),
          floatingPanelApi.readCssLength("--mg-panel-height-max", 640)
        ),
        minWidth: floatingPanelApi.readCssLength("--mg-panel-min-width", 280),
        minHeight: floatingPanelApi.readCssLength("--mg-panel-min-height", 280),
        collapsedHeight: floatingPanelApi.readCssLength("--mg-panel-chrome-height", 42),
        openOnLoad: true,
        edgeResizeThreshold: floatingPanelApi.readCssLength("--mg-panel-edge-hit", 14),
        touchAffordanceVisibleMs: floatingPanelApi.readCssNumber("--mg-panel-touch-affordance-ms", 1400),
        viewportMargin: floatingPanelApi.readCssLength("--mg-panel-viewport-margin", 8),
      },
    });

    controlGroups.forEach((group) => {
      group.forEach((control) => {
        bindSlider(control.id, control.getValue(), control.format, control.onChange);
      });
    });

    function handleKeyDown(event) {
      if (event.ctrlKey && (event.key === "." || event.code === "Period")) {
        panel.setOpen(!panel.isOpen());
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return {
      ...panel,
      destroy() {
        document.removeEventListener("keydown", handleKeyDown);
        panel.destroy();
      },
    };
  }

  window.MakerGalaxyDevPanel = {
    createMakerGalaxyDevPanel,
  };
})();
