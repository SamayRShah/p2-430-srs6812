const constants = require("../shared/constants.js");

const initGame = (io) => {
  const serverPlayers = {};
  const serverBullets = {};
  let bulletId = 0;

  io.on("connect", (socket) => {
    console.log(`connected socket: ${socket.id}`);

    socket.on(constants.SOCKET_EVENTS.JOIN_GAME, ({ nickname }) => {
      serverPlayers[socket.id] = {
        x: constants.MAP_SIZE * 0.75 * Math.random(),
        y: constants.MAP_SIZE * 0.75 * Math.random(),
        nickname,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        score: 0,
        health: constants.PLAYER_MAX_HP,
        id: socket.id,
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
        constants.PLAYER_RADIUS,
        Math.min(
          serverPlayers[socket.id].x,
          constants.MAP_SIZE - constants.PLAYER_RADIUS
        )
      );
      serverPlayers[socket.id].y = Math.max(
        constants.PLAYER_RADIUS,
        Math.min(
          serverPlayers[socket.id].y,
          constants.MAP_SIZE - constants.PLAYER_RADIUS
        )
      );
    });

    socket.on(constants.SOCKET_EVENTS.SHOOT, ({ x, y, angle }) => {
      if (!serverPlayers[socket.id]) return;
      bulletId++;
      serverBullets[bulletId] = {
        x,
        y,
        velocity: {
          x: constants.BULLET_SPEED * Math.cos(angle),
          y: constants.BULLET_SPEED * Math.sin(angle),
        },
        color: serverPlayers[socket.id].color,
        player: socket.id,
      };
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
    Object.keys(serverBullets).forEach((id) => {
      const bullet = serverBullets[id];

      // Move the bullet based on velocity
      bullet.x += bullet.velocity.x;
      bullet.y += bullet.velocity.y;

      // Remove the bullet if it's out of bounds
      if (
        bullet.x + constants.BULLET_RADIUS > constants.MAP_SIZE ||
        bullet.x - constants.BULLET_RADIUS < 0 ||
        bullet.y + constants.BULLET_RADIUS > constants.MAP_SIZE ||
        bullet.y - constants.BULLET_RADIUS < 0
      ) {
        delete serverBullets[id];
      } else {
        // Check for collisions with players
        Object.keys(serverPlayers).forEach((pID) => {
          if (bullet.player !== pID) {
            const player = serverPlayers[pID];

            // Calculate the distance between the bullet and the player
            const DISTANCE = Math.hypot(
              bullet.x - player.x,
              bullet.y - player.y
            );

            // If the distance is less than or equal to the sum of the player and bullet radii, it's a hit
            if (DISTANCE <= constants.BULLET_RADIUS + constants.PLAYER_RADIUS) {
              // Update score of the player who shot the bullet
              if (serverPlayers[bullet.player]) {
                serverPlayers[bullet.player].score += constants.SCORE_DAMAGE;
              }

              // Delete the bullet and the player from the game
              delete serverBullets[id]; // Remove the bullet
              serverPlayers[pID].health -= constants.BULLET_DAMAGE;
              if (serverPlayers[pID].health <= 0) {
                serverPlayers[bullet.player].score += constants.SCORE_KILL;
                delete serverPlayers[pID];
                io.to(pID).emit(constants.SOCKET_EVENTS.GAME_OVER, {
                  message: `${player.nickname} has died.`,
                });
              }
            }
          }
        });
      }
    });

    // add player health regen, and cap it to max hp, and add survival score
    Object.keys(serverPlayers).forEach((player) => {
      serverPlayers[player].health += constants.PLAYER_REGEN;
      serverPlayers[player].health = Math.min(
        serverPlayers[player].health,
        constants.PLAYER_MAX_HP
      );
      // multiply by 15/1000 to get seconds (15 is tickrate in ms)
      serverPlayers[player].score += (constants.SCORE_PER_SECOND * 15) / 1000;
    });

    // Emit updated player and bullet states
    io.emit(constants.SOCKET_EVENTS.UPDATE_PLAYERS, { serverPlayers });
    io.emit(constants.SOCKET_EVENTS.UPDATE_PROJECTILES, { serverBullets });
  }, 15);
};

module.exports = initGame;
