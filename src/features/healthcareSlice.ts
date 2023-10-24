// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  latestRide: {},
};

const healthcareSlice = createSlice({
  name: "healthcare",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setLatestRide: (state, action) => {
      state.latestRide = action.payload;
    },
  },
});

export const { setUsers, setLatestRide } = healthcareSlice.actions;
export default healthcareSlice.reducer;
