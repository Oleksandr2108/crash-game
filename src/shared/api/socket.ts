import { io, Socket } from "socket.io-client";
import { WS_URL } from "../lib/config";
import { useAuthStore } from "../../stores/useAuthStore";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  const apiKey = useAuthStore.getState().apiKey;
  if (!apiKey) throw new Error("Cannot connect WS without apiKey");
  socket = io(WS_URL, { auth: { apiKey } });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
