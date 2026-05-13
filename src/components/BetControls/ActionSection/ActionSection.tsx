import Button from "../../../shared/ui/Button";
import type { Phase } from "../../../types/Events";
import IconBalance from "../../../assets/icons/IconBalance.svg";
import IconBonus from "../../../assets/icons/IconBonus.svg";
import { useClaimBonusMutation } from "../../../entities/queries/useClaimBonusMutation";

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
  const claimBonusMutation = useClaimBonusMutation();

  const handleClaimBonus = () => {
    // Do not block UI: user can click as many times as they want.
    claimBonusMutation.mutate();
  };

  const buttonText = (
    <span className="inline-flex items-center justify-center gap-2">
      <img
        src={IconBonus}
        alt=""
        aria-hidden="true"
        className="h-4 w-4"
      />
      <span>Claim Bonus +100</span>
    </span>
  );
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
      <Button
        text={buttonText}
        onClick={handleClaimBonus}
        className="text-(--whiteText) opacity-[0.73] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] bg-[linear-gradient(90deg,#c084fc_0%,#b884fc_7.14%,#b185fb_14.29%,#a985fb_21.43%,#a185fa_28.57%,#9985fa_35.71%,#9085fa_42.86%,#8885f9_50%,#7f85f9_57.14%,#7585f8_64.29%,#6c84f8_71.43%,#6184f7_78.57%,#5683f7_85.71%,#4a83f6_92.86%,#3b82f6_100%)]"
      />

      <div className="flex items-center justify-between border-t border-(--border) pt-4">
        <div className="flex items-center justify-center gap-2">
          <img
            src={IconBalance}
            alt="Balance"
            className=""
          />
          <p className="text-[12px] text-(--text)">Balance:</p>
        </div>
        <p className="text-[12px] text-(--yellowColor)">
          {" "}
          {balance.toFixed(2)}
        </p>
      </div>
    </>
  );
};

export default ActionSection;
