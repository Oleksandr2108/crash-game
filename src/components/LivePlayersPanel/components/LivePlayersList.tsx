import { memo } from "react";
import type { Phase } from "../../../types/Events";
import LivePlayerRow from "./LivePlayerRow";
import type { PlayerRow } from "../types";

type LivePlayersListProps = {
  players: PlayerRow[];
  phase: Phase;
};

const LivePlayersList = ({ players, phase }: LivePlayersListProps) => {
  return (
    <ul className="space-y-3">
      {players.map((player) => (
        <LivePlayerRow
          key={player.id}
          player={player}
          phase={phase}
        />
      ))}
    </ul>
  );
};

export default memo(LivePlayersList);
