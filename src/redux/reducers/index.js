import { combineReducers } from "redux";
import players from "./playerReducer";
import apiCallsInProgress from "./apiStatusReducer";
import sessions from "./sessionReducer";
import rolls from "./rollReducer";

const rootReducer = combineReducers({
  players: players,
  sessions: sessions,
  rolls: rolls,
  apiCallsInProgress: apiCallsInProgress
});

export default rootReducer;
