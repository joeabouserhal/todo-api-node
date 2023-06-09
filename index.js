const express = require("express");
const app = express();
const tasksRouter = require("./routes/tasks.js");
const authRouter = require("./routes/auth.js");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Todo API");
});

app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
