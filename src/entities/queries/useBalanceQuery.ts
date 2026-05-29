import { useQuery } from "@tanstack/react-query";
import { gameKeys } from "./gameKeys";
import { gameApi } from "../api/gameApi";
import { useAuthStore } from "../../stores/useAuthStore";

export function useBalanceQuery() {
  const apiKey = useAuthStore((s) => s.apiKey);
  return useQuery({
    queryKey: gameKeys.balance(),
    queryFn: () => gameApi.getBalance(apiKey!),
    enabled: !!apiKey,
  });
}
