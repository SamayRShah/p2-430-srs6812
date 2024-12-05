import React, { useContext } from "react";
import UserBox from "../components/UserBox.jsx";
import ConnectBox from "../components/ConnectBox.jsx";
import Game from "./Game.jsx";
import { AppContext } from "../context/AppContext.jsx";

const Home = () => {
  const { gameState } = useContext(AppContext);

  const renderGameState = () => {
    switch (gameState) {
      case "home":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col sm:flex-row gap-2">
              <UserBox />
              <ConnectBox />
            </div>
          </div>
        );
      case "game":
        return <Game />;
      default:
        return <div>ERROR</div>;
    }
  };

  return <div className="w-screen h-screen">{renderGameState()}</div>;
};

export default Home;
