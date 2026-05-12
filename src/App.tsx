import "./App.css";

import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocket } from "./shared/hooks/useSocket";
import GamePage from "./pages/GamePage";
import Footer from "./components/Footer/Footer";

function GameLayout() {
  useSocket();
  return (
    <>
      <div className="h-dvh w-full px-4 py-4 sm:px-6 lg:px-10 overflow-hidden pb-14">
        <GamePage />
      </div>
      <Footer />
    </>
  );
}

function App() {
  const apiKey = useAuthStore((state) => state.apiKey);
  return <>{apiKey ? <GameLayout /> : <LoginPage />}</>;
}

export default App;
