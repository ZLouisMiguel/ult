const LINE_LABELS = {
  "012": "the top row",
  345: "the middle row",
  678: "the bottom row",
  "036": "the left column",
  147: "the center column",
  258: "the right column",
  "048": "the main diagonal",
  246: "the anti-diagonal",
};

function describeWin(line) {
  if (!line) return "three in a row";
  return LINE_LABELS[line.join("")] ?? "three in a row";
}

const boardContainer = document.getElementById("ultimate-board");
const landingPage = document.getElementById("landing");
const appPage = document.getElementById("app");
const modal = document.getElementById("gameEndModal");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalRestartBtn = document.getElementById("modal-restart-btn");
const modalMenuBtn = document.getElementById("modal-menu-btn");
const currentPlayerEl = document.getElementById("current-player");
const turnIndicator = document.getElementById("turn-indicator");
const backBtn = document.getElementById("btn-back");
const restartBtn = document.getElementById("btn-restart");
const menuButtons = document.querySelectorAll(".next-controls button");
const toastEl = document.getElementById("toast");
const lobbyEl = document.getElementById("lobby");
const connectionStatusEl = document.getElementById("connection-status");
const btnJoinCode = document.getElementById("btn-join-code");
const roomCodeInput = document.getElementById("room-code-input");
const btnBackLobby = document.getElementById("btn-back-lobby");

let toastTimer = null;

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer);

  toastEl.textContent = message;
  toastEl.classList.remove("hidden", "fade-out");
  toastTimer = setTimeout(() => {
    toastEl.classList.add("fade-out");
    toastTimer = setTimeout(() => {
      toastEl.classList.add("hidden");
      toastEl.classList.remove("fade-out");
    }, 400);
  }, 1800);
}

function clearToast() {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  toastEl.classList.add("hidden");
  toastEl.classList.remove("fade-out");
}

export function initBoard(onMove) {
  boardContainer.innerHTML = "";
  for (let b = 0; b < 9; b++) {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("small-board");
    boardDiv.dataset.boardId = b;

    for (let c = 0; c < 9; c++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.addEventListener("click", () => onMove(b, c));
      boardDiv.appendChild(cellDiv);
    }

    boardContainer.appendChild(boardDiv);
  }
}

export function renderState(state) {
  document.querySelectorAll(".small-board").forEach((boardEl, b) => {
    boardEl.className = "small-board";

    const result = state.mainBoard[b];
    if (result === "X") boardEl.classList.add("won-x");
    else if (result === "O") boardEl.classList.add("won-o");
    else if (result === "D") boardEl.classList.add("won-draw");

    const isActive =
      state.activeBoardIndex === -1
        ? result === ""
        : state.activeBoardIndex === b;

    if (isActive && result === "") boardEl.classList.add("active-board");

    boardEl.querySelectorAll(".cell").forEach((cellEl, c) => {
      cellEl.textContent = state.boards[b][c];
    });
  });

  currentPlayerEl.textContent = state.currentPlayer;
  currentPlayerEl.className = state.currentPlayer === "X" ? "won-x" : "won-o";
}

export function showInvalidMove(reason) {
  showToast(reason);
}

export function setThinking(isThinking) {
  if (isThinking) {
    turnIndicator.classList.add("thinking");
    boardContainer.style.pointerEvents = "none";
  } else {
    turnIndicator.classList.remove("thinking");
    boardContainer.style.pointerEvents = "auto";
  }
}

export function showEndModal(state) {
  if (state.winner === "Draw") {
    modalTitle.textContent = "It's a draw!";
    modalTitle.className = "";
    modalSubtitle.textContent = "Every board has been contested — no winner.";
  } else {
    modalTitle.textContent = `Player ${state.winner} wins!`;
    modalTitle.className = state.winner === "X" ? "won-x" : "won-o";
    modalSubtitle.textContent = `They claimed ${describeWin(state.winningLine)} on the global board.`;
  }
  modal.classList.remove("hidden");
}

export function hideEndModal() {
  modal.classList.add("hidden");
}

export function showGame() {
  landingPage.classList.add("hidden");
  appPage.classList.remove("hidden");
}

export function showLanding() {
  landingPage.classList.remove("hidden");
  appPage.classList.add("hidden");
}

export function resetUI() {
  clearToast();
  hideEndModal();
  setThinking(false);
}

export function bindEvents({ onMenuSelect, onRestart, onBack }) {
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const vsComputer = btn.textContent.toLowerCase().includes("computer");
      onMenuSelect(vsComputer);
    });
  });

  restartBtn.addEventListener("click", onRestart);
  modalRestartBtn.addEventListener("click", onRestart);

  backBtn.addEventListener("click", onBack);
  modalMenuBtn.addEventListener("click", onBack);
}

export function showLobby() {
  lobbyEl.classList.remove("hidden");
}

export function hideLobby() {
  lobbyEl.classList.add("hidden");
}

export function showConnectionStatus(msg) {
  connectionStatusEl.textContent = msg;
  showLobby();
}

export function setPlayerSymbol(symbol) {
  const banner = document.createElement("div");
  banner.id = "symbol-banner";
  banner.innerHTML = `You are playing as <span class="${
    symbol === "X" ? "won-x" : "won-o"
  }">${symbol}</span>`;
  banner.style.cssText =
    "text-align:center;font-weight:800;font-size:1.1rem;margin-bottom:4px;";

  const existing = document.getElementById("symbol-banner");
  if (existing) existing.remove();
  appPage.insertBefore(banner, appPage.firstChild);
}

export function bindOnlineEvents({ onModeSelect, onJoinCode, onBackLobby }) {
  document.querySelectorAll(".next-controls button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.dataset.mode;
      if (m === "online-join") {
        showLobby();
        showConnectionStatus("Enter the room code from your friend");
      } else {
        onModeSelect(m);
      }
    });
  });

  btnJoinCode.addEventListener("click", () => {
    const code = roomCodeInput.value.trim();
    if (code.length === 4) onJoinCode(code);
  });

  roomCodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnJoinCode.click();
  });

  btnBackLobby.addEventListener("click", onBackLobby);
}
