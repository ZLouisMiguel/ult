import { createInitialState, validateMove, applyMove } from "./engine.js";
import { getComputerMove } from "./computer.js";
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
} from "./ui.js";

let state = createInitialState();
let isVsComputer = false;
let computerTimer = null;

function handleMove(boardIdx, cellIdx) {
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

  if (isVsComputer && state.currentPlayer === "O") {
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
  if (computerTimer != null) {
    clearTimeout(computerTimer);
    computerTimer = null;
    setThinking(false);
  }
}


function startGame(vsComputer) {
  isVsComputer = vsComputer;
  resetGame();
  showGame();
}


function resetGame() {
  cancelComputerMove();
  resetUI();
  state = createInitialState();
  initBoard(handleMove);
  renderState(state);
}

function goToMenu() {
  cancelComputerMove();
  resetUI();
  showLanding();
}

bindEvents({
  onMenuSelect: startGame,
  onRestart: resetGame,
  onBack: goToMenu
})
