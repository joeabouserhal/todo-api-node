const express = require("express");
const Task = require("../models/task");
const router = express.Router();
require("dotenv").config();

const authenticateToken = require("../middleware/jwt");

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
    res.send({ data: result.rows, email: req.user });
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

router.post("/", (req, res) => {
  // res.send(req.body);
  try {
    Task.parse(req.body);
    const now = new Date();
    pool.query(
      "INSERT INTO tasks (title, description, date_created, done) VALUES ($1,$2,$3,$4)",
      [req.body.title, req.body.description, now, false],
      (error, result) => {
        if (error) {
          res.send(error);
        }
        res.send(result);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

router.patch("/setAsDone/:id", (req, res) => {
  const id = req.params.id;
  try {
    pool.query(
      "UPDATE tasks SET done=true WHERE id=$1",
      [id],
      (error, result) => {
        if (error) {
          res.send(error);
        }
        res.send(result);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

router.patch("/setAsNotDone/:id", (req, res) => {
  const id = req.params.id;
  try {
    pool.query(
      "UPDATE tasks SET done=false WHERE id=$1",
      [id],
      (error, result) => {
        if (error) {
          res.send(error);
        }
        res.send(result);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  try {
    pool.query("DELETE FROM tasks WHERE id=$1", [id], (error, result) => {
      if (error) {
        res.send(error);
      }
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
