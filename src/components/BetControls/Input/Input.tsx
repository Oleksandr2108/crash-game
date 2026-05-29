import { useState } from "react";

interface InputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Input = ({ value, onChange, disabled = false }: InputProps) => {
  const externalValue = Number.isFinite(value) ? String(value) : "";
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(externalValue);

  const handleChange = (rawValue: string) => {
    const normalized = rawValue.replace(",", ".");
    if (!/^\d*(\.\d*)?$/.test(normalized)) return;

    setDraftValue(normalized);

    if (normalized === "") {
      onChange(0);
      return;
    }

    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setDraftValue(externalValue);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (draftValue === "" || draftValue.endsWith(".")) {
      const normalized = draftValue.replace(/\.$/, "");
      const parsed = Number(normalized || "0");
      if (Number.isFinite(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="relative mt-4">
      <input
        type="text"
        inputMode="decimal"
        value={isEditing ? draftValue : externalValue}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => handleChange(e.target.value)}
        className="text-(--whiteText) w-full relative border border-(--border) bg-(--colorBgInput) rounded-[10px] px-3 py-2 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;
