import { configureStore } from "@reduxjs/toolkit";
import snackbarsReducer from "./slices/snackbarsSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    snackbars: snackbarsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
