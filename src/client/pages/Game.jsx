import React, { useContext, useEffect } from "react";
import GameCanvas from "../components/GameCanvas.jsx";
import constants from "../../shared/constants.js";
import { AppContext } from "../context/AppContext.jsx";

const Game = () => {
  const { nickname, socket } = useContext(AppContext);
  const clientPlayers = {};
  let me = {};

  const keys = {
    up: false,
    left: false,
    down: false,
    right: false,
  };

  const tickMove = () => {
    socket.emit(constants.SOCKET_EVENTS.INPUTS, { keys });
  };

  const move = (e) => {
    if (!clientPlayers[socket.id]) return;
    switch (e.key) {
      case "w":
        clientPlayers[socket.id].y -= constants.PLAYER_SPEED;
        keys.up = true;
        break;
      case "a":
        clientPlayers[socket.id].x -= constants.PLAYER_SPEED;
        keys.left = true;
        break;
      case "s":
        clientPlayers[socket.id].y += constants.PLAYER_SPEED;
        keys.down = true;
        break;
      case "d":
        clientPlayers[socket.id].x += constants.PLAYER_SPEED;
        keys.right = true;
        break;
      default:
        break;
    }
    me.x = clientPlayers[socket.id].x;
    me.y = clientPlayers[socket.id].y;
  };

  const stopMove = (e) => {
    if (!clientPlayers[socket.id]) return;
    switch (e.key) {
      case "w":
        // clientPlayers[socket.id].y -= constants.PLAYER_SPEED;
        keys.up = false;
        break;
      case "a":
        // clientPlayers[socket.id].x -= constants.PLAYER_SPEED;
        keys.left = false;
        break;
      case "s":
        // clientPlayers[socket.id].y += constants.PLAYER_SPEED;
        keys.down = false;
        break;
      case "d":
        // clientPlayers[socket.id].x += constants.PLAYER_SPEED;
        keys.right = false;
        break;
      default:
        break;
    }
  };

  const draw = (context) => {
    const c = context;
    const canvasWidth = c.canvas.width;
    const canvasHeight = c.canvas.height;
    const halfWidth = canvasWidth / 2;
    const halfHeight = canvasHeight / 2;

    const pos = { x: 0, y: 0 };
    if (me) {
      pos.x = me.x;
      pos.y = me.y;
    }

    // reset
    c.clearRect(0, 0, canvasWidth, canvasHeight);

    c.fillStyle = "black";
    c.fillRect(0, 0, canvasWidth, canvasHeight);

    // draw borders
    c.save();
    c.translate(halfWidth - pos.x, halfHeight - pos.y);
    c.lineWidth = 10;
    c.strokeStyle = "white";
    c.strokeRect(0, 0, constants.MAP_SIZE, constants.MAP_SIZE);
    c.restore();

    Object.keys(clientPlayers).forEach((id) => {
      const player = clientPlayers[id];
      if (id === socket.id) {
        c.beginPath();
        c.fillStyle = player.color;
        c.arc(halfWidth, halfHeight, constants.PLAYER_RADIUS, 0, Math.PI * 2);
        c.closePath();
        c.fill();
      } else {
        c.beginPath();
        c.fillStyle = player.color;
        c.arc(
          halfWidth + player.x - pos.x,
          halfHeight + player.y - pos.y,
          constants.PLAYER_RADIUS,
          0,
          Math.PI * 2
        );
        c.closePath();
        c.fill();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      move(e);
    });
    window.addEventListener("keyup", (e) => {
      stopMove(e);
    });
    window.setInterval(tickMove, 15);
    socket.emit(constants.SOCKET_EVENTS.JOIN_GAME, nickname);

    return () => {
      window.removeEventListener("click");
      window.clearInterval(tickMove);
      socket.emit(constants.SOCKET_EVENTS.LEAVE_GAME);
    };
  }, []);

  socket.on(constants.SOCKET_EVENTS.UPDATE_PLAYERS, ({ serverPlayers }) => {
    Object.keys(serverPlayers).forEach((id) => {
      const serverPlayer = serverPlayers[id];
      if (id === socket.id) {
        me = serverPlayer;
      }
      if (!clientPlayers[id]) {
        clientPlayers[id] = serverPlayer;
      } else {
        clientPlayers[id] = serverPlayer;
      }
    });

    Object.keys(clientPlayers).forEach((id) => {
      if (!serverPlayers[id]) {
        delete clientPlayers[id];
      }
    });
  });

  return (
    <div className="w-screen h-screen">
      <GameCanvas draw={draw} />
    </div>
  );
};

export default Game;
