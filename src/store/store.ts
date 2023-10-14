import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "../features/mapSlice";
import userSlice from "../features/userSlice";
import driverSlice from "../features/driverSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userSlice,
    driver: driverSlice,
  },
});
