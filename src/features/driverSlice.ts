// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driver: null,
  ride: null,
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
