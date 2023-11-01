// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  ride: null,
  message: "Click here to request pickup",
  loading: false,
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
  },
});

export const { setUser, setRide, setMessage, setLoading } = userSlice.actions;
export default userSlice.reducer;
