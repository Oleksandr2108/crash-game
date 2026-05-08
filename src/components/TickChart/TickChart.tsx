import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../stores/useGameStore";

const MAX_POINTS = 240;
const PIXELS_PER_TICK = 6;

const TickChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastRoundIdRef = useRef<string | null>(null);

  const roundId = useGameStore((s) => s.roundId);
  const phase = useGameStore((s) => s.phase);
  const multiplier = useGameStore((s) => s.multiplier);
  const crashPoint = useGameStore((s) => s.crashPoint);
  const endsAt = useGameStore((s) => s.endsAt);
  const isCrashed = phase === "crashed";
  const isWaiting = phase === "waiting";

  const [points, setPoints] = useState<number[]>([1]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const currentValue =
    phase === "crashed" && crashPoint != null ? crashPoint : multiplier;
  const remainingSeconds = useMemo(() => {
    if (!isWaiting || !endsAt) return null;
    const diffMs = endsAt.getTime() - nowMs;
    return Math.max(0, diffMs / 1000);
  }, [isWaiting, endsAt, nowMs]);

  useEffect(() => {
    if (!roundId) return;
    if (roundId !== lastRoundIdRef.current) {
      lastRoundIdRef.current = roundId;
      setPoints([1]);
    }
  }, [roundId]);

  useEffect(() => {
    if (!isWaiting || !endsAt) return;
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 100);
    return () => window.clearInterval(timer);
  }, [isWaiting, endsAt]);

  useEffect(() => {
    if (phase !== "running") return;

    const frame = requestAnimationFrame(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        if (typeof last === "number" && Math.abs(last - multiplier) < 0.0001) {
          return prev;
        }

        const next = [...prev, multiplier];
        if (next.length > MAX_POINTS) {
          return next.slice(next.length - MAX_POINTS);
        }
        return next;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, multiplier]);

  useEffect(() => {
    if (phase !== "crashed" || crashPoint == null) return;

    const frame = requestAnimationFrame(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        if (typeof last === "number" && Math.abs(last - crashPoint) < 0.0001) {
          return prev;
        }
        const next = [...prev, crashPoint];
        if (next.length > MAX_POINTS) {
          return next.slice(next.length - MAX_POINTS);
        }
        return next;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, crashPoint]);

  const maxY = useMemo(() => {
    const top = points.reduce((acc, p) => (p > acc ? p : acc), 1);
    return Math.max(2, top * 1.15);
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = wrapperRef.current;
    const cssWidth = Math.max(280, parent?.clientWidth ?? 520);
    const cssHeight = Math.max(280, parent?.clientHeight ?? 420);
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
    const padTop = 22;
    const padBottom = 18;
    const drawWidth = width - padX * 2;
    const drawHeight = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    ctx.globalAlpha = 1;

    if (points.length === 0) return;

    const maxVisiblePoints = Math.max(
      2,
      Math.floor(drawWidth / PIXELS_PER_TICK) + 1,
    );
    const visiblePoints =
      points.length > maxVisiblePoints
        ? points.slice(points.length - maxVisiblePoints)
        : points;

    const diagStartY = padTop + drawHeight * 0.82;
    const diagEndY = padTop + drawHeight * 0.22;
    const minValue = visiblePoints.reduce(
      (min, value) => Math.min(min, value),
      visiblePoints[0],
    );
    const valueRange = Math.max(0.0001, maxY - minValue);

    // Fixed pixel step per tick — curve grows left→right without rescaling
    const chartPoints = visiblePoints.map((value, idx) => {
      const x = padX + idx * PIXELS_PER_TICK;
      // Diagonal position based on how far along the full visible window this tick is
      const tDiag = maxVisiblePoints <= 1 ? 0 : idx / (maxVisiblePoints - 1);
      const diagonalY = diagStartY + tDiag * (diagEndY - diagStartY);
      const normalized = (value - minValue) / valueRange;
      const lift = normalized * drawHeight * 0.14;
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
      isCrashed ? "rgba(255, 78, 96, 1)" : "rgba(34, 231, 132, 1)",
    );
    lineGrad.addColorStop(
      1,
      isCrashed ? "rgba(255, 78, 96, 0.55)" : "rgba(34, 231, 132, 0.55)",
    );

    const areaGrad = ctx.createLinearGradient(
      0,
      padTop,
      0,
      padTop + drawHeight,
    );
    areaGrad.addColorStop(
      0,
      isCrashed ? "rgba(255, 78, 96, 0.35)" : "rgba(34, 231, 132, 0.35)",
    );
    areaGrad.addColorStop(
      1,
      isCrashed ? "rgba(255,78,96,0.00)" : "rgba(5,223,114,0.00)",
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

    ctx.strokeStyle = isCrashed
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

    ctx.fillStyle = isCrashed ? "#ff4e60" : "#22e784";
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [points, maxY, isCrashed]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-w-[320px] max-w-180 h-105 border border-(--border) rounded-[14px] bg-(--colorBg) overflow-hidden"
    >
      <div
        className={`absolute inset-0 ${
          isCrashed
            ? "bg-[radial-gradient(110%_95%_at_0%_100%,rgba(255,78,96,0.34)_0%,rgba(255,78,96,0.10)_38%,rgba(255,78,96,0.00)_75%)]"
            : "bg-[radial-gradient(110%_95%_at_0%_100%,rgba(34,231,132,0.34)_0%,rgba(34,231,132,0.10)_38%,rgba(34,231,132,0.00)_75%)]"
        }`}
      />

      <div className="absolute left-4 top-4 z-20 rounded-full border border-(--border) bg-(--colorBgInput)/80 px-3 py-1">
        <p
          className={`text-[10px] uppercase tracking-wide ${
            phase === "running"
              ? "text-[#22e784]"
              : phase === "crashed"
                ? "text-[#ff6467]"
                : "text-(--text)"
          }`}
        >
          {phase}
        </p>
      </div>

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

      <canvas
        ref={canvasRef}
        className="relative z-10 block w-full h-full"
      />
    </div>
  );
};

export default TickChart;
