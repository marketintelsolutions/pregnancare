import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../features/counterSlice";
import mapReducer from "../features/mapSlice";
import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import driverSlice from "../features/driverSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userSlice,
    driver: driverSlice,
  },
});
