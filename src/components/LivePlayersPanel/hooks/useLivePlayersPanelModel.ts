import { useMemo } from "react";
import { useGameStore } from "../../../stores/useGameStore";
import {
  buildPlayersFromPayload,
  normalizePlayersCount,
} from "../lib/livePlayers";
import type { LivePlayersPanelModel } from "../types";

export function useLivePlayersPanelModel(): LivePlayersPanelModel {
  const playersCount = useGameStore((s) => s.players);
  const livePlayers = useGameStore((s) => s.livePlayers);
  const phase = useGameStore((s) => s.phase);

  const safePlayersCount = normalizePlayersCount(playersCount);

  const players = useMemo(
    () => buildPlayersFromPayload(livePlayers),
    [livePlayers],
  );

  return {
    players,
    playersCount: safePlayersCount,
    phase,
  };
}
