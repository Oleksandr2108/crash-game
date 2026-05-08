import { httpClient } from "../../shared/api/axios";
import type { BalanceResponse } from "../model/types";

export const gameApi = {
  async getBalance(): Promise<BalanceResponse> {
    const response = await httpClient.get("/balance");
    return response.data;
  },
  async getRecent() {
    const response = await httpClient.get("/rounds/recent");
    return response.data;
  },
};
