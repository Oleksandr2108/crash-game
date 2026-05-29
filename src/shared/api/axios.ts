import axios from "axios";
import { STORAGE_KEY } from "../lib/config";

export const httpClient = axios.create({
  baseURL: "https://crash-be-stas.fly.dev/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const apiKey =
    localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

  if (apiKey) {
    config.headers["X-API-Key"] = apiKey.trim();
  }

  return config;
});
