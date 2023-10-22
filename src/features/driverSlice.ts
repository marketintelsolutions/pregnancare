// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const driver = JSON.parse(localStorage.getItem("driver")) || { sos: false };
// const ride = JSON.parse(localStorage.getItem("ride"));

const initialState = {
  driver,
  ride: { rideId: "", duration: "", status: "" },
  buttonMode: "decline",
  sos: "default",
  isPlotted: false,
  message: "",
  closestHospital: "",
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    setRide: (state, action) => {
      state.ride = action.payload;
    },
    setButtonMode: (state, action) => {
      state.buttonMode = action.payload;
    },
    setSos: (state, action) => {
      state.sos = action.payload;
    },
    setIsPlotted: (state, action) => {
      state.isPlotted = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setClosestHospital: (state, action) => {
      state.closestHospital = action.payload;
    },
  },
});

export const {
  setDriver,
  setRide,
  setButtonMode,
  setSos,
  setIsPlotted,
  setMessage,
  setClosestHospital,
} = driverSlice.actions;
export default driverSlice.reducer;
