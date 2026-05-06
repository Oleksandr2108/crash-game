import { create } from "zustand";

interface GameState {
  betAmount: number;
  balance: number;
  autoCashout: number | null;
  setBetAmount: (amount: number) => void;
  halfBetAmount: () => void;
  doubleBetAmount: () => void;
  maxBetAmount: () => void;
  setBalance: (balance: number) => void;
  setAutoCashout: (amount: number | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  betAmount: 0,
  balance: 0,
  autoCashout: null,
  setAutoCashout: (amount) => set({ autoCashout: amount }),
  setBetAmount: (amount) => set({ betAmount: amount }),
  halfBetAmount: () =>
    set((state) => ({ betAmount: Math.floor(state.betAmount / 2) })),
  doubleBetAmount: () => set((state) => ({ betAmount: state.betAmount * 2 })),
  maxBetAmount: () => set((state) => ({ betAmount: state.balance })),
  setBalance: (balance) => set({ balance }),

  
})

);
