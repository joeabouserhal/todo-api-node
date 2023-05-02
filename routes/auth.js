const express = require("express");
const router = express.Router();
require("dotenv").config();

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  // authentication
  const email = req.body.email;
  const user = { email: email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.send({ accessToken: accessToken });
});

module.exports = router;
