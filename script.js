// 앱 메인 로직

// ─── 상태 ────────────────────────────────────────────────────────
let currentChordIndex = 0;
let currentChordRoot = "C";
let currentRoot = "C";
let currentScale = "Major";
let currentFavIndex = 0;
let favorites = new Set(JSON.parse(localStorage.getItem("guitar-favorites") || "[]"));

// ─── 초기화 ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupChordList();
  setupScaleControls();
  renderChordView();
  renderScale();
  renderFavoritesList();
  updateFavTabLabel();
});

// ─── 탭 ──────────────────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });
}

// ─── 코드 탭 ─────────────────────────────────────────────────────
function chordRoot(chord) {
  return chord.name.match(/^[A-G][#b]?/)[0];
}

function filteredChords() {
  return CHORDS.filter(c => chordRoot(c) === currentChordRoot);
}

function setupChordList() {
  const container = document.getElementById("chord-filter-btns");
  ROOT_NOTES.forEach(root => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (root === currentChordRoot ? " active" : "");
    btn.dataset.root = root;
    btn.textContent = root;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentChordRoot = root;
      currentChordIndex = 0;
      renderChordList();
      renderChordView();
    });
    container.appendChild(btn);
  });
  renderChordList();
}

function renderChordList() {
  const list = document.getElementById("chord-list");
  const chords = filteredChords();
  list.innerHTML = chords.map((chord, i) => {
    const typeDef = CHORD_TYPES[chord.category];
    const isFav = favorites.has(chord.name);
    return `
    <div class="chord-list-item${i === currentChordIndex ? " active" : ""}" data-index="${i}">
      <div class="chord-list-info">
        <div class="chord-list-top">
          <span class="chord-list-name">${chord.name}</span>
          <span class="chord-list-type">${typeDef ? typeDef.label : ""}</span>
        </div>
        <span class="chord-list-notes">${chord.notes.join(" · ")}</span>
      </div>
      <button class="fav-btn${isFav ? " active" : ""}" data-name="${chord.name}" title="즐겨찾기">★</button>
    </div>
  `;
  }).join("");

  list.querySelectorAll(".chord-list-item").forEach(item => {
    item.querySelector(".chord-list-info").addEventListener("click", () => {
      currentChordIndex = parseInt(item.dataset.index);
      list.querySelectorAll(".chord-list-item").forEach(b => b.classList.remove("active"));
      item.classList.add("active");
      renderChordView();
    });
    item.querySelector(".fav-btn").addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(e.currentTarget.dataset.name);
    });
  });
}

function renderChordView() {
  const chords = filteredChords();
  if (chords.length === 0) return;
  const chord = chords[currentChordIndex] || chords[0];

  // 헤더 정보
  document.getElementById("chord-view-name").textContent = chord.name;
  document.getElementById("chord-view-notes").textContent =
    chord.notes.join("  ·  ");

  // 범례
  renderChordLegend(chord);

  // 지판
  const positions = getChordFretPositions(chord.notes, 21);
  document.getElementById("chord-fretboard").innerHTML =
    renderFretboard(positions, 21, true);
}

