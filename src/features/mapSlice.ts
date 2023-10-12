// features/mapSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  location: {
    lat: number;
    lng: number;
  } | null;
  error: string | null;
}

const initialState: MapState = {
  location: null,
  error: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLocation, setError } = mapSlice.actions;
export default mapSlice.reducer;
