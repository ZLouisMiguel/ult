const gameState = {
  currentPlayer: "X",
  boards: Array.from({ length: 9 }, () => Array(9).fill("")),
  mainBoard: Array(9).fill(""),
  activeBoardIndex: -1,
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

const boardContainer = document.getElementById("ultimate-board");
const modal = document.getElementById("gameEndModal");
const modalTitle = document.querySelector("#gameEndModal h1");
const restartButton = document.querySelector("#gameEndModal button");
const appDiv = document.getElementById("app");

function updateUI() {
  cells.forEach((cell, index) => {
    cell.textContent = gameState.board[index];
  });
}

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

  return boardArray.every((cell) => cell !== "") ? "Draw" : "null";
}

function initBoard() {
    boardContainer.innerHTML ="";
    for(let b = 0 ; b<9 ; b++) {
        const smallBoardDiv = document.createElement("div");
        smallBoardDiv.classList.add("small-board");
        smallBoardDiv.dataset.boardId = b;

        for(let c = 0 ; c < 9 ; c++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.addEventListener("click", ()=> {handleClick(b,c,cellDiv,smallBoardDiv)});
            smallBoardDiv.appendChild(cellDiv);
        }
        boardContainer.appendChild(smallBoardDiv);
    }
}