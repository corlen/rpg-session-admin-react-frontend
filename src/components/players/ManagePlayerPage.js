import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as playerActions from "../../redux/actions/playerActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import PlayerForm from "./PlayerForm";
import { toast } from "react-toastify";

function ManagePlayerPage(props) {
  const { players, actions, history } = props;

  const [player, setPlayer] = useState({ ...props.player });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (players.length === 0) {
      actions.loadPlayers().catch(error => {
        console.log("Loading players failed " + error);
      });
    } else {
      setPlayer({ ...props.player });
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      [name]: value
    }));
  }

  function formIsValid() {
    const { name } = player;
    const errors = {};

    if (!name) errors.name = "Name is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    actions
      .savePlayer(player)
      .then(() => {
        toast.success("Player saved");
        history.push("/players");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: JSON.parse(error.message).errors });
      });
  }

  return (
    <PlayerForm
      player={player}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManagePlayerPage.propTypes = {
  players: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export function getPlayerById(players, id) {
  return players.find(player => player.id === parseInt(id)) || null;
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const newPlayer = {
    id: null,
    name: ""
  };
  const player =
    id && state.players.length > 0
      ? getPlayerById(state.players, id)
      : newPlayer;
  return {
    player: player,
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagePlayerPage);
