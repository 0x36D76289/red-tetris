import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false, // Allow non-serializable socket instance without deep freezing
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
