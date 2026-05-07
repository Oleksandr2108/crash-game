import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../../stores/useGameStore";
import Input from "./Input/Input";
import { useBalanceQuery } from "../../entities/queries/useBalanceQuery";
import { useEffect } from "react";

const BetControls = () => {
  const { data: balanceData } = useBalanceQuery();
  const { balance, setBalance } = useGameStore(
    useShallow((s) => ({
      balance: s.balance,
      setBalance: s.setBalance,
    })),
  );

  const { betAmount, setBetAmount } = useGameStore(
    useShallow((s) => ({
      betAmount: s.betAmount,
      setBetAmount: s.setBetAmount,
    })),
  );
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

      <p className="text-[12px] text-(--text)">Balance: {balance}</p>
    </div>
  );
};
export default BetControls;
