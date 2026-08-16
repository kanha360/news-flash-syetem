const STORAGE_KEY = "news-flash-overlay-state";
const channel = new BroadcastChannel("news-flash-overlay-channel");

const defaultState = {
  flashes: [],
  selectedId: null,
  currentId: null,
  telecasting: false,
  timerId: null,
  location: "center",
};

let state = loadState();
let editingId = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { ...defaultState };
    }
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      flashes: Array.isArray(parsed.flashes) ? parsed.flashes : [],
    };
  } catch (error) {
    console.warn("Unable to read saved overlay state", error);
    return { ...defaultState };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  channel.postMessage({ type: "state-update", state });
}

function getCurrentFlash() {
  if (!state.flashes.length) {
    return null;
  }

  const current = state.flashes.find((flash) => flash.id === state.currentId);
  return current || state.flashes[0];
}

function createFlashFromForm() {
  const message = document.getElementById("messageInput").value.trim();
  const fontColor = document.getElementById("fontColorInput").value;
  const bgColor = document.getElementById("bgColorInput").value;
  const minLines = Number(document.getElementById("minLinesInput").value) || 1;
  const fontFamily = document.getElementById("fontFamilyInput").value;
  const fontSize = Number(document.getElementById("fontSizeInput").value) || 46;
  const frequency = Number(document.getElementById("frequencyInput").value) || 6;
  const location = document.getElementById("locationInput").value || "center";

  if (!message) {
    alert("Please enter a flash message.");
    return null;
  }

  return {
    id: crypto.randomUUID(),
    message,
    fontColor,
    bgColor,
    minLines,
    fontFamily,
    fontSize,
    frequency,
    location,
  };
}

function resetForm() {
  editingId = null;
  document.getElementById("flashForm").reset();
  document.getElementById("fontColorInput").value = "#ffffff";
  document.getElementById("bgColorInput").value = "#000000";
  document.getElementById("minLinesInput").value = "1";
  document.getElementById("fontSizeInput").value = "46";
  document.getElementById("fontFamilyInput").value = "Segoe UI";
  document.getElementById("frequencyInput").value = "6";
  document.getElementById("locationInput").value = "center";
}

function fillForm(flash) {
  editingId = flash.id;
  document.getElementById("messageInput").value = flash.message;
  document.getElementById("fontColorInput").value = flash.fontColor;
  document.getElementById("bgColorInput").value = flash.bgColor;
  document.getElementById("minLinesInput").value = flash.minLines;
  document.getElementById("fontFamilyInput").value = flash.fontFamily;
  document.getElementById("fontSizeInput").value = flash.fontSize;
  document.getElementById("frequencyInput").value = flash.frequency;
  document.getElementById("locationInput").value = flash.location || "center";
}

function renderFlashList() {
  const list = document.getElementById("flashList");
  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (!state.flashes.length) {
    list.innerHTML = '<li class="flash-item"><strong>No flashes yet</strong><small>Add one to start your queue.</small></li>';
    return;
  }

  state.flashes.forEach((flash) => {
    const item = document.createElement("li");
    item.className = `flash-item${state.selectedId === flash.id ? " active" : ""}`;
    item.innerHTML = `<strong>${escapeHtml(flash.message.slice(0, 42))}${flash.message.length > 42 ? "…" : ""}</strong><small>${flash.fontFamily} • ${flash.frequency}s • ${flash.minLines}+ lines</small>`;
    item.addEventListener("click", () => {
      state.selectedId = flash.id;
      persistState();
      renderAll();
    });
    list.appendChild(item);
  });
}

function renderPreview() {
  const previewBox = document.getElementById("previewBox");
  if (!previewBox) {
    return;
  }

  const flash = getCurrentFlash() || state.flashes.find((entry) => entry.id === state.selectedId) || null;
  if (!flash) {
    previewBox.innerHTML = "<div class='preview-placeholder'>Select or create a flash.</div>";
    return;
  }

  const displayText = buildDisplayText(flash);
  previewBox.innerHTML = "";
  const card = document.createElement("div");
  card.className = `overlay-card location-${flash.location || "center"}`;
  card.style.background = flash.bgColor;
  card.style.color = flash.fontColor;
  card.style.fontFamily = flash.fontFamily;
  card.style.fontSize = `${flash.fontSize}px`;
  card.innerHTML = `<div class="overlay-text">${displayText}</div>`;
  previewBox.appendChild(card);
}

function renderOverlay() {
  const overlayText = document.getElementById("overlayText");
  const overlayCard = document.getElementById("overlayCard");
  const overlayStage = document.getElementById("overlayStage");
  if (!overlayText || !overlayCard) {
    return;
  }

  const flash = getCurrentFlash();
  if (!flash) {
    overlayText.textContent = "No flash active";
    overlayCard.style.background = "rgba(0, 0, 0, 0.8)";
    overlayCard.style.color = "#ffffff";
    overlayCard.style.fontFamily = "Segoe UI";
    overlayCard.style.fontSize = "46px";
    overlayCard.className = "overlay-card location-center";
    if (overlayStage) {
      overlayStage.className = "overlay-stage location-center";
    }
    return;
  }

  const displayText = buildDisplayText(flash);
  overlayText.innerHTML = escapeHtml(displayText).replace(/\n/g, "<br>");
  overlayCard.style.background = flash.bgColor;
  overlayCard.style.color = flash.fontColor;
  overlayCard.style.fontFamily = flash.fontFamily;
  overlayCard.style.fontSize = `${flash.fontSize}px`;
  overlayCard.className = `overlay-card location-${flash.location || "center"}`;
  if (overlayStage) {
    overlayStage.className = `overlay-stage location-${flash.location || "center"}`;
  }
}

