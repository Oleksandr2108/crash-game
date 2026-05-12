import Button from "../../../shared/ui/Button";
import type { Phase } from "../../../types/Events";
import IconBalance from '../../../assets/icons/IconBalance.svg'

interface ActionSectionProps {
  actionText: string;
  onActionClick: () => void;
  actionDisabled: boolean;
  shouldShowCrashedState: boolean;
  shouldWaitForNextRound: boolean;
  isRunningWithMyBet: boolean;
  cashedOutProfit: number | null;
  phase: Phase;
  actionError: string | null;
  balance: number;
}

const ActionSection = ({
  actionText,
  onActionClick,
  actionDisabled,
  shouldShowCrashedState,
  shouldWaitForNextRound,
  isRunningWithMyBet,
  cashedOutProfit,
  phase,
  actionError,
  balance,
}: ActionSectionProps) => {
  return (
    <>
      <Button
        text={actionText}
        onClick={onActionClick}
        disabled={actionDisabled}
        className={
          shouldShowCrashedState
            ? "bg-(--colorBtnCrash) disabled:bg-(--colorBtnCrash) text-(--whiteText)"
            : shouldWaitForNextRound
              ? "bg-(--textSecondary) text-(--whiteText)"
              : isRunningWithMyBet
                ? "bg-(--colorBtnCashOut)"
                : undefined
        }
      />

      {cashedOutProfit != null && phase === "running" ? (
        <p className="text-[14px] text-center text-(--highText)">
          +{cashedOutProfit.toFixed(2)} USD
        </p>
      ) : null}

      {actionError ? (
        <p className="text-[12px] text-(--errorText)">{actionError}</p>
      ) : null}
      <div className="flex items-center justify-between border-t border-(--border) pt-4">
        <div className="flex items-center justify-center gap-2">

       <img src={IconBalance} alt="Balance" className="" />
      <p className="text-[12px] text-(--text)">Balance:</p>
        </div>
      <p className="text-[12px] text-(--yellowColor)"> {balance.toFixed(2)}</p>
      </div>
    </>
  );
};

export default ActionSection;
