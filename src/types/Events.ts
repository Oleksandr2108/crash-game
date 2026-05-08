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
  playerCount: number;
}

export interface RoundTickEvent {
  roundId: string;
  multiplier: number;
  elapsedMs: number;
}



export interface BetPlacedEvent {
  betId: string;
  roundId: string;
  amount: number;
  autoCashOutAt: number | null;
  balance: number;
}
