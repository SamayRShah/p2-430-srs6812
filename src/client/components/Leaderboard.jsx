import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import constants from "../../shared/constants.js";

const Leaderboard = () => {
  const { socket } = useContext(AppContext);
  const [leaderboard, setLeaderboard] = useState([]);
  let me;

  useEffect(() => {
    socket.on(constants.SOCKET_EVENTS.UPDATE_PLAYERS, ({ serverPlayers }) => {
      const sortedPlayers = Object.values(serverPlayers)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      const currentPlayer = serverPlayers[socket.id];
      me = currentPlayer || null;
      setLeaderboard(sortedPlayers);
    });
    return () => {
      socket.off(constants.SOCKET_EVENTS.UPDATE_PLAYERS);
    };
  }, [socket]);

  return (
    <div className="bg-slate-800 rounded-lg m-4 p-4 pointer-events-none">
      <h1 className="pointer-events-none">Leaderboard</h1>
      <ol className="pointer-events-none">
        {leaderboard.map((player) => (
          <li
            key={player.id}
            className={
              player.id === socket.id
                ? "text-error pointer-events-none"
                : "text-white pointer-events-none"
            }
          >
            {player.nickname}: {player.score}
          </li>
        ))}
      </ol>
      {me && !leaderboard[socket.id] && (
        <p className="text-error pointer-events-none">
          {me.nickname}: {me.score}
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
