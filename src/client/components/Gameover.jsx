import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput.jsx";
import { useToast } from "../context/ToastProvider.jsx";
import { AppContext } from "../context/AppContext.jsx";

const GameOver = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setGameState, setNickname, nickname } = useContext(AppContext);

  const handleError = (error) => {
    toast.open({ message: error, type: "error", timeout: 1000 });
  };

  const handleConnect = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { nickname2 } = Object.fromEntries(formData.entries());

    if (!nickname2 || nickname2.trim() === "") {
      handleError("Atleast 1 character required");
      return;
    }

    const sendPost = async (url, data, handler) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.redirect) {
        navigate(result.redirect);
      }

      if (result.error) {
        handleError(`errors: ${result.error}`);
        return;
      }

      if (handler) {
        handler(result);
      }
    };

    sendPost(e.target.action, { nickname }, (result) => {
      if (result) {
        setNickname(result);
        setGameState("game");
      }
    });
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-neutral p-4 rounded-lg flex items-center justify-center min-w-fit">
        <form
          onSubmit={(e) => handleConnect(e)}
          className="flex flex-col gap-2"
          action="/connect-game"
        >
          <div>
            <h1 className="text-center text-4xl text-primary font-bold">
              Game Over!
            </h1>
          </div>
          <FormInput
            type="text"
            label="enter nickname (min 1 | max 20)"
            placeholder="nickname"
            name="nickname2"
            required
            maxLength={20}
            value={nickname.nickname || ""}
          />
          <div className="flex flex-row gap-2">
            <button className="flex-1 btn btn-block btn-primary">
              Re-connect to game
            </button>
            <a href="/" className="flex-1 btn btn-block btn-accent">
              Return to Home
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameOver;
