import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const UserBox = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="bg-neutral p-4 sm:flex-1 rounded-lg flex flex-col items-center min-w-fit">
      <h1 className="text-2xl text-neutral-content font-bold w-full">
        Hello,<br></br>
        {user ? user.username : "Guest"}
      </h1>
      <div className="flex flex-row gap-2">
        <a href={`${user ? "/settings" : "/login"}`}>
          <button className="flex-1 btn btn-block btn-accent">
            {user ? "Settings" : "Login"}
          </button>
        </a>
        <a
          href={`${user ? "/logout" : "/signup"}`}
          className="flex-1 btn btn-block btn-error"
        >
          {user ? "Logout" : "Signup"}
        </a>
      </div>
    </div>
  );
};

export default UserBox;
