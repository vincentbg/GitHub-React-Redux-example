import React from "react";
import "./App.css";
import { Repo } from "./features/repo/Repo";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={
            "https://www.lemondeinformatique.fr/it-tour-digital/assets/logmein-logo.png"
          }
          className="App-logo"
          alt="logo"
        />
        <div>
          <h3>Open-Source Contribution Analyser - Data Cruncher Edition </h3>
          <div>Vincent Boily Grant Test for Log Me in</div>
        </div>
      </header>
      <div className="body">
        <Repo />
      </div>
    </div>
  );
}

export default App;
