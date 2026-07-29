type Board = (string | null)[];

// Winning combinations for a 3x3 Tic Tac Toe board
export const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Check if there is a winner or draw
export const checkWinner = (board: Board): { winner: string | null; combo: number[] | null } => {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }

  // Check for draw (no empty cells)
  if (board.every(cell => cell !== null)) {
    return { winner: 'DRAW', combo: null };
  }

  return { winner: null, combo: null };
};

// Minimax algorithm to find the optimal move
const minimax = (
  board: Board,
  depth: number,
  isMax: boolean,
  aiSymbol: string,
  playerSymbol: string
): number => {
  const check = checkWinner(board);
  if (check.winner === aiSymbol) return 10 - depth;
  if (check.winner === playerSymbol) return depth - 10;
  if (check.winner === 'DRAW') return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        best = Math.max(best, minimax(board, depth + 1, false, aiSymbol, playerSymbol));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        best = Math.min(best, minimax(board, depth + 1, true, aiSymbol, playerSymbol));
        board[i] = null;
      }
    }
    return best;
  }
};

// Main entry point to find the AI's move
export const findBestMove = (
  board: Board,
  aiSymbol: 'X' | 'O',
  playerSymbol: 'X' | 'O',
  difficulty: 'EASY' | 'IMPOSSIBLE'
): number => {
  // Get all empty indexes
  const emptyIndexes: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) emptyIndexes.push(index);
  });

  if (emptyIndexes.length === 0) return -1;

  // 1. Easy Mode: Choose a random empty slot
  if (difficulty === 'EASY') {
    const randomIndex = Math.floor(Math.random() * emptyIndexes.length);
    return emptyIndexes[randomIndex];
  }

  // 2. Impossible Mode: Run Minimax
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = aiSymbol;
      const moveVal = minimax(board, 0, false, aiSymbol, playerSymbol);
      board[i] = null;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }

  return bestMove;
};
