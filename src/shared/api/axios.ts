import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://crash-be-stas.fly.dev/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Player-Id": "9999",
  },
});
