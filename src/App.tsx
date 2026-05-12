import "./App.css";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocket } from "./shared/hooks/useSocket";
import GamePage from "./pages/GamePage";
import Footer from "./components/Footer/Footer";

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
  return <>{apiKey ? <GameLayout /> : <LoginPage />}</>;
}

export default App;
