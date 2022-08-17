const app = require("express")();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});
const mongoose = require("mongoose");
var con = mongoose.connect("mongodb://localhost:27017/testDatabase", (err) => {
  if (!err) {
    console.log("Database connected.");
  } else {
    console.log("Connection error.");
  }
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

var todoSchema = new mongoose.Schema({
  taskName: String,
  taskDate: Date,
});

var todoList = mongoose.model("todo", todoSchema);

app.post("/insertTodo", (req, res) => {
  var todo = new todoList(req.body);

  console.log(todo);
  todo.save((err, data) => {
    console.log(err, data);
    if (err) {
      res.end('{"error" : "No entry inserted", "status" : 500}');
      // res.sendStatus(500);
    } else {
      res.end('{"success" : "Inserted Successfully", "status" : 200}');
      // res.sendStatus(200);
    }
  });
});

app.get("/getTodoList", (req, res) => {
  todoList.find((err, data) => {
    console.log(data);
    if (err) {
    } else {
      res.json({ data: data, success: true });
    }
  });
});

app.post("/deleteTodo", (req, res) => {
  console.log(req.body.id);
  todoList.deleteOne({ _id: req.body.id }).then((res1) => {
    res.json({ success: true });
  });
});

app.post("/updateTodo", (req, res) => {
  todoList
    .findOneAndUpdate(
      { _id: req.body.id },
      { taskName: req.body.taskName, taskDate: req.body.taskDate }
    )
    .then(
      (res1) => {
        res.json({ success: true });
      },
      (err) => {
        res.json({ success: false });
      }
    );
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
