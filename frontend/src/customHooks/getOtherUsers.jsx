

import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers, setUserData } from "../redux/userSlice";

const getOtherUsers = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        console.log("get currentUser")
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log("Error in getCurrentUser:", error.response?.data || error.message);
      }
    };

    if (!userData) fetchUser();
  }, [userData]); 

  return null;
};

export default getOtherUsers;
