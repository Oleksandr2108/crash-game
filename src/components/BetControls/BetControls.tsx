import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../../stores/useGameStore";
import Input from "./Input/Input";
import { useBalanceQuery } from "../../entities/queries/useBalanceQuery";
import { useEffect, useState } from "react";
import BoxTag from "./BoxTag/BoxTag";
import Button from "../../shared/ui/Button";

const BetControls = () => {
  const { data: balanceData } = useBalanceQuery();
  const {
    betAmount,
    setBetAmount,
    balance,
    setBalance,
    halfBet,
    doubleBet,
    maxBet,
  } = useGameStore(
    useShallow((s) => ({
      balance: s.balance,
      setBalance: s.setBalance,
      halfBet: s.halfBet,
      doubleBet: s.doubleBet,
      maxBet: s.maxBet,
      betAmount: s.betAmount,
      setBetAmount: s.setBetAmount,
    })),
  );

  const [isAutoCashout, setIsAutoCashout] = useState(false);

  const handleBetChange = (value: number) => {
    setBetAmount(value);
  };

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.balance);
    }
  }, [balanceData, setBalance]);

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
          onClick={() => setIsAutoCashout((prev) => !prev)}
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

      <Button
        text="Place Bet"
        onClick={() => {}}
        disabled={betAmount <= 0 || betAmount > balance}
      />

      <p className="text-[12px] text-(--text)">Balance: {balance}</p>
    </div>
  );
};
export default BetControls;
