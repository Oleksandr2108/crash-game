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
  players: unknown;
}

export interface RoundStartEvent {
  roundId: string;
  startedAt: string;
  players: unknown;
}

export interface RoundWaitingEvent {
  roundId: string;
  endsAt: string;
  players: unknown;
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
  players: unknown;
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

export interface BetRejectedEvent {
  reason:
    | "betting_closed"
    | "already_has_bet"
    | "no_active_bet"
    | "not_running"
    | "insufficient_balance"
    | "invalid_auto_cashout"
    | "invalid_payload";
  message: string;
}
