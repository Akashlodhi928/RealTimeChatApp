import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const getCurrentUser = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log("get currentUser")
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("Error in getCurrentUser:", error.response?.data || error.message);
      }
    };

    if (!userData) fetchUser();
  }, []); 

  return null;
};

export default getCurrentUser;
