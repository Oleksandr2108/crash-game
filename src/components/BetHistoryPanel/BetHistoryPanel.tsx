import { useEffect } from "react";
import type { ResentItem } from "../../entities/model/types";
import { useRecentQuery } from "../../entities/queries/useRecentQuery";
import { useGameStore } from "../../stores/useGameStore";
import BetHistoryItem from "./BetHistoryItem/BetHistoryItem";

const BetHistoryPanel = () => {
  const { data: recentRoundsQuery } = useRecentQuery();
  const rounds = recentRoundsQuery?.rounds;
  const recentRounds = useGameStore((s) => s.recentRounds);
  const setRecentRounds = useGameStore((s) => s.setRecentRounds);

  useEffect(() => {
    if (!rounds) return;
    setRecentRounds({ rounds });
  }, [rounds, setRecentRounds]);

  return (
    <div className="bet-history-scroll flex w-full gap-2 overflow-x-auto overflow-y-hidden pb-1">
      {recentRounds?.map((round: ResentItem) => (
        <BetHistoryItem
          key={round.roundId}
          crashPoint={round.crashPoint}
        />
      ))}
    </div>
  );
};

export default BetHistoryPanel;
