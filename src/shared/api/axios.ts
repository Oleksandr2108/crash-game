import axios from "axios";
import { STORAGE_KEY } from "../lib/config";

export const httpClient = axios.create({
  baseURL: "https://crash-be-stas.fly.dev/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": STORAGE_KEY,
  },
});
