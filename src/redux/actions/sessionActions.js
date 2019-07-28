import * as types from "./actionTypes";
import * as sessionApi from "../../api/sessionApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadSessionSuccess(sessions) {
  return { type: types.LOAD_SESSIONS_SUCCESS, sessions: sessions };
}

export function createSessionSuccess(session) {
  return { type: types.CREATE_SESSION_SUCCESS, session: session };
}

export function loadSessions() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return sessionApi
      .getSessions()
      .then(sessions => {
        dispatch(loadSessionSuccess(sessions));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function saveSession(session) {
  console.log("antes de ir pra chamada na api", session);
  //eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    dispatch(beginApiCall());
    return sessionApi
      .saveSession(session)
      .then(savedSession => dispatch(createSessionSuccess(savedSession)))
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}
