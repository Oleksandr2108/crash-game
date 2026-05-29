import type { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text: ReactNode;
  className?: string;
}

const Button = ({ onClick, disabled, text, className }: ButtonProps) => {
  const hasCustomDisabledBg = className?.includes("disabled:bg-");

  return (
    <button
      onClick={onClick}
      className={`w-full py-4 ${className ? "" : "bg-(--yellowColor)"} ${!hasCustomDisabledBg ? "disabled:bg-(--textSecondary)" : ""} disabled:cursor-not-allowed text-(--colorBg) rounded-lg font-bold cursor-pointer ${className ?? ""}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
