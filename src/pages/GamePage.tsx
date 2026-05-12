import BetControls from "../components/BetControls/BetControls";
import BetHistoryPanel from "../components/BetHistoryPanel/BetHistoryPanel";
import TickChart from "../components/TickChart/TickChart";
import LivePlayersPanel from "../components/LivePlayersPanel/LivePlayersPanel";

const GamePage = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 xl:flex-row xl:items-stretch">
      <div className="w-full shrink-0 xl:w-65 xl:self-start">
        <BetControls />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <BetHistoryPanel />
        <TickChart />
      </div>
      <div className="w-full shrink-0 xl:w-65 xl:self-start">
        <LivePlayersPanel />
      </div>
    </div>
  );
};

export default GamePage;
