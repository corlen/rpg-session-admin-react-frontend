import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sessionActions from "../../redux/actions/sessionActions";
import * as rollActions from "../../redux/actions/rollActions";
import { bindActionCreators } from "redux";
import Spinner from "../common/Spinner";
import * as playerActions from "../../redux/actions/playerActions";
import { toast } from "react-toastify";

function SessionRunPage(props) {
  const {
    sessions,
    sessionActions,
    playerActions,
    rollActions,
    players,
    rolls
  } = props;

  const [session, setSession] = useState({ ...props.session });
  const [playerSelected, setPlayerSelected] = useState(0);
  const [rollForm, setRollForm] = useState({});
  const [errors, setErrors] = useState({});

  const intervalRef = useRef();

  useEffect(() => {
    if (sessions.length === 0) {
      sessionActions.loadSessions().catch(error => {
        console.log("Loading sessions failed " + error);
        alert("Loading sessions failed");
      });
    } else {
      setSession({ ...props.session });
    }

    if (players.length === 0) {
      playerActions.loadPlayers().catch(error => {
        alert("loading players failed" + error);
      });
    }
    if (rolls.length === 0 && session.id !== null) {
      rollActions.loadRolls(session.id).catch(error => {
        alert("loading rolls failed" + error);
      });
    }

    const polling = setInterval(() => {
      rollActions.loadRolls(session.id).catch(error => {
        alert("loading rolls failed" + error);
      });
    }, 4000);
    intervalRef.current = polling;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [props.session]);

  function handleChangeRollForm(e) {
    setPlayerSelected(e.target.value);
    const { name, value } = e.target;
    setRollForm(prevRollForm => ({
      ...prevRollForm,
      [name]: value
    }));
  }

  function formIsValid() {
    const { playerId, dieFace, quantity } = rollForm;
    const errors = {};
    if (!playerId) errors.playerId = "An player must be selected";
    if (!dieFace) errors.dieFace = "An die face must be selected";
    if (!quantity) errors.quantity = "A quantity must be declared";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleRollSubmit(e) {
    e.preventDefault();
    if (!formIsValid()) return;

    const newRoll = !rollForm.bonusIncrement
      ? { ...rollForm, sessionId: session.id, bonusIncrement: "0" }
      : { ...rollForm, sessionId: session.id };

    rollActions.saveRoll(newRoll).then(() => {
      toast.success("Dice rolled!");
      rollActions.loadRolls(session.id).catch(error => {
        alert("loading rolls failed" + error);
      });
    });
  }

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
      <div>
        <h2>{session.description}</h2>
      </div>
      <div className="card mt-2 mb-2">
        <div className="card-body">
          <h6 className="card-title">Players:</h6>
          <div className="card-text">
            {session.players
              .flatMap(id => getPlayerById(players, id).name)
              .join(", ")}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form className="form-inline" onSubmit={handleRollSubmit}>
            <label className="my-1 mr-2" htmlFor="rollFormPlayer">
              Player
            </label>
            <select
              className="custom-select my-1 mr-sm-2"
              name="playerId"
              id="rollFormPlayer"
              defaultValue={playerSelected}
              onChange={handleChangeRollForm}
            >
              <option value="0">Choose...</option>
              {session.players.map(playerId => {
                return (
                  <option key={playerId} value={playerId}>
                    {getPlayerById(players, playerId).name}
                  </option>
                );
              })}
            </select>
            <label className="my-1 mr-2" htmlFor="rollFormDie">
              Die
            </label>
            <select
              className="custom-select my-1 mr-sm-2"
              name="dieFace"
              id="rollFormDie"
              onChange={handleChangeRollForm}
            >
              <option defaultValue>Choose...</option>
              <option value="3">d3</option>
              <option value="4">d4</option>
              <option value="6">d6</option>
              <option value="8">d8</option>
              <option value="10">d10</option>
              <option value="12">d12</option>
              <option value="20">d20</option>
              <option value="100">d100</option>
            </select>
            <label className="sr-only" htmlFor="rollFormQty">
              Qty
            </label>
            <input
              type="text"
              name="quantity"
              className="form-control form-control-sm mr-2"
              id="rollFormQty"
              placeholder="Qty"
              onChange={handleChangeRollForm}
            />
            <label className="sr-only" htmlFor="rollFormBonus">
              Bonus/Penalty
            </label>
            <input
              type="text"
              className="form-control form-control-sm mr-2"
              name="bonusIncrement"
              id="rollFormBonus"
              placeholder="Bonus/Penalty"
              onChange={handleChangeRollForm}
            />
            <button type="submit" className="btn btn-primary">
              Roll!
            </button>
            {errors.playerId && (
              <div className="alert alert-danger">{errors.playerId}</div>
            )}
            {errors.dieFace && (
              <div className="alert alert-danger">{errors.dieFace}</div>
            )}
            {errors.quantity && (
              <div className="alert alert-danger">{errors.quantity}</div>
            )}
          </form>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <h5 className="card-title">Last rolls: </h5>
          {rolls.length > 0 ? (
            <div className="card-text">
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
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

SessionRunPage.propTypes = {
  sessionActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
  rollActions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  sessions: PropTypes.array.isRequired,
  rolls: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired
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
)(SessionRunPage);
