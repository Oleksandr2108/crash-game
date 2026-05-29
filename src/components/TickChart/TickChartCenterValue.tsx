import { memo, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "../../stores/useGameStore";

interface TickChartCenterValueProps {
  isWaiting: boolean;
  isCrashed: boolean;
}

const TickChartCenterValue = memo(
  ({ isWaiting, isCrashed }: TickChartCenterValueProps) => {
    const { multiplier, crashPoint, endsAt } = useGameStore(
      useShallow((s) => ({
        multiplier: s.multiplier,
        crashPoint: s.crashPoint,
        endsAt: s.endsAt,
      })),
    );

    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
      if (!isWaiting || !endsAt) return;
      const timer = window.setInterval(() => {
        setNowMs(Date.now());
      }, 100);
      return () => window.clearInterval(timer);
    }, [isWaiting, endsAt]);

    const currentValue =
      isCrashed && crashPoint != null ? crashPoint : multiplier;

    const remainingSeconds = useMemo(() => {
      if (!isWaiting || !endsAt) return null;
      const diffMs = endsAt.getTime() - nowMs;
      return Math.max(0, diffMs / 1000);
    }, [isWaiting, endsAt, nowMs]);

    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none w-auto h-auto">
        {isWaiting && remainingSeconds != null ? (
          <div className="flex flex-col items-center gap-1">
            <p className="text-[60px] leading-none font-medium text-(--yellowColor)">
              {remainingSeconds.toFixed(1)}s
            </p>
            <p className="text-[16px] text-(--text)">Next round starting...</p>
          </div>
        ) : (
          <p
            className={`text-[96px] leading-none font-medium ${
              isCrashed ? "text-(--errorText)" : "text-(--highText)"
            }`}
          >
            {currentValue.toFixed(2)}x
          </p>
        )}
      </div>
    );
  },
);

export default TickChartCenterValue;
