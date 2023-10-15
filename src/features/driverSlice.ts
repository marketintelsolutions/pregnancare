// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("driver")) || { sos: false };

const initialState = {
  driver: user,
  ride: { rideId: "" },
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
  },
});

export const { setDriver, setRide } = driverSlice.actions;
export default driverSlice.reducer;
