import { combineReducers } from "redux";
import players from "./playerReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  players: players,
  apiCallsInProgress: apiCallsInProgress
});

export default rootReducer;
