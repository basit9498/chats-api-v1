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
        message: "chat Exist!",
        isChatExsist,
      });
    }

    // Create New Chat
    const new_chat = await Chat({
      isGroupChat: false,
      users: [req.user, user_id],
    });

    await new_chat.save();

    const create_new_data = await Chat.findOne({ _id: new_chat._id })
      .populate("users", "name pic")
      .populate("latest_message");
    res.json({
      message: "chat new created now!",
      new_chat: create_new_data,
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
      users: [req.user, ...user_list_id],
    });

    await groupChat.save();

    res.json({
      message: "Group Chat Created",
      groupChat,
    });
  } catch (error) {
    next(error);
  }
};

// Rename the grup name

exports.renameGroup = async (req, res, next) => {
  try {
    const { id, group_rename } = req.body;
    const chat_group = await Chat.findOne({ _id: id, isGroupChat: true })
      .populate("users", "name pic")
      .populate("latest_message");

    if (!chat_group) {
      const error = new Error("No Grup Finded");
      error.status = 404;
      throw error;
    }

    chat_group.chat = group_rename;
    await chat_group.save();
    res.json({
      chat_group,
    });
  } catch (error) {
    next(error);
  }
};

// Add user to gruop
exports.addUserGroup = async (req, res, next) => {
  try {
    const { id, user_list_id } = req.body;
    const chat_group = await Chat.findOne({ _id: id, isGroupChat: true });

    if (!chat_group) {
      const error = new Error("No Grup Finded");
      error.status = 404;
      throw error;
    }

    chat_group.users.push(user_list_id);
    await chat_group.save();
    res.json({
      chat_group,
    });
  } catch (error) {
    next(error);
  }
};

// Remove User from  group
// Need more effective and valid when if user not find etc
exports.removeUserGroup = async (req, res, next) => {
  try {
    const { id, user_list_id } = req.body;
    const chat_group = await Chat.findOne({
      _id: id,
      isGroupChat: true,
      users: { $in: user_list_id },
    });

    if (!chat_group) {
      const error = new Error("No User  Find in this Frop");
      error.status = 404;
      throw error;
    }

    chat_group.users.pull(user_list_id);
    await chat_group.save();
    res.json({
      chat_group,
    });
  } catch (error) {
    next(error);
  }
};
