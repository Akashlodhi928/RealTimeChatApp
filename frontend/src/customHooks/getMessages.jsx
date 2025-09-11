import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messagesSlice";

const GetMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedUser?._id) return;
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        console.log("Fetched messages:", result.data);
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error getMessage:", error.response?.data || error.message);
      }
    };

    if (selectedUser && userData) {
      fetchMessages();
    }
  }, [selectedUser, userData, dispatch]);

  return null;
};

export default GetMessages;