function renderChordLegend(chord, containerId = "chord-legend") {
  const container = document.getElementById(containerId);
  const colors = ["#f5a623", "#4caf50", "#4a9eff", "#ce93d8", "#ffca28", "#ef5350"];
  const typeDef = CHORD_TYPES[chord.category];
  const degrees = typeDef ? typeDef.degrees : chord.notes.map((_, i) => ["R","3","5","♭7","9","11"][i] || "");
  container.innerHTML = chord.notes.map((note, i) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${colors[i] || colors[colors.length - 1]}"></div>
      <span>${note} <span style="color:#555">(${degrees[i] || ""})</span></span>
    </div>
  `).join("");
}

// ─── 즐겨찾기 ─────────────────────────────────────────────────────
function toggleFavorite(chordName) {
  if (favorites.has(chordName)) {
    favorites.delete(chordName);
  } else {
    favorites.add(chordName);
  }
  localStorage.setItem("guitar-favorites", JSON.stringify([...favorites]));
  renderChordList();
  renderFavoritesList();
  updateFavTabLabel();
}

function updateFavTabLabel() {
  const btn = document.querySelector('.tab-btn[data-tab="favorites"]');
  if (btn) btn.textContent = favorites.size > 0 ? `즐겨찾기 (${favorites.size})` : "즐겨찾기";
}

function renderFavoritesList() {
  const list = document.getElementById("fav-list");
  const favChords = CHORDS.filter(c => favorites.has(c.name));

  if (favChords.length === 0) {
    list.innerHTML = '<p class="fav-empty">★ 버튼으로<br>코드를 추가하세요</p>';
    ["fav-view-name", "fav-view-notes"].forEach(id => document.getElementById(id).textContent = "");
    document.getElementById("fav-legend").innerHTML = "";
    document.getElementById("fav-fretboard").innerHTML = "";
    return;
  }

  if (currentFavIndex >= favChords.length) currentFavIndex = 0;

  list.innerHTML = favChords.map((chord, i) => {
    const typeDef = CHORD_TYPES[chord.category];
    return `
    <div class="chord-list-item${i === currentFavIndex ? " active" : ""}" data-index="${i}">
      <div class="chord-list-info">
        <div class="chord-list-top">
          <span class="chord-list-name">${chord.name}</span>
          <span class="chord-list-type">${typeDef ? typeDef.label : ""}</span>
        </div>
        <span class="chord-list-notes">${chord.notes.join(" · ")}</span>
      </div>
      <button class="fav-btn active" data-name="${chord.name}" title="제거">★</button>
    </div>
    `;
  }).join("");

  list.querySelectorAll(".chord-list-item").forEach(item => {
    item.querySelector(".chord-list-info").addEventListener("click", () => {
      currentFavIndex = parseInt(item.dataset.index);
      list.querySelectorAll(".chord-list-item").forEach(b => b.classList.remove("active"));
      item.classList.add("active");
      renderFavoritesView(favChords);
    });
    item.querySelector(".fav-btn").addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(e.currentTarget.dataset.name);
    });
  });

  renderFavoritesView(favChords);
}

function renderFavoritesView(favChords) {
  const chord = favChords[currentFavIndex] || favChords[0];
  document.getElementById("fav-view-name").textContent = chord.name;
  document.getElementById("fav-view-notes").textContent = chord.notes.join("  ·  ");
  renderChordLegend(chord, "fav-legend");
  const positions = getChordFretPositions(chord.notes, 21);
  document.getElementById("fav-fretboard").innerHTML = renderFretboard(positions, 21, true);
}

// ─── 스케일 탭 ───────────────────────────────────────────────────
function setupScaleControls() {
  const rootContainer = document.getElementById("root-buttons");
  ROOT_NOTES.forEach(root => {
    const btn = document.createElement("button");
    btn.className = "root-btn" + (root === currentRoot ? " active" : "");
    btn.textContent = root;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".root-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentRoot = root;
      renderScale();
    });
    rootContainer.appendChild(btn);
  });

  const scaleContainer = document.getElementById("scale-buttons");
  Object.entries(SCALE_INTERVALS).forEach(([key, val]) => {
    const btn = document.createElement("button");
    btn.className = "scale-type-btn" + (key === currentScale ? " active" : "");
    btn.textContent = `${key}  (${val.label})`;
    btn.dataset.scale = key;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".scale-type-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentScale = key;
      renderScale();
    });
    scaleContainer.appendChild(btn);
  });
}

function renderScale() {
  const positions = getScaleFretPositions(currentRoot, currentScale, 21);
  const notes = getScaleNotes(currentRoot, currentScale);

  document.getElementById("scale-notes-display").textContent =
    `${currentRoot} ${currentScale}  =  ${notes.join("  ·  ")}`;

  document.getElementById("scale-fretboard").innerHTML =
    renderScaleFretboard(positions, 21);
}
