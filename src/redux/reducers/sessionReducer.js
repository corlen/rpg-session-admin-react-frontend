import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function sessionReducer(state = initialState.sessions, action) {
  console.log("como chega no reducer:", action.session);
  switch (action.type) {
    case types.LOAD_SESSIONS_SUCCESS:
      return action.sessions;
    case types.CREATE_SESSION_SUCCESS:
      return [...state, { ...action.session }];
    default:
      return state;
  }
}
