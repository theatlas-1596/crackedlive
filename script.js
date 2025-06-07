const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const soloWrapper = document.getElementById('solo-wrapper');
const multiWrapper = document.getElementById('multi-wrapper');

// 💡 LISTE DES JEUX à modifier dynamiquement
let games = [
  { name: "Clair Obscur: Expedition 33", img: "clairobscur.jpg", category: "solo", link: "https://gofile.io/d/95X0v1" },
  { name: "The Last of Us Remastered II", img: "tlou.png", category: "solo", link: "https://gofile.io/d/qBaj3l#" },
  { name: "Minecraft Java", img: "minecraft.png", category: "multi", link: "https://tlauncher.org/en/" },
  { name: "Combat", img: "combat.png", category: "multi", link: "#" },
  { name: "Ready Or Not", img: "ron.png", category: "solo", link: "https://gofile.io/d/llOxMv" },
  { name: "WINRAR ", img: "winrar.png", category: "solo", link: "https://www.win-rar.com/fileadmin/winrar-versions/winrar/winrar-x64-591fr.exe" }

  // ➕ Tu peux ajouter ici d'autres jeux librement
];

// 🧱 GÉNÉRATION DES CARTES
function generateCards() {
  soloWrapper.innerHTML = "";
  multiWrapper.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.category = game.category;
    card.dataset.name = game.name.toLowerCase();

    card.innerHTML = `
      <a href="${game.link}">
        <img src="images/${game.img}" alt="${game.name}">
        <p>${game.name}</p>
      </a>
    `;

    if (game.category === "solo") soloWrapper.appendChild(card);
    else if (game.category === "multi") multiWrapper.appendChild(card);
  });
}

// 🔎 FONCTION DE SIMILARITÉ (filtrage recherche)
function similarityScore(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 0;
  const idx = a.indexOf(b);
  return idx === -1 ? Infinity : idx;
}

// 🎯 MISE À JOUR AFFICHAGE EN TEMPS RÉEL
function updateDisplay() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const allCards = document.querySelectorAll('.card');

  allCards.forEach(card => {
    const name = card.dataset.name;
    const cat = card.dataset.category;
    const score = similarityScore(name, query);

    const catMatch = (category === "all" || cat === category);
    const searchMatch = (query === "" || score !== Infinity);

    if (catMatch && searchMatch) {
      card.classList.remove("hidden");
      card.dataset.score = score;
    } else {
      card.classList.add("hidden");
    }
  });

  ["solo-wrapper", "multi-wrapper"].forEach(id => {
    const wrapper = document.getElementById(id);
    const visible = Array.from(wrapper.querySelectorAll('.card:not(.hidden)'));
    visible.sort((a, b) => a.dataset.score - b.dataset.score);
    visible.forEach(card => wrapper.appendChild(card));
  });
}

// 📢 ÉCOUTEURS D'ÉVÉNEMENTS
searchInput.addEventListener("input", updateDisplay);
categoryFilter.addEventListener("change", updateDisplay);

// 🧩 INITIALISATION
generateCards();
updateDisplay();
