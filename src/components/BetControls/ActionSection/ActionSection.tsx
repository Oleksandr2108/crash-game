import Button from "../../../shared/ui/Button";
import type { Phase } from "../../../types/Events";

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

      <p className="text-[12px] text-(--text)">Balance: {balance.toFixed(2)}</p>
    </>
  );
};

export default ActionSection;
