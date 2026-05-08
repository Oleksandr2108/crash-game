interface BetHistoryItemProps {
  crashPoint: number;
}

const BetHistoryItem = ({ crashPoint }: BetHistoryItemProps) => {
  const tierClass =
    crashPoint < 1.5
      ? "bg-(--errorBg) border-(--errorBorder) text-(--errorText)"
      : crashPoint < 3
        ? "bg-(--midBg) border-(--midBorder) text-(--midText)"
        : "bg-(--highBg) border-(--highBorder) text-(--highText)";

  return (
    <div
      className={`w-17 h-[30px] py-1 rounded-full border flex items-center justify-center ${tierClass}`}
    >
      <p className="text-[14px] ">{crashPoint.toFixed(2)}x</p>
    </div>
  );
};

export default BetHistoryItem;
