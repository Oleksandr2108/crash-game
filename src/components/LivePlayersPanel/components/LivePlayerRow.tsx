import { memo } from "react";
import type { Phase } from "../../../types/Events";
import { resultBadge } from "../lib/livePlayers";
import type { PlayerRow } from "../types";

type LivePlayerRowProps = {
  player: PlayerRow;
  phase: Phase;
};

const LivePlayerRow = ({ player, phase }: LivePlayerRowProps) => {
  const badge = resultBadge(player.status, player.multiplier, phase);

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-[#111a2c] bg-[#0f1728] px-3 py-3">
      <div
        className={`grid h-8 w-8 place-items-center rounded-full bg-linear-to-br ${player.accentClass} text-[12px] font-semibold text-(--whiteText)`}
      >
        {player.initial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] leading-[1.1] text-(--whiteText)">
          {player.name}
        </p>
        <p className="text-[12px] uppercase text-(--text)">
          {player.amount} USD
        </p>
      </div>

      <span className={`text-[12px] ${badge.className}`}>{badge.text}</span>
    </li>
  );
};

export default memo(LivePlayerRow);
