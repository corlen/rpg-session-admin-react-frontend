import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sessionActions from "../../redux/actions/sessionActions";
import * as playerActions from "../../redux/actions/playerActions";
import { bindActionCreators } from "redux";
import Spinner from "../common/Spinner";

function ShowSessionPage(props) {
  const { sessions, sessionActions, playerActions, players } = props;

  const [session, setSession] = useState({ ...props.session });

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
  }, [props.session]);

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
                <li>
                  <h6>
                    <mark>Max</mark> rolled 4d10 (<strong>4,8,1,6</strong>) and
                    sum is: <strong>19</strong>. Max value was:{" "}
                    <font color="blue">8</font> and Min value was:{" "}
                    <font color="red">1</font>
                  </h6>
                </li>
                <li>
                  <h6>
                    <mark>Max</mark> rolled 3d6+2 (<strong>2,3,5</strong>) and
                    sum is: <strong>12</strong>. Max value was:{" "}
                    <font color="blue">5</font> and Min value was:{" "}
                    <font color="red">2</font>
                  </h6>
                </li>
                <li>
                  <h6>
                    <mark>Bergson</mark> rolled 3d4 (<strong>1,2,4</strong>) and
                    sum is: <strong>7</strong>. Max value was:{" "}
                    <font color="blue">4</font> and Min value was:{" "}
                    <font color="red">1</font>
                  </h6>
                </li>
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
  session: PropTypes.object.isRequired,
  sessions: PropTypes.array.isRequired,
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
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sessionActions: bindActionCreators(sessionActions, dispatch),
    playerActions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowSessionPage);
