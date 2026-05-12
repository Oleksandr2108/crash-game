import type { Phase } from "../../../types/Events";
import type { LivePlayerPayload, PlayerRow, ResultBadge } from "../types";

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

export const toSafeNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toStatus = (value: unknown) =>
  typeof value === "string" ? value.toLowerCase() : "bet";

export const buildPlayers = (count: number, me: string | null): PlayerRow[] => {
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

export const buildPlayersFromPayload = (
  payload: LivePlayerPayload[],
): PlayerRow[] => {
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

export const resultBadge = (
  status: string,
  multiplier: number | null,
  phase: Phase,
): ResultBadge => {
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
