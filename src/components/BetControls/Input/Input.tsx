interface InputProps {
  value: number;
  onChange: (value: number) => void;
}

const Input = ({ value, onChange }: InputProps) => {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        inputMode="decimal"
        min={0}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-(--whiteText)  w-full relative border border-(--border) bg-(--colorBgInput) rounded-[10px] px-3 py-2 outline-none"
      />
    </div>
  );
};

export default Input;
