const express = require("express");
const isAuth = require("../middleware/isAuth");
const messageController = require("../controller/messageController");
const route = express.Router();

route.post("/", isAuth, messageController.sendMessage);
route.get("/:chatId", isAuth, messageController.allMessage);

module.exports = route;
