import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as sessionActions from "../../redux/actions/sessionActions";
import * as playerActions from "../../redux/actions/playerActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import SessionForm from "./SessionForm";
import { toast } from "react-toastify";

function ManageSessionPage(props) {
  const { sessions, sessionActions, playerActions, history, players } = props;

  const [session, setSession] = useState({ ...props.session });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

  function handleChange(event) {
    const { name, value } = event.target;
    if (event.target.type === "text") {
      setSession(prevSession => ({
        ...prevSession,
        [name]: value
      }));
    } else if (event.target.type === "select-multiple") {
      const value = Array.from(
        event.target.selectedOptions,
        option => option.value
      );
      setSession(prevSession => ({
        ...prevSession,
        [name]: value
      }));
    }
  }

  function formIsValid() {
    const { description, players } = session;
    const errors = {};
    console.log(session);
    if (!description) errors.description = "Description is required";
    if (!players.length > 0) errors.players = "At least one player is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    console.log("antes de ir pra action", session);
    sessionActions
      .saveSession(session)
      .then(() => {
        toast.success("Session saved");
        history.push("/sessions");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: JSON.parse(error.message).errors });
      });
  }

  return (
    <SessionForm
      players={players}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageSessionPage.propTypes = {
  sessions: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired,
  sessionActions: PropTypes.object.isRequired,
  playerActions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export function getSessionById(sessions, id) {
  return sessions.find(session => session.id === parseInt(id)) || null;
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const newSession = {
    id: null,
    description: "",
    players: []
  };
  const session =
    id && state.sessions.length > 0
      ? getSessionById(state.sessions, id)
      : newSession;
  return {
    session: session,
    sessions: state.sessions,
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
)(ManageSessionPage);
