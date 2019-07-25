import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PlayerList = props => {
  const { players, onDeleteClick } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {players.map(player => {
          return (
            <tr key={player.id}>
              <td>
                <Link to={"/player/" + player.id}>{player.name}</Link>
              </td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => onDeleteClick(player)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

PlayerList.propTypes = {
  players: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default PlayerList;
