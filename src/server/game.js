const constants = require("../shared/constants.js");

const initGame = (io) => {
  const serverPlayers = {};

  io.on("connect", (socket) => {
    console.log(`connected socket: ${socket.id}`);

    socket.on(constants.SOCKET_EVENTS.JOIN_GAME, ({ nickname }) => {
      serverPlayers[socket.id] = {
        x: constants.MAP_SIZE * 0.75 * Math.random(),
        y: constants.MAP_SIZE * 0.75 * Math.random(),
        nickname,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      };

      io.emit(constants.SOCKET_EVENTS.UPDATE_PLAYERS, { serverPlayers });
    });

    socket.on(constants.SOCKET_EVENTS.LEAVE_GAME, () => {
      console.log(`socket ${socket.id} left`);
      if (serverPlayers[socket.id]) {
        delete serverPlayers[socket.id];
        io.emit(constants.SOCKET_EVENTS.UPDATE_PLAYERS, { serverPlayers });
      }
    });

    const moves = {
      up: { dir: "y", value: -constants.PLAYER_SPEED },
      left: { dir: "x", value: -constants.PLAYER_SPEED },
      down: { dir: "y", value: constants.PLAYER_SPEED },
      right: { dir: "x", value: constants.PLAYER_SPEED },
    };

    socket.on(constants.SOCKET_EVENTS.INPUTS, ({ keys }) => {
      if (!serverPlayers[socket.id]) return;
      Object.keys(keys).forEach((key) => {
        if (keys[key]) {
          serverPlayers[socket.id][moves[key].dir] += moves[key].value;
        }
      });
      serverPlayers[socket.id].x = Math.max(
        0,
        Math.min(serverPlayers[socket.id].x, constants.MAP_SIZE)
      );
      serverPlayers[socket.id].y = Math.max(
        0,
        Math.min(serverPlayers[socket.id].y, constants.MAP_SIZE)
      );
    });

    socket.on("disconnect", () => {
      console.log(`disconnected socket: ${socket.id}`);
      if (serverPlayers[socket.id]) {
        delete serverPlayers[socket.id];
        io.emit(constants.SOCKET_EVENTS.UPDATE_PLAYERS, { serverPlayers });
      }
    });
  });

  setInterval(() => {
    io.emit(constants.SOCKET_EVENTS.UPDATE_PLAYERS, { serverPlayers });
  }, 15);
};

module.exports = initGame;
