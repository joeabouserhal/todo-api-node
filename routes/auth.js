const express = require("express");
const router = express.Router();
require("dotenv").config();
const authControllers = require("../controllers/authControllers");

router.post("/login", authControllers.login);

router.post("/token", authControllers.refreshToken);

module.exports = router;
