// features/mapSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  location: {
    lat: number;
    lng: number;
  } | null;
  error: string | null;
  isPlotted: boolean;
}

const initialState: MapState = {
  location: null,
  error: null,
  isPlotted: false,
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
    setIsPlotted: (state, action) => {
      state.isPlotted = action.payload;
    },
  },
});

export const { setLocation, setError, setIsPlotted } = mapSlice.actions;
export default mapSlice.reducer;
