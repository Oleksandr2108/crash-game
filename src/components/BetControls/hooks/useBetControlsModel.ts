import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBalanceQuery } from "../../../entities/queries/useBalanceQuery";
import { getSocket } from "../../../shared/api/socket";
import { playBetSound } from "../../../shared/lib/gameSounds";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useGameStore } from "../../../stores/useGameStore";
import { useBetControlsSocket } from "./useBetControlsSocket";
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

  useBetControlsSocket({
    apiKey,
    onBetRejected: (message: string) => {
      setActionError(message);
    },
    onBetPlaced: () => {
      setCashedOutProfit(null);
      setLostAtMultiplier(null);
    },
    onBetCashedOut: (profit: number) => {
      setCashedOutProfit(Math.max(0, profit));
      setLostAtMultiplier(null);
      setActionError(null);
    },
    onBetLost: (crashPoint: number) => {
      setLostAtMultiplier(Math.max(0, crashPoint));
      setCashedOutProfit(null);
      setActionError(null);
    },
    onRoundWaiting: () => {
      setCashedOutProfit(null);
      setLostAtMultiplier(null);
    },
  });

  const handlePlaceBet = () => {
    if (!canPlaceBet || betAmount <= 0 || betAmount > balance) return;
    if (isAutoCashout && (autoCashout == null || autoCashout < 1.01)) {
      setActionError("Auto cash out must be >= 1.01");
      return;
    }

    setActionError(null);
    setBetActionInFlight(true);
    playBetSound();
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
          ? `Cashout - ${cashoutProfit.toFixed(2)}`
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
    actionError,
    isBetInputDisabled,
    handlePlaceBet,
    handleCashout,
    canCashout,
  };
}
