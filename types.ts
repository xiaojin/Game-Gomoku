export enum Player {
  None = 0,
  Black = 1, // Human
  White = 2, // AI
}

export interface Coordinates {
  row: number;
  col: number;
}

export type BoardState = Player[][];

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  lastMove: Coordinates | null;
  isAiThinking: boolean;
  gameActive: boolean;
  winningLine: Coordinates[] | null;
}