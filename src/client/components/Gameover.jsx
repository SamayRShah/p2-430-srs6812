import React from "react";

const GameOver = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <div className="bg-neutral p-4 rounded-lg flex flex-col gap-4 items-center justify-center min-w-fit">
      <div>
        <h1 className="text-center text-4xl text-primary font-bold">
          Game Over!
        </h1>
      </div>
      <a href="/" className="btn btn-block btn-accent">
        Return to Home
      </a>
    </div>
  </div>
);

export default GameOver;
