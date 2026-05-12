import { useGameStore } from "../../stores/useGameStore";
import { useAuthStore } from "../../stores/useAuthStore";
import IconUser from "../../assets/icons/IconUser.svg";
import IconLogOut from "../../assets/icons/IconLogOut.svg";
import IconSound from "../../assets/icons/IconSound.svg";

const Footer = () => {
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const roundId = useGameStore((state) => state.roundId);
  const players = useGameStore((state) => state.players);
  const myName = useAuthStore((state) => state.apiKey);
  const logout = useAuthStore((state) => state.logout);

  const roundLabel = roundId ? roundId.slice(0, 8) : "—";
  const statusLabel =
    connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1);
  const statusDotClass =
    connectionStatus === "connected"
      ? "bg-(--highText)"
      : connectionStatus === "error"
        ? "bg-(--errorText)"
        : "bg-(--text)";
  const playersCount = Array.isArray(players)
    ? players.length
    : Number.isFinite(Number(players))
      ? Number(players)
      : 0;

  return (
    <footer
      className="fixed bottom-0 flex w-full h-10 items-center justify-between gap-4 text-sm text-(--text) 
     bg-(--colorBg) border-t border-(--border) px-4"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
          <span>{statusLabel}</span>
        </span>
        <span className="">Round #{roundLabel}</span>
        <span className="">{playersCount} players</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3  cursor-pointer rounded-full bg-(--colorBgInput) px-3 py-1.5"
        >
          <img
            src={IconUser}
            alt="User"
            className="w-4 h-4"
          />
          <span className=" text-(--whiteText)">{myName ?? "Player"}</span>
          <img
            src={IconLogOut}
            alt="Logout"
            className="w-4 h-4"
          />
        </button>

        <button>
          <img
            src={IconSound}
            alt="Sound"
            className="w-4 h-4"
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
