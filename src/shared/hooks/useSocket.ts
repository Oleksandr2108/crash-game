import { useEffect } from "react";
import { getSocket } from "../api/socket";
import { useAuthStore } from "../../stores/useAuthStore";
import { useGameStore } from "../../stores/useGameStore";
import { queryClient } from "../../app/providers/queryClient";
import { gameKeys } from "../../entities/queries/gameKeys";
import type {
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "../../types/Events";

export function useSocket() {
  const apiKey = useAuthStore((state) => state.apiKey);

  useEffect(() => {
    if (!apiKey) return;
    const socket = getSocket();
    const g = useGameStore.getState;

    g().setConnnectionStatus("connected");

    const onConnect = () => g().setConnnectionStatus("connected");
    const onDisconnect = () => g().setConnnectionStatus("disconnected");
    const onConnectError = (err: Error) => {
      g().setConnnectionStatus("error");
      console.error("WS Connection error:", err);
    };

    const onState = (e: RoundStateEvent) => {
      g().setPhase(e.phase);
      g().setRoundId(e.roundId);
      g().setMultiplier(e.currentMultiplier);
      g().setStartedAt(e.startedAt ? new Date(e.startedAt) : null);
      g().setEndsAt(e.endsAt ? new Date(e.endsAt) : null);
      g().setCrashPoint(e.crashPoint);
      g().setMyBet(e.yourBet);
      g().setPlayers(e.players);
    };

    const onStart = (e: RoundStartEvent) => {
      g().setRoundId(e.roundId);
      g().setStartedAt(new Date(e.startedAt));
      g().setEndsAt(null);
      g().setPlayers(e.players);
      g().onGameStart();
    };

    const onWaiting = (e: RoundWaitingEvent) => {
      g().setPhase("waiting");
      g().setRoundId(e.roundId);
      g().setEndsAt(new Date(e.endsAt));
      g().setStartedAt(null);
      g().setCrashPoint(null);
      g().setMultiplier(1);
      g().setPlayers(e.players);
    };

    const onTick = (e: RoundTickEvent) => {
      const cur = g().roundId;
      if (cur && e.roundId !== cur) return;
      g().onMultiplierUpdate(e.multiplier);
    };

    const onCrash = (e: RoundCrashEvent) => {
      g().onGameCrash(e.crashPoint);
      g().setPlayers(e.players);
      void queryClient.invalidateQueries({ queryKey: gameKeys.recent() });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("round:tick", onTick);
    socket.on("round:state", onState);
    socket.on("round:start", onStart);
    socket.on("round:waiting", onWaiting);
    socket.on("round:crash", onCrash);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("round:tick", onTick);
      socket.off("round:state", onState);
      socket.off("round:start", onStart);
      socket.off("round:waiting", onWaiting);
      socket.off("round:crash", onCrash);
    };
  }, [apiKey]);
}
