import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../shared/api/socket";
import { useAuthStore } from "../../stores/useAuthStore";
import { useGameStore } from "../../stores/useGameStore";
import { gameKeys } from "../../entities/queries/gameKeys";
import type { LivePlayerPayload } from "../../entities/model/types";
import type {
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "../../types/Events";

export function useSocket() {
  const apiKey = useAuthStore((state) => state.apiKey);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!apiKey) return;
    const socket = getSocket();
    const g = useGameStore.getState;

    const normalizePlayersCount = (value: unknown) => {
      if (Array.isArray(value)) return value.length;
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (value && typeof value === "object") return 1;
      return 0;
    };

    const normalizeLivePlayers = (value: unknown): LivePlayerPayload[] => {
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is LivePlayerPayload =>
            !!item && typeof item === "object",
        );
      }

      if (value && typeof value === "object") {
        return [value as LivePlayerPayload];
      }

      return [];
    };

    const areSameLivePlayer = (
      a: LivePlayerPayload,
      b: LivePlayerPayload,
      includeOutcomeFields: boolean,
    ) => {
      if (
        !Object.is(a.username, b.username) ||
        !Object.is(a.amount, b.amount)
      ) {
        return false;
      }

      if (!includeOutcomeFields) {
        return true;
      }

      return (
        Object.is(a.status, b.status) && Object.is(a.multiplier, b.multiplier)
      );
    };

    const areLivePlayersEqual = (
      prev: LivePlayerPayload[],
      next: LivePlayerPayload[],
      includeOutcomeFields: boolean,
    ) => {
      if (prev === next) return true;
      if (prev.length !== next.length) return false;

      for (let i = 0; i < prev.length; i += 1) {
        if (!areSameLivePlayer(prev[i], next[i], includeOutcomeFields)) {
          return false;
        }
      }

      return true;
    };

    const applyRoundState = (state: {
      phase: "waiting" | "running" | "crashed";
      roundId: string;
      startedAt: Date | null;
      endsAt: Date | null;
      crashPoint: number | null;
      myBet: ReturnType<typeof g>["myBet"];
      players: unknown;
      multiplier?: number;
    }) => {
      const nextLivePlayers = normalizeLivePlayers(state.players);
      const prevLivePlayers = g().livePlayers;
      const includeOutcomeFields = state.phase === "crashed";

      const updates = {
        phase: state.phase,
        roundId: state.roundId,
        startedAt: state.startedAt,
        endsAt: state.endsAt,
        crashPoint: state.crashPoint,
        myBet: state.myBet,
        players: normalizePlayersCount(state.players),
        livePlayers: areLivePlayersEqual(
          prevLivePlayers,
          nextLivePlayers,
          includeOutcomeFields,
        )
          ? prevLivePlayers
          : nextLivePlayers,
        ...(typeof state.multiplier === "number"
          ? { multiplier: state.multiplier }
          : {}),
      };

      useGameStore.setState(updates);
    };

    const clearBetFlightState = () => {
      g().setBetActionInFlight(false);
    };

    const onConnect = () => g().setConnectionStatus("connected");
    const onDisconnect = () => g().setConnectionStatus("disconnected");
    const onConnectError = (err: Error) => {
      g().setConnectionStatus("error");
      console.error("WS Connection error:", err);
    };

    const onState = (e: RoundStateEvent) => {
      const current = g();
      if (
        e.phase === "running" &&
        current.phase === "running" &&
        current.roundId === e.roundId
      ) {
        return;
      }

      applyRoundState({
        phase: e.phase,
        roundId: e.roundId,
        multiplier: e.currentMultiplier,
        startedAt: e.startedAt ? new Date(e.startedAt) : null,
        endsAt: e.endsAt ? new Date(e.endsAt) : null,
        crashPoint: e.crashPoint,
        myBet: e.yourBet,
        players: e.players,
      });
    };

    const onStart = (e: RoundStartEvent) => {
      applyRoundState({
        phase: "running",
        roundId: e.roundId,
        startedAt: new Date(e.startedAt),
        endsAt: null,
        crashPoint: null,
        myBet: g().myBet,
        players: e.players,
        multiplier: 1,
      });
    };

    const onWaiting = (e: RoundWaitingEvent) => {
      applyRoundState({
        phase: "waiting",
        roundId: e.roundId,
        startedAt: null,
        endsAt: new Date(e.endsAt),
        crashPoint: null,
        myBet: null,
        players: e.players,
        multiplier: 1,
      });
      clearBetFlightState();
    };

    const onTick = (e: RoundTickEvent) => {
      const cur = g().roundId;
      if (cur && e.roundId !== cur) return;
      g().onMultiplierUpdate(e.multiplier);
    };

    const onCrash = (e: RoundCrashEvent) => {
      const cur = g().roundId;
      if (cur && e.roundId !== cur) return;

      const nextLivePlayers = normalizeLivePlayers(e.players);
      const prevLivePlayers = g().livePlayers;

      useGameStore.setState({
        phase: "crashed",
        crashPoint: e.crashPoint,
        multiplier: e.crashPoint,
        players: normalizePlayersCount(e.players),
        livePlayers: areLivePlayersEqual(prevLivePlayers, nextLivePlayers, true)
          ? prevLivePlayers
          : nextLivePlayers,
      });
      void queryClient.invalidateQueries({ queryKey: gameKeys.recent() });
    };

    const onBetPlaced = (e: BetPlacedEvent) => {
      g().setBalance(e.balance);
      g().setMyBet({
        betId: e.betId,
        amount: e.amount,
        autoCashOutAt: e.autoCashOutAt,
        status: "placed",
      });
      clearBetFlightState();
    };

    const onBetCashedOut = (e: BetCashedOutEvent) => {
      g().setBalance(e.balance);
      g().setMyBet(null);
      clearBetFlightState();
    };

    const onBetLost = (e: BetLostEvent) => {
      g().setBalance(e.balance);
      g().setMyBet(null);
      clearBetFlightState();
    };

    const onBetRejected = (e: BetRejectedEvent) => {
      clearBetFlightState();
      console.warn("Bet rejected:", e.reason, e.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("round:tick", onTick);
    socket.on("round:state", onState);
    socket.on("round:start", onStart);
    socket.on("round:waiting", onWaiting);
    socket.on("round:crash", onCrash);
    socket.on("bet:placed", onBetPlaced);
    socket.on("bet:cashedOut", onBetCashedOut);
    socket.on("bet:lost", onBetLost);
    socket.on("bet:rejected", onBetRejected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("round:tick", onTick);
      socket.off("round:state", onState);
      socket.off("round:start", onStart);
      socket.off("round:waiting", onWaiting);
      socket.off("round:crash", onCrash);
      socket.off("bet:placed", onBetPlaced);
      socket.off("bet:cashedOut", onBetCashedOut);
      socket.off("bet:lost", onBetLost);
      socket.off("bet:rejected", onBetRejected);
    };
  }, [apiKey, queryClient]);
}
