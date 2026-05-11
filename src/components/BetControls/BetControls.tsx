import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../../stores/useGameStore";
import Input from "./Input/Input";
import { useBalanceQuery } from "../../entities/queries/useBalanceQuery";
import { useEffect, useState } from "react";
import BoxTag from "./BoxTag/BoxTag";
import Button from "../../shared/ui/Button";
import { getSocket } from "../../shared/api/socket";
import { useAuthStore } from "../../stores/useAuthStore";
import type { BetRejectedEvent } from "../../types/Events";

const BetControls = () => {
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

  const isAutoCashout = autoCashout != null;
  const hasActiveBet = myBet?.status === "placed";
  const canPlaceBet = phase === "waiting" && !hasActiveBet;
  const canCashout = phase === "running" && hasActiveBet;
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

    socket.on("bet:placed", clearErrorOnSuccess);
    socket.on("bet:cashedOut", clearErrorOnSuccess);
    socket.on("bet:lost", clearErrorOnSuccess);
    socket.on("bet:rejected", onBetRejected);

    return () => {
      socket.off("bet:placed", clearErrorOnSuccess);
      socket.off("bet:cashedOut", clearErrorOnSuccess);
      socket.off("bet:lost", clearErrorOnSuccess);
      socket.off("bet:rejected", onBetRejected);
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

  const actionText = betActionInFlight
    ? "Processing..."
    : canCashout
      ? `Cashout - ${cashoutProfit.toFixed(2)}`
      : hasActiveBet
        ? "Bet Placed"
        : "Place Bet";

  const actionDisabled =
    betActionInFlight ||
    (!canCashout && !canPlaceBet) ||
    (!canCashout && (betAmount <= 0 || betAmount > balance));

  return (
    <div className="flex flex-col w-65 gap-4 border border-(--border) rounded-[14px] bg-(--colorBg) p-4">
      <h2 className="text-[12px] text-(--text) uppercase">Bet Amount</h2>
      <Input
        value={betAmount}
        onChange={handleBetChange}
      />
      <div className="flex items-center justify-between w-full gap-2">
        <BoxTag
          text="½"
          onClick={halfBet}
          disabled={betAmount <= 1}
        />
        <BoxTag
          text="2x"
          onClick={doubleBet}
          disabled={betAmount >= balance}
        />
        <BoxTag
          text="Max"
          onClick={maxBet}
          disabled={betAmount >= balance}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-(--text) uppercase">
          Auto Cash out
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAutoCashout}
          onClick={handleAutoCashoutToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full border border-(--border) transition-colors duration-300 ${
            isAutoCashout ? "bg-(--text)" : "bg-(--colorBgInput)"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-(--whiteText) transition-transform duration-300 ${
              isAutoCashout ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isAutoCashout && (
        <div className="flex flex-col gap-1">
          <Input
            value={autoCashoutInput}
            onChange={handleAutoCashoutChange}
          />
          {autoCashoutInput < 1.01 && (
            <p className="text-[11px] text-(--errorText)">Minimum: 1.01</p>
          )}
        </div>
      )}

      <Button
        text={actionText}
        onClick={canCashout ? handleCashout : handlePlaceBet}
        disabled={actionDisabled}
      />

      {actionError ? (
        <p className="text-[12px] text-(--errorText)">{actionError}</p>
      ) : null}

      <p className="text-[12px] text-(--text)">Balance: {balance.toFixed(2)}</p>
    </div>
  );
};
export default BetControls;
