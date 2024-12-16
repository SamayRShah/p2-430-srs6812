const controllers = require("./controllers");
const mid = require("./middleware");

const router = (app) => {
  // get requests
  app.get(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Game.gamePage
  );
  app.get(
    "/signup",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Game.gamePage
  );
  app.get("/logout", mid.requiresLogin, controllers.Account.logout);
  app.get(
    "/settings",
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Game.gamePage
  );
  app.get("/session", controllers.Account.session);
  app.get("/", mid.requiresSecure, controllers.Game.gamePage);

  app.get("/*", (req, res) => res.redirect("/"));

  // post requests
  app.post(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.login
  );
  app.post(
    "/signup",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.signup
  );
  app.post(
    "/change-password",
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.changePassword
  );

  app.post("/connect-game", mid.requiresSecure, controllers.Game.connectGame);
};

module.exports = router;
