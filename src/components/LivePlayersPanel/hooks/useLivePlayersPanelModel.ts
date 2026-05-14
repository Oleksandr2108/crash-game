import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../../../stores/useGameStore";
import {
  buildPlayersFromPayload,
  normalizePlayersCount,
} from "../lib/livePlayers";
import type { LivePlayersPanelModel } from "../types";

export function useLivePlayersPanelModel(): LivePlayersPanelModel {
  const { playersCount, livePlayers, phase } = useGameStore(
    useShallow((s) => ({
      playersCount: s.players,
      livePlayers: s.livePlayers,
      phase: s.phase,
    })),
  );

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
