import React, { useContext } from "react";
import { createRoot } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router";
import { io } from "socket.io-client";
import ToastProvider from "./context/ToastProvider.jsx";
import Home from "./pages/Home.jsx";
import AppContextProvider, { AppContext } from "./context/AppContext.jsx";
import Settings from "./pages/Settings.jsx";
import LoginWindow from "./pages/Login.jsx";

const socket = io();

socket.on("connect", () => console.log(`connected on: ${socket.id}`));

const App = () => {
  const { setSocket } = useContext(AppContext);
  setSocket(socket);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginWindow />} />
      <Route path="/signup" element={<LoginWindow pathMode="signup" />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

const init = () => {
  const root = createRoot(document.querySelector("#root"));
  root.render(
    <BrowserRouter>
      <AppContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
};

window.onload = init;

export default App;
