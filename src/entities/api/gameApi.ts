import { httpClient } from "../../shared/api/axios";
import type { BalanceResponse } from "../model/types";

export const gameApi = {
  async getBalance(apiKey: string): Promise<BalanceResponse> {
    const response = await httpClient.get("balance", {
      headers: { "X-API-Key": apiKey },
    });
    return response.data;
  },
  async getRecent(apiKey: string) {
    const response = await httpClient.get("rounds/recent?limit=10", {
      headers: { "X-API-Key": apiKey },
    });
    return response.data;
  },
};
