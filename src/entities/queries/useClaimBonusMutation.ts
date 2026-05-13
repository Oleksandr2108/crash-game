import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameApi } from "../api/gameApi";
import { gameKeys } from "./gameKeys";

export function useClaimBonusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameApi.claimBonus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: gameKeys.balance() });
    },
  });
}
