import { create } from "zustand";
import { STORAGE_KEY } from "../shared/lib/config";

interface AuthState {
  apiKey: string | null;
  setApiKey: (key: string, persist?: boolean) => void;
  logout: () => void;
}

const initial = (() => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
  );
})();

export const useAuthStore = create<AuthState>((set) => ({
  apiKey: initial,
  setApiKey: (key, persist = false) => {
    if (typeof window !== "undefined") {
      if (persist) {
        localStorage.setItem(STORAGE_KEY, key);
      } else {
        sessionStorage.setItem(STORAGE_KEY, key);
      }
    }
    set({ apiKey: key });
  },
  logout: () => {
    set({ apiKey: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  },
}));
