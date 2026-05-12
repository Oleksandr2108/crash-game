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
    const response = await httpClient.get("rounds/recent", {
      headers: { "X-API-Key": apiKey },
    });
    return response.data;
  },
};
