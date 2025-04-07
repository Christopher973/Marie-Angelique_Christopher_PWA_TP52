// Fonctions de conversion de température
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function fahrenheitToKelvin(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9 + 273.15;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}

// Fonction de conversion principale
function convertTemperature() {
  const fromUnit = document.getElementById("fromUnit").value;
  const toUnit = document.getElementById("toUnit").value;
  const inputValue = parseFloat(document.getElementById("temperature").value);
  const resultElement = document.getElementById("result");

  if (isNaN(inputValue)) {
    resultElement.textContent = "Veuillez entrer une valeur numérique valide.";
    return;
  }

  let result;
  let fromSymbol, toSymbol;

  // Définir les symboles pour les unités
  switch (fromUnit) {
    case "celsius":
      fromSymbol = "°C";
      break;
    case "fahrenheit":
      fromSymbol = "°F";
      break;
    case "kelvin":
      fromSymbol = "K";
      break;
  }

  switch (toUnit) {
    case "celsius":
      toSymbol = "°C";
      break;
    case "fahrenheit":
      toSymbol = "°F";
      break;
    case "kelvin":
      toSymbol = "K";
      break;
  }

  // Si les unités sont identiques, pas besoin de conversion
  if (fromUnit === toUnit) {
    result = inputValue;
  } else {
    // Effectuer la conversion appropriée
    switch (fromUnit) {
      case "celsius":
        result =
          toUnit === "fahrenheit"
            ? celsiusToFahrenheit(inputValue)
            : celsiusToKelvin(inputValue);
        break;
      case "fahrenheit":
        result =
          toUnit === "celsius"
            ? fahrenheitToCelsius(inputValue)
            : fahrenheitToKelvin(inputValue);
        break;
      case "kelvin":
        result =
          toUnit === "celsius"
            ? kelvinToCelsius(inputValue)
            : kelvinToFahrenheit(inputValue);
        break;
    }
  }

  // Afficher le résultat arrondi à 2 décimales
  resultElement.textContent = `${inputValue} ${fromSymbol} = ${result.toFixed(
    2
  )} ${toSymbol}`;
}

// Event listener pour le bouton de conversion
document.addEventListener("DOMContentLoaded", function () {
  const convertButton = document.getElementById("convertBtn");
  if (convertButton) {
    convertButton.addEventListener("click", convertTemperature);
  }
});

// Variables pour l'installation de la PWA
let deferredPrompt;
const installBanner = document.getElementById("install-banner");
const installButton = document.getElementById("install-button");
const closeBanner = document.getElementById("close-banner");
let installRefusals = parseInt(localStorage.getItem("installRefusals") || "0");

// Vérification si l'application est en mode standalone (installée)
const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone ||
  document.referrer.includes("android-app://");

// Appliquer une couleur de fond différente si l'app est en mode installé
if (isInStandaloneMode()) {
  document.body.classList.add("installed-pwa");
}

// Gérer l'événement beforeinstallprompt (déclenché quand l'app est installable)
window.addEventListener("beforeinstallprompt", (e) => {
  // Empêcher Chrome d'afficher automatiquement l'invite d'installation
  e.preventDefault();

  // Stocker l'événement pour l'utiliser plus tard
  deferredPrompt = e;

  // Afficher le bandeau d'installation seulement si pas trop de refus
  if (installRefusals < 5) {
    installBanner.style.display = "flex";
  }
});

// Gestionnaire pour le bouton d'installation
installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  // Afficher l'invite d'installation
  deferredPrompt.prompt();

  // Attendre que l'utilisateur réponde à l'invite
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`Résultat de l'installation: ${outcome}`);

  // Réinitialiser l'événement diferré - il ne peut être utilisé qu'une fois
  deferredPrompt = null;

  // Cacher le bandeau d'installation
  installBanner.style.display = "none";

  // Si l'utilisateur a refusé, incrémenter le compteur de refus
  if (outcome === "dismissed") {
    installRefusals++;
    localStorage.setItem("installRefusals", installRefusals.toString());
  }
});

// Gestionnaire pour le bouton "Plus tard"
closeBanner.addEventListener("click", () => {
  installBanner.style.display = "none";
  installRefusals++;
  localStorage.setItem("installRefusals", installRefusals.toString());
});

// Écouter les changements de mode d'affichage
window
  .matchMedia("(display-mode: standalone)")
  .addEventListener("change", (e) => {
    if (e.matches) {
      // L'application vient d'être installée
      document.body.classList.add("installed-pwa");
    }
  });
