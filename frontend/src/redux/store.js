import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import messageSlice from "./messagesSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    message:messageSlice
  }
});
