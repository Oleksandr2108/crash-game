interface BoxTagProps {
  text: string | number;
  onClick?: () => void;

  disabled?: boolean;
}

const BoxTag: React.FC<BoxTagProps> = ({ text, onClick, disabled = false }) => {
  return (
    <div
      className={`flex items-center justify-center py-2 w-full bg-(--colorBgInput) rounded-lg
        border border-(--border)
         ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
        text-[12px] text-(--text)  `}
      onClick={disabled ? undefined : onClick}
    >
      {text}
    </div>
  );
};

export default BoxTag;
