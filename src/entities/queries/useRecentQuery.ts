import { useQuery } from "@tanstack/react-query";
import { gameKeys } from "./gameKeys";
import { gameApi } from "../api/gameApi";

export function useRecentQuery() {
  return useQuery({
    queryKey: gameKeys.recent(),
    queryFn: () => gameApi.getRecent(),
  });
}
