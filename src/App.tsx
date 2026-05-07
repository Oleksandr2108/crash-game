import "./App.css";
import BetControls from "./components/BetControls/BetControls";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocket } from "./shared/hooks/useSocket";

function GameLayout() {
  useSocket();
  return <BetControls />;
}

function App() {
  const apiKey = useAuthStore((state) => state.apiKey);
  return <>{apiKey ? <GameLayout /> : <LoginPage />}</>;
}

export default App;
