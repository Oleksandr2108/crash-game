import "./App.css";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocket } from "./app/hooks/useSocket";
import GamePage from "./pages/GamePage";
import Footer from "./components/Footer/Footer";
import { Toaster } from "sonner";

function GameLayout() {
  useSocket();
  const [isPlayersMenuOpen, setIsPlayersMenuOpen] = useState(false);

  const togglePlayersMenu = () => {
    setIsPlayersMenuOpen((prev) => !prev);
  };

  const closePlayersMenu = () => {
    setIsPlayersMenuOpen(false);
  };

  return (
    <>
      <div className="h-dvh w-full overflow-x-hidden overflow-y-auto px-4 py-4 pb-14 sm:px-6 lg:px-10 min-[770px]:overflow-hidden">
        <GamePage
          isPlayersMenuOpen={isPlayersMenuOpen}
          onClosePlayersMenu={closePlayersMenu}
        />
      </div>
      <Footer onPlayersClick={togglePlayersMenu} />
    </>
  );
}

function App() {
  const apiKey = useAuthStore((state) => state.apiKey);
  return (
    <>
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),rgba(15,23,42,0.96)_55%,rgba(2,6,23,0.98)_100%)] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl",
            title: "text-white font-semibold tracking-wide",
            description: "text-slate-300",
            closeButton:
              "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
            success: "border-emerald-400/30",
            error: "border-rose-400/30",
            info: "border-sky-400/30",
            warning: "border-amber-400/30",
            loading: "border-violet-400/30",
          },
        }}
      />
      {apiKey ? (
        <GameLayout />
      ) : (
        <div className="flex h-dvh w-full items-center justify-center overflow-y-auto px-4 py-8">
          <LoginPage />
        </div>
      )}
    </>
  );
}

export default App;
