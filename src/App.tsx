import "./App.css";

import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocket } from "./shared/hooks/useSocket";
import GamePage from "./pages/GamePage";

function GameLayout() {
  useSocket();
  return <GamePage />;
}

function App() {
  const apiKey = useAuthStore((state) => state.apiKey);
  return <>{apiKey ? <GameLayout /> : <LoginPage />}</>;
}

export default App;
