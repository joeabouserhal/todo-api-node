const Task = require("../models/task");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const setTaskAsDone = (req, res) => {
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
};

const setTaskAsNotDone = (req, res) => {
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
};

const addTask = (req, res) => {
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
};

const getAllTasks = (req, res) => {
  pool.query("SELECT * FROM tasks", (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send({ data: result.rows, email: req.user });
  });
};

const getTask = (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM tasks WHERE id=$1", [id], (error, result) => {
    if (error) {
      res.send(error);
    } else if (result.rowCount == 0) {
      res.send({ success: false, message: "Task not found" });
    } else {
      res.send({ success: true, data: result.rows[0] });
    }
  });
};

const deleteTask = (req, res) => {
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
};

module.exports = {
  addTask,
  deleteTask,
  getAllTasks,
  getTask,
  setTaskAsDone,
  setTaskAsNotDone,
};
