interface TickChartCenterValueProps {
  isWaiting: boolean;
  isCrashed: boolean;
  remainingSeconds: number | null;
  currentValue: number;
}

const TickChartCenterValue = ({
  isWaiting,
  isCrashed,
  remainingSeconds,
  currentValue,
}: TickChartCenterValueProps) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {isWaiting && remainingSeconds != null ? (
        <div className="flex flex-col items-center gap-1">
          <p className="text-[48px] leading-none font-medium text-[#ffb900]">
            {remainingSeconds.toFixed(1)}s
          </p>
          <p className="text-[12px] text-(--textSecondary)">
            Next round starting...
          </p>
        </div>
      ) : (
        <p
          className={`text-[64px] leading-none font-medium ${
            isCrashed ? "text-[#ff4e60]" : "text-[#22e784]"
          }`}
        >
          {currentValue.toFixed(2)}x
        </p>
      )}
    </div>
  );
};

export default TickChartCenterValue;
