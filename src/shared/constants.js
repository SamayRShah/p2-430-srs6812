module.exports = Object.freeze({
  // map
  MAP_SIZE: 3000,
  // player consts
  PLAYER_MAX_HP: 100,
  PLAYER_RADIUS: 20,
  PLAYER_SPEED: 15,
  PLAYER_REGEN: 0.05,

  // bullet consts
  BULLET_RADIUS: 5,
  BULLET_SPEED: 25,
  BULLET_DAMAGE: 10,

  SCORE_DAMAGE: 20,
  SCORE_KILL: 100,
  SCORE_PER_SECOND: 1,

  SOCKET_EVENTS: {
    JOIN_GAME: "join_game",
    LEAVE_GAME: "leave_game",
    INPUTS: "inputs",
    UPDATE_PLAYERS: "update_players",
    UPDATE_PROJECTILES: "update_projectiles",
    SHOOT: "shoot",
    GAME_UPDATE: "update_game", // TODO
    GAME_OVER: "dead", // TODO
  },
});
