const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { addUser, getUser, getUsersInRoom, removeUser } = require("./users");
const PORT = process.env.PORT || 4000;
var moment = require("moment");

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} , Has Joined The Game`,
    });

    socket.join(user.room);
    console.log(name, "Have Joined", user.room);
    console.log(getUsersInRoom(user.room));
    socket.on("next-question", ({ question, room }, callback) => {
      io.to(room).emit("newque", question);
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    socket.on("drink", (num, callback) => {
      //   console.log(you, num);
      user.num = num;
      io.to(user.room).emit("drink-update", {
        sips: user.num,
        id: socket.id,
      });
    });
    socket.on("exit", () => {
      const user = removeUser(socket.id);
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    });
    socket.on("update", () => {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    });
    socket.on("send-to-all", (message) => {
      io.to(user.room).emit("recent-message", {
        name: user.name,
        time: moment().format("MMMM Do YYYY, h:mm:ss a"),
        message: message,
      });
    });

    callback();
  });
});

const router = require("./router");
const { rootCertificates } = require("tls");
const { get } = require("http");

app.use(router);

// app.use(express.static("public"));

http.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
