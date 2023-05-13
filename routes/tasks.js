const express = require("express");
const router = express.Router();
require("dotenv").config();
const taskControllers = require("../controllers/tasksControllers");
const authenticateToken = require("../middleware/jwt");

router.get("/", taskControllers.getAllTasks);

router.get("/:id", taskControllers.getTask);

router.post("/", taskControllers.addTask);

router.patch("/setAsDone/:id", taskControllers.setTaskAsDone);

router.patch("/setAsNotDone/:id", taskControllers.setTaskAsNotDone);

router.delete("/delete/:id", taskControllers.deleteTask);

module.exports = router;
