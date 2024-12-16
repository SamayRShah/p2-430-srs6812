const models = require("../models");

const { Account } = models;

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const session = (req, res) => {
  if (req.session && req.session.account) {
    return res.json({ account: req.session.account });
  }
  return res.json(null);
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  if (!username || !pass)
    return res.status(400).json({ error: "All fields are required" });
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account)
      return res.status(400).json({ error: "Wrong username or password" });
    const user = Account.toAPI(account);
    req.session.account = user;
    return res.json({ account: user });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  if (!username || !pass || !pass2)
    return res.status(400).json({ error: "All fields are required!" });
  if (pass !== pass2)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    const user = Account.toAPI(newAccount);
    req.session.account = user;
    return res.json({ account: user });
  } catch (err) {
    console.log(err);
    if (err.code === 11000)
      return res.status(400).json({ error: "Username already in use" });
    return res.status(500).json({ error: "An error occured!" });
  }
};

const changePassword = async (req, res) => {
  const username = `${req.session.account.username}`;
  const newPass = `${req.body.newPass}`;

  if (!newPass) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await Account.changePassword(username, newPass, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "An error occurred while changing the password" });
      }
      return res.status(201).json({
        message: "Password successfully updated!",
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
  return false;
};

module.exports = {
  logout,
  login,
  signup,
  session,
  changePassword,
};
