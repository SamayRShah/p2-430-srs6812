import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Socket-related state
  const [socket, setSocket] = useState(null);

  // Game-related state
  const [gameState, setGameState] = useState("home");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const getUser = async () => {
      fetch("/session", { credentials: "include" })
        .then((response) => {
          if (!response.ok) throw new Error(response);
          return response.json();
        })
        .then((data) => setUser(data ? data.account : null))
        .catch((err) => {
          console.log(err);
          return null;
        });
    };
    getUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        socket,
        setSocket,
        gameState,
        setGameState,
        nickname,
        setNickname,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
