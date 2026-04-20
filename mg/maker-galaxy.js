// maker-galaxy.js
//
// Small bootstrap that composes the reusable floating panel shell,
// the Maker Galaxy scene module, and the Maker Galaxy dev panel module.

(function () {
  if (!window.MakerGalaxyScene) {
    console.error(
      "[MakerGalaxy] MakerGalaxyScene is not available. Load maker-galaxy-scene.js before maker-galaxy.js."
    );
    return;
  }

  if (!window.MakerGalaxyDevPanel) {
    console.error(
      "[MakerGalaxy] MakerGalaxyDevPanel is not available. Load maker-galaxy-panel.js before maker-galaxy.js."
    );
    return;
  }

  if (!window.MakerGalaxyToolsPanel) {
    console.error(
      "[MakerGalaxy] MakerGalaxyToolsPanel is not available. Load maker-galaxy-tools-panel.js before maker-galaxy.js."
    );
    return;
  }

  const heroSection = document.getElementById("mg-hero");
  const canvas = document.getElementById("mg-galaxy-canvas");
  const titleEl = document.getElementById("mg-title");
  const taglineEl = document.getElementById("mg-tagline");

  const sceneApi = window.MakerGalaxyScene.createMakerGalaxyScene({
    heroSection,
    canvas,
    titleEl,
    taglineEl,
    title: "Maker Galaxy",
    tagline: "Where makers, tools, and ideas orbit together.",
  });

  if (!sceneApi) {
    return;
  }

  window.MakerGalaxyDevPanel.createMakerGalaxyDevPanel(sceneApi);
  window.MakerGalaxyToolsPanel.createMakerGalaxyToolsPanel(sceneApi);
})();
