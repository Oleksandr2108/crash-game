import { memo } from "react";
import BoxTag from "../BoxTag/BoxTag";
import Input from "../Input/Input";

interface BetAmountSectionProps {
  betAmount: number;
  balance: number;
  onBetChange: (value: number) => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  onMaxBet: () => void;
  inputDisabled: boolean;
}

const BetAmountSection = ({
  betAmount,
  balance,
  onBetChange,
  onHalfBet,
  onDoubleBet,
  onMaxBet,
  inputDisabled,
}: BetAmountSectionProps) => {
  return (
    <>
      <h2 className="text-[12px] text-(--text) uppercase">Bet Amount</h2>
      <div className="relative">
        <Input
          value={betAmount}
          onChange={onBetChange}
          disabled={inputDisabled}
        />
        <span className="absolute right-3 top-6  text-[16px] text-(--textSecondary)">
          USD
        </span>
      </div>
      <div className="flex items-center justify-between w-full gap-2">
        <BoxTag
          text="½"
          onClick={onHalfBet}
          disabled={betAmount <= 1}
        />
        <BoxTag
          text="2x"
          onClick={onDoubleBet}
          disabled={betAmount >= balance}
        />
        <BoxTag
          text="Max"
          onClick={onMaxBet}
          disabled={betAmount >= balance}
        />
      </div>
    </>
  );
};

export default memo(BetAmountSection);
