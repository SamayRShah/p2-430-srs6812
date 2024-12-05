import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import { useToast } from "../context/ToastProvider.jsx";
import { AppContext } from "../context/AppContext.jsx";

const modes = {
  login: { url: "/login", label: "Log in" },
  signup: { url: "/signup", label: "Sign up" },
};

const LoginWindow = ({ pathMode = "login" }) => {
  const toast = useToast();
  const [mode, setMode] = useState(modes[pathMode]);
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const handleError = (error) => {
    toast.open({ message: error, type: "error", timeout: 1000 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, pass, pass2 } = Object.fromEntries(formData.entries());

    if (!username || !pass || (!pass2 && mode === modes.signup)) {
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

    const cb = (result) => {
      if (result.account) setUser(result.account);
      navigate("/");
    };

    if (mode === modes.login) {
      sendPost(e.target.action, { username, pass }, cb);
    }
    if (mode === modes.signup) {
      sendPost(e.target.action, { username, pass, pass2 }, cb);
    }
  };

  const switchMode = (newMode) => {
    if (mode !== newMode) setMode(newMode);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col min-w-fit max-w-lg bg-neutral p-4 justify-center items-center gap-4 rounded-3xl">
        <h1 className="text-4xl text-primary font-bold">Shooter.io</h1>
        <div className="p-4 bg-base-100 rounded-xl">
          <div className="flex flex-row gap-2">
            {Object.keys(modes).map((key) => (
              <button
                key={key}
                onClick={() => switchMode(modes[key])}
                className={`btn btn-ghost ${
                  mode === modes[key] ? "btn-active cursor-default" : ""
                }`}
              >
                {modes[key].label}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-1"
            action={mode.url}
          >
            <FormInput
              size="md"
              type="text"
              placeholder="username"
              label="enter username"
              name="username"
              maxLength={12}
              required
            />
            <FormInput
              size="md"
              type="password"
              placeholder="password"
              label="enter password"
              name="pass"
              required
            />
            {mode === modes.signup && (
              <FormInput
                size="md"
                type="password"
                placeholder="re-enter password"
                label="re-enter password"
                name="pass2"
                required
              />
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 btn btn-block btn-primary mt-1"
              >
                {mode.label}
              </button>
              <Link to="/" className="flex-1 btn btn-block btn-accent mt-1">
                Continue as Guest
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginWindow;
