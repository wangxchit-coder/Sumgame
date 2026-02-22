import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, GameMode } from '../types';
import { GRID_ROWS, GRID_COLS, INITIAL_ROWS, MIN_TARGET, MAX_TARGET, TIME_LIMIT } from '../constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomValue = () => Math.floor(Math.random() * 9) + 1;

export const useGameLogic = (mode: GameMode | null) => {
  const [grid, setGrid] = useState<Block[][]>([]);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [history, setHistory] = useState<{ grid: Block[][], target: number, score: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveHistory = useCallback(() => {
    setHistory(prev => {
      const newState = { grid: JSON.parse(JSON.stringify(grid)), target, score };
      return [newState, ...prev].slice(0, 10); // Keep last 10 moves
    });
  }, [grid, target, score]);

  const undo = () => {
    if (history.length === 0 || isGameOver) return;
    const lastState = history[0];
    setGrid(lastState.grid);
    setTarget(lastState.target);
    setScore(lastState.score);
    setSelectedIds([]);
    setHistory(prev => prev.slice(1));
    if (mode === GameMode.TIME) setTimeLeft(TIME_LIMIT);
  };

  const generateTarget = useCallback(() => {
    setTarget(Math.floor(Math.random() * (MAX_TARGET - MIN_TARGET + 1)) + MIN_TARGET);
  }, []);

  const addNewRow = useCallback(() => {
    setGrid((prev) => {
      // Check if the top row (index 0) has any blocks
      if (prev.length > 0 && prev[0].some(b => b !== null)) {
        setIsGameOver(true);
        setGameOverReason('方块已堆积至顶部');
        return prev;
      }

      // Create a new row for the bottom
      const newRow: (Block | null)[] = Array.from({ length: GRID_COLS }, (_, col) => ({
        id: generateId(),
        value: getRandomValue(),
        row: GRID_ROWS - 1,
        col
      }));

      // Shift all existing rows up by 1
      // We take rows from index 1 to end, and add the new row at the end
      const shiftedGrid = prev.slice(1).map((row, rIdx) => 
        row.map(block => block ? { ...block, row: rIdx } : null)
      );

      // Add the new row at the bottom
      const finalGrid = [...shiftedGrid, newRow as Block[]];
      
      return finalGrid;
    });
  }, []);

  const initGame = useCallback(() => {
    const initialGrid: Block[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
    
    // Fill bottom rows
    for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        initialGrid[r][c] = {
          id: generateId(),
          value: getRandomValue(),
          row: r,
          col: c
        };
      }
    }

    setGrid(initialGrid);
    setScore(0);
    setSelectedIds([]);
    setHistory([]);
    setIsGameOver(false);
    setGameOverReason(undefined);
    setTimeLeft(TIME_LIMIT);
    generateTarget();
  }, [generateTarget]);

  useEffect(() => {
    if (mode) {
      initGame();
    }
  }, [mode, initGame]);

  // Timer for Time Mode
  useEffect(() => {
    if (mode === GameMode.TIME && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setGameOverReason('时间已耗尽');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isGameOver]);

  const toggleSelect = (id: string) => {
    if (isGameOver) return;

    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      const newSelection = isSelected ? prev.filter(i => i !== id) : [...prev, id];
      
      // Calculate sum
      const sum = newSelection.reduce((acc, sid) => {
        const block = grid.flat().find(b => b?.id === sid);
        return acc + (block?.value || 0);
      }, 0);

      if (sum === target) {
        // Success!
        handleSuccess(newSelection);
        return [];
      } else if (sum > target) {
        // Exceeded target - clear selection
        return [];
      }

      return newSelection;
    });
  };

  const handleSuccess = (ids: string[]) => {
    saveHistory();
    setScore(prev => prev + ids.length * 10);
    
    setGrid(prev => {
      const nextGrid = prev.map(row => row.map(block => {
        if (block && ids.includes(block.id)) return null;
        return block;
      }));
      return nextGrid;
    });

    generateTarget();
    
    if (mode === GameMode.CLASSIC) {
      addNewRow();
    } else if (mode === GameMode.TIME) {
      setTimeLeft(TIME_LIMIT);
    }
  };

  return {
    grid,
    target,
    score,
    selectedIds,
    isGameOver,
    gameOverReason,
    timeLeft,
    canUndo: history.length > 0,
    toggleSelect,
    undo,
    initGame
  };
};
