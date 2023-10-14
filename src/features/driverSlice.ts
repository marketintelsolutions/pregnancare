// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driver: null,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
  },
});

export const { setDriver } = driverSlice.actions;
export default driverSlice.reducer;
