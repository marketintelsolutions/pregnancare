import { combineReducers } from "@reduxjs/toolkit";
import driverSlice from "../features/driverSlice";
import healthcareSlice from "../features/healthcareSlice";
import mapReducer from "../features/mapSlice";
import userSlice from "../features/userSlice";

const rootReducer = combineReducers({
  map: mapReducer,
  user: userSlice,
  driver: driverSlice,
  healthcare: healthcareSlice,
});

export default rootReducer;

// Add this to export the RootState type
export type RootState = ReturnType<typeof rootReducer>;
