import {
  WINNING_COMBINATIONS,
  getWinner,
  applyMove,
  validateMove,
} from "./engine.js";

const MAX_DEPTH = 5;

function scoreLocalBoard(board, player) {
  const opponent = player === "O" ? "X" : "O";
  let score = 0;

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [board[a], board[b], board[c]];
    const mine = line.filter((v) => v === player).length;
    const theirs = line.filter((v) => v === opponent).length;

    if (theirs === 0) {
      if (mine === 2) score += 10;
      else if (mine === 1) score += 2;
      else score += 0.5;
    } else if (mine === 0) {
      if (theirs === 2) score -= 12;
      else if (theirs === 1) score -= 2;
    }
  }

  if (board[4] === player) score += 4;
  else if (board[4] === opponent) score -= 4;

  return score;
}

function scoreState(state) {
  let score = 0;
  const globalWeights = [3, 2, 3, 2, 4, 2, 3, 2, 3];

  for (let b = 0; b < 9; b++) {
    const globalCell = state.mainBoard[b];
    const weight = globalWeights[b];

    if (globalCell === "O") {
      score += 100 * weight;
    } else if (globalCell === "X") {
      score -= 100 * weight;
    } else if (globalCell === "") {
      score += scoreLocalBoard(state.boards[b], "O") * weight;
    }
  }

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const line = [state.mainBoard[a], state.mainBoard[b], state.mainBoard[c]];
    const mine = line.filter((v) => v === "O").length;
    const theirs = line.filter((v) => v === "X").length;
    const empty = line.filter((v) => v === "").length;

    if (theirs === 0 && (mine === 2) & (empty === 1)) score += 500;
    else if (mine === 0 && theirs === 2 && empty === 1) score -= 600;
  }

  return score;
}

function orderMoves(moves) {
  const centerCells = new Set([4]);
  const cornerCells = new Set([0, 2, 6, 8]);
  const centerBoards = new Set([4]);
  const cornerBoards = new Set([0, 2, 6, 8]);

  return [...moves].sort((a, b) => {
    const scoreMove = (m) => {
      let s = 0;
      if (centerBoards.has(m.bIdx)) s += 4;
      if (cornerBoards.has(m.bIdx)) s += 2;
      if (centerCells.has(m.cIdx)) s += 3;
      if (cornerCells.has(m.cIdx)) s += 1;
      return s;
    };
    return scoreMove(b) - scoreMove(a);
  });
}

function getLegalMoves(state) {
  const legalBoards =
    state.activeBoardIndex === -1
      ? state.mainBoard
          .map((status, idx) => (status === "" ? idx : null))
          .filter((v) => v !== null)
      : [state.activeBoardIndex];

  const moves = [];
  for (const bIdx of legalBoards) {
    for (let cIdx = 0; cIdx < 9; cIdx++) {
      if (state.boards[bIdx][cIdx] === "") {
        moves.push({ bIdx, cIdx });
      }
    }
  }
  return moves;
}

function minimax(state, depth, alpha, beta, isMaximising) {
  if (!state.gameActive) {
    if (state.winner === "O") return 1000 + depth;
    if (state.winner === "X") return -1000 - depth;
    return 0;
  }

  if (depth === 0) return scoreState(state);
  const moves = orderMoves(getLegalMoves(state));

  if (isMaximising) {
    let best = -Infinity;
    for (const { bIdx, cIdx } of moves) {
      const next = applyMove(state, bIdx, cIdx);
      const val = minimax(next, depth - 1, alpha, beta, false);
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const { bIdx, cIdx } of moves) {
      const next = applyMove(state, bIdx, cIdx);
      const val = minimax(next, depth - 1, alpha, beta, true);
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getComputerMove(state) {
  const moves = orderMoves(getLegalMoves(state));
  if (moves.length === 1) return moves[0];
  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const { bIdx, cIdx } of moves) {
    const next = applyMove(state, bIdx, cIdx);
    const score = minimax(next, MAX_DEPTH - 1, -Infinity, Infinity, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = { bIdx, cIdx };
    }
  }

  return bestMove;
}
