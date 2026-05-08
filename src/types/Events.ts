export type Phase = "waiting" | "running" | "crashed";

export interface MyBet {
  betId?: string;
  amount: number;
  autoCashOutAt: number | null;
  status: "placed" | "cashedOut" | "lost";
}

export interface RoundStateEvent {
  phase: Phase;
  roundId: string;
  startedAt: string | null;
  endsAt: string | null;
  currentMultiplier: number;
  crashPoint: number | null;
  yourBet: MyBet | null;
  players: number;
}

export interface RoundStartEvent {
  roundId: string;
  startedAt: string;
  players: number;
}

export interface RoundWaitingEvent {
  roundId: string;
  endsAt: string;
  players: number;
}

export interface RoundTickEvent {
  roundId: string;
  multiplier: number;
  elapsedMs: number;
}

export interface RoundCrashEvent {
  roundId: string;
  crashPoint: number;
  tier: "low" | "mid" | "high";
  players: number;
}

export interface BetPlacedEvent {
  betId: string;
  roundId: string;
  amount: number;
  autoCashOutAt: number | null;
  balance: number;
}

export interface BetCashedOutEvent {
  betId: string;
  multiplier: number;
  winAmount: number;
  profit: number;
  balance: number;
}

export interface BetLostEvent {
  betId: string;
  crashPoint: number;
  balance: number;
}
