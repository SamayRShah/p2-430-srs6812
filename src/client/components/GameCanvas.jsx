import React, { useEffect, useRef, useState } from "react";

const GameCanvas = ({ draw }) => {
  const canvasRef = useRef(null);
  const [resized, setResized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const drp = window.devicePixelRatio || 1;

    // Function to update the canvas size
    const updateCanvasSize = () => {
      const scaleRatio = Math.max(1, 700 / window.innerWidth);
      const canvasWidth =
        drp * canvas.getBoundingClientRect().width * scaleRatio;
      const canvasHeight =
        drp * canvas.getBoundingClientRect().height * scaleRatio;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    // Update canvas size initially
    updateCanvasSize();

    let animationFrameID;

    const drawFrame = () => {
      draw(context);
      animationFrameID = window.requestAnimationFrame(drawFrame);
    };

    drawFrame();

    // Resize event handler
    const handleResize = () => {
      updateCanvasSize();
      setResized((prev) => !prev);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameID);
      window.removeEventListener("resize", handleResize);
    };
  }, [resized]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
    ></canvas>
  );
};

export default GameCanvas;
