import React, { useContext, useEffect } from "react";
import GameCanvas from "../components/GameCanvas.jsx";
import constants, { PLAYER_RADIUS } from "../../shared/constants.js";
import { AppContext } from "../context/AppContext.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

const Game = () => {
  const { nickname, socket, setGameState } = useContext(AppContext);
  const clientPlayers = {};
  const clientBullets = {};
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

    clientPlayers[socket.id].x = Math.max(
      constants.PLAYER_RADIUS,
      Math.min(
        clientPlayers[socket.id].x,
        constants.MAP_SIZE - constants.PLAYER_RADIUS
      )
    );
    clientPlayers[socket.id].y = Math.max(
      constants.PLAYER_RADIUS,
      Math.min(
        clientPlayers[socket.id].y,
        constants.MAP_SIZE - constants.PLAYER_RADIUS
      )
    );

    me.x = clientPlayers[socket.id].x;
    me.y = clientPlayers[socket.id].y;
  };

  const stopMove = (e) => {
    if (!clientPlayers[socket.id]) return;
    switch (e.key) {
      case "w":
        keys.up = false;
        break;
      case "a":
        keys.left = false;
        break;
      case "s":
        keys.down = false;
        break;
      case "d":
        keys.right = false;
        break;
      default:
        break;
    }
  };

  const shoot = (e) => {
    if (!me) return;
    const angle = Math.atan2(
      e.clientY - window.innerHeight / 2,
      e.clientX - window.innerWidth / 2
    );
    socket.emit(constants.SOCKET_EVENTS.SHOOT, {
      x: me.x,
      y: me.y,
      angle,
    });
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
    const camPos = { x: halfWidth - pos.x, y: halfHeight - pos.y };

    // reset
    c.clearRect(0, 0, canvasWidth, canvasHeight);

    c.fillStyle = "black";
    c.fillRect(0, 0, canvasWidth, canvasHeight);

    // draw borders
    c.save();
    c.translate(camPos.x, camPos.y);
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
          camPos.x + player.x,
          camPos.y + player.y,
          constants.PLAYER_RADIUS,
          0,
          Math.PI * 2
        );
        c.closePath();
        c.fill();
        c.fillStyle = "gray";
        c.fillRect(
          camPos.x + player.x - constants.PLAYER_RADIUS * 2,
          camPos.y + player.y - constants.PLAYER_RADIUS * 2,
          PLAYER_RADIUS * 4,
          PLAYER_RADIUS / 2
        );
        c.fillStyle = "red";
        c.fillRect(
          camPos.x + player.x - constants.PLAYER_RADIUS * 2,
          camPos.y + player.y - constants.PLAYER_RADIUS * 2,
          PLAYER_RADIUS * 4 * (player.health / constants.PLAYER_MAX_HP),
          PLAYER_RADIUS / 2
        );
        c.beginPath();
        const rootFontSize = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        c.font = `${rootFontSize * 2}px sans-serif`;
        c.fillStyle = "white";
        const textWidth = c.measureText(player.nickname).width;
        c.fillText(
          player.nickname,
          camPos.x + player.x - textWidth / 2,
          camPos.y + player.y + constants.PLAYER_RADIUS + rootFontSize * 2
        );
        c.closePath();
      }
    });
    Object.keys(clientBullets).forEach((id) => {
      const bullet = clientBullets[id];
      c.beginPath();
      c.beginPath();
      c.fillStyle = bullet.color;
      c.arc(
        camPos.x + bullet.x,
        camPos.y + bullet.y,
        constants.BULLET_RADIUS,
        0,
        Math.PI * 2
      );
      c.closePath();
      c.fill();
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      move(e);
    });
    window.addEventListener("keyup", (e) => {
      stopMove(e);
    });
    window.addEventListener("click", (e) => {
      shoot(e);
    });
    window.setInterval(tickMove, 15);
    socket.emit(constants.SOCKET_EVENTS.JOIN_GAME, nickname);

    return () => {
      window.removeEventListener("keydown", move);
      window.removeEventListener("keyup", stopMove);
      window.removeEventListener("click", shoot);
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

  socket.on(constants.SOCKET_EVENTS.UPDATE_PROJECTILES, ({ serverBullets }) => {
    Object.keys(serverBullets).forEach((id) => {
      if (!clientBullets[id]) {
        clientBullets[id] = serverBullets[id];
      } else {
        clientBullets[id].x += serverBullets[id].velocity.x;
        clientBullets[id].y += serverBullets[id].velocity.y;
      }
    });
    Object.keys(clientBullets).forEach((id) => {
      if (!serverBullets[id]) {
        delete clientBullets[id];
      }
    });
  });

  socket.on(constants.SOCKET_EVENTS.GAME_OVER, ({ message }) => {
    console.log(message);
    setGameState("gameOver");
  });

  return (
    <div className="w-screen h-screen">
      <div className="leaderboard absolute pointer-events-none">
        <Leaderboard />
      </div>
      <GameCanvas draw={draw} />
    </div>
  );
};

export default Game;
