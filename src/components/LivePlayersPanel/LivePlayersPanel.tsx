import LivePlayersEmptyState from "./components/LivePlayersEmptyState";
import LivePlayersHeader from "./components/LivePlayersHeader";
import LivePlayersList from "./components/LivePlayersList";
import { useLivePlayersPanelModel } from "./hooks/useLivePlayersPanelModel";

const LivePlayersPanel = () => {
  const { players, playersCount, phase } = useLivePlayersPanelModel();

  return (
    <aside className="w-full rounded-[20px] border border-(--border) bg-(--colorBg) p-4 xl:w-65">
      <LivePlayersHeader playersCount={playersCount} />

      {players.length === 0 ? (
        <LivePlayersEmptyState />
      ) : (
        <LivePlayersList
          players={players}
          phase={phase}
        />
      )}
    </aside>
  );
};

export default LivePlayersPanel;
