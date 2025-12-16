import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import socketReducer from "./socketReducer";

const rootReducer = combineReducers({
  game: gameReducer,
  socket: socketReducer,
});

export default rootReducer;
