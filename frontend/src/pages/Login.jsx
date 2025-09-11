import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState(false);
  let dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));

      setEmail("");
      setPassword("");
       window.location.reload();
      setErr("");
      setLoading(false);
    } catch (error) {
      console.log(`error in login ${error}`);
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErr(error.response.data.message);
      } else {
        setErr("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-[450px] sm:max-w-[500px] h-auto  bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-8">
        {/* Header */}
        <div className="w-full h-[150px] sm:h-[180px] bg-[#20c7ff] rounded-b-[25%] shadow-gray-400 shadow-lg flex justify-center items-center rounded-t-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-zinc-800 font-bold text-center">
            Login to{" "}
            <span className="text-white hover:underline">BaatCheet</span>
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-6 px-5 sm:px-8 md:px-10 items-center"
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-4 bg-white shadow-gray-200 shadow-md text-sm sm:text-base"
          />

          {/* Password */}
          <div className="w-full h-[50px] border-2 border-[#20c7ff] rounded-lg bg-white shadow-gray-200 shadow-md relative">
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none w-full h-full px-4 text-sm sm:text-base"
            />
            <span
              onClick={() => setShow((prev) => !prev)}
              className="cursor-pointer font-semibold text-[#20c7ff] absolute top-[11px] right-[10px] text-sm sm:text-base"
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {/* Error */}
          {err && (
            <p className="text-red-500 text-sm sm:text-base">{"*" + err}</p>
          )}

          {/* Submit */}
          <button
            className="w-full sm:w-auto px-6 sm:px-10 py-2 bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-md font-bold mt-2 hover:shadow-inner text-white text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Signup Redirect */}
          <p className="mt-2 text-sm sm:text-base text-center mb-[30px]">
            Create a new account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-red-600 font-bold hover:underline cursor-pointer mb-[30px]"
            >
              SignUp
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
