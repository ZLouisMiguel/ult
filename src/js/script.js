import { createInitialState, validateMove, applyMove } from "./engine.js";
import { getComputerMove } from "./computer.js";
import { RemotePlayer } from "./remote.js";
import {
  initBoard,
  renderState,
  showInvalidMove,
  setThinking,
  showEndModal,
  showGame,
  showLanding,
  resetUI,
  bindEvents,
  showLobby,
  hideLobby,
  setPlayerSymbol,
  showConnectionStatus,
} from "./ui.js";

let state = createInitialState();
let mode = "local";
let mySymbol = "X";
let computerTimer = null;
let remote = null;

function handleMove(boardIdx, cellIdx) {
  if (mode === "online") {
    if (state.currentPlayer !== mySymbol) {
      showInvalidMove("It's not your turn");
      return;
    }
    const { valid, reason } = validateMove(state, boardIdx, cellIdx);
    if (!valid) {
      showInvalidMove(reason);
      return;
    }
    remote.sendMove(boardIdx, cellIdx);
    return;
  }

  const { valid, reason } = validateMove(state, boardIdx, cellIdx);
  if (!valid) {
    showInvalidMove(reason);
    return;
  }

  state = applyMove(state, boardIdx, cellIdx);
  renderState(state);

  if (!state.gameActive) {
    showEndModal(state);
    return;
  }

  if (mode === "computer" && state.currentPlayer === "O") {
    scheduleComputerMove();
  }
}

function scheduleComputerMove() {
  setThinking(true);
  computerTimer = setTimeout(() => {
    computerTimer = null;
    setThinking(false);
    const move = getComputerMove(state);
    handleMove(move.bIdx, move.cIdx);
  }, 600);
}

function cancelComputerMove() {
  if (computerTimer !== null) {
    clearTimeout(computerTimer);
    computerTimer = null;
    setThinking(false);
  }
}

async function startOnline(action, roomId = null) {
  mode = "online";
  remote = new RemotePlayer();

  remote.onWaiting = (id) => {
    showConnectionStatus(`Room created — share code: ${id}`);
  };

  remote.onGameStart = (initialState, symbol) => {
    mySymbol = symbol;
    state = initialState;
    hideLobby();
    showGame();
    setPlayerSymbol(symbol);
    initBoard(handleMove);
    renderState(state);
  };

  remote.onStateUpdate = (newState) => {
    state = newState;
    renderState(state);
    if (!state.gameActive) showEndModal(state);
  };

  remote.onInvalidMove = (reason) => showInvalidMove(reason);

  remote.onOpponentLeft = () => {
    showInvalidMove("Opponent disconnected");
    showConnectionStatus("Opponent left the game");
  };

  remote.onError = (reason) => showInvalidMove(reason);

  try {
    await remote.connect();
    showConnectionStatus("Connecting...");

    if (action === "create") remote.sendCreate();
    else if (action === "join") remote.sendJoin(roomId);
    else if (action === "match") remote.sendMatchmake();
  } catch {
    showInvalidMove("Could not connect to server");
    mode = "local";
  }
}

function startGame(selectedMode, roomId = null) {
  mode = selectedMode;

  if (mode === "online-create") return startOnline("create");
  if (mode === "online-join") return startOnline("join", roomId);
  if (mode === "online-match") return startOnline("match");

  resetGame();
  showGame();
}

function resetGame() {
  cancelComputerMove();
  if (remote) {
    remote.disconnect();
    remote = null;
  }
  resetUI();
  mySymbol = "X";
  state = createInitialState();
  initBoard(handleMove);
  renderState(state);
}

function goToMenu() {
  cancelComputerMove();
  if (remote) {
    remote.disconnect();
    remote = null;
  }
  resetUI();
  hideLobby();
  showLanding();
}

bindOnlineEvents({
  onModeSelect: startGame,
  onJoinCode: (code) => startGame("online-join", code),
  onBackLobby: goToMenu,
});

document.getElementById("btn-back").addEventListener("click", goToMenu);
document.getElementById("btn-restart").addEventListener("click", resetGame);
document
  .getElementById("modal-restart-btn")
  .addEventListener("click", resetGame);
document.getElementById("modal-menu-btn").addEventListener("click", goToMenu);
