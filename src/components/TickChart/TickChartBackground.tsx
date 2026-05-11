interface TickChartBackgroundProps {
  isCrashed: boolean;
}

const TickChartBackground = ({ isCrashed }: TickChartBackgroundProps) => {
  return (
    <div
      className={`absolute inset-0 ${
        isCrashed
          ? "bg-[radial-gradient(110%_95%_at_0%_100%,rgba(255,78,96,0.34)_0%,rgba(255,78,96,0.10)_38%,rgba(255,78,96,0.00)_75%)]"
          : "bg-[radial-gradient(110%_95%_at_0%_100%,rgba(34,231,132,0.34)_0%,rgba(34,231,132,0.10)_38%,rgba(34,231,132,0.00)_75%)]"
      }`}
    />
  );
};

export default TickChartBackground;
