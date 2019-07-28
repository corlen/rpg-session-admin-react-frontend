import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import PlayersPage from "./players/PlayersPage";
import SessionsPage from "./sessions/SessionsPage";
import ShowSessionPage from "./sessions/ShowSessionPage";
import ManagePlayerPage from "./players/ManagePlayerPage";
import ManageSessionPage from "./sessions/ManageSessionPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/sessions" component={SessionsPage} />
        <Route path="/session/:id" component={ShowSessionPage} />
        <Route path="/session" component={ManageSessionPage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/player/:id" component={ManagePlayerPage} />
        <Route path="/player" component={ManagePlayerPage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer autoClose={2000} hideProgressBar />
    </div>
  );
}

export default App;
