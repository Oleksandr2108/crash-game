import "./App.css";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const apiKey = useAuthStore((state) => state.apiKey);
  return <>{apiKey ? <h1 className="text-[36px] text-(--whiteText)">Game Page</h1> : <LoginPage />}</>;
}

export default App;
