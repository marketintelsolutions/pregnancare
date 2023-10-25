// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  latestRide: {},
  coordinates: { lat: "", lng: "" },
  user: { email: "" },
  location: null,
  error: "",
  message: "",
  ride: null,
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
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setRide: (state, action) => {
      state.ride = action.payload;
    },
  },
});

export const {
  setUsers,
  setLatestRide,
  setCoordinates,
  setUser,
  setLocation,
  setError,
  setMessage,
  setRide,
} = healthcareSlice.actions;
export default healthcareSlice.reducer;
