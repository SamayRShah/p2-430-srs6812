import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import FormInput from "../components/FormInput.jsx";
import { useToast } from "../context/ToastProvider.jsx";

const Settings = () => {
  const { user } = useContext(AppContext);

  const toast = useToast();
  const navigate = useNavigate();

  const handleError = (error) => {
    toast.open({ message: error, type: "error", timeout: 1000 });
  };

  const handleMsg = (msg) => {
    toast.open({ message: msg, type: "success", timeout: 1000 });
  };
  const handleConnect = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { newPass } = Object.fromEntries(formData.entries());

    if (!newPass || newPass.trim() === "") {
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

    sendPost(e.target.action, { newPass }, (result) => {
      handleMsg(result.message);
    });
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-neutral p-10 rounded-xl flex items-center justify-center w-fit">
        {user ? (
          <form
            onSubmit={(e) => handleConnect(e)}
            className="flex flex-col gap-2"
            action="/change-password"
          >
            <h1 className="text-center text-4xl text-primary font-bold">
              <a href="/" className="btn btn-circle btn-error">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </a>{" "}
              Settings
            </h1>
            <FormInput
              type="text"
              label="Change password"
              placeholder="new password"
              name="newPass"
              required
              maxLength={20}
              value=""
            />
            <button className="btn btn-block btn-primary">
              Change Password
            </button>
          </form>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    </div>
  );
};

export default Settings;
