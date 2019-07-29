import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function rollReducer(state = initialState.rolls, action) {
  switch (action.type) {
    case types.LOAD_ROLLS_SUCCESS:
      return action.rolls;
    default:
      return state;
  }
}
