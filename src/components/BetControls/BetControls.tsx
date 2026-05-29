import { memo } from "react";
import BetAmountSection from "./BetAmountSection/BetAmountSection";
import AutoCashoutSection from "./AutoCashoutSection/AutoCashoutSection";
import ActionSection from "./ActionSection/ActionSection";
import { useBetControlsModel } from "./hooks/useBetControlsModel";

const BetControlsContent = memo(() => {
  const {
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
  } = useBetControlsModel();

  return (
    <>
      <BetAmountSection
        betAmount={betAmount}
        balance={balance}
        onBetChange={handleBetChange}
        onHalfBet={halfBet}
        onDoubleBet={doubleBet}
        onMaxBet={maxBet}
        inputDisabled={isBetInputDisabled}
      />

      <AutoCashoutSection
        isAutoCashout={isAutoCashout}
        autoCashoutInput={autoCashoutInput}
        onToggle={handleAutoCashoutToggle}
        onChange={handleAutoCashoutChange}
        inputDisabled={isBetInputDisabled}
      />

      <ActionSection
        actionText={actionText}
        onActionClick={canCashout ? handleCashout : handlePlaceBet}
        canCashout={canCashout}
        actionDisabled={actionDisabled}
        shouldShowCrashedState={shouldShowCrashedState}
        shouldWaitForNextRound={shouldWaitForNextRound}
        isRunningWithMyBet={isRunningWithMyBet}
        cashedOutProfit={cashedOutProfit}
        phase={phase}
        actionError={actionError}
        balance={balance}
      />
    </>
  );
});

const BetControls = () => {
  return (
    <div className="flex w-full flex-col gap-4 border border-(--border) rounded-[14px] bg-(--colorBg) p-4 min-[770px]:w-65">
      <BetControlsContent />
    </div>
  );
};

export default memo(BetControls);
