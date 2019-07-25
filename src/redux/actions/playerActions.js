import * as types from "./actionTypes";
import * as playerApi from "../../api/playerApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadPlayerSuccess(players) {
  return { type: types.LOAD_PLAYERS_SUCCESS, players: players };
}

export function createPlayerSuccess(player) {
  return { type: types.CREATE_PLAYER_SUCCESS, player: player };
}

export function updatePlayerSuccess(player) {
  return { type: types.UPDATE_PLAYERS_SUCCESS, player: player };
}

export function deletePlayerOptimistic(player) {
  return { type: types.DELETE_PLAYER_OPTIMISTIC, player: player };
}

export function loadPlayers() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return playerApi
      .getPlayers()
      .then(players => {
        dispatch(loadPlayerSuccess(players));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function savePlayer(player) {
  //eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    dispatch(beginApiCall());
    return playerApi
      .savePlayer(player)
      .then(savedPlayer => {
        player.id
          ? dispatch(updatePlayerSuccess(savedPlayer))
          : dispatch(createPlayerSuccess(savedPlayer));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function deletePlayer(player) {
  return function(dispatch) {
    dispatch(deletePlayerOptimistic(player));
    return playerApi.deletePlayer(player.id);
  };
}
