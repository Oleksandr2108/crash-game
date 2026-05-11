import type { Phase } from "../../types/Events";

interface TickChartStatusBadgeProps {
  phase: Phase;
}

const TickChartStatusBadge = ({ phase }: TickChartStatusBadgeProps) => {
  return (
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
  );
};

export default TickChartStatusBadge;
