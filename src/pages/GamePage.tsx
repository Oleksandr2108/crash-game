import BetControls from "../components/BetControls/BetControls";
import BetHistoryPanel from "../components/BetHistoryPanel/BetHistoryPanel";
import TickChart from "../components/TickChart/TickChart";

const GamePage = () => {
  return (
    <div className="flex gap-4 items-start flex-wrap">
      <BetControls />
      <BetHistoryPanel />
      <TickChart />
    </div>
  );
};

export default GamePage;
