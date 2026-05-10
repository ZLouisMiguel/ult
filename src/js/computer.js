import { getWinner } from "./engine.js";

export function getComputerMove(state) {
  const legalBoards =
    state.activeBoardIndex === -1
      ? state.mainBoard
          .map((status, idx) => (status === "" ? idx : null))
          .filter((v) => v !== null)
      : [state.activeBoardIndex];

  for (let bIdx of legalBoards) {
    for (let cIdx = 0; cIdx < 9; cIdx++) {
      if (state.boards[bIdx][cIdx] === "") {
        const temp = [...state.boards[bIdx]];
        temp[cIdx] = "O";
        if (getWinner(temp) === "O") return { bIdx, cIdx };
      }
    }
  }

  for (let bIdx of legalBoards) {
    for (let cIdx = 0; cIdx < 9; cIdx++) {
      if (state.boards[bIdx][cIdx] === "") {
        const temp = [...state.boards[bIdx]];
        temp[cIdx] = "X";
        if (getWinner(temp) === "X") return { bIdx, cIdx };
      }
    }
  }

  const allMoves = [];
  legalBoards.forEach((bIdx) => {
    state.boards[bIdx].forEach((cell, cIdx) => {
      if (cell === "") allMoves.push({ bIdx, cIdx });
    });
  });

  return allMoves[Math.floor(Math.random() * allMoves.length)];
}
