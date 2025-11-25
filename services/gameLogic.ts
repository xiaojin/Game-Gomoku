import { BOARD_SIZE, WIN_COUNT } from '../constants';
import { BoardState, Coordinates, Player } from '../types';

export const createEmptyBoard = (): BoardState => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(Player.None));
};

export const checkWin = (board: BoardState, lastMove: Coordinates, player: Player): Coordinates[] | null => {
  const { row, col } = lastMove;
  const directions = [
    { dr: 0, dc: 1 },  // Horizontal
    { dr: 1, dc: 0 },  // Vertical
    { dr: 1, dc: 1 },  // Diagonal \
    { dr: 1, dc: -1 }, // Diagonal /
  ];

  for (const { dr, dc } of directions) {
    let count = 1;
    const winningLine: Coordinates[] = [{ row, col }];

    // Check forward
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
      count++;
      winningLine.push({ row: r, col: c });
    }

    // Check backward
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
      count++;
      winningLine.push({ row: r, col: c });
    }

    if (count >= WIN_COUNT) {
      return winningLine;
    }
  }

  return null;
};

export const isBoardFull = (board: BoardState): boolean => {
  return board.every(row => row.every(cell => cell !== Player.None));
};