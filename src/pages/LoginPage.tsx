import { useState } from "react";
import Logo from "../assets/logo.svg";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPage = () => {
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const [value, setValue] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="border border-(--border) rounded-[14px] w-md p-6 bg-(--colorBg)">
        <h2 className="text-[12px] text-(--text) uppercase">Username</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 rounded-[10px] border border-(--border) bg-(--colorBgInput) text-(--whiteText) placeholder:(text-(--textSecondary)) my-2"
        />
        <p className="text-[12px] text-(--textSecondary)">
          Minimum 3 characters required
        </p>
        <button
          onClick={handleLogin}
          className="w-full  py-4 bg-(--yellowColor) disabled:bg-(--textSecondary) disabled:cursor-not-allowed text-(--colorBg) rounded-[8px] font-bold mt-6 cursor-pointer"
          disabled={value.trim().length < 1}
        >
          Join Game
        </button>
      </div>
      <p className="text-[12px] text-(--textSecondary)">
        Demo mode • Play responsibly
      </p>
    </div>
  );
};

export default LoginPage;
