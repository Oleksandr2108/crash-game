import { useState } from "react";
import Logo from "../assets/logo.svg";
import Button from "../shared/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPage = () => {
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const [value, setValue] = useState("");

  const handleLogin = () => {
    const v = value.trim();
    if (!v) return;
    setApiKey(v);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-auto">
      <img
        src={Logo}
        alt="logo"
      />
      <h1 className="text-[36px] text-(--whiteText)">
        <span className="text-(--yellowColor)">Crash</span> Game
      </h1>
      <p className="text-[16px] text-(--text)">
        High-stakes real-time betting. Cash out before the crash.
      </p>

      <div className=" border border-(--border) rounded-[14px] w-md p-6 bg-(--colorBg)">
        <h2 className="text-[12px] text-(--text) uppercase">Username</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 rounded-[10px] border border-(--border) bg-(--colorBgInput) text-(--whiteText) placeholder:(text-(--textSecondary)) my-2"
        />
        <p className="text-[12px] text-(--textSecondary) mb-6">
          Minimum 3 characters required
        </p>

        <Button
          text="Join Game"
          onClick={handleLogin}
          disabled={value.trim().length < 3}
        />
      </div>

      <p className="text-[12px] text-(--textSecondary)">
        Demo mode - Play responsibly
      </p>
    </div>
  );
};

export default LoginPage;
