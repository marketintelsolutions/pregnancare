// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  ride: null,
  message: "Click here to request pickup",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRide: (state, action) => {
      state.ride = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setUser, setRide, setMessage } = userSlice.actions;
export default userSlice.reducer;
