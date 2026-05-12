import { useQuery } from "@tanstack/react-query";
import { gameKeys } from "./gameKeys";
import { gameApi } from "../api/gameApi";
import { useAuthStore } from "../../stores/useAuthStore";

export function useRecentQuery() {
  const apiKey = useAuthStore((s) => s.apiKey);
  return useQuery({
    queryKey: gameKeys.recent(),
    queryFn: () => gameApi.getRecent(apiKey!),
    enabled: !!apiKey,
  });
}
