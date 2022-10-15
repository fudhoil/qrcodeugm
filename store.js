import { configureStore } from "@reduxjs/toolkit";
import checkReducer from "./slices/checkSlice";

const store = configureStore({
  reducer: {
    check: checkReducer,
  },
});

export default store;
