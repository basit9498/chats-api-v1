const Chat = require("../model/chatModel");
const User = require("../model/userModel");

// create new Chat
exports.accessChat = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    // first find user
    const _withUser = await User.findById(user_id);

    if (!_withUser) {
      const error = new Error("Chat with User Id not Found");
      error.status = 404;
      throw error;
    }

    // check auth user

    if (!req.user) {
      const error = new Error("User Id not Founded");
      error.status = 404;
      throw error;
    }

    //check if chat is exist
    const isChatExsist = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user_id } } },
        { users: { $elemMatch: { $eq: req.user } } },
      ],
    })
      .populate("users", "name pic")
      .populate("latest_message");

    if (isChatExsist.length !== 0) {
      return res.json({
        message: "chat created now!",
        isChatExsist,
      });
    }

    // Create New Chat
    const new_chat = await Chat({
      isGroupChat: false,
      users: [req.user, user_id],
    });

    await new_chat.save();

    res.json({
      message: "chat created now!",
      new_chat,
    });
  } catch (error) {
    next(error);
  }
};

// get log user chat

exports.chatMe = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error("User Id not Founded");
      error.status = 404;
      throw error;
    }

    const user_chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user } },
    })
      .populate("users", "name pic")
      .populate("latest_message");

    res.json({
      message: "Fetch All Chat",
      user_chats,
    });
  } catch (error) {
    next(error);
  }
};

// create group Chat
exports.createGroupChat = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error("User Id not Founded");
      error.status = 404;
      throw error;
    }

    const { group_name, user_list_id } = req.body;

    console.log(group_name, "user_list_id", user_list_id);
    if (!user_list_id) {
      const error = new Error("Please Provide User List ");
      error.status = 404;
      throw error;
    }
    if (user_list_id?.length === 0) {
      const error = new Error("Please Select User's ");
      error.status = 404;
      throw error;
    }

    const groupChat = await Chat({
      chat: group_name,
      isGroupChat: true,
      group_admin: req.user,
      users: user_list_id,
    });

    res.json({
      message: "Group Chat Created",
      groupChat,
    });
  } catch (error) {
    next(error);
  }
};
