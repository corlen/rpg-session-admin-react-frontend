import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SessionList = props => {
  const { sessions } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
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
