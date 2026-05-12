interface InputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Input = ({ value, onChange, disabled = false }: InputProps) => {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        inputMode="decimal"
        min={0}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-(--whiteText) w-full relative border border-(--border) bg-(--colorBgInput) rounded-[10px] px-3 py-2 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;
