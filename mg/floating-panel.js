(function () {
  const PANEL_ACTIONS = {
    toggleCollapse: "toggle-collapse",
    resetLayout: "reset-layout",
    closePanel: "close-panel",
  };

  const PANEL_ICONS = {
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

  const PANEL_CURSOR_CLASSNAMES = [
    "resize-n",
    "resize-s",
    "resize-e",
    "resize-w",
    "resize-ne",
    "resize-nw",
    "resize-se",
    "resize-sw",
  ];

  const PANEL_EDGE_CURSORS = {
    n: "resize-n",
    s: "resize-s",
    e: "resize-e",
    w: "resize-w",
    ne: "resize-ne",
    nw: "resize-nw",
    se: "resize-se",
    sw: "resize-sw",
  };

  const PANEL_RESIZE_EDGES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  function readCssNumber(varName, fallback) {
    const styles = getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(varName).trim();
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function readCssLength(varName, fallback) {
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
    return Number.isFinite(resolvedWidth) ? resolvedWidth : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createActionButton(action, label, iconMarkup) {
    return `
      <button
        type="button"
        class="mg-panel-action"
        data-panel-action="${action}"
        aria-label="${label}"
        title="${label}"
      >
        ${iconMarkup}
      </button>
    `;
  }

  function createResizeHandleMarkup(edge) {
    return `
      <div class="mg-panel-resize-handle mg-panel-resize-handle-${edge}" data-panel-edge="${edge}"></div>
    `;
  }

  function appendPanelContent(bodyElement, content) {
    if (!content) {
      return;
    }

    if (typeof content === "string") {
      bodyElement.innerHTML = content;
      return;
    }

    bodyElement.appendChild(content);
  }

  function createFloatingPanel(options) {
    const config = {
      initialTop: 12,
      initialLeft: 12,
      initialWidth: 320,
      initialHeight: 520,
      minWidth: 280,
      minHeight: 280,
      collapsedHeight: 42,
      openOnLoad: true,
      edgeResizeThreshold: 14,
      touchAffordanceVisibleMs: 1400,
      viewportMargin: 8,
      ...options.config,
    };

    const labels = {
      title: options.title || "Panel",
      hint: options.hint || "",
      collapse: "Collapse panel",
      expand: "Expand panel",
      reset: "Reset panel position and size",
      close: "Close panel",
      ...options.labels,
    };

    const panel = document.createElement("section");
    panel.className = `mg-panel ${options.className || ""}`.trim();
    if (options.id) {
      panel.id = options.id;
    }

    panel.innerHTML = `
      <div class="mg-panel-surface">
        <div class="mg-panel-chrome">
          <div class="mg-panel-header">
            <span class="mg-panel-title">${labels.title}</span>
            ${labels.hint ? `<span class="mg-panel-hint">${labels.hint}</span>` : ""}
          </div>
          <div class="mg-panel-window-controls">
            ${createActionButton(PANEL_ACTIONS.toggleCollapse, labels.collapse, PANEL_ICONS.collapse)}
            ${createActionButton(PANEL_ACTIONS.resetLayout, labels.reset, PANEL_ICONS.reset)}
            ${createActionButton(PANEL_ACTIONS.closePanel, labels.close, PANEL_ICONS.close)}
          </div>
        </div>
        <div class="mg-panel-body"></div>
      </div>
      ${PANEL_RESIZE_EDGES.map(createResizeHandleMarkup).join("")}
    `;

    panel.style.top = `${config.initialTop}px`;
    panel.style.left = `${config.initialLeft}px`;
    panel.style.width = `${config.initialWidth}px`;
    panel.style.height = `${config.initialHeight}px`;
    panel.style.minWidth = `${config.minWidth}px`;
    panel.style.minHeight = `${config.minHeight}px`;

    const parent = options.parent || document.body;
    parent.appendChild(panel);

    const bodyElement = panel.querySelector(".mg-panel-body");
    appendPanelContent(bodyElement, options.content);

    const chromeElement = panel.querySelector(".mg-panel-chrome");
    const collapseButton = panel.querySelector(
      `[data-panel-action="${PANEL_ACTIONS.toggleCollapse}"]`
    );
    const resizeHandles = panel.querySelectorAll("[data-panel-edge]");
    const actionButtons = panel.querySelectorAll("[data-panel-action]");
    const resizeHandleListeners = [];
    const panelState = {
      drag: null,
      resize: null,
      hoverEdge: "",
      expandedHeight: config.initialHeight,
      affordanceTimer: null,
    };

    function isOpen() {
      return panel.classList.contains("open");
    }

    function isCollapsed() {
      return panel.classList.contains("is-collapsed");
    }

    function updateCollapseButtonUi() {
      if (!collapseButton) {
        return;
      }

      const collapsed = isCollapsed();
      const label = collapsed ? labels.expand : labels.collapse;
      collapseButton.classList.toggle("is-collapsed", collapsed);
      collapseButton.setAttribute("aria-label", label);
      collapseButton.setAttribute("title", label);
    }

    function clearResizeAffordanceTimer() {
      if (panelState.affordanceTimer) {
        window.clearTimeout(panelState.affordanceTimer);
        panelState.affordanceTimer = null;
      }
    }

    function removeCursorClasses() {
      PANEL_CURSOR_CLASSNAMES.forEach((className) => {
        panel.classList.remove(className);
      });
    }

    function applyCursor(edge) {
      removeCursorClasses();
      const className = PANEL_EDGE_CURSORS[edge];
      if (className) {
        panel.classList.add(className);
      }
    }

    function stopInteraction() {
      panelState.drag = null;
      panelState.resize = null;
      panel.classList.remove("is-dragging", "is-resizing");
      applyCursor(panelState.hoverEdge);
    }

    function resetTransientState() {
      clearResizeAffordanceTimer();
      panel.classList.remove("show-resize-affordance");
      panelState.hoverEdge = "";
      stopInteraction();
    }

    function showResizeAffordanceTemporarily(durationMs) {
      if (isCollapsed()) {
        return;
      }

      panel.classList.add("show-resize-affordance");
      clearResizeAffordanceTimer();
      panelState.affordanceTimer = window.setTimeout(() => {
        panel.classList.remove("show-resize-affordance");
        panelState.affordanceTimer = null;
      }, durationMs);
    }

    function getViewportBounds() {
      const margin = config.viewportMargin;
      return {
        minLeft: margin,
        minTop: margin,
        maxRight: window.innerWidth - margin,
        maxBottom: window.innerHeight - margin,
      };
    }

    function getResizeHandleEdge(target) {
      const handle = target.closest("[data-panel-edge]");
      return handle ? handle.dataset.panelEdge || "" : "";
    }

    function getResizeEdgeFromEvent(event) {
      if (isCollapsed()) {
        return "";
      }

      const handleEdge = getResizeHandleEdge(event.target);
      if (handleEdge) {
        return handleEdge;
      }

      const rect = panel.getBoundingClientRect();
      const threshold = config.edgeResizeThreshold;
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const nearLeft = offsetX >= 0 && offsetX <= threshold;
      const nearRight = offsetX >= rect.width - threshold && offsetX <= rect.width;
      const nearTop = offsetY >= 0 && offsetY <= threshold;
      const nearBottom = offsetY >= rect.height - threshold && offsetY <= rect.height;

      let edge = "";
      if (nearTop) {
        edge += "n";
      } else if (nearBottom) {
        edge += "s";
      }

      if (nearLeft) {
        edge += "w";
      } else if (nearRight) {
        edge += "e";
      }

      return edge;
    }

    function clampToViewport() {
      if (!isOpen()) {
        return;
      }

      const bounds = getViewportBounds();
      const minHeight = isCollapsed() ? config.collapsedHeight : config.minHeight;
      const maxWidth = Math.max(config.minWidth, bounds.maxRight - bounds.minLeft);
      const maxHeight = Math.max(minHeight, bounds.maxBottom - bounds.minTop);
      const width = clamp(panel.offsetWidth, config.minWidth, maxWidth);
      const height = clamp(panel.offsetHeight, minHeight, maxHeight);
      const left = clamp(panel.offsetLeft, bounds.minLeft, bounds.maxRight - width);
      const top = clamp(panel.offsetTop, bounds.minTop, bounds.maxBottom - height);

      panel.style.width = `${Math.round(width)}px`;
      panel.style.height = `${Math.round(height)}px`;
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;
    }

    function setOpen(nextOpen) {
      if (!nextOpen) {
        resetTransientState();
      }

      panel.classList.toggle("open", nextOpen);
      if (nextOpen) {
        clampToViewport();
      }
      updateCollapseButtonUi();
    }

    function setCollapsed(nextCollapsed) {
      if (nextCollapsed === isCollapsed()) {
        updateCollapseButtonUi();
        return;
      }

      if (nextCollapsed) {
        panelState.expandedHeight = panel.offsetHeight;
        panel.classList.add("is-collapsed");
        panel.style.minHeight = `${config.collapsedHeight}px`;
        panel.style.height = `${config.collapsedHeight}px`;
      } else {
        panel.classList.remove("is-collapsed");
        panel.style.minHeight = `${config.minHeight}px`;
        panel.style.height = `${Math.round(
          Math.max(panelState.expandedHeight, config.minHeight)
        )}px`;
        clampToViewport();
      }

      updateCollapseButtonUi();
    }

    function resetLayout() {
      resetTransientState();
      panel.classList.remove("is-collapsed");
      panel.style.top = `${config.initialTop}px`;
      panel.style.left = `${config.initialLeft}px`;
      panel.style.width = `${config.initialWidth}px`;
      panel.style.height = `${config.initialHeight}px`;
      panel.style.minWidth = `${config.minWidth}px`;
      panel.style.minHeight = `${config.minHeight}px`;
      panelState.expandedHeight = config.initialHeight;
      setOpen(true);
    }

    function startDrag(event) {
      panelState.drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: panel.offsetLeft,
        startTop: panel.offsetTop,
        width: panel.offsetWidth,
        height: panel.offsetHeight,
      };
      panel.classList.add("is-dragging");
    }

    function startResize(event, edge) {
      panelState.resize = {
        pointerId: event.pointerId,
        edge,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: panel.offsetLeft,
        startTop: panel.offsetTop,
        startWidth: panel.offsetWidth,
        startHeight: panel.offsetHeight,
      };
      panel.classList.add("is-resizing");
      applyCursor(edge);
    }

    function updateDrag(event) {
      if (!panelState.drag || panelState.drag.pointerId !== event.pointerId) {
        return;
      }

      const bounds = getViewportBounds();
      const nextLeft = clamp(
        panelState.drag.startLeft + (event.clientX - panelState.drag.startX),
        bounds.minLeft,
        bounds.maxRight - panelState.drag.width
      );
      const nextTop = clamp(
        panelState.drag.startTop + (event.clientY - panelState.drag.startY),
        bounds.minTop,
        bounds.maxBottom - panelState.drag.height
      );

      panel.style.left = `${Math.round(nextLeft)}px`;
      panel.style.top = `${Math.round(nextTop)}px`;
    }

    function updateResize(event) {
      if (!panelState.resize || panelState.resize.pointerId !== event.pointerId) {
        return;
      }

      const resize = panelState.resize;
      const bounds = getViewportBounds();
      const maxWidth = Math.max(config.minWidth, bounds.maxRight - bounds.minLeft);
      const minHeight = isCollapsed() ? config.collapsedHeight : config.minHeight;
      const maxHeight = Math.max(minHeight, bounds.maxBottom - bounds.minTop);

      let nextLeft = resize.startLeft;
      let nextTop = resize.startTop;
      let nextWidth = resize.startWidth;
      let nextHeight = resize.startHeight;
      const deltaX = event.clientX - resize.startX;
      const deltaY = event.clientY - resize.startY;

      if (resize.edge.includes("e")) {
        nextWidth = clamp(
          resize.startWidth + deltaX,
          config.minWidth,
          bounds.maxRight - resize.startLeft
        );
      }

      if (resize.edge.includes("s")) {
        nextHeight = clamp(
          resize.startHeight + deltaY,
          minHeight,
          bounds.maxBottom - resize.startTop
        );
      }

      if (resize.edge.includes("w")) {
        const maxLeft = resize.startLeft + resize.startWidth - config.minWidth;
        nextLeft = clamp(event.clientX, bounds.minLeft, maxLeft);
        nextWidth = clamp(
          resize.startWidth + (resize.startLeft - nextLeft),
          config.minWidth,
          maxWidth
        );
        nextLeft = resize.startLeft + resize.startWidth - nextWidth;
      }

      if (resize.edge.includes("n")) {
        const maxTop = resize.startTop + resize.startHeight - minHeight;
        nextTop = clamp(event.clientY, bounds.minTop, maxTop);
        nextHeight = clamp(
          resize.startHeight + (resize.startTop - nextTop),
          minHeight,
          maxHeight
        );
        nextTop = resize.startTop + resize.startHeight - nextHeight;
      }

      panel.style.left = `${Math.round(nextLeft)}px`;
      panel.style.top = `${Math.round(nextTop)}px`;
      panel.style.width = `${Math.round(nextWidth)}px`;
      panel.style.height = `${Math.round(nextHeight)}px`;
    }

    function handlePanelPointerMove(event) {
      if (panelState.drag || panelState.resize) {
        return;
      }
      if (isCollapsed()) {
        panelState.hoverEdge = "";
        removeCursorClasses();
        return;
      }

      const edge = getResizeEdgeFromEvent(event);
      panelState.hoverEdge = edge;
      applyCursor(edge);
    }

    function handlePanelPointerDown(event) {
      if (event.pointerType && event.pointerType !== "mouse") {
        showResizeAffordanceTemporarily(config.touchAffordanceVisibleMs);
      }
    }

    function handlePanelPointerLeave() {
      if (panelState.drag || panelState.resize) {
        return;
      }

      panelState.hoverEdge = "";
      removeCursorClasses();
    }

    function handleResizeStart(event) {
      if (event.button !== 0 || isCollapsed()) {
        return;
      }

      const edge = getResizeEdgeFromEvent(event);
      if (!edge) {
        return;
      }

      event.preventDefault();
      startResize(event, edge);
    }

    function handleChromePointerDown(event) {
      if (event.button !== 0) {
        return;
      }
      if (event.target.closest("[data-panel-action]")) {
        return;
      }
      if (getResizeEdgeFromEvent(event)) {
        return;
      }

      event.preventDefault();
      startDrag(event);
    }

    function handleActionClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const action = event.currentTarget.dataset.panelAction;
      if (action === PANEL_ACTIONS.toggleCollapse) {
        setCollapsed(!isCollapsed());
      } else if (action === PANEL_ACTIONS.resetLayout) {
        resetLayout();
      } else if (action === PANEL_ACTIONS.closePanel) {
        setOpen(false);
      }
    }

    function handleWindowPointerMove(event) {
      updateDrag(event);
      updateResize(event);
    }

    panel.addEventListener("pointermove", handlePanelPointerMove);
    panel.addEventListener("pointerdown", handlePanelPointerDown);
    panel.addEventListener("pointerleave", handlePanelPointerLeave);
    panel.addEventListener("pointerdown", handleResizeStart);
    resizeHandles.forEach((handle) => {
      const handlePointerDown = (event) => {
        if (event.button !== 0 || isCollapsed()) {
          return;
        }

        const edge = handle.dataset.panelEdge || "";
        if (!edge) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        startResize(event, edge);
      };

      resizeHandleListeners.push({ handle, listener: handlePointerDown });
      handle.addEventListener("pointerdown", handlePointerDown);
    });

    if (chromeElement) {
      chromeElement.addEventListener("pointerdown", handleChromePointerDown);
    }

    actionButtons.forEach((button) => {
      button.addEventListener("click", handleActionClick);
    });

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", stopInteraction);
    window.addEventListener("pointercancel", stopInteraction);
    window.addEventListener("resize", clampToViewport);

    if (config.openOnLoad) {
      setOpen(true);
    } else {
      updateCollapseButtonUi();
    }

    const panelApi = {
      element: panel,
      bodyElement,
      isOpen,
      isCollapsed,
      setOpen,
      setCollapsed,
      resetLayout,
      clampToViewport,
      destroy() {
        resetTransientState();
        panel.removeEventListener("pointermove", handlePanelPointerMove);
        panel.removeEventListener("pointerdown", handlePanelPointerDown);
        panel.removeEventListener("pointerleave", handlePanelPointerLeave);
        panel.removeEventListener("pointerdown", handleResizeStart);
        resizeHandleListeners.forEach(({ handle, listener }) => {
          handle.removeEventListener("pointerdown", listener);
        });
        if (chromeElement) {
          chromeElement.removeEventListener("pointerdown", handleChromePointerDown);
        }
        actionButtons.forEach((button) => {
          button.removeEventListener("click", handleActionClick);
        });
        window.removeEventListener("pointermove", handleWindowPointerMove);
        window.removeEventListener("pointerup", stopInteraction);
        window.removeEventListener("pointercancel", stopInteraction);
        window.removeEventListener("resize", clampToViewport);
        panel.remove();
      },
    };

    return panelApi;
  }

  window.MakerGalaxyFloatingPanel = {
    createFloatingPanel,
    readCssNumber,
    readCssLength,
  };
})();
