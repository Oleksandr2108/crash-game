import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { gameApi } from "../api/gameApi";
import { gameKeys } from "./gameKeys";
import type { BonusClaimResponse } from "../model/types";

const formatRetryDuration = (response: BonusClaimResponse) => {
  const retryMs =
    response.retryAfterMs ||
    new Date(response.nextClaimAt).getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.ceil(retryMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

const showCooldownToast = (response: BonusClaimResponse) => {
  toast.error("Bonus is on cooldown", {
    description: `Try again in ${formatRetryDuration(response)}.`,
  });
};

export function useClaimBonusMutation() {
  const queryClient = useQueryClient();

  return useMutation<BonusClaimResponse, AxiosError<BonusClaimResponse>>({
    mutationFn: gameApi.claimBonus,
    onSuccess: async (response) => {
      if (response.claimed) {
        toast.success("Bonus claimed successfully", {
          description: `+${response.amount} USD added to your balance.`,
        });
        await queryClient.invalidateQueries({ queryKey: gameKeys.balance() });
        return;
      }

      showCooldownToast(response);
    },
    onError: (error) => {
      const response = error.response?.data;
      if (response) {
        showCooldownToast(response);
        return;
      }

      toast.error("Bonus claim failed", {
        description: "Please try again in a moment.",
      });
    },
  });
}
