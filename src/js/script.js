const gameState = {
  currentPlayer: "X",
  board: Array(9).fill(""),
  gameActive: true,
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

const cells = Array.from(document.querySelectorAll(".cell"));
const modal = document.getElementById("gameEndModal");
const modalTitle = document.querySelector("#gameEndModal h1");
const restartButton = document.querySelector("#gameEndModal button");
const appDiv = document.getElementById("app");

function updateUI() {
  cells.forEach((cell, index) => {
    cell.textContent = gameState.board[index];
  });
}

function resetGame() {
  gameState.board.fill("");
  gameState.currentPlayer = "X";
  gameState.gameActive = true;
  updateUI();
  modal.classList.add("hidden");
}

function checkGameStatus() {
  let winner = null;

  for (let comb of winningCombinations) {
    const [a, b, c] = comb;
    const valA = gameState.board[a];
    const valB = gameState.board[b];
    const valC = gameState.board[c];

    if (valA && valA == valB && valA == valC) {
      winner = valA;
      break;
    }
  }

  if(winner) {
    gameState.gameActive = false;
    modalTitle.textContent = `Player ${winner} wins! :)`;
    modal.classList.remove("hidden");
    return;
  }

  const isDraw = gameState.board.every(cell => cell !== "");
  if(isDraw) {
    gameState.gameActive = false;
    modalTitle.textContent = `It's a draw! ¬_¬`;
    modal.classList.remove("hidden");
    return;
  }
}

const cellClick = (cell) => {
  if (cell.textContent == "X" || cell.textContent == "O") return;
  cell.textContent = gameState.currentPlayer;
  gameState.currentPlayer = gameState.currentPlayer == "X" ? "O" : "X";
};

cells.forEach((cell) => {
  cell.addEventListener("click", () => cellClick(cell));
});
