import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sessionActions from "../../redux/actions/sessionActions";
import * as playerActions from "../../redux/actions/playerActions";
import * as rollActions from "../../redux/actions/rollActions";
import { bindActionCreators } from "redux";
import Spinner from "../common/Spinner";

function ShowSessionPage(props) {
  const {
    sessions,
    sessionActions,
    playerActions,
    players,
    rollActions,
    rolls
  } = props;

  const [session, setSession] = useState({ ...props.session });

  useEffect(() => {
    if (sessions.length === 0) {
      sessionActions.loadSessions().catch(error => {
        console.log("Loading sessions failed " + error);
      });
    } else {
      setSession({ ...props.session });
    }

    if (players.length === 0) {
      playerActions.loadPlayers().catch(error => {
        console.log("Loading players failed " + error);
      });
    }

    if (rolls.length === 0 && session.id !== null) {
      rollActions.loadRolls(session.id).catch(error => {
        console.log("Loading rolls failed " + error);
      });
    }
  }, [props.session]);

  function sortRollsByDateRolled(a, b) {
    if (a.rolledDate > b.rolledDate) {
      return -1;
    }
    if (a.rolledDate < b.rolledDate) {
      return 1;
    }
    return 0;
  }

  return sessions.length === 0 || players.length === 0 ? (
    <Spinner />
  ) : (
    <div>
      <h2>Session Details</h2>
      <div className="form-group row">
        <label
          htmlFor="staticSessionDescription"
          className="col-sm-2 col-form-label"
        >
          Description
        </label>
        <div className="col-sm-10">
          <label className="form-control" id="staticSessionDescription">
            {session.description}
          </label>
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="staticSessionDescription"
          className="col-sm-2 col-form-label"
        >
          Date
        </label>
        <div className="col-sm-10">
          <label className="form-control" id="staticSessionDescription">
            {new Date(session.createdDate).toLocaleString("pt-BR")}
          </label>
        </div>
      </div>

      <div className="form-group row">
        <label
          htmlFor="staticSessionDescription"
          className="col-sm-2 col-form-label"
        >
          Players
        </label>
        <div className="col-sm-10">
          <div className="card">
            <div className="card-body">
              <ul>
                {session.players.map(playerId => {
                  return (
                    <li key={playerId}>
                      {getPlayerById(players, playerId).name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group row">
        <label
          htmlFor="staticSessionDescription"
          className="col-sm-2 col-form-label"
        >
          Rolls
        </label>
        <div className="col-sm-10">
          <div className="card">
            <div className="card-body">
              <ul>
                {rolls.sort(sortRollsByDateRolled).map(roll => {
                  return (
                    <li key={roll.id} className="mb-1">
                      <mark>{getPlayerById(players, roll.playerId).name}</mark>{" "}
                      rolled {roll.quantity}d{roll.dieFace}
                      {roll.bonusIncrement >= 0
                        ? `${
                            roll.bonusIncrement == 0
                              ? ""
                              : `+${roll.bonusIncrement}`
                          }`
                        : `${roll.bonusIncrement}`}{" "}
                      (<strong>{roll.rolledDice.join(", ")}</strong>) and sum
                      is: <strong>{roll.sum}</strong>. Max value was:{" "}
                      <font color="blue">{roll.maxValue}</font> and Min value
                      was: <font color="red">{roll.minValue}</font>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ShowSessionPage.propTypes = {
  sessionActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
  rollActions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  sessions: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired,
  rolls: PropTypes.array.isRequired
};

export function getSessionById(sessions, id) {
  return sessions.find(session => session.id === parseInt(id)) || null;
}

export function getPlayerById(players, id) {
  return players.find(player => player.id === parseInt(id)) || null;
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const newSession = {
    id: null,
    description: ""
  };
  const session =
    id && state.sessions.length > 0
      ? getSessionById(state.sessions, id)
      : newSession;
  return {
    sessions: state.sessions,
    session: session,
    players: state.players,
    rolls: state.rolls
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sessionActions: bindActionCreators(sessionActions, dispatch),
    rollActions: bindActionCreators(rollActions, dispatch),
    playerActions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowSessionPage);
