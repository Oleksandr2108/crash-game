import { useRef } from "react";
import TickChartBackground from "./TickChartBackground";
import TickChartCenterValue from "./TickChartCenterValue";
import TickChartStatusBadge from "./TickChartStatusBadge";
import { useTickChartCanvas } from "./useTickChartCanvas";
import { useTickChartState } from "./useTickChartState";

const TickChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const {
    phase,
    points,
    maxY,
    isCrashed,
    isWaiting,
    currentValue,
    remainingSeconds,
  } = useTickChartState();

  useTickChartCanvas({
    canvasRef,
    wrapperRef,
    points,
    maxY,
    isCrashed,
  });

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-w-0 flex-1 min-h-0 border border-(--border) rounded-[14px] bg-(--colorBg) overflow-hidden"
    >
      <TickChartBackground isCrashed={isCrashed} />
      <TickChartStatusBadge phase={phase} />
      <TickChartCenterValue
        isWaiting={isWaiting}
        isCrashed={isCrashed}
        remainingSeconds={remainingSeconds}
        currentValue={currentValue}
      />

      <canvas
        ref={canvasRef}
        className="relative z-10 block w-full h-full"
      />
    </div>
  );
};

export default TickChart;
