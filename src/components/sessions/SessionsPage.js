import React from "react";
import { connect } from "react-redux";
import * as sessionActions from "../../redux/actions/sessionActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import SessionList from "./SessionList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";

class SessionsPage extends React.Component {
  state = {
    redirectToAddSessionPage: false
  };

  componentDidMount() {
    const { sessions, actions } = this.props;
    if (sessions.length === 0) {
      actions.loadSessions().catch(error => {
        console.log("Loading sessions failed " + error);
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.redirectToAddSessionPage && <Redirect to="/session" />}
        <h2>Sessions</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <div>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-session"
              onClick={() => this.setState({ redirectToAddSessionPage: true })}
            >
              Add Session
            </button>
            <SessionList sessions={this.props.sessions} />{" "}
          </div>
        )}
      </div>
    );
  }
}

SessionsPage.propTypes = {
  sessions: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    sessions: state.sessions,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionsPage);
