import React from "react";
import { connect } from "react-redux";
import * as playerActions from "../../redux/actions/playerActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import PlayerList from "./PlayerList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class PlayersPage extends React.Component {
  state = {
    redirectToAddPlayerPage: false
  };

  componentDidMount() {
    const { players, actions } = this.props;
    if (players.length === 0) {
      actions.loadPlayers().catch(error => {
        console.log("Loading players failed " + error);
      });
    }
  }

  handleDeletePlayer = player => {
    toast.success("Player deleted");
    this.props.actions.deletePlayer(player).catch(error => {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    });
  };

  render() {
    return (
      <div>
        {this.state.redirectToAddPlayerPage && <Redirect to="/player" />}
        <h2>Players</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <div>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-player"
              onClick={() => this.setState({ redirectToAddPlayerPage: true })}
            >
              Add Player
            </button>
            <PlayerList
              onDeleteClick={this.handleDeletePlayer}
              players={this.props.players}
            />{" "}
          </div>
        )}
      </div>
    );
  }
}

PlayersPage.propTypes = {
  players: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players,
    loading: state.apiCallsInProgress > 0
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
)(PlayersPage);
