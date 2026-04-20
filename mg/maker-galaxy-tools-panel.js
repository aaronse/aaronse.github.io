(function () {
  const floatingPanelApi = window.MakerGalaxyFloatingPanel;

  if (!floatingPanelApi) {
    console.error(
      "[MakerGalaxy] MakerGalaxyFloatingPanel is not available. Load floating-panel.js before maker-galaxy-tools-panel.js."
    );
    return;
  }

  const VIEW_PRESETS = {
    default: {
      label: "Default View",
      pose: { x: 0, y: -120, z: 340, targetY: 15 },
    },
    core: {
      label: "Core Focus",
      pose: { x: 0, y: -28, z: 210, targetY: 0 },
    },
    orbit: {
      label: "Wide Orbit",
      pose: { x: 165, y: -140, z: 470, targetY: 26 },
    },
    overhead: {
      label: "Overhead Scan",
      pose: { x: 0, y: 230, z: 255, targetY: 0 },
    },
  };

  function formatSignedNumber(value) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(0)}`;
  }

  function createToolsContent() {
    const content = document.createElement("div");
    content.className = "mg-tools-panel-content";
    content.innerHTML = `
      <section class="mg-tools-section">
        <div class="mg-tools-heading">Views</div>
        <div class="mg-tools-grid">
          <button type="button" class="mg-tools-button" data-tools-action="view-default">Default View</button>
          <button type="button" class="mg-tools-button" data-tools-action="view-core">Core Focus</button>
          <button type="button" class="mg-tools-button" data-tools-action="view-orbit">Wide Orbit</button>
          <button type="button" class="mg-tools-button" data-tools-action="view-overhead">Overhead Scan</button>
        </div>
      </section>
      <section class="mg-tools-section">
        <div class="mg-tools-heading">Scene</div>
        <div class="mg-tools-stack">
          <button type="button" class="mg-tools-button mg-tools-button-wide" data-tools-action="toggle-motion"></button>
          <button type="button" class="mg-tools-button mg-tools-button-wide" data-tools-action="rebuild-galaxy">Rebuild Galaxy Disc</button>
        </div>
      </section>
      <section class="mg-tools-section mg-tools-status">
        <div class="mg-tools-heading">Status</div>
        <div class="mg-tools-status-row">
          <span class="mg-tools-status-label">Camera</span>
          <span class="mg-tools-status-value" data-status="camera"></span>
        </div>
        <div class="mg-tools-status-row">
          <span class="mg-tools-status-label">Target Y</span>
          <span class="mg-tools-status-value" data-status="target"></span>
        </div>
        <div class="mg-tools-status-row">
          <span class="mg-tools-status-label">Motion</span>
          <span class="mg-tools-status-value" data-status="motion"></span>
        </div>
        <div class="mg-tools-status-row">
          <span class="mg-tools-status-label">Rotation</span>
          <span class="mg-tools-status-value" data-status="rotation"></span>
        </div>
      </section>
    `;
    return content;
  }

  function createMakerGalaxyToolsPanel(sceneApi) {
    const content = createToolsContent();
    const panel = floatingPanelApi.createFloatingPanel({
      id: "mg-galaxy-tools-panel",
      className: "mg-galaxy-tools-panel",
      title: "Quick Actions",
      hint: "(Ctrl+,)",
      content,
      config: {
        initialTop: floatingPanelApi.readCssLength("--mg-tools-panel-top", 12),
        initialLeft: floatingPanelApi.readCssLength("--mg-tools-panel-left", 356),
        initialWidth: floatingPanelApi.readCssLength("--mg-tools-panel-width", 290),
        initialHeight: floatingPanelApi.readCssLength("--mg-tools-panel-height", 286),
        minWidth: floatingPanelApi.readCssLength("--mg-tools-panel-min-width", 260),
        minHeight: floatingPanelApi.readCssLength("--mg-tools-panel-min-height", 220),
        collapsedHeight: floatingPanelApi.readCssLength("--mg-panel-chrome-height", 42),
        openOnLoad: false,
        edgeResizeThreshold: floatingPanelApi.readCssLength("--mg-panel-edge-hit", 14),
        touchAffordanceVisibleMs: floatingPanelApi.readCssNumber("--mg-panel-touch-affordance-ms", 1400),
        viewportMargin: floatingPanelApi.readCssLength("--mg-panel-viewport-margin", 8),
      },
    });

    const motionButton = content.querySelector('[data-tools-action="toggle-motion"]');
    const cameraStatus = content.querySelector('[data-status="camera"]');
    const targetStatus = content.querySelector('[data-status="target"]');
    const motionStatus = content.querySelector('[data-status="motion"]');
    const rotationStatus = content.querySelector('[data-status="rotation"]');
    let statusFrameId = 0;
    let destroyed = false;

    function applyViewPreset(name) {
      const preset = VIEW_PRESETS[name];
      if (!preset) {
        return;
      }

      sceneApi.setCameraPose(preset.pose);
      updateStatus();
    }

    function updateStatus() {
      const pose = sceneApi.getCameraPose();
      const paused = sceneApi.isMotionPaused();

      if (cameraStatus) {
        cameraStatus.textContent = `${formatSignedNumber(pose.x)} ${formatSignedNumber(
          pose.y
        )} ${formatSignedNumber(pose.z)}`;
      }

      if (targetStatus) {
        targetStatus.textContent = formatSignedNumber(pose.targetY);
      }

      if (motionStatus) {
        motionStatus.textContent = paused ? "Paused" : "Running";
      }

      if (rotationStatus) {
        rotationStatus.textContent = sceneApi.getRotationSpeed().toFixed(2);
      }

      if (motionButton) {
        motionButton.textContent = paused ? "Resume Motion" : "Pause Motion";
        motionButton.classList.toggle("is-active", paused);
      }
    }

    function tickStatus() {
      if (destroyed) {
        return;
      }

      if (panel.isOpen()) {
        updateStatus();
      }

      statusFrameId = window.requestAnimationFrame(tickStatus);
    }

    function handleContentClick(event) {
      const button = event.target.closest("[data-tools-action]");
      if (!button) {
        return;
      }

      const action = button.dataset.toolsAction || "";
      if (action.startsWith("view-")) {
        applyViewPreset(action.slice(5));
        return;
      }

      if (action === "toggle-motion") {
        sceneApi.setMotionPaused(!sceneApi.isMotionPaused());
        updateStatus();
        return;
      }

      if (action === "rebuild-galaxy") {
        sceneApi.rebuildGalaxyDisc();
        updateStatus();
      }
    }

    function handleKeyDown(event) {
      if (!event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === "," || event.code === "Comma") {
        event.preventDefault();
        panel.setOpen(!panel.isOpen());
        updateStatus();
      }
    }

    content.addEventListener("click", handleContentClick);
    document.addEventListener("keydown", handleKeyDown);
    updateStatus();
    tickStatus();

    return {
      ...panel,
      updateStatus,
      destroy() {
        destroyed = true;
        if (statusFrameId) {
          window.cancelAnimationFrame(statusFrameId);
        }
        content.removeEventListener("click", handleContentClick);
        document.removeEventListener("keydown", handleKeyDown);
        panel.destroy();
      },
    };
  }

  window.MakerGalaxyToolsPanel = {
    createMakerGalaxyToolsPanel,
  };
})();
