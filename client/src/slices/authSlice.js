// client/src/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

//! desc:
//! to set the user credentials to local storage and remove them / this not a child of apiSlice this why we add it to Store an cartSlice and productSlice not
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // store the current state in the local storage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      // logout for the local stuff
      //TODO here we need to also remove the cart from storage so the next logged in user doesn't inherit the previous users cart and shipping
      state.userInfo = null;
      // localStorage.removeItem("userInfo");
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
