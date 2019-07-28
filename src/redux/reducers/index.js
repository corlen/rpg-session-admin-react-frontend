import { combineReducers } from "redux";
import players from "./playerReducer";
import apiCallsInProgress from "./apiStatusReducer";
import sessions from "./sessionReducer";

const rootReducer = combineReducers({
  players: players,
  sessions: sessions,
  apiCallsInProgress: apiCallsInProgress
});

export default rootReducer;
