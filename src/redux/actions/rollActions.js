import * as types from "./actionTypes";
import * as rollApi from "../../api/rollApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadRollsSuccess(rolls) {
  return { type: types.LOAD_ROLLS_SUCCESS, rolls: rolls };
}

export function createRollSuccess(roll) {
  return { type: types.CREATE_ROLL_SUCCESS, roll: roll };
}

export function loadRolls(sessionId) {
  return function(dispatch) {
    dispatch(beginApiCall());
    return rollApi
      .getRollsBySession(sessionId)
      .then(rolls => {
        dispatch(loadRollsSuccess(rolls));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function saveRoll(roll) {
  //eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    dispatch(beginApiCall());
    return rollApi
      .saveRoll(roll)
      .then(savedRoll => dispatch(createRollSuccess(savedRoll)))
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}
