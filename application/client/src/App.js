import "./App.css";
import React, { useEffect, useState } from "react";
import AddVoter from "./components/AddVoter";
import Button from "react-bootstrap/Button";
import Vote from "./components/Vote";
import Query from "./components/Query";
function App() {
  const [view, setView] = useState(0);
  useEffect(() => {}, []);

  const renderView = (param) => {
    switch (param) {
      case 0: {
        return (
          <>
            <h2>Welcome in our voting system, how can we help?</h2>
          </>
        );
      }
      case 1: {
        return (
          <>
            <AddVoter />
          </>
        );
      }
      case 2: {
        return <Vote />;
      }
      case 3: {
        return <Query />;
      }
      case 4: {
        return <></>;
      }

      default:
        return "";
    }
  };

  return (
    <div className="App mt-5">
      <Button
        variant="primary"
        onClick={() => {
          setView(1);
        }}
      >
        Add Voter
      </Button>{" "}
      <Button
        variant="secondary"
        onClick={() => {
          setView(2);
        }}
      >
        Vote
      </Button>{" "}
      <Button
        variant="success"
        onClick={() => {
          setView(3);
        }}
      >
        Query Database
      </Button>{" "}
      <div className="text-center">{renderView(view)}</div>
    </div>
  );
}

export default App;
