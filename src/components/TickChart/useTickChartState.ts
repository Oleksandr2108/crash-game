import { useEffect, useMemo, useRef, useState } from "react";
import {
  playChartLoop,
  playCrashSound,
  stopChartLoop,
} from "../../shared/lib/gameSounds";
import { useGameStore } from "../../stores/useGameStore";

export const MAX_POINTS = 240;

export const useTickChartState = () => {
  const lastRoundIdRef = useRef<string | null>(null);
  const lastPhaseRef = useRef<string | null>(null);

  const roundId = useGameStore((s) => s.roundId);
  const phase = useGameStore((s) => s.phase);
  const multiplier = useGameStore((s) => s.multiplier);
  const crashPoint = useGameStore((s) => s.crashPoint);
  const endsAt = useGameStore((s) => s.endsAt);

  const [points, setPoints] = useState<number[]>([1]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const isCrashed = phase === "crashed";
  const isWaiting = phase === "waiting";
  const currentValue =
    isCrashed && crashPoint != null ? crashPoint : multiplier;

  const remainingSeconds = useMemo(() => {
    if (!isWaiting || !endsAt) return null;
    const diffMs = endsAt.getTime() - nowMs;
    return Math.max(0, diffMs / 1000);
  }, [isWaiting, endsAt, nowMs]);

  const maxY = useMemo(() => {
    const top = points.reduce((acc, p) => (p > acc ? p : acc), 1);
    return Math.max(2, top * 1.15);
  }, [points]);

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
    const prevPhase = lastPhaseRef.current;

    if (phase === "running" && prevPhase !== "running") {
      playChartLoop();
    }

    if (prevPhase === "running" && phase !== "running") {
      stopChartLoop();
    }

    if (phase === "crashed" && prevPhase !== "crashed") {
      playCrashSound();
    }

    lastPhaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => {
      stopChartLoop();
    };
  }, []);

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

  return {
    phase,
    points,
    maxY,
    isCrashed,
    isWaiting,
    currentValue,
    remainingSeconds,
  };
};
