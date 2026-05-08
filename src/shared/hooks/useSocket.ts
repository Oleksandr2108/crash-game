import { useEffect } from "react";
import { getSocket } from "../api/socket";
import { useAuthStore } from "../../stores/useAuthStore";
import { useGameStore } from "../../stores/useGameStore";
import type { RoundStateEvent, RoundTickEvent } from "../../types/Events";
// import { useGameStore } from "../../stores/useGameStore";

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
      g().setPlayerCount(e.playerCount);
    };

    const onTick = (e: RoundTickEvent) => {
      const cur = g().roundId;
      if (cur && e.roundId !== cur) return;
      g().onMultiplierUpdate(e.multiplier);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("round:tick", onTick);
    socket.on("round:state", onState);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("round:tick", onTick);
      socket.off("round:state", onState);
    };
  }, [apiKey]);
}
