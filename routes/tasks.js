const express = require("express");
const router = express.Router();
require("dotenv").config();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

router.get("/", (req, res) => {
  pool.query("SELECT * FROM tasks", (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send(result.rows);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM tasks WHERE id=$1", [id], (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send(result.rows[0]);
  });
});

module.exports = router;
