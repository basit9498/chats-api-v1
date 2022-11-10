const Message = require("../model/messageModel");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    var message = await Message({
      sender: req.user,
      content: content,
      chat: chatId,
    });

    message.save();

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latest_message: message });

    res.json({ message });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json({ messages });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  sendMessage,
  allMessage,
};
