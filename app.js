const express = require("express");
const bodyParse = require("body-parser");

const connectionDB = require("./config/dbConnection");
const { errorHandler } = require("./middleware/error-handler");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const PORT = process.env.PORT || 5000;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,OPTIONS,DELETE,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

app.use(errorHandler);

connectionDB(() => {
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server Run In ${process.env.PORT} port`);
  });
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("connected to socket");

    socket.on("setup", (userData) => {
      socket.join(userData?._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;

      if (!chat?.users) return console.log("chat.users not defined");

      chat?.users.forEach((user) => {
        if (user?._id == newMessageRecieved.sender._id) return;

        socket.in(user?._id).emit("message recieved", newMessageRecieved);
      });
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
});
