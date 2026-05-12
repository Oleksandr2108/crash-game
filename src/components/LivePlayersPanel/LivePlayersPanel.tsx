import { useMemo } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { useAuthStore } from "../../stores/useAuthStore";
import IconUsers from '../../assets/icons/IconUsers.svg'
type PlayerRow = {
  id: string;
  name: string;
  amount: number;
  accentClass: string;
  initial: string;
  status: string;
  multiplier: number | null;
};

type LivePlayerPayload = {
  username?: unknown;
  amount?: unknown;
  status?: unknown;
  multiplier?: unknown;
};

const accentClasses = [
  "from-indigo-500 to-violet-400",
  "from-pink-500 to-rose-400",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-400 to-amber-300",
  "from-fuchsia-500 to-purple-400",
  "from-lime-500 to-green-400",
];

const botNames = [
  "crypto_king",
  "moon_walker",
  "stake_master",
  "lucky_seven",
  "bet_ninja",
  "jet_hunter",
  "cashout_pro",
  "risk_taker",
  "hodl_wizard",
  "edge_player",
];

const makeAmount = (index: number) => 10 + ((index * 17) % 18) * 5;

const toSafeNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toStatus = (value: unknown) =>
  typeof value === "string" ? value.toLowerCase() : "bet";

const buildPlayers = (count: number, me: string | null): PlayerRow[] => {
  if (count <= 0) return [];

  const rows: PlayerRow[] = [];
  const safeCount = Math.min(count, 12);

  if (me) {
    rows.push({
      id: "me",
      name: me,
      amount: 50,
      accentClass: accentClasses[0],
      initial: me[0]?.toUpperCase() || "Y",
      status: "bet",
      multiplier: null,
    });
  }

  let botIndex = 0;
  while (rows.length < safeCount) {
    const name = botNames[botIndex % botNames.length];
    rows.push({
      id: `bot-${botIndex}`,
      name,
      amount: makeAmount(botIndex),
      accentClass: accentClasses[(botIndex + 1) % accentClasses.length],
      initial: name[0].toUpperCase(),
      status: "bet",
      multiplier: null,
    });
    botIndex += 1;
  }

  return rows;
};

const buildPlayersFromPayload = (payload: LivePlayerPayload[]): PlayerRow[] => {
  return payload.slice(0, 12).map((player, index) => {
    const name = String(player.username ?? `player_${index + 1}`);
    return {
      id: `${name}-${index}`,
      name,
      amount: toSafeNumber(player.amount, 0),
      accentClass: accentClasses[index % accentClasses.length],
      initial: name[0]?.toUpperCase() || "P",
      status: toStatus(player.status),
      multiplier: Number.isFinite(Number(player.multiplier))
        ? Number(player.multiplier)
        : null,
    };
  });
};

const resultBadge = (
  status: string,
  multiplier: number | null,
  phase: string,
) => {
  if (phase !== "crashed") {
    return { text: "Bet", className: "text-(--yellowColor)" };
  }

  if (status.includes("lost")) {
    return { text: "Lost", className: "text-(--errorText)" };
  }

  if (
    (status.includes("cash") || status.includes("win")) &&
    multiplier != null &&
    multiplier > 0
  ) {
    return {
      text: `${multiplier.toFixed(2)}x`,
      className: "text-(--highText)",
    };
  }

  return { text: "Bet", className: "text-(--yellowColor)" };
};

const LivePlayersPanel = () => {
  const rawPlayers = useGameStore((s) => s.players as unknown);
  const phase = useGameStore((s) => s.phase);
  const myName = useAuthStore((s) => s.apiKey);

  const payloadPlayers = useMemo(
    () =>
      Array.isArray(rawPlayers) ? (rawPlayers as LivePlayerPayload[]) : [],
    [rawPlayers],
  );

  const playersCount = Array.isArray(rawPlayers)
    ? rawPlayers.length
    : toSafeNumber(rawPlayers, 0);

  const players = useMemo(
    () =>
      payloadPlayers.length > 0
        ? buildPlayersFromPayload(payloadPlayers)
        : buildPlayers(playersCount, myName),
    [playersCount, myName, payloadPlayers],
  );

  return (
    <aside className="w-full rounded-[20px] border border-(--border) bg-(--colorBg) p-4 xl:w-65">
      <div className="mb-4 flex items-center gap-2 text-(--text)">
        <img
          src={IconUsers}
          alt="Live Players"
          className="w-4 h-4"
        />
        <h3 className="text-[12px] uppercase tracking-[0.2em]">
          Live Players ({playersCount})
        </h3>
      </div>

      {players.length === 0 ? (
        <p className="rounded-[14px] border border-(--border) bg-(--colorBgInput) p-4 text-[13px] text-(--text)">
          Waiting for players...
        </p>
      ) : (
        <ul className="space-y-3">
          {players.map((player) => {
            // After crash we show final outcome: Lost or cashout multiplier.
            const badge = resultBadge(player.status, player.multiplier, phase);

            return (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-2xl border border-[#111a2c] bg-[#0f1728] px-3 py-3"
              >
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

                <span className={`text-[12px] ${badge.className}`}>
                  {badge.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};

export default LivePlayersPanel;
