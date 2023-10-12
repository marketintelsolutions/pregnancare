import { combineReducers } from "@reduxjs/toolkit";
import mapReducer from "../features/mapSlice";

const rootReducer = combineReducers({
  map: mapReducer,
  // ... other reducers
});

export default rootReducer;

// Add this to export the RootState type
export type RootState = ReturnType<typeof rootReducer>;
