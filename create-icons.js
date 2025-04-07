const fs = require("fs");
const path = require("path");

// Créer le dossier icons s'il n'existe pas
const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
  console.log("Dossier icons créé");
}

// Créer des icônes simples pour les tests
// Note: Dans un environnement réel, vous remplaceriez cela par des vraies icônes

// Icône 192x192
const icon192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#3498db"/>
  <text x="50%" y="50%" font-family="Arial" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">TEMP</text>
</svg>`;

// Icône 512x512
const icon512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#3498db"/>
  <text x="50%" y="50%" font-family="Arial" font-size="72" fill="white" text-anchor="middle" dominant-baseline="middle">TEMP</text>
</svg>`;

// Enregistrer les icônes sous forme de fichiers SVG pour le moment
fs.writeFileSync(path.join(iconsDir, "icon-192x192.svg"), icon192);
fs.writeFileSync(path.join(iconsDir, "icon-512x512.svg"), icon512);

console.log("Icônes créées avec succès");
