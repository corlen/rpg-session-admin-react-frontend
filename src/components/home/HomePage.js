import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="jumbotron">
        <h1>RPG Session Administration</h1>
        <p>Here, you can play RPG with your friends remotely.</p>
        <Link to="about" className="btn btn-primary btn-lg">
          Learn more
        </Link>
      </div>
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title">Welcome!</h5>
          <p className="card-text">
            Here you can create and start immediately to play.
          </p>
          <Link to="sessions" className="btn btn-primary">
            Start a session
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
