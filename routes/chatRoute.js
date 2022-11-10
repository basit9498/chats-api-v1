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

// Rename Group
route.put("/group/rename", isAuth, chatController.renameGroup);

// Add Users in Gruop
route.put("/group/add-user", isAuth, chatController.addUserGroup);

// Remove User From Group
route.put("/group/add-remove", isAuth, chatController.removeUserGroup);

module.exports = route;
