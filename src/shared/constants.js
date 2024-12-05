module.exports = Object.freeze({
  // map
  MAP_SIZE: 3000, // 3000,

  // player consts
  PLAYER_MAX_HP: 100, // TODO
  PLAYER_RADIUS: 20,
  PLAYER_SPEED: 30,
  PLAYER_COOLDOWN: 0.25, // TODO

  // bullet consts - TODO
  BULLET_RADIUS: 3,
  BULLET_SPEED: 1000,
  BULLET_DAMAGE: 10,

  // scoring - TODO
  SCORE_DAMAGE: 20,
  SCORE_KILL: 100,
  SCORE_PER_SECOND: 1,

  SOCKET_EVENTS: {
    JOIN_GAME: "join_game",
    LEAVE_GAME: "leave_game",
    INPUTS: "inputs",
    UPDATE_PLAYERS: "update_players",
    GAME_UPDATE: "update_game", // TODO
    GAME_OVER: "dead", // TODO
  },
});
