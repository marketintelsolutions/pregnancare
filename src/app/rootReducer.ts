import { combineReducers } from "@reduxjs/toolkit";
import mapReducer from "../features/mapSlice";
import userSlice from "../features/userSlice";

const rootReducer = combineReducers({
  map: mapReducer,
  user: userSlice,
  // ... other reducers
});

export default rootReducer;

// Add this to export the RootState type
export type RootState = ReturnType<typeof rootReducer>;
