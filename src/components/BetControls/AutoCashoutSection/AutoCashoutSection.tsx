import Input from "../Input/Input";

interface AutoCashoutSectionProps {
  isAutoCashout: boolean;
  autoCashoutInput: number;
  onToggle: () => void;
  onChange: (value: number) => void;
  inputDisabled: boolean;
}

const AutoCashoutSection = ({
  isAutoCashout,
  autoCashoutInput,
  onToggle,
  onChange,
  inputDisabled,
}: AutoCashoutSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-(--text) uppercase">
          Auto Cash out
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAutoCashout}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-12 items-center rounded-full border border-(--border) transition-colors duration-300 ${
            isAutoCashout ? "bg-(--colorBtnCashOut)" : "bg-(--colorBgInput)"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-(--whiteText) transition-transform duration-300 ${
              isAutoCashout ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isAutoCashout && (
        <div className="flex flex-col gap-1">
          <Input
            value={autoCashoutInput}
            onChange={onChange}
            disabled={inputDisabled}
          />
          {autoCashoutInput < 1.01 && (
            <p className="text-[11px] text-(--errorText)">Minimum: 1.01</p>
          )}
        </div>
      )}
    </>
  );
};

export default AutoCashoutSection;
