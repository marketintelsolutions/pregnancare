import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../features/counterSlice";
import mapReducer from "../features/mapSlice";
import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userSlice,
  },
});
