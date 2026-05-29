import { useState } from "react";
import Logo from "../assets/logo.svg";
import Button from "../shared/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPage = () => {
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(false);

  const isAscii = (s: string) => /^[\x20-\x7E]+$/.test(s);
  const trimmed = value.trim();
  const isValid = trimmed.length >= 3 && isAscii(trimmed);

  const handleLogin = () => {
    if (!isValid) return;
    setApiKey(trimmed, remember);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 m-auto">
      <img
        src={Logo}
        alt="logo"
        className="w-16 min-[770px]:w-auto"
      />
      <h1 className="text-[28px] min-[770px]:text-[36px] text-(--whiteText)">
        <span className="text-(--yellowColor)">Crash</span> Game
      </h1>
      <p className="text-[14px] min-[770px]:text-[16px] text-(--text) text-center">
        High-stakes real-time betting. Cash out before the crash.
      </p>

      <div className="w-full max-w-md border border-(--border) rounded-[14px] p-5 min-[770px]:p-6 bg-(--colorBg)">
        <h2 className="text-[12px] text-(--text) uppercase">Username</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 rounded-[10px] border border-(--border) bg-(--colorBgInput) text-(--whiteText) placeholder:(text-(--textSecondary)) my-2 outline-none"
        />
        <p className="text-[12px] mb-4 text-(--textSecondary)">
          {value.length > 0 && !isAscii(value.trim())
            ? "Only Latin letters and symbols allowed"
            : "Minimum 3 characters required"}
        </p>

        <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
              remember
                ? "bg-(--yellowColor) border-(--yellowColor)"
                : "bg-transparent border-(--border)"
            }`}
          >
            {remember && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#0f1728"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="text-[13px] text-(--text)">Remember me</span>
        </label>

        <Button
          text="Join Game"
          onClick={handleLogin}
          disabled={!isValid}
        />
      </div>

      <p className="text-[12px] text-(--textSecondary)">
        Demo mode - Play responsibly
      </p>
    </div>
  );
};

export default LoginPage;
