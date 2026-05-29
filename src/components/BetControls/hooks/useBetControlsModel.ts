import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBalanceQuery } from "../../../entities/queries/useBalanceQuery";
import { getSocket } from "../../../shared/api/socket";
import { playBetSound } from "../../../shared/lib/gameSounds";
import { useGameStore } from "../../../stores/useGameStore";
import type { Phase } from "../../../types/Events";

export interface UseBetControlsModelResult {
  betAmount: number;
  balance: number;
  halfBet: () => void;
  doubleBet: () => void;
  maxBet: () => void;
  phase: Phase;
  autoCashoutInput: number;
  isAutoCashout: boolean;
  handleBetChange: (value: number) => void;
  handleAutoCashoutToggle: () => void;
  handleAutoCashoutChange: (value: number) => void;
  actionText: string;
  actionDisabled: boolean;
  shouldShowCrashedState: boolean;
  shouldWaitForNextRound: boolean;
  isRunningWithMyBet: boolean;
  cashedOutProfit: number | null;
  actionError: string | null;
  isBetInputDisabled: boolean;
  handlePlaceBet: () => void;
  handleCashout: () => void;
  canCashout: boolean;
}

export function useBetControlsModel(): UseBetControlsModelResult {
  const { data: balanceData } = useBalanceQuery();
  const {
    betAmount,
    setBetAmount,
    betActionInFlight,
    setBetActionInFlight,
    betError,
    setBetError,
    betOutcome,
    balance,
    setBalance,
    halfBet,
    doubleBet,
    maxBet,
    autoCashout,
    setAutoCashout,
    myBet,
    phase,
  } = useGameStore(
    useShallow((s) => ({
      betActionInFlight: s.betActionInFlight,
      setBetActionInFlight: s.setBetActionInFlight,
      betError: s.betError,
      setBetError: s.setBetError,
      betOutcome: s.betOutcome,
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
    })),
  );

  const [autoCashoutInput, setAutoCashoutInput] = useState<number>(2);

  const isAutoCashout = autoCashout != null;
  const hasActiveBet = myBet?.status === "placed";
  const canPlaceBet = phase === "waiting" && !hasActiveBet;
  const canCashout = phase === "running" && hasActiveBet;
  const cashedOutProfit =
    betOutcome?.type === "cashedOut" ? betOutcome.profit : null;
  const lostAtMultiplier =
    betOutcome?.type === "lost" ? betOutcome.crashPoint : null;
  const hasCashedOutThisRound = cashedOutProfit != null;

  const handleBetChange = useCallback(
    (value: number) => {
      setBetAmount(value);
    },
    [setBetAmount],
  );

  const handleAutoCashoutToggle = useCallback(() => {
    if (isAutoCashout) {
      setAutoCashout(null);
    } else {
      const num = autoCashoutInput || 2;
      setAutoCashout(num);
    }
  }, [autoCashoutInput, isAutoCashout, setAutoCashout]);

  const handleAutoCashoutChange = useCallback(
    (value: number) => {
      setAutoCashoutInput(value);
      if (!Number.isNaN(value) && value >= 1.01) {
        setAutoCashout(value);
      }
    },
    [setAutoCashout],
  );

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.balance);
    }
  }, [balanceData, setBalance]);

  const handlePlaceBet = useCallback(() => {
    if (!canPlaceBet || betAmount <= 0 || betAmount > balance) return;
    if (isAutoCashout && (autoCashout == null || autoCashout < 1.01)) {
      setBetError("Auto cash out must be >= 1.01");
      return;
    }

    setBetError(null);
    setBetActionInFlight(true);
    playBetSound();
    try {
      getSocket().emit("bet:place", {
        amount: betAmount,
        autoCashOutAt: isAutoCashout ? autoCashout : null,
      });
    } catch {
      setBetActionInFlight(false);
      setBetError("Failed to place bet");
    }
  }, [
    autoCashout,
    balance,
    betAmount,
    canPlaceBet,
    isAutoCashout,
    setBetError,
    setBetActionInFlight,
  ]);

  const handleCashout = useCallback(() => {
    if (!canCashout) return;

    setBetError(null);
    setBetActionInFlight(true);
    try {
      getSocket().emit("bet:cashout", {});
    } catch {
      setBetActionInFlight(false);
      setBetError("Failed to cash out");
    }
  }, [canCashout, setBetActionInFlight, setBetError]);

  const isRunning = phase === "running";
  const hasInvalidBetAmount = betAmount <= 0 || betAmount > balance;
  const shouldShowCrashedState =
    lostAtMultiplier != null && phase !== "waiting";
  const shouldWaitForNextRound =
    hasCashedOutThisRound || (isRunning && !hasActiveBet);

  const actionText = betActionInFlight
    ? "Processing..."
    : shouldShowCrashedState
      ? `Crashed @ ${lostAtMultiplier.toFixed(2)}×`
      : shouldWaitForNextRound
        ? "Wait for next round"
        : canCashout
          ? "Cashout"
          : hasActiveBet
            ? "Bet Placed"
            : "Place Bet";

  const actionDisabled =
    betActionInFlight || (!canCashout && (!canPlaceBet || hasInvalidBetAmount));
  const isRunningWithMyBet = isRunning && myBet != null;
  const isBetInputDisabled = isRunning;

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
    actionError: betError,
    isBetInputDisabled,
    handlePlaceBet,
    handleCashout,
    canCashout,
  };
}
