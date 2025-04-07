module.exports = {
  globDirectory: "./", // Répertoire racine du projet
  globPatterns: [
    // Modèles de fichiers à mettre en cache
    "**/*.{html,css,js,json}",
    "manifest.json",
    "icons/*.png",
  ],
  swDest: "./sw.js", // Destination du service worker généré
  swSrc: "./sw-template.js", // Template source du service worker
  // Exclure les fichiers de configuration et de développement
  globIgnores: [
    "node_modules/**/*",
    "package.json",
    "package-lock.json",
    "workbox-config.js",
  ],
};
