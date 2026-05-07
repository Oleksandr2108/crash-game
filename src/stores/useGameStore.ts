import { create } from "zustand";

export type GamePhase = "waiting" | "running" | "crashed";

interface GameState {
  betAmount: number;
  balance: number;
  autoCashout: number | null;
  // game state from WebSocket
  phase: GamePhase;
  multiplier: number;
  crashPoint: number | null;
  setBetAmount: (amount: number) => void;
  halfBet: () => void;
  doubleBet: () => void;
  maxBet: () => void;
  setBalance: (balance: number) => void;
  setAutoCashout: (amount: number | null) => void;
  // WS event handlers
  onGameStart: () => void;
  onMultiplierUpdate: (multiplier: number) => void;
  onGameCrash: (crashPoint: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  betAmount: 0,
  balance: 0,
  autoCashout: null,
  phase: "waiting",
  multiplier: 1,
  crashPoint: null,
  setAutoCashout: (amount) => set({ autoCashout: amount }),
  setBetAmount: (amount) => set({ betAmount: amount }),
  halfBet: () =>
    set((state) => ({ betAmount: Math.floor(state.betAmount / 2) })),
  doubleBet: () => set((state) => ({ betAmount: state.betAmount * 2 })),
  maxBet: () => set((state) => ({ betAmount: state.balance })),
  setBalance: (balance) => set({ balance }),
  onGameStart: () => set({ phase: "running", multiplier: 1, crashPoint: null }),
  onMultiplierUpdate: (multiplier) => set({ multiplier }),
  onGameCrash: (crashPoint) => set({ phase: "crashed", crashPoint }),
}));
