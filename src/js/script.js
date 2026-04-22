const gameState = {
  currentPlayer: "X",
  boards: Array.from({ length: 9 }, () => Array(9).fill("")),
  mainBoard: Array(9).fill(""),
  activeBoardIndex: -1,
  gameActive: true,
  isVsComputer: false,
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardContainer = document.getElementById("ultimate-board");
const modal = document.getElementById("gameEndModal");
const modalTitle = document.querySelector("#gameEndModal h1");
const restartButton = document.querySelector("#gameEndModal button");
const menuButtons = document.querySelectorAll(".next-controls button");
const backBtn = document.getElementById("btn-back");
const landingPage = document.getElementById("landing");
const appPage = document.getElementById("app");

function getWinner(boardArray) {
  for (let comb of winningCombinations) {
    let [a, b, c] = comb;
    if (
      boardArray[a] &&
      boardArray[a] == boardArray[b] &&
      boardArray[a] == boardArray[c]
    ) {
      return boardArray[a];
    }
  }

  return boardArray.every((cell) => cell !== "") ? "Draw" : null;
}

function initBoard() {
  boardContainer.innerHTML = "";
  for (let b = 0; b < 9; b++) {
    const smallBoardDiv = document.createElement("div");
    smallBoardDiv.classList.add("small-board");
    smallBoardDiv.dataset.boardId = b;

    for (let c = 0; c < 9; c++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.addEventListener("click", () => {
        handleClick(b, c, cellDiv, smallBoardDiv);
      });
      smallBoardDiv.appendChild(cellDiv);
    }
    boardContainer.appendChild(smallBoardDiv);
  }
}

function handleClick(boardIdx, cellIdx, cellEl, boardEl) {
  if (!gameState.gameActive) return;
  if (gameState.boards[boardIdx][cellIdx] !== "") return;
  if (
    gameState.activeBoardIndex !== -1 &&
    gameState.activeBoardIndex !== boardIdx
  )
    return;

  gameState.boards[boardIdx][cellIdx] = gameState.currentPlayer;
  cellEl.textContent = gameState.currentPlayer;

  if (gameState.mainBoard[boardIdx] === "") {
    const localResult = getWinner(gameState.boards[boardIdx]);
    if (localResult && localResult !== "Draw") {
      gameState.mainBoard[boardIdx] = localResult;
      boardEl.classList.add(localResult == "X" ? "won-x" : "won-o");
    } else if (localResult === "Draw") {
      gameState.mainBoard[boardIdx] = "D";
      boardEl.classList.add("won-draw");
    }
  }

  if (gameState.mainBoard[cellIdx] != "") {
    gameState.activeBoardIndex = -1;
  } else {
    gameState.activeBoardIndex = cellIdx;
  }

  const globalResult = getWinner(gameState.mainBoard);
  if (globalResult) {
    gameState.gameActive = false;
    modalTitle.textContent =
      globalResult === "Draw"
        ? "It's a draw =/"
        : `Player ${globalResult} wins the match`;
    modal.classList.remove("hidden");
    return;
  }

  gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
  updateActiveBoardUI();

  if (
    gameState.gameActive &&
    gameState.isVsComputer &&
    gameState.currentPlayer === "O"
  ) {
    boardContainer.style.pointerEvents = "none";

    setTimeout(() => {
      const move = getBestMove();
      const boardEl = document.querySelector(`[data-board-id="${move.bIdx}"]`);
      const cellEl = boardEl.children[move.cIdx];
      boardContainer.style.pointerEvents = "auto";
      handleClick(move.bIdx, move.cIdx, cellEl, boardEl);
    }, 1800);
  }
}

function updateActiveBoardUI() {
  document.querySelectorAll(".small-board").forEach((board, idx) => {
    board.classList.remove("active-board");
    if (
      gameState.activeBoardIndex === idx ||
      gameState.activeBoardIndex === -1
    ) {
      if (gameState.mainBoard[idx] === "") board.classList.add("active-board");
    }
  });
}

function resetGame() {
  gameState.currentPlayer = "X";
  gameState.mainBoard.fill("");
  gameState.boards = Array.from({ length: 9 }, () => Array(9).fill(""));
  gameState.activeBoardIndex = -1;
  gameState.gameActive = true;
  initBoard();
  updateActiveBoardUI();
  modal.classList.add("hidden");
}

function getBestMove() {
  const legalBoards =
    gameState.activeBoardIndex === -1
      ? gameState.mainBoard
          .map((status, idx) => (status === "" ? idx : null))
          .filter((v) => v != null)
      : [gameState.activeBoardIndex];

  for (let bIdx of legalBoards) {
    for (let cIdx = 0; cIdx < 9; cIdx++) {
      if (gameState.boards[bIdx][cIdx] === "") {
        const tempBoard = [...gameState.boards[bIdx]];
        tempBoard[cIdx] = "O";
        if (getWinner(tempBoard) === "O") return { bIdx, cIdx };
      }
    }
  }

  for (let bIdx of legalBoards) {
    for (let cIdx = 0; cIdx < 9; cIdx++) {
      if (gameState.boards[bIdx][cIdx] === "") {
        const tempBoard = [...gameState.boards[bIdx]];
        tempBoard[cIdx] = "X";
        if (getWinner(tempBoard) === "X") return { bIdx, cIdx };
      }
    }
  }

  const allMoves = [];
  legalBoards.forEach((bIdx) => {
    gameState.boards[bIdx].forEach((cell, cIdx) => {
      if (cell === "") allMoves.push({ bIdx, cIdx });
    });
  });

  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    gameState.isVsComputer = btn.textContent.toLowerCase().includes("computer");
    landingPage.classList.add("hidden");
    appPage.classList.remove("hidden");
    resetGame();
  });
});

backBtn.addEventListener("click", () => {
  landingPage.classList.remove("hidden");
  appPage.classList.add("hidden");
});

restartButton.addEventListener("click", resetGame);

initBoard();
updateActiveBoardUI();
