import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../features/counterSlice";
import mapReducer from "../features/mapSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    map: mapReducer,
  },
});
