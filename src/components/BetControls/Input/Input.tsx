interface InputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Input = ({ value, onChange, disabled = false }: InputProps) => {
  const handleChange = (rawValue: string) => {
    const normalized = rawValue.replace(",", ".");
    if (!/^\d*(\.\d*)?$/.test(normalized)) return;

    if (normalized === "") {
      onChange(0);
      return;
    }

    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="relative mt-4">
      <input
        type="text"
        inputMode="decimal"
        value={Number.isFinite(value) ? String(value) : ""}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        className="text-(--whiteText) w-full relative border border-(--border) bg-(--colorBgInput) rounded-[10px] px-3 py-2 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;
