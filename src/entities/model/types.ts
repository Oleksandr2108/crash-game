export interface BalanceResponse {
  balance: number;
}

export type Tier = 'low' | 'mid' | 'high';

export interface ResentItem {
  roundId: string;
  crashPoint: number;
  crashedAt: string;
  tier: Tier;
}

export interface RecentResponse { 
  rounds: ResentItem[];
}