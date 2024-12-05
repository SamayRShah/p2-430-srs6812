import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput.jsx";
import { useToast } from "../context/ToastProvider.jsx";
import { AppContext } from "../context/AppContext.jsx";

const ConnectBox = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setGameState, setNickname } = useContext(AppContext);

  const handleError = (error) => {
    toast.open({ message: error, type: "error", timeout: 1000 });
  };

  const handleConnect = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { nickname } = Object.fromEntries(formData.entries());

    if (!nickname || nickname.trim() === "") {
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
    <div className="bg-neutral p-4 sm:flex-1 rounded-lg flex items-center justify-center min-w-fit">
      <form
        onSubmit={(e) => handleConnect(e)}
        className="flex flex-col gap-2"
        action="/connect-game"
      >
        <h1 className="text-center text-4xl text-primary font-bold">
          Shooter.io
        </h1>
        <FormInput
          type="text"
          label="enter nickname (min 1 | max 20)"
          placeholder="nickname"
          name="nickname"
          required
          maxLength={20}
          value={user ? user.username : ""}
        />
        <button className="btn btn-block btn-primary">Connect to game</button>
      </form>
    </div>
  );
};

export default ConnectBox;
