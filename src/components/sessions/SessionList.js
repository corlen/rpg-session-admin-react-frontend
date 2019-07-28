import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

const SessionList = props => {
  const { sessions } = props;

  const Button = withRouter(({ history, session }) => (
    <button
      type="button"
      className="btn btn-outline-success"
      onClick={() => {
        history.push("/play/" + session.id);
      }}
    >
      Play!
    </button>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {sessions.map(session => {
          return (
            <tr key={session.id}>
              <td>
                <Link to={"/session/" + session.id}>{session.description}</Link>
              </td>
              <td>{new Date(session.createdDate).toLocaleString()}</td>
              <td>
                <Button session={session} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

SessionList.propTypes = {
  sessions: PropTypes.array.isRequired
};

export default SessionList;
