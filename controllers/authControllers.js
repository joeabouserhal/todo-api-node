require("dotenv").config();

const jwt = require("jsonwebtoken");

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
  return accessToken;
};

const login = (req, res) => {
  // authentication
  const email = req.body.email;
  const user = { email: email };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  pool.query("UPDATE users SET refresh_token=$1 WHERE email=$2", [
    refreshToken,
    email,
  ]);
  console.log(refreshToken);
  res.send({ accessToken: accessToken, refreshToken: refreshToken });
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  pool.query(
    "SELECT 1 FROM users WHERE refresh_token=$1;",
    [refreshToken],
    (error, result) => {
      if (error) {
        return res.send(error);
      } else if (result.rowCount == 0) {
        return res
          .status(403)
          .send({ success: false, error: "refresh token not found" });
      } else {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, result) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ email: result.email });
            return res.json({ accessToken: accessToken });
          }
        );
      }
    }
  );
};

module.exports = {
  login,
  refreshToken,
};
