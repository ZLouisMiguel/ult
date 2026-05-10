export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createInitialState() {
  return {
    currentPlayer: "X",
    boards: Array.from({ length: 9 }, () => Array(9).fill("")),
    mainBoard: Array(9).fill(""),
    activeBoardIndex: -1,
    gameActive: true,
  };
}

export function getWinner(boardArray) {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (
      boardArray[a] &&
      boardArray[b] === boardArray[a] &&
      boardArray[c] === boardArray[a]
    ) {
      return boardArray[a];
    }
  }

  return boardArray.every((cell) => cell !== "") ? "Draw" : null;
}

export function getWinningLine(boardArray) {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (
      boardArray[a] &&
      boardArray[b] === boardArray[a] &&
      boardArray[c] === boardArray[a]
    ) {
      return [a, b, c];
    }
  }

  return null;
}

export function validateMove(state, boardIdx, cellIdx) {
  if (!state.gameActive) return { valid: false, reason: "Game is not active" };
  if (state.mainBoard[boardIdx] !== "")
    return { valid: false, reason: "That board is already finished" };
  if (state.boards[boardIdx][cellIdx] !== "")
    return { valid: false, reason: "That cell is already taken" };
  if (state.activeBoardIndex !== -1 && state.activeBoardIndex !== boardIdx) {
    return { valid: false, reason: "You must play on the highlighted board" };
  }
  return { valid: true, reason: null };
}

export function applyMove(state, boardIdx, cellIdx) {
  const next = {
    ...state,
    boards: state.boards.map((board) => [...board]),
    mainBoard: [...state.mainBoard],
  };

  next.boards[boardIdx][cellIdx] = next.currentPlayer;

  const localResult = getWinner(next.boards[boardIdx]);
  if (localResult && localResult != "Draw") {
    next.mainBoard[boardIdx] = localResult;
  } else if (localResult === "Draw") {
    next.mainBoard[boardIdx] = "D";
  }

  next.activeBoardIndex = next.mainBoard[cellIdx] === "" ? cellIdx : -1;

  const globalResult = getWinner(next.mainBoard);
  if (globalResult && globalResult != "Draw") {
    next.gameActive = false;
    next.winner = globalResult;
    next.winningLine = getWinningLine(next.mainBoard);
  } else if (globalResult === "Draw") {
    next.gameActive = false;
    next.winner = "Draw";
    next.winningLine = "The game is a draw nobody one this one =/";
  } else {
    next.currentPlayer = next.currentPlayer === "X" ? "O" : "X";
  }

  return next;
}
