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

    const id = setInterval(() => {
      rollActions.loadRolls(session.id).catch(error => {
        alert("loading rolls failed" + error);
      });
    }, 5000);
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [props.session]);

  function handlePlayerSelectionDefault(e) {
    setPlayerSelected(e.target.value);
  }

  function handleRollSubmit(e) {
    e.preventDefault();
    //if (!formIsValid()) return;
    const roll = {
      dieFace: 10,
      quantity: 3,
      bonusIncrement: -5,
      playerId: 1,
      sessionId: 1
    };
    rollActions.saveRoll(roll).then(() => {
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

  return sessions.length === 0 || players.length === 0 || rolls.length === 0 ? (
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
            <label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
              Player {playerSelected}
            </label>
            <select
              className="custom-select my-1 mr-sm-2"
              id="inlineFormCustomSelectPref"
              defaultValue={playerSelected}
              onChange={handlePlayerSelectionDefault}
            >
              <option value="0">Choose...</option>
              <option value="1">Max</option>
              <option value="2">Bergson</option>
              <option value="3">Bahia</option>
              <option value="4">Walker</option>
              <option value="5">Jânio</option>
              <option value="6">Pedro</option>
            </select>
            <label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref2">
              Dice
            </label>
            <select
              className="custom-select my-1 mr-sm-2"
              id="inlineFormCustomSelectPref2"
            >
              <option defaultValue>Choose...</option>
              <option value="1">d3</option>
              <option value="2">d4</option>
              <option value="3">d6</option>
              <option value="4">d8</option>
              <option value="5">d10</option>
              <option value="6">d12</option>
            </select>
            <label className="sr-only" htmlFor="inlineFormInputName2">
              Qty
            </label>
            <input
              type="text"
              className="form-control form-control-sm mr-2"
              id="inlineFormInputName2"
              placeholder="Qty"
            />
            <label className="sr-only" htmlFor="inlineFormInputName3">
              Bonus/Penalty
            </label>
            <input
              type="text"
              className="form-control form-control-sm mr-2"
              id="inlineFormInputName3"
              placeholder="Bonus/Penalty"
            />
            <button type="submit" className="btn btn-primary">
              Roll!
            </button>
          </form>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <h5 className="card-title">Last rolls: </h5>
          <div className="card-text">
            <ul>
              {rolls.sort(sortRollsByDateRolled).map(roll => {
                return (
                  <li key={roll.id} className="mb-1">
                    <mark>{getPlayerById(players, roll.playerId).name}</mark>{" "}
                    rolled {roll.quantity}d{roll.dieFace} (
                    <strong>{roll.rolledDice.join(", ")}</strong>) and sum is:{" "}
                    <strong>{roll.sum}</strong>. Max value was:{" "}
                    <font color="blue">{roll.maxValue}</font> and Min value was:{" "}
                    <font color="red">{roll.minValue}</font>
                  </li>
                );
              })}
            </ul>
          </div>
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
  console.log(state);
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
