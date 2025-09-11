import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { BiLogOutCircle } from "react-icons/bi";
import dp from "../assets/dp.png";
import axios from "axios";
import { serverUrl } from "../main";
import { useNavigate } from "react-router-dom";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      alert("User logged out successfully");
      navigate("/login");
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
    } catch (error) {
      console.log(`error in logOut ${error}`);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(`error in search User ${error}`);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    } else {
      dispatch(setSearchData([]));
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] md:w-[40%] w-full h-full ${
        !selectedUser ? "block" : "hidden"
      } lg:block bg-slate-100 relative`}
    >
      {/* Logout Button */}
      <div
        onClick={handleLogOut}
        className="w-[50px] h-[50px] md:w-[55px] md:h-[55px] cursor-pointer overflow-hidden rounded-full bg-[#20c7ff] flex justify-center items-center shadow-lg border border-white fixed bottom-4 left-4 md:bottom-6 md:left-6 hover:bg-[#1ba5d6] transition"
      >
        <BiLogOutCircle className="h-[24px] w-[24px] md:h-[28px] md:w-[28px] text-white" />
      </div>

      {/* Header */}
      <div className="w-full h-[200px] md:h-[230px] lg:h-[250px] bg-[#20c7ff] rounded-b-[20%] md:rounded-b-[25%] lg:rounded-b-[30%] shadow-md flex flex-col justify-center px-4 md:px-6 text-white">
        <h1 className="font-bold text-xl md:text-2xl lg:text-[28px]">BaatCheet</h1>
        <div className="flex w-full justify-between items-center mt-2">
          <h1 className="text-lg md:text-xl lg:text-2xl font-black text-black truncate max-w-[60%]">
            Hi, {userData?.name || "User"}
          </h1>
          <div
            onClick={() => navigate("/profile")}
            className="cursor-pointer w-[50px] h-[50px] md:w-[55px] md:h-[55px] overflow-hidden rounded-full flex justify-center items-center shadow-md border-2 border-white hover:shadow-inner bg-white"
          >
            <img
              src={userData?.image || dp}
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Search & Online Users */}
        <div className="mt-4 w-full flex flex-wrap items-center gap-3 md:gap-4 px-2 md:px-4">
          {/* Search Button */}
          {!search && (
            <div
              className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] cursor-pointer overflow-hidden rounded-full bg-white flex justify-center items-center shadow-md border border-gray-200 hover:bg-gray-100 transition"
              onClick={() => setSearch(true)}
            >
              <FaSearch className="h-[18px] w-[18px] md:h-[20px] md:w-[20px] text-gray-600" />
            </div>
          )}

          {/* Search Input */}
          {search && (
            <div className="w-full relative">
              <div className="flex items-center gap-3 w-full h-[45px] md:h-[55px] px-3 bg-white rounded-full shadow-md border border-gray-200">
                <FaSearch className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="flex-1 outline-none font-medium text-gray-700 text-sm md:text-base"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
                <ImCross
                  onClick={() => {
                    setSearch(false);
                    setInput("");
                    dispatch(setSearchData([]));
                  }}
                  className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] cursor-pointer text-gray-500 hover:text-red-500 transition"
                />
              </div>

              {/* Search Results Dropdown */}
              {input && (
                <div className="absolute top-[50px] md:top-[65px] left-0 w-full max-h-[200px] md:max-h-[250px] overflow-auto bg-white rounded-lg shadow-lg p-2 z-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {searchData?.map((user, index) => (
                    <div
                      className="flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                      key={index}
                      onClick={() => {
                        dispatch(setSelectedUser(user));
                        setInput("");
                        setSearch(false);
                      }}
                    >
                      <div className="relative">
                        <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden shadow border">
                          <img
                            src={user.image || dp}
                            alt={user.userName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {onlineUsers?.includes(user._id) && (
                          <span className="absolute bottom-0 right-0 bg-green-500 w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full border border-white shadow"></span>
                        )}
                      </div>
                      <h1 className="text-sm md:text-base font-medium text-gray-800 truncate max-w-[150px]">
                        {user.name || user.userName}
                      </h1>
                    </div>
                  ))}

                  {searchData?.length === 0 && input && (
                    <p className="text-gray-500 text-center py-2 text-sm">
                      No users found
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Online Users Shortcuts */}
          {!search &&
            otherUsers?.map(
              (user, index) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden shadow border hover:scale-105 transition">
                      <img
                        src={user.image || dp}
                        alt={user.userName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="bg-green-500 w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-full absolute right-0 bottom-0 border border-white shadow"></span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* All Users List */}
      <div className="w-full h-[50%] md:h-[55%] overflow-auto flex flex-col gap-2 md:gap-3 mt-4 md:mt-6 px-3 md:px-5 pb-[70px] md:pb-[80px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {otherUsers?.map((user, index) => (
          <div
            key={index}
            onClick={() => dispatch(setSelectedUser(user))}
            className="flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 cursor-pointer transition"
          >
            <div className="relative">
              <div className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] rounded-full overflow-hidden shadow border">
                <img
                  src={user.image || dp}
                  alt={user.userName}
                  className="h-full w-full object-cover"
                />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="bg-green-500 w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-full absolute bottom-0 right-0 border border-white shadow"></span>
              )}
            </div>
            <h1 className="text-sm md:text-base lg:text-lg font-medium text-gray-800 truncate max-w-[200px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
