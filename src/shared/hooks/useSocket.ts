import { useEffect } from "react";
import { getSocket, disconnectSocket } from "../api/socket";
// import { useGameStore } from "../../stores/useGameStore";

export function useSocket() {
  useEffect(() => {
    const socket = getSocket();
    // const store = useGameStore.getState;

    // socket.on("game:start", () => store().onGameStart());
    // socket.on("game:multiplier", (multiplier: number) =>
    //   store().onMultiplierUpdate(multiplier),
    // );
    // socket.on("game:crash", ({ crashPoint }: { crashPoint: number }) =>
    //   store().onGameCrash(crashPoint),
    // );

    // return () => {
    //   socket.off("game:start");
    //   socket.off("game:multiplier");
    //   socket.off("game:crash");
    //   disconnectSocket();
    // };

    socket.on("round:tick", (data) => {
      console.log("Round tick:", data);
    });

    return () => {
      socket.off("round:tick");
      disconnectSocket();
    };
  }, []);
}
