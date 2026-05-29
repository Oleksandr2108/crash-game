import type { Phase } from "../../types/Events";

export type PlayerRow = {
  id: string;
  name: string;
  amount: number;
  accentClass: string;
  initial: string;
  status: string;
  multiplier: number | null;
};

export type ResultBadge = {
  text: string;
  className: string;
};

export type LivePlayersPanelModel = {
  players: PlayerRow[];
  playersCount: number;
  phase: Phase;
};
