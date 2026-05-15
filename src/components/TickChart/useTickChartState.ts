import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  playChartLoop,
  playCrashSound,
  stopChartLoop,
} from "../../shared/lib/gameSounds";
import { useGameStore } from "../../stores/useGameStore";

export const MAX_POINTS = 240;

export const useTickChartState = (
  pointsRef: React.MutableRefObject<number[]>,
) => {
  const lastRoundIdRef = useRef<string | null>(null);
  const lastPhaseRef = useRef<string | null>(null);

  // Only subscribe to rarely-changing values — avoids per-frame rerenders
  const { roundId, phase } = useGameStore(
    useShallow((s) => ({
      roundId: s.roundId,
      phase: s.phase,
    })),
  );

  const isCrashed = phase === "crashed";
  const isWaiting = phase === "waiting";

  // Reset points on new round
  useEffect(() => {
    if (!roundId) return;
    if (roundId !== lastRoundIdRef.current) {
      lastRoundIdRef.current = roundId;
      pointsRef.current = [1];
    }
  }, [roundId, pointsRef]);

  // Sound effects on phase transitions
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

  // Accumulate points via continuous RAF — reads multiplier via getState(),
  // never causes a React rerender
  useEffect(() => {
    if (phase !== "running") return;

    let frameId: number;

    const tick = () => {
      const multiplier = useGameStore.getState().multiplier;
      const prev = pointsRef.current;
      const last = prev[prev.length - 1];

      if (!(typeof last === "number" && Math.abs(last - multiplier) < 0.0001)) {
        const next = [...prev, multiplier];
        pointsRef.current =
          next.length > MAX_POINTS
            ? next.slice(next.length - MAX_POINTS)
            : next;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [phase, pointsRef]);

  // Add final crash point once when phase becomes "crashed"
  useEffect(() => {
    if (phase !== "crashed") return;

    const frame = requestAnimationFrame(() => {
      const crashPoint = useGameStore.getState().crashPoint;
      if (crashPoint == null) return;

      const prev = pointsRef.current;
      const last = prev[prev.length - 1];
      if (typeof last === "number" && Math.abs(last - crashPoint) < 0.0001)
        return;

      const next = [...prev, crashPoint];
      pointsRef.current =
        next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, pointsRef]);

  return { phase, isCrashed, isWaiting };
};
