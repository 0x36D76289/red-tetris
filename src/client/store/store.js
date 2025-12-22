import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice.js";

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
