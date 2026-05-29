import { useEffect, useRef, useState } from "react";

export const PIXELS_PER_TICK = 10;
const VERTICAL_LIFT_FACTOR = 0.1;

interface UseTickChartCanvasParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  pointsRef: React.MutableRefObject<number[]>;
  isCrashed: boolean;
}

export const useTickChartCanvas = ({
  canvasRef,
  wrapperRef,
  pointsRef,
  isCrashed,
}: UseTickChartCanvasParams) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  // Keep isCrashed in a ref so the RAF loop always reads the latest value
  // without needing to restart the loop on phase change
  const isCrashedRef = useRef(isCrashed);
  useEffect(() => {
    isCrashedRef.current = isCrashed;
  }, [isCrashed]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateSize = () => {
      // Use content-box size to avoid resize feedback loops from border-box measurements.
      setSize({
        width: Math.floor(wrapper.clientWidth),
        height: Math.floor(wrapper.clientHeight),
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [wrapperRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const draw = () => {
      const crashed = isCrashedRef.current;
      const points = pointsRef.current;

      const cssWidth = Math.max(280, size.width || wrapper.clientWidth || 520);
      const cssHeight = Math.max(
        280,
        size.height || wrapper.clientHeight || 420,
      );
      const dpr = window.devicePixelRatio || 1;

      if (
        canvas.width !== Math.floor(cssWidth * dpr) ||
        canvas.height !== Math.floor(cssHeight * dpr)
      ) {
        canvas.width = Math.floor(cssWidth * dpr);
        canvas.height = Math.floor(cssHeight * dpr);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = cssWidth;
      const height = cssHeight;
      const padX = 18;
      const padTop = 10;
      const padBottom = 10;
      const drawWidth = width - padX * 2;
      const drawHeight = height - padTop - padBottom;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      if (points.length === 0) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      const maxVisiblePoints = Math.max(
        2,
        Math.floor(drawWidth / PIXELS_PER_TICK) + 1,
      );
      const visiblePoints =
        points.length > maxVisiblePoints
          ? points.slice(points.length - maxVisiblePoints)
          : points;

      const diagStartY = padTop + drawHeight * 0.9;
      const diagEndY = padTop + drawHeight * 0.1;
      const minValue = visiblePoints.reduce(
        (min, value) => Math.min(min, value),
        visiblePoints[0],
      );
      const maxValue = visiblePoints.reduce(
        (max, value) => Math.max(max, value),
        1,
      );
      const maxY = Math.max(2, maxValue * 1.15);
      const valueRange = Math.max(0.0001, maxY - minValue);

      const chartPoints = visiblePoints.map((value, idx) => {
        const x = padX + idx * PIXELS_PER_TICK;
        const tDiag = maxVisiblePoints <= 1 ? 0 : idx / (maxVisiblePoints - 1);
        const diagonalY = diagStartY + tDiag * (diagEndY - diagStartY);
        const normalized = (value - minValue) / valueRange;
        const lift = normalized * drawHeight * VERTICAL_LIFT_FACTOR;
        const y = Math.max(
          padTop,
          Math.min(padTop + drawHeight, diagonalY - lift),
        );
        return { x, y };
      });

      const lineGrad = ctx.createLinearGradient(
        0,
        padTop,
        0,
        padTop + drawHeight,
      );
      lineGrad.addColorStop(
        0,
        crashed ? "rgba(255, 78, 96, 1)" : "rgba(34, 231, 132, 1)",
      );
      lineGrad.addColorStop(
        1,
        crashed ? "rgba(255, 78, 96, 0.55)" : "rgba(34, 231, 132, 0.55)",
      );

      const areaGrad = ctx.createLinearGradient(
        0,
        padTop,
        0,
        padTop + drawHeight,
      );
      areaGrad.addColorStop(
        0,
        crashed ? "rgba(255, 78, 96, 0.35)" : "rgba(34, 231, 132, 0.35)",
      );
      areaGrad.addColorStop(
        1,
        crashed ? "rgba(255,78,96,0.00)" : "rgba(5,223,114,0.00)",
      );

      const firstX = chartPoints[0].x;
      const lastX = chartPoints[chartPoints.length - 1].x;
      const lastY = chartPoints[chartPoints.length - 1].y;

      ctx.fillStyle = areaGrad;
      ctx.beginPath();
      for (let i = 0; i < chartPoints.length; i += 1) {
        const point = chartPoints[i];
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.lineTo(lastX, padTop + drawHeight);
      ctx.lineTo(firstX, padTop + drawHeight);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = crashed
        ? "rgba(255, 78, 96, 0.25)"
        : "rgba(34, 231, 132, 0.25)";
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      for (let i = 0; i < chartPoints.length; i += 1) {
        const point = chartPoints[i];
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      for (let i = 0; i < chartPoints.length; i += 1) {
        const point = chartPoints[i];
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      ctx.fillStyle = crashed ? "#ff4e60" : "#22e784";
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [canvasRef, wrapperRef, pointsRef, size.width, size.height]);
};
