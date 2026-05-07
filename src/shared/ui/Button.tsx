interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text: string;
}

const Button = ({ onClick, disabled, text }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full  py-4 bg-(--yellowColor) disabled:bg-(--textSecondary) disabled:cursor-not-allowed text-(--colorBg) rounded-lg font-bold  cursor-pointer"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
