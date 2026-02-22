export enum GameMode {
  CLASSIC = 'CLASSIC',
  TIME = 'TIME'
}

export interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
}

export interface GameState {
  grid: Block[][];
  target: number;
  score: number;
  selectedIds: string[];
  isGameOver: boolean;
  mode: GameMode;
  timeLeft?: number;
}
