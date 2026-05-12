import IconUsers from "../../../assets/icons/IconUsers.svg";

type LivePlayersHeaderProps = {
  playersCount: number;
};

const LivePlayersHeader = ({ playersCount }: LivePlayersHeaderProps) => {
  return (
    <div className="mb-4 flex items-center gap-2 text-(--text)">
      <img
        src={IconUsers}
        alt="Live Players"
        className="h-4 w-4"
      />
      <h3 className="text-[12px] uppercase tracking-[0.2em]">
        Live Players ({playersCount})
      </h3>
    </div>
  );
};

export default LivePlayersHeader;
