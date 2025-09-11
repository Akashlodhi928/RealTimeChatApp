import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messagesSlice";
import SenderMessages from "./SenderMessages";
import RecevierMessages from "./RecevierMessages";

function MessageArea() {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontenImage, setFrontenImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);

  const imageRef = useRef();
  const chatAreaRef = useRef();

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontenImage(URL.createObjectURL(file));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Append new message instead of replacing
      dispatch(setMessages([...(messages || []), result.data]));

      setInput("");
      setBackendImage(null);
      setFrontenImage("");

      // Scroll to bottom
      chatAreaRef.current?.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // Listen for socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      // Append new message to existing messages
      dispatch(setMessages([...(messages || []), mess]));

      chatAreaRef.current?.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: "smooth" });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch, messages]);

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className={`lg:w-[70%] w-full h-full ${selectedUser ? "flex" : "hidden"} lg:flex bg-slate-200 border-l border-gray-300`}>
      {selectedUser ? (
        <div className="flex flex-col w-full h-screen">
          {/* Header */}
          <div className="w-full h-[70px] sm:h-[80px] bg-[#20a6ff] rounded-b-2xl shadow-md flex items-center px-4 sm:px-6 relative">
            <div onClick={() => dispatch(setSelectedUser(null))} className="absolute left-4 lg:hidden cursor-pointer">
              <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
            </div>

            <div className="flex items-center gap-3 ml-8 lg:ml-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full shadow-md bg-white flex-shrink-0">
                <img src={selectedUser?.image || dp} alt="User" className="h-full w-full object-cover" />
              </div>
              <h1 className="text-gray-800 font-bold text-base sm:text-lg md:text-xl truncate max-w-[150px] sm:max-w-[250px]">
                {selectedUser?.name || selectedUser?.userName}
              </h1>
            </div>
          </div>

          {/* Chat Area */}
          <div ref={chatAreaRef} className="flex-1 w-full overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-2">
            {safeMessages.map((mess, i) =>
              mess.sender === userData._id ? (
                <SenderMessages key={i} image={mess.image} message={mess.message} />
              ) : (
                <RecevierMessages key={i} image={mess.image} message={mess.message} />
              )
            )}
          </div>

          {/* Emoji Picker */}
          {showPicker && (
            <div className="fixed bottom-[90px] right-[20px] sm:right-[50px] z-50">
              <EmojiPicker width={260} height={350} onEmojiClick={onEmojiClick} />
            </div>
          )}

          {/* Input Area */}
          <div className="w-full px-3 sm:px-6 pb-3 sm:pb-4">
            {frontenImage && (
              <img
                src={frontenImage}
                alt="preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mb-2 shadow-md"
              />
            )}

            <form
              onSubmit={handleSendMessage}
              className="w-full flex items-center bg-[#20a6ff] rounded-full shadow-lg px-3 sm:px-4 py-2 gap-2 sm:gap-3"
            >
              <RiEmojiStickerLine
                className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer"
                onClick={() => setShowPicker((prev) => !prev)}
              />

              <MdOutlinePhotoLibrary
                className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer"
                onClick={() => imageRef.current.click()}
              />
              <input type="file" accept="image/*" ref={imageRef} hidden onChange={handleImage} />

              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onFocus={() => setShowPicker(false)}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-200 font-medium outline-none text-sm sm:text-base"
              />

              <button type="submit" onClick={() => setShowPicker(false)}>
                <IoMdSend className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Welcome to <span className="text-[#20c7ff]">ChatApp</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-semibold mt-2">
            Start a conversation 🚀
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
