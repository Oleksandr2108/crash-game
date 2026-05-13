import { useEffect, useEffectEvent } from "react";
import { getSocket } from "../../../shared/api/socket";
import { playCashoutSound } from "../../../shared/lib/gameSounds";
import type {
  BetCashedOutEvent,
  BetLostEvent,
  BetRejectedEvent,
} from "../../../types/Events";

interface UseBetControlsSocketParams {
  apiKey: string | null;
  onBetRejected: (message: string) => void;
  onBetPlaced: () => void;
  onBetCashedOut: (profit: number) => void;
  onBetLost: (crashPoint: number) => void;
  onRoundWaiting: () => void;
}

export function useBetControlsSocket({
  apiKey,
  onBetRejected,
  onBetPlaced,
  onBetCashedOut,
  onBetLost,
  onRoundWaiting,
}: UseBetControlsSocketParams) {
  const handleBetRejected = useEffectEvent((event: BetRejectedEvent) => {
    onBetRejected(event.message || "Action rejected");
  });

  const handleBetPlaced = useEffectEvent(() => {
    onBetPlaced();
  });

  const handleBetCashedOut = useEffectEvent((event: BetCashedOutEvent) => {
    playCashoutSound();
    onBetCashedOut(event.profit);
  });

  const handleBetLost = useEffectEvent((event: BetLostEvent) => {
    onBetLost(event.crashPoint);
  });

  const handleRoundWaiting = useEffectEvent(() => {
    onRoundWaiting();
  });

  useEffect(() => {
    if (!apiKey) return;

    const socket = getSocket();

    socket.on("bet:placed", handleBetPlaced);
    socket.on("bet:cashedOut", handleBetCashedOut);
    socket.on("bet:lost", handleBetLost);
    socket.on("bet:rejected", handleBetRejected);
    socket.on("round:waiting", handleRoundWaiting);

    return () => {
      socket.off("bet:placed", handleBetPlaced);
      socket.off("bet:cashedOut", handleBetCashedOut);
      socket.off("bet:lost", handleBetLost);
      socket.off("bet:rejected", handleBetRejected);
      socket.off("round:waiting", handleRoundWaiting);
    };
  }, [
    apiKey,
    handleBetPlaced,
    handleBetCashedOut,
    handleBetLost,
    handleBetRejected,
    handleRoundWaiting,
  ]);
}
