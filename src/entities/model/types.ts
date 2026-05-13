export interface BalanceResponse {
  balance: number;
}

export interface BonusClaimResponse {
  claimed: boolean;
  amount: number;
  balance: number;
  claimedAt: string;
  nextClaimAt: string;
  retryAfterMs: number;
}

export interface LivePlayerPayload {
  username?: unknown;
  amount?: unknown;
  status?: unknown;
  multiplier?: unknown;
}

export type Tier = "low" | "mid" | "high";

export interface ResentItem {
  roundId: string;
  crashPoint: number;
  crashedAt: string;
  tier: Tier;
}

export interface RecentResponse {
  rounds: ResentItem[];
}
