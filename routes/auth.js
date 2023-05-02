const express = require("express");
const router = express.Router();
require("dotenv").config();

const jwt = require("jsonwebtoken");

let refreshTokens = [];

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
  return accessToken;
};

router.post("/login", (req, res) => {
  // authentication
  const email = req.body.email;
  const user = { email: email };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  console.log(refreshTokens);
  res.send({ accessToken: accessToken, refreshToken: refreshToken });
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ email: result.email });
    res.json({ accessToken: accessToken });
  });
});

module.exports = router;
