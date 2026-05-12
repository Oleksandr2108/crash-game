import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBalanceQuery } from "../../../entities/queries/useBalanceQuery";
import { getSocket } from "../../../shared/api/socket";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useGameStore } from "../../../stores/useGameStore";
import type {
  BetCashedOutEvent,
  BetLostEvent,
  BetRejectedEvent,
} from "../../../types/Events";

export function useBetControlsModel() {
  const { data: balanceData } = useBalanceQuery();
  const {
    betAmount,
    setBetAmount,
    betActionInFlight,
    setBetActionInFlight,
    balance,
    setBalance,
    halfBet,
    doubleBet,
    maxBet,
    autoCashout,
    setAutoCashout,
    myBet,
    phase,
    multiplier,
  } = useGameStore(
    useShallow((s) => ({
      betActionInFlight: s.betActionInFlight,
      setBetActionInFlight: s.setBetActionInFlight,
      balance: s.balance,
      setBalance: s.setBalance,
      halfBet: s.halfBet,
      doubleBet: s.doubleBet,
      maxBet: s.maxBet,
      betAmount: s.betAmount,
      setBetAmount: s.setBetAmount,
      autoCashout: s.autoCashout,
      setAutoCashout: s.setAutoCashout,
      myBet: s.myBet,
      phase: s.phase,
      multiplier: s.multiplier,
    })),
  );
  const apiKey = useAuthStore((s) => s.apiKey);

  const [actionError, setActionError] = useState<string | null>(null);
  const [autoCashoutInput, setAutoCashoutInput] = useState<number>(2);
  const [cashedOutProfit, setCashedOutProfit] = useState<number | null>(null);
  const [lostAtMultiplier, setLostAtMultiplier] = useState<number | null>(null);

  const isAutoCashout = autoCashout != null;
  const hasActiveBet = myBet?.status === "placed";
  const canPlaceBet = phase === "waiting" && !hasActiveBet;
  const canCashout = phase === "running" && hasActiveBet;
  const hasCashedOutThisRound = cashedOutProfit != null;
  const cashoutProfit = hasActiveBet
    ? Math.max(0, myBet.amount * multiplier - myBet.amount)
    : 0;

  const handleBetChange = (value: number) => {
    setBetAmount(value);
  };

  const handleAutoCashoutToggle = () => {
    if (isAutoCashout) {
      setAutoCashout(null);
    } else {
      const num = autoCashoutInput || 2;
      setAutoCashout(num);
    }
  };

  const handleAutoCashoutChange = (value: number) => {
    setAutoCashoutInput(value);
    if (!Number.isNaN(value) && value >= 1.01) {
      setAutoCashout(value);
    }
  };

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.balance);
    }
  }, [balanceData, setBalance]);

  useEffect(() => {
    if (!apiKey) return;
    const socket = getSocket();

    const clearErrorOnSuccess = () => {
      setActionError(null);
    };

    const onBetRejected = (e: BetRejectedEvent) => {
      setActionError(e.message || "Action rejected");
    };

    const onBetPlaced = () => {
      setCashedOutProfit(null);
      setLostAtMultiplier(null);
    };

    const onBetCashedOut = (e: BetCashedOutEvent) => {
      setCashedOutProfit(Math.max(0, e.profit));
      setLostAtMultiplier(null);
      clearErrorOnSuccess();
    };

    const onBetLost = (e: BetLostEvent) => {
      setLostAtMultiplier(Math.max(0, e.crashPoint));
      setCashedOutProfit(null);
      clearErrorOnSuccess();
    };

    const clearRoundOutcome = () => {
      setCashedOutProfit(null);
      setLostAtMultiplier(null);
    };

    socket.on("bet:placed", onBetPlaced);
    socket.on("bet:cashedOut", onBetCashedOut);
    socket.on("bet:lost", onBetLost);
    socket.on("bet:rejected", onBetRejected);
    socket.on("round:waiting", clearRoundOutcome);

    return () => {
      socket.off("bet:placed", onBetPlaced);
      socket.off("bet:cashedOut", onBetCashedOut);
      socket.off("bet:lost", onBetLost);
      socket.off("bet:rejected", onBetRejected);
      socket.off("round:waiting", clearRoundOutcome);
    };
  }, [apiKey]);

  const handlePlaceBet = () => {
    if (!canPlaceBet || betAmount <= 0 || betAmount > balance) return;
    if (isAutoCashout && (autoCashout == null || autoCashout < 1.01)) {
      setActionError("Auto cash out must be >= 1.01");
      return;
    }

    setActionError(null);
    setBetActionInFlight(true);
    try {
      getSocket().emit("bet:place", {
        amount: betAmount,
        autoCashOutAt: isAutoCashout ? autoCashout : null,
      });
    } catch {
      setBetActionInFlight(false);
      setActionError("Failed to place bet");
    }
  };

  const handleCashout = () => {
    if (!canCashout) return;

    setActionError(null);
    setBetActionInFlight(true);
    try {
      getSocket().emit("bet:cashout", {});
    } catch {
      setBetActionInFlight(false);
      setActionError("Failed to cash out");
    }
  };

  const shouldShowCrashedState =
    lostAtMultiplier != null && phase !== "waiting";
  const shouldWaitForNextRound =
    hasCashedOutThisRound || (phase === "running" && !hasActiveBet);

  const actionText = betActionInFlight
    ? "Processing..."
    : shouldShowCrashedState
      ? `Crashed @ ${lostAtMultiplier.toFixed(2)}×`
      : shouldWaitForNextRound
        ? "Wait for next round"
        : canCashout
          ? `Cashout - ${cashoutProfit.toFixed(2)}`
          : hasActiveBet
            ? "Bet Placed"
            : "Place Bet";

  const actionDisabled =
    betActionInFlight ||
    (!canCashout && !canPlaceBet) ||
    (!canCashout && (betAmount <= 0 || betAmount > balance));
  const isRunningWithMyBet = phase === "running" && myBet != null;
  const isBetInputDisabled = phase === "running";

  return {
    betAmount,
    balance,
    halfBet,
    doubleBet,
    maxBet,
    phase,
    autoCashoutInput,
    isAutoCashout,
    handleBetChange,
    handleAutoCashoutToggle,
    handleAutoCashoutChange,
    actionText,
    actionDisabled,
    shouldShowCrashedState,
    shouldWaitForNextRound,
    isRunningWithMyBet,
    cashedOutProfit,
    actionError,
    isBetInputDisabled,
    handlePlaceBet,
    handleCashout,
    canCashout,
  };
}
