import { useMemo } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useGameStore } from "../../../stores/useGameStore";
import {
  buildPlayers,
  buildPlayersFromPayload,
  toSafeNumber,
} from "../lib/livePlayers";
import type { LivePlayersPanelModel, LivePlayerPayload } from "../types";

export function useLivePlayersPanelModel(): LivePlayersPanelModel {
  const rawPlayers = useGameStore((s) => s.players as unknown);
  const phase = useGameStore((s) => s.phase);
  const myName = useAuthStore((s) => s.apiKey);

  const payloadPlayers = useMemo(
    () =>
      Array.isArray(rawPlayers) ? (rawPlayers as LivePlayerPayload[]) : [],
    [rawPlayers],
  );

  const playersCount = Array.isArray(rawPlayers)
    ? rawPlayers.length
    : toSafeNumber(rawPlayers, 0);

  const players = useMemo(
    () =>
      payloadPlayers.length > 0
        ? buildPlayersFromPayload(payloadPlayers)
        : buildPlayers(playersCount, myName),
    [playersCount, myName, payloadPlayers],
  );

  return {
    players,
    playersCount,
    phase,
  };
}
