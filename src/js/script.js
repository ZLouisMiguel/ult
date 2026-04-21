const gameState = {
  currentPlayer: "X",
};

const cells = Array.from(document.querySelectorAll(".cell"));

cells.forEach((cell) => {
  cell.addEventListener("click", () => cellClick(cell));
});

const cellClick = (cell) => {
  if (cell.textContent == "X" || cell.textContent == "O") return;
  cell.textContent = gameState.currentPlayer;
  gameState.currentPlayer = gameState.currentPlayer == "X" ? "O" : "X";
};
