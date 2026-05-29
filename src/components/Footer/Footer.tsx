import { useState } from "react";
import {
  isSoundMuted,
  playChartLoop,
  setSoundMuted,
} from "../../shared/lib/gameSounds";
import { useGameStore } from "../../stores/useGameStore";
import { useAuthStore } from "../../stores/useAuthStore";
import IconUser from "../../assets/icons/IconUser.svg";
import IconLogOut from "../../assets/icons/IconLogOut.svg";
import IconSound from "../../assets/icons/IconSound.svg";
import IconWiFi from "../../assets/icons/IconWiFi.svg";
import { normalizePlayersCount } from "../LivePlayersPanel/lib/livePlayers";

type FooterProps = {
  onPlayersClick?: () => void;
};

const Footer = ({ onPlayersClick }: FooterProps) => {
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const phase = useGameStore((state) => state.phase);
  const roundId = useGameStore((state) => state.roundId);
  const players = useGameStore((state) => state.players);
  const myName = useAuthStore((state) => state.apiKey);
  const logout = useAuthStore((state) => state.logout);
  const [isMuted, setIsMuted] = useState(isSoundMuted());

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundMuted(nextMuted);

    if (!nextMuted && phase === "running") {
      playChartLoop();
    }
  };

  const roundDigits = roundId?.replace(/\D/g, "") ?? "";
  const roundLabel = roundDigits || "—";
  const statusLabel =
    connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1);
  const statusDotClass =
    connectionStatus === "connected"
      ? "bg-(--highText)"
      : connectionStatus === "error"
        ? "bg-(--errorText)"
        : "bg-(--text)";
  const playersCount = normalizePlayersCount(players);

  return (
    <footer
      className="fixed bottom-0 flex w-full h-10 items-center justify-between gap-4 text-sm text-(--text) 
     bg-(--colorBg) border-t border-(--border) px-4"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="flex items-center gap-2"
          aria-label={`Connection status: ${connectionStatus}`}
          title={connectionStatus}
        >
          <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
          <span className="hidden min-[770px]:inline">{statusLabel}</span>
        </span>
        <span title={roundId ?? undefined}>Round #{roundLabel}</span>
        <button
          type="button"
          onClick={onPlayersClick}
          className="cursor-pointer flex items-center gap-1"
        >
          <img
            src={IconWiFi}
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
          {playersCount}
        </button>
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

        <button
          type="button"
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          onClick={handleToggleMute}
          className="relative flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
        >
          <img
            src={IconSound}
            alt="Sound"
            className={`h-4 w-4 transition-opacity ${isMuted ? "opacity-60" : "opacity-100"}`}
          />
          {isMuted ? (
            <span className="pointer-events-none absolute h-0.5 w-5 -rotate-45 rounded-full bg-(--errorText)" />
          ) : null}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
