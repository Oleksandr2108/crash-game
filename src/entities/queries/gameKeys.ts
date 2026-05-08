export const gameKeys = {
  all: ["game"] as const,
  balance: () => [...gameKeys.all, "balance"] as const,
  recent: () => [...gameKeys.all, "recent"] as const,
};
