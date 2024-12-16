const gamePage = (req, res) => res.render("app");

// connects to game
const connectGame = (req, res) => {
  const nickname = `${req.body.nickname.trim()}`;
  if (!nickname || nickname === "")
    return res.status(400).json({ error: "Atleast 1 character required" });
  return res.json({ nickname });
};

module.exports = {
  gamePage,
  connectGame,
};
