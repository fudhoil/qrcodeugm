import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const checkData = createAsyncThunk(
  "check/checkData",
  async (payload) => {
    const response = await fetch(
      "https://gxoib8zz.directus.app/items/submition?filter[email][_eq]=" +
        payload
    );
    const data = await response.json();

    return data;
  }
);

const initialState = {
  hasil: null,
  status: null,
};

export const checkSlice = createSlice({
  name: "check",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(checkData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkData.fulfilled, (state, action) => {
        state.status = "success";
        state.hasil = action.payload;
      });
  },
});

export const { setData } = checkSlice.actions;
export default checkSlice.reducer;
