import { memo, useRef } from "react";
import TickChartBackground from "./TickChartBackground";
import TickChartCenterValue from "./TickChartCenterValue";
import TickChartStatusBadge from "./TickChartStatusBadge";
import { useTickChartCanvas } from "./useTickChartCanvas";
import { useTickChartState } from "./useTickChartState";

const TickChart = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointsRef = useRef<number[]>([1]);

  const { phase, isCrashed, isWaiting } = useTickChartState(pointsRef);

  useTickChartCanvas({
    canvasRef,
    wrapperRef,
    pointsRef,
    isCrashed,
  });

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full min-h-0 min-w-0 border border-(--border) rounded-[14px] bg-(--colorBg) overflow-hidden"
    >
      <TickChartBackground isCrashed={isCrashed} />
      <TickChartStatusBadge phase={phase} />
      <TickChartCenterValue
        isWaiting={isWaiting}
        isCrashed={isCrashed}
      />

      <canvas
        ref={canvasRef}
        className="relative z-10 block w-full h-full"
      />
    </div>
  );
});

export default TickChart;
