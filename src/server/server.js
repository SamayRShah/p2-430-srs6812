// imports
require("dotenv").config();
const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");
const { createServer } = require("http");
const { Server } = require("socket.io");

// router
const router = require("./router.js");
const initGame = require("./game.js");

// hosting port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// connect to mongo
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then((instance) => {
    console.log(`Connected to mongo instance: ${instance.version}`);
  })
  .catch((err) => {
    console.log("Could not connect to database");
    throw err;
  });

// connect to redis cloud
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
redisClient.on("error", (err) => console.log("Redis Client Error: ", err));

redisClient.connect().then(() => {
  // routes
  const app = express();
  const server = createServer(app);
  const io = new Server(server, { pingInterval: 2000, pingTimer: 5000 });

  app.use(helmet());
  app.use(
    "/assets",
    express.static(path.resolve(`${__dirname}/../../hosted/`))
  );
  app.use(favicon(`${__dirname}/../../hosted/img/favicon.png`));
  app.use(compression());
  app.use(express.json());

  app.use(
    session({
      key: "sessionid",
      store: new RedisStore({ client: redisClient }),
      secret: "io gamer",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "" }));
  app.set("view engine", "handlebars");
  app.set("views", `${__dirname}/../../views`);

  router(app);

  initGame(io);

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port: ${port}`);
  });
});
