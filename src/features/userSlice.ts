// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const ride = JSON.parse(localStorage.getItem("ride")) || null;

const initialState = {
  user: {},
  ride,
  message: "Click here to request pickup",
  loading: false,
  driver: null,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
  },
});

export const {
  setUser,
  setRide,
  setMessage,
  setLoading,
  setDriver,
} = userSlice.actions;
export default userSlice.reducer;
