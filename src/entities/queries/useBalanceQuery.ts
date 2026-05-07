import { useQuery } from "@tanstack/react-query";
import { gameKeys } from "./gameKeys";
import { gameApi } from "../api/gameApi";

export function useBalanceQuery() {
  return useQuery({
    queryKey: gameKeys.balance(),
    queryFn: () => gameApi.getBalance(),
  });
}
