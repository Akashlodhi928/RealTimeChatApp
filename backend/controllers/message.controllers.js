import upLoadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../modules/conversation.model.js";
import Message from "../modules/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;
    const image = req.file?.path || null;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [sender, receiver],
        messages: [],
      });
    }

    const newMessage = new Message({
      sender,
      receiver,
      message,
      image,
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = await getReceiverSocketId(receiver)
    
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `sendMessage error: ${error.message}` });
  }
};

// Get messages
export const getMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]); // ✅ empty array instead of 400
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getMessage error: ${error.message}` });
  }
};
