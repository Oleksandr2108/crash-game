import { create } from "zustand";
import type { MyBet, Phase } from "../types/Events";

export type ConnectionStatus = "connected" | "disconnected" | "error";

interface GameState {
  betAmount: number;
  balance: number;
  roundId: string | null;
  autoCashout: number | null;
  connectionStatus: ConnectionStatus;

  phase: Phase;
  multiplier: number;
  crashPoint: number | null;
  startedAt: Date | null;
  endsAt: Date | null;
  myBet: MyBet | null;
  playerCount: number;

  setPhase: (p: Phase) => void;
  setStartedAt: (d: Date | null) => void;
  setEndsAt: (d: Date | null) => void;
  setMultiplier: (m: number) => void;
  setCrashPoint: (n: number | null) => void;
  setMyBet: (b: MyBet | null) => void;
  setPlayerCount: (n: number) => void;
  setBetAmount: (amount: number) => void;
  setRoundId: (id: string) => void;
  halfBet: () => void;
  doubleBet: () => void;
  maxBet: () => void;
  setBalance: (balance: number) => void;
  setAutoCashout: (amount: number | null) => void;
  setConnnectionStatus: (status: ConnectionStatus) => void;
  // WS event handlers
  onGameStart: () => void;
  onMultiplierUpdate: (multiplier: number) => void;
  onGameCrash: (crashPoint: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  betAmount: 0,
  balance: 0,
  roundId: null,
  autoCashout: null,
  connectionStatus: "disconnected",
  phase: "waiting",
  multiplier: 1,
  crashPoint: null,
  startedAt: null,
  endsAt: null,
  myBet: null,
  playerCount: 0,

  setRoundId: (id) => set({ roundId: id }),
  setAutoCashout: (amount) => set({ autoCashout: amount }),
  setBetAmount: (amount) => set({ betAmount: amount }),
  halfBet: () =>
    set((state) => ({ betAmount: Math.floor(state.betAmount / 2) })),
  doubleBet: () => set((state) => ({ betAmount: state.betAmount * 2 })),
  maxBet: () => set((state) => ({ betAmount: state.balance })),
  setBalance: (balance) => set({ balance }),
  setConnnectionStatus: (status) => set({ connectionStatus: status }),
  onGameStart: () => set({ phase: "running", multiplier: 1, crashPoint: null }),
  onMultiplierUpdate: (multiplier) => set({ multiplier }),
  onGameCrash: (crashPoint) => set({ phase: "crashed", crashPoint }),
  setPhase: (phase) => set({ phase }),
  setStartedAt: (startedAt) => set({ startedAt }),
  setEndsAt: (endsAt) => set({ endsAt }),
  setMultiplier: (multiplier) => set({ multiplier }),
  setCrashPoint: (crashPoint) => set({ crashPoint }),
  setMyBet: (myBet) => set({ myBet }),
  setPlayerCount: (playerCount) => set({ playerCount }),
}));
