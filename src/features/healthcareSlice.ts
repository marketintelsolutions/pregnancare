// features/mapSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const mapSlice = createSlice({
  name: "healthcare",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = mapSlice.actions;
export default mapSlice.reducer;
