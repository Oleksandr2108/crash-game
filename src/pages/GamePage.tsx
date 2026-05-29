import BetControls from "../components/BetControls/BetControls";
import BetHistoryPanel from "../components/BetHistoryPanel/BetHistoryPanel";
import TickChart from "../components/TickChart/TickChart";
import LivePlayersPanel from "../components/LivePlayersPanel/LivePlayersPanel";

type GamePageProps = {
  isPlayersMenuOpen: boolean;
  onClosePlayersMenu: () => void;
};

const GamePage = ({ isPlayersMenuOpen, onClosePlayersMenu }: GamePageProps) => {
  return (
    <>
      <div className="flex min-h-0 w-full flex-col gap-4 min-[770px]:h-full min-[770px]:flex-row min-[770px]:items-stretch">
        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col gap-4 min-[770px]:order-2 min-[770px]:h-full">
          <BetHistoryPanel />
          <div className="h-100 min-[770px]:min-h-0 min-[770px]:h-full min-[770px]:flex-1">
            <TickChart />
          </div>
        </div>
        <div className="order-2 w-full shrink-0 min-[770px]:order-1 min-[770px]:w-65 min-[770px]:self-start">
          <BetControls />
        </div>
        <div className="hidden w-full shrink-0 min-[770px]:order-3 min-[770px]:block min-[770px]:w-65 min-[770px]:self-start">
          <LivePlayersPanel />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 min-[770px]:hidden ${
          isPlayersMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClosePlayersMenu}
        aria-hidden={!isPlayersMenuOpen}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-[min(24rem,92vw)] bg-(--mainBg) p-3 transition-transform duration-300 min-[770px]:hidden ${
          isPlayersMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isPlayersMenuOpen}
      >
        <button
          type="button"
          onClick={onClosePlayersMenu}
          aria-label="Close players panel"
          className="mb-3 ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-(--border) text-(--whiteText)"
        >
          ×
        </button>
        <div className="h-[calc(100%-2.75rem)] overflow-y-auto">
          {isPlayersMenuOpen ? <LivePlayersPanel /> : null}
        </div>
      </div>
    </>
  );
};

export default GamePage;
