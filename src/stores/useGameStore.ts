import { create } from "zustand";
import type { MyBet, Phase } from "../types/Events";
import type {
  LivePlayerPayload,
  RecentResponse,
  ResentItem,
} from "../entities/model/types";

const areSameLivePlayer = (a: LivePlayerPayload, b: LivePlayerPayload) => {
  return (
    Object.is(a.username, b.username) &&
    Object.is(a.amount, b.amount) &&
    Object.is(a.status, b.status) &&
    Object.is(a.multiplier, b.multiplier)
  );
};

const areLivePlayersEqual = (
  prev: LivePlayerPayload[],
  next: LivePlayerPayload[],
) => {
  if (prev === next) return true;
  if (prev.length !== next.length) return false;

  for (let i = 0; i < prev.length; i += 1) {
    if (!areSameLivePlayer(prev[i], next[i])) {
      return false;
    }
  }

  return true;
};

export type ConnectionStatus = "connected" | "disconnected" | "error";
export type BetOutcome =
  | { type: "cashedOut"; profit: number }
  | { type: "lost"; crashPoint: number };

interface GameState {
  betAmount: number;
  betActionInFlight: boolean;
  betError: string | null;
  betOutcome: BetOutcome | null;
  balance: number;
  roundId: string | null;
  autoCashout: number | null;
  connectionStatus: ConnectionStatus;
  recentRounds: ResentItem[];
  livePlayers: LivePlayerPayload[];

  phase: Phase;
  multiplier: number;
  crashPoint: number | null;
  startedAt: Date | null;
  endsAt: Date | null;
  myBet: MyBet | null;
  players: number;

  setRecentRounds: (data: RecentResponse) => void;
  setPhase: (p: Phase) => void;
  setStartedAt: (d: Date | null) => void;
  setEndsAt: (d: Date | null) => void;
  setMultiplier: (m: number) => void;
  setCrashPoint: (n: number | null) => void;
  setMyBet: (b: MyBet | null) => void;
  setPlayers: (n: number) => void;
  setLivePlayers: (players: LivePlayerPayload[]) => void;
  setBetAmount: (amount: number) => void;
  setBetActionInFlight: (value: boolean) => void;
  setBetError: (message: string | null) => void;
  setBetOutcome: (outcome: BetOutcome | null) => void;
  setRoundId: (id: string) => void;
  halfBet: () => void;
  doubleBet: () => void;
  maxBet: () => void;
  setBalance: (balance: number) => void;
  setAutoCashout: (amount: number | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  onGameStart: () => void;
  onMultiplierUpdate: (multiplier: number) => void;
  onGameCrash: (crashPoint: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  betAmount: 10,
  betActionInFlight: false,
  betError: null,
  betOutcome: null,
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
  players: 0,
  livePlayers: [],
  recentRounds: [],

  setRecentRounds: (data) =>
    set((state) => {
      const next = data.rounds;
      if (
        state.recentRounds.length === next.length &&
        state.recentRounds.every((r, i) => r.roundId === next[i]?.roundId)
      ) {
        return state;
      }
      return { recentRounds: next };
    }),

  setRoundId: (id) => set({ roundId: id }),
  setAutoCashout: (amount) => set({ autoCashout: amount }),
  setBetAmount: (amount) => set({ betAmount: amount }),
  setBetActionInFlight: (value) => set({ betActionInFlight: value }),
  setBetError: (message) => set({ betError: message }),
  setBetOutcome: (outcome) => set({ betOutcome: outcome }),
  halfBet: () =>
    set((state) => ({ betAmount: Math.floor(state.betAmount / 2) })),
  doubleBet: () => set((state) => ({ betAmount: state.betAmount * 2 })),
  maxBet: () => set((state) => ({ betAmount: state.balance })),
  setBalance: (balance) =>
    set((state) => (state.balance === balance ? state : { balance })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  onGameStart: () => set({ phase: "running", multiplier: 1, crashPoint: null }),
  onMultiplierUpdate: (multiplier) => set({ multiplier }),
  onGameCrash: (crashPoint) => set({ phase: "crashed", crashPoint }),
  setPhase: (phase) => set({ phase }),
  setStartedAt: (startedAt) => set({ startedAt }),
  setEndsAt: (endsAt) => set({ endsAt }),
  setMultiplier: (multiplier) => set({ multiplier }),
  setCrashPoint: (crashPoint) => set({ crashPoint }),
  setMyBet: (myBet) => set({ myBet }),
  setPlayers: (players) => set({ players }),
  setLivePlayers: (livePlayers) =>
    set((state) => {
      if (areLivePlayersEqual(state.livePlayers, livePlayers)) {
        return state;
      }

      return { livePlayers };
    }),
}));