function buildDisplayText(flash) {
  const message = flash.message.trim();
  
  // If minimum lines is 1, return message as single line
  if (flash.minLines <= 1) {
    return message;
  }
  
  const chunkSize = Math.max(22, Math.ceil(message.length / Math.max(flash.minLines, 1)));
  const words = message.split(/(\s+)/).filter(Boolean);
  const lines = [];

  let currentLine = "";
  words.forEach((word) => {
    if ((currentLine + word).trim().length <= chunkSize) {
      currentLine += word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  while (lines.length < flash.minLines) {
    lines.push("");
  }

  return lines.join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStatus() {
  const badge = document.getElementById("statusBadge");
  if (!badge) {
    return;
  }

  badge.textContent = state.telecasting ? "Telecasting" : "Ready";
}

function renderAll() {
  renderFlashList();
  renderPreview();
  renderStatus();
  if (document.body.dataset.page === "overlay") {
    renderOverlay();
  }
}

function selectFlashById(id) {
  if (id) {
    state.selectedId = id;
  }
  if (!state.flashes.length) {
    state.currentId = null;
    return;
  }
  if (!state.currentId || !state.flashes.some((flash) => flash.id === state.currentId)) {
    state.currentId = state.flashes[0].id;
  }
  if (state.selectedId && !state.flashes.some((flash) => flash.id === state.selectedId)) {
    state.selectedId = state.flashes[0].id;
  }
}

function startTelecast() {
  if (!state.flashes.length) {
    alert("Add at least one flash before telecasting.");
    return;
  }

  state.telecasting = true;
  selectFlashById(state.currentId || state.flashes[0].id);
  persistState();
  renderAll();
  runCycle();
}

function stopTelecast() {
  state.telecasting = false;
  if (state.timerId) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
  persistState();
  renderAll();
}

function runCycle() {
  if (!state.telecasting || !state.flashes.length) {
    return;
  }

  if (state.timerId) {
    clearTimeout(state.timerId);
  }

  const flash = getCurrentFlash();
  if (!flash) {
    stopTelecast();
    return;
  }

  const nextIndex = (state.flashes.findIndex((entry) => entry.id === state.currentId) + 1) % state.flashes.length;
  const nextFlash = state.flashes[nextIndex];
  state.currentId = nextFlash.id;
  persistState();
  renderAll();

  state.timerId = setTimeout(runCycle, Math.max(2, nextFlash.frequency) * 1000);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const flash = createFlashFromForm();
  if (!flash) {
    return;
  }

  if (editingId) {
    state.flashes = state.flashes.map((entry) => (entry.id === editingId ? { ...entry, ...flash, id: entry.id } : entry));
  } else {
    state.flashes.push(flash);
    state.selectedId = flash.id;
  }

  state.currentId = state.currentId || flash.id;
  selectFlashById(flash.id);
  persistState();
  resetForm();
  renderAll();
}

function handleDeleteSelected() {
  if (!state.selectedId) {
    return;
  }

  state.flashes = state.flashes.filter((flash) => flash.id !== state.selectedId);
  if (!state.flashes.length) {
    state.selectedId = null;
    state.currentId = null;
    stopTelecast();
  } else {
    const fallback = state.flashes[0];
    state.selectedId = fallback.id;
    if (!state.flashes.some((flash) => flash.id === state.currentId)) {
      state.currentId = fallback.id;
    }
  }
  persistState();
  renderAll();
}

function handleModifySelected() {
  const selected = state.flashes.find((flash) => flash.id === state.selectedId);
  if (!selected) {
    return;
  }
  fillForm(selected);
}

function initializeControlPanel() {
  document.getElementById("flashForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("cancelEditBtn").addEventListener("click", resetForm);
  document.getElementById("deleteBtn").addEventListener("click", handleDeleteSelected);
  document.getElementById("modifyBtn").addEventListener("click", handleModifySelected);
  document.getElementById("openOverlayBtn").addEventListener("click", () => {
    window.open("overlay.html", "news-flash-overlay", "width=1400,height=900");
  });
  document.getElementById("telecastBtn").addEventListener("click", () => {
    if (state.telecasting) {
      stopTelecast();
      document.getElementById("telecastBtn").textContent = "Start Telecast";
    } else {
      startTelecast();
      document.getElementById("telecastBtn").textContent = "Stop Telecast";
    }
  });

  channel.addEventListener("message", (event) => {
    if (event.data?.type === "state-update") {
      state = event.data.state;
      renderAll();
      if (document.getElementById("telecastBtn")) {
        document.getElementById("telecastBtn").textContent = state.telecasting ? "Stop Telecast" : "Start Telecast";
      }
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      state = loadState();
      renderAll();
    }
  });

  resetForm();
  selectFlashById(state.selectedId);
  renderAll();
}

function initializeOverlay() {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      state = loadState();
      renderOverlay();
    }
  });

  channel.addEventListener("message", (event) => {
    if (event.data?.type === "state-update") {
      state = event.data.state;
      renderOverlay();
    }
  });

  state = loadState();
  renderOverlay();
}

if (document.body.dataset.page === "overlay") {
  initializeOverlay();
} else {
  initializeControlPanel();
}
