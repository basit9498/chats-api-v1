const express = require("express");
const chatController = require("../controller/chatController");
const isAuth = require("../middleware/isAuth");
const route = express.Router();

// create new chat with one to one
route.post("/access", isAuth, chatController.accessChat);
// get Chat
route.get("/me", isAuth, chatController.chatMe);
// Create group chat
route.post("/group", isAuth, chatController.createGroupChat);

module.exports = route;
