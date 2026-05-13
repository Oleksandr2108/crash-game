import type { Phase } from "../../../types/Events";
import type { LivePlayerPayload } from "../../../entities/model/types";
import type { PlayerRow, ResultBadge } from "../types";

const accentClasses = [
  "from-indigo-500 to-violet-400",
  "from-pink-500 to-rose-400",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-400 to-amber-300",
  "from-fuchsia-500 to-purple-400",
  "from-lime-500 to-green-400",
];

export const normalizePlayersCount = (value: unknown) => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") return 1;
  return 0;
};

export const buildPlayersFromPayload = (
  payload: LivePlayerPayload[],
): PlayerRow[] => {
  return payload.slice(0, 12).map((player, index) => {
    const name = String(player.username ?? `player_${index + 1}`);

    return {
      id: `${name}-${index}`,
      name,
      amount: Number.isFinite(Number(player.amount))
        ? Number(player.amount)
        : 0,
      accentClass: accentClasses[index % accentClasses.length],
      initial: name[0]?.toUpperCase() || "P",
      status: typeof player.status === "string" ? player.status : "bet",
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
